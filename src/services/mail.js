const nodemailer = require("nodemailer");

const _ = require("lodash");
const { oAuth2Client } = require("./google");
const { isValidEmail } = require("../utils/utils");

// oAuth2Client.setCredentials({
// 	refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
// });

let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  // tls: {},
  auth: {
    user: "hieuphamtrung2k3@gmail.com", // generated ethereal user
    pass: "hieudark234424",
  },
});

/**
 * @description send email notification to account
 *
 * Không nên await khi gọi hàm này vì thời gian để resolve thành công khá lâu
 *
 * @typedef Props
 * @property {string} params.html in html
 * @property {string} params.subject email subject
 * @property {string[]=} params.emails if no target email, will look for accountId
 * @property {import('../types').EmailType} params.emailType
 * @property {{name:string,email:string,taxCode:string}[]} params.recipients người nhan email. chỉ dùng để lưu vào lịch sử gửim mail
 * @property {boolean=} saveToHistory save to email history
 *
 * @param {Props & nodemailer.SendMailOptions}
 * @return {Promise<SMTPTransport.SentMessageInfo|null>} return `null` if send false
 *
 */
async function sendEmail({
  emails,
  // recipients,
  // saveToHistory = true,
  ...options
}) {
  try {
    let targetEmails = _.isArray(emails) && emails.length > 0 ? emails : [];

    // if (!targetEmails.length) {
    // 	if (_.isArray(recipients))
    // 		targetEmails = recipients.map((r) => r.email).filter(_.isString);
    // }

    targetEmails = targetEmails.filter((email) => isValidEmail(email));

    if (!targetEmails.length) throw new Error("Không tìm thấy người nhận");
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer();

    // targetEmails = _.uniq(targetEmails);

    try {
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: `TEST EMAIL`, // sender address
        to: targetEmails, // list of receivers
        textEncoding: "quoted-printable",
        // encoding:'',
        ...options,
      });

      console.log("Message sent: %s", info.messageId);

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

      /* save to Email-History */
      // try {
      // 	let rs = await EmailHistory.create({
      // 		emailContent: options.html,
      // 		emailTitle: options.subject,
      // 		emailType,
      // 		emailRecipients: _.isArray(recipients)
      // 			? recipients
      // 			: targetEmails.concat(options.cc).map((e) => ({ email: e })),
      // 		status: EMAIL_STATUS.DELIVERED,
      // 	});
      // } catch (error) {
      // 	console.warn(error);
      // }
      return info;
    } catch (error) {
      console.log(error);

      // let rs = await EmailHistory.create({
      // 	emailContent: options.html,
      // 	emailTitle: options.subject,
      // 	emailType,
      // 	emailRecipients: _.isArray(recipients)
      // 		? recipients
      // 		: targetEmails.concat(options.cc).map((e) => ({ email: e })),
      // 	status: EMAIL_STATUS.FAILED,
      // }).catch(console.warn);

      return null;
    }
  } catch (error) {
    console.warn(error);
  }
}

module.exports.sendEmail = sendEmail;
