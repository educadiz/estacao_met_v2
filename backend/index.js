/**
 * Backend principal da Estação Meteorológica
 * Responsável por fornecer uma API REST para acesso aos dados coletados
 */

import express from "express";
import cors from "cors";
import "./mqttHandler.js"; // Inicializa o listener MQTT automaticamente
import { db } from "./firebaseConfig.js";

// Configuração do Express
const app = express();
app.use(cors()); // Permite requisições cross-origin
app.use(express.json()); // Parser para requisições JSON

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

const PORT = 3000;
app.listen(PORT, () => console.log(`[SERVER] Rodando em http://localhost:${PORT}`));
