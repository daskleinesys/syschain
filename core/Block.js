const { createHash } = require('crypto');

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
    this.previousHash = createHash('sha256')
      .update(`${previousBlock.rootHash}${createdAt}${rootHash}${nonce}`)
      .digest('hex');
  }
}

module.exports = Block;
