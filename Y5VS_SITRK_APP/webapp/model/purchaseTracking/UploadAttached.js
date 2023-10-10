"use strict";
/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["sap/ui/base/Object"],function(t){return t.extend("com.innova.sitrack.model.purchaseTracking.UploadAttached",{constructor:function t(i,s){if(i.target==="1"){this.IV_DOCUMENTO=s.BANFN;this.IV_MATERIAL="";this.IV_TIPO=i.target}else if(i.target==="4"){this.IV_DOCUMENTO="";this.IV_MATERIAL=s.PR_MATNR;this.IV_TIPO=i.target}this.IV_URL=i.url||"";this.IV_URLDES=i.desc||"";this.IV_NOCOMMIT="X";this.OT_RETURN={}}})});