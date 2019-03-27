'use strict'

const cidFromHash = require('ipld-eth-star/util/cidFromHash')
const { createCommand } = require('../util')

module.exports = createCommand({

  command: 'cid [hash]',
  description: 'Generate CIDs for Ethereum hashes',

  onData: function (argv, data) {
    logCidTable(data)
  },

}

function logCidTable(hash) {
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