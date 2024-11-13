var path = require("path");
const TAG = `[${path.basename(__filename)}] `;
const moment = require("moment");
const _ = require("lodash");
const crypto = require("crypto");

exports.responseSuccess = (data = null) => {
  return {
    status: 0,
    data: data,
  };
};
exports.responseFailed = (status, errors = {}) => {
  return {
    status: status,
    errors: errors,
  };
};

/**
 * chỉ dùng cho app
 * @param {number} status
 * @param {Array} errors
 * @returns
 */
exports.appResponseFailed = (status, errors) => {
  if (!Array.isArray(errors)) {
    errors = null;
  }
  return {
    status: status,
    errors: errors,
  };
};

exports.validPhone = (phone) => {
  return phone?.match(/\d/g)?.length === 10;
};
exports.validOTP = (otp) => {
  return otp?.match(/\d/g)?.length === 6;
};

/**
 *
 * @param {any} date
 * @returns
 */
exports.isValidDate = (date) => {
  return (
    moment(date).isValid() &&
    moment(date).isAfter("1900-01-01") &&
    moment(date).isBefore("2100-01-01")
  );
};

/**
 *
 * @param {any} stringify
 * @returns {Boolean}
 */
exports.isValidStringify = (stringify) => {
  try {
    JSON.parse(stringify);
  } catch (error) {
    console.log(TAG, error);
    return false;
  }
  return true;
};

/**
 *
 * @param {String} str
 * @returns {String} hashed text
 */
exports.hashSHA256 = (str) => {
  str = _.toString(str);
  return crypto
    .createHash("sha256")
    .update(str, "utf-8")
    .digest("hex")
    .toString();
};

/**
 *
 * @param {string} username
 * @returns
 */
exports.isValidUsername = (username) => {
  if (!username.length || !username) return false;

  var regExp = /^(?=.*[A-Za-z0-9]).{3,30}$/;
  var noWhiteSpace = /^\S*$/;
  var musHasChar = /[a-zA-Z]/g;

  return (
    regExp.test(username) &&
    noWhiteSpace.test(username) &&
    musHasChar.test(username)
  );
};

/**
 *
 * @param {string} phone
 * @returns
 */
exports.isValidPhone = (phone) => {
  if (!phone || !phone.length) return false;
  let regExp = /^(((?:\+?)84[3|5|7|8|9])|(?:0?)[3|5|7|8|9])+([0-9]{8})$/;

  return regExp.test(phone);
};

/**
 *
 * @param {string} email
 * @returns
 */
exports.isValidEmail = (email) => {
  if (!email.length || !email) return false;

  let regExp = /^\S+@\S+\.\S+$/;

  return regExp.test(email) /* && /[a-zA-Z]/.test(email.split('@')[0]) */;
};
