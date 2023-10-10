"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * Approval
 *
 * @namespace
 * @name com.innova.sitrack.model.purchaseTracking.Approval
 * @public
 */
// Proporciona la implementaciÃ³n del modelo Approval
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo Approval.
     *
     * Modelo de un request para la consulta de aprobaciones de procesos seleccionados
     *
     *
     * @class
     * @name - Approval
     * @description - ImplementaciÃ³n del modelo de Approval,
     *
     *
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sitrack.model.purchaseTracking.Approval
     */
    Object.extend('com.innova.sitrack.model.purchaseTracking.Approval', {
      constructor: function constructor(data) {
        this.IT_DOCKEYS = data.IT_DOCKEYS || [];
      }
    })
  );
});