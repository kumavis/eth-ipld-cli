'use strict'
const concatStream = require('mississippi').concat
const getStdin = require('get-stdin')
const ethBlockHeaderFromRpc = require('ethereumjs-block/header-from-rpc')
const ethUtil = require('ethereumjs-util')


module.exports = {
  command: 'rpc [type]',

  description: 'Parse rpc result into binary',

  // dont parse hash as Number '_'
  builder: (yargs) => {
    return yargs
    .string(['_'])
    .option('result', {
      alias: 'r',
      describe: 'expect the block wrapped in an rpc result body',
      default: false,
    })
  },

  handler: function (argv) {
    if (process.stdin.isTTY) {
      throw new Error('Expected stdin.')
    } else {
      const type = argv.type
      getStdin()
      .then((resJson) => {
        switch (type) {
          case 'block':
            let blockJson = JSON.parse(resJson)
            if (argv.result) blockJson = blockJson.result
            const blockHeader = ethBlockHeaderFromRpc(blockJson)
            const rawBlock = blockHeader.serialize()
            process.stdout.write(rawBlock)
            return
          default:
            throw new Error(`Unsupported rpc type "${type}"`)
        }
      })
      .catch((err) => {
        console.error(err)
      })
    }

  }
}
