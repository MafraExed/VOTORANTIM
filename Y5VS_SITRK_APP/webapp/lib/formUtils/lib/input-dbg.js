"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sitrack/model/variant/ItemVariant'], function (ItemVariant) {
  return (
    /**
     * @function
     * @name getInputData
     * @description - Obtiene el valor del control Input
     *
     * @public
     * @param {object} context
     * @param {boolean} context.isVariant - Es variante
     * @param {object} context.field - Control VBox
     * @param {string} context.functionName - Nombre de la funciÃ³n para el backend
     * @param {string} context.group - Grupo al que pertenece el campo
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    {
      getInputData: function getInputData(_ref) {
        var isVariant = _ref.isVariant,
            field = _ref.field,
            functionName = _ref.functionName,
            group = _ref.group;
        var name = field.getName();
        var value = field.getValue();

        if (isVariant) {
          return _defineProperty({}, name, new ItemVariant({
            fieldname: name,
            function: functionName,
            group: group,
            low: value,
            tabname: field.data('tabname')
          }));
        }

        return _defineProperty({}, name, value);
      },

      /**
       * @function
       * @name setInputData
       * @description - Obtener datos del control
       *
       * @private
       * @param {object} context
       * @param {sap.m.Input} context.field - Campo
       * @param {object} context.data - Datos
       * @returns {void} - No retorna nada.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      setInputData: function setInputData(_ref4) {
        var field = _ref4.field,
            data = _ref4.data;
        field.setValue(data.LOW);
      },

      /**
       * @function
       * @name cleanMultiInput
       * @description - Limpiar control
       *
       * @private
       * @param {object} context
       * @param {sap.m.Input} context.field - Campo
       * @returns {void} - No retorna nada.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      cleanInput: function cleanInput(_ref5) {
        var field = _ref5.field;
        field.setValue(undefined);
        field.setDescription(undefined);
      },

      /**
       * @function
       * @name isInputValid
       * @description - Valida si el valor del control es valido
       *
       * @public
       * @param {object} context
       * @param {sap.m.Input} context.field - Campo
       * @returns {boolean}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      isInputValid: function isInputValid(_ref6) {
        var field = _ref6.field;

        if (field.getShowSuggestion() || field.getValueHelpOnly()) {
          return !!field.getSelectedKey();
        }

        return !!field.getValue();
      }
    }
  );
});