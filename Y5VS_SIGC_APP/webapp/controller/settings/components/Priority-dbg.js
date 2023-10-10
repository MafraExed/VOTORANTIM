"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sigc/model/constant', 'com/innova/sigc/service/petitions', 'sap/base/util/deepExtend', 'sap/m/MessageBox'],
/**
 * @class
 * @name Priority.js
 * @description - Handler of priority for the settings controller
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
    onAddNewPriorities: function onAddNewPriorities() {
      this.getView().getModel('Settings').setProperty('/IsCreatePriorities', true);
      this.bUpdatePriority = false;
      this.handleOpenPriorityDialog();
    },
    handleOpenPriorityDialog: function handleOpenPriorityDialog(oSelectedPriority) {
      var _this = this;

      this._oPrioritiesDialog = sap.ui.core.Fragment.load({
        id: this.getView().getId(),
        name: 'com.innova.sigc.view.settings.fragment.CreatePriority',
        controller: this
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control; // connect dialog to the root view of this component (models, lifecycle)

        _this.getView().addDependent(oDialog);

        oDialog.addStyleClass(_this.getOwnerComponent().getContentDensityClass());
        oDialog.attachAfterClose(oDialog.destroy.bind(oDialog));

        if (!oSelectedPriority) {
          _this.getModel('Settings').setProperty('/createpriority', {
            PRIORIDAD: '',
            ERNAM: '',
            KNTTP: '',
            PSTYP: '',
            EKORG: '',
            CONTRACT: '',
            LAST_BUYER: '',
            BUYER: ''
          });
        }

        return oDialog;
      });

      this._oPrioritiesDialog.then(function (oDialog) {
        oDialog.open();
      });
    },
    onCreateorUpdatePriorityPress: function onCreateorUpdatePriorityPress() {
      var oPayload = deepExtend({}, this.getView().getModel('Settings').getProperty('/createpriority'));

      if (this.bUpdatePriority) {
        oPayload.CRUD = 'U';

        this._saveOrUpdatePriorities(oPayload);
      } else {
        oPayload.CRUD = 'C';

        this._saveOrUpdatePriorities(oPayload);
      }
    },
    onPriorityCancelPress: function onPriorityCancelPress() {
      return this._oPrioritiesDialog.then(function (oDialog) {
        oDialog.close();
      });
    },
    onPriorityDeletePress: function onPriorityDeletePress() {
      var aSelectedRow = this.getView().getModel('Settings').getProperty('/selectedTableRow');

      if (aSelectedRow.length === 0) {
        MessageBox.error(this.getResourceBundle().getText('Commons.0022'));
        return;
      }

      var oSelectedObject = aSelectedRow[0];
      oSelectedObject.CRUD = 'D';

      this._openDeleteRecordDialog('', '', true, oSelectedObject);
    },
    onPriorityEditPress: function onPriorityEditPress() {
      var aSelectedRow = this.getView().getModel('Settings').getProperty('/selectedTableRow');

      if (aSelectedRow.length === 0) {
        MessageBox.error(this.getResourceBundle().getText('Commons.0022'));
        return;
      }

      var oSelectedObject = aSelectedRow[0];
      this.getView().getModel('Settings').setProperty('/IsCreatePriorities', false);
      this.bUpdatePriority = true;
      this.getView().getModel('Settings').setProperty('/createpriority', deepExtend({}, oSelectedObject));
      this.handleOpenPriorityDialog(oSelectedObject);
    },

    /* =========================================================== */

    /* finish: event handlers                                      */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */
    _saveOrUpdatePriorities: function _saveOrUpdatePriorities(oPayload) {
      petitions.post(constant.GET_CONF_PRIORITY, {
        IT_PRIOR: [oPayload]
      }).then(this.getPriorities.bind(this)).then(this.onPriorityCancelPress.bind(this)).catch(this.errorHandler.bind(this));
    },
    getPriorities: function getPriorities() {
      var oSettingsModel = this.getView().getModel('Settings');
      return petitions.post(constant.GET_CONF_PRIORITY, {
        IT_PRIOR: [{
          CRUD: 'R'
        }]
      }).then(function (_ref) {
        var data = _ref.data;
        return oSettingsModel.setProperty('/priorities', data);
      }).then(petitions.post.bind(petitions, constant.GET_BUYERS)).then(function (_ref2) {
        var data = _ref2.data;
        oSettingsModel.setProperty('/buyers', data);
      });
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  };
});