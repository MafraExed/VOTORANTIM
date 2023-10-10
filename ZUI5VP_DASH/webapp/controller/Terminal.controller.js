sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, MessageBox, History, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.sap.dashboardappDashboardApp.controller.Terminal", {
		onInit: function() {
			var oModel = sap.ui.getCore().getModel();
			var JSONModel = new sap.ui.model.json.JSONModel();
			var me =  this;
			oModel.read("ZET_VPWM_TERMINALSet", {
				success: function(oData, oResponse) {
					JSONModel.setData(oData.results);
					me.byId("terminais").setModel(JSONModel);
					me.byId("terminais").setBusy(false);
				},
				error: function(erro) {

				}
			});
		
			this.byId("terminais").setBusy(true);
		},
		onSelectionChange: function(oEvent) {
			var path = oEvent.getSource().getBindingContext().getPath().split("/")[1];
			var Codterm = oEvent.getSource().getModel().getData()[path].Codterm;
			var nomeTerminal = oEvent.getSource().getModel().getData()[path].Descterm;
			// sap.m.MessageToast.show(Codterm, {
			// 	durantion: 4000
			// });
			sap.ui.getCore().setModel(Codterm, "codterm");
			sap.ui.getCore().setModel(nomeTerminal, "nomeTerminal");
			if (this.getView().getParent().getParent().getMasterPages()[1] != undefined) {
				this.getView().getParent().getParent().getMasterPages()[1].getController().dataInicial();
				this.getView().getParent().getParent().getMasterPages()[1].getController().onCarregaLista();
			}
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("master", {}, true);
		},
		onSearchLiveChange: function(oEvent) {
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("Descterm", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			var list = this.getView().byId("terminais");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		}

	});
}, /* bExport= */ true);