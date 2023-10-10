"use strict";
/*!
 *  SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["../utils/buildSysParams","../utils/keyTextPool","com/innova/sigc/utils/keyBy"],function(s,t,P){return function(e){var i=e.ES_SYSPARAMS,r=e.ET_FCAT_INPUTPARAMS,u=e.ET_TEXTPOOL,E=e.EP_BUKRS,o=e.EP_EKORG,a=e.EP_EKGRP;return{catalog:P(r,"FIELDNAME"),textPool:t(u),sysParams:s(i),bukrs:E,ekorg:o,ekgrp:a}}});