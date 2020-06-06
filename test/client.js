const mail = require('../index')

const opt = {
  user: 'any@gmail.com',
  pass: '***',
  imap: ['imap.gmail.com', 993],
  smtp: '',
  name: 'Jack'
}
const msg = {
  to: '*@gmail.com',
  subject: 'test',
  text: 'hello',
  html: 'html'
}
const regResponse = /^250 Accepted \[STATUS=new MSGID=.+\]$/
const regMessageId = /^\<.+@example\.com\>$/
const regNumber = /\d+/
const regMsg = /^connect ETIMEDOUT .+$/
const client = new mail(opt)
module.exports = {
  msg, regResponse, regMessageId, regNumber, regMsg, client
}