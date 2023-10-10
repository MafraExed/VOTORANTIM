sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function(Controller, UIComponent) {
	"use strict";

	return Controller.extend("Y5BC_CONF_CEGA.Y5BC_CONF_CEGA.controller.EntradaHistorico", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Y5BC_CONF_CEGA.Y5BC_CONF_CEGA.view.EntradaHistorico
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
			if(!oArguments.Serie){
				oArguments.Serie = "999";
			}
			var oModel = this.getView().getModel();

			var sKey = oModel.createKey("/ZET_CBEWM_HIST_CONF_CEGACBSet", {
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
			var obj = this.getView().getBindingContext().getObject();

			var sKey = this.getView().getModel().createKey("/ZET_CBEWM_ACEITE_RESERVA_FOTOSet", {
				CodAviso: obj.CodAviso,
				Fornecedor: obj.Fornecedor,
				Nfe: obj.Nfe,
				Serie: obj.Serie,
				Ebeln: obj.Ebeln
			});
			
			sKey = "/sap/opu/odata/sap/ZGWCBEWM_CONF_CEGA_SRV" + sKey + "/$value";
			sap.m.URLHelper.redirect(sKey, true);

		}

	});

});