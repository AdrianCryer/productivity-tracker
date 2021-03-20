
import React, { useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import Firebase, { FirebaseContext } from '@productivity-tracker/common/lib/firestore';

const GoogleLoginPage = () => {

    const firebaseHandler = useContext(FirebaseContext);

    useEffect(() => {
        async function getUser() {
            const result = await firebaseHandler.auth.getRedirectResult();
            console.log(result)
            if (!result || !result.user) {
                firebaseHandler.signInWithGoogle();
            } else {
                console.log("Grabbed the user", result.user)
    
                if (!result.user) {
                    return;
                }
                    
                const params = new URLSearchParams(window.location.search)
                const token = await result.user.getIdToken()
                const code = params.get("ot-auth-code")
                const path = `/create-auth-token?ot-auth-code=${code}&id-token=${token}`;
    
                const response = await fetch(process.env.REACT_APP_FIREBASE_AUTH_DOMAIN + path);
                await response.json();
            }
        }

        getUser();
    }, []);

    return <div>Could not load.</div>;
}

// Render root
ReactDOM.render(
	<React.StrictMode>
		<FirebaseContext.Provider value={new Firebase()}>
			<GoogleLoginPage />
		</FirebaseContext.Provider>
	</React.StrictMode>,
	document.getElementById('root')
);