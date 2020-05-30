"use strict";
const nodemailer = require("nodemailer");


module.exports = function smtp(opt, options) {
  let info
  async function start() {
    console.log('stmp start send email...')
    // testAccount
    if (!opt) {
      console.log('you are runing testAccount~~');
      let testAccount = await nodemailer.createTestAccount()
      opt = {
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        }
      }
      options.from = '"Fred Foo 👻" <foo@example.com>' // sender address
    }
    let transporter = nodemailer.createTransport(opt);
    info=await transporter.sendMail(options)
  }
  return start()
  .then(()=>console.log('success,send mail',info.messageId))
  .catch(console.error)
}

