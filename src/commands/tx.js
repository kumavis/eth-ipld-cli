'use strict'

const EthTransaction = require('ethereumjs-tx')
const rlp = require('rlp')
const ethUtil = require('ethereumjs-util')
const { createCommand, ethObjToJson } = require('../util')

module.exports = createCommand({
  
  command: 'tx',
  description: 'Parse an ethereum tx',

  onData: function (argv, data) {
    const txObj = dataToTxObj(data)
    console.log(JSON.stringify(txObj, null, 2))
  },

})

function dataToTxObj (data) {
  let txObj
  try {
    const ethTx = new EthTransaction(data)
    txObj = ethTxToJson(ethTx)
  } catch (err) {
    // fallback to rlp decode
    const parsed = rlp.decode(data)
    const hexArray = parsed.map((buf) => '0x' + buf.toString('hex'))
    txObj = {
      invalid: err.message,
      nonce: hexArray[0],
      gasPrice: hexArray[1],
      gasLimit: hexArray[2],
      to: hexArray[3],
      value: hexArray[4],
      data: hexArray[5],
      v: hexArray[6],
      r: hexArray[7],
      s: hexArray[8],
    }
  }
  return txObj
}

function ethTxToJson (ethTx) {
  const obj = ethObjToJson(ethTx)
  obj.from = ethUtil.bufferToHex(ethTx.from)
  obj.chainId = ethTx.getChainId()
  obj.hash = ethUtil.bufferToHex(ethTx.hash())
  return obj
}
