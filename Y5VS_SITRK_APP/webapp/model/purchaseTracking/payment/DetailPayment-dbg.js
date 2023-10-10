"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * DetailPayment
 *
 * @namespace
 * @name com.innova.sitrack.model.purchaseTracking.payment.DetailPayment
 * @public
 */
// Proporciona la implementaciÃ³n del modelo DetailPayment
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo DetailPayment.
     *
     * Modelo de un request para la consulta de procesos seleccionados
     *
     *
     * @class
     * @name - DetailPayment
     * @description - ImplementaciÃ³n del modelo de DetailPayment,
     *
     *
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sitrack.model.purchaseTracking.payment.DetailPayment
     */
    Object.extend('com.innova.sitrack.model.purchaseTracking.payment.DetailPayment', {
      constructor: function constructor(data) {
        this.IT_DOCKEYS = data.IT_DOCKEYS || [];
        this.IR_SDP_PAYSTATUS = data.IV_SDP_PAYSTATUS || null;
        this.IR_SDP_PAYNUM = data.IV_SDP_PAYNUM || null;
        this.IR_SDP_PAYDATE = data.IV_SDP_PAYDATE || null;
        this.IR_SDP_BLDAT = data.IV_SDP_BLDAT || null;
        this.IR_SDP_EKGRP = data.IV_SDP_EKGRP || null;
        this.IR_SDP_DELIVDATE = data.IV_SDP_DELIVDATE || null;
      }
    })
  );
});