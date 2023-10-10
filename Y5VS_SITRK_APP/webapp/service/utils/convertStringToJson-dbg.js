"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name convertStringToJson
     * @description - Convertir una cadena a JSON
     *
     * @private
     * @param {string} value - Valor a convertir
     * @returns {object|string}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    function (value) {
      try {
        return JSON.parse(value);
      } catch (error) {
        return value;
      }
    }
  );
});