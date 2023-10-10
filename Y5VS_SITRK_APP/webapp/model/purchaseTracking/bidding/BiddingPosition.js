"use strict";
/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["sap/ui/base/Object","com/innova/sitrack/formatter/dataArray"],function(t,n){return t.extend("com.innova.sitrack.model.purchaseTracking.bidding.BiddingPosition",{constructor:function t(i){this.posProc=i.posProc||null;this.matnr=i.PR_MATNR||null;this.maktx=i.PR_TXZ01||null;this.menge=i.PR_MENGE2||null;this.meins=i.PR_MEINS||null;this.werks=i.PR_WERKS||null;this.matkl=i.PR_MATKL||null;this.matklDesc=i.matklDesc||null;this.adStreet=i.adStreet||null;this.eeind=i.PR_LFDAT||null;this.banfn=i.BANFN||null;this.bnfpo=i.BNFPO||null;this.ernam=i.PR_ERNAM||null;this.afnam=i.PR_AFNAM||null;this.grun=n(i.MAT_TEXT_LARGO);this.best=n(i.MAT_TEXT_COMPR);this.processId=0}})});