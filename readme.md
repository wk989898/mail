# node-mail-client
[![Build Status](https://travis-ci.com/wk989898/mail.svg?branch=master)](https://travis-ci.com/wk989898/mail)
![npm](https://img.shields.io/npm/v/node-mail-client)
## Intro
An email client for receiving and sending emails  
Based IMAP and SMTP
## Installation
``` js
npm install node-mail-client
```
## Usage
```js
// checkAuth will be called automatically and it will check email account authenticity
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

// skip checkAuth check
mail.check=1  // 0: init  1:pass  2:fail
```
## API
```js
receive:
//@param: {string | (total:number)=>string | null} setNum
//string alike '1:10' or '1:*' 
//'total' is the total number of box messages
receive('1:*').then()
receive(total=>`1:${total-10}`).then()
receive(null).then()

send:
/*
* @param:Object
*  {
*     to: "any@163.com", // list of receivers
*     subject: "Hello", // Subject line
*     text: "Hello world? text", // plain text body
*     html: "<b>Hello world?</b>", // html body
*  }
*/

```
### Here is an [example](./example/main.js)
## Documention
you could find specify  about API  
[send](https://nodemailer.com/about/)  
[receive](https://github.com/mscdex/node-imap)  

## Credits
[node-imap](https://github.com/mscdex/node-imap)  
[Nodemailer](https://github.com/nodemailer/nodemailer)
