"use strict";
/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["sap/ui/base/Object"],function(T){return T.extend("com.innova.sigc.model.process.poCreate.Posicion",{constructor:function T(E){this.PO_ITEM=E.PO_ITEM;this.ITEM_CAT=E.ITEM_CAT;this.ACCTASSCAT=E.ACCTASSCAT;this.MATERIAL=E.MATERIAL;this.SHORT_TEXT=E.SHORT_TEXT;this.QUANTITY=E.QUANTITY;this.PO_UNIT=E.PO_UNIT;this.DELIVERY_DATE=E.DELIVERY_DATE;this.STAT_DATE=E.STAT_DATE;this.NET_PRICE=E.NET_PRICE;this.MATL_GROUP=E.MATL_GROUP;this.PLANT=E.PLANT;this.STGE_LOC=E.STGE_LOC;this.NOPIEZAFABRICANTE=E.NOPIEZAFABRICANTE;this.PREQ_NO=E.PREQ_NO;this.PREQ_ITEM=E.PREQ_ITEM;this.AGREEMENT=E.AGREEMENT;this.AGMT_ITEM=E.AGMT_ITEM;this.PREQ_NAME=E.PREQ_NAME;this.TRACKINGNO=E.TRACKINGNO;this.OVER_DLV_TOL=E.OVER_DLV_TOL;this.UNDER_DLV_TOL=E.UNDER_DLV_TOL;this.TAX_CODE=E.TAX_CODE}})});