sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/Device"
], function(Controller, History, Device) {
	"use strict";

	return Controller.extend("com.sap.dashboardappDashboardApp.controller.Simular", {

		iniciaGrafico: function() {
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

			if (sap.ui.getCore().getModel("dataGrafico") == undefined) {
				var date = new Date();
				var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
				var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
				rangedate.dtini = firstDay.yyyymmdd();
				rangedate.dtfim = lastDay.yyyymmdd();

				sap.ui.getCore().setModel(rangedate, "dataGrafico");
			} else {
				rangedate = sap.ui.getCore().getModel("dataGrafico");
			}
			var novaData = new Date(rangedate.dtini.substring(0, 4), (parseInt(rangedate.dtini.substring(4, 6)) - 1), rangedate.dtini.substring(
				6, 8));
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			this.byId("panel").setHeaderText(oBundle.getText("mes" + novaData.getMonth()) + " " + oBundle.getText("de") + " " + novaData.getFullYear());
			// rangedate.dtini = "20180201";
			// rangedate.dtfim = "20180228";

			var codterm = sap.ui.getCore().getModel("codterm");
			var param = "filter=Dia+ge+'" + rangedate.dtini + "'+and+Dia+le+'" + rangedate.dtfim + "'+and+Codterm+eq+'" + codterm +
				"'";
			var oModeloData = sap.ui.getCore().getModel();

			oModeloData.read("ZET_VPWM_SIMULACAOSet?%24" + param, {
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
					oView.getController().onInsertButtons();
				},
				error: function(erro) {
					var oDataEstoque = [];
					oView.getModel("staticDataModel").setData({
						"LineChart": oDataEstoque
					}, true);
					oView.getController().onInsertButtons();
				}
			});

			// oView.getModel("staticDataModel").setData({
			// 	"LineChart": oData
			// }, true);
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
		onInit: function() {
			sap.ui.getCore().setModel(this.getView(), "viewSimular");
			var oView = this.getView();
			oView.addEventDelegate({
				onBeforeShow: function(oEvent) {
					oView.getController().iniciaGrafico();
				}
			}, oView);

		},
		openDialog: function(oEvent) {
			debugger;
			if (oEvent != undefined) {
				oEvent.open();
				$("#" + oEvent.getContent()[1].getItems()[0].getContent()[2].getId()).find(".sapUiCalDatesRow").css("display", "none");
			}

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
					sap.ui.getCore().setModel(rangedate, "dataGrafico");

					sap.ui.getCore().getModel("viewSimular").getController().iniciaGrafico();
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
		onExit: function() {
			sap.ui.getCore().setModel(undefined, "viewSimular");
		},
		onInsertButtons: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			var data = this.byId("LineChart").getBindingInfo("data").binding.oList;
			var i;
			var dt = new Date();
			var date = "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear();
			var oData = [];
			for (i = 0; i < data.length; i++) {
				if (data[i].Venda.length > 0) {
					// if (parseInt(data[i].Dias) > 9) {
					// 	oData.push({
					// 		Text: data[i].Dias + date + " - " + data[i].Navios + " - " + new Intl.NumberFormat().format(data[i].Venda) + " T",
					// 		Selected: false
					// 	});
					// } else {
					// 	oData.push({
					// 		Text: "0" + data[i].Dias + date +  " - " + data[i].Navios + " - " + new Intl.NumberFormat().format(data[i].Venda) + " T",
					// 		Selected: false
					// 	});
					// }
					oData.push({
						Text: data[i].Dias + date + " - " + data[i].Navios + " - " + new Intl.NumberFormat().format(data[i].Venda) + " T",
						Selected: false
					});
				}
			}
			oModel.setData(oData);
			this.byId("rbgNavios").setModel(oModel);
			this.byId("mySliderDate").setEnabled(false);
		},
		onNavBack: function() {
			this.getView().getParent().getParent().getController().byId("rootControl").setVisible(true);
			this.getView().getParent().getParent().getController().byId("App").setVisible(false);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("master", {}, true);
		},
		onAfterRendering: function() {
			// var oBindingParameters, oChart;
			// oChart = this.getView().byId("LineChart");
			// oChart.bindData(oChart.getBindingInfo("data"));
		},
		onRadioButtonGroupChange: function(oEvent) {
			var date = parseInt(oEvent.getSource().getSelectedButton().getText().substring(0, 2));
			this.byId("mySliderDate").setValue(date);
			this.byId("mySliderDate").setEnabled(true);
			this.byId("titleSliderDate").setText("Dia: " + date);
			//sap.m.MessageToast.show(date);
		},
		onRenderComplete: function(oEvent) {
			// var x = this.byId("LineChart").getVizProperties();
			// x.legend.visible = false;
			// this.byId("LineChart").setVizProperties(x);
		},
		onSliderChange: function(oEvent) {
			var i;
			var oChart = this.byId("LineChart");
			var novaData = oEvent.getSource().getValue();
			var data = oChart.getBindingInfo("data");
			var oList = data.binding.oList;
			var dtNavioSelecionado = parseInt(this.byId("rbgNavios").getSelectedButton().getText().substring(0, 2));
			var nomeNavioSelecionado = this.byId("rbgNavios").getSelectedButton().getText().split(" - ")[1];
			var qtdeVendaNavioSelecionado = this.byId("rbgNavios").getSelectedButton().getText().split(" - ")[2].replace(" T", "");
			var entradaEstoque = [];
			var dia;
			var entrada;
			var flag = "add";
			var qtdeTotVendas = 0;
			var registroNavioAntigo = {
				Navios: "",
				Venda: ""
			};

			function dateDimensionFormatter(dimensionValue) {
				if (dimensionValue instanceof Date) {
					var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
						style: "full"
					});
					return oFormat.format(dimensionValue);
				}
				return dimensionValue;
			}

			// =======================================================================
			// =======================================================================
			//
			//							 Calcular Estoque
			//
			// =======================================================================
			// =======================================================================
			for (i = 0; i < oList.length; i++) {
				flag = "add";
				qtdeTotVendas = 0;
				//Se o dia for diferente de 1
				if (oList[i].Dias > 1) {
					//Verifica se existe venda (caso exista venda pode se ter mais de 1 registro no mesmo dia)
					if (oList[i].Venda.length > 0) {
						//Caso o dia do registro corrente for diferente do dia dia do registro de ontem: calcular a quantidade de entrada;
						if (oList[i].Dias != oList[(i - 1)].Dias) {
							//For de verificação do dia de amanha, caso o dia seja igual somar os registro de venda
							if (oList[i].Dias == oList[(i + 1)].Dias) {
								for (var y = i; y < oList.length; y++) {
									//Se os dias forem iguais somar a quantidade de venda.
									if (oList[i].Dias == oList[y].Dias) {
										qtdeTotVendas += parseInt(oList[y].Venda);
									}
									//Caso contrario sair do loop;
									else {
										y = 9999999999;
									}
								}
								// Estoque de hoje + a qtde total de vendas do dia - o estoque de ontem;
								entrada = parseInt(oList[i].Estoque) + qtdeTotVendas - parseInt(oList[(i - 1)].Estoque);
							} else {
								// Estoque de hoje +  a qtde de venda - o estoque de ontem;
								entrada = parseInt(oList[i].Estoque) + parseInt(oList[i].Venda) - parseInt(oList[(i - 1)].Estoque);
							}
						} else {
							//como ja existe o dia não colocar novamente.
							flag = "notAdd";
							// entrada = entradaEstoque[(i - 1)].Entrada;
						}
					} else {
						entrada = parseInt(oList[i].Estoque) - parseInt(oList[(i - 1)].Estoque);
					}

				} else {
					//entrada = oList[i].Estoque;
					entrada = '0';
				}
				if (flag == "add") {
					dia = oList[i].Dias;
					entradaEstoque.push({
						Dia: dia.toString(),
						Entrada: entrada.toString()
					});
				}
			}
			// =======================================================================
			// =======================================================================
			//
			//     Pegar o navio escolhido (pode ter o mesmo navio N vezes no mês)
			//
			// =======================================================================
			// =======================================================================
			qtdeVendaNavioSelecionado = qtdeVendaNavioSelecionado.replace(".", "");
			for (var z = 0; z < oList.length; z++) {
				if (parseInt(oList[z].Dias) == dtNavioSelecionado && oList[z].Navios == nomeNavioSelecionado && parseInt(oList[z].Venda) ==
					parseInt(qtdeVendaNavioSelecionado)) {

					if (z !== 0 && (oList[z].Dias == oList[(z + 1)].Dias || oList[z].Dias == oList[(z - 1)].Dias)) {
						registroNavioAntigo.Navios = oList[z].Navios;
						registroNavioAntigo.Venda = oList[z].Venda;
						registroNavioAntigo.Dias = oList[z].Dias;
						oList.splice(z, 1);
						z = 99999999;
					} else {
						registroNavioAntigo.Navios = oList[z].Navios;
						registroNavioAntigo.Venda = oList[z].Venda;
						registroNavioAntigo.Dias = oList[z].Dias;
						oList[z].Navios = "";
						oList[z].Venda = "";
						z = 99999999;

					}

				}
			}
			// =======================================================================
			// =======================================================================
			//
			//  			Tranfere o navio ou insere um novo registro
			//
			// =======================================================================
			// =======================================================================
			for (var t = 0; t < oList.length; t++) {
				if (oList[t].Dias == novaData) {
					if (oList[t].Venda.length > 0) {
						var xpto = {
							Dias: "",
							Navios: "",
							Estoque: "",
							Capacidade: "",
							Venda: ""
						};
						xpto.Dias = oList[t].Dias;
						xpto.Estoque = oList[t].Estoque;
						xpto.Capacidade = oList[t].Capacidade;
						xpto.Navios = registroNavioAntigo.Navios;
						xpto.Venda = registroNavioAntigo.Venda;
						oList.splice(t, 0, xpto);
						t = 99999999;
					} else {
						oList[t].Navios = registroNavioAntigo.Navios;
						oList[t].Venda = registroNavioAntigo.Venda;
						t = 99999999;
					}
				}
			}

			// =======================================================================
			// =======================================================================
			//
			//					  Fazer a recontagem do estoque
			//
			// =======================================================================
			// =======================================================================
			for (i = 0; i < oList.length; i++) {
				if (i == 0) {
					//do nothing
					if (oList[i].Venda.length > 0) {
						if (i !== 0) {
							if (oList[i].Dias != oList[(i - 1)].Dias) {
								if (oList[i].Dias == oList[(i + 1)].Dias) {
									qtdeTotVendas = 0;
									for (var j = i; j < oList.length; j++) {
										if (oList[j].Dias == oList[i].Dias) {
											qtdeTotVendas += parseInt(oList[j].Venda);
										} else {
											j = 999999999;
										}
									}
									oList[i].Estoque = parseInt(entradaEstoque[(oList[i].Dias - 1)].Entrada) + parseInt(oList[(i - 1)].Estoque) - qtdeTotVendas;
								} else {
									oList[i].Estoque = parseInt(oList[(i - 1)].Estoque) + parseInt(entradaEstoque[parseInt((oList[i].Dias) - 1)].Entrada) -
										parseInt(oList[i].Venda);
								}
							} else {
								oList[i].Estoque = oList[(i - 1)].Estoque;
							}

						} else {
							if (oList[i].Dias == oList[(i + 1)].Dias) {
								qtdeTotVendas = 0;
								for (var j = i; j < oList.length; j++) {
									if (oList[j].Dias == oList[i].Dias) {
										qtdeTotVendas += parseInt(oList[j].Venda);
									} else {
										j = 999999999;
									}
								}
								oList[i].Estoque = parseInt(oList[(i)].Estoque) - qtdeTotVendas;
							} else {
								oList[i].Estoque = parseInt(oList[(i)].Estoque) - parseInt(oList[i].Venda);
							}
						}
					} else {
						//oList[i].Estoque = parseInt(entradaEstoque[oList[i].Dias - 1].Entrada) + parseInt(oList[(i - 1)].Estoque);

						// teste
						if (registroNavioAntigo.Dias == "01") {
							oList[i].Estoque = parseInt(oList[i].Estoque) + parseInt(registroNavioAntigo.Venda);
						}
					}
				} else {
					if (oList[i].Venda.length > 0) {
						if (oList[i].Dias != oList[(i - 1)].Dias) {
							if (oList[i].Dias == oList[(i + 1)].Dias) {
								qtdeTotVendas = 0;
								for (var j = i; j < oList.length; j++) {
									if (oList[j].Dias == oList[i].Dias) {
										qtdeTotVendas += parseInt(oList[j].Venda);
									} else {
										j = 999999999;
									}
								}
								oList[i].Estoque = parseInt(entradaEstoque[(oList[i].Dias - 1)].Entrada) + parseInt(oList[(i - 1)].Estoque) - qtdeTotVendas;
							} else {
								oList[i].Estoque = parseInt(entradaEstoque[(oList[i].Dias - 1)].Entrada) + parseInt(oList[(i - 1)].Estoque) - parseInt(oList[i]
									.Venda);
							}
						} else {
							oList[i].Estoque = oList[(i - 1)].Estoque;
						}
					} else {
						oList[i].Estoque = parseInt(entradaEstoque[oList[i].Dias - 1].Entrada) + parseInt(oList[(i - 1)].Estoque);
					}
				}
				oList[i].Estoque = oList[i].Estoque.toString();
			}

			this.getView().getModel("staticDataModel").setData({
				"LineChart": data.binding.oList
			}, true);

			this.oBindingParameters = {
				"path": "/LineChart",
				"parameters": {},
				"model": "staticDataModel"
			};
			this.getView().byId(
					"LineChart")
				.bindData(this.oBindingParameters);
			var aDimensions = this.getView().byId(
					"LineChart")
				.getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			sap.m.MessageToast.show('Grafico atualizado com sucesso!');
			this.onInsertButtons();
		},
		onSliderLiveChange: function(oEvent) {
			var date = oEvent.getSource().getValue();
			this.byId("titleSliderDate").setText("Dia: " + date);
		},
		onPressResetar: function(oEvent) {
			this.getView().getController().iniciaGrafico();
			this.onInsertButtons();
		},
		onToggleButtonPress: function(oEvent) {
			var tButton = this.byId("toggleButton");
			var VizProp = this.byId("LineChart").getVizProperties();
			switch (tButton.getPressed()) {
				case true:
					VizProp.legend.visible = true;
					break;
				case false:
					VizProp.legend.visible = false;
					break;
			}
			this.byId("LineChart").setVizProperties(VizProp);
		},
		onPressSimularEntrada: function() {
			var rangedate = sap.ui.getCore().getModel("dataGrafico");
			var firstDay = new Date(rangedate.dtini.substring(0, 4), (parseInt(rangedate.dtini.substring(4, 6)) - 1), rangedate.dtini.substring(
				6, 8));
			var lastDay = new Date(rangedate.dtfim.substring(0, 4), (parseInt(rangedate.dtfim.substring(4, 6)) - 1), rangedate.dtfim.substring(
				6, 8));

			// firstDay = new Date('2018', '01', '01');
			// lastDay = new Date('2018', '01', '28');
			var controller = this;
			var oDialog = new sap.m.Dialog({
				title: "Calcular entrada",
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
										text: "Escolha a data inicial:",
										width: "100%",
										textAlign: sap.ui.core.TextAlign.Center
									}),
									new sap.m.DatePicker({
										minDate: firstDay,
										maxDate: lastDay
									}),
									new sap.m.Text({
										text: "",
										width: "20px",
										maxLines: 1,
										wrapping: false,
										textAlign: "Begin",
										textDirection: "Inherit"
									}),
									new sap.m.Text({
										text: "Quantidade de entrada diária:",
										maxLines: 1,
										wrapping: false,
										textAlign: "Begin",
										textDirection: "Inherit"
									}),
									new sap.m.Input({
										type: "Number",
										placeholder: "2500",
										minLength: 1,
										maxLength: 15,
										liveChange: function(oEvent) {
											var value = oEvent.getSource().getValue();
											if (value < 0) {
												oEvent.getSource().setValue(0);
											}
										}
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
				text: "Simular",
				type: "Accept",
				press: function() {
					if (this.getParent().getContent()[1].getItems()[0].getContent()[1].getValue() != "") {
						if (this.getParent().getContent()[1].getItems()[0].getContent()[4].getValue() != "") {
							sap.ui.getCore().setModel(this.getParent().getContent()[1].getItems()[0].getContent()[1].getValue(), "dataIniEntrada");
							sap.ui.getCore().setModel(this.getParent().getContent()[1].getItems()[0].getContent()[4].getValue(), "valorEntrada");
							controller.simularEntradaEstoque();
							oDialog.close();
							oDialog.destroy();
							sap.m.MessageToast.show('Entrada simulada com sucesso');
						} else {
							sap.m.MessageToast.show('Escolha um valor para simular');
						}
					} else {
						sap.m.MessageToast.show('Escolha um dia');
					}
				}
			}));
			oDialog.addButton(new sap.m.Button({
				text: "Cancelar",
				press: function() {
					oDialog.close();
					oDialog.destroy();
				}
			}));
			oDialog.open();
		},
		simularEntradaEstoque: function() {

			var dataSimular = sap.ui.getCore().getModel("dataIniEntrada");
			var valorEntrada = sap.ui.getCore().getModel("valorEntrada");
			dataSimular = parseInt(dataSimular.substring(0, 2));
			var i;
			var oChart = this.byId("LineChart");
			var data = oChart.getBindingInfo("data");
			var oList = data.binding.oList;
			var entradaEstoque = [];
			var dia;
			var entrada;
			var flag = "add";
			var qtdeTotVendas = 0;
			var registroNavioAntigo = {
				Navios: "",
				Venda: ""
			};

			function dateDimensionFormatter(dimensionValue) {
				if (dimensionValue instanceof Date) {
					var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
						style: "full"
					});
					return oFormat.format(dimensionValue);
				}
				return dimensionValue;
			}

			// =======================================================================
			// =======================================================================
			//
			//						Calcular Estoque Normal
			//
			// =======================================================================
			// =======================================================================
			for (i = 0; i < oList.length; i++) {
				flag = "add";
				qtdeTotVendas = 0;
				//Se o dia for diferente de 1
				if (oList[i].Dias > 1) {
					//Verifica se existe venda (caso exista venda pode se ter mais de 1 registro no mesmo dia)
					if (oList[i].Venda.length > 0) {
						//Caso o dia do registro corrente for diferente do dia dia do registro de ontem: calcular a quantidade de entrada;
						if (oList[i].Dias != oList[(i - 1)].Dias) {
							//For de verificação do dia de amanha, caso o dia seja igual somar os registro de venda
							if (oList[i].Dias == oList[(i + 1)].Dias) {
								for (var y = i; y < oList.length; y++) {
									//Se os dias forem iguais somar a quantidade de venda.
									if (oList[i].Dias == oList[y].Dias) {
										qtdeTotVendas += parseInt(oList[y].Venda);
									}
									//Caso contrario sair do loop;
									else {
										y = 9999999999;
									}
								}
								// Estoque de hoje + a qtde total de vendas do dia - o estoque de ontem;
								entrada = parseInt(oList[i].Estoque) + qtdeTotVendas - parseInt(oList[(i - 1)].Estoque);
							} else {
								// Estoque de hoje +  a qtde de venda - o estoque de ontem;
								entrada = parseInt(oList[i].Estoque) + parseInt(oList[i].Venda) - parseInt(oList[(i - 1)].Estoque);
							}
						} else {
							//como ja existe o dia não colocar novamente.
							flag = "notAdd";
							// entrada = entradaEstoque[(i - 1)].Entrada;
						}
					} else {
						entrada = parseInt(oList[i].Estoque) - parseInt(oList[(i - 1)].Estoque);
					}

				} else {
					entrada = "0";
				}
				if (flag == "add") {
					dia = oList[i].Dias;
					entradaEstoque.push({
						Dia: dia.toString(),
						Entrada: entrada.toString()
					});
				}
			}

			// =======================================================================
			// =======================================================================
			//
			//						Forçar valor de entrada Calcular 
			//
			// =======================================================================
			// =======================================================================
			for (i = 0; i < entradaEstoque.length; i++) {
				//Se o dia for diferente de 1
				if (entradaEstoque[i].Dia >= dataSimular) {
					entrada = valorEntrada;
					entradaEstoque[i].Entrada = entrada.toString();
				} else {
					//como ja existe o dia não colocar novamente.
					flag = "notModify";
					// entrada = entradaEstoque[(i - 1)].Entrada;
				}

			}

			// =======================================================================
			// =======================================================================
			//
			//					  Fazer a recontagem do estoque
			//
			// =======================================================================
			// =======================================================================
			for (i = 0; i < oList.length; i++) {
				if (oList[i].Dias == 1) {

					if (oList[i].Venda.length > 0) {
						if (i !== 0) {
							if (oList[i].Dias != oList[(i - 1)].Dias) {
								if (oList[i].Dias == oList[(i + 1)].Dias) {
									qtdeTotVendas = 0;
									for (var j = i; j < oList.length; j++) {
										if (oList[j].Dias == oList[i].Dias) {
											qtdeTotVendas += parseInt(oList[j].Venda);
										} else {
											j = 999999999;
										}
									}
									oList[i].Estoque = parseInt(entradaEstoque[(oList[i].Dias - 1)].Entrada) + parseInt(oList[(i - 1)].Estoque) - qtdeTotVendas;
								} else {
									oList[i].Estoque = parseInt(oList[(i - 1)].Estoque) + parseInt(entradaEstoque[parseInt((oList[i].Dias) - 1)].Entrada) -
										parseInt(oList[i].Venda);
								}
							} else {
								oList[i].Estoque = oList[(i - 1)].Estoque;
							}

						} else {
							// if (oList[i].Dias == oList[(i + 1)].Dias) {
							// 	qtdeTotVendas = 0;
							// 	for (var j = i; j < oList.length; j++) {
							// 		if (oList[j].Dias == oList[i].Dias) {
							// 			qtdeTotVendas += parseInt(oList[j].Venda);
							// 		} else {
							// 			j = 999999999;
							// 		}
							// 	}
							oList[i].Estoque = parseInt(entradaEstoque[parseInt(oList[i].Dias - 1)].Entrada) + parseInt(oList[i].Estoque);
							// } else {
							// 	oList[i].Estoque = parseInt(oList[(i)].Estoque) - parseInt(oList[i].Venda);
							// }
						}
					} else {
						//oList[i].Estoque = parseInt(entradaEstoque[oList[i].Dias - 1].Entrada) + parseInt(oList[(i - 1)].Estoque);
						oList[i].Estoque = parseInt(oList[i].Estoque);
					}

				} else {
					if (oList[i].Venda.length > 0) {
						if (oList[i].Dias != oList[(i - 1)].Dias) {
							if (oList[i].Dias == oList[(i + 1)].Dias) {
								qtdeTotVendas = 0;
								for (var j = i; j < oList.length; j++) {
									if (oList[j].Dias == oList[i].Dias) {
										qtdeTotVendas += parseInt(oList[j].Venda);
									} else {
										j = 999999999;
									}
								}
								oList[i].Estoque = parseInt(entradaEstoque[(oList[i].Dias - 1)].Entrada) + parseInt(oList[(i - 1)].Estoque) - qtdeTotVendas;
							} else {
								oList[i].Estoque = parseInt(oList[(i - 1)].Estoque) + parseInt(entradaEstoque[parseInt((oList[i].Dias) - 1)].Entrada) -
									parseInt(oList[i].Venda);
							}
						} else {
							oList[i].Estoque = oList[(i - 1)].Estoque;
						}
					} else {
						oList[i].Estoque = parseInt(entradaEstoque[oList[i].Dias - 1].Entrada) + parseInt(oList[(i - 1)].Estoque);
					}
				}
				oList[i].Estoque = oList[i].Estoque.toString();
			}

			this.getView().getModel("staticDataModel").setData({
				"LineChart": data.binding.oList
			}, true);

			this.oBindingParameters = {
				"path": "/LineChart",
				"parameters": {},
				"model": "staticDataModel"
			};
			this.getView().byId(
					"LineChart")
				.bindData(this.oBindingParameters);
			var aDimensions = this.getView().byId(
					"LineChart")
				.getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			sap.m.MessageToast.show('Grafico atualizado com sucesso!');
			this.onInsertButtons();
		}
	});
}, /* bExport= */ true);