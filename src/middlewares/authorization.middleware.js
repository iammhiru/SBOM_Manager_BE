var path = require("path");
const TAG = "[" + "midddlewares/" + path.basename(__filename) + "]";
const err = require("../configs/error");
const { responseFailed } = require("../utils/utils.js");
const rd = require("../services/redis.js");
const {
  getUserById,
  getUserByEmail,
  createUser,
} = require("../usecases/users/index.js");
const { getAdminById } = require("../usecases/systemUser/index.js");
// const { oAuth2Client } = require("../services/google.js");
const moment = require("moment");
// const { GAF_TYPE } = require("../const/user.constants.js");

async function checkAuthorizationToken(req, res, next) {
//   let accessToken = req.headers["accesstoken"];
//   if (accessToken) {
//     console.log(TAG, ` - [HTTP] Processing request ${req.path}...`);
//     try {
//       const data = await oAuth2Client.getTokenInfo(accessToken);
//       if (moment(data.expiry_date).isAfter(moment())) {
//         let email = data.email;
//         let user = await getUserByEmail(email);

//         if (user == null) {
//           oAuth2Client.setCredentials({ access_token: accessToken });
//           const res = await oAuth2Client.request({
//             url: process.env.GOOGLE_OAUTH2_USER_INFO,
//           });
//           console.log(res.data);
//           let newUser = {
//             name: res.data?.name,
//             gafId: data?.sub ?? res.data.id,
//             email: data?.email ?? res.data?.email,
//             avatar: res.data?.picture,
//             gafType: GAF_TYPE.GOOGLE,
//           };
//           user = await createUser(newUser);
//         }

//         req.user = user;
//         return next();
//       }
//     } catch (error) {
//       console.error(TAG, err.ERROR_INVALID_ACCESS_TOKEN.description);
//       return res.status(401).json(
//         responseFailed(err.ERROR_INVALID_ACCESS_TOKEN.code, {
//           message: res.__(err.ERROR_INVALID_ACCESS_TOKEN.description),
//         }),
//       );
//     }
//   }

  let token = req.headers["apisecret"];
  console.log(TAG, ` - [HTTP] Processing request ${req.path}...`);
  if (token != null) {
    token = token.trim();

    let userId = req.headers["userid"];

    if (!userId) {
      return res.status(401).json(
        responseFailed(err.ERROR_MISSING_PARAMS.code, {
          message: res.__(err.ERROR_MISSING_PARAMS.description),
        }),
      );
    }

    var rdApiSecret = await rd.redis.get(
      `${process.env.REDIS_KEY_PREFIX}:User:Session:${userId}`,
    );

    if (rdApiSecret == null || rdApiSecret != token) {
      console.error(TAG, err.ERROR_INVALID_ACCESS_TOKEN.description);
      return res.status(401).json(
        responseFailed(err.ERROR_INVALID_ACCESS_TOKEN.code, {
          message: res.__(err.ERROR_INVALID_ACCESS_TOKEN.description),
        }),
      );
    }

    let user = await getUserById(userId);
    if (user == null) {
      return res.status(401).json(
        responseFailed(err.ERROR_USER_NOT_FOUND.code, {
          message: res.__(err.ERROR_USER_NOT_FOUND.description),
        }),
      );
    }

    req.user = user;
    next();
  } else {
    console.log(TAG, err.ERROR_MISSING_ACCESS_TOKEN.description);
    return res.status(401).json(
      responseFailed(err.ERROR_MISSING_ACCESS_TOKEN.code, {
        message: res.__(err.ERROR_MISSING_ACCESS_TOKEN.description),
      }),
    );
  }
}

module.exports.checkAuthorizationToken = checkAuthorizationToken;

async function checkAdminAuthorizationToken(req, res, next) {
  let token = req.headers["apisecret"];
  console.log(TAG, ` - [HTTP] Processing request ${req.path}...`);
  if (token != null) {
    token = token.trim();

    let adminId = req.headers["adminid"];
    if (!adminId) {
      return res.status(401).json(
        responseFailed(err.ERROR_MISSING_PARAMS.code, {
          message: res.__(err.ERROR_MISSING_PARAMS.description),
        }),
      );
    }

    var rdApiSecret = await rd.redis.get(
      `${process.env.REDIS_KEY_PREFIX}:Admin:Session:${adminId}`,
    );
    if (rdApiSecret == null || rdApiSecret != token) {
      console.error(TAG, err.ERROR_INVALID_ACCESS_TOKEN.description);
      return res.status(401).json(
        responseFailed(err.ERROR_INVALID_ACCESS_TOKEN.code, {
          message: res.__(err.ERROR_INVALID_ACCESS_TOKEN.description),
        }),
      );
    }

    let admin = await getAdminById(adminId);
    if (admin == null) {
      console.error(TAG, err.ERROR_USER_NOT_FOUND.description);
      return res.status(401).json(
        responseFailed(err.ERROR_USER_NOT_FOUND.code, {
          message: res.__(err.ERROR_USER_NOT_FOUND.description),
        }),
      );
    }

    req.admin = admin;
    next();
  } else {
    return res.status(401).json(
      responseFailed(err.ERROR_MISSING_ACCESS_TOKEN.code, {
        message: res.__(err.ERROR_MISSING_ACCESS_TOKEN.description),
      }),
    );
  }
}
module.exports.checkAdminAuthorizationToken = checkAdminAuthorizationToken;
