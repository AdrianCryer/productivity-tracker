import { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, useHistory } from 'react-router-dom';
import { Button, Space } from 'antd';
import Main from './pages/Main';
import firebase from 'firebase';
import { v4 as uuidv4 } from 'uuid';
import { FirebaseContext } from './stores/firestore';
const { shell } = require('electron')

const GoogleLoginPage = () => {
    // const fb = useContext(FirebaseContext);

    useEffect(() => {

        
        // const provider = new firebase.auth.GoogleAuthProvider();
        // firebase.auth().signInWithRedirect(provider);
        const provider = new firebase.auth.GoogleAuthProvider()

        async function getUser() {
            const result = await firebase.auth().getRedirectResult();
            console.log(result)
            if (!result || !result.user) {
                // fb.signInWithGoogle();
                firebase.auth().signInWithRedirect(provider)
            } else {
                console.log("Grabbed the user", result.user)
    
                if (!result.user) {
                    return;
                }
                    
                const params = new URLSearchParams(window.location.search)
    
                const token = await result.user.getIdToken()
                const code = params.get("ot-auth-code")
    
                const response = await fetch(`${process.env.REACT_APP_FIREBASE_AUTH_DOMAIN}/create-auth-token?ot-auth-code=${code}&id-token=${token}`)
                await response.json()
            }
        }

        getUser();
    }, []);

    return <div>Could not load.</div>;
}


const TestRoot = () => {
    const history = useHistory();

    const onSignin = () => {
        const id = uuidv4()

        const oneTimeCodeRef = firebase.database().ref(`ot-auth-codes/${id}`);
        oneTimeCodeRef.on('value', async snapshot => {
            const authToken = snapshot.val()
            const credential = await firebase.auth().signInWithCustomToken(authToken);
            console.log("SUCCESS!", credential);
        });

        const googleLink = `/desktop-google-sign-in?ot-auth-code=${id}`;
        // Only if I could do the thing here and redirect.

        shell.openExternal('http://localhost:50022' + googleLink)
        // history.push(googleLink);
        // window.open(googleLink, '_blank');

        // require("shell").openExternal(googleLink);
        
        // signInWithGoogle();
        // history.push("/user");
    };

    const responseGoogle = (response: any) => {
        console.log(response);
    }

    return (
        <Space direction="vertical">
            Main Page
            <Button onClick={onSignin} type="primary" danger>
                Sign in with Google
            </Button>
        </Space>
    )
}

export default function App() {

    const [authenticated, setAuthenticated] = useState(false);
    
    return (
        <BrowserRouter>
            <Route exact path="/" component={TestRoot}/>
            <Route path="/user" component={Main}/>
            {/* <Route path="/desktop-sign-in" component={GoogleLoginPage}/> */}
        </BrowserRouter>
    )
}