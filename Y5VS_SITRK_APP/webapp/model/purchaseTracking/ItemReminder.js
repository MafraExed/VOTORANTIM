"use strict";
/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["sap/ui/base/Object"],function(i){return i.extend("com.innova.sitrack.model.purchaseTracking.ItemItemReminder",{constructor:function i(t){var E,s;this.EBELN=t.EBELN;this.EBELP=t.EBELP;this.MENGE=t.POI_MENGE;this.MEINS=t.POI_MEINS;this.CNTEM=t.POI_CNTEM;this.EINDT=(E=t.POI_EINDT)===null||E===void 0?void 0:E.split("T")[0];this.SLFDT=(s=t.POI_SLFDT)===null||s===void 0?void 0:s.split("T")[0];this.LIFNR=t.LIFNR;this.NAME1=t.NAME1;this.SPRAS=t.SPRAS;this.E_MAILS=t.E_MAILS;this.ELIKZ=t.POI_ELIKZ}})});