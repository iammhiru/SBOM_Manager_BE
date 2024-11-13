var { createClient } = require("redis");
var path = require("path");
const TAG = `[${path.basename(__filename)}] `;
module.exports.initRedis = async () => {
  console.log(`Init Redis: ${process.env.REDIS_URL}`)
  module.exports.redis = await createClient({ url: process.env.REDIS_URL })
    .on("error", (err) => console.error(TAG, `Redis Client Error`, err))
    .on("connect", () => {
      console.log(TAG, `Connected to redis server ${process.env.REDIS_URL}`);
    })
    .connect();
}
