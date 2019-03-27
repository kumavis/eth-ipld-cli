'use strict'
const concatStream = require('mississippi').concat
const EthAccount = require('ethereumjs-account')
const getStdin = require('get-stdin')
const ethUtil = require('ethereumjs-util')


module.exports = {
  command: 'account',

  description: 'Parse an ethereum acccount',

  handler: function (argv) {
    if (process.stdin.isTTY) {
      throw new Error('Expected stdin.')
    } else {
      getStdin.buffer()
      .then((rawData) => {
        const hexEncoded = (rawData.slice(0,2).toString('utf8') === '0x')
        if (hexEncoded) {
          let hexData = rawData.toString('utf8')
          hexData = hexData.split('\n').join('')
          rawData = ethUtil.toBuffer(hexData)
        }
        const account = new EthAccount(rawData)
        console.log(JSON.stringify(ethObjToJson(account), null, 2))
      })
      .catch((err) => {
        console.error(err)
      })
    }
  },
}

function ethObjToJson(obj){
  const result = {}
  obj._fields.forEach((field) => {
    let value = obj[field]
    if (Buffer.isBuffer(value)) value = '0x'+value.toString('hex')
    result[field] = value
  })
  return result
}