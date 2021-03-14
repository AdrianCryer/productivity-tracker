import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { createContext } from "react";

// Setup firebase
const firebaseConfig = {
    apiKey:             process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain:         process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId:          process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket:      "productivity-tracker-bf103.appspot.com",
    messagingSenderId:  "679387791069",
    appId:              "1:679387791069:web:c16ea34ee597193ada6534",
    measurementId:      "G-1XJ4DSXYDQ"
};


class Firebase {
    auth: firebase.auth.Auth;
    store: firebase.firestore.Firestore;

    constructor() {
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();
        
        this.store = firebase.firestore();
        this.auth = firebase.auth();
    }

    signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        this.auth.signInWithRedirect(provider);
    }
}

export const FirebaseContext = createContext<Firebase>({} as Firebase);
export default Firebase;
    