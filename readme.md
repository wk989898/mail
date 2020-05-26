# node-mail-client
## Intro
a email client to receive and send mail  
base IMAP and STMP
## Installation
``` js
npm install node-mail-client
```
## Usage
```js
const mailClient=require('node-mail-client')
let mail=new mailClient({
  user:`*@gmail.com`, // your user 
  pass:`***`, // your password
  imap:['imap.*.com',993], // [host,port,tls]
  smtp:['smtp.*.com',587] // [host,port,secure]
})
mail.send({ to, subject, text, html })
mail.receive(setNum, callback)
```
## API
```ts
receive:
setNum:(total):num=>{}
total(Integer)  `INBOX` mailbox messages 
num(string)  like `1:10` or `1:*`

callback:(result):unknow=>{}
result(Array) `total=result.pop()` other item include `header` `body` `attr` `contentType`

send:
  {
     to: "any@163.com", // list of receivers
     subject: "Hello", // Subject line
     text: "Hello world? text", // plain text body
     html: "<b>Hello world?</b>", // html body
  }  
```
### [example](./example/test.js)
## Documention
you could find specify  about API  
[send](https://nodemailer.com/about/)  
[receive](https://github.com/mscdex/node-imap)  

## Credits
[node-imap](https://github.com/mscdex/node-imap)  
[Nodemailer](https://github.com/nodemailer/nodemailer)
