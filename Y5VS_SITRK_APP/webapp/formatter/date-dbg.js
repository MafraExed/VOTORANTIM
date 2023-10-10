"use strict";

/*!
 * SiTrack - Seguimiento de compras
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
     * @version 0.5.0
     */
    function (date) {
      return date && new Intl.DateTimeFormat(window.navigator.language, {
        timeZone: 'UTC'
      }).format(new Date(date));
    }
  );
});