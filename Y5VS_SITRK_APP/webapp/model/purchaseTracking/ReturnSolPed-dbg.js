"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * ReturnSolPed
 *
 * @namespace
 * @name com.innova.sitrack.model.purchaseTracking.ReturnSolPed
 * @public
 */
// Proporciona la implementaciÃ³n del modelo ReturnSolPed
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo ReturnSolPed.
     *
     * Modelo de un request para retornar o ajustar la solicitud de pedido
     *
     *
     * @class
     * @name - ReturnSolPed
     * @description - ImplementaciÃ³n del modelo de ReturnSolPed
     *
     *
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sitrack.model.purchaseTracking.ReturnSolPed
     */
    Object.extend('com.innova.sitrack.model.purchaseTracking.ReturnSolPed', {
      constructor: function constructor(data) {
        this.IT_SOLP = data.IT_SOLP || [];
        this.IT_EMAIL = data.IT_EMAIL || [];
      }
    })
  );
});