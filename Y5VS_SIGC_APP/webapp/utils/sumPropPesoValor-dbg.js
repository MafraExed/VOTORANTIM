"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name sumPropPesoValor
     * @description - Sum property property pesoValor
     *
     * @public
     * @param {number} acc - Accumulator
     * @param {object} el - Element
     * @returns {number}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    function (acc, el) {
      return acc + el.pesoValor;
    }
  );
});