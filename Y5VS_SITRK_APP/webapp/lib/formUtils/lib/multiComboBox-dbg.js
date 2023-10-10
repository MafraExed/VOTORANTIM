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
     * @name getMultiComboBoxData
     * @description - Obtiene el valor del control ComboBox
     *
     * @public
     * @param {object} context
     * @param {sap.m.MultiComboBox} context.field - Control
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    getMultiComboBoxData: function getMultiComboBoxData(_ref) {
      var field = _ref.field;
      var keys = field.getSelectedKeys();
      return keys.length && _defineProperty({}, field.getName(), field.getSelectedKeys());
    },

    /**
     * @function
     * @name setMultiComboBoxData
     * @description - Set MultiComboBox data.
     *
     * @public
     * @param {object} context
     * @param {sap.m.MultiComboBox} context.field - Campo
     * @param {string|object} context.data - Datos
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    setMultiComboBoxData: function setMultiComboBoxData(_ref3) {
      var field = _ref3.field,
          data = _ref3.data;
      field.setSelectedKeys(data[field.getName()].map(function (_ref4) {
        var key = _ref4.key;
        return key;
      }));
    },

    /**
     * @function
     * @name isMultiComboBoxValid
     * @description - Is MultiComboBox valid.
     *
     * @public
     * @param {object} context
     * @param {sap.m.MultiComboBox} context.field - Campo
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    isMultiComboBoxValid: function isMultiComboBoxValid(_ref5) {
      var field = _ref5.field;
      return field.getSelectedItems().length > 0;
    },

    /**
     * @function
     * @name cleanMultiInput
     * @description - Clean MultiComboBox.
     *
     * @public
     * @param {object} context
     * @param {sap.m.MultiComboBox} context.field - field
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    cleanMultiComboBox: function cleanMultiComboBox(_ref6) {
      var field = _ref6.field;
      field.resetProperty('selectedKeys');
    }
  };
});