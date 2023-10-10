"use strict";
/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["sap/ui/base/Object"],function(t){return t.extend("com.innova.sitrack.model.purchaseTracking.ItemEmailProv",{constructor:function t(i){this.LIFNR=i.POH_LIFNR;this.NAME1=i.NAME1;this.SPRAS=i.SPRAS;this.E_MAILS=i.E_MAILS}})});