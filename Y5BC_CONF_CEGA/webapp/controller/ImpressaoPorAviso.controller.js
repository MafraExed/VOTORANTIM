sap.ui.define([
	"Y5BC_CONF_CEGA/Y5BC_CONF_CEGA/controller/BaseController",//"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function(Controller, UIComponent, JSONModel, MessageToast) {
	"use strict";

	return Controller.extend("Y5BC_CONF_CEGA.Y5BC_CONF_CEGA.controller.ImpressaoPorAviso", {

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
			
					oViewModel.setProperty("/CodAviso", sCodAviso);
					oViewModel.setProperty("/Name", sName);
					oViewModel.setProperty("/items", oData.results);
				}.bind(this),
				error: function(oError) {
		
					this.onNavBack();

				}.bind(this)
			});
		},

		onPrintPress: function() {
			
			var oTable = this.byId("reimpressaoTable");
			var aItems = oTable.getItems();

			var oViewModel = this.getView().getModel("viewModel");
			var oModel = this.getOwnerComponent().getModel();
			var Aviso = this.getView().getModel("viewModel").getData().CodAviso;
			var id_impres = 'A';

			for (var i = 0; i < aItems.length; i++) {
				var oItem = aItems[i];
				
				var obj = oViewModel.getObject(oItem.getBindingContextPath());
				//
				oModel.callFunction("/ImprimirPorMaterial", {
				method: "POST",
				urlParameters: {
					Matnr: obj.Matnr,
					Quantidade: parseFloat(obj.Quantidade),
					Name: oViewModel.getProperty("/Name"),
					AvisoEntrega: Aviso,
					Item: obj.Id,
			        Pep: obj.Pep,
			        Lote: obj.Lote,
			        Id_Imp: id_impres
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