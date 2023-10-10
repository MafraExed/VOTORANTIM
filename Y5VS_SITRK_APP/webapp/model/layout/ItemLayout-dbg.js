"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * ItemLayout
 *
 * @namespace
 * @name com.innova.sitrack.model.layout.ItemLayout
 * @public
 */
// Proporciona la implementaciÃ³n del modelo ItemLayout
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo ItemLayout.
     *
     * Modelo de un request para la disposiciÃ³n
     *
     *
     * @class
     * @name - ItemLayout
     * @description - ImplementaciÃ³n del modelo de ItemLayout
     *
     *
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sitrack.model.layout.ItemLayout
     */
    Object.extend('com.innova.sitrack.model.layout.ItemLayout', {
      constructor: function constructor(data) {
        this.FUNCTION = data.function;
        this.LAYOUT = data.nameLayout;
        this.FIELDNAME = data.FIELDNAME;
        this.ZORDER = data.COL_POS;
        this.OUTPUTLEN = parseInt(data.OUTPUTLEN, 10);
        this.HREF_HNDL = data.columnHeight;
      }
    })
  );
});