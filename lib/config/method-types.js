'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var QUERY_ORDER = exports.QUERY_ORDER = 'alipay.trade.query';
var CREATE_APP_ORDER = exports.CREATE_APP_ORDER = 'alipay.trade.app.pay';
var CREATE_WEB_ORDER = exports.CREATE_WEB_ORDER = 'alipay.trade.wap.pay';
var CREATE_PAGE_ORDER = exports.CREATE_PAGE_ORDER = 'alipay.trade.page.pay';
var TRADE_CLOSE = exports.TRADE_CLOSE = 'alipay.trade.close';
var CANCEL_ORDER = exports.CANCEL_ORDER = 'alipay.trade.cancel';
var TRADE_REFUND = exports.TRADE_REFUND = 'alipay.trade.refund';
var TRADE_SETTLE = exports.TRADE_SETTLE = 'alipay.trade.order.settle';
var TRADE_PRECREATE = exports.TRADE_PRECREATE = 'alipay.trade.precreate';
var TRADE_REFUND_QUERY = exports.TRADE_REFUND_QUERY = 'alipay.trade.fastpay.refund.query';
var BILL_DOWNLOAD_QUERY = exports.BILL_DOWNLOAD_QUERY = 'alipay.data.dataservice.bill.downloadurl.query';
var FUND_TRANS_TOACCOUNT_TRANSFER = exports.FUND_TRANS_TOACCOUNT_TRANSFER = 'alipay.fund.trans.toaccount.transfer';
var VERIFY_PAYMENT = exports.VERIFY_PAYMENT = 'verify.payment.status'; //self define
var NOTIFY_RESPONSE = exports.NOTIFY_RESPONSE = 'notify.response'; //self define

var METHOD_TYPES = exports.METHOD_TYPES = {
  QUERY_ORDER: QUERY_ORDER,
  CREATE_APP_ORDER: CREATE_APP_ORDER,
  CREATE_WEB_ORDER: CREATE_WEB_ORDER,
  CREATE_PAGE_ORDER: CREATE_PAGE_ORDER,
  CANCEL_ORDER: CANCEL_ORDER,
  TRADE_CLOSE: TRADE_CLOSE,
  TRADE_SETTLE: TRADE_SETTLE,
  TRADE_REFUND: TRADE_REFUND,
  TRADE_PRECREATE: TRADE_PRECREATE,
  TRADE_REFUND_QUERY: TRADE_REFUND_QUERY,
  BILL_DOWNLOAD_QUERY: BILL_DOWNLOAD_QUERY,
  FUND_TRANS_TOACCOUNT_TRANSFER: FUND_TRANS_TOACCOUNT_TRANSFER,

  VERIFY_PAYMENT: VERIFY_PAYMENT,
  NOTIFY_RESPONSE: NOTIFY_RESPONSE
};