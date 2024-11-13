var express = require("express");
var router = express.Router();
const userControllers = require("../controllers/user.controller.js");

router.get(
  "/user/test",
  // #swagger.tags = ['User']
  // #swagger.summary = 'Test module'
  // #swagger.description = 'Test module'
  userControllers.test,
);

router.post(
  "/user/register",
  // #swagger.tags = ['User']
  // #swagger.summary = 'Đăng kí tài khoản'
  // #swagger.description = 'Đăng kí tài khoản'
  userControllers.register,
);

router.post(
  "/user/login",
  // #swagger.tags = ['User']
  // #swagger.summary = 'Đăng nhập'
  // #swagger.description = 'Đăng nhập'
  userControllers.login,
);

router.post(
  "/user/req-reset-pass",
  // #swagger.tags = ['User']
  // #swagger.summary = 'Quên mật khẩu'
  // #swagger.description = 'Quên mật khẩu'
  userControllers.requestResetPassword,
);

router.post(
  "/user/send-verify-email",
  // #swagger.tags = ['User']
  // #swagger.summary = 'Gửi mail chứa OTP xác thực'
  // #swagger.description = 'Gửi mail chứa OTP xác thực'
  userControllers.sendVerificationMail,
);

router.get(
  "/user/verify-account-by-mail",
  // #swagger.tags = ['User']
  // #swagger.summary = 'Xác thực mail'
  // #swagger.description = 'Xác thực và kích hoạt email tài khoản bằng cách nhấp vào link'
  userControllers.verifyAccountByMail,
);

router.post(
  "/user/verify-account-by-otp",
  // #swagger.tags = ['User']
  // #swagger.summary = 'Xác thực mail'
  // #swagger.description = 'Xác thực và kích hoạt email tài khoản bằng cách nhập OTP'
  userControllers.verifyAccountByOTP,
);

router.post(
  "/user/reset-pass",
  // #swagger.tags = ['User']
  // #swagger.summary = 'Quên mật khẩu'
  // #swagger.description = 'Quên mật khẩu'
  userControllers.resetPassword,
);

// router.get(
//   "/user/google-callback",
//   // #swagger.tags = ['User']
//   // #swagger.summary = 'Call back Google URL'
//   // #swagger.description = 'Call back Google URL'
//   userControllers.getGoogleUser,
// );

module.exports = router;
