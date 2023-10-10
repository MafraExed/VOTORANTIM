sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, MessageBox, History, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.sap.dashboardappDashboardApp.controller.LocalEstoque", {
		onNavBack: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("detail", {}, true);
		},
		carregaInformacoes: function() {
			this.byId("dataTopo").setText(sap.ui.getCore().getModel("dataTopo"));
			var codMat = sap.ui.getCore().getModel("codMat");
			var codTerm = sap.ui.getCore().getModel("codterm");
			var param = "filter=Codterm+eq+%27" + codTerm + "%27+and+Codmat+eq+%27" + codMat + "%27";
			var JSONModel = new sap.ui.model.json.JSONModel();
			var oModel = sap.ui.getCore().getModel();
			var me = this;
			this.byId("pageLocalEstoque").setBusy(true);
			oModel.read("ZET_VPWM_LOCALIZACAOSet?%24" + param, {
				success: function(oData, oResponse) {
					var oDataLocalizacao = [];
					var total = 0;
					var material = "";
					for (var i = 0; i < oData.results.length; i++) {
						oDataLocalizacao.push({
							localizacao: oData.results[i].Localizacao,
							saldo: oData.results[i].Saldo + " T"
						});
						total += parseInt(oData.results[i].Saldo);
						material = oData.results[i].Descmat;
					}
					try{
					me.byId("material").setText(material);
					me.byId("estoque").setText(total + " T");
					}catch(err){
						// 
					}
					JSONModel.setData(oDataLocalizacao);
					me.byId("pageLocalEstoque").setBusy(false);
					me.byId("tableLocalizacao").setModel(JSONModel);
					me.byId("listLocalizacao").setModel(JSONModel);
				},
				error: function(erro) {
					console.log(erro);
				}
			});

			// sap.m.MessageToast.show("Codigo do material: " + codMat, {
			// 	duration: 3000
			// });
		},
		onInit: function() {
			this.carregaInformacoes();
		},
		onSearchLiveChange: function(oEvent) {
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("localizacao", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			var list = this.getView().byId("tableLocalizacao");
			var table = this.getView().byId("listLocalizacao");
			var bindingTable = table.getBinding("items");
			var binding = list.getBinding("items");
			bindingTable.filter(aFilters, "Application");
			binding.filter(aFilters, "Application");
		}
	});
}, /* bExport= */ true);