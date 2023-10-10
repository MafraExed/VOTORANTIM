sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/model/resource/ResourceModel"

], function(BaseController, MessageBox, History, ResourceModel) {
	"use strict";

	return BaseController.extend("com.sap.dashboardappDashboardApp.controller.LineUp", {
		handleRouteMatched: function(oEvent) {

		},

		onNavBack: function(oEvent) {
			this.getView().getParent().getParent().getController().byId("rootControl").setVisible(true);
			this.getView().getParent().getParent().getController().byId("App").setVisible(false);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("master", {}, true);

		},
		onStandardTilePress: function(oEvent) {
			var codNavio = oEvent.getSource().getModel().getData().CodNavio;
			var data = oEvent.getSource().getModel().getData().Data;
			var nomeNavio = oEvent.getSource().getModel().getData().NomeNavio;
			var kdmat  = oEvent.getSource().getModel().getData().Kdmat;
			
			sap.ui.getCore().setModel(codNavio, "codNavio");
			sap.ui.getCore().setModel(nomeNavio, "nomeNavio");
			sap.ui.getCore().setModel(kdmat, "kdmatNavio");

			sap.ui.getCore().setModel(data, "dataNavio");
			var viewNavio = sap.ui.getCore().getModel("viewNavio");
			if (viewNavio != undefined) {
				viewNavio.getController().carregaLista();
			}

			sap.ui.getCore().getModel("viewLineUp").getParent().getParent().getController().byId("rootControl").setVisible(false);
			sap.ui.getCore().getModel("viewLineUp").getParent().getParent().getController().byId("App").setVisible(true);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(sap.ui.getCore().getModel("viewLineUp").getController());
			oRouter.navTo("navio", {}, true);
		},
		onInit: function() {
			sap.ui.getCore().setModel(this.getView(), "viewLineUp");
			var i18nModel = new ResourceModel({
				bundleName: "com.sap.dashboardappDashboardApp.i18n.i18n"
			});
			this.getView().setModel(i18nModel, "i18n");
			this.carregaTiles();

			//	var oBundle = this.getView().getModel("i18n").getResourceBundle();
			//		var sMsg = oBundle.getText("listaCaminhao");

		},
		onExit: function() {
			sap.ui.getCore().setModel(undefined, "viewLineUp");
		},
		carregaTiles: function() {
			console.log("passou");
			var rangedate = {
				dtini: "",
				dtfim: ""
			};
			var me = this;
			var date = new Date();
			var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
			var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
			rangedate.dtini = firstDay.yyyymmdd();
			rangedate.dtfim = lastDay.yyyymmdd();
			var codterm = sap.ui.getCore().getModel("codterm");
			var oModel = sap.ui.getCore().getModel();
			var param = "filter=Data+ge+'" + rangedate.dtini + "'+and+Data+le+'" + rangedate.dtfim + "'+and+Codterm+eq+'" + codterm +
				"'";
            
            		var oBundle = this.getView().getModel("i18n").getResourceBundle();
					this.byId("panel").setHeaderText(oBundle.getText("mes" + date.getMonth()  ));
            
			oModel.read("ZET_VPWM_LINEUPSet?%24" + param, {
				success: function(oData, oResponse) {
					me.byId("panel").removeAllContent();
					for (var i = 0; i < oData.results.length; i++) {
						var JSONModel = new sap.ui.model.json.JSONModel();
						var oDataTile = {};
						oDataTile.Icon = oData.results[i].Icon;
						oDataTile.TotalVenda = oData.results[i].TotalVenda;
						oDataTile.UnidadeVenda = "Toneladas";
						oDataTile.NomeNavio = oData.results[i].NomeNavio;
						oDataTile.Data = oData.results[i].Data;
						oDataTile.Status = oData.results[i].Status;
						oDataTile.CodNavio = oData.results[i].UnidadeVenda;
						oDataTile.Kdmat = oData.results[i].Kdmat;

						var tile = new sap.m.StandardTile({
							icon: "{/Icon}",
							type: "None",
							number: "{/TotalVenda}",
							numberUnit: "{/Kdmat}",
							title: "{/NomeNavio}",
							info: "{/Data}",
							infoState: "Success",
							press: me.onStandardTilePress
						});
						JSONModel.setData(oDataTile);
						tile.setModel(JSONModel);
						me.byId("panel").addContent(tile);
					}

				},
				error: function(erro) {
					console.log(erro);
				}
			});

		}
	});
}, /* bExport= */ true);