"use strict";

sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name maxLength
     * @description - Convierte un String a entero, para campos de mÃ¡xima longitud.
     *
     * @public
     * @param {string} sIntlen - Entero a convertir
     * @returns {number}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    function () {
      var intlen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '5';
      var bNotnumber = Number.isNaN(intlen);

      if (bNotnumber) {
        return 0;
      }

      return parseInt(intlen, 10);
    }
  );
});