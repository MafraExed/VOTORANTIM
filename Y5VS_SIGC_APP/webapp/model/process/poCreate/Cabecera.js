"use strict";
/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["sap/ui/base/Object"],function(R){return R.extend("com.innova.sigc.model.process.poCreate.PoCreate",{constructor:function R(E){this.DOC_TYPE=E.DOC_TYPE;this.DOC_DATE=E.DOC_DATE;this.COMP_CODE=E.COMP_CODE;this.VENDOR=E.VENDOR;this.PURCH_ORG=E.PURCH_ORG;this.PUR_GROUP=E.PUR_GROUP;this.CURRENCY=E.CURRENCY;this.VPER_START=E.VPER_START;this.VPER_END=E.VPER_END;this.INCOTERMS1=E.INCOTERMS1;this.INCOTERMS2=E.INCOTERMS2;this.PMNTTRMS=E.PMNTTRMS;this.WARRANTY=E.WARRANTY;this.COLLECT_NO=E.COLLECT_NO;this.REF_1=E.REF_1;this.OUR_REF=E.OUR_REF;this.SALES_PERS=E.SALES_PERS;this.TELEPHONE=E.TELEPHONE}})});