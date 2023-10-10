"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * PositionSap
 *
 * @namespace
 * @name com.innova.sitrack.model.purchaseTracking.biddingPositionSap
 * @public
 */
// Proporciona la implementaciÃ³n del modelo PositionSap
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo PositionSap.
     *
     * Modelo de un request para la consulta de procesos seleccionados
     *
     *
     * @class
     * @name - PositionSap
     * @description - ImplementaciÃ³n del modelo de PositionSap,
     *
     *
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sitrack.model.purchaseTracking.bidding.PositionSap
     */
    Object.extend('com.innova.sitrack.model.purchaseTracking.bidding.PositionSap', {
      constructor: function constructor(data) {
        this.IT_LICITACION_MODIF = {
          item: data
        };
      }
    })
  );
});