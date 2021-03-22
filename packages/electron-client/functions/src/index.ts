import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import "firebase-functions";
import * as cors from "cors";

const createCorsRequest = cors({origin: true});

// const serviceAccount = require('./serviceAccount.json');

// const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
// adminConfig.credential = admin.credential.cert(serviceAccount);

admin.initializeApp();

exports.createAuthToken = functions.https.onRequest((request, response) => {
  console.log(process.env.FIREBASE_CONFIG);
  createCorsRequest(request, response, async () => {
    const query = request.query;
    const oneTimeCode = query["ot-auth-code"];
    const idToken = query["id-token"] as string;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const authToken = await admin.auth().createCustomToken(uid);

    console.log("Authentication Token", authToken);

    await admin.database().ref(`ot-auth-codes/${oneTimeCode}`).set(authToken);

    response.set('Access-Control-Allow-Origin', '*');
    return response.status(200).send({
      token: authToken,
    });
  });
});
