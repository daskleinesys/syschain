const crypto = require('crypto-js');

class Block {
	constructor(index, txHash, previousHash) {
		this.height = index;
		this.timestamp = Date.now();
		this.txHash = txHash;
		this.previousHash = crypto.SHA256(previousHash).toString(crypto.enc.Hex);
	}
}

function nextBlock(block) {
	const txHash = crypto.SHA256(`hypothetical tx data ${block.height}`).toString(crypto.enc.Hex);
	return new Block(block.height + 1, txHash, block.txHash);
}

const blockchain = [];
blockchain.push(new Block(0, 'Genesis Block - no transactions needed', '0'));
let currentBlock = blockchain[0];

for (let i = 0; i < 10; i += 1) {
	currentBlock = nextBlock(currentBlock);
	blockchain.push(currentBlock);
	console.log(`Block Height: ${currentBlock.height}`);
	console.log(`Transaction Hash Root: ${currentBlock.txHash}`);
	console.log(`Block Previous Hash: ${currentBlock.previousHash}`);
	console.log('--------------------------------------------------');
}

