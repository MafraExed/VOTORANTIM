"use strict";
/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["sap/ui/base/Object","com/innova/util/isEmpty"],function(i,t){return i.extend("com.innova.sitrack.model.purchaseTracking.ItemPedModif",{constructor:function i(t){var E;this.EBELN=t.EBELN;this.EBELP=t.EBELP;this.EINDT_FLAG=t.POI_EINDT_FLAG;this.ELIKZ_FLAG=t.POI_ELIKZ_FLAG;this.LOEKZ_FLAG=t.POI_LOEKZ_FLAG;this.EINDT=(E=t.POI_EINDT)===null||E===void 0?void 0:E.split("T")[0];this.ELIKZ=t.POI_ELIKZ;this.LOEKZ=t.POI_LOEKZ},isUpdate:function i(){return!t(this.EINDT_FLAG)||!t(this.ELIKZ_FLAG)||!t(this.LOEKZ_FLAG)}})});