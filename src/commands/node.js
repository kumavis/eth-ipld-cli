'use strict'
const EthTrieNode = require('merkle-patricia-tree/trieNode')
const getStdin = require('get-stdin')
const rlp = require('rlp')
const ethUtil = require('ethereumjs-util')

module.exports = {
  command: 'node',

  description: 'Parse an ethereum trie node',

  handler: function (argv) {
    if (process.stdin.isTTY) {
      const blockHex = ethUtil.stripHexPrefix(argv.block)
      const rawData = new Buffer(blockHex, 'hex')
      logNode(rawData)
    } else {
      getStdin.buffer()
      .then((rawData) => {
        const hexEncoded = (rawData.slice(0,2).toString('utf8') === '0x')
        if (hexEncoded) {
          let hexData = rawData.toString('utf8')
          hexData = hexData.split('\n').join('')
          rawData = ethUtil.toBuffer(hexData)
        }
        logNode(rawData)
      })
      .catch((err) => {
        console.error(err)
      })
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
  }
}

function ethObjToJson(obj){
  const result = {}
  obj._fields.forEach((field) => {
    let value = obj[field]
    if (Buffer.isBuffer(value)) value = '0x'+value.toString('hex')
    result[field] = value
  })
  return result
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