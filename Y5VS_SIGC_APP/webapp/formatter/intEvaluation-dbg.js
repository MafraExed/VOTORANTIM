"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name intEvaluation
     * @description - Vuelve int el tipo de evaluaciÃ³n
     *
     * @public
     * @param {any} evaluationMethod
     * @returns {number}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    function (evaluationMethod) {
      return parseInt(evaluationMethod, 10);
    }
  );
});