"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
sap.ui.define(['./Base', 'com/innova/sigc/lib/formUtils/formUtils', 'com/innova/sigc/lib/searchHelp/externalSearchHelp', 'com/innova/sigc/lib/searchHelp/searchHelp', 'com/innova/sigc/model/constant', 'com/innova/sigc/model/process/processStatus/ProcessStatus', 'com/innova/sigc/service/http', 'com/innova/sigc/utils/isEmpty', 'sap/ui/model/json/JSONModel'],
/**
 * Module dependencies
 *
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
 */
function (BaseController, formUtils, externalSearchHelp, searchHelp, constant, ProcessStatus, http, isEmpty, JSONModel) {
  return (
    /**
     * @class
     * @name SelectionCriteria.controller.js
     * @description - Controller for Selection Criteria
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
    BaseController.extend('com.innova.sigc.controller.biddingProcess.SelectionCriteria', {
      externalSearchHelp: externalSearchHelp,
      searchHelp: searchHelp,

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
        this._oContentPage = this.byId('page');
        this._oForm = this.byId('form');
        this._oFormModel = new JSONModel({
          valueHelp: {
            catProc: [],
            tipoProc: []
          },
          processStatus: this._buildStatus(ProcessStatus)
        });
        this.setModel(this._oFormModel);
        this._oRouter = this.getRouter();

        this._oRouter.getRoute('biddingProcess').attachMatched(this._onRouteMatched, this);
      },

      /**
       * @function
       * @name onAfterRendering
       * @description - Se ejecuta despuÃ©s de que se renderizo la vista.
       *
       * @private
       * @returns {void} - Noting to return.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      onAfterRendering: function onAfterRendering() {
        // Enlazar los datos de los componentes de la vista.
        this._bindView();
      },

      /* =========================================================== */

      /* finish: lifecycle methods                                   */

      /* =========================================================== */

      /* =========================================================== */

      /* begin: internal methods                                     *
      /* =========================================================== */
      _onRouteMatched: function _onRouteMatched() {
        // Load comboboxes items
        this.onLoadItems(this.byId('tipoProcMultiComboBox'));
        this.onLoadItems(this.byId('catProcMultiComboBox'));
      },

      /**
       * @function
       * @name _bindView
       * @description - Enlazar los datos de los componentes de la vista.
       *
       * @private
       * @returns {void} - Noting to return.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      _bindView: function _bindView() {
        try {
          formUtils.addValidatorAllMultiInputs({
            fields: this._oForm.getControlsByFieldGroupId('MultiInputGroup')
          });
        } catch (error) {
          this.errorHandler(error);
        }
      },

      /**
       * @function
       * @name getFormData
       * @description - Get form data.
       *
       * @private
       * @param {sap.ui.layout.form.Form} form - Form to get data
       * @returns {object}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      _getFormData: function _getFormData(form) {
        var _form$getFormContaine = form.getFormContainers(),
            _form$getFormContaine2 = _slicedToArray(_form$getFormContaine, 2),
            headerFormContainer = _form$getFormContaine2[0],
            positionFormContainer = _form$getFormContaine2[1];

        var header = formUtils.getDataFromFormContainer(headerFormContainer);
        var position = formUtils.getDataFromFormContainer(positionFormContainer);
        return _objectSpread(_objectSpread({}, header), {}, {
          position: position
        });
      },

      /**
       * @function
       * @name _buildStatus
       * @description - Build process status
       *
       * @private
       * @param {object[]} processStatus - Process status object
       * @returns {object}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      _buildStatus: function _buildStatus(processStatus) {
        var i18n = this.getResourceBundle();
        return Object.entries(processStatus).map(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              status = _ref2[1];

          return _objectSpread(_objectSpread({}, status), {}, {
            description: i18n.getText(status.text)
          });
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
        this.onResetForm();

        this._oRouter.navTo('home', {}, {}, true);
      },

      /**
       * @function
       * @name onManageBiddingProcess
       * @description - Handle event button create process
       *
       * @public
       * @returns {void}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      onManageBiddingProcess: function onManageBiddingProcess() {
        var mainModel = this.getModel('main');
        var mail = mainModel.getProperty('/sysParams/SMTP_ADDR');

        if (isEmpty(mail)) {
          sap.m.MessageBox.error(this.getResourceBundle().getText('0434', [mainModel.getProperty('/sysParams/UNAME')]));
          return;
        }

        this._oRouter.navTo('manageBiddingProcess', {}, {}, true);
      },

      /**
       * @function
       * @name onListBiddingProcesses
       * @description - Handle event button search process
       *
       * @public
       * @returns {void}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      onListBiddingProcesses: function onListBiddingProcesses() {
        var _this = this;

        var req = this._getFormData(this._oForm);

        Promise.resolve(this._oContentPage.setBusy(true)).then(function () {
          return _this._getFormData(_this._oForm);
        }).then(http.post.bind(http, constant.api.PROCESS_FILTER_PATH, req)).then(function (_ref3) {
          var data = _ref3.data;

          if (!data.length) {
            throw new Error(_this.getResourceBundle().getText('0135'));
          }

          _this.getModel('store').setProperty('/req', req);

          _this._oRouter.navTo('listBiddingProcesses', {}, {}, true);
        }).catch(this.errorHandler.bind(this)).then(this._oContentPage.setBusy.bind(this._oContentPage, false));
      },

      /**
       * @function
       * @name onResetForm
       * @description - Reset form
       *
       * @public
       * @returns {void}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      onResetForm: function onResetForm() {
        this._oForm.getFormContainers().forEach(function (container) {
          formUtils.cleanFields({
            formElements: container.getFormElements()
          });
        });
      }
      /* =========================================================== */

      /* finish: event handlers                                       */

      /* =========================================================== */

    })
  );
});