sap.ui.define([
	"Y5GL_APROVB/Y5GL_APROVB/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("Y5GL_APROVB.Y5GL_APROVB.controller.FORMACAO", {
		onInit: function () {},
		
		onAdd: function(){
			this.getRouter().navTo("FORMACAO_DETAIL");
		},
		
		onBackMaster: function () {
			this.getRouter().navTo("master");
		},
		
		onSelectionChange: function(oEvent){
			var Pernr = oEvent.getParameters("listItem").listItem.getBindingContext().getProperty("Pernr"); 
			var Objps = oEvent.getParameters("listItem").listItem.getBindingContext().getProperty("Objps"); 
			
			this.getRouter().navTo("FORMACAO_ADD",{
				Pernr: Pernr,
				Objps: Objps
			});
		}

	});

});