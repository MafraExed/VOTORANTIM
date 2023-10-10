sap.ui.define([
	"ZCBMM_CF_CEGA/ZCBMM_CF_CEGA/controller/BaseController",//"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function(Controller, UIComponent, JSONModel, MessageToast) {
	"use strict";

	return Controller.extend("ZCBMM_CF_CEGA.ZCBMM_CF_CEGA.controller.ImpressaoPorAviso", {

		onInit: function() {
			this.oRouter = UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this._handleRoutePatternMatched, this);

			this.getView().setModel(new JSONModel({}), "viewModel");
		},

		_handleRoutePatternMatched: function(oEvent) {
			if (oEvent.getParameter("name") !== "impressaoPorAviso") {
				return;
			}
			
			

			var oModel = this.getOwnerComponent().getModel().metadataLoaded().then(this._callBackend(oEvent.getParameter("arguments").CodAviso, oEvent.getParameter("arguments").Name));

		},

		navBackPress: function() {

			//todo: clear local models?

			this.onNavBack();
		},

		_callBackend: function(sCodAviso, sName) {
			
			var oViewModel = this.getView().getModel("viewModel");
			oViewModel.setData({});
			var oModel = this.getOwnerComponent().getModel();

			oModel.callFunction("/PreviewImprimirPorAviso", {
				method: "GET",
				urlParameters: {
					CodAviso: sCodAviso,
					Name: sName

				},
				success: function(oData, response) {
					debugger;
					oViewModel.setProperty("/CodAviso", sCodAviso);
					oViewModel.setProperty("/Name", sName);
					oViewModel.setProperty("/items", oData.results);
				}.bind(this),
				error: function(oError) {
					debugger;
					this.onNavBack();

				}.bind(this)
			});
		},

		onPrintPress: function() {
			
			var oTable = this.byId("reimpressaoTable");
			var aItems = oTable.getItems();

			var oViewModel = this.getView().getModel("viewModel");
			var oModel = this.getOwnerComponent().getModel();

			for (var i = 0; i < aItems.length; i++) {
				var oItem = aItems[i];
				
				var obj = oViewModel.getObject(oItem.getBindingContextPath());
				
				//
				oModel.callFunction("/ImprimirPorMaterial", {
				method: "POST",
				urlParameters: {
					Matnr: obj.Matnr,
					Quantidade: parseFloat(obj.Quantidade),
					Name: oViewModel.getProperty("/Name")
				},
				success: function(oData, response) {
					
					
				}.bind(this),
				error: function(oError) {
					
				}
			});
				

			}
			
			this.onNavBack();
			MessageToast.show("Impressão solicitada");
			

		}

	});

});