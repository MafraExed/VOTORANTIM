"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['./errorHandlers', 'sap/ui/core/IconPool', 'sap/ui/core/routing/History', 'sap/ui/core/UIComponent', 'sap/ui/Device', 'com/innova/model/constant', 'com/innova/model/models', 'com/innova/model/numberFormat', 'com/innova/service/petitions', 'com/innova/service/http'],
/**
 * Module dependencies
 * @namespace com.innova.sitrack
 * @param {typeof sap.ui.core.UIComponent} UIComponent
 * @param {typeof sap.ui.core.routing.History} History
 *
 */
function (errorHandlers, IconPool, History, UIComponent, Device, constant, models, numberFormat, petitions, http) {
  return UIComponent.extend('com.innova.sitrack.Component', {
    metadata: {
      manifest: 'json'
    },
    _sContentDensityClass: undefined,
    _sTimeoutId: undefined,
    // TextPool de la aplicaciÃ³n
    _oTextPool: {},

    /**
     * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
     * @public
     * @override
     */
    init: function init() {
      var _this = this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // call the base component's init function
      UIComponent.prototype.init.apply(this, args);
      petitions.setModel(this.getModel('odata'));

      this._bindFonts(); // Set aplications model


      var oMainModel = models.createMainModel();
      this.setModel(oMainModel, 'main'); // eslint-disable-next-line no-console

      // Set store model
      this.setModel(models.createStoreModel(), 'store');
      this.setModel(models.createPaymentModel(), 'payment');
      petitions.setModel(this.getModel('odata'));
      this.fecthInitialize(oMainModel).then(function () {
        // create the views based on the url/hash
        document.title = _this.getMessageTextPool('K061');

        _this.getRouter().initialize();

        _this.hideLoader(300);
      });
    },

    /**
     * The component is destroyed by UI5 automatically.
     * @public
     * @override
     */
    destroy: function destroy() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      // call the base component's destroy function
      UIComponent.prototype.destroy.apply(this, args);
    },

    /**
     * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
     * design mode class should be set, which influences the size appearance of some controls.
     * @public
     * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
     *
     * @version 0.5.0
     */
    getContentDensityClass: function getContentDensityClass() {
      if (this._sContentDensityClass === undefined) {
        // check whether FLP has already set the content density class; do nothing in this case
        if (document.body.classList.contains('sapUiSizeCozy') || document.body.classList.contains('sapUiSizeCompact')) {
          this._sContentDensityClass = '';
        } else if (!Device.support.touch) {
          // apply "compact" mode if touch is not supported
          this._sContentDensityClass = 'sapUiSizeCompact';
        } else {
          // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
          this._sContentDensityClass = 'sapUiSizeCozy';
        }
      }

      return this._sContentDensityClass;
    },

    /**
     * @function
     * @name errorHandler
     * @description - Se encarga de recibir el error de un request.
     *
     * @public
     * @param {Object} e - Data que se recibe del servicio.
     * @param {sap.ui.core.mvc.Controller}  controller - Controllador que llama la funciÃ³n
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    errorHandler: function errorHandler(error) {
      errorHandlers(error);
    },

    /**
     * @function
     * @name getMessageTextPool
     * @description - Retorna un mensaje del modelos de los tÃ­tulos globales de la aplicacion.
     *
     * @public
     * @param {string} sKey String con el nombre de la propiedad a buscar.
     * @returns {string} con el texto encontrado, o error sino se encuentra.
     *
     * @author Edwin Valencia <evalecia@innovainternacional.biz>
     * @version 0.5.0
     */
    getMessageTextPool: function getMessageTextPool(sKey) {
      var oTextPool = this._oTextPool;
      return Object.prototype.hasOwnProperty.call(oTextPool, sKey) ? oTextPool[sKey] : '';
    },

    /**
     * @function
     * @name hideLoader
     * @description - Se encarga de ocultar el loader del index.html.
     *
     * @public
     * @param {int} iDelay - Delay para ocultar el loader.
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    hideLoader: function hideLoader(iDelay) {
      if (iDelay && iDelay > 0) {
        if (this._sTimeoutId) {
          clearTimeout(this._sTimeoutId);
          this._sTimeoutId = null;
        }

        this._sTimeoutId = setTimeout(function () {
          document.getElementById('loader').style.display = 'none';
        }, iDelay);
      }
    },

    /**
     * @function
     * @name showLoader
     * @description - Se encarga de mostrar el loader del index.html.
     *
     * @public
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    showLoader: function showLoader() {
      document.getElementById('loader').style.display = 'block';
    },

    /**
     * @function
     * @name onNavBack()
     * @description - Event handler for navigating back.
     *  It there is a history entry we go one step back in the browser history
     *  If not, it will replace the current entry of the browser history with the master route.
     * @public
     * @returns {void} - No retorna nada
     *
     * @author Edwin Valencia <evalecia@innovainternacional.biz>
     * @version 0.5.0
     */
    onNavBack: function onNavBack() {
      var sPreviousHash = History.getInstance().getPreviousHash();

      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        this.getRouter().navTo('home', {}, {}, true);
      }
    },

    /**
     * @function
     * @name fecthInitialize
     * @description - Se trae el textpool por medio del servicio del oData.
     *
     * @private
     * @param {sap.ui.model.json.JSONModel} oMainModel - Modelo principal de la aplicaciÃ³n
     * @returns {Promise} Promesa de la peticiÃ³n
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0 - se crea la funciÃ³n.
     */
    fecthInitialize: function fecthInitialize(oMainModel) {
      var _this2 = this;

      return petitions.post("".concat(constant.GET_INITIALIZE)).then(function (_ref) {
        var data = _ref.data;
        _this2._oTextPool = _objectSpread({}, data.textPool);
        var _data$sysParams = data.sysParams,
            JWT = _data$sysParams.JWT,
            URL_API = _data$sysParams.URL_API;
        oMainModel.setProperty('/catalog', _objectSpread({}, data.catalog));
        oMainModel.setProperty('/textPool', _this2._oTextPool);
        oMainModel.setProperty('/sysParams', _objectSpread({}, data.sysParams));
        oMainModel.setProperty('/showPayment', data.showPayment);
        oMainModel.setProperty('/zsigc', data.zsigc);
        oMainModel.setProperty('/bukrs', data.bukrs);
        oMainModel.setProperty('/ekgrp', data.ekgrp);
        oMainModel.setProperty('/ekorg', data.ekorg);
        oMainModel.setProperty('/logoAboutInnova', sap.ui.require.toUrl('com/innova/sitrack/img/logo-azul.png')); // Set number format

        var sepmil = data.sysParams.sepmil;
        var sepdec = data.sysParams.sepdec;
        numberFormat.getNumberFormat(sepmil, sepdec);
        numberFormat.getFormatOptions(sepmil, sepdec);
        http.setInstance({
          token: JWT,
          baseURL: URL_API
        });
      });
    },

    /**
     * Refresh token
     * @public
     * @return {void}
     *
     * @version 0.5.0
     */
    refreshToken: function refreshToken() {
      petitions.post("".concat(constant.GET_INITIALIZE)).then(function (_ref2) {
        var data = _ref2.data;
        var _data$sysParams2 = data.sysParams,
            JWT = _data$sysParams2.JWT,
            URL_API = _data$sysParams2.URL_API;
        http.setInstance({
          token: JWT,
          baseURL: URL_API
        });
      });
    },

    /**
     * @function
     * @name _bindFonts
     * @description - Enlaza los iconos de la innova con el Pool de Iconos de SAP.
     *
     * @private
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _bindFonts: function _bindFonts() {
      // extension de libreria de iconos de UI5
      IconPool.addIcon('41', 'innova', 'innovaFonts', 'e900');
      IconPool.addIcon('42', 'innova', 'innovaFonts', 'e901');
      IconPool.addIcon('43', 'innova', 'innovaFonts', 'e902');
      IconPool.addIcon('45', 'innova', 'innovaFonts', 'e903');
      IconPool.addIcon('46', 'innova', 'innovaFonts', 'e904');
      IconPool.addIcon('51', 'innova', 'innovaFonts', 'e905');
      IconPool.addIcon('52', 'innova', 'innovaFonts', 'e906');
      IconPool.addIcon('53', 'innova', 'innovaFonts', 'e907');
      var oTNTConfig = {
        fontFamily: 'SAP-icons-TNT',
        fontURI: sap.ui.require.toUrl('sap/tnt/themes/base/fonts/')
      }; // register TNT icon font

      IconPool.registerFont(oTNTConfig);
    }
  });
});