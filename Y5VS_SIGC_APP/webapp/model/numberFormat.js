"use strict";
/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["sap/ui/core/format/NumberFormat"],function(e){var t=null;var r=null;var a={getNumberFormat:function r(a,n){if(!t){t=e.getFloatInstance({showMeasure:false,useSymbol:true,minFractionDigits:1,decimals:2,groupingSeparator:a,decimalSeparator:n})}return t},getFormatOptions:function e(){if(!r){r={groupingSeparator:arguments.length<=0?undefined:arguments[0],decimalSeparator:arguments.length<=1?undefined:arguments[1]}}return r},getFloatFormat:function t(r){var n=r.decimals,o=n===void 0?2:n,i=r.maxIntegerDigits;var u=a.getFormatOptions(),g=u.groupingSeparator,c=u.decimalSeparator;return e.getFloatInstance({decimalSeparator:c,emptyString:null,groupingSeparator:g,maxFractionDigits:o,maxIntegerDigits:i,showMeasure:false,useSymbol:true})},quote:function e(t){return t.replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1")},getRegExtFloat:function e(){var t=a.quote(r.groupingSeparator);var n=a.quote(r.decimalSeparator);return"^-?(?:\\d+|\\d{1,3}(?:[\\s".concat(t,"]\\d{3})+)(?:[").concat(n,"]\\d+)?$")}};return a});