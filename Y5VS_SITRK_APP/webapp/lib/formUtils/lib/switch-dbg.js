"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sitrack/model/variant/ItemVariant'], function (ItemVariant) {
  return {
    /**
     * @function
     * @name getSwitchData
     * @description - Obtiene el valor del control Switch
     *
     * @public
     * @param {object} context
     * @param {boolean} context.isVariant - Es variante
     * @param {sap.m.Switch} context.field - Control VBox
     * @param {string} context.functionName - Nombre de la funciÃ³n para el backend
     * @param {string} context.group - Grupo al que pertenece el campo
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    getSwitchData: function getSwitchData(_ref) {
      var isVariant = _ref.isVariant,
          field = _ref.field,
          functionName = _ref.functionName,
          group = _ref.group;
      var name = field.getName();
      var state = field.getState() ? 'X' : '';

      if (isVariant) {
        return _defineProperty({}, name, new ItemVariant({
          fieldname: name,
          function: functionName,
          group: group,
          low: state,
          tabname: field.data('tabname')
        }));
      }

      return _defineProperty({}, name, state);
    },

    /**
     * @function
     * @name setSwitchData
     * @description - Obtener datos del control
     *
     * @private
     * @param {object} context
     * @param {sap.m.Switch} context.field - Campo
     * @param {object} context.data - Datos
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    setSwitchData: function setSwitchData(_ref4) {
      var field = _ref4.field,
          data = _ref4.data;
      field.setState(data.LOW === 'X');
    },

    /**
     * @function
     * @name cleanSwitch
     * @description - Limpiar control
     *
     * @private
     * @param {object} context
     * @param {sap.m.Switch} context.field - Campo
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    cleanSwitch: function cleanSwitch(_ref5) {
      var field = _ref5.field;
      field.setState();
    }
  };
});