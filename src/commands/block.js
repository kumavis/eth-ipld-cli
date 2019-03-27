'use strict'

const EthBlock = require('ethereumjs-block')
const EthBlockHeader = require('ethereumjs-block/header')
const { createCommand, ethObjToJson } = require('../util')

module.exports = createCommand({

  command: 'block',
  description: 'Parse an ethereum block header',

  builder: (yargs) => {
    return yargs.option('body', {
      alias: 'b',
      describe: 'expect raw to be block body, not just header',
      default: false,
    })
  },

  onData: function (argv, data) {
    let header
    if (argv.body) {
      header = new EthBlock(data).header
    } else {
      header = new EthBlockHeader(data)
    }
    logBlockHeader(header)
  },

})

function logBlockHeader(header) {
  console.log(JSON.stringify(ethObjToJson(header), null, 2))
}
