"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return {
    /**
     * @function
     * @name getDatePickerData
     * @description - get data from DatePicker
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
    getDatePickerData: function getDatePickerData(_ref) {
      var field = _ref.field;
      var name = field.getName();
      var value = field.getValue();

      if (value) {
        return _defineProperty({}, name, field.getDateValue().toISOString());
      }

      return _defineProperty({}, name, null);
    },

    /**
     * @function
     * @name setDatePickerData
     * @description - Set data to DatePicker
     *
     * @private
     * @param {object} context
     * @param {sap.m.DatePicker} context.field - Campo
     * @param {object} context.data - Datos
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    setDatePickerData: function setDatePickerData(_ref4) {
      var field = _ref4.field,
          data = _ref4.data;
      var name = field.getName();
      var value = data[name];

      if (value) {
        field.setDateValue(new Date(value));
      }
    },

    /**
     * @function
     * @name cleanDatePicker
     * @description - Clean DatePicker
     *
     * @private
     * @param {object} context
     * @param {sap.m.DatePicker} context.field - field
     * @returns {void} - Noting to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    cleanDatePicker: function cleanDatePicker(_ref5) {
      var field = _ref5.field;
      field.setDateValue();
    }
  };
});