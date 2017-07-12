'use strict'
const concatStream = require('mississippi').concat
const cidForHash = require('ipld-eth-block/src/common').cidForHash
const ethUtil = require('ethereumjs-util')
const getStdin = require('get-stdin')

module.exports = {
  command: 'cid [hash]',

  description: 'Generate CIDs for Ethereum hashes',

  // dont parse hash as Number '_'
  builder: function (yargs) {
    return yargs.string(['_'])
  },

  handler: function (argv) {
    if (process.stdin.isTTY) {
      const hashHex = ethUtil.stripHexPrefix(argv.hash)
      const hash = new Buffer(hashHex, 'hex')
      logCidTable(hash)
    } else {
      getStdin()
      .then((hashHex) => {
        hashHex = hashHex.split('\n').join('')
        hashHex = ethUtil.stripHexPrefix(hashHex)
        console.log(`"${hashHex}"`)
        const hash = new Buffer(hashHex, 'hex')
        logCidTable(hash)
      })
      .catch((err) => {
        console.error(err)
      })
    }

  }
}

function logCidTable(hash){
  console.log(JSON.stringify({
    'raw': cidForHash('raw', hash).toBaseEncodedString(),
    'eth-block': cidForHash('eth-block', hash).toBaseEncodedString(),
    'eth-block-list': cidForHash('eth-block-list', hash).toBaseEncodedString(),
    'eth-tx-trie': cidForHash('eth-tx-trie', hash).toBaseEncodedString(),
    'eth-tx': cidForHash('eth-tx', hash).toBaseEncodedString(),
    'eth-tx-receipt-trie': cidForHash('eth-tx-receipt-trie', hash).toBaseEncodedString(),
    'eth-tx-receipt': cidForHash('eth-tx-receipt', hash).toBaseEncodedString(),
    'eth-state-trie': cidForHash('eth-state-trie', hash).toBaseEncodedString(),
    'eth-storage-trie': cidForHash('eth-storage-trie', hash).toBaseEncodedString(),
  }, null, 2))
}