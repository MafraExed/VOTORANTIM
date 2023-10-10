"use strict";function _defineProperty(e,t,r){if(t in e){Object.defineProperty(e,t,{value:r,enumerable:true,configurable:true,writable:true})}else{e[t]=r}return e}
/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define([],function(){return{getComboBoxData:function e(t){var r=t.field;return _defineProperty({},r.getName(),r.getSelectedKey())},setComboBoxData:function e(t){var r=t.field,n=t.data;r.setSelectedKey(n[r.getName()])},isComboBoxValid:function e(t){var r=t.field;return!!r.getSelectedKey()},cleanComboBox:function e(t){var r=t.field;r.resetProperty("selectedKey")}}});