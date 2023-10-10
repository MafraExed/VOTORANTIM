sap.ui.define(["Y5GL_EC_CSC/Y5GL_EC_CSC/controller/BaseController","sap/ui/Device"],function(t,e){"use strict";return t.extend("Y5GL_EC_CSC.Y5GL_EC_CSC.controller.BENEFICIOS",{onInit:function(){this.getRouter().getRoute("BENEFICIOS").attachPatternMatched(this._onRefreshList,this)},_onRefreshList:function(){var t=this.getView().byId("list");var e=t.getBinding("items");e.refresh(true)},formatTextEStatus:function(t){if(t==="A"){return"Em Aprovação"}return" "},formatHighLight:function(t){if(t==="A"){return"Success"}return"Information"},formatStateEStatus:function(t){if(t==="A"){return"Success"}return"None"},onSelectionChange:function(t){var r=!e.system.phone;var n="BENEFICIOS_DETAIL";var i=t.getParameters("listItem").listItem;if(i!==undefined){var o=t.getParameters("listItem").listItem.getBindingContext().getProperty("Zdesc");var a=t.getParameters("listItem").listItem.getBindingContext().getProperty("Zparam");this.getModel("appView").setProperty("/layout","TwoColumnsMidExpanded");this.getRouter().navTo(n,{Zparam:a,Zdesc:o},r)}},formatIconList:function(t){if(t==="ALIMENTACAO"){return"sap-icon://retail-store"}if(t==="AUXILIO_CRECHE"){return"sap-icon://family-care"}if(t==="COOPERATIVA"){return"sap-icon://collaborate"}if(t==="EMP_CONSIGINADO"){return"sap-icon://capital-projects"}if(t==="FARMACIA"){return"sap-icon://pharmacy"}if(t==="FUNSEJEM"){return"sap-icon://building"}if(t==="GREMIO_CLUBE"){return"sap-icon://chalkboard"}if(t==="PLANO_MEDICO"){return"sap-icon://stethoscope"}if(t==="PLANO_ODONTOLOGICO"){return"sap-icon://doctor"}if(t==="PLANO_DENT_2"){return"sap-icon://doctor"}if(t==="REEMBOLSO_SUBSIDIO"){return"sap-icon://collections-insight"}if(t==="SEGURO_DE_VIDA"){return"sap-icon://insurance-life"}if(t==="VALE_TRANSPORTE"){return"sap-icon://bus-public-transport"}if(t==="REFEITORIO"){return"sap-icon://meal"}if(t==="PREVIDENCIA_PRIVADA"){return"sap-icon://lead-outdated"}if(t==="PREV_PRIV_BAS"){return"sap-icon://lead-outdated"}if(t==="PREV_PRIV_ESP"){return"sap-icon://lead-outdated"}if(t==="PREV_PRIV_NOR"){return"sap-icon://lead-outdated"}if(t==="PREV_PRIV_SUP"){return"sap-icon://lead-outdated"}if(t==="CESTA_BASICA"){return"sap-icon://nutrition-activity"}if(t==="OTICA"){return"sap-icon://show"}return" "},onBackMaster:function(){this.getRouter().navTo("master")}})});