const crypto = require('crypto-js');

const { NEW_BLOCK_MIN_TIME, NEW_BLOCK_MAX_TIME } = require('./constants.js');

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
  const hash = crypto
    .SHA256(`${previousBlock.rootHash}${nextBlock.createdAt}${nextBlock.rootHash}${nextBlock.nonce}`)
    .toString(crypto.enc.Hex);
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

module.exports = {
  hex2bin,
  validateBlockFromPrevious,
};
