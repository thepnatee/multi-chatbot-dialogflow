# Dialogflow for LINE Chatbot Multi Channel

## Create for Initial Project

1. Create Firebase Project
2. Create Provider & Channel LINE Developer 2 Channel
3. Create Dialogflow Agent
4. Register https://upstash.com/ for Redis

--------------------------------------
   
  Scenario : 

  - Webhook-Department A คือ Webhook Server ตัวที่ 1
  - Webhook-Department B คือ Webhook Server ตัวที่ 2

  ซึ่งทั้งสองตัวจะใช้ Dialogflow SDK : @google-cloud/dialogflow
  ````
  npm install @google-cloud/dialogflow
  ````

  Use file credential : Service Account -> Dialogflow Client API 
  [https://console.cloud.google.com]

  ข้อดี Dialogflow 1 ตัวสามารถใช้งานได้มากกว่า 1 LINE Chatbot
  ข้อเสีย ไม่สามารถใช้ Custom payload ได้

--------------------------------------

## Run Service 

````
npm i
````

````
npm run serve
````

## Redis 
````
https://upstash.com
````

## Generate API Credential Key 
1. APIs & Services
2. Credentials
3. Service Account -> 
  - Name dialogflowAPI
  - Role Dialogflow API Client
  - Save File to Directory functions : dialogflow_key.json
  [IMPORTANT] change name key to dialogflow_key.json


## Deploy

- Check Firebase Tools
- Check Firebase Login
- Check Create Firebase Project
- Check Sync Firebase Project

````
firebase deploy --only functions
````
  
