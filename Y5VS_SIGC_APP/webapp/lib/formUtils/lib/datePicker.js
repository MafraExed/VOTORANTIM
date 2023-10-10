"use strict";function _defineProperty(e,t,r){if(t in e){Object.defineProperty(e,t,{value:r,enumerable:true,configurable:true,writable:true})}else{e[t]=r}return e}
/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["com/innova/sigc/utils/parseUniversalDate"],function(e){return{getDatePickerData:function e(t){var r=t.field;var a=r.getName();var i=r.getValue();if(i){return _defineProperty({},a,r.getDateValue().toISOString())}return _defineProperty({},a,null)},setDatePickerData:function t(r){var a=r.field,i=r.data;var n=a.getName();var u=i[n];if(u){a.setDateValue(e(u))}},cleanDatePicker:function e(t){var r=t.field;r.setDateValue()}}});