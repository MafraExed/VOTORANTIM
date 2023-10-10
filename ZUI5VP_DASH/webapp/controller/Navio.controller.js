sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, History) {
	"use strict";

	return BaseController.extend("com.sap.dashboardappDashboardApp.controller.Navio", {
		handleRouteMatched: function(oEvent) {

		},
		onNavBack: function(oEvent) {
			this.getView().getParent().getParent().getController().byId("rootControl").setVisible(false);
			this.getView().getParent().getParent().getController().byId("App").setVisible(true);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("lineup", {}, true);
		},
		onInit: function() {
			sap.ui.getCore().setModel(this.getView(), "viewNavio");
			this.carregaLista();
		},
		onExit: function() {
			sap.ui.getCore().setModel(undefined, "viewNavio");
		},
		carregaLista: function() {
			var me = this;
			var codTerm = sap.ui.getCore().getModel("codterm");
			var codNavio = sap.ui.getCore().getModel("codNavio");
			var nomeNavio = sap.ui.getCore().getModel("nomeNavio");
			var dataNavio = sap.ui.getCore().getModel("dataNavio");
			var kdmat = sap.ui.getCore().getModel("kdmatNavio");
			var totalToneladas = 0;
			//debugger;
			var dt = new Date(dataNavio.substring(6, 10), parseInt(dataNavio.substring(3, 5)) - 1, dataNavio.substring(0, 2));
			dt = dt.yyyymmdd();
			var oModel = sap.ui.getCore().getModel();
			var JSONModel = new sap.ui.model.json.JSONModel();
			var param = "filter=Data+eq+'" + dt + "'+and+Codnavio+eq+'" + codNavio + "'+and+Codterm+eq+'" + codTerm +
				"'" + "+and+Kdmat+eq+'" + kdmat + "'";
			var oDataNavio = [];
			oModel.read("ZET_VPWM_NAVIOSet?%24" + param, {
				success: function(oData, oResponse) {
					for (var i = 0; i < oData.results.length; i++) {
						oDataNavio.push({
							Descmat: oData.results[i].Descmat,
							Saldo: oData.results[i].Saldo

						});

						totalToneladas = totalToneladas + parseInt(oData.results[i].Saldo);

					}
					me.byId("totalToneladas").setText(totalToneladas);
					JSONModel.setData(oDataNavio);
				},
				error: function(erro) {
					console.log(erro);
				}
			});

			this.byId("listVenda").setModel(JSONModel);
			this.byId("dataNavio").setText(dataNavio);
			this.byId("nomeNavio").setText(nomeNavio);
			this.byId("destinoNavio").setText(kdmat);

		}

	});
}, /* bExport= */ true);