'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.makeSignStr = makeSignStr;
exports.signAlgorithm = signAlgorithm;
exports.makeSign = makeSign;
exports.verifySign = verifySign;
exports.responseType = responseType;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeSignStr(params) {
  var omit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['sign'];

  return Object.keys(params).sort().filter(function (key) {
    return params[key] && omit.indexOf(key) === -1;
  }).map(function (key) {
    var value = _typeof(params[key]) === 'object' ? JSON.stringify(params[key]) : params[key];
    return key + '=' + value + '';
  }).join('&').trim();
}

function signAlgorithm(signType) {
  return _config2.default.ALIPAY_ALGORITHM_MAPPING[signType];
}

function makeSign(privKey, params) {
  var signStr = makeSignStr(params);
  var algorithm = signAlgorithm(params.sign_type);
  var signer = _crypto2.default.createSign(algorithm);
  signer.update(signStr, params.charset);
  return signer.sign(privKey, "base64");
}

function verifySign(publicKey, response, omit, options) {
  var type = responseType(response);
  if (!type || !response.sign) {
    return false;
  } else {
    // const sign = Base64.decode(response.sign)
    var sign = response.sign;
    var resp = makeSignStr(response[type], omit);
    var algorithm = signAlgorithm(options.sign_type);
    var verify = _crypto2.default.createVerify(algorithm);
    verify.update(resp, options.charset);
    return verify.verify(publicKey, sign, 'base64');
  }
}

function responseType(response) {
  var type = Object.keys(_config2.default.ALIPAY_API_LIST).map(function (name) {
    return name.replace(/\./g, '_');
  }).find(function (api) {
    return api + '_response' in response;
  });
  if (type) return type + '_response';
}