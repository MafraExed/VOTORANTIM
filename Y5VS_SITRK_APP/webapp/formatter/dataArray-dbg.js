"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name dataArray
     * @description - Formatea un string con dataArray.
     *
     * @public
     * @param {any} array - Cadena con el pattern
     * @returns {string} - String formateado.
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    function (array) {
      var longText = '';

      if (array && array.length > 0) {
        array.forEach(function (e) {
          longText += "".concat(e.TDLINE, " ");
        });
      }

      return longText;
    }
  );
});