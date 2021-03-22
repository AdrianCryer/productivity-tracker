import { useContext, useState } from 'react';
import { BrowserRouter, Route, useHistory } from 'react-router-dom';
import { Button, Space } from 'antd';
import Main from './pages/Main';
import { v4 as uuidv4 } from 'uuid';
import { FirebaseContext } from '@productivity-tracker/common/lib/firestore';
const { shell } = require('electron')


const TestRoot = () => {
    const history = useHistory();
    const firebaseProvider = useContext(FirebaseContext);

    const onSignin = () => {
        const id = uuidv4()

        const oneTimeCodeRef = firebaseProvider.db.ref(`ot-auth-codes/${id}`);
        oneTimeCodeRef.on('value', async snapshot => {
            const authToken = snapshot.val()
            const credential = await firebaseProvider.auth.signInWithCustomToken(authToken);
            console.log("SUCCESS!", credential);
        });

        const googleLink = `/desktop-google-sign-in?ot-auth-code=${id}`;
        shell.openExternal('http://localhost:50022' + googleLink)

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