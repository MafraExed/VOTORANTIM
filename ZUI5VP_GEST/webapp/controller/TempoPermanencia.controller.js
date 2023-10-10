sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/export/Spreadsheet",
	"monitorPortocel/webServices/apiConnector"
], function(Controller, Spreadsheet, apiConnector) {
	"use strict";

	return Controller.extend("monitorPortocel.controller.TempoPermanencia", {
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

		onInit: function() {
			var oView = this.getView();
			oView.setBusyIndicatorDelay(1);
			oView.setBusy(true);
			var viewCarregou = 0;

			var data = new Date();
			var anoFinal = data.getFullYear();
			var mesFinal = data.getMonth();
			var diaFinal = data.getDate();

			data.setDate(data.getDate() - 1);
			var anoInicial = data.getFullYear();
			var mesInicial = data.getMonth();
			var diaInicial = data.getDate();

			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				dateValueDRS2: new Date(anoInicial, mesInicial, diaInicial),
				secondDateValueDRS2: new Date(anoFinal, mesFinal, diaFinal),
				dateMinDRS2: new Date(2010, 0, 1),
				dateMaxDRS2: new Date(anoFinal + 1, 11, 31) // ano limite para o DateRange (ano atual + 1)
			});
			this.getView().setModel(oModel, "dateRange");

			var stringParam = "/ZET_VPWM_CENTRO_DESCRICAOSSET";
			apiConnector.consumeModel(stringParam, {}, {},
				function(oDataCentro, oResponseCentro) {
					viewCarregou++;
					if(viewCarregou === 3){
						oView.setBusy(false);
					}
					
					var jsonCentro = new sap.ui.model.json.JSONModel();
					jsonCentro.setData(oDataCentro.results);
					oView.byId("cb_CentroOri").setModel(jsonCentro, "centros");
				},
				function(err) {
					viewCarregou++;
					if(viewCarregou === 3){
						oView.setBusy(false);
					}
					sap.m.MessageToast.show("Erro Centro");
				});

			var aFilter = [];
			aFilter.push(new sap.ui.model.Filter({
				path: "CentroOrigem",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "3070"
			}));
			stringParam = "/ZET_VPWM_DESTINOSET";
			apiConnector.consumeModel(stringParam, aFilter, {},
				function(oDataDestino, oResponseDestino) {
					viewCarregou++;
					if(viewCarregou === 3){
						oView.setBusy(false);
					}
					var jsonDestino = new sap.ui.model.json.JSONModel();
					jsonDestino.setData(oDataDestino.results);
					oView.byId("cb_Destino").setModel(jsonDestino, "destinos");
				},
				function(err) {
					viewCarregou++;
					if(viewCarregou === 3){
						oView.setBusy(false);
					}
					sap.m.MessageToast.show("Erro Destino");
				});

			var aFilters = [];
			aFilters.push(new sap.ui.model.Filter({
				path: "CentroOrigem",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: "3070"
			}));
			aFilters.push(new sap.ui.model.Filter({
				path: "CentroDestino",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: "3810"
			}));
			aFilters.push(new sap.ui.model.Filter({
				path: "DepositoDestino",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: "1373"
			}));

			stringParam = "/ZET_VPWM_ETAPAS_TRPSET";
			apiConnector.consumeModel(stringParam, aFilters, {},
				function(oDataEtapa, oResponseEtapa) {
					viewCarregou++;
					if(viewCarregou === 3){
						oView.setBusy(false);
					}
					for (var i = 0; i < oDataEtapa.results.length; i++) {
						oDataEtapa.results[i].Etapa = oDataEtapa.results[i].Etapa.trim();
					}

					var jsonEtapa = new sap.ui.model.json.JSONModel();
					jsonEtapa.setData(oDataEtapa.results);
					oView.byId("cb_Etapa").setModel(jsonEtapa, "etapa");
				},
				function(err) {
					viewCarregou++;
					if(viewCarregou === 3){
						oView.setBusy(false);
					}
					sap.m.MessageToast.show("Erro Etapa");
				});

		},

		onDateRangeChange: function(oEvent) {
			var from = oEvent.getParameter("from");
			var to = oEvent.getParameter("to");
		},

		onCarregaGrafico: function() {
			var oView = this.getView();
			var oModel = new sap.ui.model.json.JSONModel();
			oView.setModel(oModel, "staticDataModel");
			
			var centro = this.byId("cb_CentroOri").getSelectedItem();
			var destinos = this.byId("cb_Destino").getSelectedItem();
			if (centro && destinos) {
				centro = centro.getKey();
				destinos = destinos.getKey().split("/");
				var centroDestino = destinos[0];
				var depositoDestino = destinos[1];
				
				this.byId("vboxVizFrame").setBusyIndicatorDelay(1);
				this.byId("vboxVizFrame").setBusy(true);

				var me = this;
				var aFilters = [];
				aFilters.push(new sap.ui.model.Filter({
					path: "CentroOrigem",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: centro
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

				var etapasSelecionadas = this.byId("cb_Etapa").getSelectedItems();
				for (var i = 0; i < etapasSelecionadas.length; i++) {
					aFilters.push(new sap.ui.model.Filter({
						path: "Etapa",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: etapasSelecionadas[i].getKey().trim()
					}));
				}

				aFilters.push(new sap.ui.model.Filter({
					path: "Data",
					operator: sap.ui.model.FilterOperator.BT,
					value1: this.byId("cb_Data").getDateValue().yyyymmdd(),
					value2: this.byId("cb_Data").getSecondDateValue().yyyymmdd()
				}));

				var stringParam = "/ZET_VPWM_MEDIA_ETAPASET";
				apiConnector.consumeModel(stringParam, aFilters, {},
					function(oData, oResponse) {

						/*var meta = 0;
						var contador = 0;
						var listaEtapa = me.getView().byId("cb_Etapa").getModel("etapa").getData();
						var selecionadas = me.byId("cb_Etapa").getSelectedItems();
						for (var j = 0; j < listaEtapa.length; j++) {
							for (var i = 0; i < selecionadas.length; i++) {
								if (listaEtapa[j].Etapa == selecionadas[i].getKey()) {
									meta = parseInt(listaEtapa[j].Metas);
									contador++;
								}
							}
						}
						meta = meta / contador;*/

						for (var i = 0; i < oData.results.length; i++) {
							oData.results[i].TimeStamp = oData.results[i].Data.substring(6, 8) + "/" + oData.results[i].Data.substring(4, 6) + "/" + oData
								.results[
									i].Data.substring(0, 4) + " " + oData.results[i].HoraInicio.substring(0, 2) + ":" + oData.results[i].HoraInicio.substring(2,
									4);
							oData.results[i].Tempo = parseInt(oData.results[i].TempoMedia);
							/*oData.results[i].Meta = meta;*/
						}

						// oView.setModel().setData({
						// 	"graficoTempoFabrica": oData.results
						// }, true);

						var jsonMapa = new sap.ui.model.json.JSONModel();
						jsonMapa.setData(oData.results);
						me.getView().setModel(jsonMapa, "graficoTempoFabrica");
						me.byId("vboxVizFrame").setBusy(false);
					},
					function(err) {
						me.byId("vboxVizFrame").setBusy(false);
					});
			} else {
				sap.m.MessageToast.show("Selecione Origem e Destino");
			}

			// this.oBindingParameters = {
			// 	"path": "/GraficoTempoFabrica",
			// 	"parameters": {},
			// 	"model": "staticDataModel"
			// };

			// oView.byId(
			// 		"GraficoTempoFabrica")
			// 	.bindData(this.oBindingParameters);

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
					oView.byId("cb_Destino").setModel(json, "destinos");
					oView.byId("cb_Destino").getModel("destinos").refresh();
				},
				function(err) {
					sap.m.MessageToast.show("Erro");
				});
				
			var jsonEtapa = new sap.ui.model.json.JSONModel();
			jsonEtapa.setData({});
			oView.byId("cb_Etapa").setModel(jsonEtapa, "etapa");

			/*if (this.byId("cb_Destino").getSelectedItem().getKey()) {
				var destinos = this.byId("cb_Destino").getSelectedItem().getKey().split("/");
				var centroDestino = destinos[0];
				var depositoDestino = destinos[1];

				aFilter = [];
				aFilter.push(new sap.ui.model.Filter({
					path: "CentroOrigem",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: centro
				}));
				aFilter.push(new sap.ui.model.Filter({
					path: "CentroDestino",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: centroDestino
				}));
				aFilter.push(new sap.ui.model.Filter({
					path: "DepositoDestino",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: depositoDestino
				}));

				stringParam = "/ZET_VPWM_ETAPAS_TRPSET";
				apiConnector.consumeModel(stringParam, aFilter, {},
					function(oDataEtapa, oResponseEtapa) {
						for (var i = 0; i < oDataEtapa.results.length; i++) {
							oDataEtapa.results[i].Etapa = oDataEtapa.results[i].Etapa.trim();
						}

						var jsonEtapa = new sap.ui.model.json.JSONModel();
						jsonEtapa.setData(oDataEtapa.results);
						oView.setModel(jsonEtapa, "etapa");
					},
					function(err) {
						sap.m.MessageToast.show("Erro Etapa");
					});
			}*/
		},

		onChangeDestino: function() {
			var centro = this.byId("cb_CentroOri").getSelectedItem().getKey();
			var destinos = this.byId("cb_Destino").getSelectedItem().getKey().split("/");
			var centroDestino = destinos[0];
			var depositoDestino = destinos[1];
			var oView = this.getView();

			var aFilter = [];
			aFilter.push(new sap.ui.model.Filter({
				path: "CentroOrigem",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: centro
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "CentroDestino",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: centroDestino
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "DepositoDestino",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: depositoDestino
			}));

			var stringParam = "/ZET_VPWM_ETAPAS_TRPSET";
			apiConnector.consumeModel(stringParam, aFilter, {},
				function(oDataEtapa, oResponseEtapa) {
					for (var i = 0; i < oDataEtapa.results.length; i++) {
						oDataEtapa.results[i].Etapa = oDataEtapa.results[i].Etapa.trim();
					}

					var jsonEtapa = new sap.ui.model.json.JSONModel();
					jsonEtapa.setData(oDataEtapa.results);
					oView.byId("cb_Etapa").setModel(jsonEtapa, "etapa");
				},
				function(err) {
					sap.m.MessageToast.show("Erro Etapa");
				});
		},

		/*onSelectedPoint: function(oEvent) {
			var data = oEvent.getParameter("data")[0].data.Hora;

			var listaGrafico = this.getView().getModel("graficoTempoFabrica").getData();
			for (var i = 0; i < listaGrafico.length; i++) {
				if (listaGrafico[i].TimeStamp == data) {
					// this.getView()
					if (!this._oPopover) {
						this._oPopover = sap.ui.xmlfragment("monitorPortocel.view.DialogQtde", this);
						this.getView().addDependent(this._oPopover);

					}
					var JSONModel = new sap.ui.model.json.JSONModel();
					JSONModel.setData(listaGrafico[i]);
					this._oPopover.setModel(JSONModel, "popoverQtde");
					this._oPopover.open();
				}
			}

		},*/

		createColumnConfig: function() {
			return [{
				label: "TimeStamp",
				property: "TimeStamp",
				width: "25"
			}, {
				label: "Tempo",
				property: "Tempo"
			}, {
				label: "Meta",
				property: "Meta"
			}];
		},

		onExport: function() {
			if (this.getView().getModel("graficoTempoFabrica")) {

				var aCols, aProducts, oSettings;

				aCols = this.createColumnConfig();
				aProducts = this.getView().getModel("graficoTempoFabrica").oData;

				oSettings = {
					workbook: {
						columns: aCols
					},
					dataSource: aProducts
				};

				new Spreadsheet(oSettings)
					.build()
					.then(function() {
						sap.m.MessageToast.show("Planilha exportada");
					});
			} else {
				sap.m.MessageToast.show("Não há gráfico gerado");
			}
		}

		/*onCloseDialog: function(oEvent) {
			oEvent.getSource().getParent().close();
		}*/
	});

});