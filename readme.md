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
// checkAuth will auto invoke and it will check smtp auth
const mailClient=require('node-mail-client')
let mail=new mailClient({
  user:`*@gmail.com`, // your address
  pass:`***`, // your password
  imap:['imap.*.com',993], // [host,port,tls]
  smtp:['smtp.*.com',587], // [host,port,secure]
  name:'Jack' // your name when send
})
// receive
mail.receive(null).then(result=>{
  // do something
}).catch(err=>{
  console.log(err)  
})
// send 
mail.send({ to, subject, text, html }).then(info=>{})
.catch(console.error)

// pass checkAuth chec
mail.check=1  // 0: init  1:pass  2:fail
// send or receive
```
## API
```ts
receive:
setNum:String|Function total=>{}
 returned like '1:10' or '1:*' //total is box messages total
send:Object
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
