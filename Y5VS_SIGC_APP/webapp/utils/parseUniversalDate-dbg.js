"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name parseUniversalDate
     * @description - Parses a universal date string to a JavaScript Date object.
     *
     * @public
     * @param {string} value - The universal date string to parse.
     * @returns {Date}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    function (value) {
      return value && new Date(value.replace(/-/g, '/').replace(/T.+/, ''));
    }
  );
});