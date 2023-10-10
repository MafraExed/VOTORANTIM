"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name wrapText
     * @description - Envolver texto en una cantidad de caracteres esficificados
     *
     * @public
     * @param text - Texto
     * @returns {object[]}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    function () {
      var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var charLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 132;
      return text.match(new RegExp(".{1,".concat(charLength, "}"), 'g')) || [];
    }
  );
});