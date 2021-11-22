const crypto = require('crypto-js');

const Block = require('./Block.js');
const { NEW_BLOCK_MIN_TIME, NEW_BLOCK_MAX_TIME } = require('./constants.js');
const { validateBlockFromPrevious } = require('./validators.js');

function createNextBlock(previousBlock) {
  const now = Math.floor(Date.now() / 1000);
  let { difficulty } = previousBlock;
  if (now - previousBlock.createdAt > NEW_BLOCK_MAX_TIME) {
    difficulty -= 1;
  } else if (now - previousBlock.createdAt < NEW_BLOCK_MIN_TIME) {
    difficulty += 1;
  }
  difficulty = Math.max(difficulty, 1);
  const rootHash = crypto.SHA256(`hypothetical root hash data is current block height: ${previousBlock.height + 1}`).toString(crypto.enc.Hex);
  let nonce = 1;
  let newBlock;

  while (true) {
    newBlock = new Block(
      previousBlock,
      now,
      rootHash,
      difficulty,
      nonce,
    );
    if (validateBlockFromPrevious(previousBlock, newBlock)) {
      break;
    }
    nonce += 1;
  }

  return newBlock;
}

module.exports = createNextBlock;
