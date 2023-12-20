
const dialogflow = require('@google-cloud/dialogflow');
const axios = require("axios");

// --------------

// Dialogflow with SDK
exports.postToDialogflowWithCredential = async (userId, message, language) => {
  // A unique identifier for the given session
  const sessionId = userId;
  const projectId = process.env.DIALOGFLOW_PROJECT_ID;
  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
    projectId,
    keyFilename: 'credential/dialogflow_key.json',
  });
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: message,
        // The language used by the client (en-US)
        languageCode: (language === 'en') ? "en-US" : "th-TH",
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
  return result
}


// Dialogflow Forward API
exports.postToDialogflow = async (req) => {
  req.headers.host = "dialogflow.cloud.google.com";
  // console.log(req);
  return axios({
    url: `https://dialogflow.cloud.google.com/v1/integrations/line/webhook/${process.env.DIALOGFLOW_AGENT_ID}`,
    headers: req.headers,
    method: "post",
    data: req.body
  });
};

// --------------

/* Dialogflow Gateway (Core API)*/
exports.forwardDialodflow = async(object) => {

  let data = JSON.stringify(object);

  return axios({
    method: 'post',
    maxBodyLength: Infinity,
    url: `${process.env.DIALOGFLOW_API}`,
    headers: { 
      'Authorization': `${process.env.DIALOGFLOW_AUTHORIZATION_KEY}`, 
      'Content-Type': 'application/json'
    },
    data : data
  });
};

/*
  Dialogflow Response LINE : Text , Image , Quick Replies
*/ 
exports.convertFormat = async (fulfillmentMessages) => {
  let resMessage = []
  for (const obj of fulfillmentMessages) {

    // console.log(JSON.stringify(obj));

    let msg = {};
       if (obj.platform === "LINE") {

          if (obj.hasOwnProperty("image")) {
            msg = {
              "type": "image",
              "previewImageUrl": obj.image.imageUri,
              "originalContentUrl": obj.image.imageUri,
            };
          } else if (obj.hasOwnProperty("text")) {
            msg = {
              "type": "text",
              "text": obj.text.text[0]
            };
          } else if (obj.hasOwnProperty("quickReplies")) {
            let items = []
            obj.quickReplies.quickReplies.forEach((item) => {
              let obj = {
                "type": "action",
                "action": {
                  "type": "message",
                  "label": item,
                  "text": item
                }
              }
              items.push(obj)
            });

            msg = {
              "type": "text",
              "text": obj.quickReplies.title,
              "quickReply": {
                "items" : items
              }
            };
          } else if (obj.hasOwnProperty("card")) {
            let actions = []

            // console.log(obj.card);

            obj.card.buttons.forEach(element => {
              let objectTemplate = {
                "type": "message",
                "label": element.text,
                "text": element.postback
              }
              actions.push(objectTemplate)
            });
            msg = {
              "type": "template",
              "altText": obj.card.title,
              "template": {
                "type": "buttons",
                "thumbnailImageUrl": obj.card.imageUri,
                "title": obj.card.title,
                "text": obj.card.subtitle,
                "actions": actions
              }
            }


          }
      }
    resMessage.push(msg)
  }

  return resMessage.filter(obj => Object.keys(obj).length !== 0)
}

