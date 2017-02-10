'use strict'
const concatStream = require('mississippi').concat
const EthBlock = require('ethereumjs-block')
const EthBlockHeader = require('ethereumjs-block/header')
const getStdin = require('get-stdin')


module.exports = {
  command: 'block',

  description: 'Parse an ethereum block header',

  handler: function (argv) {
    // const sink = concatStream((rawBlock) => {
    //   const header = new EthBlock(rawBlock).header
    //   // const header = new EthBlockHeader(rawBlock)
    //   console.log(JSON.stringify(ethObjToJson(header), null, 2))
    // })
    // process.stdin.pipe(sink)
    // sink.on('error', console.error)
    if (process.stdin.isTTY) {
      const blockHex = ethUtil.stripHexPrefix(argv.block)
      const rawBlock = new Buffer(blockHex, 'hex')
      logBlock(rawBlock)
    } else {
      getStdin()
      .then((rawBlock) => {
        logBlock(rawBlock)
      })
      .catch((err) => {
        console.error(err)
      })
    }

    function logBlock(rawBlock) {
      const header = new EthBlock(rawBlock).header
      console.log(JSON.stringify(ethObjToJson(header), null, 2))
    }
  }
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