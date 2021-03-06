const Imap = require('imap')
const utf8 = require('utf8')
const quotedPrintable = require('quoted-printable')
require('./polyfill')

var isArray = Array.isArray


module.exports = function imap(opt, setNum) {
  console.log('imap start receive email...')
  let result = []
  var _imap = new Imap(opt)

  function openBox(cb) {
    _imap.openBox('INBOX', cb)
  }

  let n = 0
  function getMsgByUID(uid, cb, partID) {
    var f = _imap.seq.fetch(uid,
      (partID
        ? {
          bodies: [
            'HEADER.FIELDS (TO FROM SUBJECT)',
            ...(partID.pop())
          ]
        }
        : { struct: true })),
      hadErr = false;

    if (partID)
      var data = {};

    f.on('error', function (err) {
      hadErr = true;
      cb(err);
    });

    if (!partID) {
      let parts = []
      f.on('message', function (m) {
        m.on('attributes', function (attrs) {
          let res = findTextPart(attrs.struct)
          parts.push(res)
        })
      }).on('end', function () {
        if (hadErr)
          return;
        if (parts.length > 0) {
          let set = new Set()
          function recursion(parts) {
            parts.forEach(v => {
              if (isArray(v[0])) {
                recursion(v)
              } else if (v[0]) set.add(v[0])
              else return;
            })
          }
          recursion(parts)
          set = Array.from(set)
          parts.push(set)
          getMsgByUID(uid, cb, parts)
        }
        else
          cb(new Error('No text part found'));
      });
    } else {
      f.on('message', function (msg, seqno) {
        msg.on('body', function (stream, info) {
          var b = ''
          stream.on('data', function (d) {
            b += d.toString('utf8')
          }).on('end', function () {
            if (/^header/i.test(info.which))
              data.header = Imap.parseHeader(b)
            else try {
              if (info.size <= 4) return;
              data.body = utf8.decode(quotedPrintable.decode(b))
            } catch (error) {
              data.body = quotedPrintable.decode(b)
            }
          })
        }).on('attributes', function (attrs) {
          data.attrs = attrs;
          let a = partID[n++].flat(Infinity).sort()
          data.contentType = Array.from(new Set(a))
        }).on('end', () => {
          data.seqno = seqno
          format(data)
          result.push(data)
          data = {}
        })
      });
      f.on('end', function () {
        if (hadErr) return;
        cb()
      })
    }
  }

  return new Promise((resolve, reject) => {
    _imap.connect()
    _imap.on('ready', () => {
      openBox((err, box) => {
        if (err) reject(err)
        let num = `${box.messages.total}:*`
        const numType = type(setNum)
        if (numType === 'function') num = setNum(box.messages.total)
        else if (numType === 'string') num = setNum
        let same = num.split(":")
        if (same[0] === same[1]) reject('same')
        getMsgByUID(num, function (err) {
          if (err) reject(err)
          _imap.end()
          if (result.length > 0)
            console.log('success,received %d emails', result.length)
          resolve(result)
        })
      })
    })
    _imap.on('error', (err) => {
      console.log('imap connect error');
      reject(err)
    })
  })
}


function findTextPart(struct) {
  let arr = []
  for (var i = 0, len = struct.length, r; i < len; ++i) {
    if (Array.isArray(struct[i])) {
      if (r = findTextPart(struct[i]))
        arr.push(r);
    } else if (struct[i].type === 'text'
      && (struct[i].subtype === 'plain'
        || struct[i].subtype === 'html')) {
      arr.push(struct[i].partID, struct[i].type + '/' + struct[i].subtype, struct[i].encoding)
    }
  }
  return arr;
}

function format(res) {
  let { body, contentType } = res
  contentType.forEach(v => {
    if (/base64/i.test(v))
      try {
        res.body = new Buffer(body, 'base64').toString()
      } catch (error) {
        res.body = `<img data:image/jpg;base64,${body}/>`
      }
  })
}

function type(p) {
  return Object.prototype.toString.call(p).slice(8).replace(']', '').toLowerCase()
}
