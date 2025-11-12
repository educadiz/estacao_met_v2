# Estação Meteorológica Cangaceiros 🌤️

Sistema de monitoramento em tempo real de condições climáticas, incluindo temperatura, umidade, insolação e detecção de chuva.

## Estrutura do Projeto

O projeto está dividido em três partes principais:

### Frontend (pasta /public)
- HTML5, CSS3 e JavaScript puro
- Interface responsiva com cards de monitoramento
- Gráficos via ThingSpeak
- Atualização em tempo real dos dados

### Backend (pasta /functions)
- Cloud Functions do Firebase
- MQTT para recebimento de dados dos sensores
- Firebase Realtime Database para armazenamento
- API REST para acesso aos dados

### Firebase Hosting
- Hospedagem do frontend
- Integração com Cloud Functions para o backend
- Roteamento automático de requisições API

## Requisitos

- Node.js 18+ instalado
- Firebase CLI instalado (`npm install -g firebase-tools`)
- Conta no Firebase com os seguintes serviços habilitados:
  - Hosting
  - Cloud Functions
  - Realtime Database
- Arquivo de credenciais do Firebase (`serviceAccountKey.json`)
- Conexão com broker MQTT (HiveMQ)

## Configuração

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
```

2. Configure o Firebase:
```bash
# Faça login no Firebase
firebase login

# Inicialize o projeto (se ainda não estiver configurado)
firebase init

# Selecione Hosting e Functions quando perguntado
```

3. Configure o backend:
```bash
cd functions
npm install
# Adicione o arquivo serviceAccountKey.json na pasta functions
```

4. Configure as variáveis de ambiente (se necessário):
```bash
cd functions
firebase functions:config:set mqtt.broker="broker.hivemq.com"
```

## Deploy

Para fazer o deploy completo da aplicação:

```bash
# Deploy de tudo (hosting e functions)
firebase deploy

# Deploy apenas do frontend
firebase deploy --only hosting

# Deploy apenas do backend
firebase deploy --only functions
```

## Desenvolvimento Local

1. Para testar as Cloud Functions localmente:
```bash
cd functions
npm run serve
```

2. Para testar o frontend localmente:
```bash
firebase serve --only hosting
```

## Estrutura de Tópicos MQTT

- `est_01/temp` - Temperatura (°C)
- `est_01/umid` - Umidade (%)
- `est_01/chuva` - Detecção de Chuva
- `est_01/solar` - Nível de Insolação (%)
- `est_01/alerta` - Alertas do Sistema

## API REST

Endpoints disponíveis:

- `GET /api/temp` - Última leitura de temperatura
- `GET /api/umid` - Última leitura de umidade
- `GET /api/solar` - Última leitura de insolação
- `GET /api/chuva` - Estado do sensor de chuva
- `GET /api/alerta` - Últimos alertas do sistema

## Arquitetura do Sistema

```
Sensores → Broker MQTT → Cloud Functions → Firebase Database
                                        ↑
                      Frontend (Hosting) → API REST
```

## Monitoramento e Logs

Para visualizar os logs das Cloud Functions:
```bash
firebase functions:log
```

Para monitorar o uso:
- Acesse o Console do Firebase
- Vá para a seção de Cloud Functions
- Verifique métricas de uso e desempenho

## Segurança

- As credenciais do Firebase devem ser mantidas seguras
- O arquivo `serviceAccountKey.json` não deve ser versionado
- Considere adicionar autenticação à API REST em produção
- Configure regras de segurança no Realtime Database

## Suporte

Para questões e suporte:
1. Verifique os logs no Firebase Console
2. Consulte a documentação do Firebase
3. Abra uma issue no repositório do projeto
