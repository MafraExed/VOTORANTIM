"use strict";
/*!
 *  SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["../utils/buildSysParams","../utils/keyTextPool","com/innova/util/keyBy"],function(t,e,s){return function(r){var u=r.ES_SYSPARAMS,E=r.ET_FCAT_INPUTPARAMS,P=r.ET_TEXTPOOL,a=r.GV_NAME,i=r.EV_ZSIGC,n=r.EP_BUKRS,o=r.EP_EKORG,l=r.EP_EKGRP;var _=true;if(a===null||a===""){_=false}return{catalog:s(E,"FIELDNAME"),textPool:e(P),sysParams:t(u),showPayment:_,zsigc:i,bukrs:n,ekorg:o,ekgrp:l}}});