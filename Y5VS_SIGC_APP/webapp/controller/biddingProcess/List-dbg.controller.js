"use strict";

var _excluded = ["status"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['../BaseController', 'com/innova/sigc/formatter/date', 'com/innova/sigc/formatter/formatStatus', 'com/innova/sigc/model/constant', 'com/innova/sigc/model/session/SessionStorageModel', 'com/innova/sigc/service/http', 'com/innova/sigc/utils/isEmpty'], function (Controller, formatDate, formatStatus, constant, SessionStorageModel, http, isEmpty) {
  return Controller.extend('com.innova.sigc.controller.biddingProcess.List', {
    formatter: {
      formatDate: formatDate
    },

    /* =========================================================== */

    /* begin: lifecycle methods                                    */

    /* =========================================================== */

    /**
     * @function
     * @name onInit
     * @description - Se ejecuta cuando se renderiza por primera vez la vista.
     *
     * @private
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onInit: function onInit() {
      this._oModel = new SessionStorageModel('PROCESS_LIST', {
        data: []
      });
      this.setModel(this._oModel);
      this._oContentPage = this.byId('page');
      this._oProcessTable = this.byId('processTable');
      this.getRouter().getRoute('listBiddingProcesses').attachPatternMatched(this._onListProcessesMatched, this);
    },

    /* =========================================================== */

    /* finish: lifecycle methods                                   */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */

    /**
     * @function
     * @name onItemSelect
     * @description - Encargado de manejar el evento press del ColumnListItem
     *
     * @public
     * @param {sap.m.ColumnListItem} oItem - Item seleccionado
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onItemPress: function onItemPress(oItem) {
      this.getRouter().navTo('manageBiddingProcess', {
        query: window.encodeURIComponent(oItem.getBindingContext().getProperty('numProc'))
      }, {}, true);
    },

    /* =========================================================== */

    /* finish: event handlers                                      */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: internal methods                                     */

    /* =========================================================== */

    /**
     * @function
     * @name _onListProcessesMatched
     * @description - Se ejecuta cuando se navega a la ruta manage-requests.
     *
     * @private
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _onListProcessesMatched: function _onListProcessesMatched() {
      var _this = this;

      var req = this._getReq();

      Promise.resolve(this._oContentPage.setBusy(true)).then(http.post.bind(http, constant.api.PROCESS_FILTER_PATH, req)).then(function (_ref) {
        var data = _ref.data;

        _this._oModel.setData({
          data: _this._buildProcessStatus({
            data: data,
            i18n: _this.getResourceBundle()
          }),
          req: req
        });
      }).catch(this.errorHandler.bind(this)).then(this._oContentPage.setBusy.bind(this._oContentPage, false));
    },

    /**
     * @function
     * @name _buildProcessStatus
     * @description - Build the process status
     *
     * @private
     * @param {object} context - Data to build the process status
     * @param {object} context.data - Process data
     * @param {object} context.i18n - Resource bundle
     * @returns {object[]} - Array of process with formated status
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildProcessStatus: function _buildProcessStatus(_ref2) {
      var data = _ref2.data,
          i18n = _ref2.i18n;
      return data.map(function (_ref3) {
        var status = _ref3.status,
            el = _objectWithoutProperties(_ref3, _excluded);

        return _objectSpread(_objectSpread({}, el), {}, {
          status: formatStatus({
            status: status,
            i18n: i18n
          })
        });
      });
    },

    /**
     * @function
     * @name _getReq
     * @description -Get req object
     *
     * @private
     * @returns {object} - req
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _getReq: function _getReq() {
      var store = this.getOwnerComponent().getModel('store');
      var req = store.getProperty('/req');

      if (isEmpty(req)) {
        return this._oModel.getProperty('/req');
      }

      return req;
    }
    /* =========================================================== */

    /* finish: internal methods                                    */

    /* =========================================================== */

  });
});