'use strict'
const concatStream = require('mississippi').concat
const getStdin = require('get-stdin')
const rlp = require('rlp')

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
      .then((input) => {
        const parsed = rlp.decode(input)
        console.log(parsed.map((buf) => buf.toString('hex')))
      })
      .catch((err) => {
        console.error(err)
      })
    }

  }
}
