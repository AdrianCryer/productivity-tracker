import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import "firebase-functions";

admin.initializeApp();

exports.createAuthToken = functions.https.onRequest(
    async (request, response) => {
      const query = request.query;
      const idToken = query["id-token"] as string;
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;
      const authToken = await admin.auth().createCustomToken(uid);

      response.set("Access-Control-Allow-Origin", "*");
      response.header("Access-Control-Allow-Headers", "X-Requested-With");
      response.status(200).send({
        token: authToken,
      });
    }
);
