"use strict";
/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["sap/ui/base/Object"],function(R){return R.extend("com.innova.sigc.model.process.poCreate.PoCreate",{constructor:function R(t){this.DOC_TYPE=t.DOC_TYPE;this.DOC_DATE=t.DOC_DATE;this.COMP_CODE=t.COMP_CODE;this.VENDOR=t.VENDOR;this.PURCH_ORG=t.PURCH_ORG;this.PUR_GROUP=t.PUR_GROUP;this.CURRENCY=t.CURRENCY;this.VPER_START=t.VPER_START;this.VPER_END=t.VPER_END;this.INCOTERMS1=t.INCOTERMS1;this.INCOTERMS2=t.INCOTERMS2;this.WARRANTY=t.WARRANTY;this.COLLECT_NO=t.COLLECT_NO;this.REF_1=t.REF_1;this.OUR_REF=t.OUR_REF}})});