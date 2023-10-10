"use strict";function _defineProperty(e,t,r){if(t in e){Object.defineProperty(e,t,{value:r,enumerable:true,configurable:true,writable:true})}else{e[t]=r}return e}
/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define([],function(){return{getComboBoxData:function e(t){var r=t.field;return _defineProperty({},r.getName(),r.getSelectedKey())},isComboBoxValid:function e(t){var r=t.field;return!!r.getSelectedKey()}}});