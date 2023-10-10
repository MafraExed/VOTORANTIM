"use strict";sap.ui.define(["./utils/index","com/innova/formatter/maxLength","sap/m/Column","sap/m/ColumnListItem","sap/m/Input","sap/m/Text"],function(e,t,n,r,l,a){var i={sHelpColumnFactory:function e(t){return function(e,r){return new n(e,{hAlign:"Begin",popinDisplay:"Inline",header:new a({text:r.getProperty("SCRTEXT_L")}),visible:r.getProperty("TECH")!=="X",minScreenWidth:t!==r.getProperty("FIELDNAME")?"Tablet":"",demandPopin:true})}},sHelpItemsFactory:function e(t,n){return new r("".concat(t,"-ColumnListItem"),{type:"Active",unread:false,selected:"{selected}"}).bindAggregation("cells","/catalog",function(e,t){var r=n.getProperty(t.getProperty("FIELDNAME"));return new a(e,{text:r})})},tableItemDynamicSH:function e(t){var n=this;return function(e,l){return new r("ColumnListItem-".concat(e),{type:"Active",selected:"{selected}",press:function e(t){n.searchHelp.onClose.call(n,[t.getSource().getBindingContext()])}}).bindAggregation("cells",t,function(e,t){return new a(e,{text:l.getProperty(t.getProperty("FIELDNAME"))})})}},filterFields:function t(n,r){var l=r.getObject();var a=e.getCatalogTitle(l);var o=l.INTTYPE;var c=this.createId("input".concat(l.FIELDNAME));return new sap.ui.layout.form.FormElement(n,{label:"".concat(a),fields:[o==="N"?i._filterFieldTypeN.call(this,c,l):i._filterFieldTypeV.call(this,c,l)]})},_filterFieldTypeN:function n(r,a){return new l(r,{fieldGroupIds:"customFilter",maxLength:t(a.INTLEN),name:"".concat(a.FIELDNAME),placeholder:e.getCatalogTitle(a),showValueHelp:false,type:"Text",change:function e(t){var n=t.getSource();var r=n.getValue();n.setSelectedKey(r)}})},_filterFieldTypeV:function n(r,a){var i=e.getCatalogTitle(a);return new l(r,{fieldGroupIds:"customFilter",maxLength:t(a.INTLEN),name:"".concat(a.FIELDNAME),placeholder:i,showSuggestion:false,showValueHelp:false,type:"Text",valueHelpRequest:[this.searchHelp.onValueHelpRequest,this],width:"100%",change:function e(t){if(a.LOWERCASE!=="X"){var n=t.getSource();var r=t.getParameter("value");r=r.toUpperCase();n.setValue(r)}}})}};return i});