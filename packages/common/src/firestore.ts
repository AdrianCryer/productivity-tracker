import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';
import { createContext } from "react";

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
}

export const FirebaseContext = createContext<Firebase>({} as Firebase);
export default Firebase;
    