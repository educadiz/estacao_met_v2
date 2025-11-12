/**
 * Manipulador MQTT para a Estação Meteorológica
 * Responsável por se conectar ao broker MQTT e armazenar dados no Firebase
 */

import * as functions from 'firebase-functions';
import mqtt from "mqtt";
import { db } from "./firebaseConfig.js";

const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

const topics = [
  "est_01/temp",   // Temperatura
  "est_01/umid",   // Umidade
  "est_01/chuva",  // Sensor de chuva
  "est_01/solar",  // Insolação
  "est_01/alerta"  // Alertas do sistema
];

// Função que será executada quando uma nova mensagem chegar
export const processaMensagemMQTT = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {
  client.on("connect", () => {
    console.log("[MQTT] Conectado ao broker!");
    client.subscribe(topics, (err) => {
      if (err) console.error("[MQTT] Falha ao se inscrever:", err);
      else console.log("[MQTT] Inscrito nos tópicos:", topics);
    });
  });

  client.on("message", (topic, message) => {
    const valor = message.toString();
    const timestamp = Date.now();

    let campo = topic.split("/")[1];
    console.log(`[MQTT] ${campo}: ${valor}`);

    db.ref(`leituras/${campo}`).set({
      valor,
      timestamp
    });

    db.ref(`leituras_geral/${timestamp}`).set({
      [campo]: valor
    });
  });
});