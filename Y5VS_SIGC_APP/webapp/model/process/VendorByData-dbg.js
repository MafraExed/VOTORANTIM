"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * VendorByData
 *
 * @namespace
 * @name com.innova.sigc.model.process.VendorByData
 * @public
 */
// Proporciona la implementaciÃ³n del modelo VendorByData
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo VendorByData.
     *
     * Modelo de una peticiÃ³n para obtener los proveedores segun su historial.
     *
     *
     * @class
     * @name - process
     * @description - ImplementaciÃ³n del modelo de VendorByData
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     * @public
     * @alias com.innova.sigc.model.process.VendorByData
     */
    Object.extend('com.innova.sigc.model.process.VendorByData', {
      constructor: function constructor(data) {
        this.country = data.countries;
        this.city1 = data.city1;
        this.categoryId = data.catProc;
        this.lifnr = data.vendors;
        this.stcd1 = data.stcd1;
        this.name1 = data.names;
        this.sort1 = data.sort1;
        this.stcdt = data.typeId;
      }
    })
  );
});