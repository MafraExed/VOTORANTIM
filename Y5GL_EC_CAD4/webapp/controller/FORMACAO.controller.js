sap.ui.define([
	"Y5GL_EC_CAD4/Y5GL_EC_CAD4/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("Y5GL_EC_CAD4.Y5GL_EC_CAD4.controller.FORMACAO", {
		onInit: function () {
			this.getRouter().getRoute("FORMACAO").attachPatternMatched(this.onRefresh, this);
		},
		
		onRefresh: function(){
				
		},

		onAdd: function () {
			this.getRouter().navTo("Forma_Add");
		},

		onBackMaster: function () {
			this.getRouter().navTo("master");
		},

		onSelectionChange: function (oEvent) {
			if (oEvent.getParameters("listItem").listItem !== undefined) {
				var Pernr = oEvent.getParameters("listItem").listItem.getBindingContext().getProperty("Pernr");
				var Slart = oEvent.getParameters("listItem").listItem.getBindingContext().getProperty("Slart");
				
				if (Slart === ""){
					Slart = "-";
				}
				this.getRouter().navTo("Forma_det", {
					Pernr: Pernr,
					Slart: Slart
				});
			}	
		},
		
		formatterIcon: function (oValue) {
			var sRootPath = jQuery.sap.getModulePath("Y5GL_EC_CAD4.Y5GL_EC_CAD4");
			var sImagePath = sRootPath + "/Icones/FORMACAO.png";
			return sImagePath;
		}

	});

});