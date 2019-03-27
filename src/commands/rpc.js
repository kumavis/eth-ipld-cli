'use strict'

const ethBlockHeaderFromRpc = require('ethereumjs-block/header-from-rpc')
const EthTransaction = require('ethereumjs-tx')
const { createCommand, ethObjToJson } = require('../util')

module.exports = createCommand({

  command: 'rpc [type]',
  description: 'Parse rpc result into binary',

  builder: (yargs) => {
    return yargs
    // dont parse hash as Number '_'
    .string(['_'])
    .option('result', {
      alias: 'r',
      describe: 'expect the params wrapped in an rpc result body',
      default: false,
    })
  },

  onData: function (argv, data) {
    const type = argv.type
    const rawRes = data.toString('utf8')
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
  },

})
