# node-mail-client
## Intro
a email client to receive and send mail  
base IMAP and SMTP
## Installation
``` js
npm install node-mail-client
```
## Usage
```js
// these methods all returned promise
// checkAuth is neccessary
const mailClient=require('node-mail-client')
let mail=new mailClient({
  user:`*@gmail.com`, // your user 
  pass:`***`, // your password
  imap:['imap.*.com',993], // [host,port,tls]
  smtp:['smtp.*.com',587] // [host,port,secure]
})
mail.checkAuth().then(self=>{
  self.send({ to, subject, text, html })
}).catch(console.error)
// checkAuth has excuted
mail.checkAuth().then(self=>{
  // do something
}).catch(err=>{
  console.log(err)  
})
// pass checkAuth
mail.check=1  // 0: init  1:pass  2:fail
mail.send({to, subject, text, html})
```
## API
```ts
receive:
setNum:(total):num|undefined =>{}
total(Integer)  `INBOX` mailbox messages 
num(string|undefined)  like `1:10` or `1:*`

callback:(result):unknow=>{}
result(Array)  item include `header` `body` `attr` `contentType`

send:
  {
     to: "any@163.com", // list of receivers
     subject: "Hello", // Subject line
     text: "Hello world? text", // plain text body
     html: "<b>Hello world?</b>", // html body
  }  
```
### Here is an [example](./example/test.js)
## Documention
you could find specify  about API  
[send](https://nodemailer.com/about/)  
[receive](https://github.com/mscdex/node-imap)  

## Credits
[node-imap](https://github.com/mscdex/node-imap)  
[Nodemailer](https://github.com/nodemailer/nodemailer)
