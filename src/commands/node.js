'use strict'

const EthTrieNode = require('merkle-patricia-tree/trieNode')
const rlp = require('rlp')
const ethUtil = require('ethereumjs-util')
const { createCommand, ethObjToJson } = require('../util')

module.exports = createCommand({

  command: 'node',
  description: 'Parse an ethereum trie node',

  onData: function (argv, data) {
    logNode(data) 
  },

}

function logNode(rawNode) {
  const node = new EthTrieNode(rlp.decode(rawNode))
  const children = {}
  node.getChildren().map((childData) => {
    const keyNibbles = childData[0] 
    const keyLength = keyNibbles.length
    const key = new Buffer(keyNibbles).toString('hex').slice(-keyLength)
    const value = childData[1].toString('hex')
    children[key] = value
  })
  const value = ethUtil.bufferToHex(node.getValue())
  console.log(JSON.stringify({
    type: node.type,
    children,
    value,
  }, null, 2))
  // console.log(JSON.stringify(ethObjToJson(node), null, 2))
}

/*
 * Converts a  nibble array into a buffer
 * @method nibblesToBuffer
 * @param arr
 */
function nibblesToBuffer (arr) {
  var buf = new Buffer(arr.length / 2)
  for (var i = 0; i < buf.length; i++) {
    var q = i * 2
    buf[i] = (arr[q] << 4) + arr[++q]
  }
  return buf
}