import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";

const createCorsRequest = cors({origin: true});

admin.initializeApp({databaseURL: functions.config().firebase.databaseURL});

exports.createAuthToken = functions.https.onRequest((request, response) => {
  createCorsRequest(request, response, async () => {
    const query = request.query;
    const oneTimeCode = query["ot-auth-code"];
    const idToken = query["id-token"] as string;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const authToken = await admin.auth().createCustomToken(uid);

    console.log("Authentication Token", authToken);

    await admin.database().ref(`ot-auth-codes/${oneTimeCode}`).set(authToken);

    return response.status(200).send({
      token: authToken,
    });
  });
});
