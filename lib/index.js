'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _urllib = require('urllib');

var _urllib2 = _interopRequireDefault(_urllib);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

var _validator = require('./validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isTest = process.env.NODE_ENV === 'test';
var GETWAY = isTest ? _config2.default.ALIPAY_DEV_GETWAY : _config2.default.ALIPAY_GETWAY;

var Alipay = function () {
  function Alipay() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Alipay);

    this.privKey = options.appPrivKeyFile;
    this.publicKey = options.alipayPubKeyFile;

    if (!this.privKey || !this.publicKey) {
      throw new Error('Invalid appPrivKeyFile or alipayPubKeyFile');
    }
    this.normalizeKeys();
    var omit = ['appPrivKeyFile', 'alipayPubKeyFile'];
    this.options = Object.assign({}, Object.keys(options).reduce(function (acc, val) {
      if (omit.indexOf(val) === -1) {
        acc[val] = options[val];
      }
      return acc;
    }, {}));
  }

  _createClass(Alipay, [{
    key: 'normalizeKeys',
    value: function normalizeKeys() {
      if (this.publicKey.indexOf('BEGIN PUBLIC KEY') === -1) {
        this.publicKey = "-----BEGIN PUBLIC KEY-----\n" + this.publicKey + "\n-----END PUBLIC KEY-----";
      }
      if (this.privKey.indexOf('BEGIN RSA PRIVATE KEY') === -1) {
        this.privKey = "-----BEGIN RSA PRIVATE KEY-----\n" + this.privKey + "\n-----END RSA PRIVATE KEY-----";
      }
    }
  }, {
    key: 'validateBasicParams',
    value: function validateBasicParams(method, basicParams) {
      var params = Object.assign({}, this.options, basicParams, { method: method });
      return _validator2.default.validateBasicParams(params);
    }
  }, {
    key: 'validateAPIParams',
    value: function validateAPIParams(method, options) {
      return _validator2.default.validateAPIParams(method, options);
    }
  }, {
    key: 'validateParams',
    value: function validateParams(method, publicParams, basicParams) {
      var _this = this;

      return _bluebird2.default.all([this.validateBasicParams(method, basicParams), this.validateAPIParams(method, publicParams)]).then(function (result) {
        return Object.assign({}, result[0], { biz_content: JSON.stringify(result[1]) });
      }).then(function (params) {
        params.sign = utils.makeSign(_this.privKey, params);
        return params;
      });
    }
  }, {
    key: 'makeResponse',
    value: function makeResponse(response) {
      var isSucceed = function isSucceed(response) {
        return ['10000'].indexOf(response.code) !== -1;
      };
      var isPermissionDenied = function isPermissionDenied(response) {
        return ['40006'].indexOf(response.code) !== -1;
      };
      var result = {};
      var respType = utils.responseType(response);
      var respData = response[respType];
      if (isSucceed(respData)) {
        result.code = '0';
      } else if (isPermissionDenied(respData)) {
        result.code = '-2';
      } else {
        result.code = '-1';
      }
      result.data = response[respType];
      result.message = _config.RESPONSE_MESSAGE[result.code];

      return result;
    }
  }, {
    key: 'makeRequest',
    value: function makeRequest(params) {
      var _this2 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var httpclient = _urllib2.default.create();
      return httpclient.request(GETWAY, Object.assign({}, {
        data: params,
        dataType: 'json',
        dataAsQueryString: true
      }, options)).then(function (resp) {
        return _this2.makeResponse(resp.data);
      });
    }
  }, {
    key: 'verifyPayment',
    value: function verifyPayment(params) {
      var _this3 = this;

      var isSuccess = function isSuccess() {
        return ['9000'].indexOf(params.resultStatus) !== -1;
      };
      var isProcessing = function isProcessing() {
        return ['8000', '6004'].indexOf(params.resultStatus) !== -1;
      };

      return this.validateAPIParams(_config.METHOD_TYPES.VERIFY_PAYMENT, params).then(function () {
        if (isSuccess()) {
          return _this3.makeResponse(JSON.parse(params.result));
        } else {
          var code = isProcessing() ? '1' : '-1';
          return { code: code, message: _config.RESPONSE_MESSAGE[code] };
        }
      }).catch(function (err) {
        return { code: '-1', message: err.message, data: {} };
      });
    }
  }, {
    key: 'makeNotifyResponse',
    value: function makeNotifyResponse(params) {
      var _this4 = this;

      return _bluebird2.default.resolve().then(function () {
        return _this4.validateAPIParams(_config.METHOD_TYPES.NOTIFY_RESPONSE, params);
      }).then(function () {
        var resp = { sign: params.sign, 'async_notify_response': params, sign_type: params.sign_type };
        return utils.verifySign(_this4.publicKey, resp, ['sign', 'sign_type'], params);
      }).then(function (valid) {
        var code = valid ? '0' : '-2';
        return { code: code, message: _config.RESPONSE_MESSAGE[code], data: params };
      }).catch(function (err) {
        return { code: '-1', message: err.message, data: {} };
      });
    }
  }, {
    key: 'createWebOrderURL',
    value: function createWebOrderURL(publicParams) {
      var basicParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.createWebOrder(publicParams, basicParams).then(function (result) {
        if (result.code === 0) {
          result.data = GETWAY + '?' + result.data;
        }
        return result;
      });
    }
  }, {
    key: 'createPageOrderURL',
    value: function createPageOrderURL(publicParams) {
      var basicParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.createPageOrder(publicParams, basicParams).then(function (result) {
        if (result.code === 0) {
          result.data = GETWAY + '?' + result.data;
        }
        return result;
      });
    }
  }, {
    key: 'createPageOrder',
    value: function createPageOrder(publicParams) {
      var basicParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var sign = void 0;
      return this.validateParams(_config.METHOD_TYPES.CREATE_PAGE_ORDER, publicParams, basicParams).then(function (params) {
        sign = params.sign;
        return utils.makeSignStr(params);
      }).then(function (signStr) {
        return signStr.split('&').reduce(function (acc, cur) {
          var _cur$split = cur.split('='),
              _cur$split2 = _slicedToArray(_cur$split, 2),
              key = _cur$split2[0],
              value = _cur$split2[1];

          return acc + key + '=' + encodeURIComponent(value) + '&';
        }, "").slice(0, -1);
      }).then(function (data) {
        data = data + '&sign=' + encodeURIComponent(sign);
        return { code: 0, message: _config.RESPONSE_MESSAGE[0], data: data };
      }).catch(function (err) {
        return { code: '-1', message: err.message, data: {} };
      });
    }
  }, {
    key: 'createWebOrder',
    value: function createWebOrder(publicParams) {
      var basicParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var sign = void 0;
      return this.validateParams(_config.METHOD_TYPES.CREATE_WEB_ORDER, publicParams, basicParams).then(function (params) {
        sign = params.sign;
        return utils.makeSignStr(params);
      }).then(function (signStr) {
        return signStr.split('&').reduce(function (acc, cur) {
          var _cur$split3 = cur.split('='),
              _cur$split4 = _slicedToArray(_cur$split3, 2),
              key = _cur$split4[0],
              value = _cur$split4[1];

          return acc + key + '=' + encodeURIComponent(value) + '&';
        }, "").slice(0, -1);
      }).then(function (data) {
        data = data + '&sign=' + encodeURIComponent(sign);
        return { code: 0, message: _config.RESPONSE_MESSAGE[0], data: data };
      }).catch(function (err) {
        return { code: '-1', message: err.message, data: {} };
      });
    }

    //Compat

  }, {
    key: 'createOrder',
    value: function createOrder(publicParams) {
      var basicParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.createAppOrder(publicParams, basicParams);
    }
  }, {
    key: 'createAppOrder',
    value: function createAppOrder(publicParams) {
      var basicParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var sign = void 0;
      return this.validateParams(_config.METHOD_TYPES.CREATE_APP_ORDER, publicParams, basicParams).then(function (params) {
        sign = params.sign;
        return utils.makeSignStr(params);
      }).then(function (signStr) {
        return signStr.split('&').reduce(function (acc, cur) {
          var _cur$split5 = cur.split('='),
              _cur$split6 = _slicedToArray(_cur$split5, 2),
              key = _cur$split6[0],
              value = _cur$split6[1];

          return acc + key + '=' + encodeURIComponent(value) + '&';
        }, "").slice(0, -1);
      }).then(function (data) {
        data = data + '&sign=' + encodeURIComponent(sign);
        return { code: 0, message: _config.RESPONSE_MESSAGE[0], data: data };
      }).catch(function (err) {
        return { code: '-1', message: err.message, data: {} };
      });
    }
  }, {
    key: 'queryOrder',
    value: function queryOrder(publicParams) {
      var _this5 = this;

      var basicParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return _bluebird2.default.resolve().then(function () {
        if (!publicParams.out_trade_no && !publicParams.trade_no) {
          throw new Error("outTradeNo and tradeNo can not both omit.");
        }
        return _this5.validateParams(_config.METHOD_TYPES.QUERY_ORDER, publicParams, basicParams).then(function (params) {
          return _this5.makeRequest(params);
        });
      }).catch(function (err) {
        return { code: '-1', message: err.message, data: {} };
      });
    }
  }, {
    key: 'cancelOrder',
    value: function cancelOrder(publicParams) {
      var _this6 = this;

      var basicParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return _bluebird2.default.resolve().then(function () {
        if (!publicParams.out_trade_no && !publicParams.trade_no) {
          throw new Error("outTradeNo and tradeNo can not both omit.");
        }
        return _this6.validateParams(_config.METHOD_TYPES.CANCEL_ORDER, publicParams, basicParams).then(function (params) {
          return _this6.makeRequest(params);
        });
      });
    }
  }, {
    key: 'tradeClose',
    value: function tradeClose(publicParams) {
      var _this7 = this;

      var basicParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return _bluebird2.default.resolve().then(function () {
        if (!publicParams.out_trade_no && !publicParams.trade_no) {
          throw new Error("outTradeNo and tradeNo can not both omit.");
        }
        return _this7.validateParams(_config.METHOD_TYPES.TRADE_CLOSE, publicParams, basicParams).then(function (params) {
          return _this7.makeRequest(params);
        });
      });
    }
  }, {
    key: 'tradeRefund',
    value: function tradeRefund(publicParams) {
      var _this8 = this;

      var basicParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return _bluebird2.default.resolve().then(function () {
        if (!publicParams.out_trade_no && !publicParams.trade_no) {
          throw new Error("outTradeNo and tradeNo can not both omit.");
        }
        return _this8.validateParams(_config.METHOD_TYPES.TRADE_REFUND, publicParams, basicParams).then(function (params) {
          return _this8.makeRequest(params);
        });
      });
    }
  }, {
    key: 'tradeRefundQuery',
    value: function tradeRefundQuery(publicParams) {
      var _this9 = this;

      var basicParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return _bluebird2.default.resolve().then(function () {
        if (!publicParams.out_trade_no && !publicParams.trade_no) {
          throw new Error("outTradeNo and tradeNo can not both omit.");
        }
        return _this9.validateParams(_config.METHOD_TYPES.TRADE_REFUND_QUERY, publicParams, basicParams).then(function (params) {
          return _this9.makeRequest(params);
        });
      });
    }
  }, {
    key: 'billDownloadQuery',
    value: function billDownloadQuery(publicParams) {
      var _this10 = this;

      var basicParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return _bluebird2.default.resolve().then(function () {
        return _this10.validateParams(_config.METHOD_TYPES.BILL_DOWNLOAD_QUERY, publicParams, basicParams).then(function (params) {
          return _this10.makeRequest(params);
        });
      });
    }
  }, {
    key: 'tradePrecreate',
    value: function tradePrecreate(publicParams) {
      var _this11 = this;

      var basicParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return _bluebird2.default.resolve().then(function () {
        return _this11.validateParams(_config.METHOD_TYPES.TRADE_PRECREATE, publicParams, basicParams).then(function (params) {
          return _this11.makeRequest(params);
        });
      });
    }
  }, {
    key: 'tradeSettle',
    value: function tradeSettle(publicParams) {
      var _this12 = this;

      var basicParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return _bluebird2.default.resolve().then(function () {
        return _this12.validateParams(_config.METHOD_TYPES.TRADE_SETTLE, publicParams, basicParams).then(function (params) {
          return _this12.makeRequest(params);
        });
      });
    }
  }, {
    key: 'toaccountTransfer',
    value: function toaccountTransfer(publicParams) {
      var _this13 = this;

      var basicParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return _bluebird2.default.resolve().then(function () {
        return _this13.validateParams(_config.METHOD_TYPES.FUND_TRANS_TOACCOUNT_TRANSFER, publicParams, basicParams).then(function (params) {
          return _this13.makeRequest(params);
        });
      });
    }
  }]);

  return Alipay;
}();

exports.default = Alipay;
module.exports = exports['default'];