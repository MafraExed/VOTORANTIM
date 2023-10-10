"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sigc/model/constant', 'com/innova/sigc/service/petitions', 'sap/base/util/deepExtend', 'sap/m/MessageBox'],
/**
 * @class
 * @name DocumentType.js
 * @description - Handler of document type for the settings controller
 *
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
 * @param {object} constant
  *
 * @returns {object}
 *
 * @author Edwin Valencia <evalencia@innovainternacional.biz>
 * @version 1.0.0
 */
function (constant, petitions, deepExtend, MessageBox) {
  return {
    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */
    onAddNewDcoumentTypePress: function onAddNewDcoumentTypePress() {
      this.getView().getModel('Settings').setProperty('/IsCreateDocumentType', true);
      this.bUpdateDocumentType = false;
      this.handleOpenDocumentTypeDialog();
    },
    handleOpenDocumentTypeDialog: function handleOpenDocumentTypeDialog(oSelectedObject) {
      var _this = this;

      this._oDocumentTypeDialog = sap.ui.core.Fragment.load({
        name: 'com.innova.sigc.view.settings.fragment.CreateDocumentType',
        controller: this
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control; // connect dialog to the root view of this component (models, lifecycle)

        _this.getView().addDependent(oDialog);

        oDialog.addStyleClass(_this.getOwnerComponent().getContentDensityClass());
        oDialog.attachAfterClose(oDialog.destroy.bind(oDialog));
        return oDialog;
      });

      this._oDocumentTypeDialog.then(function (oDialog) {
        if (!oSelectedObject) {
          _this.getModel('Settings').setProperty('/createdocumenttype', {
            BSART: '',
            WERKS_F: '',
            WERKS_T: ''
          });
        }

        oDialog.open();
      });
    },
    onCreateDocumentTypePress: function onCreateDocumentTypePress() {
      var oPayload = deepExtend({}, this.getView().getModel('Settings').getProperty('/createdocumenttype'));

      if (this.bUpdateDocumentType) {
        oPayload.CRUD = 'U';

        this._saveOrUpdateDocumentType(oPayload);
      } else {
        // oPayload.language = 'ES'
        oPayload.CRUD = 'C';

        this._saveOrUpdateDocumentType(oPayload);
      }
    },
    handleCloseDocumentTypeDialog: function handleCloseDocumentTypeDialog() {
      return this._oDocumentTypeDialog.then(function (oDialog) {
        oDialog.close();
      });
    },
    onDocumentTypeRowDeletePress: function onDocumentTypeRowDeletePress() {
      var aSelectedRow = this.getView().getModel('Settings').getProperty('/selectedTableRow');

      if (aSelectedRow.length === 0) {
        MessageBox.error(this.getResourceBundle().getText('Commons.0022'));
        return;
      }

      var oSelectedObject = aSelectedRow[0];
      oSelectedObject.CRUD = 'D';

      this._openDeleteRecordDialog('', '', true, oSelectedObject);
    },
    onDocumentTypeEditPress: function onDocumentTypeEditPress() {
      var aSelectedRow = this.getView().getModel('Settings').getProperty('/selectedTableRow');

      if (aSelectedRow.length === 0) {
        MessageBox.error(this.getResourceBundle().getText('Commons.0022'));
        return;
      }

      var oSelectedObject = aSelectedRow[0];
      this.getView().getModel('Settings').setProperty('/IsCreateDocumentType', false);
      this.bUpdateDocumentType = true;
      this.getView().getModel('Settings').setProperty('/createdocumenttype', oSelectedObject);
      this.handleOpenDocumentTypeDialog(oSelectedObject);
    },

    /* =========================================================== */

    /* finish: event handlers                                      */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */
    getDocumentTypes: function getDocumentTypes() {
      var that = this;
      return petitions.post(constant.GET_CONF_DOCS, {
        IT_DOCS: [{
          CRUD: 'R'
        }]
      }).then(function (_ref) {
        var data = _ref.data;
        that.getView().getModel('Settings').setProperty('/documenttypes', data);
      }).catch(this.errorHandler.bind(this));
    },
    _saveOrUpdateDocumentType: function _saveOrUpdateDocumentType(oPayload) {
      petitions.post(constant.GET_CONF_DOCS, {
        IT_DOCS: [oPayload]
      }).then(this.getDocumentTypes.bind(this)).then(this.handleCloseDocumentTypeDialog.bind(this)).catch(this.errorHandler.bind(this));
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  };
});