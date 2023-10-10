"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name isEmpty
     * @description - Valida si no es un valor null o undefined
     *
     * @public
     * @param {any} value - Mensaje a mostrar
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    function (value) {
      return (// null or undefined
        value == null || // has length and it's zero
        Object.prototype.hasOwnProperty.call(value, 'length') && value.length === 0 || // is an Object and has no keys
        value.constructor === Object && Object.keys(value).length === 0
      );
    }
  );
});