sap.ui.define([
	"Y5GL_CADASTRO/Y5GL_CADASTRO/controller/BaseController",
	"sap/ui/Device"
], function (BaseController, Device) {
	"use strict";

	return BaseController.extend("Y5GL_CADASTRO.Y5GL_CADASTRO.controller.BENEFICIOS", {
		

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Y5GL_CADASTRO.Y5GL_CADASTRO.view.BENEFICIOS
		 */
		onInit: function () {
			this.getRouter().getRoute("BENEFICIOS").attachPatternMatched(this._onRefreshList, this);
		},
		
		_onRefreshList: function() {
			var lista = this.getView().byId("list");
			var Listb = lista.getBinding("items");
			
			Listb.refresh(true);
			
		},
		
		formatTextEStatus: function (oValue) {
			if (oValue === "A") {
				return "Em AprovaÃ§Ã£o";
			}
			return " ";
		},
		
		formatHighLight: function(oValue){
			if (oValue === "A") {
				return "Success";
			}
			return "Information";
		},
		
		formatStateEStatus: function(oValue){
			if (oValue === "A") {
				return "Success";
			}
			return "None";
		},

		onSelectionChange: function(oEvent){
			var bReplace = !Device.system.phone;
			var Zdesc = "BENEFICIOS_DETAIL";
			var zParam = oEvent.getParameter("listItem").getBindingContext().getProperty("Zparam");
			
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getRouter().navTo(Zdesc,{
				Zparam: zParam
			},bReplace);
		},
		
		onBackMaster: function(){
			this.getRouter().navTo("master");
		}

	});

});