"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * Imputacion
 *
 * @namespace
 * @name com.innova.sigc.model.process.poCreate.Imputacion
 * @public
 */
// Proporciona la implementaciÃ³n del modelo Imputacion
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * @class
     * @name Imputacion - Imputacion de la Orden de Pedido
     * @description - ImplementaciÃ³n del modelo Imputacion de la Orden de Pedido
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     * @public
     * @alias com.innova.sigc.model.process.poCreate.Imputacion
     */
    Object.extend('com.innova.sigc.model.process.poCreate.Imputacion', {
      constructor: function constructor(data) {
        this.PO_ITEM = data.PO_ITEM;
        this.LINE_NO = data.LINE_NO;
        this.SERIAL_NO = data.SERIAL_NO;
        this.QUANTITY = data.QUANTITY;
        this.DISTR_PERC = data.DISTR_PERC;
        this.G_L_ACCT = data.G_L_ACCT;
        this.COST_CTR = data.COST_CTR;
        this.ASSET_NO = data.ASSET_NO;
        this.SUB_NUMBER = data.SUB_NUMBER;
        this.ORDER_NO = data.ORDER_NO;
        this.PROJ_EXT = data.PROJ_EXT;
        this.PTODESCARGA = data.PTODESCARGA;
        this.GR_RCPT = data.GR_RCPT;
        this.UNLOAD_PT = data.UNLOAD_PT;
        this.WBS_ELEMENT = data.WBS_ELEMENT;
      }
    })
  );
});