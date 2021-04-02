import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import firebase from "firebase/app";
import 'firebase/auth';
import App from './App';
import Firebase, { FirebaseContext } from '@productivity-tracker/common/lib/firestore';
import 'antd/dist/antd.css';
import './index.css';

const firebaseHandler = new Firebase();
firebaseHandler.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// Render root
ReactDOM.render(
	<React.StrictMode>
		<FirebaseContext.Provider value={firebaseHandler}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</FirebaseContext.Provider>
	</React.StrictMode>,
	document.getElementById('root')
);