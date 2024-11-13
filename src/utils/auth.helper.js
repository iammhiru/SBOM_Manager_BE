const rd = require("../services/redis");
const { hashSHA256 } = require("./utils");
const moment = require("moment");

module.exports.setApiSecret = async (userId) => {
  let token = hashSHA256(`${userId}_${moment().unix()}`);
  let key = `${process.env.REDIS_KEY_PREFIX}:User:Session:${userId}`;
  await rd.redis.set(key, token, {
    NX: 60 * 60 * 24,
  });
  return this.getApiSecret(userId);
};

module.exports.getApiSecret = async (userId) => {
  let key = `${process.env.REDIS_KEY_PREFIX}:User:Session:${userId}`;
  var rdApiSecret = await rd.redis.get(key);
  return rdApiSecret;
};

module.exports.setApiSecretAdmin = async (adminId) => {
  let token = hashSHA256(`${adminId}_${moment().unix()}`);
  let key = `${process.env.REDIS_KEY_PREFIX}:Admin:Session:${adminId}`;
  await rd.redis.set(key, token, {
    NX: 60 * 60 * 24,
  });
  return this.getApiSecretAdmin(adminId);
};

module.exports.getApiSecretAdmin = async (adminId) => {
  let key = `${process.env.REDIS_KEY_PREFIX}:Admin:Session:${adminId}`;
  var rdApiSecret = await rd.redis.get(key);
  return rdApiSecret;
};

module.exports.setExpireApiSecretUser = async (id) => {
  let key = `${process.env.REDIS_KEY_PREFIX}:User:Session:${id}`;
  var rdApiSecret = await rd.redis.expire(key, 24 * 60 * 60);
  return rdApiSecret;
};

module.exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000)
    .toString()
    .slice(0, 7);
};

module.exports.generateOTP4Digits = () => {
  return Math.floor(1000 + Math.random() * 900)
    .toString()
    .slice(0, 5);
};
