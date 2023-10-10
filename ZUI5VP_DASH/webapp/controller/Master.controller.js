sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History", "sap/ui/Device"], function(Controller, History, Device) {
	"use strict";

	return Controller.extend("com.sap.dashboardappDashboardApp.controller.Master", {
		onInit: function() {
			sap.ui.getCore().setModel(this.getView(), "controller");
			this.dataInicial();
			this.onCarregaLista();
		},
		onExit: function(){
			sap.ui.getCore().setModel(undefined, "controller");
		},
		dataInicial: function() {
			var rangedate = {
				dtini: "",
				dtfim: ""
			};
			var date = new Date();
			var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
			var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
			rangedate.dtini = firstDay.yyyymmdd();
			rangedate.dtfim = lastDay.yyyymmdd();

			// rangedate.dtini = "20130101";
			// rangedate.dtfim = "20171231";
			this.byId("MasterDias").setBusy(true);
			
			sap.ui.getCore().setModel(rangedate, "rangedate");
			this.byId("nomeTerminal").setTitle(sap.ui.getCore().getModel("nomeTerminal"));
		},
		onCarregaLista: function(oEvent) {
			var JSONModel = new sap.ui.model.json.JSONModel();
			var oModel = sap.ui.getCore().getModel();
			var rangedate = sap.ui.getCore().getModel("rangedate");
			var codterm = sap.ui.getCore().getModel("codterm");
			var oDataFinal = [];
			var me = this;
			var param = "filter=FiltroDia+ge+'" + rangedate.dtini + "'+and+FiltroDia+le+'" + rangedate.dtfim + "'+and+Codterm+eq+'" + codterm +
				"'";
			oModel.read("ZET_VPWM_DIASSet?%24" + param, {
				success: function(oData, oResponse) {
					for (var i = 0; i < oData.results.length; i++) {
						if (oData.results[i].IconVenda.length != 0) {
							oData.results[i].IconVenda = "/sap/opu/odata/sap/ZGWVPWM_DASHBOARD_SRV/ZET_VPWM_PICTURESSet('NAVIOICONE.png')/$value";
						}
						oDataFinal.push(oData.results[i]);
					}
					JSONModel.setData(oDataFinal);
					me.byId("MasterDias").setModel(JSONModel);
					me.byId("MasterDias").setBusy(false);
				},
				error: function(erro) {
					console.log(erro);
				}
			});
			
		},
		onNavBack: function() {
			this.onPressRemoveFilter();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("terminal", {}, true);
		},
		onSelectionChange: function(oEvent) {
			var totalRecebido = oEvent.getSource().getAttributes()[0].getText();
			var cargaTrem = oEvent.getSource().getFirstStatus().getText();
			var cargaCaminhao = oEvent.getSource().getSecondStatus().getText();
			var dataTopo = oEvent.getSource().getTitle();
			var parts = oEvent.getSource().getTitle().split("/");
			var diaDetalhe = new Date(parseInt(parts[2], 10),
				parseInt(parts[1], 10) - 1,
				parseInt(parts[0], 10));
			diaDetalhe = diaDetalhe.yyyymmdd();

			sap.ui.getCore().setModel(totalRecebido, "totalRecebido");
			sap.ui.getCore().setModel(cargaTrem, "cargaTrem");
			sap.ui.getCore().setModel(cargaCaminhao, "cargaCaminhao");
			sap.ui.getCore().setModel(diaDetalhe, "diaDetalhe");
			sap.ui.getCore().setModel(dataTopo, "dataTopo");

			if (this.getView().getParent().getParent().getDetailPages()[0] != undefined) {
				this.getView().getParent().getParent().getDetailPages()[0].getController().carregaInformacoes();
				this.getView().getParent().getParent().getDetailPages()[0].getController().carregaLista();
			}

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("detail", {}, true);
		},
		onPressSimular: function() {
			if (sap.ui.getCore().getModel("viewSimular") != undefined) {
				var controllerSimular = sap.ui.getCore().getModel("viewSimular").getController();
				controllerSimular.iniciaGrafico();
			}

			this.getView().getParent().getParent().getParent().getController().byId("rootControl").setVisible(false);
			this.getView().getParent().getParent().getParent().getController().byId("App").setVisible(true);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("simular", {}, true);
		},
		onPressMensal: function() {
			var controller = this;
			var oDialog = new sap.m.Dialog({
				title: "Mensal",
				icon: "sap-icon://calendar",
				type: "Message",
				content: [
					new sap.m.Text({
						text: "Escolha o tipo de visualização:",
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
					new sap.m.HBox({
						alignItems: "Stretch",
						direction: "Row",
						fitContainer: false,
						width: "auto",
						height: "auto",
						justifyContent: "Center",
						renderType: "Div",
						visible: true,
						displayInline: false,
						items: [
							new sap.m.Button({
								text: "Estoque",
								type: "Default",
								icon: "sap-icon://line-chart-dual-axis",
								iconFirst: true,
								width: "auto",
								enabled: true,
								visible: true,
								iconDensityAware: false,
								press: controller._onPressEstoque
							}),
							new sap.m.Text({
								text: "",
								width: "20px",
								maxLines: 1,
								wrapping: false,
								textAlign: "Begin",
								textDirection: "Inherit"
							}),
							new sap.m.Button({
								text: "Navios",
								type: "Default",
								icon: "sap-icon://appointment-2",
								iconFirst: true,
								width: "auto",
								enabled: true,
								visible: true,
								iconDensityAware: false,
								press: this._onPressLineUp
							})
						]
					})
				]
			});
			oDialog.addButton(new sap.m.Button({
				text: "Cancelar",
				press: function() {
					oDialog.close();
					oDialog.destroy();
				}
			}));
			oDialog.open();
		},
		_onPressEstoque: function(oEvent) {
			var controller = sap.ui.getCore().getModel("controller").getController();
			var oDialog = this.getParent().getParent();
			oDialog.close();
			oDialog.destroy();
			sap.m.MessageToast.show("Evento do estoque", {
				duration: 3000
			});
			
			var controllerGraficoEstoque = sap.ui.getCore().getModel("viewEstoque");
			if (controllerGraficoEstoque != undefined) {
				controllerGraficoEstoque.getController().onCarregaGrafico();
			}
			
			controller.getView().getParent().getParent().getParent().getController().byId("rootControl").setVisible(false);
			controller.getView().getParent().getParent().getParent().getController().byId("App").setVisible(true);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(controller);
			oRouter.navTo("estoqueMensal", {}, true);

		},
		_onPressLineUp: function(oEvent) {
			var controllerLineUp = sap.ui.getCore().getModel("viewLineUp");
			var controller = sap.ui.getCore().getModel("controller").getController();
			var oDialog = this.getParent().getParent();
			oDialog.close();
			oDialog.destroy();
			// sap.m.MessageToast.show("Evento do LineUp", {
			// 	duration: 3000
			// });
			if (controllerLineUp != undefined) {
				controllerLineUp.getController().carregaTiles();
			}

			controller.getView().getParent().getParent().getParent().getController().byId("rootControl").setVisible(false);
			controller.getView().getParent().getParent().getParent().getController().byId("App").setVisible(true);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(controller);
			oRouter.navTo("lineup", {}, true);
		},
		onPressRemoveFilter: function() {
			var oCalendar = this.getView().byId("calendario");
			oCalendar.removeAllSelectedDates();
			var oToolbarFilter = this.getView().byId("toolbalFilter");
			oToolbarFilter.setVisible(false);
			this.dataInicial();
			this.onCarregaLista();
		},
		onSelectDay: function(oEvent) {
			var param;
			var oToolbarFilter = this.getView().byId("toolbalFilter");
			oToolbarFilter.setVisible(true);
			var startDate = this.byId("calendario").getSelectedDates()[0].getStartDate();
			var endData = this.byId("calendario").getSelectedDates()[0].getEndDate();

			if (endData != undefined) {
				var rangedate = {
					dtini: "",
					dtfim: ""
				};

				rangedate.dtini = startDate.yyyymmdd();
				rangedate.dtfim = endData.yyyymmdd();
				console.log(rangedate);
				sap.ui.getCore().setModel(rangedate, "rangedate");

				this.onCarregaLista();
			}

			// if (endData == undefined) {
			// 	param = "Seleção unica (" + startDate.getFullYear() + startDate.getMonth() + startDate.getDate() + ")";
			// } else {
			// 	param = "Seleção range de (" + startDate.getFullYear() + startDate.getMonth() + startDate.getDate() + " até " + endData.getFullYear() +
			// 		endData.getMonth() + endData.getDate() + ")";
			// }
			// sap.m.MessageToast.show(param, {
			// 	duration: 3000
			// });

		}
	});

}, /* bExport= */ true);