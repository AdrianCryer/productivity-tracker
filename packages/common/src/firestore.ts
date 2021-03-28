import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';
import { createContext } from "react";
import { PartialCategory } from "./schema";

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
            throw new Error (`Could not retrieve user credentials 
                Perhaps the user has been signed out.`);
        }
        return currentUser.uid;
    }

    createUser = (credential: firebase.auth.UserCredential) => {
        if (!credential.user) {
            throw new Error("Could not create user, invalid credential given.");
        }
        this.store.collection('users').doc(credential.user.uid).set({
            displayName: credential.user.displayName,
            email: credential.user.email
        });
    }

    getCategories = () => {
        const uid = this.validateUser();
        return this.store.collection('users').doc(uid).collection('categories');
    }

    getActivities = (id: string) => {
        return this.getCategories().doc(id).collection('activities');
    }
    
    createCategory = (category: PartialCategory) => {
        // Check category name first.
        this.getCategories().add({
            name: category.name,
            dateAdded: category.dateAdded,
            colour: category.colour
        });
    }
    
    /** Listen for activity changes. */
    listenForCategoryUpdates = (onChange: (category: PartialCategory) => void) => {
        return this.getCategories().onSnapshot(snap => {
            snap.forEach((doc) => {
                console.log(doc.data())
            });
        });
    }

    // createActivity = (activity: Activity) => {
    //     this.getActivities().onSnapshot(())
    // }
}

export const FirebaseContext = createContext<Firebase>({} as Firebase);
export default Firebase;
    