const crypto = require('crypto-js');

const { NEW_BLOCK_MIN_TIME, NEW_BLOCK_MAX_TIME } = require('./core/constants.js');
const createNextBlock = require('./core/mining.js');

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

for (let i = 0; i < 50; i += 1) {
  const startMinig = Math.floor(Date.now() / 1000);
  const nextBlock = createNextBlock(currentBlock);
  const finishMining = Math.floor(Date.now() / 1000);
  const delta = finishMining - startMinig;
  console.log(`Delta/Mining Time: ${Math.floor(delta / 60)}m ${delta % 60}s`);
  console.log(`Used Nonce: ${nextBlock.nonce}`);
  console.log(`Used Difficulty: ${nextBlock.difficulty}`);
  console.log(`New Block Height: ${nextBlock.height}`);
  console.log('--------------------------------------------------');
  blockchain.push(nextBlock);
  currentBlock = nextBlock;
}
