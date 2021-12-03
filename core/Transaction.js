const crypto = require('crypto-js');

const {
  TRANSACTION_TYPE_TRADE,
  TRANSACTION_TYPE_PRODUCTION,

  RESOURCE_BASE_GREEN,
  RESOURCE_BASE_WHITE,

  RESOURCE_ADVANCED_BLACK,

  RESOURCE_VICTORY_POINT,

  CONVERTER_BASE_UNIVERSAL_TRANSLATOR,
} = require('./constants.js');

// example trade transaction
// player 1 trades two white resources for three greens to player 2
// "in" has no resources specified as ALL the resources of a specified transaction have to be spent
const exampleTrade = {
  type: TRANSACTION_TYPE_TRADE, // trade between two players
  createdAt: 1638521752, // unix timestamp when the transaction is created
  hash: '...', // sha256 hash generated by type/time and in/out
  in: [
    {
      transactionId: '...', // hash of a previous transaction (e.g. resources of player 1)
      outIndex: 0, // index of the out entry in the transaction specified by trancactionId
      signature: '...', // signature of the transaction hash, used as proof that the user is allowed to spend the resources (of the given transactionId + outIndex combination)
    },
    {
      transactionId: '...', // hash of another previous transaction (e.g. resources of player 2)
      outIndex: 0, // index of the out entry in the transaction specified by trancactionId
      signature: '...', // signature of the transaction hash, used as proof that the user is allowed to spend the resources (of the given transactionId + outIndex combination)
    },
  ],
  out: [
    {
      resource: RESOURCE_BASE_GREEN, // the resource that is payed/transfered
      amount: 3, // amount to be traded (int only)
      publicKey: '...', // public key of the player receiving the resource (e.g. player 2)
    },
    {
      resource: RESOURCE_BASE_WHITE, // the resource that is payed/transfered
      amount: 2, // amount to be traded (int only)
      publicKey: '...', // public key of the player receiving the resource (e.g. player 1)
    },
    {
      resource: RESOURCE_BASE_WHITE, // some change, as player 2 had more than two white
      amount: 2, // amount to be traded (int only)
      publicKey: '...', // public key of the player receiving the resource (e.g. player 2)
    },
  ],
};

// example production transaction
// one converter has to be used
// multiple unspent tranaction outputs can be used as payment
// one converter that was created by a previous transaction has to be used, a converter doesnt get "spent",
// but can be re-used after some cooldown
const exampleProduction = {
  type: TRANSACTION_TYPE_PRODUCTION,
  createdAt: 1638523071,
  hash: '...','
  in: [
    {
      transactionId: '...', // hash of a previous transaction (e.g. resources of a player needed for the converter)
      outIndex: 0, // index of the out entry in the transaction specified by trancactionId
      signature: '...', // signature of the transaction hash, used as proof that the user is allowed to spend the resources (of the given transactionId + outIndex combination)
    },
    {
      transactionId: '...', // hash of a previous transaction (e.g. the converter used by the player)
      outIndex: 0, // index of the out entry in the transaction specified by trancactionId
      signature: '...', // signature of the transaction hash, used as proof that the user is allowed to spend the resources (of the given transactionId + outIndex combination)
    },
  ],
  out: [
    {
      resource: RESOURCE_VICTORY_POINT, // the victory points generated by the converter
      amount: 1, // amount that is generated
      publicKey: '...', // public key of the player receiving the victory points (usually the one that payed the resources)
    },
    {
      resource: RESOURCE_ADVANCED_BLACK, // the resource that is generated
      amount: 1, // amount that is generated
      publicKey: '...', // public key of the player receiving the resources (usually the one that payed the resources)
    },
    {
      resource: RESOURCE_BASE_WHITE, // some change if more than necessary was paid to the converter
      amount: 2, // amount of the change
      publicKey: '...', // public key of the player receiving the change (usually the one that payed the resources)
    },
  ],
};

class Transaction {
  constructor(
    type,
    createdAt,
    in,
    out,
  ) {
    this.type = type;
    this.createdAt = createdAt;
    this.in = in;
    this.out = out;
    this.hash = crypto
      .SHA256([
        type,
        createdAt,
        in.reduce(({ transactionId, outIndex }) => [transactionId, outIndex].join('.')),
        out.reduce(({ resource, amount, publicKey }) => [resource, amount, publicKey].join('.')),
      ].join('.'))
      .toString(crypto.enc.Hex);
  }
}

module.exports = Transaction;