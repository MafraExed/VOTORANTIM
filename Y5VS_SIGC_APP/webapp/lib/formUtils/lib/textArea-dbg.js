"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sigc/model/variant/ItemVariant'], function (ItemVariant) {
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
     * @version 1.0.0
     */
    {
      getTextAreaData: function getTextAreaData(_ref) {
        var isVariant = _ref.isVariant,
            field = _ref.field,
            functionName = _ref.functionName,
            group = _ref.group;
        var name = field.getName();
        var value = field.getValue() || null;

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
      }
    }
  );
});