"use strict";
/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["sap/ui/base/Object"],function(_){return _.extend("com.innova.sitrack.model.purchaseTracking.Process",{constructor:function _(I){this.IV_SDP_BLDAT=null;if(I.SDP_BLDAT){this.IV_SDP_BLDAT=[I.SDP_BLDAT]}this.IV_SDP_DELIVDATE=null;if(I.SDP_DELIVDATE){this.IV_SDP_DELIVDATE=[I.SDP_DELIVDATE]}this.IV_SDP_PAYDATE=null;if(I.SDP_PAYDATE){this.IV_SDP_PAYDATE=[I.SDP_PAYDATE]}this.IT_DOCKEYS=I.IT_DOCKEYS||[];this.IT_SEL_FEILDS=I.IT_SEL_FEILDS||[];this.IV_DOC_C=I.IV_DOC_C||null;this.IV_INDIC_FECHA=I.IV_INDIC_FECHA||null;this.IV_INDIC_INFMAT=I.IV_INDIC_INFMAT||null;this.IV_INDIC_STK=I.IV_INDIC_STK||null;this.IV_INDIC_ULTP=I.IV_INDIC_ULTP||null;this.IV_ONLYKEYS=I.IV_ONLYKEYS||null;this.IV_PED_COMPL=I.IV_PED_COMPL||null;this.IV_PED_DELETED=I.IV_PED_DELETED||null;this.IV_PED_EM=I.IV_PED_EM||null;this.IV_PED_LIV=I.IV_PED_LIV||null;this.IV_PED_LOCKED=I.IV_PED_LOCKED||null;this.IV_PED_STALIB=I.IV_PED_STALIB||null;this.IV_SDP_EKGRP=I.SDP_EKGRP||null;this.IV_SDP_PAYNUM=I.SDP_PAYNUM||null;this.IV_SDP_PAYSTATUS=I.SDP_PAYSTATUS||null;this.IV_SOLP_CLOSED=I.IV_SOLP_CLOSED||null;this.IV_SOLP_DELETED=I.IV_SOLP_DELETED||null;this.IV_SOLP_ESTP=I.IV_SOLP_ESTP||null;this.IV_SOLP_LOCKED=I.IV_SOLP_LOCKED||null;this.IV_SOLP_STALIB=I.IV_SOLP_STALIB||null}})});