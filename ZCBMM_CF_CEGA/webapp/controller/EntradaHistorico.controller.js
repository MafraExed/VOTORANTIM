sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function(Controller, UIComponent) {
	"use strict";

	return Controller.extend("ZCBMM_CF_CEGA.ZCBMM_CF_CEGA.controller.EntradaHistorico", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ZCBMM_CF_CEGA.ZCBMM_CF_CEGA.view.EntradaHistorico
		 */
		onInit: function() {
			this.oRouter = UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this._handleRoutePatternMatched, this);
		},

		_handleRoutePatternMatched: function(oEvent) {
			if (oEvent.getParameter("name") !== "entradaHistorico") {
				return;
			}

			var oArguments = oEvent.getParameter("arguments");
			//bind view

			var oModel = this.getView().getModel();
			var sKey = oModel.createKey("/HistoricoConfCegaCBSet", {
				CodAviso: oArguments.CodAviso,
				Fornecedor: oArguments.Fornecedor,
				Nfe: oArguments.Nfe,
				Serie: oArguments.Serie,
				Ebeln: oArguments.Ebeln
			});

			// this.getView().getModel("contagemModel").setData({});
			this.getView().bindElement({
				path: sKey
					/*,
					parameters: {
						expand: "ToFoto"
					}*/
			});
		},

		onFotoPress: function() {
			debugger;
			var obj = this.getView().getBindingContext().getObject();

			var sKey = this.getView().getModel().createKey("/AceiteReservaFotoSet", {
				CodAviso: obj.CodAviso,
				Fornecedor: obj.Fornecedor,
				Nfe: obj.Nfe,
				Serie: obj.Serie,
				Ebeln: obj.Ebeln
			});
			
			sKey = "/sap/opu/odata/sap/ZGWCBMM_CONF_CEGA_SRV" + sKey + "/$value";
			sap.m.URLHelper.redirect(sKey, true);

		}

	});

});