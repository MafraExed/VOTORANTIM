"use strict";

var _excluded = ["JWT", "URL_API", "DELAY"];

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['./errorHandlers', 'sap/m/MessageBox', 'sap/ui/core/IconPool', 'sap/ui/core/routing/History', 'sap/ui/core/UIComponent', 'sap/ui/Device', 'com/innova/sigc/model/constant', 'com/innova/sigc/model/models', 'com/innova/sigc/model/numberFormat', 'com/innova/sigc/model/searchHelp/SearchHelp', 'com/innova/sigc/service/petitions', 'com/innova/sigc/service/http'],
/**
 * Module dependencies
 * @namespace com.innova.sigc
 * @param {typeof sap.m.MessageBox} MessageBox
 * @param {typeof sap.ui.core.UIComponent} UIComponent
 * @param {typeof sap.ui.core.routing.History} History
 *
 */
function (errorHandlers, MessageBox, IconPool, History, UIComponent, Device, constant, models, numberFormat, SearchHelp, petitions, http) {
  return UIComponent.extend('com.innova.sigc.Component', {
    metadata: {
      manifest: 'json'
    },
    _sContentDensityClass: undefined,
    _sTimeoutId: undefined,
    _sMUserSessTimeoutId: undefined,
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
      this.setModel(models.createStoreModel(), 'store'); // set

      this.setModel(models.createCriteriaModel(), 'criteria'); // set questions model

      this.setModel(models.createQuestionModel(), 'questions');
      petitions.setModel(this.getModel('odata'));
      this.fecthInitialize(oMainModel).then(this._fetchUserInfo.bind(this, oMainModel)).then(this.fetchLanguage.bind(this, oMainModel)).then(this.fetchCountries.bind(this, oMainModel)).then(this.fetchTypeId.bind(this, oMainModel)).then(function () {
        // create the views based on the url/hash
        _this.getRouter().initialize();

        _this.hideLoader(300);
      }).catch(errorHandlers.bind(this));
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
     * @version 1.0.0
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
     * Refresh token
     * @public
     * @return {void}
     *
     * @version 1.0.0
     */
    refreshToken: function refreshToken() {
      petitions.post("".concat(constant.GET_INITIALIZE)).then(function (_ref) {
        var data = _ref.data;
        var _data$sysParams = data.sysParams,
            JWT = _data$sysParams.JWT,
            URL_API = _data$sysParams.URL_API;
        http.setInstance({
          token: JWT,
          baseURL: URL_API
        });
      });
    },

    /**
     * @function
     * @name errorHandler
     * @description - Se encarga de recibir el error de un request.
     *
     * @public
     * @param {Object} error - Data que se recibe del servicio.
     * @param {sap.ui.core.mvc.Controller}  controller - Controllador que llama la funciÃ³n
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    errorHandler: function errorHandler(error, controller) {
      errorHandlers(error, controller);
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
     * @version 1.0.0
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
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
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
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
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
     * @version 1.0.0
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
     * @version 1.0.0 - se crea la funciÃ³n.
     */
    fecthInitialize: function fecthInitialize(oMainModel) {
      var _this2 = this;

      return petitions.post("".concat(constant.GET_INITIALIZE)).then(function (_ref2) {
        var data = _ref2.data;
        var bukrs = data.bukrs,
            ekgrp = data.ekgrp,
            ekorg = data.ekorg;
        _this2._oTextPool = _objectSpread({}, data.textPool);

        var _data$sysParams2 = data.sysParams,
            JWT = _data$sysParams2.JWT,
            URL_API = _data$sysParams2.URL_API,
            _data$sysParams2$DELA = _data$sysParams2.DELAY,
            DELAY = _data$sysParams2$DELA === void 0 ? 3600 : _data$sysParams2$DELA,
            sysParams = _objectWithoutProperties(_data$sysParams2, _excluded);

        oMainModel.setProperty('/sysParams', _objectSpread({}, sysParams));
        oMainModel.setProperty('/bukrs', bukrs);
        oMainModel.setProperty('/ekgrp', ekgrp);
        oMainModel.setProperty('/ekorg', ekorg);
        oMainModel.setProperty('/logoAboutInnova', sap.ui.require.toUrl('com/innova/sigc/img/logo-azul.png')); // Set number format

        var sepmil = data.sysParams.sepmil;
        var sepdec = data.sysParams.sepdec;
        numberFormat.getNumberFormat(sepmil, sepdec);
        numberFormat.getFormatOptions(sepmil, sepdec);
        http.setInstance({
          token: JWT,
          baseURL: URL_API
        });

        _this2._managingUserSessions(DELAY);
      });
    },
    _fetchUserInfo: function _fetchUserInfo(oMainModel) {
      var uname = oMainModel.getProperty('/sysParams/UNAME');
      var req = new SearchHelp('ERNAM');
      req.setFCODE1(uname);
      return petitions.post(constant.GET_SEARCH_HELP, req).then(function (_ref3) {
        var _data$data, _data$data$;

        var data = _ref3.data;
        oMainModel.setProperty('/sysParams/FULLNAME', (_data$data = data.data) === null || _data$data === void 0 ? void 0 : (_data$data$ = _data$data[0]) === null || _data$data$ === void 0 ? void 0 : _data$data$.FTEXT);
      });
    },

    /**
     * @function
     * @name fetchLanguage
     * @description - Fetches the language from the backend.
     *
     * @private
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    fetchLanguage: function fetchLanguage(oMainModel) {
      var _this3 = this;

      document.title =
      /** @type {*} */
      this.getModel('i18n').getResourceBundle().getText('title');
      return petitions.post(constant.GET_SEARCH_HELP, new SearchHelp('SPRAS')).then(function (_ref4) {
        var data = _ref4.data;
        oMainModel.setProperty('/languages', data.spras);
        oMainModel.setProperty('/currentLanguage', _this3.getCookieLanguage());
      });
    },

    /**
     * @function
     * @name fetchCountries
     * @description - Fetches the countries from the external api.
     *
     * @private
     * @returns {Promise}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    fetchCountries: function fetchCountries(oMainModel) {
      return http.get("".concat(constant.api.GET_COUNTRIES_HELP, "?spras=").concat(this.getCookieLanguage()), new SearchHelp('COUNTRIES')).then(function (_ref5) {
        var data = _ref5.data;
        oMainModel.setProperty('/countries', data);
      });
    },

    /**
     * @function
     * @name fetchTypeId
     * @description - Fetches the typeId from the external api.
     *
     * @private
     * @returns {Promise}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    fetchTypeId: function fetchTypeId(oMainModel) {
      return http.get("".concat(constant.api.GET_TYPEID_HELP, "?spras=").concat(this.getCookieLanguage()), new SearchHelp('typeId')).then(function (_ref6) {
        var data = _ref6.data;
        oMainModel.setProperty('/typeId', data);
      });
    },

    /**
     * @function
     * @name getCookieLanguage
     * @description - Get the language from the cookie.
     *
     * @private
     * @returns {string} - Language from the cookie.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    getCookieLanguage: function getCookieLanguage() {
      var _res, _res$split;

      var name = 'sap-usercontext=';
      var cDecoded = decodeURIComponent(document.cookie);
      var cArr = cDecoded.split('; ');
      /** @type {string}  */

      var res = '';
      cArr.forEach(function (val) {
        if (val.indexOf(name) === 0) res = val.substring(name.length);
      });
      var sapLang = (_res = res) === null || _res === void 0 ? void 0 : (_res$split = _res.split('&')) === null || _res$split === void 0 ? void 0 : _res$split.find(function (q) {
        return q.match(/sap-language/);
      });
      return sapLang ? sapLang.split('=')[1] : 'ES';
    },

    /**
     * @function
     * @name _bindFonts
     * @description - Enlaza los iconos de la innova con el Pool de Iconos de SAP.
     *
     * @private
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _bindFonts: function _bindFonts() {
      var oTNTConfig = {
        fontFamily: 'SAP-icons-TNT',
        fontURI: sap.ui.require.toUrl('sap/tnt/themes/base/fonts/')
      }; // register TNT icon font

      IconPool.registerFont(oTNTConfig);
    },

    /**
     * @function
     * @name _managingUserSessions
     * @description - Mananges the user sessions.
     *
     * @private
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _managingUserSessions: function _managingUserSessions(iDelay) {
      var _this4 = this;

      var i18nModel =
      /** @type {sap.ui.model.resource.ResourceModel} */
      this.getModel('i18n');
      var i18n = i18nModel.getResourceBundle(); // @ts-ignore

      var key = i18n.getText('Commons.0043');

      if (this._sMUserSessTimeoutId) {
        clearTimeout(this._sMUserSessTimeoutId);
        this._sMUserSessTimeoutId = null;
      }

      this._sMUserSessTimeoutId = setTimeout(function () {
        // @ts-ignore
        MessageBox.warning(i18n.getText('Commons.0044'), {
          actions: [key],
          emphasizedAction: key,
          onClose: function onClose(sAction) {
            if (key === sAction) {
              var oMainModel =
              /** @type {sap.ui.model.json.JSONModel} */
              _this4.getModel('main');

              _this4.fecthInitialize(oMainModel).catch(errorHandlers.bind(_this4));
            }
          }
        });
      }, iDelay * 1000 - 300000);
    }
  });
});