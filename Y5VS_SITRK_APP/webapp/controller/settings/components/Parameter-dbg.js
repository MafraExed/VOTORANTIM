"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/model/constant', 'com/innova/service/petitions', 'sap/base/util/deepExtend', 'sap/m/MessageBox'],
/**
 * @class
 * @name Parameter.js
 * @description - Handler of parameter for the settings controller
 *
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
 * @param {object} constant
  *
 * @returns {object}
 *
 * @author Edwin Valencia <evalencia@innovainternacional.biz>
 * @version 0.5.0
 */
function (constant, petitions, deepExtend, MessageBox) {
  return {
    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */

    /**
     * @function
     * @name onAddNewParameter
     * @description - Agregar nuevo registro de parÃ¡metros
     *
     * @private
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    onAddNewParameter: function onAddNewParameter() {
      this.getView().getModel('Settings').setProperty('/IsCreateParameters', true);
      this.bCreateParameter = true;

      this._openParameterDialog();
    },

    /**
     * @function
     * @name onCreateorUpdateParameterPress
     * @description - Validar si se debe crear o editar un registro
     *
     * @private
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    onCreateorUpdateParameterPress: function onCreateorUpdateParameterPress() {
      var oPayload = deepExtend({}, this.getView().getModel('Settings').getProperty('/createparameter'));

      if (this.bCreateParameter) {
        oPayload.IV_OPERATION = '1'; // Crear

        this._saveOrUpdateParameters(oPayload);
      } else {
        oPayload.IV_OPERATION = '2'; // Editar

        this._saveOrUpdateParameters(oPayload);
      }
    },

    /**
     * @function
     * @name onParameterEditPress
     * @description - EdiciÃ³n de un registro
     *
     * @private
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    onParameterEditPress: function onParameterEditPress() {
      var aSelectedRow = this.getView().getModel('Settings').getProperty('/selectedTableRow');

      if (aSelectedRow.length === 0) {
        MessageBox.error(this.getResourceBundle().getText('Settings.0029'));
        return;
      }

      var oSelectedObject = aSelectedRow[0];
      this.getView().getModel('Settings').setProperty('/IsCreateParameters', false);
      this.bCreateParameter = false;
      this.getView().getModel('Settings').setProperty('/createparameter', deepExtend({}, oSelectedObject));

      this._openParameterDialog(oSelectedObject);
    },

    /**
     * @function
     * @name onParameterDeletePress
     * @description - Eliminar de un registro
     *
     * @private
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    onParameterDeletePress: function onParameterDeletePress() {
      var aSelectedRow = this.getView().getModel('Settings').getProperty('/selectedTableRow');

      if (aSelectedRow.length === 0) {
        MessageBox.error(this.getResourceBundle().getText('Settings.0029'));
        return;
      }

      var oSelectedObject = aSelectedRow[0];
      oSelectedObject.IV_OPERATION = '4';

      this._openDeleteRecordDialog('', '', true, oSelectedObject);
    },

    /* =========================================================== */

    /* finish: event handlers                                      */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */

    /**
     * @function
     * @name _saveOrUpdateParameters
     * @description - Almacenar/Actualizar de un registro
     *
     * @private
     * @params {oPayload} - Request a enviar a SAP
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    _saveOrUpdateParameters: function _saveOrUpdateParameters(oPayload) {
      petitions.post(constant.PARAMETERS_SETTINGS, {
        IT_PARAMS: [{
          MANDT: '',
          PARNAME: oPayload.PARNAME.trim(),
          PARLINE: oPayload.PARLINE,
          PARVALUE: oPayload.PARVALUE
        }],
        IV_OPERATION: oPayload.IV_OPERATION
      }).then(this.getParameters.bind(this)).then(this.closeParameterDialog.bind(this)).then(this.clearSelectedIndex.bind(this)).catch(this.errorHandler.bind(this));
    },

    /**
     * @function
     * @name _openParameterDialog
     * @description - Almacenar/Actualizar de un registro
     *
     * @private
     * @params {oSelectedParameter} - Item seleccionado
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    _openParameterDialog: function _openParameterDialog(oSelectedParameter) {
      var _this = this;

      this._oParameterDialog = sap.ui.core.Fragment.load({
        id: this.getView().getId(),
        name: 'com.innova.sitrack.view.settings.fragment.CreateParameter',
        controller: this
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control; // connect dialog to the root view of this component (models, lifecycle)

        _this.getView().addDependent(oDialog);

        oDialog.addStyleClass(_this.getOwnerComponent().getContentDensityClass());
        oDialog.attachAfterClose(oDialog.destroy.bind(oDialog));

        if (!oSelectedParameter) {
          _this.getModel('Settings').setProperty('/createparameter', {
            PARNAME: '',
            PARVALUE: '',
            PARLINE: ''
          });
        }

        return oDialog;
      });

      this._oParameterDialog.then(function (oDialog) {
        oDialog.open();
      });
    },

    /**
     * @function
     * @name closeParameterDialog
     * @description - Cerrar dialogo de parÃ¡metros
     *
     * @private
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    closeParameterDialog: function closeParameterDialog() {
      return this._oParameterDialog.then(function (oDialog) {
        oDialog.close();
      });
    },

    /**
     * @function
     * @name getParameters
     * @description - Consultar parÃ¡metros existentes
     *
     * @private
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    getParameters: function getParameters() {
      var oSettingsModel = this.getView().getModel('Settings');
      return petitions.post(constant.PARAMETERS_SETTINGS, {
        IT_PARAMS: '',
        IV_OPERATION: '3' // Consultar

      }).then(function (_ref) {
        var data = _ref.data;
        oSettingsModel.setProperty('/parameters', data.data);
      });
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  };
});