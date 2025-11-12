# Estação Meteorológica Cangaceiros 🌤️

Sistema de monitoramento em tempo real de condições climáticas (temperatura, umidade, insolação, detecção de chuva e alertas). Frontend estático servido via Firebase Hosting; backend por Cloud Functions que consome mensagens MQTT e grava no Firebase Realtime Database. API REST pública interna para consumo dos dados.

Sumário
- Visão geral
- Estrutura do projeto
- Requisitos e dependências
- Configuração e variáveis de ambiente
- Inicialização local (desenvolvimento)
- Arquitetura e fluxo de dados
- Tópicos MQTT
- Endpoints REST (exemplos)
- Deploy
- Boas práticas de segurança
- Troubleshooting rápido

Visão geral
O sistema recebe leituras de sensores através de um broker MQTT (ex.: broker.hivemq.com), processa-as em Cloud Functions (subscrevendo tópicos MQTT), grava leituras e alertas no Realtime Database e expõe endpoints REST para o frontend e consumidores externos. O frontend é uma SPA simples (HTML/CSS/JS) com cards e gráficos.

Estrutura do projeto
- /public — frontend (HTML, CSS, JS)
- /functions — backend (Cloud Functions Node.js)
- /firebase.json, .firebaserc — configuração de hosting e functions
- README.md — documentação

Requisitos e dependências
- Sistema: Ubuntu 24.04 (container dev)
- Node.js 18+ (recomendado 18.x ou 20.x compatível com Firebase Functions)
- npm ou pnpm
- Firebase CLI: `npm install -g firebase-tools`
- Conta Firebase com: Hosting, Cloud Functions e Realtime Database habilitados
- Broker MQTT (ex.: HiveMQ) acessível a partir das Cloud Functions ou de um cliente local
- Arquivo de credenciais da conta de serviço (serviceAccountKey.json) — não versionar

Dependências típicas (no folder functions)
- firebase-admin
- firebase-functions
- mqtt (ou outra lib MQTT)
- express (para roteamento REST se usado)
Instale em functions:
```bash
cd functions
npm install firebase-admin firebase-functions mqtt express
```

Configuração e variáveis de ambiente
- serviceAccountKey.json: colocar em /workspaces/estacao_met_v2/functions (NÃO comitar).
- Variáveis Firebase Functions (exemplo):
```bash
firebase functions:config:set mqtt.broker="broker.hivemq.com" mqtt.port=1883 mqtt.topicPrefix="est_01"
```
- Para chaves sensíveis preferir `firebase functions:config:set` e não armazenar em VCS.
- Se usar outros serviços (API keys, ThingSpeak), configure via functions:config.

Inicialização local (desenvolvimento)
1. Clone o repositório:
```bash
git clone <URL_DO_REPOSITORIO>
cd estacao_met_v2
```
2. Instale dependências:
```bash
# Raiz (se houver)
npm install
# Backend
cd functions
npm install
```
3. Emular/rodar Functions localmente:
- Usando Firebase Emulator Suite:
```bash
# No workspace raiz
firebase emulators:start --only functions,hosting
```
- Ou, se houver script:
```bash
cd functions
npm run serve
```
4. Testar frontend localmente:
```bash
firebase serve --only hosting
# ou use emulators:start conforme acima
```
5. Para abrir uma URL do host a partir do container dev use:
```bash
"$BROWSER" http://localhost:5000
```

Arquitetura e fluxo de dados
Sensores → Broker MQTT → (Cloud Functions / serviço MQTT) → Realtime Database ← Frontend / API REST  
- As Functions consomem mensagens MQTT, validam payloads, gravam leituras em paths do Realtime Database e geram alertas conforme regras.
- O frontend consulta a API REST (Cloud Functions HTTP) ou lê diretamente o Realtime Database para atualizar a UI em tempo real.

Tópicos MQTT usados
- est_01/temp — Temperatura (°C) — payload numérico ou JSON { "value": 22.5, "ts": 167... }
- est_01/umid — Umidade (%) 
- est_01/solar — Insolação (%) 
- est_01/chuva — Sensor de chuva (0/1 ou boolean)
- est_01/alerta — Alertas do sistema (strings/JSON)
Observação: ajustar prefixo de tópico via variáveis mqtt.topicPrefix.

Formato de dados (recomendado)
- Mensagens simples:
  - temperatura: "22.5"
  - chuva: "1"
- Mensagens JSON (mais robusto):
  { "sensor": "temp", "value": 22.5, "unit": "C", "ts": 1699999999000 }

Paths no Realtime Database (exemplo)
- /readings/est_01/temperature/latest
- /readings/est_01/humidity/latest
- /readings/est_01/solar/latest
- /readings/est_01/rain/latest
- /alerts/est_01/ (lista de alertas)

Endpoints REST (exemplos)
- GET /api/temp → último valor de temperatura
- GET /api/umid → último valor de umidade
- GET /api/solar → último valor de insolação
- GET /api/chuva → estado atual do sensor de chuva
- GET /api/alerta → últimos N alertas
Exemplo com curl:
```bash
curl https://<SEU_HOSTING>.web.app/api/temp
```
(As rotas são implementadas em functions/ como HTTP functions ou via Express)

Deploy
1. Login e inicialização Firebase:
```bash
firebase login
firebase init   # selecione Hosting e Functions
```
2. Adicione `serviceAccountKey.json` em functions (localmente).
3. Realize deploy:
```bash
# Deploy de hosting e functions
firebase deploy

# Deploy apenas hosting
firebase deploy --only hosting

# Deploy apenas functions
firebase deploy --only functions
```

Boas práticas de segurança
- Nunca versionar serviceAccountKey.json.
- Use `firebase functions:config:set` para segredos.
- Configure regras do Realtime Database para restringir leituras/escritas.
- Considere autenticação (Firebase Auth) para rotas que precisem de proteção.
- Habilite logging e monitoramento no Firebase Console.

Dicas de desenvolvimento
- Valide payloads MQTT antes de gravar (tipos, ranges).
- Normalize timestamps (use UTC / UNIX epoch ms).
- Crie regras de retenção e agregação se a base de dados receber muitas leituras.
- Para testes locais de MQTT, use clientes como mosquitto_pub, mqtt-explorer ou pequenas scripts Node.js.

Troubleshooting rápido
- Erro de permissão ao gravar DB: verifique serviceAccountKey.json e configurações do Firebase Admin.
- Functions não conectam ao broker MQTT: verifique regras de rede, porta e se o broker permite conexões do ambiente de execução.
- Logs: `firebase functions:log` ou via Console do Firebase.

Suporte
- Verifique logs no Firebase Console → Cloud Functions
- Consulte a documentação oficial do Firebase
- Abra uma issue no repositório com detalhes e logs relevantes

Licença e Contribuição
- Adicione informações de licença conforme política do seu projeto (ex.: MIT)
- Inclua guia de contribuição (CONTRIBUTING.md) se for um projeto colaborativo
