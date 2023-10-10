"use strict";
/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["sap/ui/base/Object"],function(i){return i.extend("com.innova.sigc.model.process.poCreate.Servicio",{constructor:function i(t){this.PO_ITEM=t.PO_ITEM;this.LINE_NO=t.LINE_NO;this.SERVICE=t.SERVICE;this.SHORT_TEXT=t.SHORT_TEXT;this.QUANTITY=t.QUANTITY;this.BASE_UOM=t.BASE_UOM;this.GR_PRICE=t.GR_PRICE;this.MATL_GROUP=t.MATL_GROUP}})});