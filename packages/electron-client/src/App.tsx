import { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import Main from './pages/Main';
import Login from './pages/Login';
import { authenticate, listenForTokenDeepLink, setPersistence } from './auth';
import { FirebaseContext } from '@productivity-tracker/common/lib/firestore';


export default function App() {

    const history = useHistory();
    const firebaseConsumer = useContext(FirebaseContext);
    const [loading, setLoading] = useState(false);

    console.log("Rerenderd App.tsx structure");

    useEffect(() => {
        async function setup() {
            await setPersistence(firebaseConsumer, 'local');
            console.log(firebaseConsumer.auth.currentUser)
            if (firebaseConsumer.auth.currentUser) {
                history.push('/user');
            }
        }
        setup();
    }, []);

    useEffect(() => {

        listenForTokenDeepLink(async (token) => {
            console.log("recieved token", token, firebaseConsumer.auth.currentUser)
            // Attempt to authenticate.
            if (!firebaseConsumer.auth.currentUser) {
                await authenticate(token, firebaseConsumer, 
                    (credential) => {
                        console.log("[Info] Authenticated correctly.", credential);
                        history.push('/user');
                    },
                    (error) => {
                        console.error(error);
                        history.push('/login');
                    }  
                );
            }
        });

        firebaseConsumer.auth.onAuthStateChanged((observation) => {
            console.log(observation);
        })

        // listenForAuthChange()
    }, [])

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Switch>
            <Route exact path="/" component={Login}/>
            <Route path="/user" component={Main}/>
        </Switch>
    )
}