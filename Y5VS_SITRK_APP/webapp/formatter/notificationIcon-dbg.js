"use strict";

sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name notificationIcon
     * @description - Formatear icono de la notificaciÃ³n
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
      var icon = {
        E: 'sap-icon://decline',
        I: 'sap-icon://accept'
      };
      return icon["".concat(type)] || 'sap-icon://accept';
    }
  );
});