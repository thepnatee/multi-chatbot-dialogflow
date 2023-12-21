const { onRequest, } = require("firebase-functions/v2/https");
const line = require('../util/line.util');
const middleware = require('../middlewares/middleware');
const dialogflow = require('../util/dialogflow.util');
const uuid = require('uuid');



/* 
  Dialoflow Cloud Function Gatway 
  Remark : Example Forward Message Event to Dialogflow
*/
exports.forwardDialogflowBasic = onRequest(async (request, response) => {

  if (request.method !== "POST") {
    return response.send(request.method);
  }

  const events = request.body.events
  for (const event of events) {
    if (event.type === "message" && event.message.type === "text") {
      await dialogflow.postToDialogflow(request)
      return response.end();
    }
  }

  return response.send(request.method);

});
/*
  จำลองสถานการณ์ ว่า 
  
  - Webhook-Department A คือ Webhook Server ตัวที่ 1
  - Webhook-Department B คือ Webhook Server ตัวที่ 2 

  ซึ่งทั้งสองตัวจะใช้ Dialogflow SDK : @google-cloud/dialogflow
  ````
  npm install @google-cloud/dialogflow
  ````
  โดยจะใช้ File Credential Service Account จาก https://console.cloud.google.com/

  ข้อดี Dialogflow 1 ตัวสามารถใช้งานได้มากกว่า 1 LINE Chatbot
  ข้อเสีย ไม่สามารถใช้ Custom payload ได้

*/
exports.departmentA = onRequest(async (request, response) => {

  if (request.method !== "POST") {
    return response.send(request.method);
  }

  const destination = request.body.destination
  const events = request.body.events

  for (const event of events) {

    if (event.type === "message" && event.message.type === "text") {

        const userId = event.source.userId
         /* 
            Get Profile 
            https://developers.line.biz/en/reference/messaging-api/#get-profile
         */
        const profile = await line.getProfile(userId,destination)

        /* [IMPORTANT] none Responses custom payload type */
        const resDialogflow = await dialogflow.postToDialogflowWithCredential(event.source.userId, event.message.text, profile.language)
        const resConvert =  await dialogflow.convertFormat(resDialogflow.fulfillmentMessages)
      
        /* 
          reply multi Channel
          require : destination
        */
        await line.reply(destination,event.replyToken, resConvert)
        return response.end();
      }

  }

  return response.send(request.method);

});

exports.departmentB = onRequest(async (request, response) => {

  if (request.method !== "POST") {
    return response.send(request.method);
  }

  const destination = request.body.destination
  const events = request.body.events


  for (const event of events) {


    if (event.type === "message" && event.message.type === "text") {

        const userId = event.source.userId
         /* 
            Get Profile 
            https://developers.line.biz/en/reference/messaging-api/#get-profile
         */
        const profile = await line.getProfile(userId,destination)

        const objDialogflow = {
          "userId": event.source.userId,
          "message": event.message.text,
          "language": profile.language
        }
        /*Request Dialogflow Gateway */

        const resDialogflow = await dialogflow.forwardDialodflow(objDialogflow)
        const resConvert =  await dialogflow.convertFormat(resDialogflow.data.fulfillmentMessages)
         
        /* 
          reply multi LINE Developer Messaging Channel
          require : destination from object webhook 
        */
        await line.reply(destination,event.replyToken, resConvert)
        return response.end();
      }

  }

  return response.send(request.method);

});


/* Dialoflow Cloud Function */
exports.dialogflow = onRequest(async (request, response) => {

  if (request.method !== "POST") {
    return response.send(request.method);
  }

  if (request.headers.authorization !== process.env.DIALOGFLOW_AUTHORIZATION_KEY) {
    return response.status(401).send('Unauthorized');
  }


  // const object = JSON.parse(request.body)
  const object = request.body
  const userId = object.userId || uuid.v4()

  /* [IMPORTANT] none Responses custom payload type */
  const resDialogflow = await dialogflow.postToDialogflowWithCredential(userId, object.message, object.language)
  return response.send(resDialogflow);

});

