"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * SolModif
 *
 * @namespace
 * @name com.innova.sitrack.model.purchaseTracking.SolModif
 * @public
 */
// Proporciona la implementaciÃ³n del modelo SolModif
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo SolModif.
     *
     * Modelo de un request para actualizar la Solicitud de pedido
     *
     *
     * @class
     * @name SolModif
     * @description - ImplementaciÃ³n del modelo de SolModif
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sitrack.model.purchaseTracking.SolModif
     */
    Object.extend('com.innova.sitrack.model.purchaseTracking.SolModif', {
      constructor: function constructor(data) {
        this.IT_SOLMODIF = data.IT_SOLMODIF || [];
      }
    })
  );
});