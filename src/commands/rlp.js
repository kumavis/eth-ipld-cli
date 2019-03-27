'use strict'

const rlp = require('rlp')
const { createCommand } = require('../util')

module.exports = createCommand({

  command: 'rlp',
  description: 'Parse Ethereum RLP',

  onData: (argv, data) => {
    const parsed = rlp.decode(data)
    const hexArray = parsed.map((buf) => '0x' + buf.toString('hex'))
    const output = JSON.stringify(hexArray, null, 2)
    console.log(output)
  },

})
