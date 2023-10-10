"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * Vendor
 *
 * @namespace
 * @name com.innova.sigc.model.process.Vendor
 * @public
 */
// Proporciona la implementaciÃ³n del modelo Vendor
sap.ui.define(['com/innova/vendor/lodash.get', 'sap/ui/base/Object'], function (get, Object) {
  return (
    /**
     * Constructor para un nuevo Vendor.
     *
     * Modelo de un request crear proveedor
     *
     *
     * @class
     * @name - Vendor
     * @description - ImplementaciÃ³n del modelo de Vendor
     *
     *
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     * @public
     * @alias com.innova.sigc.model.process.Vendor
     */
    Object.extend('com.innova.sigc.model.process.Vendor', {
      constructor: function constructor(data) {
        this.lifnr = get(data, 'lifnr', null);
        this.name1 = get(data, 'name1', null);
        this.name2 = get(data, 'name2', null);
        this.name3 = get(data, 'name3', null);
        this.name4 = get(data, 'name4', null);
        this.city1 = get(data, 'city1', null);
        this.city2 = get(data, 'city2', null);
        this.street = get(data, 'street', null);
        this.postCode1 = get(data, 'postCode1', null);
        this.houseNum1 = get(data, 'houseNum1', null);
        this.houseNum2 = get(data, 'houseNum2', null);
        this.country = get(data, 'country', null);
        this.region = get(data, 'region', null);
        this.sort1 = get(data, 'sort1', null);
        this.aCcc = get(data, 'aCcc', null);
        this.aRut = get(data, 'aRut', null);
        this.aCbanc = get(data, 'aCbanc', null);
        this.stcd1 = get(data, 'stcd1', null);
        this.stcd2 = get(data, 'stcd2', null);
        this.spras = get(data, 'spras', null);
        this.stcdt = get(data, 'stcdt', null);
        this.emails = get(data, 'emails', null);
        this.phones = get(data, 'phones', null);
        this.category = get(data, 'category', null);
      }
    })
  );
});