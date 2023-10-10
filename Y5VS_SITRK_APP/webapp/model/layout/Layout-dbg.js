"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * Layout
 *
 * @namespace
 * @name com.innova.sitrack.model.layout.Layout
 * @public
 */
// Proporciona la implementaciÃ³n del modelo Layout
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo Layout.
     *
     * Modelo de un request para la disposiciÃ³n
     *
     *
     * @class
     * @name - Layout
     * @description - ImplementaciÃ³n del modelo de Layout
     *
     *
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sitrack.model.layout.Layout
     */
    Object.extend('com.innova.sitrack.model.layout.Layout', {
      constructor: function constructor(data) {
        this.IV_FUNCTION = data.function;
        this.IV_ACCION = data.action;
        this.IV_LAYOUT = data.nameLayout;
        this.IV_POR_DEF = data.defaultLayout;
        this.IT_CATALOGO = data.catalog;
      }
    })
  );
});