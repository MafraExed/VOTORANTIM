"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * PedModif
 *
 * @namespace
 * @name com.innova.sitrack.model.purchaseTracking.PedModif
 * @public
 */
// Proporciona la implementaciÃ³n del modelo PedModif
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo PedModif.
     *
     * Modelo de un item para actualizar pedido
     *
     *
     * @class
     * @name PedModif
     * @description - ImplementaciÃ³n del modelo de PedModif
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sitrack.model.purchaseTracking.PedModif
     */
    Object.extend('com.innova.sitrack.model.purchaseTracking.PedModif', {
      constructor: function constructor(data) {
        this.IT_PEDMODIF = data.IT_PEDMODIF || [];
      }
    })
  );
});