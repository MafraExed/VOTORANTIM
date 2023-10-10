"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * ListApprovals
 *
 * @namespace
 * @name com.innova.strack.model.purchaseTracking.ListApprovals
 * @public
 */
// Proporciona la implementaciÃ³n del modelo ListApprovals
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo ListApprovals.
     *
     * Modelo de un request para la consulta de aprobaciones de procesos seleccionados
     *
     *
     * @class
     * @name - ListApprovals
     * @description - ImplementaciÃ³n del modelo de ListApprovals,
     *
     *
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sitrack.model.purchaseTracking.ListApprovals
     */
    Object.extend('com.innova.sitrack.model.purchaseTracking.ListApprovals', {
      constructor: function constructor(data) {
        this.IV_TIPO = data.TIPO || '';
        this.IV_DOC = data.DOC || '';
        this.IV_POS = data.POS || '';
        this.IV_COD_LIB = data.COD_LIB || '';
      }
    })
  );
});