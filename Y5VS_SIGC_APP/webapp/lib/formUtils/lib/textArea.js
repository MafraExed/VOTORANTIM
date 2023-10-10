"use strict";function _defineProperty(e,n,r){if(n in e){Object.defineProperty(e,n,{value:r,enumerable:true,configurable:true,writable:true})}else{e[n]=r}return e}
/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["com/innova/sigc/model/variant/ItemVariant"],function(e){return{getTextAreaData:function n(r){var t=r.isVariant,a=r.field,i=r.functionName,u=r.group;var o=a.getName();var f=a.getValue()||null;if(t){return _defineProperty({},o,new e({fieldname:o,function:i,group:u,low:f,tabname:a.data("tabname")}))}return _defineProperty({},o,f)}}});