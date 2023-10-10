"use strict";

sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name getObjTextProp
     * @description - Get object text
     *
     * @public
     * @param {string} key - Campo ayuda de busqueda
     * @param {object} obj - Campo ayuda de busqueda
     * @returns {string}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    function (key, obj) {
      var _obj$;

      return (_obj$ = obj["".concat(key)]) === null || _obj$ === void 0 ? void 0 : _obj$.text;
    }
  );
});