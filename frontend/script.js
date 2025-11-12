/**
 * Script principal do frontend da Estação Meteorológica
 * Responsável por atualizar os valores em tempo real via API REST
 */

// Configuração dos campos a serem monitorados
const campos = [
  { id: "temp-mqtt", key: "temp", unidade: "°C" },
  { id: "umid-mqtt", key: "umid", unidade: "%" },
  { id: "solar-mqtt", key: "solar", unidade: "%" },
  { id: "chuva-value", key: "chuva", unidade: "" },
  { id: "alerta-value", key: "alerta", unidade: "" }
];

/**
 * Atualiza os valores dos sensores via API REST
 * Faz requisições para cada campo configurado e atualiza o DOM
 */
function atualizarCamposREST() {
  const IP_DO_HOST = "https://zany-palm-tree-5gxgj7qxpp97cp4rp-3000.app.github.dev";
  let ultimoTimestamp = null;
  let alertaStatus = null;
  let tempValor = null;

  const promessas = campos.map(({ id, key, unidade }) => {
    const el = document.getElementById(id);
    return fetch(`${IP_DO_HOST}/api/${key}`)
      .then(res => {
        if (!res.ok) throw new Error("Sem dados");
        return res.json();
      })
      .then(data => {
        if (data && data.valor !== undefined && el) {
          if (key === "alerta") {
            alertaStatus = (data.valor === "ON") ? "on" : "off";
            el.textContent = (alertaStatus === "on") ? "Normal" : "Ativo";
          } else if (key === "chuva") {
            el.textContent = (data.valor && data.valor.toLowerCase() === "sem chuva") ? "Não" : "Sim";
          } else if (key === "temp") {
            tempValor = `${data.valor} ${unidade}`;
            el.textContent = tempValor;
          } else {
            el.textContent = `${data.valor} ${unidade}`;
          }
          if (data.timestamp && (!ultimoTimestamp || data.timestamp > ultimoTimestamp)) {
            ultimoTimestamp = data.timestamp;
          }
        } else {
          if (el) el.textContent = '--';
        }
      })
      .catch(() => {
        if (el) el.textContent = '--';
      });
  });

  Promise.all(promessas).then(() => {
    // Atualiza cor do campo de temperatura conforme alerta
    const tempEl = document.getElementById("temp-mqtt");
    if (tempEl) {
      tempEl.classList.remove("temp-alert-on", "temp-alert-off");
      if (alertaStatus !== "on") {
        tempEl.classList.add("temp-alert-on");
      } else if (alertaStatus === "off") {
        tempEl.classList.add("temp-alert-off");
      }
    }
    // Atualiza timestamp global
    const tsEl = document.getElementById("global-timestamp");
    if (tsEl) {
      if (ultimoTimestamp) {
        const dt = new Date(ultimoTimestamp);
        tsEl.textContent = `Última atualização: ${dt.toLocaleTimeString("pt-BR")}`;
      } else {
        tsEl.textContent = "Sem dados recentes";
      }
    }
  });
}

// Atualiza a cada 5 segundos para maior responsividade
setInterval(atualizarCamposREST, 5000);
window.addEventListener('DOMContentLoaded', atualizarCamposREST);
