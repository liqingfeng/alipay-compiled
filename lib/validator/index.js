'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.validateBasicParams = validateBasicParams;
exports.validateAPIParams = validateAPIParams;

var _preset = require('./preset');

var _preset2 = _interopRequireDefault(_preset);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _config = require('../../lib/config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug2.default)('alipay-mobile:parser');

var Validator = function () {
  function Validator(presets, params) {
    _classCallCheck(this, Validator);

    this.result = {};
    this.invalid = false;
    this.message = 'Success';
    this.params = params;
    this.presets = presets;
    this.paramsKeys = Object.keys(params);
    this.presetKeys = Object.keys(presets);
  }

  _createClass(Validator, [{
    key: 'validateRequired',
    value: function validateRequired(checker, key, data) {
      if (checker.required && !data && !checker.default) {
        this.invalid = true;
        this.message = key + ' is required. But Not Found In params.';
      }
    }
  }, {
    key: 'validateEnum',
    value: function validateEnum(checker, key, data) {
      if (checker.type !== 'enum' || !data) return;
      var items = Array.isArray(data) ? data : data.split(',');

      for (var i = 0, len = items.length; i < len; i++) {
        var it = items[i];
        if (it && checker.enums.indexOf(it) === -1) {
          this.invalid = true;
          this.message = 'key: ' + key + ', value: ' + data + '. Not Found In : ' + checker.enums.join(',');
          break;
        }
      }
    }
  }, {
    key: 'validateLength',
    value: function validateLength(checker, key, data) {
      if (!data) return;
      if (key in this.params && !data.length) {
        this.invalid = true;
        this.message = key + '. Length equal 0.';
      } else if (checker.maxLength && data.length > checker.maxLength) {
        this.invalid = true;
        this.message = key + '. Too Long.';
      }
    }
  }, {
    key: 'validateField',
    value: function validateField(checker, key) {
      if (this.presetKeys.indexOf(key) === -1) {
        this.invalid = true;
        this.message = key + ' Parameters should not appear';
      }
    }
  }, {
    key: 'normalize',
    value: function normalize(checker, key, data) {
      if (!data && checker.default) {
        if (typeof checker.default === 'function') {
          data = checker.default();
        } else {
          data = checker.default;
        }
      }
      if (checker.normalize) {
        data = checker.normalize(data);
      }

      return data;
    }
  }, {
    key: 'validate',
    value: function validate(key) {
      var data = this.params[key];
      var checker = this.presets[key];
      debug("key: ", key);
      debug("data: ", data);
      debug("checker: ", checker);

      this.validateRequired(checker, key, data);
      if (this.invalid) return this.invalid;
      data = this.normalize(checker, key, data);
      this.validateEnum(checker, key, data);
      if (this.invalid) return this.invalid;
      this.validateLength(checker, key, data);
      if (this.invalid) return this.invalid;
      this.validateField(checker, key, data);
      if (this.invalid) return this.invalid;
      if (data) {
        this.result[key] = data;
      }
      return this.invalid;
    }
  }, {
    key: 'run',
    value: function run() {
      var _this = this;

      return new _bluebird2.default(function (resolve, reject) {
        for (var i = 0, len = _this.presetKeys.length; i < len; i++) {
          var key = _this.presetKeys[i];
          if (_this.validate(key)) {
            return reject(new Error(_this.message));
          }
        }
        resolve(_this.result);
      });
    }
  }]);

  return Validator;
}();

function validateBasicParams(params) {
  debug("params:", params);
  var instance = new Validator(_preset2.default.Basic, params);
  return instance.run();
}

function validateAPIParams(method, params) {
  var instance = void 0;

  switch (method) {
    case _config.METHOD_TYPES.CREATE_WEB_ORDER:
      {
        instance = new Validator(_preset2.default.CreateWebOrder, params);
        break;
      }
    case _config.METHOD_TYPES.CREATE_APP_ORDER:
      {
        instance = new Validator(_preset2.default.CreateAppOrder, params);
        break;
      }
    case _config.METHOD_TYPES.CREATE_PAGE_ORDER:
      {
        instance = new Validator(_preset2.default.CreatePageOrder, params);
        break;
      }
    case _config.METHOD_TYPES.QUERY_ORDER:
      {
        instance = new Validator(_preset2.default.QueryOrder, params);
        break;
      }
    case _config.METHOD_TYPES.CANCEL_ORDER:
      {
        instance = new Validator(_preset2.default.CancelOrder, params);
        break;
      }
    case _config.METHOD_TYPES.VERIFY_PAYMENT:
      {
        instance = new Validator(_preset2.default.VerifyPayment, params);
        break;
      }
    case _config.METHOD_TYPES.NOTIFY_RESPONSE:
      {
        instance = new Validator(_preset2.default.Notify, params);
        break;
      }
    case _config.METHOD_TYPES.TRADE_CLOSE:
      {
        instance = new Validator(_preset2.default.TradeClose, params);
        break;
      }
    case _config.METHOD_TYPES.TRADE_REFUND:
      {
        instance = new Validator(_preset2.default.TradeRefund, params);
        break;
      }
    case _config.METHOD_TYPES.TRADE_REFUND_QUERY:
      {
        instance = new Validator(_preset2.default.TradeRefundQuery, params);
        break;
      }
    case _config.METHOD_TYPES.BILL_DOWNLOAD_QUERY:
      {
        instance = new Validator(_preset2.default.BillDownloadQuery, params);
        break;
      }
    case _config.METHOD_TYPES.TRADE_PRECREATE:
      {
        instance = new Validator(_preset2.default.TradePrecreate, params);
        break;
      }
    case _config.METHOD_TYPES.TRADE_SETTLE:
      {
        instance = new Validator(_preset2.default.TradeSettle, params);
        break;
      }
    case _config.METHOD_TYPES.FUND_TRANS_TOACCOUNT_TRANSFER:
      {
        instance = new Validator(_preset2.default.ToaccountTransfer, params);
        break;
      }
    default:
      {
        throw new Error('Parser Unknow method type:' + method);
      }
  }
  return instance.run();
}

exports.default = {
  validateAPIParams: validateAPIParams,
  validateBasicParams: validateBasicParams
};