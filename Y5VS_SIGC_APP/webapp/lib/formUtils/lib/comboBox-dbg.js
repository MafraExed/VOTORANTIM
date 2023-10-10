"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return {
    /**
     * @function
     * @name getComboBoxData
     * @description - Obtiene el valor del control ComboBox
     *
     * @public
     * @param {object} context
     * @param {sap.m.ComboBox} context.field - Control
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    getComboBoxData: function getComboBoxData(_ref) {
      var field = _ref.field;
      return _defineProperty({}, field.getName(), field.getSelectedKey());
    },

    /**
     * @function
     * @name setComboBoxData
     * @description - Set comboBox data.
     *
     * @public
     * @param {object} context
     * @param {sap.m.ComboBox} context.field - Campo
     * @param {string|object} context.data - Datos
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    setComboBoxData: function setComboBoxData(_ref3) {
      var field = _ref3.field,
          data = _ref3.data;
      field.setSelectedKey(data[field.getName()]);
    },

    /**
     * @function
     * @name isComboBoxValid
     * @description - Is ComboBox valid.
     *
     * @public
     * @param {object} context
     * @param {sap.m.ComboBox} context.field - field
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    isComboBoxValid: function isComboBoxValid(_ref4) {
      var field = _ref4.field;
      return !!field.getSelectedKey();
    },

    /**
     * @function
     * @name cleanMultiInput
     * @description - Limpiar control
     *
     * @public
     * @param {object} context
     * @param {sap.m.ComboBox} context.field - Campo
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    cleanComboBox: function cleanComboBox(_ref5) {
      var field = _ref5.field;
      field.resetProperty('selectedKey');
    }
  };
});