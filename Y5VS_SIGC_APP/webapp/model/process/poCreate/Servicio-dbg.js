"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * Servicio
 *
 * @namespace
 * @name com.innova.sigc.model.process.poCreate.Servicio
 * @public
 */
// Proporciona la implementaciÃ³n del modelo Servicio
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * @class
     * @name Servicio - Servicio de la Orden de Pedido
     * @description - ImplementaciÃ³n del modelo Servicio de la Orden de Pedido
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     * @public
     * @alias com.innova.sigc.model.process.poCreate.Servicio
     */
    Object.extend('com.innova.sigc.model.process.poCreate.Servicio', {
      constructor: function constructor(data) {
        this.PO_ITEM = data.PO_ITEM;
        this.LINE_NO = data.LINE_NO;
        this.SERVICE = data.SERVICE;
        this.SHORT_TEXT = data.SHORT_TEXT;
        this.QUANTITY = data.QUANTITY;
        this.BASE_UOM = data.BASE_UOM;
        this.GR_PRICE = data.GR_PRICE;
        this.MATL_GROUP = data.MATL_GROUP;
      }
    })
  );
});