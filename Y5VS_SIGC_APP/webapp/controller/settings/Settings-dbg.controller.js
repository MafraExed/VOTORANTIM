"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

sap.ui.define(['../BaseController', './components/DocumentType', './components/Evaluator', './components/Priority', './components/ProcessCategory', './components/ProcessType', './components/ProcessTypeTexts', './components/EmailTemplates', 'com/innova/sigc/formatter/getVisibleRowCount', 'com/innova/sigc/lib/searchHelp/searchHelp', 'com/innova/sigc/model/constant', 'com/innova/sigc/service/http', 'com/innova/sigc/service/petitions', 'sap/m/Button', 'sap/m/ButtonType', 'sap/m/Dialog', 'sap/m/DialogType', 'sap/m/MessageBox', 'sap/m/Text', 'sap/ui/core/Fragment', 'sap/ui/model/json/JSONModel'], function (BaseController, DocumentType, Evaluator, Priority, ProcessCategory, ProcessType, ProcessTypeTexts, EmailTemplates, getVisibleRowCount, searchHelp, constant, http, petitions, Button, ButtonType, Dialog, DialogType, MessageBox, Text, Fragment, JSONModel) {
  return (
    /**
     * @class
     * @name Settings.controller.js
     * @description - Controller for Settings
     *
     * @constructor
     * @public
     * @namespace com.innova.sigc.controller.settings
     *
     * @param {String} sId - id for the new control, generated automatically if no id is given
     * @param {Object} mSettings - initial settings for the new control
     * @returns {void} - Noting to return.
     *
     * @author Dev Dayal <UpWork>
     * @version 1.0.0
     */
    BaseController.extend('com.innova.sigc.controller.settings.Settings', _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, DocumentType), Evaluator), Priority), ProcessCategory), ProcessType), ProcessTypeTexts), EmailTemplates), {}, {
      formatter: {
        getVisibleRowCount: getVisibleRowCount
      },
      searchHelp: searchHelp,
      onInit: function onInit() {
        var oSettingsModel = new JSONModel(sap.ui.require.toUrl('com/innova/sigc/model/settings/ToolbarContent.json'));
        this.getView().setModel(oSettingsModel, 'Settings');
        this._oPage = this.byId('page');
        this._oRouter = this.getRouter();

        this._oRouter.getRoute('settings').attachMatched(this._onRouteMatched, this);
      },

      /* =========================================================== */

      /* begin: event handlers                                       */

      /* =========================================================== */

      /**
       * @function
       * @name onItemSelect
       * @description - se lanza al seleccionar un nuevo tab
       *
       * @public
       *
       * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
       * @version 1.0.0
       */
      onItemSelect: function onItemSelect(oEvent) {
        this._oView.getModel('Settings').setProperty('/selectedTableRow', []);

        var oItem = oEvent.getParameter('item');
        this.byId('pageContainer').to(this._oView.createId(oItem.getKey()));
        this.sSelectedTabKey = oItem.getKey();

        this._oPage.setBusy(true);

        this._validateTabSelected(this.sSelectedTabKey, _objectSpread({}, oEvent.getParameter('item').data())).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
      },

      /**
       * @function
       * @name onNavtoHomePress
       * @description - vuelve a la pagina principal
       *
       * @public
       *
       * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
       * @version 1.0.0
       */
      onNavtoHomePress: function onNavtoHomePress() {
        this._oEmailTemplateEditor = undefined;

        this._oRouter.navTo('home', {}, {}, true);
      },

      /**
       * @function
       * @name onShowValueHelpPress
       * @description - Muestra la ayuda de busqueda globa
       *
       * @public
       *
       * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
       * @version 1.0.0
       */
      onShowValueHelpPress: function onShowValueHelpPress() {
        var _this = this;

        if (!this._pDialog) {
          this._pDialog = Fragment.load({
            id: this._oView.getId(),
            name: 'com.innova.sigc.view.settings.fragment.GlobalSearchHelp',
            controller: this
          }).then(function (oDialog) {
            oDialog.setModel(_this._oView.getModel());
            return oDialog;
          });
        }

        this._pDialog.then(function (oDialog) {
          oDialog.open();
        });
      },
      onTableRowSelect: function onTableRowSelect(oEvent) {
        var aRow = [];

        if (oEvent.getSource().getSelectedIndex() !== -1) {
          var oSelectedObject = oEvent.getParameter('rowContext').getObject();
          aRow.push(oSelectedObject);
        }

        this._oView.getModel('Settings').setProperty('/selectedTableRow', aRow);
      },

      /**
       * @function
       * @name onChangeValueToUppercase
       * @description - Handler of change value to uppercase
       *
       * @public
       * @param {sap.ui.base.Event} oEvent - An Event object consisting of an id, a source and a map of parameters.
       * @returns {void} - Noting to return.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      onChangeValueToUppercase: function onChangeValueToUppercase(oEvent) {
        var _oSource$getValue;

        var oSource =
        /** @type {sap.m.Input} */
        oEvent.getSource();
        oSource.setValue((_oSource$getValue = oSource.getValue()) === null || _oSource$getValue === void 0 ? void 0 : _oSource$getValue.toUpperCase());
      },

      /* =========================================================== */

      /* finish: event handlers                                      */

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
       * @returns {void} - Noting to return.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      _onRouteMatched: function _onRouteMatched() {
        var _this2 = this;

        this._oPage.setBusy(true);

        this._oView = this.getView();

        this._oView.getModel('Settings').setProperty('/createprocesstype', {});

        this._oView.getModel('Settings').setProperty('/createcategory', {});

        this._oView.getModel('Settings').setProperty('/createprocesstypetext', {});

        this._oView.getModel('Settings').setProperty('/createpriority', {});

        this._oView.getModel('Settings').setProperty('/createdocumenttype', {
          BSART: '',
          WERKS_F: '',
          WERKS_T: ''
        }); // set default key value


        this.sSelectedTabKey = 'sProcessTypeId';
        this.byId('pageContainer').to(this._oView.createId(this.sSelectedTabKey));
        this.byId('sideNavigation').setSelectedKey(this.sSelectedTabKey);
        setTimeout(function () {
          _this2._validateTabSelected(_this2.sSelectedTabKey).finally(_this2._oPage.setBusy.bind(_this2._oPage, false));
        });
      },

      /**
       * @function
       * @name _validateTabSelected
       * @description - valida el tab seleccionado
       *
       * @public
       *
       * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
       * @version 1.0.0
       */
      _validateTabSelected: function _validateTabSelected(sKey, options) {
        this._oView.byId('sHelpIconId').setVisible(false);

        this._oView.getModel('Settings').setProperty('/templatemode', false);

        var strategy = {
          sProcessTypeId: 'getProcessTypes',
          sCategoriesId: 'getCategories',
          sPrioritiesId: 'getPriorities',
          sBuyersId: 'getDocumentTypes',
          evaluators: '_getEvaluators',
          sProcessTypeTextId: 'getProcessTypeTexts',
          emailTemplates: '_getEmailTemplates'
        };

        if (sKey in strategy) {
          var _this$strategy$sKey;

          return this === null || this === void 0 ? void 0 : (_this$strategy$sKey = this[strategy[sKey]]) === null || _this$strategy$sKey === void 0 ? void 0 : _this$strategy$sKey.call(this, options);
        }

        return Promise.resolve();
      },
      _handleResponseData: function _handleResponseData(_ref) {
        var data = _ref.data;

        if (this.sSelectedTabKey === 'sProcessTypeId') {
          var aTableRecord = [];

          for (var i = 0; i < data.length; i += 1) {
            for (var j = 0; j < data[i].description.length; j += 1) {
              var oRows = {
                language: data[i].description[j].language,
                description: data[i].description[j].description,
                id: data[i].id,
                createdBy: data[i].createdBy
              };
              aTableRecord.push(oRows);
            }
          }

          this._oView.getModel('Settings').setProperty('/processtypes', aTableRecord);
        } else if (this.sSelectedTabKey === 'sCategoriesId') {
          var aCategoryTableRecord = [];

          for (var _i = 0; _i < data.length; _i += 1) {
            for (var _j = 0; _j < data[_i].catDescription.length; _j += 1) {
              var oCategoryRows = {
                language: data[_i].catDescription[_j].language,
                description: data[_i].catDescription[_j].description,
                id: data[_i].id,
                createdBy: data[_i].createdBy
              };
              aCategoryTableRecord.push(oCategoryRows);
            }
          }

          this._oView.getModel('Settings').setProperty('/categories', aCategoryTableRecord);
        } else {
          this._oView.getModel('Settings').setProperty('/processtexttypes', data);
        }

        this._oView.getModel('Settings').refresh(true);
      },
      handleSaveorUpdate: function handleSaveorUpdate(process, sKey, sPath) {
        if (sKey) {
          return http.update(sPath, process);
        }

        return http.post(sPath, process);
      },
      handleGenericRecordDelete: function handleGenericRecordDelete(oSelectedDeleteObject) {
        var _this3 = this;

        var that = this;
        var sPath = '';

        if (that.sSelectedTabKey === 'sBuyersId') {
          sPath = constant.GET_CONF_DOCS;
        } else if (that.sSelectedTabKey === 'sPrioritiesId') {
          sPath = constant.GET_CONF_PRIORITY;
        }

        petitions.post(sPath, {
          // "Mandt": "100",
          IT_DOCS: [oSelectedDeleteObject]
        }).then(function () {
          if (that.sSelectedTabKey === 'sBuyersId') {
            that.getDocumentTypes();
          } else if (that.sSelectedTabKey === 'sPrioritiesId') {
            that.getPriorities();
          }

          MessageBox.success(_this3.getResourceBundle().getText('0229'));
        }).catch(this.errorHandler.bind(this));
      },
      handleDeleteRecord: function handleDeleteRecord(sKey, sPath) {
        var _this4 = this;

        var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var strategy = {
          sProcessTypeId: this.getProcessTypes,
          sCategoriesId: this.getCategories,
          sProcessTypeTextId: this.getProcessTypeTexts
        };
        var path = sKey ? "".concat(sPath, "/").concat(sKey) : sPath;
        http.delete("".concat(path), body).then(function () {
          MessageBox.success(_this4.getResourceBundle().getText('0229'));
        }).then(strategy[this.sSelectedTabKey].bind(this)).catch(this.errorHandler.bind(this));
      },

      /**
       * @function
       * @name _openDeleteRecordDialog
       * @description - Open Delete Record Dialog
       *
       * @private
       * @returns {void}
       *
       * @author Dev Dayal <UpWork>
       * @version 1.0.0
       */
      _openDeleteRecordDialog: function _openDeleteRecordDialog(id, sPath, bOdata, oSelectedDeleteObject) {
        var _this5 = this;

        var deleteRecordDialog = new Dialog({
          type: DialogType.Message,
          title: this.getResourceBundle().getText('0243'),
          content: new Text({
            text: this.getResourceBundle().getText('0228')
          }),
          beginButton: new Button({
            type: ButtonType.Emphasized,
            text: this.getResourceBundle().getText('Commons.0032'),
            press: function press() {
              if (!bOdata) {
                _this5.handleDeleteRecord(id, sPath, oSelectedDeleteObject);
              } else {
                _this5.handleGenericRecordDelete(oSelectedDeleteObject);
              }

              deleteRecordDialog.close();
            }
          }),
          endButton: new Button({
            type: ButtonType.Reject,
            text: this.getResourceBundle().getText('Commons.0007')
          })
        });

        this._oView.addDependent(deleteRecordDialog);

        deleteRecordDialog.attachAfterClose(deleteRecordDialog.destroy.bind(deleteRecordDialog));
        deleteRecordDialog.getEndButton().attachPress(deleteRecordDialog.close.bind(deleteRecordDialog));
        deleteRecordDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
        deleteRecordDialog.open();
      }
      /* =========================================================== */

      /* finish: internal methods                                    *
      /* =========================================================== */

    }))
  );
});