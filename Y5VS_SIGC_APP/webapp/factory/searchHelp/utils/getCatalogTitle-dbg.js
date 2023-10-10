"use strict";

sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name getCatalogTitle
     * @description - Obtener titulo del catalogo
     *
     * @public
     * @param {Object} oCatalog - Catalogo
     * @returns {String}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    function (_ref) {
      var SCRTEXT_L = _ref.SCRTEXT_L,
          REPTEXT = _ref.REPTEXT;
      return SCRTEXT_L || REPTEXT;
    }
  );
});