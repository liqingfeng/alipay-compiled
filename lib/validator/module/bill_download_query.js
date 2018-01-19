'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  bill_type: {
    type: 'string',
    required: true,
    maxLength: 10
  },
  bill_date: {
    type: 'string',
    required: true,
    maxLength: 15
  }
};
module.exports = exports['default'];