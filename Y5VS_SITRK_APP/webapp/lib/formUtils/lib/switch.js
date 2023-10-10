"use strict";function _defineProperty(e,t,a){if(t in e){Object.defineProperty(e,t,{value:a,enumerable:true,configurable:true,writable:true})}else{e[t]=a}return e}
/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["com/innova/sitrack/model/variant/ItemVariant"],function(e){return{getSwitchData:function t(a){var n=a.isVariant,r=a.field,i=a.functionName,u=a.group;var f=r.getName();var o=r.getState()?"X":"";if(n){return _defineProperty({},f,new e({fieldname:f,function:i,group:u,low:o,tabname:r.data("tabname")}))}return _defineProperty({},f,o)},setSwitchData:function e(t){var a=t.field,n=t.data;a.setState(n.LOW==="X")},cleanSwitch:function e(t){var a=t.field;a.setState()}}});