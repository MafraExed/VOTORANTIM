"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * Posicion
 *
 * @namespace
 * @name com.innova.sigc.model.process.poCreate.Posicion
 * @public
 */
// Proporciona la implementaciÃ³n del modelo Position
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * @class
     * @name Posicion - PosiciÃ³n de la Orden de Pedido
     * @description - ImplementaciÃ³n del modelo PosiciÃ³n de la Orden de Pedido
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sigc.model.process.poCreate.Posicion
     */
    Object.extend('com.innova.sigc.model.process.poCreate.Posicion', {
      constructor: function constructor(data) {
        this.PO_ITEM = data.PO_ITEM;
        this.ITEM_CAT = data.ITEM_CAT;
        this.ACCTASSCAT = data.ACCTASSCAT;
        this.MATERIAL = data.MATERIAL;
        this.SHORT_TEXT = data.SHORT_TEXT;
        this.QUANTITY = data.QUANTITY;
        this.PO_UNIT = data.PO_UNIT;
        this.DELIVERY_DATE = data.DELIVERY_DATE;
        this.STAT_DATE = data.STAT_DATE;
        this.NET_PRICE = data.NET_PRICE;
        this.MATL_GROUP = data.MATL_GROUP;
        this.PLANT = data.PLANT;
        this.STGE_LOC = data.STGE_LOC;
        this.NOPIEZAFABRICANTE = data.NOPIEZAFABRICANTE;
        this.PREQ_NO = data.PREQ_NO;
        this.PREQ_ITEM = data.PREQ_ITEM;
        this.AGREEMENT = data.AGREEMENT;
        this.AGMT_ITEM = data.AGMT_ITEM;
        this.PREQ_NAME = data.PREQ_NAME;
        this.TRACKINGNO = data.TRACKINGNO;
        this.OVER_DLV_TOL = data.OVER_DLV_TOL;
        this.UNDER_DLV_TOL = data.UNDER_DLV_TOL;
        this.TAX_CODE = data.TAX_CODE;
      }
    })
  );
});