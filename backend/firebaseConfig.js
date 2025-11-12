/**
 * Configuração do Firebase Admin SDK
 * Responsável pela conexão com o Firebase Realtime Database
 * Requer arquivo serviceAccountKey.json com as credenciais do projeto
 */

import admin from "firebase-admin";
import { readFileSync } from "fs";

// Carrega as credenciais do serviço do Firebase
const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf8")
);

// Inicializa o SDK do Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://estacao2-bcaf8-default-rtdb.firebaseio.com/"
});

export const db = admin.database();
