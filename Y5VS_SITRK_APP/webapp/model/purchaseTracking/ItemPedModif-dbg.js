"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * ItemPedModif
 *
 * @namespace
 * @name com.innova.sitrack.model.purchaseTracking.ItemPedModif
 * @public
 */
// Proporciona la implementaciÃ³n del modelo ItemPedModif
sap.ui.define(['sap/ui/base/Object', 'com/innova/util/isEmpty'], function (Object, isEmpty) {
  return (
    /**
     * Constructor para un nuevo ItemPedModif.
     *
     * Modelo de un item para actualizar un pedido
     *
     *
     * @class
     * @name ItemPedModif
     * @description - ImplementaciÃ³n del modelo de ItemPedModif
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sitrack.model.purchaseTracking.ItemPedModif
     */
    Object.extend('com.innova.sitrack.model.purchaseTracking.ItemPedModif', {
      constructor: function constructor(data) {
        var _data$POI_EINDT;

        this.EBELN = data.EBELN;
        this.EBELP = data.EBELP;
        this.EINDT_FLAG = data.POI_EINDT_FLAG;
        this.ELIKZ_FLAG = data.POI_ELIKZ_FLAG;
        this.LOEKZ_FLAG = data.POI_LOEKZ_FLAG;
        this.EINDT = (_data$POI_EINDT = data.POI_EINDT) === null || _data$POI_EINDT === void 0 ? void 0 : _data$POI_EINDT.split('T')[0];
        this.ELIKZ = data.POI_ELIKZ;
        this.LOEKZ = data.POI_LOEKZ;
      },
      isUpdate: function isUpdate() {
        return !isEmpty(this.EINDT_FLAG) || !isEmpty(this.ELIKZ_FLAG) || !isEmpty(this.LOEKZ_FLAG);
      }
    })
  );
});