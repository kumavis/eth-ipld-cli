'use strict'
const concatStream = require('mississippi').concat
const getStdin = require('get-stdin')
const rlp = require('rlp')
const ethUtil = require('ethereumjs-util')

module.exports = {
  command: 'rlp',

  description: 'Parse Ethereum RLP',

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
        const parsed = rlp.decode(rawData)
        const hexArray = parsed.map((buf) => buf.toString('hex'))
        const output = JSON.stringify(hexArray, null, 2)
        console.log(output)
      })
      .catch((err) => {
        console.error(err)
      })
    }

  }
}
