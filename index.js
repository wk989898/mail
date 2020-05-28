const imap = require('./src/receive.js')
const smtp = require('./src/send.js')
const net = require('net')
const tls = require('tls')

class mail {
  /**
   * @param {string} user complete address
   * @param {string} pass  password
   * @param {Array} imap [host,port[],option]]
   * @param {Array} smtp [host[,port,option]]
   */
  constructor({ user, pass, imap, smtp }) {
    this.user = user
    this.pass = pass
    this.imap = imap
    this.smtp = smtp
    this.checkAuth()
  }
  /**
   * @param {Function} setNum control receive mails num
   * @param {Function} callback 
   * (result)=>{} result include `header` `body` `attr` `contentType`
   * last item is receive mails num 
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
  /*
    @param  options
     {
     to: "any@163.com", // list of receivers
     subject: "Hello", // Subject line
     text: "Hello world? text", // plain text body
     html: "<b>Hello world?</b>", // html body
     }  
  */
  send({
    // from,
    to, subject, text, html
  }) {
    if (!this.check) throw new Error('check fail')
    let [host, port = 465, secure = false] = this.smtp
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
  async checkAuth() {
    const [host, port] = this.smtp
    let socket
    try {
      socket = tls.connect({
        host, port, timeout: 5000
      }).on('data', (data) => {
        data = data.toString()
        console.log(data);
        if (/^220/.test(data)) {
          socket.write('helo localhost\r\n')
        } else if (/^250/.test(data)) {
          socket.write('auth login\r\n')
        } else if (/^334/.test(data)) {
          let temp = this.decode(data.slice(3))
          if (/username/i.test(temp)) socket.write(this.encode(this.user.split('@')[0]) + '\r\n')
          else socket.write(this.encode(this.pass) + '\r\n')
        } else if (/^235/.test(data)) {
          socket.write('quit\r\n')
          console.log('auth check success')
        } else if (/^5\d{2}/.test(data)) {
          socket.write('quit\r\n')
          throw new Error(data)
        } else if (/^221/.test(data)) console.log('close');
        else {
          socket.write('quit\r\n')
          throw new Error('unknow error\n' + data)
        }
      }).on('error', (e) => {
        throw new Error('fail check\nplease ensure ssl port')
      }).on('timeout', () => {
        throw new Error('timeout')
      })
    } catch (error) {
      throw new Error('connect error\n' + error.message)
    }
  }
  test({ to, subject, text, html }) {
    smtp(null, {
      to, subject, text, html
    })
  }
  encode(str) {
    return Buffer.from(str).toString('base64')
  }
  decode(str) {
    return Buffer.from(str, 'base64').toString()
  }
}

module.exports = mail
