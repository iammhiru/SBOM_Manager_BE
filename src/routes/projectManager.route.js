var express = require("express");
var router = express.Router();
const projectManagerControllers = require("../controllers/projectManager.controller.js");

router.get(
  "/projectManager/test",
  // #swagger.tags = ['User']
  // #swagger.summary = 'Test module'
  // #swagger.description = 'Test module'
  projectManagerControllers.test,
);

router.post(
  "/projectManager/register",
  // #swagger.tags = ['User']
  // #swagger.summary = 'Đăng kí tài khoản'
  // #swagger.description = 'Đăng kí tài khoản'
  projectManagerControllers.register,
);

router.post(
  "/projectManager/login",
  // #swagger.tags = ['User']
  // #swagger.summary = 'Đăng nhập'
  // #swagger.description = 'Đăng nhập'
  projectManagerControllers.login,
);

router.post(
  "/projectManager/req-reset-pass",
  // #swagger.tags = ['User']
  // #swagger.summary = 'Quên mật khẩu'
  // #swagger.description = 'Quên mật khẩu'
  projectManagerControllers.requestResetPassword,
);

router.post(
  "/projectManager/send-verify-email",
  // #swagger.tags = ['User']
  // #swagger.summary = 'Gửi mail chứa OTP xác thực'
  // #swagger.description = 'Gửi mail chứa OTP xác thực'
  projectManagerControllers.sendVerificationMail,
);

router.get(
  "/projectManager/verify-account-by-mail",
  // #swagger.tags = ['User']
  // #swagger.summary = 'Xác thực mail'
  // #swagger.description = 'Xác thực và kích hoạt email tài khoản bằng cách nhấp vào link'
  projectManagerControllers.verifyAccountByMail,
);

router.post(
  "/projectManager/verify-account-by-otp",
  // #swagger.tags = ['User']
  // #swagger.summary = 'Xác thực mail'
  // #swagger.description = 'Xác thực và kích hoạt email tài khoản bằng cách nhập OTP'
  projectManagerControllers.verifyAccountByOTP,
);

router.post(
  "/projectManager/reset-pass",
  // #swagger.tags = ['User']
  // #swagger.summary = 'Quên mật khẩu'
  // #swagger.description = 'Quên mật khẩu'
  projectManagerControllers.resetPassword,
);

// router.get(
//   "/user/google-callback",
//   // #swagger.tags = ['User']
//   // #swagger.summary = 'Call back Google URL'
//   // #swagger.description = 'Call back Google URL'
//   userControllers.getGoogleUser,
// );

module.exports = router;
