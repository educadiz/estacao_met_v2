/**
 * Cloud Functions para Estação Meteorológica
 * Responsável por fornecer uma API REST para acesso aos dados
 */

import * as functions from 'firebase-functions';
import express from "express";
import cors from "cors";
import "./mqttHandler.js";
import { db } from "./firebaseConfig.js";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🌤️ Estação Meteorológica - Backend rodando!");
});

// Rotas REST para dados dos tópicos MQTT
const campos = ["temp", "umid", "solar", "chuva", "alerta"];
campos.forEach((campo) => {
  app.get(`/api/${campo}`, async (req, res) => {
    try {
      const snapshot = await db.ref(`leituras/${campo}`).once("value");
      const data = snapshot.val();
      if (data) {
        res.json({ valor: data.valor, timestamp: data.timestamp });
      } else {
        res.status(404).json({ error: "Sem dados" });
      }
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar dados" });
    }
  });
});

// Exporta a função para o Firebase Cloud Functions
export const api = functions.https.onRequest(app);