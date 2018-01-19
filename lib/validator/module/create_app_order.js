'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
  body: {
    type: 'string',
    maxLength: 128
  },
  subject: {
    type: 'string',
    required: true,
    maxLength: 256
  },
  out_trade_no: {
    type: 'string',
    required: true,
    maxLength: 64
  },
  timeout_express: {
    type: 'string',
    maxLength: 6
  },
  total_amount: {
    type: 'string',
    required: true,
    maxLength: 9,
    normalize: utils.normalizeTotalAmount
  },
  seller_id: {
    type: 'string',
    maxLength: 16
  },
  product_code: {
    type: 'string',
    maxLength: 64,
    default: 'QUICK_MSECURITY_PAY'
  },
  goods_type: {
    type: 'enum',
    enums: ['0', '1']
  },
  passback_params: {
    type: 'string',
    maxLength: 512,
    normalize: utils.normalizePassbackParams
  },
  extend_params: utils.extendParams,
  enable_pay_channels: utils.payChannel,
  disable_pay_channels: utils.payChannel,
  promo_params: {
    type: 'string',
    maxLength: 512
  },
  store_id: {
    type: 'string',
    maxLength: 32
  }
};
module.exports = exports['default'];