'use strict'
const concatStream = require('mississippi').concat
const getStdin = require('get-stdin')
const ethBlockHeaderFromRpc = require('ethereumjs-block/header-from-rpc')
const ethUtil = require('ethereumjs-util')
const EthTransaction = require('ethereumjs-tx')


module.exports = {
  command: 'rpc [type]',

  description: 'Parse rpc result into binary',

  // dont parse hash as Number '_'
  builder: (yargs) => {
    return yargs
    .string(['_'])
    .option('result', {
      alias: 'r',
      describe: 'expect the params wrapped in an rpc result body',
      default: false,
    })
  },

  handler: function (argv) {
    if (process.stdin.isTTY) {
      throw new Error('Expected stdin.')
    } else {
      const type = argv.type
      getStdin()
      .then((rawRes) => {
        let resJson = JSON.parse(rawRes)
        if (argv.result) resJson = resJson.result
        switch (type) {

          case 'block':
            const blockHeader = ethBlockHeaderFromRpc(resJson)
            const rawBlock = blockHeader.serialize()
            process.stdout.write(rawBlock)
            return

          case 'tx':
            const tx = new EthTransaction(resJson)
            const rawTx = tx.serialize()
            process.stdout.write(rawTx)
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
