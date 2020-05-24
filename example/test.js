const mail = require('../index.js')
const fs = require('fs')

let m = new mail({
  // user: 'any@gmail.com',
  // pass: '123',
  // imap: ['imap.*.com', 993],
  // smtp: ['smtp.*.com', 587]
})
// m.receive(null,result => {
//   fs.writeFile('./data.js', 'var data='+JSON.stringify(result), () => { })
// })
m.test({
    to: "*@163.com", // list of receivers
    subject: "mail", // Subject line
    text: "Hello", // plain text body
    html: "<b>Hello world?</b>", // html body
})