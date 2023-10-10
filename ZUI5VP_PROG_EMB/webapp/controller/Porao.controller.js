sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, History) {
	"use strict";

	return BaseController.extend("fibriembarque.controller.Porao", {
		_onRowPress: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			//this.getView().getParent().getParent().getParent().getParent().getController().createId("carregamento");
			this.getView().getParent().getParent().getParent().getController().byId("split").setVisible(false);
			this.getView().getParent().getParent().getParent().getController().byId("app").setVisible(true);
			//this.onStopTimer();

			var itemData = this.byId("tablePorao").getModel("table").getData();
			var selectedRowId = oEvent.getSource().oBindingContexts.table.sPath.split("/")[1];

			var eventBus = sap.ui.getCore().getEventBus();
			sap.ui.getCore().setModel(selectedRowId, "rowPressViewPorao");

			if (itemData[selectedRowId]) {
				try {
					itemData[selectedRowId].Carga_total = Number.parseInt(itemData[selectedRowId].Carga_total);
					itemData[selectedRowId].Carregados = Number.parseInt(itemData[selectedRowId].Carregados);
				} catch (erro) {}

				oRouter.navTo("carregamento", {
					oc: itemData[selectedRowId].Oc,
					itemoc: itemData[selectedRowId].Itemoc
				}, true);
				eventBus.publish("PoraoCarregamentoChannel", "onNavigateEvent", {
					porao: itemData[selectedRowId]
				});
			}

		},
		onExit: function() {
			clearInterval(window.timerOrdem);
			clearInterval(window.timerPorao);
			clearInterval(window.timerMaster);

		},
		_onAtualizaList: function() {
			var dadosCabecalho = sap.ui.getCore().getModel("dadosCabecalhoPorao");

			if (dadosCabecalho !== undefined) {

				this.preencheCabecalho(dadosCabecalho);
				this.getDadosBackEnd(dadosCabecalho);
			}

		},
		_onAtualizaListButton: function() {
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.publish("Ordem", "_onAtualizaList");
		},
		_onNavPress: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.onStopTimer();
			oRouter.navTo("ordem", {}, false);
		},
		onInit: function() {
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("Porao", "_onAtualizaList", this._onAtualizaList, this);
			var controller = this;
			this.oResourceModel = new sap.ui.model.resource.ResourceModel({
				bundleName: "fibriembarque.i18n.i18n"
			});
			sap.ui.getCore().setModel(controller, "controllerViewPorao");
			controller.preecheDados();
			var oView = this.getView();
			oView.addEventDelegate({
				onBeforeShow: function(oEvent) {
					controller.onStopTimer();
					controller.onIniciaTimer();
					if (sap.ui.Device.system.phone === true) {
						controller.byId("StartOperatio").setTitle(controller.oResourceModel._oResourceBundle.getText("poraoStartOperation2"));
						controller.byId("EtimatedTime").setTitle(controller.oResourceModel._oResourceBundle.getText("Estimated2"));
					}
				}
			}, oView);
		},

		onIniciaTimer: function() {
			var controller = this;
			var qtde = 0;
			window.timerPorao = setInterval(function() {
				setTimer();
				somaTempo();
			}, 1000);

			function setTimer() {
				if (controller.byId("tablePorao") !== undefined) {
					var itens = controller.byId("tablePorao").getItems();
					for (var i = 0; i < itens.length; i++) {
						if (itens[i].getCells()[5].getNumber && itens[i].getCells()[5].getNumber() > itens[i].getCells()[6].getNumber()) {
							if (itens[i].getCells()[3].getNumber().length >= 8) {
								var tamanho = itens[i].getCells()[3].getNumber().length;
								var segundos = parseInt(itens[i].getCells()[3].getNumber().substring(tamanho - 2, tamanho));
								var minutos = parseInt(itens[i].getCells()[3].getNumber().substring(tamanho - 5, tamanho - 3));
								var horas = parseInt(itens[i].getCells()[3].getNumber().substring(0, tamanho - 6));

								segundos = segundos + 1;
								if (segundos >= 60) {
									segundos = 0;
									minutos = minutos + 1;
									if (minutos >= 60) {
										minutos = 0;
										if (horas !== undefined || horas === "") {
											horas = horas + 1;
										} else {
											horas = 1;
										}
									}
								}
								if (horas < 10) {
									horas = '0' + horas;
								}
								if (minutos < 10) {
									minutos = '0' + minutos;
								}
								if (segundos < 10) {
									segundos = '0' + segundos;
								}
								var string = horas + ":" + minutos + ":" + segundos;
								itens[i].getCells()[3].setNumber(string);
							}
						}
					}
				}
			}

			function somaTempo() {
				if (qtde == 180) {
					//sap.m.MessageToast.show("Atualizar oData!");
					controller._onAtualizaListButton();
					qtde = 0;
				}
				qtde++;
			}

		},
		onStopTimer: function() {
			clearInterval(window.timerPorao);
		},

		preecheDados: function() {
			var controller = this;
			var dadosCabecalho = sap.ui.getCore().getModel("dadosCabecalhoPorao");
			if (sap.ui.Device.system.phone === true) {
				controller.byId("StartOperatio").setTitle(controller.oResourceModel._oResourceBundle.getText("poraoStartOperation2"));
				controller.byId("EtimatedTime").setTitle(controller.oResourceModel._oResourceBundle.getText("Estimated2"));
			}
			if (dadosCabecalho !== undefined) {
				controller.onStopTimer();
				this.preencheCabecalho(dadosCabecalho);
				this.getDadosBackEnd(dadosCabecalho);

			} else {
				this.getOwnerComponent().getRouter().navTo("ordem");
			}
		},
		preencheCabecalho: function(dadosCabecalho) {
			var JSONModel = new sap.ui.model.json.JSONModel();
			JSONModel.setData(dadosCabecalho);
			JSONModel.getData().Porcentagem = parseFloat(JSONModel.getData().Porcentagem);
			this.getView().setModel(JSONModel);
			//this.byId("progress").setPercentValue(parseFloat(JSONModel.getData().Porcentagem));                         
		},
		getDadosBackEnd: function(dadosCabecalho) {
			var controller = this;
			var serviceUrl = "/sap/opu/odata/sap/ZGWVPWM_PROGRAMACAO_EMBARQUE_SRV/";
			var JSONModel = new sap.ui.model.json.JSONModel();
			var param = "/ZET_VPWM_PORAOSet?%24filter=Oc+eq+%27" + dadosCabecalho.Oc + "%27";
			var list = controller.byId("tablePorao");
			if (list !== undefined) {
				var oModel = new sap.ui.model.odata.ODataModel(serviceUrl, true);
				oModel.read(param, {
					success: function(oData, oResponse) {
						if (oData.results.length > 0) {
							JSONModel.setData(oData.results);
						}
						for (var i = 0; i < JSONModel.getData().length; i++) {
							JSONModel.getData()[i].Porcentagem = parseFloat(JSONModel.getData()[i].Porcentagem);
						}
						if (JSONModel.getData().length > 0) {
							controller.onStopTimer();
							controller.onIniciaTimer();
						}

						list.setModel(JSONModel, "table");

					},
					error: function(erro) {
						// Mensagem não a carregamentos
					}
				});
			}
		}

	});
}, /* bExport= */ true);