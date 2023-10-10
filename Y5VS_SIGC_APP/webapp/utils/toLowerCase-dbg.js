"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name toLowerCase
     * @description - Utility for converting a string to lowercase if the property lowercase is not set X
     *
     * @public
     * @param {string} lowercase - CondiciÃ³n
     * @param {string} value - Mensaje del error
     * @returns {string}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    function (lowercase, value) {
      if (lowercase !== 'X') {
        return value.toUpperCase();
      }

      return value;
    }
  );
});