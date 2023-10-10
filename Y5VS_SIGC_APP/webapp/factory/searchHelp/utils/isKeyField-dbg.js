"use strict";

sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name isKeyField
     * @description - Valida si es un campo clave
     *
     * @public
     * @param {Object} oCatalog - Catalogo
     * @returns {Boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    function (_ref) {
      var KEY = _ref.KEY,
          KEY_SEL = _ref.KEY_SEL;
      return KEY === 'X' || KEY_SEL === 'X';
    }
  );
});