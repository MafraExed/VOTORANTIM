"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * GetAttachment
 *
 * @namespace
 * @name com.innova.sitrack.model.purchaseTracking.GetAttachment
 * @public
 */
// Proporciona la implementaciÃ³n del modelo GetAttachment
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo GetAttachment.
     *
     * Modelo de un request para la consulta de aprobaciones de procesos seleccionados
     *
     *
     * @class
     * @name - GetAttachment
     * @description - ImplementaciÃ³n del modelo de GetAttachment,
     *
     *
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sitrack.model.purchaseTracking.GetAttachment
     */
    Object.extend('com.innova.sitrack.model.purchaseTracking.GetAttachment', {
      constructor: function constructor(data) {
        this.IV_ADJID = data.id || '';
      }
    })
  );
});