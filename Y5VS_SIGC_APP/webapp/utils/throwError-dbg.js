"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name throwError
     * @description - Lanzar error si la condiciÃ³n es verdadera
     *
     * @public
     * @param {boolean} condition - CondiciÃ³n
     * @param {string} message - Mensaje del error
     * @returns {void} - No retorna nada
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    function (condition, message) {
      if (condition) {
        throw new Error(message);
      }
    }
  );
});