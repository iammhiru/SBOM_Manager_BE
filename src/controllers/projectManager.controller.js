var path = require("path");
const TAG = `[${path.basename(__filename)}] `;
const err = require("../configs/error");
const utils = require("../utils/utils");
const {
  getManagerById,
  getManagerByEmail,
  getManagerByPhone,
  getManagerByUsername,
  updateManager,
  createManager,
  activateManagerAccount,
  deleteManager
} = require("../usecases/projectManager");
const {
  setApiSecret,
  setExpireApiSecretUser,
  generateOTP,
  generateOTP4Digits,
} = require("../utils/auth.helper");
// const { oAuth2Client } = require("../services/google");
const { sendEmail } = require("../services/mail");
const {
  DATETIME_FORMAT,
  HUMANIZE_DATETIME_FORMAT,
} = require("../const/common");
const moment = require("moment");

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
module.exports.test = async (req, res) => {
  try {
    await sendEmail({ emails: ["hieuphamsaga@gmail.com"] });
    return res.json({ message: "Users Module ready!!!" });
  } catch (error) {
    console.error(TAG, error);
    return res.json(
      utils.responseFailed(err.ERROR_SERVER_INTERNAL.code, {
        message:
          error?.message ?? res.__(err.ERROR_SERVER_INTERNAL.description),
      }),
    );
  }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
module.exports.register = async (req, res) => {
  try {
    let { username, password, name, email } = req.body;

    if (!email || !password) {
      console.error(TAG, err.ERROR_MISSING_PARAMS.description);
      return res.json(
        utils.responseFailed(err.ERROR_MISSING_PARAMS.code, {
          message: res.__(err.ERROR_MISSING_PARAMS.description),
        }),
      );
    }

    if (username && !utils.isValidUsername(username)) {
      console.error(TAG, err.ERROR_INVALID_PARAMS.description);
      return res.json(
        utils.responseFailed(err.ERROR_INVALID_PARAMS.code, {
          message: res.__(err.ERROR_INVALID_PARAMS.description),
        }),
      );
    }

    if (email && !utils.isValidEmail(email)) {
      console.error(TAG, err.ERROR_INVALID_PARAMS.description);
      return res.json(
        utils.responseFailed(err.ERROR_INVALID_PARAMS.code, {
          message: res.__(err.ERROR_INVALID_PARAMS.description),
        }),
      );
    }

    if (
      (username && (await getManagerByUsername(username))) ||
      (email && (await getManagerByUsername(email)))
    ) {
      console.error(TAG, err.ERROR_USER_EXISTED.description);
      return res.json(
        utils.responseFailed(err.ERROR_USER_EXISTED.code, {
          message: res.__(err.ERROR_USER_EXISTED.description),
        }),
      );
    }

    password = utils.hashSHA256(password);
    let newUser = {
      username,
      password,
      name,
      email,
    };

    newUser = await createManager(newUser);

    return res.json(utils.responseSuccess(newUser));
  } catch (error) {
    console.error(TAG, error);
    return res.json(
      utils.responseFailed(err.ERROR_SERVER_INTERNAL.code, {
        message:
          error?.message ?? res.__(err.ERROR_SERVER_INTERNAL.description),
      }),
    );
  }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
module.exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      console.error(TAG, err.ERROR_MISSING_PARAMS.description);
      return res.json(
        utils.responseFailed(err.ERROR_MISSING_PARAMS.code, {
          message: res.__(err.ERROR_MISSING_PARAMS.description),
        }),
      );
    }

    let user = await getManagerByEmail(email);
    if (!user) {
      console.error(TAG, err.ERROR_USER_NOT_FOUND.description);
      return res.json(
        utils.responseFailed(err.ERROR_USER_NOT_FOUND.code, {
          message: res.__(err.ERROR_USER_NOT_FOUND.description),
        }),
      );
    }

    password = utils.hashSHA256(password);
    if (password !== user.password) {
      console.error(TAG, err.ERROR_WRONG_PASS.description);
      return res.json(
        utils.responseFailed(err.ERROR_WRONG_PASS.code, {
          message: res.__(err.ERROR_WRONG_PASS.description),
        }),
      );
    }

    let apiSecret = await setApiSecret(user.projectManagerId);
    return res.json(utils.responseSuccess({ apiSecret, userId: user.projectManagerId }));
  } catch (error) {
    console.error(TAG, error);
    return res.json(
      utils.responseFailed(err.ERROR_SERVER_INTERNAL.code, {
        message:
          error?.message ?? res.__(err.ERROR_SERVER_INTERNAL.description),
      }),
    );
  }
};

/**
 * Endpoint này sẽ được gọi từ client-side sau khi người dùng đăng nhập thành công với Google và nhận được authorization code.
 * @param {Response} req
 * @param {Request} res
 * @returns
 */
// module.exports.getGoogleUser = async (req, res) => {
//   try {
//     const { code } = req.query;

//     const data = await oAuth2Client.getToken(code);
//     const { access_token } = data.tokens;
//     const googleUser = await oAuth2Client.getTokenInfo(access_token);
//     let email = googleUser.email;

//     let user = await getUserByEmail(email);
//     // let userInfo = oAuth2Client.credentials()
//     if (!user) {
//       let newUser = {
//         email: googleUser.email,
//         gafType: "GOOGLE",
//         gafId: googleUser.sub,
//       };
//       user = await createUser(newUser);
//     }
//     let apiSecret = await setApiSecret(user.userId);
//     setExpireApiSecretUser(user.userId);

//     // redirect về cho client để lưu apisecret và userid
//     return res.redirect(
//       `${process.env.GOOGLE_SUCCESS_REDIRECT_URI}?apiSecret=${apiSecret}&userId=${user.userId}`,
//     );
//   } catch (error) {
//     console.error(TAG, error);
//     return res.json(
//       utils.responseFailed(err.ERROR_SERVER_INTERNAL.code, {
//         message:
//           error?.message ?? res.__(err.ERROR_SERVER_INTERNAL.description),
//       }),
//     );
//   }
// };

/**
 *
 * @param {Response} req
 * @param {Request} res
 * @returns
 */
module.exports.requestResetPassword = async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) {
      console.error(TAG, err.ERROR_MISSING_PARAMS.description);
      return res.json(
        utils.responseFailed(err.ERROR_MISSING_PARAMS.code, {
          message: res.__(err.ERROR_MISSING_PARAMS.description),
        }),
      );
    }

    let user = await getManagerByEmail(email);
    if (!user) {
      console.error(TAG, err.ERROR_USER_NOT_FOUND.description);
      return res.json(
        utils.responseFailed(err.ERROR_USER_NOT_FOUND.code, {
          message: res.__(err.ERROR_USER_NOT_FOUND.description),
        }),
      );
    }

    res.json(utils.responseSuccess());

    let otp = generateOTP();
    console.log("TAG", `OTP: ${otp}`);
    let expirationDate = moment().add(5, "minutes").format(DATETIME_FORMAT);
    let optHash = utils.hashSHA256(otp);

    await updateAdmin(user.organizationAdminId, {
      otp: optHash,
      expiryOtp: expirationDate,
    });

    sendEmail({
      emails: [user.email],
      subject: "Forgot password!",
      text: `OTP: ${otp}, expire at: ${moment(expirationDate).format(HUMANIZE_DATETIME_FORMAT)}`,
    });

    return;
  } catch (error) {
    console.error(TAG, error);
    return res.json(
      utils.responseFailed(err.ERROR_SERVER_INTERNAL.code, {
        message:
          error?.message ?? res.__(err.ERROR_SERVER_INTERNAL.description),
      }),
    );
  }
};

/**
 *
 * @param {Response} req
 * @param {Request} res
 * @returns
 */
module.exports.resetPassword = async (req, res) => {
  try {
    let { email, newPassword, otp } = req.body;
    if (!email || !newPassword || !otp) {
      console.error(TAG, err.ERROR_MISSING_PARAMS.description);
      return res.json(
        utils.responseFailed(err.ERROR_MISSING_PARAMS.code, {
          message: res.__(err.ERROR_MISSING_PARAMS.description),
        }),
      );
    }

    let user = await getManagerByEmail(email);
    if (!user) {
      console.error(TAG, err.ERROR_USER_NOT_FOUND.description);
      return res.json(
        utils.responseFailed(err.ERROR_USER_NOT_FOUND.code, {
          message: res.__(err.ERROR_USER_NOT_FOUND.description),
        }),
      );
    }

    let hashOtp = utils.hashSHA256(otp);
    if (!user.otp || hashOtp !== user.otp) {
      console.error(TAG, err.ERROR_OTP_WRONG.description);
      return res.json(
        utils.responseFailed(err.ERROR_OTP_WRONG.code, {
          message: res.__(err.ERROR_OTP_WRONG.description),
        }),
      );
    }

    if (moment().isAfter(moment(user.expiryOtp))) {
      console.error(TAG, err.ERROR_OTP_EXPIRATION.description);
      return res.json(
        utils.responseFailed(err.ERROR_OTP_EXPIRATION.code, {
          message: res.__(err.ERROR_OTP_EXPIRATION.description),
        }),
      );
    }

    let hashPass = utils.hashSHA256(newPassword);
    await updateManager(user.projectManagerId, {
      password: hashPass,
      otp: null,
    });

    return res.json(utils.responseSuccess());
  } catch (error) {
    console.error(TAG, error);
    return res.json(
      utils.responseFailed(err.ERROR_SERVER_INTERNAL.code, {
        message:
          error?.message ?? res.__(err.ERROR_SERVER_INTERNAL.description),
      }),
    );
  }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
module.exports.sendVerificationMail = async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) {
      console.error(TAG, err.ERROR_MISSING_PARAMS.description);
      return res.json(
        utils.responseFailed(err.ERROR_MISSING_PARAMS.code, {
          message: res.__(err.ERROR_MISSING_PARAMS.description),
        }),
      );
    }

    let user = await getManagerByEmail(email);
    if (!user) {
      console.error(TAG, err.ERROR_USER_NOT_FOUND.description);
      return res.json(
        utils.responseFailed(err.ERROR_USER_NOT_FOUND.code, {
          message: res.__(err.ERROR_USER_NOT_FOUND.description),
        }),
      );
    }

    let otp = generateOTP4Digits();
    console.log("TAG", `OTP: ${otp}`);
    let expirationDate = moment().add(5, "minutes").format(DATETIME_FORMAT);
    let otpHash = utils.hashSHA256(otp);

    await updateAdmin(user.projectManagerId, {
      otp: otpHash,
      expiryOtp: expirationDate,
    });

    sendEmail({
      emails: [user.email],
      subject: "Verify Email",
      text: `Here is the OTP to verify your email: ${otp}, expire at: ${moment(expirationDate).format(HUMANIZE_DATETIME_FORMAT)} or you can verify with this link ${process.env.BASE_URL}/user/verify-account-by-mail?userId=${user.userId}&otp=${otp}`,
    });

    return res.json(utils.responseSuccess());
  } catch (error) {
    console.error(TAG, error);
    return res.json(
      utils.responseFailed(err.ERROR_SERVER_INTERNAL.code, {
        message:
          error?.message ?? res.__(err.ERROR_SERVER_INTERNAL.description),
      }),
    );
  }
};

module.exports.verifyAccountByMail = async (req, res) => {
  try {
    let { userId, otp } = req.query;

    let user = await getManagerById(userId);
    if (!user) {
      console.error(TAG, err.ERROR_USER_NOT_FOUND.description);
      return res.json(
        utils.responseFailed(err.ERROR_USER_NOT_FOUND.code, {
          message: res.__(err.ERROR_USER_NOT_FOUND.description),
        }),
      );
    }

    if (!otp) {
      console.error(TAG, err.ERROR_MISSING_PARAMS.description);
      return res.json(
        utils.responseFailed(err.ERROR_MISSING_PARAMS.code, {
          message: res.__(err.ERROR_MISSING_PARAMS.description),
        }),
      );
    }

    let otpHash = utils.hashSHA256(otp);
    if (otpHash !== user.otp) {
      console.error(TAG, err.ERROR_OTP_WRONG.description);
      return res.json(
        utils.responseFailed(err.ERROR_OTP_WRONG.code, {
          message: res.__(err.ERROR_OTP_WRONG.description),
        }),
      );
    }

    if (moment(user.expiryOtp).isSameOrBefore(moment())) {
      console.error(TAG, err.ERROR_OTP_EXPIRATION.description);
      return res.json(
        utils.responseFailed(err.ERROR_OTP_EXPIRATION.code, {
          message: res.__(err.ERROR_OTP_EXPIRATION.description),
        }),
      );
    }

    let activeUser = await activateAccount(userId);

    return res.json(utils.responseSuccess(activeUser));
  } catch (error) {
    console.error(TAG, error);
    return res.json(
      utils.responseFailed(err.ERROR_SERVER_INTERNAL.code, {
        message:
          error?.message ?? res.__(err.ERROR_SERVER_INTERNAL.description),
      }),
    );
  }
};

module.exports.verifyAccountByOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email) {
      console.error(TAG, err.ERROR_MISSING_PARAMS.description);
      return res.json(
        utils.responseFailed(err.ERROR_MISSING_PARAMS.code, {
          message: res.__(err.ERROR_MISSING_PARAMS.description),
        }),
      );
    }

    let user = await getManagerByEmail(email);
    if (!user) {
      console.error(TAG, err.ERROR_USER_NOT_FOUND.description);
      return res.json(
        utils.responseFailed(err.ERROR_USER_NOT_FOUND.code, {
          message: res.__(err.ERROR_USER_NOT_FOUND.description),
        }),
      );
    }

    if (!otp) {
      console.error(TAG, err.ERROR_MISSING_PARAMS.description);
      return res.json(
        utils.responseFailed(err.ERROR_MISSING_PARAMS.code, {
          message: res.__(err.ERROR_MISSING_PARAMS.description),
        }),
      );
    }

    let otpHash = utils.hashSHA256(otp);
    if (otpHash !== user.otp) {
      console.error(TAG, err.ERROR_OTP_WRONG.description);
      return res.json(
        utils.responseFailed(err.ERROR_OTP_WRONG.code, {
          message: res.__(err.ERROR_OTP_WRONG.description),
        }),
      );
    }

    if (moment(user.expiryOtp).isSameOrBefore(moment())) {
      console.error(TAG, err.ERROR_OTP_EXPIRATION.description);
      return res.json(
        utils.responseFailed(err.ERROR_OTP_EXPIRATION.code, {
          message: res.__(err.ERROR_OTP_EXPIRATION.description),
        }),
      );
    }

    let activeUser = await activateAccount(user.organizationAdminId);

    return res.json(utils.responseSuccess(activeUser));
  } catch (error) {
    console.error(TAG, error);
    return res.json(
      utils.responseFailed(err.ERROR_SERVER_INTERNAL.code, {
        message:
          error?.message ?? res.__(err.ERROR_SERVER_INTERNAL.description),
      }),
    );
  }
};
