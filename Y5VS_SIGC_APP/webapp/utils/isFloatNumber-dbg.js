"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name isFloatNumber
     * @description - Valida si el valor del Input es un numero flotante
     *
     * @public
     * @param {string} value - valor
     * @returns {boolean} - si es valido
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    function (value) {
      return !(/[a-zA-Z ]+/.test(value) || /[@#$%`Â·ÂºÂ´^&Âª*Â¨Ã‡()_+\-=[\]{};':"\\|<>/Â¿?Â¡!]/.test(value));
    }
  );
});