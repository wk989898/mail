const mail = require('../index.js')
const fs = require('fs')

let m = new mail({
  user: '*@*.com',
  pass: '*',
  imap: ['imap.*.com', 993],
  smtp: ['smtp.*.com', 465],
  name: 'any'
})

let total
m.receive(num => {
  total = num
  return `${total}:*`
}).then(result=>{
  fs.writeFile('./data.js', JSON.parse(result), () => { })
}).catch(err=>{
  console.log(err);
})

const [to, subject, text, html] = [
  '*@163.com',
  'test',
  'hello',
  'html'
]
m.check = 1
m.send({
  to, subject, text, html
}).then(info=>{
  console.log('messageId is',info.messageId);
}).catch(err=>{
  console.log('fail send\n',err);
})



