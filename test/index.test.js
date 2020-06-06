const mail = require('../index')
const opt = {
  user: 'any@gmail.com',
  pass: '***',
  imap: ['imap.gmail.com', 993],
  smtp: '',
  name: 'Jack'
}
const msg = {
  to: '*@gmail.com',
  subject: 'test',
  text: 'hello',
  html: 'html'
}
const regResponse = /^250 Accepted \[STATUS=new MSGID=.+\]$/
const regMessageId = /^\<.+@example\.com\>$/
const regNumber=/\d+/
const client = new mail(opt)

it('checkAuth', async () => {
  await client.checkAuth().catch(e => {
    expect(e.message).toEqual('fail check\nplease check your address or port')
  }).then(res => {
    expect(res).toBeUndefined()
  })
})

it('receive', async () => {
  client.check = 1
  client.smtp = ['smtp.gmail.com', 465]
  await client.receive().catch(e => {
    expect(e.message).toEqual('Timed out while connecting to server')
  })
}, 30000)

it('send', async () => {
  client.check = 1
  client.smtp = ['smtp.gmail.com', 465]
  await client.send(msg).catch(e => {
    expect(e.message).toEqual('connect ETIMEDOUT 64.233.189.109:465')
  })
}, 30000)

it('testAccount', async () => {
  await client.test(msg).then(res => {
    const { accepted, response, envelope, messageId, rejected, envelopeTime, messageTime, messageSize } = res
    expect(accepted).toContain(msg.to)
    expect(envelope).toEqual({
      from: 'foo@example.com', to: ['*@gmail.com']
    })
    expect(rejected).toEqual([])
    expect(regNumber.test(envelopeTime)).toBe(true)
    expect(regNumber.test(messageTime)).toBe(true)
    expect(regNumber.test(messageSize)).toBe(true)
    expect(regResponse.test(response)).toBe(true)
    expect(regMessageId.test(messageId)).toBe(true)
  })
}, 30000)