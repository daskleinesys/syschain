const crypto = require('crypto-js');

class Block {
  /**
   * @param previousBlock {Block}
   * @param createdAt {number} unix timestamp
   * @param rootHash {string} SHA256
   * @param difficulty {number} integer > 0
   * @param nonce {number} integer > 0
   */
  constructor(
    previousBlock,
    createdAt,
    rootHash,
    difficulty,
    nonce,
  ) {
    this.height = previousBlock.height + 1;
    this.createdAt = createdAt;
    this.rootHash = rootHash;
    this.difficulty = difficulty;
    this.nonce = nonce;
    this.previousHash = crypto
      .SHA256(`${previousBlock.rootHash}${createdAt}${rootHash}${nonce}`)
      .toString(crypto.enc.Hex);
  }
}

module.exports = Block;
