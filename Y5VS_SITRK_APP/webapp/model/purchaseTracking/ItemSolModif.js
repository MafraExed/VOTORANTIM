"use strict";
/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["sap/ui/base/Object","com/innova/util/isEmpty"],function(i,t){return i.extend("com.innova.sitrack.model.purchaseTracking.ItemSolModif",{constructor:function i(t){var s;this.BANFN=t.BANFN;this.BNFPO=t.BNFPO;this.LFDAT_FLAG=t.PR_LFDAT_FLAG;this.EBAKZ_FLAG=t.PR_EBAKZ_FLAG;this.LOEKZ_FLAG=t.PR_LOEKZ_FLAG;this.LFDAT=(s=t.PR_LFDAT)===null||s===void 0?void 0:s.split("T")[0];this.EBAKZ=t.PR_EBAKZ;this.LOEKZ=t.PR_LOEKZ},isUpdate:function i(){return!t(this.LFDAT_FLAG)||!t(this.EBAKZ_FLAG)||!t(this.LOEKZ_FLAG)}})});