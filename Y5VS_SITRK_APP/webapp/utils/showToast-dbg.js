"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['sap/m/MessageToast'], function (MessageToast) {
  return (
    /**
     * @function
     * @name showToast
     * @description - Permite mostrar un sap.m.MessageToast con duraciÃ³n de 3s.
     *
     * @public
     * @param {string} sMessage - Mensaje para mostrar.
     * @returns {void} - No retorna nada
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    function (sMessage) {
      MessageToast.show(sMessage, {
        duration: 3000,
        width: 'auto',
        closeOnBrowserNavigation: false
      });
    }
  );
});