"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * VendorByHistory
 *
 * @namespace
 * @name com.innova.sigc.model.process.VendorByHistory
 * @public
 */
// Proporciona la implementaciÃ³n del modelo VendorByHistory
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo VendorByHistory.
     *
     * Modelo de una peticiÃ³n para obtener los proveedores segun su historial.
     *
     *
     * @class
     * @name - process
     * @description - ImplementaciÃ³n del modelo de VendorByHistory
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     * @public
     * @alias com.innova.sigc.model.process.VendorByHistory
     */
    Object.extend('com.innova.sigc.model.process.VendorByHistory', {
      constructor: function constructor(data) {
        var _data$date, _data$date2;

        this.IV_EKORG = data.ekorg;
        this.IV_MATNR = data.matnr;
        this.IV_MATKL = data.matkl;
        this.IV_TXZ01 = data.txz01; // eslint-disable-next-line prefer-destructuring

        this.IV_FDESDE = data === null || data === void 0 ? void 0 : (_data$date = data.date) === null || _data$date === void 0 ? void 0 : _data$date.split('_')[0]; // eslint-disable-next-line prefer-destructuring

        this.IV_FHASTA = data === null || data === void 0 ? void 0 : (_data$date2 = data.date) === null || _data$date2 === void 0 ? void 0 : _data$date2.split('_')[1];
      }
    })
  );
});