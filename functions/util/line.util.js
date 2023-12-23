const axios = require("axios");
const redis = require('../util/redis.util');


const LINE_MESSAGING_API = process.env.LINE_MESSAGING_API;


exports.getProfile = async (userId,destination) => {

  const access_token = await GetAccessToken(destination)
  /*
    Set Profile LINE to Redis Storage
  */
  const profile = await redis.getJsonObject(userId)
  if (!profile) {
    const response = await axios({
      method: 'get',
      maxBodyLength: Infinity,
      url: `${LINE_MESSAGING_API}/profile/${userId}`,
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
    })

    redis.setJsonObject(userId,response.data)
    return response.data
  } 
  return profile
};

exports.reply = async(destination,token, payload) => {
  const access_token = await GetAccessToken(destination)
  let objectRequest = {
    method: "post",
    url: `${LINE_MESSAGING_API}/message/reply`,
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

/* 
Stateless Channel Access Token : 15 minute 
https://developers.line.biz/en/docs/basics/channel-access-token/#stateless-channel-access-token
*/

async function GetAccessToken(destination) {
  let access_token = '';
  if (destination === process.env.LINE_WEBHOOK_DESTINATION_A) {
    access_token = process.env.LINE_CHANNEL_ACCESS_TOKEN_A;
  } else if (destination === process.env.LINE_WEBHOOK_DESTINATION_B) {
    access_token = process.env.LINE_CHANNEL_ACCESS_TOKEN_B;
  }
  return access_token
}