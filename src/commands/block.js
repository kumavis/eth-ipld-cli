'use strict'
const concatStream = require('mississippi').concat
const EthBlock = require('ethereumjs-block')
const EthBlockHeader = require('ethereumjs-block/header')
const getStdin = require('get-stdin')


module.exports = {
  command: 'block',

  description: 'Parse an ethereum block header',

  builder: (yargs) => {
    return yargs.option('body', {
      alias: 'b',
      describe: 'expect raw to be block body, not just header',
      default: false,
    })
  },

  handler: function (argv) {
    if (process.stdin.isTTY) {
      throw new Error('Expected stdin.')
    } else {
      getStdin.buffer()
      .then((rawBlock) => {
        let header
        if (argv.body) {
          header = new EthBlock(rawBlock).header
        } else {
          header = new EthBlockHeader(rawBlock)
        }
        logBlock(header)
      })
      .catch((err) => {
        console.error(err)
      })
    }

    function logBlock(header) {
      console.log(JSON.stringify(ethObjToJson(header), null, 2))
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