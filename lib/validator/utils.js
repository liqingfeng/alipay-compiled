'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ALIPAY_PAYMENT_MESSAGE = exports.payChannel = exports.extendParams = undefined;
exports.createTimeStamp = createTimeStamp;
exports.normalizeTotalAmount = normalizeTotalAmount;
exports.normalizePassbackParams = normalizePassbackParams;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createTimeStamp() {
  return (0, _moment2.default)().format('YYYY-MM-DD HH:mm:ss');
}

function normalizeTotalAmount(value) {
  return Number(value).toFixed(2);
}

function normalizePassbackParams(params) {
  return params && encodeURI(params);
}

var extendParams = exports.extendParams = {
  type: 'enum',
  enums: ['sys_service_provider_id', 'needBuyerRealnamed', 'TRANS_MEMO']
};

var payChannel = exports.payChannel = {
  type: 'enum',
  enums: ['balance', 'moneyFund', 'coupon', 'pcredit', 'pcreditpayInstallment', 'creditCard', 'creditCardExpress', 'creditCardCartoon', 'credit_group', 'debitCardExpress', 'mcard', 'pcard', 'promotion', 'voucher', 'point', 'mdiscount', 'bankPay']
};

var ALIPAY_PAYMENT_MESSAGE = exports.ALIPAY_PAYMENT_MESSAGE = {
  9000: '订单支付成功',
  8000: '正在处理中，支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态',
  4000: '订单支付失败',
  5000: '重复请求',
  6001: '用户中途取消',
  6002: '网络连接出错',
  6004: '支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态'
};