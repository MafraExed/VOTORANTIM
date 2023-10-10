"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name checkIfNumberBetween
     * @description - Checks if a number is between two other numbers
     *
     * @public
     * @param {string} value - value to be checked
     * @param {number} min - minimum value
     * @param {number} max - maximum value
     * @returns {boolean} - Returns true if the number is between the two other numbers
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    function (value, min, max) {
      return parseFloat(value) >= min && parseFloat(value) <= max;
    }
  );
});