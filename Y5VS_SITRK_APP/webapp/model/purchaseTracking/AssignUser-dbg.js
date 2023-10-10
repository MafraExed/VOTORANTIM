"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * AssignUser
 *
 * @namespace
 * @name com.innova.sitrack.model.purchaseTracking.AssignUser
 * @public
 */
// Proporciona la implementaciÃ³n del modelo AssignUser
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo AssignUser.
     *
     * Modelo de un request para la asignar comprador a la solicitud de pedido
     *
     *
     * @class
     * @name - AssignUser
     * @description - ImplementaciÃ³n del modelo de AssignUser
     *
     *
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sitrack.model.purchaseTracking.AssignUser
     */
    Object.extend('com.innova.sitrack.model.purchaseTracking.AssignUser', {
      constructor: function constructor(data) {
        this.IT_SOLP = data.IT_SOLP || [];
      }
    })
  );
});