"use strict";
/*!
 *  SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["../utils/filterSHelpData","com/innova/sigc/utils/isEmpty","com/innova/sigc/utils/keyBy","com/innova/vendor/lodash.get","com/innova/vendor/lodash.set"],function(a,t,n,e,i){return function(o,r){var s=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{},E=s.filter,c=s.query;var l={};var u=r.ET_FCAT,d=r.ET_FCAT_SHELP;i(l,"catalog",t(u)?d:n(u,"FIELDNAME"));i(l,"data",a({catalog:u,data:e(r,"ET_SHELP_".concat(o.IV_FIELDNAME),e(r,"ET_SHELP",[])),filter:E,query:c}));i(l,"spras",e(r,"ET_SHELP_SPRAS",[]));return l}});