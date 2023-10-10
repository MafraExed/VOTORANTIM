"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * EmailProv
 *
 * @namespace
 * @name com.innova.sitrack.model.purchaseTracking.EmailProv
 * @public
 */
// Proporciona la implementaciÃ³n del modelo EmailProv
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo EmailProv.
     *
     * Modelo de un request para la obtener proveedores del documento
     *
     *
     * @class
     * @name - EmailProv
     * @description - ImplementaciÃ³n del modelo de EmailProv
     *
     *
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sitrack.model.purchaseTracking.EmailProv
     */
    Object.extend('com.innova.sitrack.model.purchaseTracking.EmailProv', {
      constructor: function constructor(data) {
        this.IT_PROV = data.IT_PROV || [];
      }
    })
  );
});