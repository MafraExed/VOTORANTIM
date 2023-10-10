"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * ItemEmailAddress
 *
 * @namespace
 * @name com.innova.sitrack.model.purchaseTracking.ItemEmailAddress
 * @public
 */
// Proporciona la implementaciÃ³n del modelo ItemEmailAddress
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo ItemEmailAddress.
     *
     * Modelo de un request para enviar las direcciones de correo
     *
     *
     * @class
     * @name - ItemEmailAddress
     * @description - ImplementaciÃ³n del modelo de ItemEmailAddress
     *
     *
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sitrack.model.purchaseTracking.ItemEmailAddress
     */
    Object.extend('com.innova.sitrack.model.purchaseTracking.ItemEmailAddress', {
      constructor: function constructor(sEmailAddress) {
        this.UNAME = '';
        this.REGID = '';
        this.RECIPNAME = '';
        this.EMAIL = sEmailAddress;
      }
    })
  );
});