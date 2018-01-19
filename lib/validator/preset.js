'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

var _notify = require('./module/notify');

var _notify2 = _interopRequireDefault(_notify);

var _trade_close = require('./module/trade_close');

var _trade_close2 = _interopRequireDefault(_trade_close);

var _trade_settle = require('./module/trade_settle');

var _trade_settle2 = _interopRequireDefault(_trade_settle);

var _trade_refund = require('./module/trade_refund');

var _trade_refund2 = _interopRequireDefault(_trade_refund);

var _query_order = require('./module/query_order');

var _query_order2 = _interopRequireDefault(_query_order);

var _create_app_order = require('./module/create_app_order');

var _create_app_order2 = _interopRequireDefault(_create_app_order);

var _create_web_order = require('./module/create_web_order');

var _create_web_order2 = _interopRequireDefault(_create_web_order);

var _create_page_order = require('./module/create_page_order');

var _create_page_order2 = _interopRequireDefault(_create_page_order);

var _cancel_order = require('./module/cancel_order');

var _cancel_order2 = _interopRequireDefault(_cancel_order);

var _verify_payment = require('./module/verify_payment');

var _verify_payment2 = _interopRequireDefault(_verify_payment);

var _trade_precreate = require('./module/trade_precreate');

var _trade_precreate2 = _interopRequireDefault(_trade_precreate);

var _trade_refund_query = require('./module/trade_refund_query');

var _trade_refund_query2 = _interopRequireDefault(_trade_refund_query);

var _bill_download_query = require('./module/bill_download_query');

var _bill_download_query2 = _interopRequireDefault(_bill_download_query);

var _toaccount_transfer = require('./module/toaccount_transfer');

var _toaccount_transfer2 = _interopRequireDefault(_toaccount_transfer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var Basic = {
  app_id: {
    type: 'string',
    required: true,
    maxLength: 32
  },
  method: {
    type: 'string',
    required: true,
    maxLength: 128
  },
  format: {
    type: 'string',
    default: 'JSON',
    maxLength: 40
  },
  return_url: { //用于网页支付回调
    type: 'string',
    maxLength: 256
  },
  charset: {
    type: 'string',
    required: true,
    default: 'utf-8',
    maxLength: 10
  },
  sign_type: {
    type: 'string',
    required: true,
    default: 'RSA2',
    maxLength: 10
  },
  timestamp: {
    type: 'string',
    required: true,
    maxLength: 19,
    default: utils.createTimeStamp
  },
  version: {
    type: 'string',
    required: true,
    default: '1.0',
    maxLength: 3
  },
  notify_url: {
    type: 'string',
    maxLength: 256
  }
};

exports.default = {
  Basic: Basic,
  Notify: _notify2.default,
  VerifyPayment: _verify_payment2.default,
  CreateAppOrder: _create_app_order2.default,
  CreateWebOrder: _create_web_order2.default,
  CreatePageOrder: _create_page_order2.default,
  QueryOrder: _query_order2.default,
  TradeSettle: _trade_settle2.default,
  CancelOrder: _cancel_order2.default,
  TradeClose: _trade_close2.default,
  TradeRefund: _trade_refund2.default,
  TradePrecreate: _trade_precreate2.default,
  TradeRefundQuery: _trade_refund_query2.default,
  BillDownloadQuery: _bill_download_query2.default,
  ToaccountTransfer: _toaccount_transfer2.default
};
module.exports = exports['default'];