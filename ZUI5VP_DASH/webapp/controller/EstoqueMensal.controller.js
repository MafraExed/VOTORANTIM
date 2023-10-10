sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/model/resource/ResourceModel"
], function(BaseController, MessageBox, History, ResourceModel) {
	"use strict";

	return BaseController.extend("com.sap.dashboardappDashboardApp.controller.EstoqueMensal", {
		onNavBack: function() {
			this.getView().getParent().getParent().getController().byId("rootControl").setVisible(true);
			this.getView().getParent().getParent().getController().byId("App").setVisible(false);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("master", {}, true);
		},
		onCarregaGrafico: function() {
			var oView = this.getView();
			var oModel = new sap.ui.model.json.JSONModel();
			oView.setModel(oModel, "staticDataModel");

			function dateDimensionFormatter(dimensionValue) {
				if (dimensionValue instanceof Date) {
					var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
						style: "full"
					});
					return oFormat.format(dimensionValue);
				}
				return dimensionValue;
			}
			var rangedate = {
				dtini: "",
				dtfim: ""
			};

			if (sap.ui.getCore().getModel("dataMesEstoque") == undefined) {
				var date = new Date();
				var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
				var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
				rangedate.dtini = firstDay.yyyymmdd();
				rangedate.dtfim = lastDay.yyyymmdd();

				sap.ui.getCore().setModel(rangedate, "dataMesEstoque");
			} else {
				rangedate = sap.ui.getCore().getModel("dataMesEstoque");
			}
			var novaData = new Date(rangedate.dtini.substring(0, 4), (parseInt(rangedate.dtini.substring(4, 6)) - 1), rangedate.dtini.substring(
				6, 8));
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			this.byId("panel").setHeaderText(oBundle.getText("mes" + novaData.getMonth()) + " " + oBundle.getText("de") + " " + novaData.getFullYear());

			var codterm = sap.ui.getCore().getModel("codterm");
			var param = "filter=Dia+ge+'" + rangedate.dtini + "'+and+Dia+le+'" + rangedate.dtfim + "'+and+Codterm+eq+'" + codterm +
				"'";
			var oModeloData = sap.ui.getCore().getModel();

			oModeloData.read("ZET_VPWM_ESTOQUESet?%24" + param, {
				success: function(oData, oResponse) {
					var oDataEstoque = [];
					var index = oData.results.length - 1;
					sap.ui.getCore().setModel(oData.results[index], "entradaSimularDia1");
					oData.results.pop();
					for (var i = 0; i < oData.results.length; i++) {
						oDataEstoque.push({
							"Dias": oData.results[i].Dia,
							"Navios": oData.results[i].Navios,
							"Estoque": oData.results[i].Estoque,
							"Capacidade": oData.results[i].Capacidade,
							"Venda": oData.results[i].Venda
						});
					}
					oView.getModel("staticDataModel").setData({
						"LineChart": oDataEstoque
					}, true);
				},
				error: function(erro) {

				}

			});
			this.oBindingParameters = {
				"path": "/LineChart",
				"parameters": {},
				"model": "staticDataModel"
			};
			oView.byId(
					"LineChart")
				.bindData(this.oBindingParameters);
			var aDimensions = oView.byId(
					"LineChart")
				.getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

		},

		onPressTrocarMes: function() {
			var controller = this;
			var oDialog = new sap.m.Dialog({
				title: "Alterar Mês",
				icon: "sap-icon://collections-management",
				type: "Message",
				content: [
					new sap.m.Text({
						text: "",
						width: "20px",
						maxLines: 1,
						wrapping: false,
						textAlign: "Begin",
						textDirection: "Inherit"
					}),
					new sap.m.VBox({
						alignItems: "Center",
						direction: "Row",
						justifyContent: "Center",
						items: [
							new sap.ui.layout.VerticalLayout({
								content: [
									new sap.m.Text({
										text: "Escolha o mês:",
										width: "100%",
										textAlign: sap.ui.core.TextAlign.Center
									}),
									new sap.m.Text({
										text: "",
										width: "20px",
										maxLines: 1,
										wrapping: false,
										textAlign: "Begin",
										textDirection: "Inherit"
									}),
									new sap.ui.unified.CalendarDateInterval({
										pickerPopup: true,
										days: 10,
										width: "300px"
									}),
									new sap.m.Text({
										text: "",
										width: "20px",
										maxLines: 1,
										wrapping: false,
										textAlign: "Begin",
										textDirection: "Inherit"
									})

								]
							})
						]
					})
				]
			});
			oDialog.addButton(new sap.m.Button({
				text: "Alterar",
				type: "Accept",
				press: function(oEvent) {
					var date = oEvent.getSource().getParent().getContent()[1].getItems()[0].getContent()[2].getStartDate();
					var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
					var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

					var rangedate = {
						"dtini": firstDay.yyyymmdd(),
						"dtfim": lastDay.yyyymmdd()
					};
					sap.ui.getCore().setModel(rangedate, "dataMesEstoque");

					sap.ui.getCore().getModel("viewEstoque").getController().onCarregaGrafico();
					oEvent.getSource().getParent().close();
					sap.m.MessageToast.show('Grafico atualizado com sucesso!');
				}
			}));
			oDialog.addButton(new sap.m.Button({
				text: "Cancelar",
				press: function() {
					oDialog.close();
					oDialog.destroy();
				}
			}));
			oDialog.attachAfterOpen(controller.openDialog(oDialog));
		},
		openDialog: function(oEvent) {
			if (oEvent != undefined) {
				oEvent.open();
				$("#" + oEvent.getContent()[1].getItems()[0].getContent()[2].getId()).find(".sapUiCalDatesRow").css("display", "none");
			}

		},
		onInit: function() {
			sap.ui.getCore().setModel(this.getView(), "viewEstoque");
			var i18nModel = new ResourceModel({
				bundleName: "com.sap.dashboardappDashboardApp.i18n.i18n"
			});
			this.getView().setModel(i18nModel, "i18n");

			this.onCarregaGrafico();

		},
		onExit: function() {
			sap.ui.getCore().setModel(undefined, "viewEstoque");
		}
	});
}, /* bExport= */ true);