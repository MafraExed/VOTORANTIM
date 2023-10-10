"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * ItemAssignUser
 *
 * @namespace
 * @name com.innova.sitrack.model.purchaseTracking.ItemAssignUser
 * @public
 */
// Proporciona la implementaciÃ³n del modelo ItemAssignUser
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo ItemAssignUser.
     *
     * Modelo de un request para la asignar comprador a la solicitud de pedido
     *
     *
     * @class
     * @name - ItemAssignUser
     * @description - ImplementaciÃ³n del modelo de ItemAssignUser
     *
     *
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sitrack.model.purchaseTracking.ItemAssignUser
     */
    Object.extend('com.innova.sitrack.model.purchaseTracking.ItemAssignUser', {
      constructor: function constructor(data) {
        this.BANFN = data.BANFN;
        this.BNFPO = data.BNFPO;
        this.RETURNED = data.RETURNED;
        this.RETURN_REASON = data.RETURN_REASON;
        this.AME_REASON = data.AME_REASON;
      }
    })
  );
});