"use strict";
/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["sap/m/Label","sap/m/Text","sap/ui/table/Column","sap/ui/unified/Currency"],function(e,t,r,a){var n={createColumns:function a(c,i){var o=i.getProperty("name");var u=i.getProperty("template");var l=new t({text:"{".concat(o,"}")});var p="buildTemplateType".concat(u);if(n["".concat(p)]){l=n["".concat(p)].call(this,{context:i.getObject()})}return new r(c,{label:new e({text:i.getProperty("label"),wrapping:true}),autoResizable:true,filterOperator:"Contains",filterProperty:"".concat(o),name:"".concat(o),visible:"visible"in i.getObject()?i.getObject().visible:true,sortProperty:"".concat(o),template:l,width:"auto",minWidth:150})},buildTemplateTypePosProc:function e(){return new t({text:"{posProc}",wrapping:true})},buildTemplateTypeMatnr:function e(){return new t({text:"{matnr} {maktx}",wrapping:true})},buildTemplateTypeRound:function e(t){var r=t.context;var n=r.vendorId;return new a({value:"{= parseFloat(%{".concat(n,"/bbwert}) }"),currency:"{".concat(n,"/waers}"),maxPrecision:2,useSymbol:false})}};return n});