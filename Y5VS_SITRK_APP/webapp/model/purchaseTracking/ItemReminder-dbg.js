"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * ItemItemReminder
 *
 * @namespace
 * @name com.innova.sitrack.model.purchaseTracking.ItemItemReminder
 * @public
 */
// Proporciona la implementaciÃ³n del modelo ItemItemReminder
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo ItemItemReminder.
     *
     * Modelo de un request para recordatorio
     *
     *
     * @class
     * @name - ItemItemReminder
     * @description - ImplementaciÃ³n del modelo de ItemItemReminder
     *
     *
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sitrack.model.purchaseTracking.ItemItemReminder
     */
    Object.extend('com.innova.sitrack.model.purchaseTracking.ItemItemReminder', {
      constructor: function constructor(data) {
        var _data$POI_EINDT, _data$POI_SLFDT;

        this.EBELN = data.EBELN;
        this.EBELP = data.EBELP;
        this.MENGE = data.POI_MENGE;
        this.MEINS = data.POI_MEINS;
        this.CNTEM = data.POI_CNTEM;
        this.EINDT = (_data$POI_EINDT = data.POI_EINDT) === null || _data$POI_EINDT === void 0 ? void 0 : _data$POI_EINDT.split('T')[0];
        this.SLFDT = (_data$POI_SLFDT = data.POI_SLFDT) === null || _data$POI_SLFDT === void 0 ? void 0 : _data$POI_SLFDT.split('T')[0];
        this.LIFNR = data.LIFNR;
        this.NAME1 = data.NAME1;
        this.SPRAS = data.SPRAS;
        this.E_MAILS = data.E_MAILS;
        this.ELIKZ = data.POI_ELIKZ;
      }
    })
  );
});