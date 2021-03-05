import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebase from 'firebase';

// Setup firebase
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "productivity-tracker-bf103.firebaseapp.com",
    projectId: "productivity-tracker-bf103",
    storageBucket: "productivity-tracker-bf103.appspot.com",
    messagingSenderId: "679387791069",
    appId: "1:679387791069:web:c16ea34ee597193ada6534",
    measurementId: "G-1XJ4DSXYDQ"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Render root
ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
);