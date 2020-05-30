const mail = require('../index.js')
const fs = require('fs')

let m = new mail({
  user: '*@*.com',
  pass: '*',
  imap: ['imap.*.com', 993],
  smtp: ['smtp.*.com', 465],
  name:'any'
})

let total
m.checkAuth().then(self => {
  self.receive(num => {
    total = num
  }, result => {
    console.log('receive %d emails', total);
    fs.writeFile('./data.js', JSON.parse(result), () => { })
  })
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
})



