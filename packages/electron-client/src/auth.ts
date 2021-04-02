import firebase from "firebase/app";
import 'firebase/auth';
import Firebase from "@productivity-tracker/common/lib/firestore";
import { ipcRenderer } from "electron";

const fbDatabaseName    = "firebaseLocalStorageDb";
const fbStorageName     = "firebaseLocalStorage";
const fbStoredUserKey   = "firebase:authUser";


export async function authenticate(
    token: string,
    firebaseConsumer: Firebase,
    onSuccess: (credential: firebase.auth.UserCredential) => void,
    onError: (error: string) => void
) {
    console.log("signing in")
    const credential = await firebaseConsumer.auth.signInWithCustomToken(token);
    if (!credential.user) {
        onError("Authenticated but there was an issue retrieving the user");
        return;
    }

    // Must be online 
    if (credential.user.metadata.creationTime ===  credential.user.metadata.lastSignInTime) {
        try {
            await firebaseConsumer.createUser(credential);
        } catch (error) {
            onError(`Could not synchronise user with the database. You may be 
                    offline or have lost connection.`);
            return;
        }
    }

    onSuccess(credential);
}

export function listenForTokenDeepLink(onReceived: (token: string) => void) {
    ipcRenderer.on('deep-linking-params', (event: any, params: string) => {
        const parsedParams = new URLSearchParams(params);
        let token = (parsedParams.get('auth-token') || "").replace(/\/$/, "");
        if (token) {
            onReceived(token);
        }
    });
}

export async function setPersistence(firebaseConsumer: Firebase, type: 'local' | 'session' | 'none') {
    let persistence = firebase.auth.Auth.Persistence.NONE;
    if (type === 'local')
        persistence = firebase.auth.Auth.Persistence.LOCAL;
    if (type === 'session')
        persistence = firebase.auth.Auth.Persistence.SESSION;
    await firebaseConsumer.auth.setPersistence(persistence);
}

// async function checkForPersistentUser()
// {
//     try {
//         const dbStore = await openObjectStore( fbDatabaseName, fbStorageName )
//         return await getObjectFromStore( dbStore, fbStoredUserKey )
//     }
//     catch (error) {
//         throw( "checkForPersistentUser ERROR, ", error )
//     }
// }


export function listenForAuthChange() {

}