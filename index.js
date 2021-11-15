const crypto = require('crypto-js');

const NEW_BLOCK_MIN_TIME = 30; // in seconds
const NEW_BLOCK_MAX_TIME = 90; // in seconds

class Block {
  /**
   * @param previous {Block}
   * @param createdAt {number} unix timestamp
   * @param rootHash {string} SHA256
   * @param difficulty {number} integer > 0
   * @param nonce {number} integer > 0
   */
  constructor(
    previous,
    createdAt,
    rootHash,
    difficulty,
    nonce,
  ) {
    this.height = previous.height + 1;
    this.createdAt = createdAt;
    this.rootHash = rootHash;
    this.difficulty = difficulty;
    this.nonce = nonce;
    this.previousHash = crypto
      .SHA256(`${previous.rootHash}${createdAt}${rootHash}${nonce}`)
      .toString(crypto.enc.Hex);
  }
}

function createNextBlock(block) {
  const now = Math.floor(Date.now() / 1000);
  let { difficulty } = block;
  if (now - block.createdAt > NEW_BLOCK_MAX_TIME) {
    difficulty -= 1;
  } else if (now - block.createdAt < NEW_BLOCK_MIN_TIME) {
    difficulty += 1;
  }
  difficulty = Math.max(difficulty, 1);
  const rootHash = crypto.SHA256(`hypothetical root hash data is current block height: ${block.height}`).toString(crypto.enc.Hex);
  let nonce = 1;

  while (true) {
    const hash = crypto
      .SHA256(`${block.rootHash}${now}${rootHash}${nonce}`)
      .toString(crypto.enc.Hex);
    if (hash.substring(0, difficulty).split('').every(character => character === 'a')) {
      break;
    }
    nonce += 1;
  }

  return new Block(
    block,
    now,
    rootHash,
    difficulty,
    nonce,
  );
}

const genesisBlock = {
  height: 0,
  createdAt: Math.floor(Date.now() / 1000),
  rootHash: 'Genesis Block - no hash needed',
  difficulty: 0,
  nonce: undefined,
  previousHash: undefined,
}
const blockchain = [genesisBlock];
let currentBlock = blockchain[0];

console.log('sYs Blockchain starting up.')
console.log(`NEW_BLOCK_MIN_TIME: ${NEW_BLOCK_MIN_TIME}s`);
console.log(`NEW_BLOCK_MAX_TIME: ${NEW_BLOCK_MAX_TIME}s`);
console.log('');
console.log('');

for (let i = 0; i < 10; i += 1) {
  const nextBlock = createNextBlock(currentBlock);
  blockchain.push(nextBlock);
  const delta = Math.floor(Date.now() / 1000) - currentBlock.createdAt;
  console.log(`Delta/Mining Time: ${Math.floor(delta / 60)}m ${delta % 60}s`);
  console.log(`Used Nonce: ${nextBlock.nonce}`);
  console.log(`Used Difficulty: ${nextBlock.difficulty}`);
  console.log(`New Block Height: ${nextBlock.height}`);
  console.log('--------------------------------------------------');
  currentBlock = nextBlock;
}
