const moment = require("moment");
const util = require("util");
const _ = require("lodash");
var path = require("path");
const TAG = `[${path.basename(__filename)}] `;

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {import('express').NextFunction} next
 * @returns
 */
module.exports.LoggerMiddleware = async (req, res, next) => {
  let now = moment();

  let request = {
    method: req?.method,
    path: req?.path,
    params: req?.params,
    query: req?.query,
    body: req?.body,
  };
  if (req.files && req.files != {}) {
    let files = req?.files;
    try {
      files = _.map(files, (file) => {
        return {
          name: file?.name,
          size: file?.size,
        };
      });
      request.file = files;
    } catch (error) {
      console.error(TAG, error);
    }
  }
  console.log(
    `|===> Request: [${req?.socket?.remoteAddress}]`,
    util.inspect(request, { depth: null, colors: true }),
  );

  let body = {};
  const chunks = [];
  const oldEnd = res.end;
  res.end = (chunk) => {
    if (chunk) {
      chunks.push(Buffer.from(chunk));
    }
    body = Buffer.concat(chunks).toString("utf8");
    return oldEnd.call(res, body);
  };

  // logging res
  res.on("finish", async () => {
    const resLog = {};
    resLog.body = body;

    // > 1MB
    if (Buffer.byteLength(JSON.stringify(resLog)) > 1024) {
      try {
        body = JSON.parse(body);
      } catch (error) {
        console.error(TAG, error);
      }
      resLog.body = {
        status: body?.status,
        message: "Too long data!",
      };

      if (_.isArray(body.data)) {
        resLog.body.detail = {
          length: body.data.length,
        };
      } else if (_.isBuffer(body.data)) {
        resLog.body.detail = {
          length: body.data.length,
        };
      } else {
        try {
          resLog.body.detail = Object.keys(body.data);
        } catch (error) {
          console.error(TAG, error);
        }
      }
    }

    console.log(
      `<===| Response [${moment() - now}ms]: ${JSON.stringify(resLog)}`,
    );
  });

  next();
};
