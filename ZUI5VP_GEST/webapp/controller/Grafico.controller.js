sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"monitorPortocel/webServices/apiConnector",
	"sap/ui/export/Spreadsheet",
	"sap/ui/model/json/JSONModel",
	"sap/ui/table/RowSettings"
], function(Controller, apiConnector, Spreadsheet, JSONModel, RowSettings) {
	"use strict";

	return Controller.extend("monitorPortocel.controller.Grafico", {

		onPressGoMapa: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("mapa", {}, true);
		},

		formatDateUTCtoLocale: function(dDate) {
			if (dDate) {
				return new Date(dDate.getUTCFullYear(), dDate.getUTCMonth(), dDate.getUTCDate());
			}
			return dDate;
		},

		applyFiltersAndSorters: function(sControlId, sAggregationName) {
			var oBindingInfo = this.getView().byId(sControlId).getBindingInfo(sAggregationName);
			var oBindingOptions = this.updateBindingOptions(sControlId);
			this.getView().byId(sControlId).bindAggregation(sAggregationName, {
				model: oBindingInfo.model,
				path: oBindingInfo.path,
				parameters: oBindingInfo.parameters,
				template: oBindingInfo.template,
				templateShareable: true,
				sorter: oBindingOptions.sorters,
				filters: oBindingOptions.filters
			});
		},
		
		onCarregaFiltros: function() {
			// var me = this;

			// var aFilters = [];
			// aFilters.push(new sap.ui.model.Filter({
			// 	path: "CentroOrigem",
			// 	operator: sap.ui.model.FilterOperator.Contains,
			// 	value1: "3070"
			// }));

			// var stringParam = "/ZET_VPWM_ETAPAS_TRPSET";
			// apiConnector.consumeModel(stringParam, aFilters, {},
			// 	function(oData, oResponse) {
			// 		var json = new sap.ui.model.json.JSONModel();
			// 		json.setData(oData.results);
			// 		me.getView().setModel(json, "etapa");
			// 	},
			// 	function(err) {

			// 	});
		},
		
		onExit: function() {
			clearInterval(window.timerGrafico);
		},
		
		/* onIniciaTimer: function() {
			var controller = this;
			var qtde = 0;
			window.timerGrafico = setInterval(function() {
				somaTempo();
			}, 1000);
			function somaTempo() {
				if (qtde == 240) {
					controller.onCarregaGrafico();
					qtde = 0;
				}
				qtde++;
			}
		}, */
		
		onInit: function() {
			var oView = this.getView();
			oView.setBusyIndicatorDelay(1);
			oView.setBusy(true);
			var viewCarregou = 0;
			//var controller = this;
			if (sap.ui.Device.system.phone) {
				/*this.getView().byId("colunaMotorista").setWidth("100px");
				this.getView().byId("colunaCod").setWidth("100px");
				this.getView().byId("colunaEtapa").setWidth("100px");
				this.getView().byId("colunaComp").setWidth("100px");
				this.getView().byId("colunaPlcCavalo").setWidth("100px");
				this.getView().byId("colunaPlcCar1").setWidth("100px");
				this.getView().byId("colunaPlcCar2").setWidth("100px");
				this.getView().byId("colunaOrigem").setWidth("100px");
				this.getView().byId("colunaDestino").setWidth("100px");*/

				this.getView().byId("flexbox").setDirection("Column");
				this.getView().byId("vboxVizMeta").setWidth("100%");
				this.getView().byId("vboxVizMeta").addStyleClass("sapUiSmallMarginBegin");
				this.getView().byId("vboxVizGrafico").setWidth("100%");
				this.getView().byId("vboxVizGrafico").addStyleClass("sapUiSmallMarginBegin");
			}

			oView.addEventDelegate({
				onBeforeShow: function(oEvent) {
					// seu codigo aqui
					//this.onCarregaGrafico();
					clearInterval(window.timerGrafico);
					//controller.onIniciaTimer();
					//this.onCarregaFiltros();
				}
			}, this);

			var firstDate = new Date();
			firstDate.setDate(firstDate.getDate() - 1);
			var firstYear = new Date();
			firstYear.setFullYear(firstYear.getFullYear() - 5);
			var lastYear = new Date();
			lastYear.setFullYear(lastYear.getFullYear() + 1);

			var jsonData = new sap.ui.model.json.JSONModel();
			jsonData.setData({
				dateValueDRS2: firstDate,
				secondDateValueDRS2: new Date(),
				dateMinDRS2: firstYear,
				dateMaxDRS2: lastYear
			});
			this.getView().setModel(jsonData, "dateRange");

			var stringParam = "/ZET_VPWM_CENTRO_DESCRICAOSSET";
			apiConnector.consumeModel(stringParam, {}, {},
				function(oData, oResponse) {

					viewCarregou++;
					if (viewCarregou === 2) {
						oView.setBusy(false);
					}
					var json = new sap.ui.model.json.JSONModel();
					json.setData(oData.results);
					oView.setModel(json, "centros");

				},
				function(err) {
					viewCarregou++;
					if (viewCarregou === 2) {
						oView.setBusy(false);
					}
					sap.m.MessageToast.show("Erro");
				});

			var aFilter = [];
			aFilter.push(new sap.ui.model.Filter({
				path: "CentroOrigem",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "3070"
			}));
			stringParam = "/ZET_VPWM_DESTINOSET";
			apiConnector.consumeModel(stringParam, aFilter, {},
				function(data, response) {
					viewCarregou++;
					if (viewCarregou === 2) {
						oView.setBusy(false);
					}
					var model = new sap.ui.model.json.JSONModel();
					model.setData(data.results);
					oView.setModel(model, "destinos");
				},
				function(err) {
					viewCarregou++;
					if (viewCarregou === 2) {
						oView.setBusy(false);
					}
					sap.m.MessageToast.show("Erro");
				}
			);
			var oTable = this.byId("tableMotoristas");
			var oTemplate = oTable.getRowActionTemplate();
			//oTemplate.destroy();
			//oTemplate = null;
			var fnPress = this.handleActionPress.bind(this);
			oTemplate = new sap.ui.table.RowAction({items: [
						new sap.ui.table.RowActionItem({
							type: "Navigation",
							press: fnPress,
							visible: "{Available}"
						})
					]});
			
			//var oVizFrame = this.getView().byId("vboxVizGrafico");
			/*oVizFrame.setProperties({
                plotArea: {
                    dataLabel: {
                        visible: false
                    }
                }
            });*/

			oTable.setRowActionTemplate(oTemplate);
			oTable.setRowActionCount(1);
		},

		onCarregaGrafico: function() {
			var oView = this.getView();
			//var oModel = new sap.ui.model.json.JSONModel();
			//oView.setModel(oModel, "staticDataModel");

			if (this.byId("cb_Destino").getSelectedItem()) {
				this.byId("vboxVizGrafico").setBusyIndicatorDelay(1);
				this.byId("vboxVizGrafico").setBusy(true);

				this.byId("vboxVizMeta").setBusyIndicatorDelay(1);
				this.byId("vboxVizMeta").setBusy(true);

				this.byId("tableMotoristas").setBusyIndicatorDelay(1);
				this.byId("tableMotoristas").setBusy(true);

				var centroOrigem = this.byId("cb_CentroOri").getSelectedItem().getKey();
				var destinos = this.byId("cb_Destino").getSelectedItem().getKey().split("/");
				var centroDestino = destinos[0];
				var depositoDestino = destinos[1];

				var dia1 = this.byId("dateRange").getDateValue().getDate();
				var mes1 = this.byId("dateRange").getDateValue().getMonth() + 1;
				var ano1 = this.byId("dateRange").getDateValue().getFullYear();
				if (dia1 < 10) {
					dia1 = "0" + dia1;
				}
				if (mes1 < 10) {
					mes1 = "0" + mes1;
				}
				var primeiraData = "" + ano1 + mes1 + dia1;

				var dia2 = this.byId("dateRange").getSecondDateValue().getDate();
				var mes2 = this.byId("dateRange").getSecondDateValue().getMonth() + 1;
				var ano2 = this.byId("dateRange").getSecondDateValue().getFullYear();
				if (dia2 < 10) {
					dia2 = "0" + dia2;
				}
				if (mes2 < 10) {
					mes2 = "0" + mes2;
				}
				var segundaData = "" + ano2 + mes2 + dia2;

				var me = this;
				var aFilters = [];
				aFilters.push(new sap.ui.model.Filter({
					path: "CentroOrigem",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: centroOrigem
				}));

				aFilters.push(new sap.ui.model.Filter({
					path: "CentroDestino",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: centroDestino
				}));

				aFilters.push(new sap.ui.model.Filter({
					path: "DepositoDestino",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: depositoDestino
				}));

				var stringParam = "/ZET_VPWM_QUANTIDADE_ETAPASet";
				apiConnector.consumeModel(stringParam, aFilters, {},
					function(oData, oResponse) {
						me.byId("vboxVizGrafico").setBusy(false);
						var jsonMapa = new sap.ui.model.json.JSONModel();
						jsonMapa.setData(oData.results);
						oView.setModel(jsonMapa, "graficoEtapa");
						oView.getModel("graficoEtapa").refresh();
					},
					function(err) {
						me.byId("vboxVizGrafico").setBusy(false);
					}
				);

				var novoFilter = [];
				novoFilter.push(new sap.ui.model.Filter({
					path: "CentroOrigem",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: centroOrigem
				}));
				novoFilter.push(new sap.ui.model.Filter({
					path: "CentroDestino",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: centroDestino
				}));
				novoFilter.push(new sap.ui.model.Filter({
					path: "DepositoDestino",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: depositoDestino
				}));
				novoFilter.push(new sap.ui.model.Filter({
					path: "Data",
					operator: sap.ui.model.FilterOperator.BT,
					value1: primeiraData,
					value2: segundaData
				}));

				stringParam = "/ZET_VPWM_CARREGANDO_COMPSET";
				apiConnector.consumeModel(stringParam, novoFilter, {},
					function(oData1, oResponse) {
						me.byId("tableMotoristas").setBusy(false);
						var model1 = new JSONModel();
						model1.setData(oData1);
						oView.setModel(model1);
					},
					function(err) {
						me.byId("tableMotoristas").setBusy(false);
						sap.m.MessageToast.show("Erro");
					}
				);

				stringParam = "/ZET_VPWM_CICLOSSET";
				apiConnector.consumeModel(stringParam, novoFilter, {},
					function(oData, oResponse) {
						me.byId("vboxVizMeta").setBusy(false);
						var json = new sap.ui.model.json.JSONModel();
						json.setData(oData.results);
						oView.setModel(json, "graficoMeta");
					},
					function(err) {
						me.byId("vboxVizMeta").setBusy(false);
					}
				);

			} else {
				sap.m.MessageToast.show("Escolha o destino");
			}
		},

		onChangeCentro: function() {
			var centro = this.byId("cb_CentroOri").getSelectedItem().getKey();
			var oView = this.getView();
			var aFilter = [];
			aFilter.push(new sap.ui.model.Filter({
				path: "CentroOrigem",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: centro
			}));

			var stringParam = "/ZET_VPWM_DESTINOSET";
			apiConnector.consumeModel(stringParam, aFilter, {},
				function(oData, oResponse) {
					var json = new sap.ui.model.json.JSONModel();
					json.setData(oData.results);
					oView.setModel(json, "destinos");
				},
				function(err) {
					sap.m.MessageToast.show("Erro");
				});
		},

		onSelectMeta: function(oEvent) {
			var fatiaClicada = oEvent.getParameter("data")[0].data._context_row_number;
			var model = this.getView().getModel("graficoMeta");

			var dia1 = this.byId("dateRange").getDateValue().getDate();
			var mes1 = this.byId("dateRange").getDateValue().getMonth() + 1;
			var ano1 = this.byId("dateRange").getDateValue().getFullYear();
			if (mes1 < 10) {
				mes1 = "0" + mes1;
			}
			if (dia1 < 10) {
				dia1 = "0" + dia1;
			}
			var primeiraData = "" + ano1 + mes1 + dia1;

			var dia2 = this.byId("dateRange").getSecondDateValue().getDate();
			var mes2 = this.byId("dateRange").getSecondDateValue().getMonth() + 1;
			var ano2 = this.byId("dateRange").getSecondDateValue().getFullYear();
			if (dia2 < 10) {
				dia2 = "0" + dia2;
			}
			if (mes2 < 10) {
				mes2 = "0" + mes2;
			}
			var segundaData = "" + ano2 + mes2 + dia2;

			var destinos = this.byId("cb_Destino").getSelectedItem().getKey().split("/");
			var params = {
				centroOrigem: this.byId("cb_CentroOri").getSelectedItem().getKey(),
				centroDestino: destinos[0],
				depositoDestino: destinos[1],
				primeiraData: primeiraData,
				segundaData: segundaData,
				acimaDaMedia: model.oData[fatiaClicada].AcimaDaMedia
			};

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("detalhesmeta", {}, true);

			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.publish("dadosMeta", "meta", params);
		},

		createColumnConfig: function() {
			return [{
				label: "Status",
				property: "Status",
				type: "String"
			},{
				label: "Texto Status",
				property: "StatusText",
				type: "String"
			},{
				label: "Motorista",
				property: "NomeMotorista",
				width: "25"
			},{
				label: "Usuário",
				property: "UsuarioMot",
				type: "String"
			},{
				label: "Cod.WAS.Motorista",
				property: "CodMotorista",
				type: "String"
			}, {
				label: "Composição",
				property: "Composicao",
				type: "String"
			}, {
				label: "Placa Cavalo",
				property: "PlcCavalo",
				type: "String"
			}, {
				label: "Placa Carreta 1",
				property: "PlcCarr1",
				type: "String"
			}, {
				label: "Placa Carreta 2",
				property: "PlcCarr2",
				type: "String"
			},{
				label: "Centro Origem",
				property: "CentroOrigem",
				type: "String"
			}, {
				label: "Origem",
				property: "Des_Origem",
				type: "String"
			},{
				label: "Centro Destino",
				property: "CentroDestino",
				type: "String"
			},{
				label: "Depósito Destino",
				property: "DepositoDestino",
				type: "String"
			}, {
				label: "Destino",
				property: "Des_Destino",
				type: "String"
			},{
				label: "Data Início",
				property: "DtInicio",
				type: "String"
			},{
				label: "Hora Início",
				property: "HrInicio",
				type: "String"
			},{
				label: "Data Fim",
				property: "DtFim",
				type: "String"
			},{
				label: "Hora Fim",
				property: "HrFim",
				type: "String"
			},{
				label: "Tempo Ciclo (Min.)",
				property: "TempoMin",
				type: "String"
			},{
				label: "Meta Ciclo (Min.)",
				property: "MetaMin",
				type: "String"
			}, {
				label: "Etapa",
				property: "Etapa",
				type: "String"
			}, {
				label: "Descr. Etapa",
				property: "DescrEtapa",
				type: "String"
			}, {
				label: "Cód. Viagem",
				property: "Viagem",
				type: "String"
			},{
				label: "Ciclo Excluído",
				property: "Excluido",
				type: "String"
			}];
		},

		onExportTableMotoristas: function() {
			
			this.byId("tableMotoristas").setBusyIndicatorDelay(1);
			this.byId("tableMotoristas").setBusy(true);
			this.getView().setBusyIndicatorDelay(1);
			this.getView().setBusy(true);

			if (this.getView().getModel()) {
				
				var aCols, oSettings, oSheet, iniFilename;
				var aIndices = this.byId("tableMotoristas").getSelectedIndices();
				var aProducts = [];

				if (aIndices.length > 0) {
					var auxProducts = this.getView().getModel().getProperty('/').results;
					var destinos = this.byId("cb_Destino").getSelectedItem().getKey().split("/");
					for(var i = 0; i < aIndices.length; i++) {
						var params = {
							centroOrigem: this.byId("cb_CentroOri").getSelectedItem().getKey(),
							centroDestino: destinos[0],
							depositoDestino: destinos[1],
							cdMotorista: auxProducts[aIndices[i]].CodMotorista,
							dtInicio: auxProducts[aIndices[i]].DtInicio.substr(6, 4) + auxProducts[aIndices[i]].DtInicio.substr(3, 2) + auxProducts[aIndices[i]].DtInicio.substr(0, 2),
							hrInicio: auxProducts[aIndices[i]].HrInicio.substr(0, 2) + auxProducts[aIndices[i]].HrInicio.substr(3, 2) + auxProducts[aIndices[i]].HrInicio.substr(6, 2),
							dtFim: auxProducts[aIndices[i]].DtFim.substr(6, 4) + auxProducts[aIndices[i]].DtFim.substr(3, 2) + auxProducts[aIndices[i]].DtFim.substr(0, 2),
							hrFim: auxProducts[aIndices[i]].HrFim.substr(0, 2) + auxProducts[aIndices[i]].HrFim.substr(3, 2) + auxProducts[aIndices[i]].HrFim.substr(6, 2),
							composicao: auxProducts[aIndices[i]].Composicao,
							viagem: auxProducts[aIndices[i]].Viagem,
							Status: auxProducts[aIndices[i]].Status,
							StatusText: auxProducts[aIndices[i]].StatusText,
							Excluido: auxProducts[aIndices[i]].Excluido,
							Alterado: auxProducts[aIndices[i]].Alterado
						};
						this.getEtapasCiclo(params);
						if (this.oDataEtapasCiclo.results) {
							for (var j = 0; j < this.oDataEtapasCiclo.results.length; j++) {
								aProducts.push(this.oDataEtapasCiclo.results[j]);
							}
						}
					}
					aCols = sap.ui.controller("monitorPortocel.controller.ListaViagens").createColumnConfig();
					iniFilename = "DetalheCiclo_";
				} else {
					aProducts = this.getView().getModel().getProperty('/').results;
					aCols = this.createColumnConfig();
					iniFilename = "Viagens_";
				}

					/*var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "YYYYMMDDHHmmss" });
					var now = Date();
					var exportDateTime = dateFormat.format(now);*/
				
				if (aProducts) {
					oSettings = {
						workbook: {
							columns: aCols
						},
						dataSource: aProducts,
						fileName: iniFilename + Date()
					};
					oSheet = new Spreadsheet(oSettings);
					oSheet.build()
					    .then( function() {
	  						sap.m.MessageToast.show("Planilhar exportada com sucesso");
					    })
					    .catch( function(sMessage) {
	  						sap.m.MessageToast.show("Erro ao exportar: " + sMessage);
					    })
						.finally(function() {
							oSheet.destroy();
						});
				} else {
					sap.m.MessageToast.show("Não há dados para exportar");
				}
			} else {
				sap.m.MessageToast.show("Não há dados para exportar");
			}
			this.getView().setBusy(false);
			this.byId("tableMotoristas").setBusy(false);
		},

		handleActionPress: function(oEvent){
			var oRow = oEvent.getParameter("row");
			var oItem = oEvent.getParameter("item");
			sap.m.MessageToast.show("Item " + (oItem.getText() || oItem.getType()) + " pressionado para o motorista " +
				this.getView().getModel().getProperty("NomeMotorista", oRow.getBindingContext()));
			
			var destinos = this.byId("cb_Destino").getSelectedItem().getKey().split("/");
			var params = {
				centroOrigem: this.byId("cb_CentroOri").getSelectedItem().getKey(),
				centroDestino: destinos[0],
				depositoDestino: destinos[1],
				cdMotorista: this.getView().getModel().getProperty("CodMotorista", oRow.getBindingContext()),
				dtInicio: this.getView().getModel().getProperty("DtInicio", oRow.getBindingContext()),
				hrInicio: this.getView().getModel().getProperty("HrInicio", oRow.getBindingContext()),
				dtFim: this.getView().getModel().getProperty("DtFim", oRow.getBindingContext()),
				hrFim: this.getView().getModel().getProperty("HrFim", oRow.getBindingContext()),
				composicao: this.getView().getModel().getProperty("Composicao", oRow.getBindingContext()),
				viagem: this.getView().getModel().getProperty("Viagem", oRow.getBindingContext()),
				Status: this.getView().getModel().getProperty("Status", oRow.getBindingContext()),
				StatusText: this.getView().getModel().getProperty("StatusText", oRow.getBindingContext()),
				Excluido: this.getView().getModel().getProperty("Excluido", oRow.getBindingContext()),
				Alterado: this.getView().getModel().getProperty("Alterado", oRow.getBindingContext())
			};

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("listaviagens", {}, true);

			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.publish("dadosViagem", "viagem", params);

		},

/*		onColumnWidthsChange : function(oEvent) {
			var sColumnWidthMode = oEvent ? oEvent.getParameter("key") : "Static";
			var oWidthData;

			if (sColumnWidthMode == "Flexible") {
				oWidthData = {
					NomeMotorista: "40%",
					Composicao: "15%",
					TempoMin: "10%",
					MetaMin: "10%",
					StatusText: "25%"
				};
			} else {
				oWidthData = {
					NomeMotorista: sColumnWidthMode == "Mixed" ? "20%" : "13rem",
					Composicao: "11rem",
					TempoMin: "7rem",
					MetaMin: "6rem",
					StatusText: "11rem"
				};
			}

			this.getView().getModel().setProperty("/widths", oWidthData);
		},
*/		
		onSetRowCount: function(oEvent) {
			
			this.byId("tableMotoristas").setVisibleRowCountMode(oEvent.getSource().getProperty("key"));
			switch (oEvent.getSource().getProperty("key")) {
				case "Fixed":
					if(this.getView().getModel()) {
						this.byId("tableMotoristas").setVisibleRowCount(this.getView().getModel().getProperty('/').results.length);
					}
				case "Interactive":
					this.byId("tableMotoristas").setMinAutoRowCount(this.byId("tableMotoristas").getVisibleRowCount());
					break;
				case "Auto":
					this.byId("tableMotoristas").setMinAutoRowCount(5);
					break;
			}
		},

/*		onColumnResize : function(oEvent) {
			var oColumn = oEvent.getParameter("column");

			if (this.byId("deliverydate") == oColumn) {
				oEvent.preventDefault();
			} else {
				this._messageBuffer.push("Column '" + oColumn.getLabel().getText() + "' was resized to " + oEvent.getParameter("width") + ".");
				if (this._messageTimer) {
					jQuery.sap.clearDelayedCall(this._messageTimer);
				}
				this._messageTimer = jQuery.sap.delayedCall(50, this, function(){
					sap.m.MessageToast.show(this._messageBuffer.join("\n"));
					this._messageBuffer = [];
					this._messageTimer = null;
				});
			}
		}*/

		getEtapasCiclo: function(params, oDataResp) {

			var aFilter = [];
			aFilter.push(new sap.ui.model.Filter({
				path: "CentroOrigem",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: params.centroOrigem
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "CentroDestino",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: params.centroDestino
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "DepositoDestino",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: params.depositoDestino
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "CodMotorista",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: params.cdMotorista
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "DtInicio",
				operator: sap.ui.model.FilterOperator.GE,
				value1: params.dtInicio
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "HrInicio",
				operator: sap.ui.model.FilterOperator.GE,
				value1: params.hrInicio
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "DtFim",
				operator: sap.ui.model.FilterOperator.LE,
				value1: params.dtFim
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "HrFim",
				operator: sap.ui.model.FilterOperator.LE,
				value1: params.hrFim
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "Composicao",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: params.composicao
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "Viagem",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: params.viagem
			}));
			var me = this;
			var stringParam = "/ZET_VPWM_LISTA_ETAPAS_TRPSET";
			apiConnector.consumeAsync(stringParam, aFilter, {},
				function(oData, oResponse) {
					me.oDataEtapasCiclo = oData;
				},
				function(err) {
					me.oDataEtapasCiclo = false;
				},
				false);
		}
	});
});