const { client, regMessageId, regMsg, regNumber, regResponse, msg } =require( './client')

it('checkAuth', async () => {
  await client.checkAuth().catch(e => {
    expect(e.message).toEqual('fail check\nplease check your address or port')
  }).then(res => {
    expect(res).toBeUndefined()
  })
})
/**
 * when run at travis ,it will get self signed certificate
 */
// it('receive', async () => {
//   client.check = 1
//   client.smtp = ['smtp.gmail.com', 465]
//   await client.receive().catch(e => {
//     expect(e.message).toStrictEqual('Timed out while connecting to server')
//   })
// }, 50000)

// it('send', async () => {
//   client.check = 1
//   client.smtp = ['smtp.gmail.com', 465]
//   await client.send(msg).catch(e => {
//     expect(regMsg.test(e.message)).toBe(true)
//   })
// }, 50000)

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
}, 50000)