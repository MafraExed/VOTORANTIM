"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sigc/model/constant', 'com/innova/sigc/service/http', 'sap/base/util/deepExtend', 'sap/m/MessageBox'],
/**
 * @class
 * @name ProcessType.js
 * @description - Handler of process type for the settings controller
 *
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
 * @param {typeof sap.m.MessageBox} MessageBox
 * @param {object} constant
  *
 * @returns {object}
 *
 * @author Edwin Valencia <evalencia@innovainternacional.biz>
 * @version 1.0.0
 */
function (constant, http, deepExtend, MessageBox) {
  return {
    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */
    handleOpenProcessTypeDialogOpen: function handleOpenProcessTypeDialogOpen(oSelectedProcessTypeObject) {
      var _this = this;

      if (!this._oCreateNewData) {
        this._oCreateNewData = sap.ui.core.Fragment.load({
          name: 'com.innova.sigc.view.settings.fragment.CreateProcessType',
          controller: this
        }).then(function (oDialog) {
          // connect dialog to the root view of this component (models, lifecycle)
          _this.getView().addDependent(oDialog);

          oDialog.addStyleClass(_this.getOwnerComponent().getContentDensityClass());
          oDialog.setModel(_this.getView().getModel('Settings'), 'Settings');

          if (!oSelectedProcessTypeObject) {
            oDialog.getModel('Settings').setProperty('/createprocesstype', {
              type: '',
              description: '',
              language: _this.getModel('main').getProperty('/currentLanguage')
            });
          }

          oDialog.setModel(_this.getView().getModel('i18n'), 'i18n');
          return oDialog;
        });
      }

      this._oCreateNewData.then(function (oDialog) {
        oDialog.open();
      });
    },
    onAddNewProcessTypeRecord: function onAddNewProcessTypeRecord() {
      this.bUpdateRecord = false;
      this.getView().getModel('Settings').setProperty('/IsCreateProcessType', true);
      this.getView().getModel('Settings').setProperty('/createprocesstype', {
        type: '',
        description: '',
        language: this.getModel('main').getProperty('/currentLanguage')
      });
      this.handleOpenProcessTypeDialogOpen();
    },
    onProcessTypeEditPress: function onProcessTypeEditPress() {
      var aSelectedRow = this.getView().getModel('Settings').getProperty('/selectedTableRow');

      if (aSelectedRow.length === 0) {
        MessageBox.error(this.getResourceBundle().getText('Commons.0022'));
        return;
      }

      var oSelectedObject = deepExtend({}, aSelectedRow[0]); // const oSelectedObject = jQuery.extend(true, {}, aSelectedRow[0])

      this.bUpdateRecord = true;
      this.getView().getModel('Settings').setProperty('/IsCreateProcessType', false); // const oSelectedObject = oEvent
      //   .getSource()
      //   .getBindingContext('Settings')
      //   .getObject()

      this.getView().getModel('Settings').setProperty('/createprocesstype', oSelectedObject);
      this.handleOpenProcessTypeDialogOpen(oSelectedObject);
    },
    onProcessTypeDeletePress: function onProcessTypeDeletePress() {
      var aSelectedRow = this.getView().getModel('Settings').getProperty('/selectedTableRow');

      if (aSelectedRow.length === 0) {
        MessageBox.error(this.getResourceBundle().getText('Commons.0022'));
        return;
      }

      var oSelectedObject = aSelectedRow[0];

      this._openDeleteRecordDialog(oSelectedObject.id, constant.api.PROCESS_TYPE_PATH);
    },
    onCreateProcessTypePress: function onCreateProcessTypePress() {
      var _this2 = this;

      var oPayload = deepExtend({}, this.getView().getModel('Settings').getProperty('/createprocesstype')); // delete oPayload.id

      var that = this;
      var sUser = that.getView().getModel('main').getProperty('/sysParams/UNAME');
      var oCreatePayload = '';

      if (!this.bUpdateRecord) {
        oCreatePayload = {
          createdBy: sUser
        };
      } else {
        oCreatePayload = {
          processTypeId: oPayload.id,
          language: oPayload.language,
          description: oPayload.description
        };
      }

      if (this.bUpdateRecord) {
        this.handleSaveorUpdate(oCreatePayload, oPayload.id, "".concat(constant.api.DESCRIPTION_PROCESS_TYPE, "/").concat(oPayload.id)).then(function (data) {
          if (data.statusText === 'OK') {
            that.getProcessTypes();
            MessageBox.success(_this2.getResourceBundle().getText('0232'));
          }
        }).catch(function (error) {
          MessageBox.error(error.message);
        });
      } else {
        // oPayload.language = 'ES'
        this.handleSaveorUpdate(oCreatePayload, '', constant.api.PROCESS_TYPE_PATH).then(function (data) {
          oPayload = that.getView().getModel('Settings').getProperty('/createprocesstype');
          var oDescriptionPayload = {
            processTypeId: data.data.id,
            language: _this2.getModel('main').getProperty('/currentLanguage'),
            description: oPayload.description
          };
          that.handleSaveorUpdate(oDescriptionPayload, '', constant.api.DESCRIPTION_PROCESS_TYPE).then(function (dataValue) {
            if (dataValue.statusText === 'Created') {
              that.getProcessTypes();
              MessageBox.success(_this2.getResourceBundle().getText('0233'));
            }
          }).catch(function (error) {
            MessageBox.error(error.message);
          });
        });
      }

      this.handleCloseProcessTypeDialog();
    },
    handleCloseProcessTypeDialog: function handleCloseProcessTypeDialog() {
      this._oCreateNewData.then(function (oDialog) {
        oDialog.close();
      });
    },

    /* =========================================================== */

    /* finish: event handlers                                      */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */
    getProcessTypes: function getProcessTypes() {
      var sLanguage = this.getModel('main').getProperty('/currentLanguage');
      return http.get("".concat(constant.api.PROCESS_TYPE_PATH, "?language=").concat(sLanguage)).then(this._handleResponseData.bind(this));
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  };
});