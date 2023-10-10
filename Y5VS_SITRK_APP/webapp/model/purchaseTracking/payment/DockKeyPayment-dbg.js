"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * DockKeyPayment
 *
 * @namespace
 * @name com.innova.sitrack.model.purchaseTracking.payment.DockKeyPayment
 * @public
 */
// Proporciona la implementaciÃ³n del modelo DockKeyPayment
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo DockKeyPayment.
     *
     * Modelo de un request para la consulta de procesos seleccionados
     *
     *
     * @class
     * @name - DockKeyPayment
     * @description - ImplementaciÃ³n del modelo de DockKeyPayment,
     *
     *
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sitrack.model.purchaseTracking.payment.DockKeyPayment
     */
    Object.extend('com.innova.sitrack.model.purchaseTracking.payment.DockKeyPayment', {
      constructor: function constructor(data) {
        this.EBELN = data.EBELN || null;
        this.EBELP = data.EBELP || null;
      }
    })
  );
});