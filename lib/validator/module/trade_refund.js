'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
  out_trade_no: {
    type: 'string',
    maxLength: 64
  },
  trade_no: {
    type: 'string',
    maxLength: 64
  },
  refund_amount: {
    type: 'string',
    required: true,
    maxLength: 9,
    normalize: utils.normalizeTotalAmount
  },
  refund_reason: {
    type: 'string',
    maxLength: 256
  },
  out_request_no: {
    type: 'string',
    maxLength: 64
  },
  operator_id: {
    type: 'string',
    maxLength: 30
  },
  store_id: {
    type: 'string',
    maxLength: 32
  },
  terminal_id: {
    type: 'string',
    maxLength: 32
  }
};
module.exports = exports['default'];