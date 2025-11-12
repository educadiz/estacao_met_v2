/**
 * Configuração do Firebase Admin SDK
 * Responsável pela conexão com o Firebase Realtime Database
 */

import admin from "firebase-admin";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://estacao2-bcaf8-default-rtdb.firebaseio.com/"
});

export const db = admin.database();