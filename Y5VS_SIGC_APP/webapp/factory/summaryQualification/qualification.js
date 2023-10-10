"use strict";
/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["com/innova/sigc/model/offer/offerStatus/useOfferStatus","com/innova/sigc/utils/isEmpty","sap/m/Button","sap/m/FlexBox","sap/m/HBox","sap/m/Input","sap/m/Label","sap/m/ObjectIdentifier","sap/m/ObjectNumber","sap/m/Text","sap/m/VBox","sap/ui/core/CustomData","sap/ui/table/Column","sap/ui/unified/Currency"],function(e,t,n,i,a,r,s,o,l,c,u,m,f,p){var d={bindColumnsToTreeTable:function e(t,n){var i=n.getObject();var a=n.getProperty("template");var r="_buildTemplate".concat(a);var o=new c({wrapping:true,text:"{".concat(n.getProperty("name"),"}")});if(d["".concat(r)]){o=d["".concat(r)].call(this,{id:t,context:n.getObject()})}return new f(t,{label:new s({text:i.label,tooltip:i.label,wrapping:true}),template:o,autoResizable:true,width:"auto",minWidth:150,customData:[new m({key:"1",value:1})]})},_buildTemplateMatnr:function e(){return new o({text:'{= %{matnr} || "" }',title:"{maktx}"})},_buildTemplatemenge:function e(){return new l({number:"{menge}",numberUnit:"{meins}"})},_buildTemplateTipo:function e(){return new c({text:'{= %{tipo} === "C" ? %{i18n>0133} : %{i18n>0162} }'})},_buildTemplateQualifications:function e(t){var n=t.factoryId,i=t.context;return new a(n,{alignItems:sap.m.FlexAlignItems.Center,items:[new sap.ui.core.Icon({src:"sap-icon://message-success",color:"#107e3e",visible:i.status==="E"}),new l({number:{path:"".concat(i.name)},unit:"%"})]})},_buildTemplateCustom:function e(t){var n=this;var a=t.context;return new i({height:"100%",width:"100%",direction:sap.m.FlexDirection.Column,justifyContent:sap.m.FlexJustifyContent.Center,alignItems:sap.m.FlexAlignItems.Center}).bindAggregation("items",{path:"".concat(a.name),factory:function e(t,i){var a=i.getObject()||{},r=a.type,s=r===void 0?"":r,o=a.value;var l=s.charAt(0).toUpperCase()+s.slice(1);var u="_build".concat(l,"Cell");if(d["".concat(u)]){return d["".concat(u)].call(n,{factoryId:t,context:i})}return new c(t,{text:o})}})},_buildPriceCell:function e(t){var n=t.factoryId,i=t.context;var r=i.getObject(),s=r.price,o=r.menge,l=r.status;var m=d._getStatusIcon.call(this,l);return new a(n,{alignItems:sap.m.FlexAlignItems.Center,items:[m,s?new u({items:[new p({value:s.bbwert*o,currency:s.waers,maxPrecision:2,useSymbol:false}),new p({value:s.bbwert,currency:s.waers,maxPrecision:2,useSymbol:false})]}):new c]})},_buildCantOferCell:function e(n){var i=n.factoryId,r=n.context;var s=r.getObject(),o=s.cantOfer,c=o===void 0?"":o,u=s.meins,m=s.status;var f=d._getStatusIcon.call(this,m);return new a(i,{alignItems:sap.m.FlexAlignItems.Center,items:[f,new l({number:new Intl.NumberFormat(this.getModel("main").getProperty("/currentLanguage")).format(c),unit:u,visible:!t(c)})]})},_buildCantAsigCell:function n(i){var s=i.factoryId,o=i.context;var l=o.getObject(),u=l.isWinningProcess,m=l.value,f=l.cantOfer,p=l.status;var g=d._getStatusIcon.call(this,p);return new a(s,{alignItems:sap.m.FlexAlignItems.Center,items:[g,u?new c({text:m}):new r({placeholder:"{i18n>0145}",value:m,type:sap.m.InputType.Number,editable:!u&&!e.isPositionRejected(p.positionStatus)&&!t(f),change:this.onCantAsigChange.bind(this,{cantOfer:f})})]})},_buildQualificationsCell:function e(t){var n=t.factoryId,i=t.context;var r=i.getObject(),s=r.value,o=r.status,c=r.highest;var u=d._getStatusIcon.call(this,o);return new a(n,{alignItems:sap.m.FlexAlignItems.Center,height:"100%",justifyContent:sap.m.FlexJustifyContent.Center,width:"100%",items:[u,new l({number:new Intl.NumberFormat(this.getModel("main").getProperty("/currentLanguage")).format(s),unit:"%",state:c===s&&s!==0?sap.ui.core.ValueState.Success:sap.ui.core.ValueState.None})]})},_buildTotalCell:function e(t){var n=t.factoryId,i=t.context;var r=i.getObject(),s=r.value,o=r.status,l=r.waers;var c=d._getStatusIcon.call(this,o);return new a(n,{alignItems:sap.m.FlexAlignItems.Center,height:"100%",justifyContent:sap.m.FlexJustifyContent.Center,width:"100%",items:[c,new p({value:s,currency:l,maxPrecision:2,useSymbol:false})]})},_buildPurchaseOrderCell:function e(i){var r=i.factoryId,s=i.context;var o=s.getObject(),l=o.value,u=o.offerId,m=o.vendorName;return new a(r,{alignItems:sap.m.FlexAlignItems.Center,height:"100%",justifyContent:sap.m.FlexJustifyContent.SpaceAround,width:"100%",items:[new c({text:l}),new n({tooltip:"{i18n>0422}",icon:"sap-icon://sys-cancel-2",type:"Reject",visible:!t(l),press:this.onDeletePurchaseOrder.bind(this,{value:l,offerId:u,vendorName:m})})]})},_buildOperationsCell:function e(t){var i=t.factoryId,r=t.context;var s=r.getObject();var o=s.offerId,l=s.vendorName,c=s.isWinningProcess,u=s.isPartialProcess;return new a(i,{alignItems:sap.m.FlexAlignItems.Center,items:[new n({tooltip:"{i18n>0277}",icon:"sap-icon://competitor",type:"Accept",visible:!s.isOfferRejected&&(!c||u),press:this.onWinnerOfferButtonPress.bind(this,{offerId:o,vendorName:l,isPartialProcess:u,hasPositionsRejected:s.hasPositionsRejected})}),new n({tooltip:"{i18n>0309}",icon:"sap-icon://decline",type:"Reject",visible:!s.isOfferRejected&&(s.isTotalWinningOffer||s.isPartialOffer||s.isWinningOfferForPositions)&&(!s.hasPurchaseOrder||s.isPartialOffer),press:this.onUndoWinningOfferButtonPress.bind(this,{offerId:o,vendorName:l})}),new n({tooltip:"{i18n>0288}",icon:"sap-icon://create",visible:!s.isOfferRejected&&(s.isTotalWinningOffer||s.isPartialOffer||s.isWinningOfferForPositions)&&(!s.hasPurchaseOrder||s.isPartialOffer),press:this.onCreateOrderButtonPress.bind(this,{offerId:o})})]})},_getStatusIcon:function t(){var n=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var i=(n===null||n===void 0?void 0:n.offerStatusType)||(n===null||n===void 0?void 0:n.positionStatusType);var a=i===null||i===void 0?void 0:i.charAt(0).toUpperCase();var r=e.getStatusMetadata((n===null||n===void 0?void 0:n.offerStatus)||(n===null||n===void 0?void 0:n.positionStatus),{type:a});var s;if(r){var o=this._i18n.getText("".concat(r.text));s=new sap.ui.core.Icon({src:r.icon,color:r.color,tooltip:o,visible:!!n})}return s}};return d});