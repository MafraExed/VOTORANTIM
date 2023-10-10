sap.ui.define(["Y5GL_FERI_APRO2/Y5GL_FERI_APRO2/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/core/routing/History","sap/ui/model/Filter","sap/ui/model/Sorter","sap/ui/model/FilterOperator","sap/m/GroupHeaderListItem","sap/ui/Device","Y5GL_FERI_APRO2/Y5GL_FERI_APRO2/model/formatter"],function(e,t,r,o,a,i,n,s,l){"use strict";return e.extend("Y5GL_FERI_APRO2.Y5GL_FERI_APRO2.controller.Detail",{formatter:l,onInit:function(){this.getRouter().getRoute("object").attachPatternMatched(this._onMasterMatched,this)},onSelectionChange:function(e){var t=e.getSource(),r=e.getParameter("selected");if(!(t.getMode()==="MultiSelect"&&!r)){this._showDetail(e.getParameter("listItem")||e.getSource())}},_createViewModel:function(){return new t({isFilterBarVisible:false,filterBarLabel:"",delay:0,title:this.getResourceBundle().getText("masterTitleCount",[0]),noDataText:this.getResourceBundle().getText("masterListNoDataText"),sortBy:"Pernr",groupBy:"None"})},_onMasterMatched:function(e){var t=e.getParameter("arguments").Pernr;var r="X";if(t!==""){var o=new sap.ui.model.Filter("Pernr",sap.ui.model.FilterOperator.EQ,t);var a=new sap.ui.model.Filter("Tipo",sap.ui.model.FilterOperator.EQ,r);var i=this.getView().byId("list");i.getBinding("items").filter([o,a])}},FormatStatus:function(e){if(e==="Em Programação"){return"Warning"}if(e==="Homologado"){return"Success"}if(e==="Em Aberto"){return"Error"}if(e==="Em aprovação"){return"Warning"}else{return"Success"}},onVoltar:function(e){this.getRouter().navTo("master")},onVoltarM:function(e){var t=!s.system.phone;var r="master";this.getModel("appView").setProperty("/layout","TwoColumnsMidExpanded");this.getRouter().navTo(r,{Texto:r},t)},_showDetail:function(e){var t=!s.system.phone;var r="DetalheFerias";var o="DetalheFeriasPeru";var a=e.getBindingContext().getProperty("Index");var i=e.getBindingContext().getProperty("Pernr");var n=e.getBindingContext().getProperty("Endda");var l=e.getBindingContext().getProperty("Begda");var d=e.getBindingContext().getProperty("Molga");var u=e.getBindingContext().getProperty("Limite");if(u==""){u="Saldo(0)"}if(d==="37"){if(r!==""&&a!==""&&i!==""&&n!==""&&l!==""){this.getRouter().navTo(r,{Index:a,Pernr:i,Endda:n,Begda:l,Limite:u},t);this.getModel("appView").setProperty("/layout","TwoColumnsMidExpanded")}else{sap.m.MessageBox.error("Não foi possivel determinar rota.");return}}if(d==="PE"){if(r!==""&&a!==""&&i!==""&&n!==""&&l!==""){this.getRouter().navTo(o,{Index:a,Pernr:i,Endda:n,Begda:l},t);this.getModel("appView").setProperty("/layout","TwoColumnsMidExpanded")}else{sap.m.MessageBox.error("Não foi possivel determinar rota.");return}}},onAdd:function(){this.getModel("appView").setProperty("/layout","TwoColumnsMidExpanded");this.getRouter().navTo("Add")},formatterIcon:function(e){var t=jQuery.sap.getModulePath("Y5GL_FERI_APRO2.Y5GL_FERI_APRO2");var r=t+"/Icones/";var o;o=r+"FERIAS.png";return o}})});