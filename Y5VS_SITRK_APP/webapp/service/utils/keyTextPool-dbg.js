"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name keyTextPool
     * @description - Convierte el arreglo de textos en un objeto de indices
     *
     * @private
     * @param {object} arr - Lista de textos
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    function () {
      var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return arr.reduce(function (acc, el) {
        acc["K".concat(el.KEY)] = el.ENTRY;
        return acc;
      }, {});
    }
  );
});