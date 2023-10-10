"use strict";function _defineProperty(e,t,r){if(t in e){Object.defineProperty(e,t,{value:r,enumerable:true,configurable:true,writable:true})}else{e[t]=r}return e}
/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define([],function(){return{getDatePickerData:function e(t){var r=t.field;var a=r.getName();var n=r.getValue();if(n){return _defineProperty({},a,r.getDateValue().toISOString())}return _defineProperty({},a,null)},setDatePickerData:function e(t){var r=t.field,a=t.data;var n=r.getName();var i=a[n];if(i){r.setDateValue(new Date(i))}},cleanDatePicker:function e(t){var r=t.field;r.setDateValue()}}});