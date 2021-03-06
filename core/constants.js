const NEW_BLOCK_MIN_TIME = 5; // in seconds
const NEW_BLOCK_MAX_TIME = 15; // in seconds

const RESOURCE_BASE_GREEN = 'RESOURCE_BASE_GREEN';
const RESOURCE_BASE_WHITE = 'RESOURCE_BASE_WHITE';
const RESOURCE_BASE_BROWN = 'RESOURCE_BASE_BROWN';
const RESOURCE_BASE_WILD = 'RESOURCE_BASE_WILD'; // joker resouce, can be used for any base color BUT only for trading

const RESOURCE_ADVANCED_BLACK = 'RESOURCE_ADVANCED_BLACK';
const RESOURCE_ADVANCED_YELLOW = 'RESOURCE_ADVANCED_YELLOW';
const RESOURCE_ADVANCED_BLUE = 'RESOURCE_ADVANCED_BLUE';
const RESOURCE_ADVANCED_WILD = 'RESOURCE_ADVANCED_WILD'; // joker resouce, can be used for any advanced color BUT only for trading

const RESOURCE_ULTRA_TECH = 'RESOURCE_ULTRA_TECH';

const RESOURCE_VICTORY_POINT = 'RESOURCE_VICTORY_POINT';

const TRANSACTION_TYPE_TRADE = 'TRANSACTION_TYPE_TRADE';
const TRANSACTION_TYPE_PRODUCTION = 'TRANSACTION_TYPE_PRODUCTION';
const TRANSACTION_TYPE_BID = 'TRANSACTION_TYPE_BID';

const CONVERTER_BASE_UNIVERSAL_TRANSLATOR = 'CONVERTER_BASE_UNIVERSAL_TRANSLATOR';

const BITCOINJS_NETWORK = { pubKeyHash: parseInt('77', 16) };

module.exports = {
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

  BITCOINJS_NETWORK,
};
