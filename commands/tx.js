'use strict'
const EthTransaction = require('ethereumjs-tx')
const getStdin = require('get-stdin')


module.exports = {
  command: 'tx',

  description: 'Parse an ethereum tx ',

  // dont parse hash as Number '_'
  builder: function (yargs) {
    return yargs.string(['_'])
  },

  handler: function (argv) {
    if (process.stdin.isTTY) {
      throw new Error('Expected stdin.')
    } else {
      getStdin.buffer()
      .then((rawBlock) => {
        const tx = new EthTransaction(rawBlock)
        logTx(tx)
      })
      .catch((err) => {
        console.error(err)
      })
    }

    function logTx(tx) {
      console.log(JSON.stringify(ethObjToJson(tx), null, 2))
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