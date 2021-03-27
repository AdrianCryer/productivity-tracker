import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from "firebase/app";
import 'firebase/auth';
import App from './App';
import Firebase, { FirebaseContext } from '@productivity-tracker/common/lib/firestore';

const firebaseHandler = new Firebase();
firebaseHandler.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// Render root
ReactDOM.render(
	<React.StrictMode>
		<FirebaseContext.Provider value={firebaseHandler}>
			<App />
		</FirebaseContext.Provider>
	</React.StrictMode>,
	document.getElementById('root')
);