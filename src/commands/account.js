'use strict'

const EthAccount = require('ethereumjs-account')
const { createCommand, ethObjToJson } = require('../util')

module.exports = createCommand({

  command: 'account',
  description: 'Parse an ethereum acccount',

  onData: function (argv, data) {
    const account = new EthAccount(data)
    console.log(JSON.stringify(ethObjToJson(account), null, 2))
  },

})