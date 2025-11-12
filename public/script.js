/**
 * Script principal do frontend da Estação Meteorológica
 * Responsável por atualizar os valores em tempo real via API REST
 */

// Configuração dos campos a serem monitorados
const campos = [
  { id: "temp-mqtt", key: "temp", unidade: "°C" },  // Temperatura
  { id: "umid-mqtt", key: "umid", unidade: "%" },   // Umidade
  { id: "solar-mqtt", key: "solar", unidade: "%" }  // Insolação
];

/**
 * Atualiza os valores dos sensores via API REST
 * Faz requisições para cada campo configurado e atualiza o DOM
 */
function atualizarCamposREST() {
  campos.forEach(({ id, key, unidade }) => {
    const el = document.getElementById(id);
    fetch(`/api/${key}`)  // Modificado para usar caminho relativo
      .then(res => res.json())
      .then(data => {
        if (data && data.valor && el) {
          el.textContent = `${data.valor} ${unidade}`;
        }
      })
      .catch(() => {
        if (el) el.textContent = '--'; // Indica erro na leitura
      });
  });
}

// Atualiza a cada 15 segundos
setInterval(atualizarCamposREST, 15000);
window.addEventListener('DOMContentLoaded', atualizarCamposREST);