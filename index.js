const imap = require('./src/receive.js')
const smtp = require('./src/send.js')
const tls = require('tls')

class mail {
  /**
   * @param {string} user complete address
   * @param {string} pass  password
   * @param {Array} imap [host,port[,option]]
   * @param {Array} smtp [host[,port,option]]
   */
  constructor({ user, pass, imap, smtp, name }) {
    this.user = user
    this.pass = pass
    this.imap = imap
    this.smtp = smtp
    this.name = name || ''
    this.check = 0
    this.err = 'init'
  }
  /**
   * @param {Function} setNum 
   * (num)=>{} control receive mails num .it returned like '1:10' or '1:*'
   * @param {Function} callback 
   * (result)=>{} result include `header` `body` `attr` `contentType`
   */
  receive(setNum) {
    if (this.check === 0) {
      return this.checkAuth().then(self => {
        return self.receive(setNum)
      })
    } else if (this.check === 2) {
      return Promise.reject(this.check);
    }
    const [host, port, tls = true] = this.imap
    const opt = {
      user: this.user,
      password: this.pass,
      host,
      port,
      tls
    }
    return imap(opt, setNum)
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
    if (this.check === 0) {
      return this.checkAuth().then(self => {
        return self.send({ to, subject, text, html })
      })
    } else if (this.check === 2) {
      return Promise.reject(this.check);
    }
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
    const from = `"${this.name}" <${this.user}>`
    return smtp(opt, {
      from, to, subject, text, html
    })
  }

   checkAuth() {
    if (this.check === 1) return Promise.resolve(this)
    else if (this.check === 2) return Promise.reject(this.err)
    const [host, port] = this.smtp
    let socket
    return  new Promise((resolve, reject) => {
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
            this.check = 1
            resolve(this)

          } else if (/^5\d{2}/.test(data)) {
            socket.write('quit\r\n')
            this.err = new Error(data)
            this.check = 2
            reject(this.err)

          } else if (/^221/.test(data)) console.log('check request has closed');
          else {
            socket.write('quit\r\n')
            this.err = new Error('unknow this.error\n' + data)
            this.check = 2
            reject(this.err)
          }
        }).on('error', (e) => {
          this.err = new Error('fail check\nplease ensure ssl port')
          this.check = 2

          reject(this.err)
        }).on('timeout', () => {
          this.err = new Error('timeout')
          this.check = 2

          reject(this.err)
        })
      } catch (error) {
        this.err = new Error('unknow error')
        this.check = 2
        reject(error)
      }
    })
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
