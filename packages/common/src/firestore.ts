import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';
import { createContext } from "react";
import { 
    Activity, 
    Category, 
    Record, 
    PartialActivity, 
    PartialCategory, 
    PartialRecord 
} from "./client-schema";
import {
    OnBatchActivitiesChange, 
    OnBatchCategoryChange, 
    OnBatchRecordsChange
} from "./server-schema";


class Firebase {

    auth: firebase.auth.Auth;
    store: firebase.firestore.Firestore;
    db: firebase.database.Database;
    functions: firebase.functions.Functions;

    constructor(config?: any) {
        if (!config) {
            config = Firebase.getDefaultConfigFromEnv(process.env);
        }
        const fb = firebase.initializeApp(config);
        // fb.analytics();

        this.store = fb.firestore();
        this.auth = fb.auth();
        this.db = fb.database();
        this.functions = fb.functions();
        this.store.enablePersistence()
    }

    static getDefaultConfigFromEnv(env: NodeJS.ProcessEnv) {
        return {
            apiKey: env.REACT_APP_FIREBASE_API_KEY,
            authDomain: env.REACT_APP_FIREBASE_AUTH_DOMAIN,
            projectId: env.REACT_APP_FIREBASE_PROJECT_ID,
            storageBucket: env.REACT_APP_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: env.REACT_APP_FIREBASE_SENDER_ID,
            appId: env.REACT_APP_FIREBASE_APP_ID,
            measurementId: env.REACT_APP_FIREBASE_MEASUREMENT_ID
        };
    }

    signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        this.auth.signInWithRedirect(provider);
    }

    private validateUser = (): string => {
        const currentUser = this.auth.currentUser;
        if (!currentUser) {
            throw new Error(`Could not retrieve user credentials 
                Perhaps the user has been signed out.`);
        }
        return currentUser.uid;
    }

    createUser = (credential: firebase.auth.UserCredential) => {
        if (!credential.user) {
            throw new Error("Could not create user, invalid credential given.");
        }
        return this.store.collection('users').doc(credential.user.uid).set({
            displayName: credential.user.displayName,
            email: credential.user.email
        });
    }

    getUser = () => {
        const uid = this.validateUser();
        return this.store.collection('users').doc(uid);
    }

    getCategories = () => {
        return this.getUser().collection('categories');
    }

    getActivities = () => {
        return this.getUser().collection('activities');
    }

    getRecords = () => {
        return this.getUser().collection('records');
    }

    createCategory = async (category: Omit<Category, 'id'>) => {

        // Check category name first. 
        /** @todo This won't work when offline */
        const categories = await this.getCategories().get();
        if (Object.values(categories).find(c => c.name === category.name)) {
            throw new Error(`Category name '${category.name}' already exists`);
        }

        let id = this.getCategories().doc().id;
        this.getCategories().doc(id).set(category);
        return id;
    }

    editCategory = async (category: PartialCategory) => {
        const { id, ...params } = category;
        return this.getCategories().doc(id).update({ ...params });
    }

    /**
     * Expensive operation. However, not expected to occur frequently. 
     */
    removeCategory = async (category: Category | string) => {
        const id = typeof category === 'string' ? category : category.id;

        // Whole thing should be batched.
        await this.getCategories().doc(id).delete();

        /** Delete activities */
        await this.getActivities().where('categoryId', '==', id).get().then(snap => {
            let batch = this.store.batch();
            snap.forEach(doc => {
                batch.delete(doc.ref);
            });
            return batch.commit();
        });

        /** 
         * Delete records
         * @todo check if number of records is less than 500 as this is a 
         * limitation of firebase.
         */
        return this.getRecords().where('categoryId', '==', id).get().then(snap => {
            let batch = this.store.batch();
            snap.forEach(doc => {
                batch.delete(doc.ref);
            });
            return batch.commit();
        });
    }

    createActivity = async (categoryId: string, activity: Omit<Activity, 'id' | 'records'>) => {

        // Check category name first.
        const activities = await this.getActivities().where('categoryId', '==', categoryId).get();
        if (Object.values(activities).find(a => a.name === activity.name)) {
            throw new Error(`Activity name '${activity.name}' already exists`);
        }

        return this.getActivities().add(activity);
    }

    editActivity = async (activity: PartialActivity) => {
        const { id, ...params } = activity;
        return this.getActivities().doc(id).update(params);
    }

    removeActivity = async (categoryId: string, activity: Activity) => {
        let batch = this.store.batch();
        batch.delete(this.getActivities().doc(activity.id));
        this.getRecords()
            .where('categoryId', '==', categoryId)
            .where('activityId', '==', activity.id)
            .get().then(snap => {
                let batch = this.store.batch();
                snap.forEach(doc => {
                    batch.delete(doc.ref);
                });
            });
        batch.commit();
    }

    mergeAndRemoveActivity = async (activity: Activity, mergeToActivityId: string) => {

    }

    createRecord = async (record: Omit<Record, 'id'>) => {
        // Should really check schema / if it belongs to an activity
        let id = this.getRecords().doc().id;
        this.getRecords().doc(id).set(record);
        return id;
    }

    editRecord = async (record: PartialRecord) => {
        const { id, ...params } = record;
        return this.getRecords().doc(id).update(params);
    }

    removeRecord = async (recordId: string) => {
        return this.getRecords().doc(recordId).delete();
    }

    listenForCategoryUpdates = (onChange: OnBatchCategoryChange) => {
        return this.getCategories().onSnapshot(snap => {
            const changes = snap.docChanges().map(change => ({
                category: {
                    ...change.doc.data() as Omit<Category, 'id'>,
                    id: change.doc.id
                },
                action: change.type
            }));
            onChange(changes);
        });
    }

    listenForActivityUpdates = (onChange: OnBatchActivitiesChange) => {
        return this.getActivities().onSnapshot(snap => {
            const changes = snap.docChanges().map(change => {
                return {
                    activity: {
                        ...change.doc.data() as Omit<Activity, 'id'>,
                        id: change.doc.id
                    } as Activity,
                    action: change.type
                };
            });
            onChange(changes);
        });
    }

    listenForRecordUpdates = (onChange: OnBatchRecordsChange, ) => {
        return this.getRecords().onSnapshot(snap => {
            console.log("snap metadata", snap.metadata);
            // Should I do data casting here?
            const changes = snap.docChanges().map(change => {
                return {
                    record: {
                        ...change.doc.data() as Omit<Record, 'id'>,
                        id: change.doc.id
                    } as Omit<Record, 'data'> & { data: any },
                    action: change.type
                };
            });
            console.log(changes);
            onChange(changes);
        });
    }
}


export const FirebaseContext = createContext<Firebase>({} as Firebase);
export default Firebase;
