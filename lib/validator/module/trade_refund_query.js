'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  out_trade_no: {
    type: 'string',
    maxLength: 64
  },
  trade_no: {
    type: 'string',
    maxLength: 64
  },
  out_request_no: {
    type: 'string',
    required: true,
    maxLength: 64
  }
};
module.exports = exports['default'];