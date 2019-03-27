'use strict'

const getStdin = require('get-stdin')
const ethUtil = require('ethereumjs-util')


module.exports = { createCommand, ethObjToJson }


function createCommand ({ command, description, builder, onData }) {
  return {
    command,
    description,

    // dont parse input as Number '_'
    builder: function (yargs) {
      if (builder) return builder(yargs)
      return yargs.string(['_'])
    },

    handler: async function (argv) {
      try {
        // detect data source
        let rawInput, input
        if (process.stdin.isTTY) {
          rawInput = Buffer.from(argv._[1], 'utf8')
        } else {
          const inputString = await getStdin()
          rawInput = Buffer.from(inputString, 'utf8')
        }
        // detect data encoding
        const isHexEncoded = (rawInput.slice(0,2).toString() === '0x')
        if (isHexEncoded) {
          let inputString = rawInput.slice(2).toString()
          // trim newlines (useful when `cat`ing a file)
          inputString = inputString.split('\n').join('')
          input = Buffer.from(inputString, 'hex')
        } else {
          input = rawInput
        }

        // send to data handler
        onData(argv, input)
      } catch (err) {
        console.error(err)
        process.exit(1)
      }
    }
  }
}

function ethObjToJson (obj) {
  const result = {}
  obj._fields.forEach((field) => {
    let value = obj[field]
    if (Buffer.isBuffer(value)) value = ethUtil.bufferToHex(value)
    result[field] = value
  })
  return result
}
