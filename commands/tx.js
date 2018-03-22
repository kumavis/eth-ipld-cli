'use strict'
const EthTransaction = require('ethereumjs-tx')
const getStdin = require('get-stdin')
const ethUtil = require('ethereumjs-util')

module.exports = {
  command: 'tx',

  description: 'Parse an ethereum tx',

  // dont parse hash as Number '_'
  builder: function (yargs) {
    return yargs.string(['_'])
  },

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
        const tx = new EthTransaction(rawData)
        logTx(tx)
      })
      .catch((err) => {
        console.error(err)
      })
    }

    function logTx(tx) {
      const obj = ethObjToJson(tx)
      obj.from = ethUtil.bufferToHex(tx.from)
      obj.chainId = tx.getChainId()
      console.log(JSON.stringify(obj, null, 2))
    }
  },
}

function ethObjToJson(obj){
  const result = {}
  obj._fields.forEach((field) => {
    let value = obj[field]
    if (Buffer.isBuffer(value)) value = ethUtil.bufferToHex(value)
    result[field] = value
  })
  return result
}
