"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name columnTitleProcess
     * @description - Establece el titulo de la columna para la tabla de procesos
     *
     * @public
     * @param {string} REPTEXT - Texto estandar
     * @param {string} SCRTEXT_L - Texto largo
     * @param {string} SP_GROUP - Prefijo
     * @returns {string} - String formateado.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    function (REPTEXT, SCRTEXT_L, SP_GROUP) {
      var title = SCRTEXT_L || REPTEXT;
      return SP_GROUP ? "".concat(SP_GROUP, " ").concat(title) : "".concat(title);
    }
  );
});