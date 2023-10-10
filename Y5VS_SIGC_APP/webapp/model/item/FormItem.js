"use strict";
/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["sap/ui/base/Object"],function(i){return i.extend("com.innova.sigc.model.item.FormItem",{constructor:function i(t){var n=t.tabname,s=t.fieldname,o=t.sign,e=o===void 0?"I":o,h=t.option,c=h===void 0?"EQ":h,u=t.low,f=t.high;if(n){this.TABNAME=n}if(s){this.FIELDNAME=s}this.SIGN=e;this.OPTION=c;this.LOW=u;this.HIGH=f},setSign:function i(t){this.SIGN=t},setOption:function i(t){this.OPTION=t},setLow:function i(t){this.LOW=t},setHigh:function i(t){this.HIGH=t}})});