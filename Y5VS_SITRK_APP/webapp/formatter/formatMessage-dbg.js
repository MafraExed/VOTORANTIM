"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['sap/base/strings/formatMessage'], function (formatMessage) {
  return (
    /**
     * @function
     * @name formatMessage
     * @description - Formatea un string con formatMessage.
     *
     * @public
     * @param {object} sPatternString - Cadena con el pattern
     * @param {object} oArgs - Argumentos de la funciÃ³n
     * @returns {string} - String formateado.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    function (sPatternString) {
      for (var _len = arguments.length, oArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        oArgs[_key - 1] = arguments[_key];
      }

      return formatMessage(sPatternString, oArgs);
    }
  );
});