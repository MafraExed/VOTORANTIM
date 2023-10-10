"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * BiddingPosition
 *
 * @namespace
 * @name com.innova.sitrack.model.purchaseTracking.biddingBiddingPosition
 * @public
 */
// Proporciona la implementaciÃ³n del modelo BiddingPosition
sap.ui.define(['sap/ui/base/Object', 'com/innova/sitrack/formatter/dataArray'], function (Object, dataArray) {
  return (
    /**
     * Constructor para un nuevo BiddingPosition.
     *
     * Modelo de un request para la consulta de procesos seleccionados
     *
     *
     * @class
     * @name - BiddingPosition
     * @description - ImplementaciÃ³n del modelo de BiddingPosition,
     *
     *
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sitrack.model.purchaseTracking.bidding.BiddingPosition
     */
    Object.extend('com.innova.sitrack.model.purchaseTracking.bidding.BiddingPosition', {
      constructor: function constructor(data) {
        this.posProc = data.posProc || null;
        this.matnr = data.PR_MATNR || null;
        this.maktx = data.PR_TXZ01 || null;
        this.menge = data.PR_MENGE2 || null;
        this.meins = data.PR_MEINS || null;
        this.werks = data.PR_WERKS || null;
        this.matkl = data.PR_MATKL || null;
        this.matklDesc = data.matklDesc || null;
        this.adStreet = data.adStreet || null;
        this.eeind = data.PR_LFDAT || null;
        this.banfn = data.BANFN || null;
        this.bnfpo = data.BNFPO || null;
        this.ernam = data.PR_ERNAM || null;
        this.afnam = data.PR_AFNAM || null;
        this.grun = dataArray(data.MAT_TEXT_LARGO);
        this.best = dataArray(data.MAT_TEXT_COMPR);
        this.processId = 0;
      }
    })
  );
});