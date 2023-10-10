sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History"
], function(Controller, MessageBox, History) {
	"use strict";

	return Controller.extend("fibriembarque.controller.Ordem", {
		index: null,

		onExit: function() {
			clearInterval(window.timerOrdem);
			clearInterval(window.timerPorao);
			clearInterval(window.timerMaster);

		},
		onInit: function() {
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("Ordem", "_onAtualizaList", this._onAtualizaList, this);
			var controller = this;
			this.getOwnerComponent().getRouter().getRoute("ordem").attachPatternMatched(this._onRouteMatched, this);
			// attachPatternMatched
			this.oResourceModel = new sap.ui.model.resource.ResourceModel({
				bundleName: "fibriembarque.i18n.i18n"
			});
			sap.ui.getCore().setModel(this.getView(), "controllerViewOrdem");

			this.preecheDados();
			var oView = this.getView();
			oView.addEventDelegate({
				onBeforeShow: function(oEvent) {
					controller.onStopTimerOrdem();
					if (controller.byId("tableOrdem").getItems().length > 0) {
						controller.onIniciaTimer();
					}
				}
			}, oView);
		},
		_onAtualizaList: function() {
			var dadosCabecalho = sap.ui.getCore().getModel("dadosCadbecalhoViewOrdem");
			if (dadosCabecalho !== undefined) {

				this.preencheCabecalho(dadosCabecalho);
				this.getDadosBackEnd(dadosCabecalho);
			}

		},
		_onAtualizaListButton: function() {
			var index = sap.ui.getCore().getModel("indexMasterNavios");
			var controller = this;
			var serviceUrl = "/sap/opu/odata/sap/ZGWVPWM_PROGRAMACAO_EMBARQUE_SRV/";
			var JSONModel = new sap.ui.model.json.JSONModel();
			var param = "/ZET_VPWM_NAVIOSSet";
			var oModel = new sap.ui.model.odata.ODataModel(serviceUrl, true);
			oModel.read(param, {
				success: function(oData, oResponse) {
					if (oData.results.length > 0) {
						var arrayDates = [];
						JSONModel.setData(oData.results);
						for (var i = 0; i < oData.results.length; i++) {
							oData.results[i].Porcentagem = parseInt(oData.results[i].Porcentagem);
						}
						var cabecalho = oData.results[index];
						cabecalho.Termino_data_est = "";
						cabecalho.Termino_time_est = "";
						sap.ui.getCore().setModel(cabecalho, "dadosCadbecalhoViewOrdem");
						controller._onAtualizaList();
					}
				},
				error: function(erro) {
					// Mensagem não a carregamentos
				}
			});
		},
		onIniciaTimer: function() {
			var controller = this;
			var qtde = 0;
			window.timerOrdem = setInterval(function() {
				setTimer();
				somaTempo(controller);
			}, 1000);

			function setTimer() {
				if (controller.byId("tableOrdem") !== undefined) {
					var itens = controller.byId("tableOrdem").getItems();
					for (var i = 0; i < itens.length; i++) {
						if (itens[i].getCells()[5].getNumber() > itens[i].getCells()[6].getNumber()) {
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

			function somaTempo(controller) {
				if (qtde == 180) {
					//sap.m.MessageToast.show("Atualizar oData!");
					// controller.preecheDados
					controller._onAtualizaListButton();
					qtde = 0;
				}
				qtde++;
			}

		},
		onStopTimerOrdem: function() {
			if (window.timerOrdem !== undefined) {
				clearInterval(window.timerOrdem);
			}
		},
		_onNavPress: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("master", {}, true);
		},
		preecheDados: function() {
			var controller = sap.ui.getCore().getModel("controllerViewOrdem").getController();
			var dadosCabecalho = sap.ui.getCore().getModel("dadosCadbecalhoViewOrdem");
			if (sap.ui.Device.system.phone === true) {
				controller.byId("StartOperatio").setTitle(controller.oResourceModel._oResourceBundle.getText("poraoStartOperation2"));
				controller.byId("EtimatedTime").setTitle(controller.oResourceModel._oResourceBundle.getText("Estimated2"));
			}
			if (dadosCabecalho !== undefined) {
				controller.onStopTimerOrdem();
				this.preencheCabecalho(dadosCabecalho);
				this.getDadosBackEnd(dadosCabecalho);

				// if (controller.byId("tableOrdem").getItems().length > 0) {
				// 	controller.onIniciaTimer();
				// }
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("master", {}, true);
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
			var controller = sap.ui.getCore().getModel("controllerViewOrdem").getController();
			var serviceUrl = "/sap/opu/odata/sap/ZGWVPWM_PROGRAMACAO_EMBARQUE_SRV/";
			var JSONModel = new sap.ui.model.json.JSONModel();
			var param = "/ZET_VPWM_ORDEMSet?%24filter=Centro+eq+%27" + dadosCabecalho.Centro +
				"%27+and+Depdestino+eq+%27" + dadosCabecalho.Depdestino +
				"%27+and+Navio+eq+%27" + dadosCabecalho.Navio +
				"%27+and+Viagemarm+eq+%27" + dadosCabecalho.Viagemarm + "%27";
			var list = this.byId("tableOrdem");
			var oModel = new sap.ui.model.odata.ODataModel(serviceUrl, true);
			oModel.read(param, {
				success: function(oData, oResponse) {
					if (oData.results.length > 0) {
						JSONModel.setData(oData.results);
					}
					var arrayDates = [];
					var maiorDate = null;
					for (var i = 0; i < JSONModel.getData().length; i++) {
						if (JSONModel.getData()[i].Termino_data_est !== '00/00/0000') {
							arrayDates.push(
								new Date(JSONModel.getData()[i].Termino_data_est.slice(6, 10),
									JSONModel.getData()[i].Termino_data_est.slice(3, 5),
									JSONModel.getData()[i].Termino_data_est.slice(0, 2),
									JSONModel.getData()[i].Termino_time_est.slice(0, 2),
									JSONModel.getData()[i].Termino_time_est.slice(3, 5),
									JSONModel.getData()[i].Termino_time_est.slice(6, 8)
								));
						}
						JSONModel.getData()[i].Porcentagem = parseFloat(JSONModel.getData()[i].Porcentagem);
					}

					for (var index = 0; index < arrayDates.length; index++) {
						if (maiorDate === null) {
							maiorDate = arrayDates[index];
						} else {
							if (maiorDate < arrayDates[index]) {
								maiorDate = arrayDates[index];
							}
						}
					}
					if (maiorDate !== null) {
						var dia = controller.montaStringhora(maiorDate.getDate());
						var mes = controller.montaStringhora(maiorDate.getMonth());
						var ano = maiorDate.getFullYear();

						var fullhora = controller.montaStringhora(maiorDate.getHours()) + ":" + controller.montaStringhora(maiorDate.getMinutes()) +
							":" + controller.montaStringhora(maiorDate.getSeconds());
						controller.byId("EtimatedTime").setText(dia + "/" + mes + "/" + ano + " - " + fullhora);

					} else {
							controller.byId("EtimatedTime").setText("00/00/0000 - 00:00:00");
					}

					if (JSONModel.getData().length > 0) {
						controller.onStopTimerOrdem();
						controller.onIniciaTimer();
					}
					list.setModel(JSONModel, "table");
					if (controller.index !== null) {
						var dadosCabecalhoPorao = list.getModel("table").getData()[parseInt(controller.index)];
						sap.ui.getCore().setModel(dadosCabecalhoPorao, "dadosCabecalhoPorao");
						var oEventBus = sap.ui.getCore().getEventBus();
						oEventBus.publish("Porao", "_onAtualizaList");
					}
				},
				error: function(erro) {
					// Mensagem não a carregamentos
				}
			});
		},
		montaStringhora: function(string) {
			if (string < 10) {
				string = '0' + string;
			}
			return string;
		},
		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			//The history contains a previous entry
			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				// There is no history!
				// Naviate to master page
				this.getOwnerComponent().getRouter().navTo("master", {}, true);
			}
		},
		_onRouteMatched: function() {
			//código
			this.preecheDados();
		},
		_onRowPress: function(oEvent) {
			var controller = this;
			var dadosCabecalhoPorao = undefined;
			var data = this.byId("tableOrdem").getModel("table").getData();

			for (var i = 0; i < data.length; i++) {

				if (data[i].Oc === oEvent.getSource().getCells()[0].getText()) {
					dadosCabecalhoPorao = data[i];
					controller.index = i;
					i = data.length;
					break;
				}
			}

			sap.ui.getCore().setModel(dadosCabecalhoPorao, "dadosCabecalhoPorao");

			if (sap.ui.getCore().getModel("controllerViewPorao") !== undefined) {
				sap.ui.getCore().getModel("controllerViewPorao").preecheDados();
			}
			this.getOwnerComponent().getRouter().navTo("porao");
		}
	});
}, /* bExport= */ true);