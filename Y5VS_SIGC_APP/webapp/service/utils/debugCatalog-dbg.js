"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return function () {
    var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return (
      /**
       * @function
       * @name debugCatalog
       * @description - Depurar el catalogo eliminando campos tecnicos u ocultos y ordenando
       *
       * @private
       * @param {object[]} arr - Catalogo de campos
       * @returns {object[]}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      arr.filter(function (a) {
        return a.TECH !== 'X' && a.NO_OUT !== 'X';
      }).sort(function (a, b) {
        return a.COL_POS - b.COL_POS;
      })
    );
  };
});