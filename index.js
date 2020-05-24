const imap = require('./receive.js')
const smtp = require('./send.js')

class mail {
  /**
   * @param {string} user complete address
   * @param {string} pass  password
   * @param {Array} imap [host,port,option]
   * @param {Array} smtp [host,port,option]
   */
  constructor({ user, pass, imap, smtp }) {
    this.user = user
    this.pass = pass
    this.imap = imap
    this.smtp = smtp
  }
  /**
   * @param {Function} setNum
   * @param {Function} callback 
   */
  receive(setNum, callback) {
    const [host, port, tls = true] = this.imap 
    const opt = {
      user: this.user,
      password: this.pass,
      host,
      port,
      tls
    }
    imap(opt, setNum, callback)
  }
  //  @param options
  //   {
  //   to: "any@163.com", // list of receivers
  //   subject: "Hello", // Subject line
  //   text: "Hello world? text", // plain text body
  //   html: "<b>Hello world?</b>", // html body
  //   }  
  send({
    // from,
    to, subject, text, html
  }) {
    let [host, port, secure = false] = this.smtp 
    let opt = {
      host,
      port,
      secure: secure ? secure : port == 465 ? true : false, // true for 465, false for other ports
      auth: {
        user: this.user, // generated ethereal user
        pass: this.pass, // generated ethereal password
      }
    }
    smtp(opt, {
      from: this.user,
      to, subject, text, html
    })
  }
  
  test({to, subject, text, html}){
    smtp(null,{
      to,subject,text,html
    })
  }
}

module.exports = mail