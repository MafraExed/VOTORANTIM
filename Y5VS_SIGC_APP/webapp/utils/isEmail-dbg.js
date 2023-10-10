"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name isEmail
     * @description - Checks if the string is an email.
     *
     * @public
     * @param {object} context
     * @param {string} context.email - Email
     * @returns {boolean} - It's valid!
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    function (_ref) {
      var email = _ref.email;
      return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
    }
  );
});