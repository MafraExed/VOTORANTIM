"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['./service', './strategies', './utils/buildData', './utils/buildRes', 'com/innova/vendor/lodash.get'], function (service, strategies, buildData, buildRes, get) {
  var model = null;
  var petitions = {
    setModel: function setModel(m) {
      model = m;
    },
    returnData: function returnData(_ref) {
      var resolve = _ref.resolve,
          reject = _ref.reject,
          req = _ref.data,
          mParameters = _ref.config,
          _ref$options = _ref.options,
          options = _ref$options === void 0 ? {} : _ref$options;
      return {
        urlParameters: mParameters ? mParameters.parameters : '',
        filters: mParameters ? mParameters.filters : '',
        sorters: mParameters ? mParameters.sorters : '',
        success: function success(data, response) {
          try {
            // const results = get(data, 'NavPostdata.results', []) // Para Innova
            var results = get(data, 'ZAT_VSMM_ASSPOSTDATA.results', []); // Para Acerias

            var _results$filter = results.filter(function (_ref2) {
              var Name = _ref2.Name;
              return Name === 'IV_FUNCNAME';
            }),
                _results$filter2 = _slicedToArray(_results$filter, 1),
                Value = _results$filter2[0].Value;

            resolve({
              data: service["".concat(Value, "Service")](req, buildRes(results), options),
              response: response
            });
          } catch (error) {
            reject(error);
          }
        },
        error: function error(oError) {
          reject(oError);
        }
      };
    },

    /**
     * @function
     * @name find
     * @description - Realizar peticiones de tipo post
     *
     * @private
     * @param {String} path - Ruta a la cual se va hacer request
     * @param {Object} data - Datos para enviar al backend
     * @param {Object} config - ConfiguraciÃ³n para el request
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@Innovainternacional.biz>
     * @version 1.0.0
     */
    find: function find(path, data, config) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var newData = buildData(data);
      var results = Object.keys(newData).map(function (key) {
        return {
          Mandt: '',
          Name: key,
          Value: JSON.stringify(newData["".concat(key)])
        };
      });
      var req = {
        Mandt: '100',
        // NavPostdata: [strategies.post[`${path}`], ...results], // Para Innova
        ZAT_VSMM_ASSPOSTDATA: [strategies.post["".concat(path)]].concat(_toConsumableArray(results)) // Para acerias

      };
      return model.metadataLoaded().then(function () {
        return new Promise(function (resolve, reject) {
          model.create( // '/FioriSet', // Para Innova
          '/ET_VSMM_FIORISet', // Para Acerias
          req, petitions.returnData({
            config: config,
            data: data,
            options: options,
            reject: reject,
            resolve: resolve
          }));
        });
      });
    },

    /**
     * @function
     * @name get
     * @description - Realizar peticiones de tipo get
     *
     * @private
     * @param {String} path - Ruta a la cual se va hacer request
     * @param {Object} config - ConfiguraciÃ³n para el request
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@Innovainternacional.biz>
     * @version 1.0.0
     */
    get: function get(path, config) {
      var req = {
        Mandt: '100',
        // NavPostdata: [strategies.get[`${path}`]], // Para Innova
        ZAT_VSMM_ASSPOSTDATA: [strategies.get["".concat(path)]] // Para Acerias

      };
      return model.metadataLoaded().then(function () {
        return new Promise(function (resolve, reject) {
          model.create( // '/FioriSet', // Para Innova
          '/ET_VSMM_FIORISet', req, petitions.returnData({
            resolve: resolve,
            reject: reject,
            config: config
          }));
        });
      });
    },

    /**
     * @function
     * @name post
     * @description - Realizar peticiones de tipo post
     *
     * @private
     * @param {String} path - Ruta a la cual se va hacer request
     * @param {Object} data - Datos para enviar al backend
     * @param {Object} config - ConfiguraciÃ³n para el request
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@Innovainternacional.biz>
     * @version 1.0.0
     */
    post: function post(path, data, config) {
      var newData = buildData(data);
      var results = Object.keys(newData).map(function (key) {
        return {
          Mandt: '',
          Name: key,
          Value: JSON.stringify(newData["".concat(key)])
        };
      });
      var req = {
        Mandt: '100',
        // NavPostdata: [strategies.post[`${path}`], ...results], // Para Innova
        ZAT_VSMM_ASSPOSTDATA: [strategies.post["".concat(path)]].concat(_toConsumableArray(results)) // Para Acerias

      };
      return model.metadataLoaded().then(function () {
        return new Promise(function (resolve, reject) {
          model.create( // '/FioriSet', // Para Innova
          '/ET_VSMM_FIORISet', // Para Acerias
          req, petitions.returnData({
            resolve: resolve,
            reject: reject,
            data: data,
            config: config
          }));
        });
      });
    },

    /**
     * @function
     * @name update
     * @description - Realizar peticiones de tipo put
     *
     * @private
     * @param {String} path - Ruta a la cual se va hacer request
     * @param {Object} data - Datos para enviar al backend
     * @param {Object} config - ConfiguraciÃ³n para el request
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@Innovainternacional.biz>
     * @version 1.0.0
     */
    update: function update(path, data, config) {
      var newData = buildData(data);
      var results = Object.keys(newData).map(function (key) {
        return {
          Mandt: '',
          Name: key,
          Value: JSON.stringify(newData["".concat(key)])
        };
      });
      var req = {
        Mandt: '100',
        // NavPostdata: [strategies.put[`${path}`], ...results], // Para Innova
        ZAT_VSMM_ASSPOSTDATA: [strategies.put["".concat(path)]].concat(_toConsumableArray(results)) // Para Acerias

      };
      return model.metadataLoaded().then(function () {
        return new Promise(function (resolve, reject) {
          model.create( // '/FioriSet', // Para Innova
          '/ET_VSMM_FIORISet', // Para Acerias
          req, petitions.returnData({
            config: config,
            data: data,
            reject: reject,
            resolve: resolve
          }));
        });
      });
    },
    whoiam: function whoiam() {
      return Promise.resolve();
    },
    isCancel: function isCancel() {
      return false;
    },
    abort: function abort() {}
  };
  return petitions;
});