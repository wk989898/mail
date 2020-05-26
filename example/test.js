const mail = require('../index.js')
const fs = require('fs')

let m = new mail({
  user: '*@gmail.com',
  pass: '***',
  imap: ['imap.*.com', 993],
  smtp: ['smtp.*.com', 465]
})
m.receive(null,result => {
  console.log('message total :',result.pop())
  fs.writeFile('./data.js', 'var data='+JSON.stringify(result), () => { })
})
// m.test({
//     to: "*@163.com", // list of receivers
//     subject: "mail", // Subject line
//     text: "Hello", // plain text body
//     html: "<b>Hello world?</b>", // html body
// })


