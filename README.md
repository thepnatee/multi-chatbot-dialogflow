# Dialogflow for LINE Chatbot Multi Channel


## Create for Initial Project

1. Create Firebase Project : 
   https://console.firebase.google.com
2. Create Provider & Channel LINE Developer 2 Channel : 
   https://developers.line.biz/en/
3. Create Dialogflow Agent
   https://dialogflow.cloud.google.com/
4. Create GitHub Repository
   https://github.com/

--------------------------------------
   
  Scenario : 

  - Webhook-Department A คือ Webhook Server ตัวที่ 1
  - Webhook-Department B คือ Webhook Server ตัวที่ 2 ที่ต้องการเรีกย API Dialogflow ตัวเดียวกับ Partment A

  ซึ่งจะใช้ Dialogflow SDK : @google-cloud/dialogflow
  ````
  npm install @google-cloud/dialogflow
  ````

  Use file credential : Service Account -> Dialogflow Client API 
  [https://console.cloud.google.com]

  * ข้อดี Dialogflow 1 ตัวสามารถใช้งานได้มากกว่า 1 LINE Chatbot
  * ข้อเสีย ไม่สามารถใช้ Custom payload ได้

--------------------------------------
## Generate API Credential Key 
1. APIs & Services
2. Credentials
3. Service Account -> 
  - Name dialogflowAPI
  - Role Dialogflow API Client
  - Save File to Directory functions : dialogflow_key.json
--------------------------------------
## แก้ไข .Env
```sh
mv .env.demo .env
```
--------------------------------------

## Run Service 

Installation Dependencies
```sh
npm install
```

Run Firebase Emulators
```sh
npm run serve
```
--------------------------------------

## Generate API Credential Key 
1. APIs & Services
2. Credentials
3. Service Account -> 
  - Name dialogflowAPI
  - Role Dialogflow API Client
  - Save File to Directory functions : dialogflow_key.json
--------------------------------------

## Deploy Cloud Functions

- Check Firebase Tools
```sh
npm install -f firebase-tools
```
- Check Firebase Login
```sh
firebase login
```
- Check Firebase Project
```
multi-chatbot-dialogflow
```

- Deploy
```sh
firebase deploy --only functions
```
--------------------------------------
## Deploy With Github Action

  Setting -> Actions secrets and variables -> New Repository secrets
  1. Create Key FIREBASE_TOKEN and Value from firebase login:ci
  2. Create Key DIALOGFLOW_KEY and Value from  dialogflow_key.json


--------------------------------------

Author 
Thepnatee Phojan - LINE API Expert Thailand [medium](https://medium.com/@thepnateephojan)


