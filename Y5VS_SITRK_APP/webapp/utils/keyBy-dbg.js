"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name keyBy
     * @description - Convierte un arreglo en un objeto de indices, segÃºn la propiedad pasada
     *
     * @private
     * @param {object} arr - Arreglo a convertir
     * @param {string} key - Propiedad a usar
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    function (arr, key) {
      return arr.reduce(function (acc, el) {
        acc["".concat(el["".concat(key)])] = el;
        return acc;
      }, {});
    }
  );
});