"use strict";

sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name getEmailString
     * @description - Crea un string plano separado por , basado en el array de emails del proveedor
     *
     * @public
     * @param {array} arrayEmails - array de emails del proveedor
     * @returns {string}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    function (arrayEmails) {
      var stringEmail = '';

      if (arrayEmails) {
        stringEmail = arrayEmails.map(function (email) {
          return email.smtpAddr;
        }).join(', ');
      }

      return stringEmail;
    }
  );
});