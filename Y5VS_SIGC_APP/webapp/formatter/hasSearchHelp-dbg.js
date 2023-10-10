"use strict";

sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name hasSearchHelp
     * @description - Validar si el campo tiene ayuda de busqueda
     *
     * @public
     * @param {string} f4availabl - Campo ayuda de busqueda
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    function (f4availabl) {
      return f4availabl === 'X';
    }
  );
});