"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['./Base', './components/qualification/Main', './components/Attachment', './components/CreateOrder', './components/Criteria', './components/General', './components/Positions', './components/Questions', './components/Vendors', 'com/innova/sigc/formatter/date', 'com/innova/sigc/formatter/getEmailString', 'com/innova/sigc/formatter/getNameRespTec', 'com/innova/sigc/formatter/getObjTextProp', 'com/innova/sigc/formatter/formatStatus', 'com/innova/sigc/formatter/intEvaluation', 'com/innova/sigc/lib/formUtils/formUtils', 'com/innova/sigc/model/constant', 'com/innova/sigc/model/process/processStatus/useProcessStatus', 'com/innova/sigc/model/process/TypesDocEnum', 'com/innova/sigc/service/http', 'com/innova/sigc/utils/isEmpty', 'com/innova/sigc/utils/parseUniversalDate', 'com/innova/sigc/utils/showToast', 'sap/ui/model/json/JSONModel', 'sap/m/Dialog', 'sap/m/Button', 'sap/m/library', 'sap/m/Text'],
/**
 * Module dependencies
 *
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
 */
function (BaseController, MainQualification, Attachment, CreateOrder, Criteria, General, Positions, Questions, Vendors, date, getEmailString, getNameRespTec, getObjTextProp, formatStatus, intEvaluation, formUtils, constant, useProcessStatus, TypesDocEnum, http, isEmpty, parseUniversalDate, showToast, JSONModel, Dialog, Button, mobileLibrary, Text)
/**
 * @class
 * @name Manage.controller.js
 * @description - Controller for Manage
 *
 * @constructor
 * @public
 * @alias com.innova.sigc.controller.biddingProcess
 *
 * @param {String} sId - id for the new control, generated automatically if no id is given
 * @param {Object} mSettings - initial settings for the new control
 * @returns {void} - Noting to return.
 *
 * @author Edwin Valencia <evalencia@innovainternacional.biz>
 * @version 1.0.0
 */
{
  var MAIN_TAB_FILTER = 'general'; // shortcut for sap.m.ButtonType

  var ButtonType = mobileLibrary.ButtonType; // shortcut for sap.m.DialogType

  var DialogType = mobileLibrary.DialogType; // shortcut for sap.ui.core.ValueState

  return BaseController.extend('com.innova.sigc.controller.biddingProcess.Manage', _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({
    formatter: {
      date: date,
      getEmailString: getEmailString,
      getNameRespTec: getNameRespTec,
      getObjTextProp: getObjTextProp,
      parseUniversalDate: parseUniversalDate,
      intEvaluation: intEvaluation
    }
  }, Attachment), CreateOrder), Criteria), General), Positions), MainQualification), Questions), Vendors), {}, {
    /* =========================================================== */

    /* begin: lifecycle methods                                    */

    /* =========================================================== */

    /**
     * @function
     * @name onInit
     * @description - Se ejecuta despuÃ©s de que se renderizo la vista.
     *
     * @private
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onInit: function onInit() {
      this._oReq = {};
      this._oPage = this.byId('page');
      this._oGeneralForm = this.byId('generalDataForm');
      this._i18n = this.getResourceBundle();
      this._oIconTabBar = this.byId('iconTabBar');
      this._oInputSociedad = this.byId('oIBukrsManage');
      this._oInputOrgCompras = this.byId('oIEkorgManage');
      this._oInputGrupCompras = this.byId('oIEkgrpManage');
      this._oInputCompAsignado = this.byId('oIErnamManage');
      this._numProc = null;
      this._currentTab = MAIN_TAB_FILTER;
      this._previousTab = MAIN_TAB_FILTER;
      this._oFormModel = new JSONModel({
        attachments: [],
        enableTabs: false,
        evaluationCriteria: [],
        positions: [],
        sumCommercialEval: 0,
        sumTechEval: 0,
        tipoDoc: TypesDocEnum.LIC_COT,
        valueHelp: {
          catProc: [],
          tipoProc: [],
          respJuridico: [],
          respTecnico: []
        },
        vendors: []
      });

      this._oFormModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);

      this.setModel(this._oFormModel, 'processModel');
      this._oStatusModel = new JSONModel({});
      this.setModel(this._oStatusModel, 'status');
      this._oRouter = this.getRouter();

      this._oRouter.getRoute('manageBiddingProcess').attachMatched(this._onRouteMatched, this);
    },

    /* =========================================================== */

    /* finish: lifecycle methods                                   */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */

    /**
     * @function
     * @name _onRouteMatched
     * @description - Se ejecuta cuando se navega a la vista.
     *
     * @private
     * @param {sap.ui.base.Event} oEvent - An Event object consisting of an id, a source and a map of parameters.
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _onRouteMatched: function _onRouteMatched(oEvent) {
      var _oEvent$getParameter = oEvent.getParameter('arguments'),
          query = _oEvent$getParameter.query;

      this._oMainModel = this.getModel('main');
      this._numProc = query;
      this._fromPage = isEmpty(query) ? 'biddingProcess' : 'listBiddingProcesses';
      Promise.resolve(this._oPage.setBusy(true)).then(this._resetView.bind(this)).then(this._fetchAPI.bind(this, this._numProc)).then(this._renderEditors.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /**
     * @function
     * @name _resetView
     * @description - Reset the view.
     *
     * @private
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _resetView: function _resetView() {
      this._currentTab = MAIN_TAB_FILTER;
      this._previousTab = MAIN_TAB_FILTER;

      this._oFormModel.setData({
        attachments: [],
        enableTabs: false,
        evaluationCriteria: [],
        positions: [],
        sumCommercialEval: 0,
        sumTechEval: 0,
        tipoDoc: TypesDocEnum.LIC_COT,
        valueHelp: {
          catProc: [],
          tipoProc: [],
          respJuridico: [],
          respTecnico: []
        },
        vendors: []
      });

      this._oStatusModel.setData({
        enableGeneral: true,
        enableCriteria: true,
        enablePositions: true,
        enableVendors: true,
        enableQualification: true,
        inNewRound: false,
        inEvaluation: false,
        inAdjudication: false,
        inPurchaseOrder: false
      }); // Enabled currency fields


      this.byId('processCurrency').setEditable(true);
      this.byId('processCurrency').setRequired(true);
      this.byId('processConversionCurrency').setEditable(true);
      this.byId('processConversionCurrency').setRequired(true);
      this.byId('conversionCurrencyContainer').setVisible(true);
      this.byId('waersContainer').setVisible(true);
      this.byId('offerPartialSwitch').setEnabled(true); // Reset peso value

      this.byId('pesoValorPrice').setValue();
      this.byId('userPrice').setValue(); // Load comboboxes items

      this.onLoadItems(this.byId('tipoProcComboBox'));
      this.onLoadItems(this.byId('catProcMultiComboBox'));
      this.onLoadItems(this.byId('respJuridicoComboBox'));
      this.onLoadItems(this.byId('respTecnicoComboBox'));

      this._oIconTabBar.setSelectedKey(MAIN_TAB_FILTER);

      this.byId('Tree').collapseAll();

      this._oGeneralForm.getFormContainers().forEach(function (container) {
        formUtils.cleanFields({
          formElements: container.getFormElements()
        });
      });

      this._resetAttachments(); // Clear selected items


      this.byId('businessCriteriaTable').clearSelection();
      this.byId('positionTable').clearSelection();
      this.byId('technicalCriteriaTable').clearSelection();
      this.byId('vendorsTable').clearSelection();
      this.byId('limRecepDP').setMinDate(new Date());
      this.byId('limPregFechaDP').setMinDate(new Date());
      this.byId('limOferta').setMinDate(new Date());
    },

    /**
     * @function
     * @name _fetchAPI
     * @description - Fetch API process
     *
     * @private
     * @param {string} processId - Id process to fetch
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _fetchAPI: function _fetchAPI(processId) {
      if (!isEmpty(processId)) {
        return http.get("".concat(constant.api.PROCESS_PATH, "/").concat(processId)).then(this._handleResponse.bind(this));
      }

      return this._setDefaultParameters();
    },

    /**
     * @function
     * @name _setDefaultParameters
     * @description - Set default parameters
     *
     * @private
     *
     * @returns {Promise}
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    _setDefaultParameters: function _setDefaultParameters() {
      var _this = this;

      this._bindDefaultData(this._oMainModel.getProperty('/bukrs'), this._oInputSociedad);

      this._bindDefaultData(this._oMainModel.getProperty('/ekorg'), this._oInputOrgCompras);

      this._bindDefaultData(this._oMainModel.getProperty('/ekgrp'), this._oInputGrupCompras);

      this._bindDefaultData(this._oMainModel.getProperty('/sysParams/UNAME'), this._oInputCompAsignado);

      this._bindDefaultData(this._oMainModel.getProperty('/sysParams/SMTP_ADDR'), this.byId('oIEmailManage'));

      return http.get("".concat(constant.api.CUSTOM_TEMPLATE, "/offer_vendor_invitation")).then(function (_ref) {
        var data = _ref.data;

        _this._oFormModel.setProperty('/templateInvitation', data === null || data === void 0 ? void 0 : data.content);
      });
    },

    /**
     * @function
     * @name _bindDefaultData
     * @description - Bind default data
     *
     * @private
     * @param {string} value - Value to bind
     * @param {sap.m.Input} input - Input to bind
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    _bindDefaultData: function _bindDefaultData(value, input) {
      input.setValue(value);
      input.setDescription();
      input.destroySuggestionItems().addSuggestionItem(new sap.ui.core.ListItem({
        key: value,
        text: value
      }));
      input.setSelectedKey(value);
      input.fireChangeEvent(value);
    },

    /**
     * @function
     * @name _fetchOffers
     * @description - Fetch API to get the offers
     *
     * @private
     * @returns {promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _fetchOffers: function _fetchOffers() {
      var _this2 = this;

      return http.get("".concat(constant.api.PROCESS_PATH, "/").concat(this._numProc, "/").concat(constant.api.OFFERS_PATH)).then(function (_ref2) {
        var data = _ref2.data;

        _this2._oFormModel.setProperty('/offers', data);
      });
    },

    /**
     * @function
     * @name _handleResponse
     * @description - Handle response general data
     *
     * @private
     * @param {object} context
     * @param {object} context.data - Data response
     * @returns {void} - Noting to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _handleResponse: function _handleResponse(_ref3) {
      var data = _ref3.data;
      var _data$offers = data.offers,
          offers = _data$offers === void 0 ? [] : _data$offers,
          evaluationCriteria = data.evaluationCriteria,
          status = data.status;

      this._oGeneralForm.getFormContainers().forEach(function (container) {
        formUtils.setDataInFields({
          formElements: container.getFormElements(),
          data: _objectSpread({}, data)
        });
      });

      this._validateProcessCurrency({
        offers: offers,
        waers: data.waers,
        conversionCurrency: data.conversionCurrency
      });

      this._validatePartialOffers({
        offers: offers
      });

      this._sumOfEvaluationCriteria(evaluationCriteria);

      this._buildEvaluationCriteria(evaluationCriteria);

      this._validateProcessStatus(status);

      this._oFormModel.setData(_objectSpread(_objectSpread({}, data), {}, {
        enableTabs: true
      }), true);

      this._oFormModel.setProperty('/stateOfProcess', formatStatus({
        status: status,
        i18n: this._i18n
      }));

      this._oStatusModel.refresh();
    },

    /**
     * @function
     * @name _validateProcessStatus
     * @description - Validate process status
     *
     * @private
     * @param {string} status - Process status
     * @returns {void} - Noting to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _validateProcessStatus: function _validateProcessStatus(status) {
      var inNewRound = useProcessStatus.inNewRound(status);
      var inEvaluation = useProcessStatus.inEvaluation(status);
      var inAdjudication = useProcessStatus.inAdjudication(status);
      var inPurchaseOrder = useProcessStatus.inPurchaseOrder(status);
      var enabled = !inEvaluation && !inNewRound && !inAdjudication && !inPurchaseOrder;

      this._oStatusModel.setData({
        enableGeneral: enabled,
        enableCriteria: enabled,
        enablePositions: enabled,
        enableVendors: enabled,
        enableAttachments: enabled,
        enableQualification: !inNewRound && !inAdjudication && !inPurchaseOrder,
        inNewRound: inNewRound,
        inEvaluation: inEvaluation,
        inAdjudication: inAdjudication,
        isAdjudication: useProcessStatus.isAdjudication(status),
        inPurchaseOrder: inPurchaseOrder
      });
    },

    /**
     * @function
     * @name _callTabsStrategy
     * @description - Call tabs strategy
     *
     * @private
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _callTabsStrategy: function _callTabsStrategy() {
      var _this3 = this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var strategy = {
        additionalInformation: this._additionalInformationStrategy,
        commercialQualification: this._fetchCommercialQualifications,
        general: this._renderEditors.bind(this),
        qualification: this._fetchQualifications,
        qualificationSummary: this._fetchQualificationSummary,
        questions: this._fetchQuestions,
        technicalQualification: this._fetchTechnicalQualifications,
        vendor: this._fetchOffers
      };
      var fn = strategy[this._currentTab];
      return this._fetchAPI(this._numProc).then(function () {
        return fn === null || fn === void 0 ? void 0 : fn.call.apply(fn, [_this3].concat(args));
      });
    },

    /**
     * @function
     * @name _getSelectedIndices
     * @description - Obtener los indices de las filas seleccionadas de la tabla
     *
     * @private
     * @param {sap.ui.table.Table} oTable - Tabla de la vista
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _getSelectedIndices: function _getSelectedIndices(oTable) {
      var aSelectedIndices = oTable.getSelectedIndices();

      if (isEmpty(aSelectedIndices)) {
        return Promise.reject(new Error(this.getResourceBundle().getText('Commons.0022')));
      }

      return Promise.resolve(aSelectedIndices.map(function (i) {
        return oTable.getContextByIndex(i);
      }));
    },

    /**
     * @function
     * @name _getSelectedItems
     * @description - Get selected items sap.m.Table
     *
     * @private
     * @param {sap.m.Table} oTable - Tabla de la vista
     * @returns {object[]}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _getSelectedItems: function _getSelectedItems(oTable) {
      var selectedItems = oTable.getSelectedItems();

      if (isEmpty(selectedItems)) {
        throw new Error(this._i18n.getText('Commons.0022'));
      }

      return selectedItems;
    },

    /**
     * @function
     * @name _deleteBindingRows
     * @description - Delete binding rows.
     *
     * @private
     * @param {object} context
     * @param {string} context.path - Path of the binding
     * @param {number[]} context.ids - Ids of the rows to delete
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _deleteBindingRows: function _deleteBindingRows(_ref4) {
      var path = _ref4.path,
          ids = _ref4.ids;

      this._oFormModel.setProperty("".concat(path), _toConsumableArray(this._oFormModel.getProperty("".concat(path)).filter(function (_ref5) {
        var id = _ref5.id;
        return !ids.includes(id);
      })));

      showToast(this.getResourceBundle().getText('Commons.0021'));
    },

    /**
     * @function
     * @name _isValidForm
     * @description - Is valid form.
     *
     * @private
     * @param {sap.ui.layout.form.Form} form - Form to get data
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _isValidForm: function _isValidForm(form) {
      var bValid = formUtils.validateForm({
        formContainers: form.getFormContainers()
      });

      if (!bValid) {
        throw new Error(this._i18n.getText('Commons.0027'));
      }

      return Promise.resolve();
    },

    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */

    /**
     * @function
     * @name onNavBack()
     * @description - Event handler for navigating back.
     *
     * @public
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalecia@innovainternacional.biz>
     * @version 1.0.0
     */
    onNavBack: function onNavBack() {
      if (this._fromPage === 'biddingProcess') {
        this._oRouter.navTo('biddingProcess', {}, {}, true);
      } else {
        this._oRouter.navTo('listBiddingProcesses', {}, {}, true);
      }
    },

    /**
     * @function
     * @name onRefresh
     * @description - Refresh the Process.
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onRefresh: function onRefresh() {
      Promise.resolve(this._oPage.setBusy(true)).then(this._callTabsStrategy.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /**
     * @function
     * @name onSelectItemTabBar
     * @description - Select item tab bar.
     *
     * @public
     * @param {object} parameters - Parameters event
     * @param {string} parameters.key - Key selected
     * @param {string} parameters.previousKey - Previous key selected
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onSelectItemTabBar: function onSelectItemTabBar(_ref6) {
      var key = _ref6.key;
      this._currentTab = key;

      if (this._previousTab !== key) {
        this._previousTab = this._currentTab;
        Promise.resolve(this._oPage.setBusy(true)).then(this._callTabsStrategy.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
      }
    },

    /**
     * @function
     * @name onShowTextDialog
     * @description - Select item tab bar.
     *
     * @public
     * @param {string} message - Mensaje a mostrar
     * @returns {void}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    onShowTextDialog: function onShowTextDialog(message, title) {
      var oDefaultMessageDialog = new Dialog({
        type: DialogType.Message,
        title: title,
        content: new Text({
          text: message
        }),
        beginButton: new Button({
          type: ButtonType.Emphasized,
          text: 'OK',
          press: function press() {
            oDefaultMessageDialog.close();
          }
        })
      });
      oDefaultMessageDialog.attachAfterClose(oDefaultMessageDialog.destroy.bind(oDefaultMessageDialog));
      oDefaultMessageDialog.open();
    }
    /* =========================================================== */

    /* finish: event handlers                                       */

    /* =========================================================== */

  }));
});