sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function(Controller, UIComponent) {
	"use strict";

	return Controller.extend("Y5CB_CONF_C_REP.Y5CB_CONF_C_REP.controller.EntradaHistorico", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Y5CB_CONF_C_REP.Y5CB_CONF_C_REP.view.EntradaHistorico
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

			var sKey = oModel.createKey("/ZET_CBMM_HIST_CONF_CEGACBSet", {
				CodAviso: oArguments.CodAviso,
				Cliente: oArguments.Cliente,
				Nfe: oArguments.Nfe,
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

			var sKey = this.getView().getModel().createKey("/ZET_CBMM_ACEITE_RESERVA_LOGSet", {
				CodAviso: obj.CodAviso,
				Cliente: obj.Cliente,
				Nfe: obj.Nfe,
				Ebeln: obj.Ebeln
			});
			
			sKey = "/sap/opu/odata/sap/ZGWCBMM_CONF_CEG_REPARO_SRV" + sKey + "/$value";
			sap.m.URLHelper.redirect(sKey, true);

		}

	});

});