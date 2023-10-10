"use strict";

sap.ui.define([], function () {
  var capitalize = {
    /**
     * @function
     * @name capitalizeFieldname
     * @description - Capitalizar fieldname SAP
     *
     * @public
     * @param {string} sFieldName String a concatenar y ser capitalizado.
     * @returns {string} - string concatenado.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    fieldname: function fieldname(sFieldName) {
      return sFieldName.split(/\s+/).map(function (w) {
        return w.includes('_') ? w.split(/_/).map(function (s) {
          return capitalize.firstLetter(s);
        }).join('') : capitalize.firstLetter(w);
      }).join();
    },

    /**
     * @function
     * @name capitalizeFirstLetter
     * @description - Capitaliza el string pasado.
     *
     * @public
     * @param {string} str - string a convertir.
     * @returns {string} - string formateado.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    firstLetter: function firstLetter(str) {
      return str && str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
  };
  return capitalize;
});