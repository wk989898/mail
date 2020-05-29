const mail = require('../index.js')
const fs = require('fs')

let m = new mail({
  user: '*@*.com',
  pass: '*',
  imap: ['imap.*.com', 993],
  smtp: ['smtp.*.com', 465]
})

let num

m.checkAuth().then(self => {
  self.receive((total) => {
    num = total
  }, result => {
    console.log('message total :', num)
    fs.writeFile('./data.js', 'var data=' + JSON.stringify(result), () => { })
  })
}).catch(e => {
  console.log('check fail');
})



