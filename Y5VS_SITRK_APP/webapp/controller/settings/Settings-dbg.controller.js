"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

sap.ui.define(['../BaseController', './components/DocumentType', './components/Priority', './components/Parameter', 'com/innova/formatter/getVisibleRowCount', 'com/innova/lib/searchHelp/searchHelp', 'com/innova/model/constant', 'com/innova/service/petitions', 'sap/m/Button', 'sap/m/ButtonType', 'sap/m/Dialog', 'sap/m/DialogType', 'sap/m/MessageBox', 'sap/m/Text', 'sap/ui/core/Fragment', 'sap/ui/model/json/JSONModel'], function (BaseController, DocumentType, Priority, Parameter, getVisibleRowCount, searchHelp, constant, petitions, Button, ButtonType, Dialog, DialogType, MessageBox, Text, Fragment, JSONModel) {
  return (
    /**
     * @class
     * @name Settings.controller.js
     * @description - Controller for Settings
     *
     * @constructor
     * @public
     * @namespace com.innova.controller.settings
     *
     * @param {String} sId - id for the new control, generated automatically if no id is given
     * @param {Object} mSettings - initial settings for the new control
     * @returns {void} - Noting to return.
     *
     * @author Dev Dayal <UpWork>
     * @version 0.5.0
     */
    BaseController.extend('com.innova.controller.settings.Settings', _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, DocumentType), Priority), Parameter), {}, {
      formatter: {
        getVisibleRowCount: getVisibleRowCount
      },
      searchHelp: searchHelp,
      onInit: function onInit() {
        var oSettingsModel = new JSONModel(sap.ui.require.toUrl('com/innova/model/settings/ToolbarContent.json'));
        this.getView().setModel(oSettingsModel, 'Settings');
        this._oRouter = this.getRouter();

        this._oRouter.getRoute('settings').attachMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: function _onRouteMatched() {
        this.getView().getModel('Settings').setProperty('/createpriority', {});
        this.getView().getModel('Settings').setProperty('/createdocumenttype', {
          BSART: '',
          WERKS_F: '',
          WERKS_T: ''
        });
        this.sSelectedTabKey = 'sBuyersId';
        this.getView().byId('pageContainer').setInitialPage(this.getView().byId('sBuyersId'));
        this.getDocumentTypes();
      },
      onItemSelect: function onItemSelect(oEvent) {
        this.getView().getModel('Settings').setProperty('/selectedTableRow', []);
        var oItem = oEvent.getParameter('item');
        this.byId('pageContainer').to(this.getView().createId(oItem.getKey()));
        this.sSelectedTabKey = oItem.getKey();

        if (oItem.getKey() === 'sCategoriesId') {
          this.getCategories();
        } else if (oItem.getKey() === 'sPrioritiesId') {
          this.getPriorities();
        } else if (oItem.getKey() === 'sParametersId') {
          this.getParameters();
        } else {
          this.getDocumentTypes();
        }
      },
      _handleResponseData: function _handleResponseData(_ref) {
        var data = _ref.data;
        this.getView().getModel('Settings').setProperty('/processtexttypes', data);
        this.getView().getModel('Settings').refresh(true);
      },
      handleSaveorUpdate: function handleSaveorUpdate(process, sKey, sPath) {
        if (sKey) {
          return petitions.update(sPath, process);
        }

        return petitions.post(sPath, process);
      },
      handleGenericRecordDelete: function handleGenericRecordDelete(oSelectedDeleteObject) {
        var _this = this;

        var that = this;
        var sPath = '';
        var oReq = null;

        if (that.sSelectedTabKey === 'sBuyersId') {
          sPath = constant.GET_CONF_DOCS;
          oReq = {
            IT_DOCS: [oSelectedDeleteObject]
          };
        } else if (that.sSelectedTabKey === 'sPrioritiesId') {
          sPath = constant.GET_CONF_PRIORITY;
          oReq = {
            IT_PRIOR: [oSelectedDeleteObject]
          };
        } else if (that.sSelectedTabKey === 'sParametersId') {
          sPath = constant.PARAMETERS_SETTINGS;
          oReq = {
            IT_PARAMS: [{
              MANDT: '',
              PARNAME: oSelectedDeleteObject.PARNAME,
              PARLINE: oSelectedDeleteObject.PARLINE,
              PARVALUE: oSelectedDeleteObject.PARVALUE
            }],
            IV_OPERATION: '4' // Remove

          };
        }

        petitions.post(sPath, oReq).then(function () {
          if (that.sSelectedTabKey === 'sBuyersId') {
            that.getDocumentTypes();
          } else if (that.sSelectedTabKey === 'sPrioritiesId') {
            that.getPriorities();
          } else if (that.sSelectedTabKey === 'sParametersId') {
            _this.getParameters();
          }

          MessageBox.success(_this.getResourceBundle().getText('Settings.0010'));
        }).then(this.clearSelectedIndex.bind(this)).catch(this.errorHandler.bind(this));
      },
      onNavtoHomePress: function onNavtoHomePress() {
        this._oRouter.navTo('home', {}, {}, true);
      },
      onShowValueHelpPress: function onShowValueHelpPress() {
        var oView = this.getView();

        if (!this._pDialog) {
          this._pDialog = Fragment.load({
            id: oView.getId(),
            name: 'com.innova.view.settings.fragment.GlobalSearchHelp',
            controller: this
          }).then(function (oDialog) {
            oDialog.setModel(oView.getModel());
            return oDialog;
          });
        }

        this._pDialog.then(function (oDialog) {
          oDialog.open();
        });
      },
      clearSelectedIndex: function clearSelectedIndex() {
        this.byId('prioritiesTable').setSelectedIndex(-1);
        this.byId('parametersTable').setSelectedIndex(-1);
        this.byId('buyerTable').setSelectedIndex(-1);
      },

      /* =========================================================== */

      /* begin: event handlers                                       */

      /* =========================================================== */
      onTableRowSelect: function onTableRowSelect(oEvent) {
        var aRow = [];

        if (oEvent.getSource().getSelectedIndex() !== -1) {
          var oSelectedObject = oEvent.getParameter('rowContext').getObject();
          aRow.push(oSelectedObject);
        }

        this.getView().getModel('Settings').setProperty('/selectedTableRow', aRow);
      },

      /* =========================================================== */

      /* finish: event handlers                                      */

      /* =========================================================== */

      /* =========================================================== */

      /* begin: internal methods                                     *
      /* =========================================================== */

      /**
       * @function
       * @name _openDeleteRecordDialog
       * @description - Open Delete Record Dialog
       *
       * @private
       * @returns {void}
       *
       * @author Dev Dayal <UpWork>
       * @version 0.5.0
       */
      _openDeleteRecordDialog: function _openDeleteRecordDialog(id, sPath, bOdata, oSelectedDeleteObject) {
        var _this2 = this;

        var deleteRecordDialog = new Dialog({
          type: DialogType.Message,
          title: this.getResourceBundle().getText('Settings.0030'),
          content: new Text({
            text: this.getResourceBundle().getText('Settings.0008')
          }),
          beginButton: new Button({
            type: ButtonType.Emphasized,
            text: this.getResourceBundle().getText('Settings.0009'),
            press: function press() {
              if (!bOdata) {
                _this2.handleDeleteRecord(id, sPath, oSelectedDeleteObject);
              } else {
                _this2.handleGenericRecordDelete(oSelectedDeleteObject);
              }

              deleteRecordDialog.close();
            }
          }),
          endButton: new Button({
            type: ButtonType.Reject,
            text: this.getResourceBundle().getText('Settings.0007')
          })
        });
        this.getView().addDependent(deleteRecordDialog);
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