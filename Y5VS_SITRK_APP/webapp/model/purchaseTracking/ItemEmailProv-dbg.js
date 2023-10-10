"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * ItemEmailProv
 *
 * @namespace
 * @name com.innova.sitrack.model.purchaseTracking.ItemEmailProv
 * @public
 */
// Proporciona la implementaciÃ³n del modelo ItemEmailProv
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo ItemEmailProv.
     *
     * Modelo de un request para obtener proveedores
     *
     *
     * @class
     * @name - ItemEmailProv
     * @description - ImplementaciÃ³n del modelo de ItemEmailProv
     *
     *
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sitrack.model.purchaseTracking.ItemEmailProv
     */
    Object.extend('com.innova.sitrack.model.purchaseTracking.ItemEmailProv', {
      constructor: function constructor(data) {
        this.LIFNR = data.POH_LIFNR;
        this.NAME1 = data.NAME1;
        this.SPRAS = data.SPRAS;
        this.E_MAILS = data.E_MAILS;
      }
    })
  );
});