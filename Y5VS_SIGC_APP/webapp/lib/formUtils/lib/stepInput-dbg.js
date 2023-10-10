"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name getStepInputData
     * @description - Obtiene el valor del control StepInput
     *
     * @public
     * @param {object} context
     * @param {sap.m.StepInput} context.field - Control
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    {
      getStepInputData: function getStepInputData(_ref) {
        var field = _ref.field;
        return _defineProperty({}, field.getName(), field.getValue());
      }
    }
  );
});