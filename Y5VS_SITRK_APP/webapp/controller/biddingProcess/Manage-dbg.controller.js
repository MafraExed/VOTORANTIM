"use strict";

var _excluded = ["offers"];

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['../BaseController', './components/General', './components/Positions', 'com/innova/sitrack/formatter/date', 'com/innova/sitrack/formatter/formatUUID', 'com/innova/sitrack/formatter/getEmailString', 'com/innova/sitrack/formatter/getObjTextProp', 'com/innova/sitrack/lib/formUtils/formUtils', // 'com/innova/sitrack/lib/searchHelp/searchHelp',
'com/innova/sitrack/model/constant', 'com/innova/sitrack/model/purchaseTracking/processStatus/useProcessStatus', 'com/innova/sitrack/model/purchaseTracking/TypesDocEnum', 'com/innova/sitrack/utils/isEmpty', 'com/innova/sitrack/utils/showToast', 'com/innova/service/petitions', 'com/innova/service/http', 'com/innova/sitrack/model/formatter', 'sap/m/MessageBox', 'sap/ui/core/ListItem', 'sap/ui/model/json/JSONModel', 'com/innova/sitrack/formatter/dataArray', 'com/innova/sitrack/utils/wrapText'],
/**
 * Module dependencies
 *
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
 */
function (BaseController, General, Positions, date, formatUUID, getEmailString, getObjTextProp, formUtils, // searchHelp,
constant, useProcessStatus, TypesDocEnum, isEmpty, showToast, petitions, http, formatterGlobal, MessageBox, ListItem, JSONModel, dataArray, wrapText)
/**
 * @class
 * @name Manage.controller.js
 * @description - Controller for Manage
 *
 * @constructor
 * @public
 * @alias com.innova.sitrack.controller.purchaseTracking
 *
 * @param {String} sId - id for the new control, generated automatically if no id is given
 * @param {Object} mSettings - initial settings for the new control
 * @returns {void} - Noting to return.
 *
 * @author Edwin Valencia <evalencia@innovainternacional.biz>
 * @version 0.5.0
 */
{
  var MAIN_TAB_FILTER = 'general';
  return BaseController.extend('com.innova.sitrack.controller.purchaseTracking.Manage', _objectSpread(_objectSpread(_objectSpread({
    formatter: {
      getObjTextProp: getObjTextProp,
      getEmailString: getEmailString,
      date: date,
      dataArray: dataArray
    }
  }, General), Positions), {}, {
    formatterGlobal: formatterGlobal,

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
     * @version 0.5.0
     */
    onInit: function onInit() {
      this._oReq = {};
      this._oPage = this.byId('page');
      this._oGeneralForm = this.byId('generalDataForm');
      this._i18n = this.getResourceBundle();
      this._oIconTabBar = this.byId('iconTabBar');
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

      this._oGeneralForm.getFormContainers().forEach(function (container) {
        formUtils.cleanFields({
          formElements: container.getFormElements()
        });
      });

      this._oRouter.getRoute('purchaseTrackingManage').attachMatched(this._onRouteMatched, this);
    },

    /* =========================================================== */

    /* finish: lifecycle methods                                   */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */
    _minFechaEntrega: function _minFechaEntrega() {
      return new Date();
    },

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
     * @version 0.5.0
     */
    _onRouteMatched: function _onRouteMatched(oEvent) {
      this.byId('limOferta').setMinDate(new Date());
      this._oStoreModel = this.getModel('store');

      if (this._oStoreModel.getData().processData) {
        var _oEvent$getParameter = oEvent.getParameter('arguments'),
            query = _oEvent$getParameter.query;

        this._numProc = query;
        Promise.resolve(this._oPage.setBusy(true)) // .then(
        //   petitions.post.bind(petitions, `${constant.GET_PROCESS_AUTH}`)
        // )
        // .then(console.log)
        .then(this._resetForm.bind(this)).then(this._fetchAPI.bind(this, this._numProc)).then(http.get.bind(http, "".concat(constant.api.CUSTOM_TEMPLATE, "/offer_vendor_invitation"))).then(this._renderEditors.bind(this)).then(this._fetchSelectedData.bind(this, this._oStoreModel.getData().processData)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
      } else {
        this.getModel('appView').setProperty('/resetProcessForm', true);

        this._oRouter.navTo('purchaseTracking');
      }
    },

    /**
     * @function
     * @name _loadItemsCatProc
     * @description - Load items for CatProc
     *
     * @private
     * @returns {Promise} - Returns a promise.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _loadItemsCatProc: function _loadItemsCatProc() {
      var _this = this;

      if (this._oFormModel.getProperty('/valueHelp/catProc').length === 0) {
        return http.get("".concat(constant.api.PROCESS_CATEGORY_PATH, "?language=ES")).then(function (_ref) {
          var data = _ref.data;

          _this._oFormModel.setProperty('/valueHelp/catProc', data);
        });
      }

      return Promise.resolve();
    },

    /**
     * @function
     * @name _loadItemsRespJuridico
     * @description - Load items for legal evaluator.
     *
     * @private
     * @returns {Promise} - Returns a promise.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _loadItemsRespJuridico: function _loadItemsRespJuridico() {
      var _this2 = this;

      return http.get(constant.api.EVALUATORS_PATH).then(function (_ref2) {
        var data = _ref2.data;

        _this2._oFormModel.setProperty('/valueHelp/respJuridico', data.filter(function (_ref3) {
          var role = _ref3.role,
              status = _ref3.status;
          return role.includes('LEGAL_EVALUATOR') && status === 'Verified';
        }));
      });
    },

    /**
     * @function
     * @name _loadItemsRespTecnico
     * @description - Load items for technical evaluator.
     *
     * @private
     * @returns {Promise} - Returns a promise.
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    _loadItemsRespTecnico: function _loadItemsRespTecnico() {
      var _this3 = this;

      return http.get(constant.api.EVALUATORS_PATH).then(function (_ref4) {
        var data = _ref4.data;

        _this3._oFormModel.setProperty('/valueHelp/respTecnico', data.filter(function (_ref5) {
          var role = _ref5.role,
              status = _ref5.status;
          return role.includes('TECHNICAL_EVALUATOR') && status === 'Verified';
        }));
      });
    },

    /**
     * @function
     * @name _fetchSelectedData
     * @description - Agrega los datos al formulario inicial
     *
     * @public
     * @returns {void} - No retorna nada.
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    _fetchSelectedData: function _fetchSelectedData(data) {
      var _this4 = this;

      var _this$getModel$getDat = this.getModel('main').getData(),
          sysParams = _this$getModel$getDat.sysParams,
          bukrs = _this$getModel$getDat.bukrs,
          ekgrp = _this$getModel$getDat.ekgrp,
          ekorg = _this$getModel$getDat.ekorg;

      var UNAME = sysParams.UNAME;
      var arrayControls = [{
        control: this.byId('oIBukrsInput'),
        value: bukrs
      }, {
        control: this.byId('oIEkorgInput'),
        value: ekorg
      }, {
        control: this.byId('oIEkgrpInput'),
        value: ekgrp
      }, {
        control: this.byId('processCurrency'),
        value: data.POH_WAERS
      }, {
        control: this.byId('oIErnamInput'),
        value: UNAME
      }, {
        control: this.byId('dztermInput'),
        value: data.POH_ZTERM
      }];
      arrayControls.forEach(function (element) {
        if (element.value) {
          var oUIControl = element.control;

          var sValue = _this4.searchHelp._getValue(element.value);

          oUIControl.setValue(sValue);
          oUIControl.destroySuggestionItems().addSuggestionItem(new ListItem({
            key: sValue,
            text: sValue
          }));
          oUIControl.setSelectedKey(sValue);
          oUIControl.fireChangeEvent(sValue);
        }
      });
    },

    /**
     * @function
     * @name _deleteBindingRowsPositions
     * @description - Delete binding rows from positions.
     *
     * @private
     * @param {object} context
     * @param {string} context.path - Path of the binding
     * @param {number[]} context.ids - Ids of the rows to delete
     * @returns {void}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    _deleteBindingRowsPositions: function _deleteBindingRowsPositions(_ref6) {
      var path = _ref6.path,
          ids = _ref6.ids;

      this._oStoreModel.setProperty("".concat(path), _toConsumableArray(this._oStoreModel.getProperty("".concat(path)).filter(function (_ref7) {
        var BANFN = _ref7.BANFN;
        return !ids.includes(BANFN);
      })));

      showToast(this.getMessageTextPool('K352'));
    },

    /**
     * @function
     * @name _resetForm
     * @description - Se ejecuta cuando se navega a la vista.
     *
     * @private
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _resetForm: function _resetForm() {
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
      }); // Enabled currency field


      this.byId('processCurrency').setEnabled(true);
      this.byId('offerPartialSwitch').setEnabled(true); // Load comboboxes items

      this.onLoadItems(this.byId('tipoProcComboBox'));
      this.onLoadItems(this.byId('catProcMultiComboBox'));
      this.onLoadItems(this.byId('respJuridicoComboBox'));
      this.onLoadItems(this.byId('respTecnicoComboBox'));

      this._oIconTabBar.setSelectedKey(MAIN_TAB_FILTER);

      this._oGeneralForm.getFormContainers().forEach(function (container) {
        formUtils.cleanFields({
          formElements: container.getFormElements()
        });
      }); // Clear selected items


      this.byId('positionTable').clearSelection();
    },

    /**
     * @function
     * @name _fetchAPI
     * @description - Fetch API process
     *
     * @private
     * @param {string} processId - Id process to fetch
     * @returns {promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _fetchAPI: function _fetchAPI(processId) {
      if (!isEmpty(processId)) {
        return http.get("".concat(constant.api.PROCESS_PATH, "/").concat(processId)).then(this._handleResponse.bind(this));
      }

      return Promise.resolve(this._prueba());
    },
    _prueba: function _prueba() {
      this._oGeneralForm.getFormContainers().forEach(function (container) {
        formUtils.setDataInFields({
          formElements: container.getFormElements(),
          data: {
            ekorg: 1
          }
        });
      });
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
     * @version 0.5.0
     */
    _fetchOffers: function _fetchOffers() {
      var _this5 = this;

      return http.get("".concat(constant.api.PROCESS_PATH, "/").concat(this._numProc, "/").concat(constant.api.OFFERS_PATH)).then(function (_ref8) {
        var data = _ref8.data;

        _this5._oFormModel.setProperty('/offers', data);
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
     * @version 0.5.0
     */
    _handleResponse: function _handleResponse(_ref9) {
      var data = _ref9.data;

      var _data$offers = data.offers,
          offers = _data$offers === void 0 ? [] : _data$offers,
          process = _objectWithoutProperties(data, _excluded);

      this._oGeneralForm.getFormContainers().forEach(function (container) {
        formUtils.setDataInFields({
          formElements: container.getFormElements(),
          data: _objectSpread(_objectSpread({}, data), {}, {
            numProc: formatUUID(data.numProc)
          })
        });
      });

      this._validateProcessCurrency({
        offers: offers
      });

      this._validatePartialOffers({
        offers: offers
      });

      this._sumOfEvaluationCriteria(process.evaluationCriteria);

      this._buildEvaluationCriteria(process.evaluationCriteria);

      this._validateProcessStatus(process.status);

      this._oFormModel.setData(_objectSpread(_objectSpread({}, process), {}, {
        enableTabs: true
      }), true);
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
     * @version 0.5.0
     */
    _validateProcessStatus: function _validateProcessStatus(status) {
      this._oStatusModel.setData({
        disableCriteria: !useProcessStatus.inEvaluation(status)
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
     * @version 0.5.0
     */
    _callTabsStrategy: function _callTabsStrategy() {
      var strategy = {
        general: this._renderEditorsWithData,
        questions: this._fetchQuestions,
        qualification: this._fetchQualifications,
        technicalQualification: this._fetchTechnicalQualifications,
        commercialQualification: this._fetchCommercialQualifications,
        qualificationSummary: this._fetchQualificationSummary,
        vendor: this._fetchOffers
      };
      var fn = strategy[this._currentTab];

      if (fn) {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return fn === null || fn === void 0 ? void 0 : fn.call.apply(fn, [this].concat(args));
      }

      return Promise.resolve();
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
     * @version 0.5.0
     */
    _getSelectedIndices: function _getSelectedIndices(oTable) {
      var aSelectedIndices = oTable.getSelectedIndices();

      if (isEmpty(aSelectedIndices)) {
        return Promise.reject(new Error('__Seleccione por lo menos un registro.'));
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
     * @version 0.5.0
     */
    _getSelectedItems: function _getSelectedItems(oTable) {
      var selectedItems = oTable.getSelectedItems();

      if (isEmpty(selectedItems)) {
        throw new Error('__Seleccione por lo menos un registro.');
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
     * @version 0.5.0
     */
    _deleteBindingRows: function _deleteBindingRows(_ref10) {
      var path = _ref10.path,
          ids = _ref10.ids;

      this._oFormModel.setProperty("".concat(path), _toConsumableArray(this._oFormModel.getProperty("".concat(path)).filter(function (_ref11) {
        var id = _ref11.id;
        return !ids.includes(id);
      })));

      showToast('__Se han procesado los datos correctamente.');
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
     * @version 0.5.0
     */
    _isValidForm: function _isValidForm(form) {
      var bValid = formUtils.validateForm({
        formContainers: form.getFormContainers()
      });

      if (!bValid) {
        throw new Error('Formulario no valido');
      }

      return Promise.resolve();
    },

    /**
     * @function
     * @name _saveOrUpdateProcess
     * @description - Save or update process.
     *
     * @private
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _saveOrUpdateProcess: function _saveOrUpdateProcess(process) {
      if (this._numProc) {
        return http.update("".concat(constant.api.PROCESS_PATH, "/").concat(this._numProc), process);
      }

      return http.post(constant.api.NEW_PROCESS_PATH, process);
    },

    /**
     * @function
     * @name _buildObjectText
     * @description - Construir el objeto de textos
     *
     * @private
     * @param {string} sText - Texto
     * @returns {object[]}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _buildObjectText: function _buildObjectText() {
      var sText = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return wrapText(sText).map(function (txt) {
        return {
          TDFORMAT: '/',
          TDLINE: txt
        };
      });
    },

    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */

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
     * @version 0.5.0
     */
    onSelectItemTabBar: function onSelectItemTabBar(_ref12) {
      var key = _ref12.key;
      var emailValue = this.byId('oIEmailManage').getValue();

      if (key === 'position' && isEmpty(emailValue)) {
        showToast(this.getMessageTextPool('K367'));
        this.byId('iconTabBar').setSelectedKey('general');

        this._renderEditorsWithData();

        this.byId('oIEmailManage').setValueState(sap.ui.core.ValueState.Error);
      } else {
        this._currentTab = key;

        if (this._previousTab !== key) {
          this._previousTab = this._currentTab;
          Promise.resolve(this._oPage.setBusy(true)).then(this._callTabsStrategy.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
        }
      }
    },

    /**
     * @function
     * @name onSave
     * @description - Save the Process.
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    onSave: function onSave() {
      var that = this;
      var emailValue = this.byId('oIEmailManage').getValue();

      if (isEmpty(emailValue)) {
        showToast(this.getMessageTextPool('K367'));
        this.byId('oIEmailManage').setValueState(sap.ui.core.ValueState.Error);
      } else {
        MessageBox.confirm(this.getMessageTextPool('K330'), {
          actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
          emphasizedAction: this.getMessageTextPool('K318'),
          onClose: function onClose(sAction) {
            if (sAction === 'OK') {
              Promise.resolve(that._oPage.setBusy(true)).then(that._isValidForm.bind(that, that._oGeneralForm)).then(that._buildProcessObjToSave.bind(that)).then(that._saveOrUpdateProcess.bind(that)).then(that._handleResponseToSap.bind(that)).then(petitions.post.bind(petitions, "".concat(constant.SAVE_BIDDING_POSITION))).then(that._oNavToPosition.bind(that)).catch(that.errorHandler.bind(that)).finally(that._oPage.setBusy.bind(that._oPage, false));
            }
          }
        });
      }
    },

    /**
     * @function
     * @name onNavBackProcess
     * @description - Navega a vista de process
     *
     * @public
     * @returns {void} - No retorna nada.
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    onNavBackProcess: function onNavBackProcess() {
      var that = this;
      MessageBox.alert(this.getMessageTextPool('K325'), {
        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
        emphasizedAction: MessageBox.Action.OK,
        onClose: function onClose(sAction) {
          if (sAction === MessageBox.Action.OK) {
            that.onNavBackTable();
          }
        }
      });
    },

    /**
     * @function
     * @name _loadItemsTipoProc
     * @description - Load items for Tipo Proc
     *
     * @private
     * @returns {Promise} - Returns a promise.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _loadItemsTipoProc: function _loadItemsTipoProc() {
      var _this6 = this;

      if (this._oFormModel.getProperty('/valueHelp/tipoProc').length === 0) {
        return http.get("".concat(constant.api.PROCESS_TYPE_PATH, "?language=ES")).then(function (_ref13) {
          var data = _ref13.data;

          _this6._oFormModel.setProperty('/valueHelp/tipoProc', data);
        });
      }

      return Promise.resolve();
    },

    /**
     * @function
     * @name onChangePositionValue
     * @description - setea al modelo los cambios hechos
     *
     * @private
     * @returns {void} - No retorna nada
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    onChangePositionValue: function onChangePositionValue(oEvent) {
      var input =
      /** @type {sap.m.Input} */
      oEvent.getSource();
      var value =
      /** @type {any} */
      input.getValue();
      var name = input.getName();

      if (name === 'MAT_TEXT_COMPR' || name === 'MAT_TEXT_LARGO') {
        value = this._buildObjectText(value);
      }

      var context = input.getBindingContext('store');
      var path = context.getPath();
      var model =
      /** @type{sap.ui.model.json.JSONModel} */
      context.getModel();
      model.setProperty("".concat(path, "/").concat(name), value);
      model.updateBindings(true);
      model.refresh();
    },

    /**
     * @function
     * @name onLoadItems
     * @description - Load items for Tipo Proc or CatProc
     *
     * @public
     * @param {sap.m.ComboBox | sap.m.MultiComboBox} oSource - Control that fired the event
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    onLoadItems: function onLoadItems(oSource) {
      var name = oSource.getName();
      name = name.charAt(0).toUpperCase() + name.slice(1);
      Promise.resolve(oSource.setBusy(true)).then(this["_loadItems".concat(name)].bind(this)).catch(this.errorHandler.bind(this)).finally(oSource.setBusy.bind(oSource, false));
    }
    /* =========================================================== */

    /* finish: event handlers                                       */

    /* =========================================================== */

  }));
});