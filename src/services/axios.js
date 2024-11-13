var path = require("path");
const TAG = `[${path.basename(__filename)}] `;
const { default: axios } = require("axios");
const axiosRetry = require("axios-retry").default;
const qs = require("qs");

module.exports.axiosClient = (retry = 0) => {
  axios.default.timeout = 30000;
  axiosRetry(axios, {
    retries: retry,
    retryDelay: (retryCount) => {
      return retryCount * 1000;
    },
    // eslint-disable-next-line no-unused-vars
    retryCondition: (axios_error) => {
      return true;
    },
    onRetry: (retryCount, error, requestConfig) => {
      console.error(
        TAG,
        `Axios client retry retryCount:${retryCount},error:${error},requestConfig:${requestConfig}`,
      );
      return;
    },
  });
  return axios;
};

/**
 *
 * @param {Object} config
 * @returns data in response
 */
module.exports.axiosReq = async (config) => {
  if (config?.data) {
    if (config.method === "get") {
      config.url =
        config.url +
        "?" +
        qs.stringify(config?.data, {
          arrayFormat: "indices",
          encode: false,
        });

      console.log("url: ", config.url);
    }
  }

  let result = await axios.request(config);
  if (result?.data?.status !== 0) {
    console.error(TAG, result?.data?.errors?.message);
    return null;
  }
  result = result?.data?.data;
  return result;
};
