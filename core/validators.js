const bitcoinjs = require('bitcoinjs-lib');
const Buffer = require('buffer');
const { createHash } = require('crypto');
const ecc = require('tiny-secp256k1');
const { ECPairFactory } = require('ecpair');

const ECPair = ECPairFactory(ecc);

const {
  NEW_BLOCK_MIN_TIME,
  NEW_BLOCK_MAX_TIME,

  RESOURCE_BASE_GREEN,
  RESOURCE_BASE_WHITE,
  RESOURCE_BASE_BROWN,
  RESOURCE_BASE_WILD,

  RESOURCE_ADVANCED_BLACK,
  RESOURCE_ADVANCED_YELLOW,
  RESOURCE_ADVANCED_BLUE,
  RESOURCE_ADVANCED_WILD,

  RESOURCE_ULTRA_TECH,

  RESOURCE_VICTORY_POINT,

  TRANSACTION_TYPE_TRADE,
  TRANSACTION_TYPE_PRODUCTION,
  TRANSACTION_TYPE_BID,

  CONVERTER_BASE_UNIVERSAL_TRANSLATOR,
} = require('./constants.js');

const validTransactions = [
  TRANSACTION_TYPE_TRADE,
  TRANSACTION_TYPE_PRODUCTION,
  TRANSACTION_TYPE_BID,
];

const validResources = [
  RESOURCE_BASE_GREEN,
  RESOURCE_BASE_WHITE,
  RESOURCE_BASE_BROWN,
  RESOURCE_BASE_WILD,

  RESOURCE_ADVANCED_BLACK,
  RESOURCE_ADVANCED_YELLOW,
  RESOURCE_ADVANCED_BLUE,
  RESOURCE_ADVANCED_WILD,

  RESOURCE_ULTRA_TECH,

  RESOURCE_VICTORY_POINT,

  CONVERTER_BASE_UNIVERSAL_TRANSLATOR,
];

function hex2bin(hex) {
  return (parseInt(hex, 16).toString(2)).padStart(8, '0');
}

/**
 * Validates the 'nextBlock' using 'previousBlock'. This function
 * DOES NOT validate the previousBlock. Only use a previousBlock when you
 * are sure that it is valid (or validate it first).
 *
 * @param previousBlock {Block}
 * @param nextBlock {Block}
 */
function validateBlockFromPrevious(previousBlock, nextBlock) {
  // make sure it's a block
  if (Object.keys(nextBlock).length !== 6) {
    return false;
  }

  // validate height
  if (
    !Number.isInteger(nextBlock.height)
    || nextBlock.height !== previousBlock.height + 1
  ) {
    return false;
  }

  // validate timestamp
  const now = Math.floor(Date.now() / 1000);
  if (
    !Number.isInteger(nextBlock.createdAt)
    || nextBlock.createdAt > now
    || nextBlock.createdAt < previousBlock.createdAt
  ) {
    return false;
  }

  // validate rootHash
  if (
    typeof nextBlock.rootHash !== 'string'
    || !/^[a-f0-9]{64}$/gi.test(nextBlock.rootHash)
  ) {
    return false;
  }

  // validate difficulty
  let targetDifficulty = previousBlock.difficulty;
  if (nextBlock.createdAt - previousBlock.createdAt > NEW_BLOCK_MAX_TIME) {
    targetDifficulty -= 1;
  } else if (nextBlock.createdAt - previousBlock.createdAt < NEW_BLOCK_MIN_TIME) {
    targetDifficulty += 1;
  }
  if (nextBlock.difficulty !== targetDifficulty) {
    return false;
  }

  // validate nonce
  if (
    !Number.isInteger(nextBlock.nonce)
    || nextBlock.nonce < 0
  ) {
    return false;
  }

  // validate hash connecting to previous block
  const hash = createHash('sha256')
    .update(`${previousBlock.rootHash}${nextBlock.createdAt}${nextBlock.rootHash}${nextBlock.nonce}`)
    .digest('hex');
  if (nextBlock.previousHash !== hash) {
    return false;
  }
  let valid = true;
  for (let i = 0; i < targetDifficulty; i += 1) {
    const hexPart = Math.floor(i / 8);
    const hex = hash.substring(hexPart * 2, (hexPart * 2) + 2);
    const byte = hex2bin(hex);
    const bit = i % 8;
    if (byte[bit] !== '0') {
      valid = false;
      break;
    }
  }
  if (!valid) {
    return false;
  }

  return true;
}

/**
 * Validates the given 'transaction'. This function
 * DOES NEITHER check if the "in" transactions exist NOR if they
 * or unspent.
 *
 * @param transaction {Transaction}
 * @param usedTransactionsById {Object}
 */
function validteTransaction(transaction, usedTransactionsById) {
  // check input
  if (transaction == null || usedTransactionsById == null) {
    return false;
  }
  if (!validTransactions.includes(transaction.type)) {
    return false;
  }

  // do not allow transactions from the future
  if (!Number.isInteger(transacion.createdAt) || transacion.createdAt > new Date()) {
    return false;
  }

  // make sure every "in" has the required fields to create the transaction hash
  if (
    !Array.isArray(transacion.in)
    || transacion.in.length < 1
    || transacion.in.some(in => in == null || typeof in.transactionId !== 'string' || !Number.isInteger(in.outIndex))
  ) {
    return false;
  }

  // make sure every "out" has the required fields to create the transaction hash
  if (
    !Array.isArray(transacion.out)
    || transacion.out.length < 1
    || transacion.out.some(out => out == null || !validTransactions.includes(out.resource) || !Number.isInteger(out.amount) || typeof out.address !== 'string')
  ) {
    return false;
  }

  // check if the hash/id is valid
  const hash = createHash('sha256')
    .update([
      transaction.type,
      transaction.createdAt,
      transaction.in.reduce(({ transactionId, outIndex }) => [transactionId, outIndex].join('.')),
      transaction.out.reduce(({ resource, amount, address }) => [resource, amount, address].join('.')),
    ].join('.'))
    .digest('hex');
  if (hash !== transaction.hash) {
    return false;
  }

  // validate "ins"
  if (transacion.in.some(({ transactionId, outIndex, publicKey, signature }) => {
    const publicKeyBin = Buffer.from(publicKey, 'hex');
    const ecPair = ECPair.fromPublicKey(publicKeyBin);
    const { address } = bitcoinjs.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network: BITCOINJS_NETWORK,
    });
    if (
      usedTransactionsById[transactionId] == null
      || !Array.isArray(usedTransactionsById[transactionId].out)
      || usedTransactionsById[transactionId].out[outIndex] == null
      || address !== usedTransactionsById[transactionId].out[outIndex].address
      || !ecPair.verify(transaction.hash, signature)
    ) {
      return true;
    }
    return false;
  })) {
    return false;
  }

  // 1. validate every "out":
  //   b. valid address
  //   c. amount of all out resources must match the sum of all in resources
}

function validateTransactionUnspent(transaction, blockchain, transactionsForNextBlock) {
  // validate for every "transaction.in" if
  //   * it exists in blockchain
  //   * it is not spent in blockchain
  //   * it is not already used in transactionsForNextBlock (double spend!)
}

module.exports = {
  hex2bin,
  validateBlockFromPrevious,
};
