"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return (
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
     * @version 0.5.0
     */
    {
      getComboBoxData: function getComboBoxData(_ref) {
        var field = _ref.field;
        return _defineProperty({}, field.getName(), field.getSelectedKey());
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
       * @version 0.5.0
       */
      isComboBoxValid: function isComboBoxValid(_ref3) {
        var field = _ref3.field;
        return !!field.getSelectedKey();
      }
    }
  );
});