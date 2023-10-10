"use strict";

sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name notificationColor
     * @description - Formatear color de la notificaciÃ³n
     *
     * @public
     * @param {string} type - Tipo de notificaciÃ³n
     * @returns {string}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    function () {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var color = {
        E: '#ff0000',
        I: '#008a3b'
      };
      return color["".concat(type)] || '#008a3b';
    }
  );
});