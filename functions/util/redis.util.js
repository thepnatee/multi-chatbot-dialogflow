const redis = require('redis');
const expirationInSeconds = 3600; // 1 hour


const client = redis.createClient ({
  url : process.env.REDIS_URL
});

client.on("error", function(err) {
  throw err;
});

exports.setJsonObject = async (key, value) => {
  try {
  
    await client.connect()

    const setResult = await client.json.set(key,'$', value)
    await client.expire(key, expirationInSeconds)

    return setResult;

  }finally{
    await client.disconnect();
  }

}
exports.getJsonObject = async (key, value) => {
  try {

    await client.connect()
    const getResult = await client.json.get(key,'$',value)

    return getResult

  }finally{
    await client.disconnect();
  }
}