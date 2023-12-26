const axios = require("axios");


exports.getProfile = async (userId, destination) => {
  const access_token = await GetAccessToken(destination)
  const response = await axios({
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.LINE_MESSAGING_API}/profile/${userId}`,
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    },
  })
  return response.data
};

exports.reply = async (destination, token, payload) => {
  const access_token = await GetAccessToken(destination)
  let objectRequest = {
    method: "post",
    url: `${process.env.LINE_MESSAGING_API}/message/reply`,
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      replyToken: token,
      messages: payload
    })
  }
  return axios(objectRequest);
};

async function GetAccessToken(destination) {
  let access_token = '';
  if (destination === process.env.LINE_WEBHOOK_DESTINATION_A) {
    access_token = await issueTokenV3(process.env.LINE_CHANNEL_ID_A, process.env.LINE_CHANNEL_SECRET_A)
  } else if (destination === process.env.LINE_WEBHOOK_DESTINATION_B) {
    access_token = await issueTokenV3(process.env.LINE_CHANNEL_ID_A, process.env.LINE_CHANNEL_SECRET_A)
  }
  return access_token
}

/* 
    Stateless Channel Access Token : 15 minute 
    https://medium.com/linedevth/stateless-channel-access-token-e489dfc210ad
*/
async function issueTokenV3(channelID, channelSecret) {
  let data = qs.stringify({
    'grant_type': 'client_credentials',
    'client_id': channelID,
    'client_secret': channelSecret
  });
  let response = await axios({
    method: 'post',
    maxBodyLength: Infinity,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    url: LINE_MESSAGING_OAUTH_ISSUE_TOKENV3,
    data: data
  })
  return response.data.access_token
}