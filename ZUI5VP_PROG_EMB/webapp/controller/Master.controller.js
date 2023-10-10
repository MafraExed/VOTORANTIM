sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("fibriembarque.controller.Master", {
		index: null,
		onInit: function() {
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("Master", "getDadosBackEnd", this.getDadosBackEnd, this);
			//oEventBus.subscribe("Master", "_onAtualizaAposAlterar", this._onAtualizaAposAlterar, this);

			this.oResourceModel = new sap.ui.model.resource.ResourceModel({
				bundleName: "fibriembarque.i18n.i18n"
			});
			sap.ui.getCore().setModel(controller, "controllerMaster");
			var controller = this;
			var oView = this.getView();
			oView.addEventDelegate({
				onBeforeShow: function(oEvent) {
					controller.onStopTimerMaster();
					controller.onIniciaTimer();
				}
			}, oView);

			this.getDadosBackEnd();
		},
		// _onAtualizaAposAlterar: function() {
		// 	this.getDadosBackEnd();
		// 	var cabecalhoNext = null;
		// 	if (this.index !== null) {
		// 		cabecalhoNext = this.byId("listNaviosCarga").getModel().getData()[parseInt(this.index)];
		// 		sap.ui.getCore().setModel(cabecalhoNext, "dadosCadbecalhoViewOrdem");
		// 	}
		// },
		onExit: function() {
			clearInterval(window.timerOrdem);
			clearInterval(window.timerPorao);
			clearInterval(window.timerMaster);
			sap.ui.getCore().setModel(undefined, "controllerViewOrdem");

		},
		onIniciaTimer: function() {
			var controller = this;
			var qtde = 0;
			window.timerMaster = setInterval(function() {
				somaTempo();
			}, 1000);

			function somaTempo() {
				if (qtde == 60) {
					//sap.m.MessageToast.show("Atualizar oData!");
					controller.getDadosBackEnd();
					qtde = 0;
				}
				qtde++;
			}
		},
		onStopTimerMaster: function() {
			clearInterval(window.timerMaster);
		},

		getDadosBackEnd: function() {
			var controller = this;
			var serviceUrl = "/sap/opu/odata/sap/ZGWVPWM_PROGRAMACAO_EMBARQUE_SRV/";
			var JSONModel = new sap.ui.model.json.JSONModel();
			var param = "/ZET_VPWM_NAVIOSSet";
			var list = controller.byId("listNaviosCarga");
			var oModel = new sap.ui.model.odata.ODataModel(serviceUrl, true);

			oModel.read(param, {
				success: function(oData, oResponse) {
					if (oData.results.length > 0) {
						JSONModel.setData(oData.results);

						for (var i = 0; i < oData.results.length; i++) {
							oData.results[i].Porcentagem = parseInt(oData.results[i].Porcentagem);
							oData.results[i].Termino_data_est = "";
							oData.results[i].Termino_time_est = "";
						}

					}
					if (list !== undefined) {
						list.setModel(JSONModel);

						if (controller.index !== null) {
							var cabecalhoNext = list.getModel().getData()[parseInt(controller.index)];
							sap.ui.getCore().setModel(cabecalhoNext, "dadosCadbecalhoViewOrdem");
						}
					}
				},
				error: function(erro) {
					// Mensagem não a carregamentos
				}
			});
		},
		_onObjectListItemPress: function(oEvent) {
			// mudar para pesquisar o navio
			var objectCabecalhoOrdem;
			objectCabecalhoOrdem =
				this.byId("listNaviosCarga").getModel().getData()[oEvent.getSource().getBindingContext().getPath().split("/")[1]];
			sap.ui.getCore().setModel(objectCabecalhoOrdem, "dadosCadbecalhoViewOrdem");
			this.index = oEvent.getSource().getBindingContext().getPath().split("/")[1];
			if (sap.ui.getCore().getModel("controllerViewOrdem") !== undefined) {
				sap.ui.getCore().getModel("controllerViewOrdem").getController().preecheDados();
			}
			sap.ui.getCore().setModel(this.index, "indexMasterNavios");
			this.getOwnerComponent().getRouter().navTo("ordem");

		},
		getDadosbackEndUnit: function(unit, oDialog) {
			var controller = this;
			var param = "Unit='" + unit + "'";
			var serviceUrl = "/sap/opu/odata/sap/ZGWVPWM_PROGRAMACAO_EMBARQUE_SRV/";
			var JSONModel = new sap.ui.model.json.JSONModel();
			var param = "ZET_VPWM_UNITSet(" + param + ")";
			var oModel = new sap.ui.model.odata.ODataModel(serviceUrl, true);

			oModel.read(param, {
				success: function(oData, oResponse) {
					JSONModel.setData(oData);
					sap.ui.getCore().setModel(JSONModel, "dadosUnit");
					var oRouter = sap.ui.core.UIComponent.getRouterFor(controller);
					oRouter.navTo("unit", {}, true);
					var oEventBus = sap.ui.getCore().getEventBus();
					oEventBus.publish("Unit", "atualizaTela");
					oDialog.close();
				},
				error: function(erro) {
					sap.m.MessageToast.show(controller.oResourceModel._oResourceBundle.getText("unitNotFound"), {
						duration: 2000, // default
						width: "15em", // default
						my: "center bottom", // default
						at: "center bottom", // default
						of: window, // default
						offset: "0 0", // default
						collision: "fit fit", // default
						onClose: null, // default
						autoClose: true, // default
						animationTimingFunction: "ease", // default
						animationDuration: 1000, // default
						closeOnBrowserNavigation: true // default
					});
				}
			});
		},
		_onButtonPesquisaUnit: function() {
			var controller = this;
			var oDialog = new sap.m.Dialog({
				icon: "sap-icon://search"
			});
			oDialog.setState("Success");
			oDialog.setTitle(controller.oResourceModel._oResourceBundle.getText("masterSearchUnit"));
			oDialog.addContent(new sap.m.Text({
				text: controller.oResourceModel._oResourceBundle.getText("masterCodUni"),
				width: "100%",
				textAlign: sap.ui.core.TextAlign.Center
			}));
			var HboxDescr = new sap.m.HBox({
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
					new sap.m.TextArea({
						rows: 1,
						width: "100%",
						textAlign: "Center"
					})
				]
			});
			oDialog.addContent(HboxDescr);
			oDialog.addButton(new sap.m.Button({
				text: controller.oResourceModel._oResourceBundle.getText("masterSearch"),
				type: sap.m.ButtonType.Accept,
				icon: "sap-icon://search",
				press: function() {
					var unita = this.getParent().getContent()[1].getItems()[0].getValue();
					// verifica se o o retorno do odata existe
					// se sim navegar para view
					if (unita != "") {
						controller.getDadosbackEndUnit(unita, oDialog);
					} else {
						sap.m.MessageToast.show(controller.oResourceModel._oResourceBundle.getText("masterCodNotFound"), {
							duration: 2000, // default
							width: "15em", // default
							my: "center bottom", // default
							at: "center bottom", // default
							of: window, // default
							offset: "0 0", // default
							collision: "fit fit", // default
							onClose: null, // default
							autoClose: true, // default
							animationTimingFunction: "ease", // default
							animationDuration: 1000, // default
							closeOnBrowserNavigation: true // default
						});
					}
				}
			}));
			oDialog.addButton(new sap.m.Button({
				text: controller.oResourceModel._oResourceBundle.getText("masterCancel"),
				type: sap.m.ButtonType.Reject,
				icon: "sap-icon://sys-cancel",
				press: function() {
					oDialog.close();
				}
			}));
			oDialog.open();

		},
		_getNaviosCarga: function() {
			var controller = this;
			var list = controller.byId("listNaviosCarga");
			var JSONModel = new sap.ui.model.json.JSONModel();
			var serviceUrl = "/sap/opu/odata/sap/";
			var oModel = new sap.ui.model.odata.ODataModel(serviceUrl, true);
			var param = "Nome do Entity Set";
			oModel.read(param, {
				success: function(oData, oResponse) {
					if (oData.results.length > 0) {
						JSONModel.setData(oData.results);
					}
					//Set JSONModel in LIST
					list.setModel(JSONModel);
				},
				error: function(erro) {
					var oDialog = new sap.m.Dialog();
					oDialog.setTitle(controller.oResourceModel._oResourceBundle.getText("errorSearch"));
					oDialog.setState("Warning");
					oDialog.setType("Message");
					//Add contents in Diolog
					oDialog.addContent(new sap.m.Text({
						text: controller.oResourceModel._oResourceBundle.getText("errorSearchDescription"),
						width: "100%",
						textAlign: sap.ui.core.TextAlign.Center
					}));
					oDialog.addButton(new sap.m.Button({
						text: "Ok",
						type: sap.m.ButtonType.Default,
						press: function() {
							oDialog.close();
						}
					}));
					//Open new dialog
					oDialog.open();
				}
			});
		},
		searchListMaster: function(oEvent) {
			var controller = this;
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var oFilter1 = new sap.ui.model.Filter("Descricao_navio", sap.ui.model.FilterOperator.Contains, sQuery);
				var oFilter2 = new sap.ui.model.Filter("Descricao_term", sap.ui.model.FilterOperator.Contains, sQuery);
				var oFilter3 = new sap.ui.model.Filter("StatusDescricao", sap.ui.model.FilterOperator.Contains, sQuery);
				var oFilter4 = new sap.ui.model.Filter("Dtdocecc", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters = new sap.ui.model.Filter([oFilter1, oFilter2, oFilter3, oFilter4]);
			}
			var binding = controller.byId("listNaviosCarga").getBinding("items");
			binding.filter(aFilters, "Application");
		}
	});
});