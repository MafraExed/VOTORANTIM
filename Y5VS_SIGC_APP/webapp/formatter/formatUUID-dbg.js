"use strict";

sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name formatUUID
     * @description - Formats a UUID
     *
     * @public
     * @param {string} uuid - array de emails del proveedor
     * @returns {string}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    function () {
      var uuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return uuid && uuid.split('-').pop();
    }
  );
});