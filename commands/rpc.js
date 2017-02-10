'use strict'
const concatStream = require('mississippi').concat
const cidForHash = require('ipld-eth-block/src/common').cidForHash
const getStdin = require('get-stdin')
const EthBlockHeader = require('ethereumjs-block/header')
const ethUtil = require('ethereumjs-util')


module.exports = {
  command: 'rpc [type]',

  description: 'Generate CIDs for Ethereum hashes',

  // dont parse hash as Number '_'
  builder: (yargs) => {
    return yargs
    .string(['_'])
    .option('result', {
      alias: 'r',
      describe: 'expect the block wrapped in an rpc result body',
      default: false,
    })
  },

  handler: function (argv) {
    if (process.stdin.isTTY) {
      throw new Error('Expected stdin.')
    } else {
      getStdin()
      .then((resJson) => {
        let blockJson = JSON.parse(resJson)
        if (argv.result) blockJson = blockJson.result
        const blockHeader = rpcToBlockHeader(blockJson)
        const rawBlock = blockHeader.serialize()
        // const cid = cidForHash('eth-block', ethUtil.toBuffer(block.hash))
        process.stdout.write(rawBlock)
      })
      .catch((err) => {
        console.error(err)
      })
    }

  }
}

function rpcToBlockHeader(block){
  const blockHeader = new EthBlockHeader()
  blockHeader.parentHash = block.parentHash
  blockHeader.uncleHash = block.uncleHash || block.sha3Uncles
  blockHeader.coinbase = block.coinbase || block.miner
  blockHeader.stateRoot = block.stateRoot
  blockHeader.transactionsTrie = blockHeader.transactionsTrie || block.transactionsRoot
  blockHeader.receiptTrie = block.receiptTrie || block.receiptRoot || block.receiptsRoot || ethUtil.SHA3_NULL
  blockHeader.bloom = block.bloom || block.logsBloom
  blockHeader.difficulty = block.difficulty
  blockHeader.number = block.number
  blockHeader.gasLimit = block.gasLimit
  blockHeader.gasUsed = block.gasUsed
  blockHeader.timestamp = block.timestamp
  blockHeader.extraData = block.extraData
  blockHeader.mixHash = block.mixHash
  blockHeader.nonce = block.nonce
  return blockHeader
}