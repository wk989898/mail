const mail = require('../index.js')
const fs = require('fs')

let m = new mail({
  user: '*@*.com',
  pass: '*',
  imap: ['imap.*.com', 993],
  smtp: ['smtp.*.com', 465]
})
m.checkAuth().then(self=>{
  console.log(self) // m
}).catch(e=>{
  console.log('check fail');
})

let num
m.receive((total)=>{
  num=total
},result => {
  console.log('message total :',total)
  fs.writeFile('./data.js', 'var data='+JSON.stringify(result), () => { })
}).then(self=>{
  self.test({
    to: "*@163.com", // list of receivers
    subject: "mail", // Subject line
    text: "Hello", // plain text body
    html: "<b>Hello world?</b>", // html body
})
})


