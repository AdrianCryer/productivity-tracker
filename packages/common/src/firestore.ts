import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';
import { createContext } from "react";
import { Category, PartialCategory } from "./schema";

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
    }

    static getDefaultConfigFromEnv(env: NodeJS.ProcessEnv) {
        return {
            apiKey:             env.REACT_APP_FIREBASE_API_KEY,
            authDomain:         env.REACT_APP_FIREBASE_AUTH_DOMAIN,
            projectId:          env.REACT_APP_FIREBASE_PROJECT_ID,
            storageBucket:      env.REACT_APP_FIREBASE_STORAGE_BUCKET,
            messagingSenderId:  env.REACT_APP_FIREBASE_SENDER_ID,
            appId:              env.REACT_APP_FIREBASE_APP_ID,
            measurementId:      env.REACT_APP_FIREBASE_MEASUREMENT_ID
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

    getCategories = () => {
        const uid = this.validateUser();
        return this.store.collection('users').doc(uid).collection('categories');
    }

    getActivity = (id: string) => {
        return this.getCategories().doc(id).collection('activities');
    }
    
    createCategory = async (category: Omit<Category, 'id' | 'activities'>) => {

        // Check category name first.
        const categories = await this.getCategories().get();
        if (Object.values(categories).find(c => c.name === category.name)) {
            throw new Error(`Category name '${category.name}' already exists`);
        }

        return this.getCategories().add({
            name: category.name,
            dateAdded: category.dateAdded,
            colour: category.colour
        });
    }

    editCategory = async (category: Omit<PartialCategory, 'activities'>) => {
        const { id, ...params } = category;
        return this.getCategories().doc(category.id).update({ ...params });
    }

    removeCategory = async (category: Category | string) => {
        const id = typeof category === 'string' ? category : category.id;
        return this.getCategories().doc(id).delete();
    }
    
    /** Listen for activity changes. */
    listenForCategoryUpdates = (onChange: (category: PartialCategory, action: firebase.firestore.DocumentChangeType) => void) => {
        return this.getCategories().onSnapshot(snap => {
            snap.docChanges().forEach(change => {
                const data = change.doc.data() as PartialCategory;
                onChange({
                    ...data,
                }, change.type);
            })
        });
    }

    listenForActivityUpdates = () => {
        return this.getCategories().onSnapshot(snap => {
            snap.forEach((doc) => {
                console.log(doc.data())
            });
        })
    }

    listenForRecordUpdates = () => {

    }
}


export const FirebaseContext = createContext<Firebase>({} as Firebase);
export default Firebase;
    