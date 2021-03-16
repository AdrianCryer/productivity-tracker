const express = require('express');
const http = require('http');
const path = require('path');
const getPort = require('get-port');
const firebase = require('firebase');
require('dotenv').config();

// Setup firebase config
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

(async () => {
    const port = await getPort();
    

    let authServer = express();
    authServer.use(express.static(path.join(__dirname, '')));

    authServer.get('/desktop-google-sign-in', async (req, res) => {
        console.log(req.protocol)
        const provider = new firebase.auth.GoogleAuthProvider();
        
        try {
            const result = await firebase.auth().getRedirectResult();
            console.log(result)
            if (!result || !result.user) {
                firebase.auth().signInWithRedirect(provider)
            } else {
                console.log("Grabbed the user", result.user)
    
                if (!result.user) {
                    return;
                }
                    
                const params = new URLSearchParams(window.location.search)
                const token = await result.user.getIdToken()
                const code = params.get("ot-auth-code")
                const path = `/create-auth-token?ot-auth-code=${code}&id-token=${token}`;
    
                console.log
                const response = await fetch(process.env.REACT_APP_FIREBASE_AUTH_DOMAIN + path);
                await response.json();
            }
        } catch (error) {
            console.log(error)
        }

        // res.sendFile(__dirname + 'index.html');
        // res.send('<div>Could not load auth server.</div>')
    });

    http.createServer(authServer).listen(3007, function() {
        console.log('Express server listening on port', 3007, port);
    });
})();