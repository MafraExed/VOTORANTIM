"use strict";
/*!
 *  SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["../utils/filterSHelpData","com/innova/util/isEmpty","com/innova/util/keyBy","com/innova/vendor/lodash.get","com/innova/vendor/lodash.set"],function(a,t,n,e,i){return function(o,r){var E=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{},l=E.filter,u=E.query;var c={};var s=r.ET_FCAT,d=r.ET_FCAT_SHELP;i(c,"catalog",t(s)?d:n(s,"FIELDNAME"));i(c,"data",a({catalog:s,data:e(r,"ET_SHELP_".concat(o.IV_FIELDNAME),e(r,"ET_SHELP",[])),filter:l,query:u}));i(c,"spras",e(r,"ET_SHELP_SPRAS",[]));return c}});