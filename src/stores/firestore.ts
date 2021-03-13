import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

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
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth();
export const firestore = firebase.firestore();