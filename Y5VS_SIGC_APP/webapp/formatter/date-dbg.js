"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name date
     * @description - Format date.
     *
     * @public
     * @param {string} date - Date
     * @returns {string}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    function (date) {
      return date && new Intl.DateTimeFormat(window.navigator.language, {
        timeZone: 'UTC'
      }).format(new Date(date));
    }
  );
});