'use strict'
const concatStream = require('mississippi').concat
const cidFromHash = require('ipld-eth-star/util/cidFromHash')
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
    'raw': cidFromHash('raw', hash).toBaseEncodedString(),
    'ethBlock': cidFromHash('eth-block', hash).toBaseEncodedString(),
    'ethBlockList': cidFromHash('eth-block-list', hash).toBaseEncodedString(),
    'ethTxTrie': cidFromHash('eth-tx-trie', hash).toBaseEncodedString(),
    'ethTx': cidFromHash('eth-tx', hash).toBaseEncodedString(),
    'ethTxReceiptTrie': cidFromHash('eth-tx-receipt-trie', hash).toBaseEncodedString(),
    'ethTxReceipt': cidFromHash('eth-tx-receipt', hash).toBaseEncodedString(),
    'ethStateTrie': cidFromHash('eth-state-trie', hash).toBaseEncodedString(),
    'ethStorageTrie': cidFromHash('eth-storage-trie', hash).toBaseEncodedString(),
  }, null, 2))
}