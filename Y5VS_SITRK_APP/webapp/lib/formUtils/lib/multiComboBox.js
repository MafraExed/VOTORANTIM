"use strict";function _defineProperty(e,t,r){if(t in e){Object.defineProperty(e,t,{value:r,enumerable:true,configurable:true,writable:true})}else{e[t]=r}return e}
/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define([],function(){return{getMultiComboBoxData:function e(t){var r=t.field;var n=r.getSelectedKeys();return n.length&&_defineProperty({},r.getName(),r.getSelectedKeys())},setMultiComboBoxData:function e(t){var r=t.field,n=t.data;r.setSelectedKeys(n[r.getName()].map(function(e){var t=e.key;return t}))},isMultiComboBoxValid:function e(t){var r=t.field;return r.getSelectedItems().length>0},cleanMultiComboBox:function e(t){var r=t.field;r.resetProperty("selectedKeys")}}});