sap.ui.define([
	"fibria/com/ZFBC_SUMARIO/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"fibria/com/ZFBC_SUMARIO/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/viz/ui5/format/ChartFormatter',
	'sap/viz/ui5/api/env/Format',
	'sap/m/MessageBox'
], function(BaseController, JSONModel, History, formatter, Filter, FilterOperator, ChartFormatter, Format, MessageBox) {
	"use strict";
	return BaseController.extend("fibria.com.ZFBC_SUMARIO.controller.Worklist", {

		/* =========================================================== */
		/* controller properties                                       */
		/* =========================================================== */

		formatter: formatter,
		ODATA_RISK_COLLECTION: "/GeralRiscos",

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			this.setInitialModel();
			this.setupCharts();
		},
		
		/**
		 * Called when the worklist view is completely rendered
		 * @public
		 */
		onAfterRendering: function() {
			var path = $.sap.getModulePath("fibria.com.ZFBC_SUMARIO", "/image/legenda.JPG");
			this.getView().byId("imgLegenda").setSrc(path);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered when Pesquisar button is pressed
		 * @public
		 */
		onPesquisar: function(oEvent) {
			this.readOrUpdateRiskData();
		},
		
		/**
		 * Triggered when ChartMatrizRiscos button MuitoProvavelMenor is pressed
		 * @public
		 */
		onPopularTabelaMuitoProvavelMenor: function(oEvent) { 
			this.updateGraficosPorQuadrante(this.isMuitoProvavelAndMenor);
		},

		/**
		 * Triggered when ChartMatrizRiscos button ProvavelModerado is pressed
		 * @public
		 */
		onPopularTabelaMuitoProvavelModerado: function(oEvent) { 
			this.updateGraficosPorQuadrante(this.isMuitoProvavelAndModerado); 
		},

		/**
		 * Triggered when ChartMatrizRiscos button is MuitoProvavelMaior pressed
		 * @public
		 */
		onPopularTabelaMuitoProvavelMaior: function(oEvent) { 
			this.updateGraficosPorQuadrante(this.isMuitoProvavelAndMaior); 
		},

		/**
		 * Triggered when ChartMatrizRiscos button MuitoProvavelExtremo is pressed
		 * @public
		 */
		onPopularTabelaMuitoProvavelExtremo: function(oEvent) { 
			this.updateGraficosPorQuadrante(this.isMuitoProvavelAndExtremo); 
		},

		/**
		 * Triggered when ChartMatrizRiscos button is pressed
		 * @public
		 */
		onPopularTabelaProvavelMenor: function(oEvent) { 
			this.updateGraficosPorQuadrante(this.isProvavelAndMenor);
		},

		/**
		 * Triggered when ChartMatrizRiscos button ProvavelModerado is pressed
		 * @public
		 */
		onPopularTabelaProvavelModerado: function(oEvent) { 
			this.updateGraficosPorQuadrante(this.isProvavelAndModerado); 
		},

		/**
		 * Triggered when ChartMatrizRiscos button ProvavelMaior is pressed
		 * @public
		 */
		onPopularTabelaProvavelMaior: function(oEvent) { 
			this.updateGraficosPorQuadrante(this.isProvavelAndMaior); 
		},

		/**
		 * Triggered when ChartMatrizRiscos button ProvavelExtremo is pressed
		 * @public
		 */
		onPopularTabelaProvavelExtremo: function(oEvent) { 
			this.updateGraficosPorQuadrante(this.isProvavelAndExtremo); 
		},

		/**
		 * Triggered when ChartMatrizRiscos button PossivelMenor is pressed
		 * @public
		 */
		onPopularTabelaPossivelMenor: function(oEvent) { 
			this.updateGraficosPorQuadrante(this.isPossivelAndMenor); 
		},

		/**
		 * Triggered when ChartMatrizRiscos button PossivelModerado is pressed
		 * @public
		 */
		onPopularTabelaPossivelModerado: function(oEvent) { 
			this.updateGraficosPorQuadrante(this.isPossivelAndModerado); 
		},

		/**
		 * Triggered when ChartMatrizRiscos button PossivelMaior is pressed
		 * @public
		 */
		onPopularTabelaPossivelMaior: function(oEvent) { 
			this.updateGraficosPorQuadrante(this.isPossivelAndMaior); 
		},

		/**
		 * Triggered when ChartMatrizRiscos button PossivelExtremo is pressed
		 * @public
		 */
		onPopularTabelaPossivelExtremo: function(oEvent) { 
			this.updateGraficosPorQuadrante(this.isPossivelAndExtremo); 
		},

		/**
		 * Triggered when ChartMatrizRiscos button RemotaMeno is pressed
		 * @public
		 */
		onPopularTabelaRemotaMenor: function(oEvent) { 
			this.updateGraficosPorQuadrante(this.isRemotaAndMenor); 
		},

		/**
		 * Triggered when ChartMatrizRiscos button RemotaModerado is pressed
		 * @public
		 */
		onPopularTabelaRemotaModerado: function(oEvent) { 
			this.updateGraficosPorQuadrante(this.isRemotaAndModerado); 
		},

		/**
		 * Triggered when ChartMatrizRiscos button RemotaMaior is pressed
		 * @public
		 */
		onPopularTabelaRemotaMaior: function(oEvent) { 
			this.updateGraficosPorQuadrante(this.isRemotaAndMaior); 
		},

		/**
		 * Triggered when ChartMatrizRiscos button RemotaExtremo is pressed
		 * @public
		 */
		onPopularTabelaRemotaExtremo: function(oEvent) { 
			this.updateGraficosPorQuadrante(this.isRemotaAndExtremo); 
		},
		
		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Returns the basic chart configuration
		 **/
		getChartConfig: function() {
			Format.numericFormatter(ChartFormatter.getInstance());
			return {
				formatPattern: ChartFormatter.DefaultPattern,
				scales: [{
					"feed": "color",
					"palette": ["#FF0000", "#DE8703", "#FFFF00", "#00B050", "#92D050"]
				}],
				scalesMatrizRiscos: [{
					"feed": "color",
					"type": "color",
					"numOfSegments": 5,
					"legendValues": [1, 2, 3, 4, 5],
					"palette": ["#92D050", "#00B050", "#FFFF00", "#DE8703", "#FF0000"]
				}],
				scalesPlanoAcao: [{
					"feed": "color",
					"palette": ["#FF0000", "#DE8703", "#00B050", "#92D050", "#FFFF00"]
				}]
			};
		},

		/**
		 * Sets up the charts used in this view
		 **/
		setupCharts: function() {
			var oConfig = this.getChartConfig();
			this.setupChartMatrizRiscos(oConfig);
			this.setupChartQuantidadeRiscos(oConfig);
			this.setupChartDistribuicaoRiscos(oConfig);
			this.setupTableRiscosPrioritarios(oConfig);
			this.setupChartPlanoAcao(oConfig);
			this.setupChartPlanoAcaoDiretoria(oConfig);
		},
		
		/**
		 * Sets up ChartMatrizRiscos
		 **/
		setupChartMatrizRiscos: function(oConfig) {
			var oChartMatrizRiscos = this.getView().byId("ChartMatrizRiscos");
			oChartMatrizRiscos.setModel(this.getView().getModel("chart"));
		},

		/**
		 * Sets up ChartQuantidadeRiscos
		 **/
		setupChartQuantidadeRiscos: function(oConfig) {
			var oChartQuantidadeRiscos = this.getView().byId("ChartQuantidadeRiscos");
			oChartQuantidadeRiscos.setVizProperties({
				title: {
					visible: false,
					text: ""
				},
				plotArea: {
					mode: "integer",
					dataLabel: {
						type: "integer",
						formatString: oConfig.formatPattern.STANDARDINTEGER,
						visible: true,
						showTotal: false
					}
				},
				valueAxis: {
					label: {
						formatString: oConfig.formatPattern.STANDARDINTEGER,
						visible: false
					},
					title: {
						visible: false
					}
				},
				categoryAxis: {
					title: {
						visible: false
					}
				}
			});
			oChartQuantidadeRiscos.setVizScales(oConfig.scales, {
				replace: true
			});
			oChartQuantidadeRiscos.setModel(this.getView().getModel("chart"));
		},

		/**
		 * Sets up ChartDistribuicaoRiscos
		 **/
		setupChartDistribuicaoRiscos: function(oConfig) {
			var oChartDistribuicaoRiscos = this.getView().byId("ChartDistribuicaoRiscos");
			oChartDistribuicaoRiscos.setVizProperties({
				title: {
					visible: false,
					text: ""
				},
				plotArea: {
					mode: "percentage",
					dataLabel: {
						type: "percentage",
						formatString: oConfig.formatPattern.STANDARDPERCENT_MFD2,
						visible: true,
						showTotal: false
					}
				},
				valueAxis: {
					label: {
						formatString: oConfig.formatPattern.STANDARDPERCENT_MFD2
					},
					title: {
						visible: false
					}
				},
				categoryAxis: {
					title: {
						visible: false
					}
				}
			});
			oChartDistribuicaoRiscos.setVizScales(oConfig.scales, {
				replace: true
			});
			oChartDistribuicaoRiscos.setModel(this.getView().getModel("chart"));
		},

		/**
		 * Sets up TableRiscosPrioritarios
		 **/
		setupTableRiscosPrioritarios: function(oConfig) {
			var oTableRiscosPrioritarios = this.getView().byId("TableRiscosPrioritarios");
			oTableRiscosPrioritarios.setModel(this.getView().getModel("chart"));
		},

		/**
		 * Sets up ChartPlanoAcao
		 **/
		setupChartPlanoAcao: function(oConfig) {
			//Plano de Ação por diretoria
			var oChartPlanoAcao = this.getView().byId("ChartPlanoAcao");
			oChartPlanoAcao.setVizProperties({
				title: {
					visible: false,
					text: ""
				},
				plotArea: {
					mode: "percentage",
					dataLabel: {
						type: "percentage",
						formatString: oConfig.formatPattern.STANDARDPERCENT_MFD2,
						visible: true,
						showTotal: false
					}
				},
				valueAxis: {
					label: {
						formatString: oConfig.formatPattern.STANDARDPERCENT_MFD2
					},
					title: {
						visible: false
					}
				},
				categoryAxis: {
					title: {
						visible: false
					}
				}
			});
			oChartPlanoAcao.setVizScales(oConfig.scalesPlanoAcao, {
				replace: true
			});
			oChartPlanoAcao.setModel(this.getView().getModel("chart"));
		},

		/**
		 * Sets up ChartPlanoAcaoDiretoria
		 **/
		setupChartPlanoAcaoDiretoria: function(oConfig) {
			var oChartPlanoAcaoDiretoria = this.getView().byId("ChartPlanoAcaoDiretoria");
			oChartPlanoAcaoDiretoria.setVizProperties({
				title: {
					visible: false,
					text: ""
				},
				plotArea: {
					mode: "Integer",
					dataLabel: {
						type: "Integer",
						formatString: oConfig.formatPattern.SHORTINTEGER,
						visible: false,
						showTotal: true
					}
				},
				valueAxis: {
					label: {
						formatString: oConfig.formatPattern.SHORTINTEGER
					},
					title: {
						visible: false
					}
				},
				categoryAxis: {
					title: {
						visible: false
					}
				}
			});
			oChartPlanoAcaoDiretoria.setVizScales(oConfig.scalesPlanoAcao, {
				replace: true
			});
			oChartPlanoAcaoDiretoria.setModel(this.getView().getModel("chart"));
		},

		/**
		 * Implements ValueHelpRequest for UnidadeOrganizacional
		 **/
		handleValueHelpOrganizacao: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogOrganizacao) {
				this._valueHelpDialogOrganizacao = sap.ui.xmlfragment("fibria.com.ZFBC_SUMARIO.fragment.SearchHelpOrganizacao", this);
				this.getView().addDependent(this._valueHelpDialogOrganizacao);
			}
			// create a filter for the binding
			this._valueHelpDialogOrganizacao.getBinding("items").filter([new Filter("Organizacao", sap.ui.model.FilterOperator.Contains, sInputValue)]);
			// open value help dialog filtered by the input value
			this._valueHelpDialogOrganizacao.open(sInputValue);
		},

		/**
		 * Implements the Search event for UnidadeOrganizacional
		 **/
		_handleOrganizacaoSHSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter("Organizacao", sap.ui.model.FilterOperator.Contains, sValue);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		/**
		 * Implements the Close event for UnidadeOrganizacional
		 **/
		_handleOrganizacaoSHClose: function(evt) {
			if (evt.getParameter("selectedItem")) {
				this.getView().getModel("filter").setProperty("/Organizacao", evt.getParameter("selectedItem").getTitle());
			}
		},

		/**
		 * Implements ValueHelpRequest for CategoriaRisco
		 **/
		handleValueHelpCatrisco: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogCatrisco) {
				this._valueHelpDialogCatrisco = sap.ui.xmlfragment("fibria.com.ZFBC_SUMARIO.fragment.SearchHelpCatrisco", this);
				this.getView().addDependent(this._valueHelpDialogCatrisco);
			}
			// create a filter for the binding
			this._valueHelpDialogCatrisco.getBinding("items").filter([new Filter("Catrisco", sap.ui.model.FilterOperator.Contains, sInputValue)]);
			// open value help dialog filtered by the input value
			this._valueHelpDialogCatrisco.open(sInputValue);
		},
		
		/**
		 * Implements the Search event for CategoriaRisco
		 **/
		_handleCatriscoSHSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter("Catrisco", sap.ui.model.FilterOperator.Contains, sValue);
			evt.getSource().getBinding("items").filter([oFilter]);
		},
		
		/**
		 * Implements the Close event for CategoriaRisco
		 **/
		_handleCatriscoSHClose: function(evt) {
			if (evt.getParameter("selectedItem")) {
				this.getView().getModel("filter").setProperty("/Catrisco", evt.getParameter("selectedItem").getTitle());
			}
		},

		/**
		 * Set empty values for chart data
		 **/
		 setInitialModel: function() {
		 	var oChartModel = new JSONModel();
		 	oChartModel.setData({
		 		"RiscosSet": [],
				"MatrizRiscosSet": [],
				"QuantidadeRiscosSet": [],
				"DistribuicaoRiscosSet": [],
				"RiscoPorQuadranteSet": [],
				"PlanoAcaoSet": [],
				"PlanoAcaoDiretoriaSet": []
			});
		 	this.setModel(oChartModel, "chart");
		 	
		 	var oModel = this.getOwnerComponent().getModel();
			var that = this;
			that.getView().setBusy(true);
			
			var arrOrganizacaoFilter = [];
			var arrCatriscoFilter = [];
			oModel.read(that.ODATA_RISK_COLLECTION, {
				filters: [],
				error: function(err) {
					that.getView().setBusy(false);
					MessageBox.error(JSON.parse(err.responseText).error.message.value);
				},
				success: function(oData) {
					arrOrganizacaoFilter.push({ "Organizacao": "" });
					arrCatriscoFilter.push({ "Catrisco": "" });
					oData.results.map(function(entry) {
						if (arrOrganizacaoFilter.filter(function(item) { return item.Organizacao === entry.Organizacao; }).length === 0) {
							arrOrganizacaoFilter.push({ "Organizacao": entry.Organizacao });
						}
						if (arrCatriscoFilter.filter(function(item) { return item.Catrisco === entry.Catrisco; }).length === 0) {
							arrCatriscoFilter.push({ "Catrisco": entry.Catrisco });
						}
					});
					that.getView().setBusy(false);
					var oFilterModel = new JSONModel();
				 	oFilterModel.setData({
						"Organizacao": "",
						"OrganizacaoSet": arrOrganizacaoFilter,
						"Catrisco": "",
						"CatriscoSet": arrCatriscoFilter,
						"Nivrisco": "",
						"NivelRiscoSet": [
							{ "Id": "", "RiskLabel": "" },
							{ "Id": "1", "RiskLabel": "Crítico" },
							{ "Id": "2", "RiskLabel": "Alto" },
							{ "Id": "3", "RiskLabel": "Médio" },
							{ "Id": "4", "RiskLabel": "Baixo" },
							{ "Id": "5", "RiskLabel": "Muito baixo" }
						],
						"Potcrise" : "",
						"tipoVisao" : "in"
					});
				 	that.setModel(oFilterModel, "filter");
				}
			});
		 },

		/**
		 * Reads the OData model using the informed filters.
		 * If any error occurs, it displays an error message to the user and cleanup everything.
		 * If success occurs, it propagates the aggregation functions for generating
		 * datasets for all risk charts.
		 **/
		readOrUpdateRiskData: function() {
			var oModel = this.getOwnerComponent().getModel();
			var that = this;
			that.getView().setBusy(true);
			oModel.read(that.ODATA_RISK_COLLECTION, {
				filters: that.getFilters(),
				error: function(err) {
					that.getView().setBusy(false);
					that.setInitialModel();
					MessageBox.error(JSON.parse(err.responseText).error.message.value);
				},
				success: function(oData) {
					that.distributeToCharts(oData, that);
					that.getView().setBusy(false);
				}
			});
		},

		/**
		 * Distributes data to the aggregation functions that feeds the chart models.
		 **/
		distributeToCharts: function(oData, oController) {
			var oViewModelData = {
				"RiscosSet": oData,
				"MatrizRiscosSet": oController.aggregateMatrizRiscos(oData, oController),
				"QuantidadeRiscosSet": oController.aggregateQuantidadeRiscos(oData, oController),
				"DistribuicaoRiscosSet": oController.aggregateDistribuicaoRiscos(oData, oController),
				"RiscoPorQuadranteSet": [], // not set here
				"PlanoAcaoSet": oController.aggregatePlanoAcao(oData, oController),
				"PlanoAcaoDiretoriaSet": oController.aggregatePlanoAcaoDiretoria(oData, oController)
			};
			this.getView().getModel("chart").setData(oViewModelData);
		},

		/**
		 * Aggregates data to better suit ChartMatrizRiscos
		 **/
		aggregateMatrizRiscos: function(oData, oController) {
			var sTipoVisao = this.getTipoVisao();
			var arrMatrizRiscosSet = [];
			arrMatrizRiscosSet.push({ "Probabilidade": "Remota", "Impacto": "Menor",
				"Valor": oData.results.filter(function(item) { return oController.isRemotaAndMenor(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]); }).length 
			});
			arrMatrizRiscosSet.push({ "Probabilidade": "Remota", "Impacto": "Moderado",
				"Valor": oData.results.filter(function(item) { return oController.isRemotaAndModerado(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]); }).length
			});
			arrMatrizRiscosSet.push({ "Probabilidade": "Remota", "Impacto": "Maior",
				"Valor": oData.results.filter(function(item) { return oController.isRemotaAndMaior(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]); }).length
			});
			arrMatrizRiscosSet.push({ "Probabilidade": "Remota", "Impacto": "Extremo",
				"Valor": oData.results.filter(function(item) { return oController.isRemotaAndExtremo(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]); }).length
			});
			arrMatrizRiscosSet.push({ "Probabilidade": "Possível", "Impacto": "Menor",
				"Valor": oData.results.filter(function(item) { return oController.isPossivelAndMenor(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]); }).length
			});
			arrMatrizRiscosSet.push({ "Probabilidade": "Possível", "Impacto": "Moderado",
				"Valor": oData.results.filter(function(item) { return oController.isPossivelAndModerado(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]); }).length
			});
			arrMatrizRiscosSet.push({ "Probabilidade": "Possível", "Impacto": "Maior",
				"Valor": oData.results.filter(function(item) { return oController.isPossivelAndMaior(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]); }).length
			});
			arrMatrizRiscosSet.push({ "Probabilidade": "Possível", "Impacto": "Extremo", 
				"Valor": oData.results.filter(function(item) { return oController.isPossivelAndExtremo(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]); }).length
			});
			arrMatrizRiscosSet.push({ "Probabilidade": "Provável", "Impacto": "Menor",
				"Valor": oData.results.filter(function(item) { return oController.isProvavelAndMenor(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]); }).length
			});
			arrMatrizRiscosSet.push({ "Probabilidade": "Provável", "Impacto": "Moderado",
				"Valor": oData.results.filter(function(item) { return oController.isProvavelAndModerado(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]); }).length
			});
			arrMatrizRiscosSet.push({ "Probabilidade": "Provável", "Impacto": "Maior",
				"Valor": oData.results.filter(function(item) { return oController.isProvavelAndMaior(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]); }).length
			});
			arrMatrizRiscosSet.push({ "Probabilidade": "Provável", "Impacto": "Extremo",
				"Valor": oData.results.filter(function(item) { return oController.isProvavelAndExtremo(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]); }).length
			});
			arrMatrizRiscosSet.push({ "Probabilidade": "Muito Provável", "Impacto": "Menor",
				"Valor": oData.results.filter(function(item) { return oController.isMuitoProvavelAndMenor(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]); }).length
			});
			arrMatrizRiscosSet.push({ "Probabilidade": "Muito Provável", "Impacto": "Moderado",
				"Valor": oData.results.filter(function(item) { return oController.isMuitoProvavelAndModerado(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]); }).length
			});
			arrMatrizRiscosSet.push({ "Probabilidade": "Muito Provável", "Impacto": "Maior",
				"Valor": oData.results.filter(function(item) { return oController.isMuitoProvavelAndMaior(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]); }).length
			});
			arrMatrizRiscosSet.push({ "Probabilidade": "Muito Provável", "Impacto": "Extremo",
				"Valor": oData.results.filter(function(item) { return oController.isMuitoProvavelAndExtremo(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]); }).length
			});
			return arrMatrizRiscosSet;
		},

		/**
		 * Helper to simplify aggregateMatrizRiscos
		 **/
		createMatrizRiscosAggregateItem: function(oData, sProbabilidade, sImpacto) {
			var sTipoVisao = this.getTipoVisao();
			return {
				Probabilidade: sProbabilidade,
				Impacto: sImpacto,
				Quantidade: oData.results.filter(function(entry) {
					return entry["Pro" + sTipoVisao] === sProbabilidade && entry["Nimpac" + sTipoVisao] === sImpacto;
				}).length
			};
		},

		/**
		 * Aggregates data to better suit ChartQuantidadeRiscos
		 **/
		aggregateQuantidadeRiscos: function(oData, oController) {
			var sTipoVisao = this.getTipoVisao();
			var arrUO = [];
			oData.results.map(function(entry) {
				if (arrUO.filter(function(item) {
						return item.Organizacao === entry.Organizacao;
					}).length === 0) {
					arrUO.push({ Organizacao : entry.Organizacao });
				}
			});
			var arrQuantidadeRiscos = [];
			arrUO.map(function(entry) {
				arrQuantidadeRiscos.push({
					UnidadeOrganizacional: entry.Organizacao,
					NivelRisco: "Crítico",
					Quantidade: oData.results.filter(function(item) {
						if ( item.Organizacao === entry.Organizacao && oController.isCritico(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]) ) {
							return true;
						} else {
							return false;
						}
					}).length
				});
				arrQuantidadeRiscos.push({
					UnidadeOrganizacional: entry.Organizacao,
					NivelRisco: "Alto",
					Quantidade: oData.results.filter(function(item) {
						if ( item.Organizacao === entry.Organizacao && oController.isAlto(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]) ) {
							return true;
						} else {
							return false;
						}
					}).length
				});
				arrQuantidadeRiscos.push({
					UnidadeOrganizacional: entry.Organizacao,
					NivelRisco: "Médio",
					Quantidade: oData.results.filter(function(item) {
						if ( item.Organizacao === entry.Organizacao && oController.isMedio(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]) ) {
							return true;
						} else {
							return false;
						}
					}).length
				});
				arrQuantidadeRiscos.push({
					UnidadeOrganizacional: entry.Organizacao,
					NivelRisco: "Baixo",
					Quantidade: oData.results.filter(function(item) {
						if ( item.Organizacao === entry.Organizacao && oController.isBaixo(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]) ) {
							return true;
						} else {
							return false;
						}
					}).length
				});
				arrQuantidadeRiscos.push({
					UnidadeOrganizacional: entry.Organizacao,
					NivelRisco: "Muito Baixo",
					Quantidade: oData.results.filter(function(item) {
						if ( item.Organizacao === entry.Organizacao && oController.isMuitoBaixo(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]) ) {
							return true;
						} else {
							return false;
						}
					}).length
				});
			});
			return arrQuantidadeRiscos;
		},

		/**
		 * Aggregates data to better suit ChartDistribuicaoRiscos
		 **/
		aggregateDistribuicaoRiscos: function(oData, oController) {
			var sTipoVisao = this.getTipoVisao();
			var arrUO = [];
			oData.results.map(function(entry) {
				if (arrUO.filter(function(item) {
						return item.Organizacao === entry.Organizacao;
					}).length === 0) {
					arrUO.push({ Organizacao : entry.Organizacao });
				}
			});
			var arrDistribuicaoRiscos = [];
			arrUO.map(function(entry) {
				arrDistribuicaoRiscos.push({
					UnidadeOrganizacional: entry.Organizacao,
					NivelRisco: "Crítico",
					Percentual: oData.results.filter(function(item) {
						if ( item.Organizacao === entry.Organizacao && oController.isCritico(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]) ) {
							return true;
						} else {
							return false;
						}
					}).length
				});
				arrDistribuicaoRiscos.push({
					UnidadeOrganizacional: entry.Organizacao,
					NivelRisco: "Alto",
					Percentual: oData.results.filter(function(item) {
						if ( item.Organizacao === entry.Organizacao && oController.isAlto(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]) ) {
							return true;
						} else {
							return false;
						}
					}).length
				});
				arrDistribuicaoRiscos.push({
					UnidadeOrganizacional: entry.Organizacao,
					NivelRisco: "Médio",
					Percentual: oData.results.filter(function(item) {
						if ( item.Organizacao === entry.Organizacao && oController.isMedio(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]) ) {
							return true;
						} else {
							return false;
						}
					}).length
				});
				arrDistribuicaoRiscos.push({
					UnidadeOrganizacional: entry.Organizacao,
					NivelRisco: "Baixo",
					Percentual: oData.results.filter(function(item) {
						if ( item.Organizacao === entry.Organizacao && oController.isBaixo(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]) ) {
							return true;
						} else {
							return false;
						}
					}).length
				});
				arrDistribuicaoRiscos.push({
					UnidadeOrganizacional: entry.Organizacao,
					NivelRisco: "Muito Baixo",
					Percentual: oData.results.filter(function(item) {
						if ( item.Organizacao === entry.Organizacao && oController.isMuitoBaixo(item["Pro" + sTipoVisao], item["Nimpac" + sTipoVisao]) ) {
							return true;
						} else {
							return false;
						}
					}).length
				});
			});
			return arrDistribuicaoRiscos;
		},

		/**
		 * Aggregates data to better suit TableRiscoPorQuadrante
		 **/
		aggregateRiscoPorQuadrante: function(oData, oController) {
			var sTipoVisao = this.getTipoVisao();
			var arrRiscos = [];
			oData.results.map(function(entry) {
				arrRiscos.push({
					Rmarea: entry.Rmarea,
					Objid: entry.Objid,
					Risco: entry.Risco,
					Descricao: entry.Descricao,
					Fdrisco: entry.Fdrisco,
					Pro: entry["Pro" + sTipoVisao],
					Nimpac: entry["Nimpac" + sTipoVisao]
				});
			});
			return arrRiscos;
		},

		/**
		 * Aggregates data to better suit ChartPlanoAcao
		 **/
		aggregatePlanoAcao: function(oData, oController) {

			var arrPlanoAcao = [];
			arrPlanoAcao.push({
				Status: "Atrasado",
				Quantidade: oData.results.filter(function(item) {
					return oController.isAtrasado(item.Stat.trim());
				}).length
			});

			arrPlanoAcao.push({
				Status: "Não Iniciado",
				Quantidade: oData.results.filter(function(item) {
					return oController.isNaoIniciado(item.Stat.trim());
				}).length
			});
			arrPlanoAcao.push({
				Status: "Implementado",
				Quantidade: oData.results.filter(function(item) {
					return oController.isImplementado(item.Stat.trim());
				}).length
			});

			arrPlanoAcao.push({
				Status: "Em Andamento",
				Quantidade: oData.results.filter(function(item) {
					return oController.isEmAndamento(item.Stat.trim());
				}).length
			});
			
			arrPlanoAcao.push({
				Status: "Enviado",
				Quantidade: oData.results.filter(function(item) {
					return oController.isEnviado(item.Stat.trim());
				}).length
			});

			return arrPlanoAcao;

		},

		/**
		 * Aggregates data to better suit ChartPlanoAcaoDiretoria
		 **/
		aggregatePlanoAcaoDiretoria: function(oData, oController) {
			var arrUO = [];
			oData.results.map(function(entry) {
				if (arrUO.filter(function(item) {
						return item === entry.Organizacao;
					}).length === 0) {
					arrUO.push(entry.Organizacao);
				}
			});
			var arrPlanaAcaoDiretoria = [];
			arrUO.map(function(entry) {
				//if (entry === oData.results.filter(function(item) { return item.Organizacao;})
				arrPlanaAcaoDiretoria.push({
					Diretoria: entry,
					Status: "Atrasado",
					Percentual: oData.results.filter(function(item) {
						return oController.isAtrasado(item.Stat);
					}).length
				});
				arrPlanaAcaoDiretoria.push({
					Diretoria: entry,
					Status: "Não Iniciado",
					Percentual: oData.results.filter(function(item) {
						return oController.isNaoIniciado(item.Stat);
					}).length
				});
				arrPlanaAcaoDiretoria.push({
					Diretoria: entry,
					Status: "Implementado",
					Percentual: oData.results.filter(function(item) {
						return oController.isImplementado(item.Stat);
					}).length
				});
				arrPlanaAcaoDiretoria.push({
					Diretoria: entry,
					Status: "Em Andamento",
					Percentual: oData.results.filter(function(item) {
						return oController.isEmAndamento(item.Stat);
					}).length
				});
				arrPlanaAcaoDiretoria.push({
					Diretoria: entry,
					Status: "Enviado",
					Percentual: oData.results.filter(function(item) {
						return oController.isEnviado(item.Stat);
					}).length
				});
			});
			return arrPlanaAcaoDiretoria;
		},
		
		/**
		 * Returns if combination of Probability (sPro) and Impact (sNimpac) is Critic
		 **/
		isCritico: function(sPro, sNimpac) {
			return (
				(sPro === "Muito provável" && (sNimpac === "Maior" || sNimpac === "Extremo")) ||
				(sPro === "Provável" && sNimpac === "Extremo")
			);
		},

		/**
		 * Returns if combination of Probability (sPro) and Impact (sNimpac) is High
		 **/
		isAlto: function(sPro, sNimpac) {
			return (
				(sPro === "Muito provável" && sNimpac === "Moderado") ||
				(sPro === "Provável" && sNimpac === "Maior") ||
				(sPro === "Possível" && sNimpac === "Extremo")
			);
		},

		/**
		 * Returns if combination of Probability (sPro) and Impact (sNimpac) is Medium
		 **/
		isMedio: function(sPro, sNimpac) {
			return (
				(sPro === "Muito provável" && sNimpac === "Menor") ||
				(sPro === "Provável" && sNimpac === "Moderado") ||
				(sPro === "Possível" && sNimpac === "Maior") ||
				(sPro === "Remota" && sNimpac === "Extremo")
			);
		},

		/**
		 * Returns if combination of Probability (sPro) and Impact (sNimpac) is Low
		 **/
		isBaixo: function(sPro, sNimpac) {
			return (
				(sPro === "Provável" && sNimpac === "Menor") ||
				(sPro === "Possível" && sNimpac === "Moderado") ||
				(sPro === "Remota" && sNimpac === "Maior")
			);
		},

		/**
		 * Returns if combination of Probability (sPro) and Impact (sNimpac) is Very Low
		 **/
		isMuitoBaixo: function(sPro, sNimpac) {
			return (
				(sPro === "Possível" && sNimpac === "Menor") ||
				(sPro === "Remota" && (sNimpac === "Menor" || sNimpac === "Moderado"))
			);
		},
		
		/**
		 * Updates the TableRiscoPorQuadrante, ChartQuantidadeRiscos and ChartDistribuicaoRiscos data
		 **/
		updateGraficosPorQuadrante: function(fnIsQuadrante) {
			var sTipoVisao = this.getTipoVisao();
			var arrRiscosSet = this.getView().getModel("chart").getProperty("/RiscosSet");
			var arrRiscoFilteredSet = { results : [] };
			arrRiscosSet.results.map(function(entry) {
				if (fnIsQuadrante(entry["Pro" + sTipoVisao], entry["Nimpac" + sTipoVisao])) {
					arrRiscoFilteredSet.results.push(entry);
				}
			});
			this.getView().getModel("chart").setProperty("/RiscoPorQuadranteSet", this.aggregateRiscoPorQuadrante(arrRiscoFilteredSet, this));
			this.getView().getModel("chart").setProperty("/QuantidadeRiscosSet", this.aggregateQuantidadeRiscos(arrRiscoFilteredSet, this));
			this.getView().getModel("chart").setProperty("/DistribuicaoRiscosSet", this.aggregateDistribuicaoRiscos(arrRiscoFilteredSet, this));
		},
		
		/**
		 * Returns if combination of Probability (sPro) and Impact (sNimpac) is Remote and Small
		 **/
		isRemotaAndMenor: function(sPro, sNimpac) {
			return ((sPro === "Remota" && sNimpac === "Menor"));
		},

		/**
		 * Returns if combination of Probability (sPro) and Impact (sNimpac) is Remote and Moderate
		 **/
		isRemotaAndModerado: function(sPro, sNimpac) {
			return ((sPro === "Remota" && sNimpac === "Moderado"));
		},

		/**
		 * Returns if combination of Probability (sPro) and Impact (sNimpac) is Remote and Big
		 **/
		isRemotaAndMaior: function(sPro, sNimpac) {
			return ((sPro === "Remota" && sNimpac === "Maior"));
		},

		/**
		 * Returns if combination of Probability (sPro) and Impact (sNimpac) is Remote and Extreme
		 **/
		isRemotaAndExtremo: function(sPro, sNimpac) {
			return ((sPro === "Remota" && sNimpac === "Extremo"));
		},

		/**
		 * Returns if combination of Probability (sPro) and Impact (sNimpac) is Possible and Small
		 **/
		isPossivelAndMenor: function(sPro, sNimpac) {
			return ((sPro === "Possível" && sNimpac === "Menor"));
		},

		/**
		 * Returns if combination of Probability (sPro) and Impact (sNimpac) is Possible and Moderate
		 **/
		isPossivelAndModerado: function(sPro, sNimpac) {
			return ((sPro === "Possível" && sNimpac === "Moderado"));
		},

		/**
		 * Returns if combination of Probability (sPro) and Impact (sNimpac) is Possible and Big
		 **/
		isPossivelAndMaior: function(sPro, sNimpac) {
			return ((sPro === "Possível" && sNimpac === "Maior"));
		},

		/**
		 * Returns if combination of Probability (sPro) and Impact (sNimpac) is Possible and Extreme
		 **/
		isPossivelAndExtremo: function(sPro, sNimpac) {
			return ((sPro === "Possível" && sNimpac === "Extremo"));
		},

		/**
		 * Returns if combination of Probability (sPro) and Impact (sNimpac) is Probable and Small
		 **/
		isProvavelAndMenor: function(sPro, sNimpac) {
			return ((sPro === "Provável" && sNimpac === "Menor"));
		},

		/**
		 * Returns if combination of Probability (sPro) and Impact (sNimpac) is Probable and Moderate
		 **/
		isProvavelAndModerado: function(sPro, sNimpac) {
			return ((sPro === "Provável" && sNimpac === "Moderado"));
		},

		/**
		 * Returns if combination of Probability (sPro) and Impact (sNimpac) is Probable and Big
		 **/
		isProvavelAndMaior: function(sPro, sNimpac) {
			return ((sPro === "Provável" && sNimpac === "Maior"));
		},

		/**
		 * Returns if combination of Probability (sPro) and Impact (sNimpac) is Probable and Extreme
		 **/
		isProvavelAndExtremo: function(sPro, sNimpac) {
			return ((sPro === "Provável" && sNimpac === "Extremo"));
		},

		/**
		 * Returns if combination of Probability (sPro) and Impact (sNimpac) is Very Probable and Small
		 **/
		isMuitoProvavelAndMenor: function(sPro, sNimpac) {
			return ((sPro === "Muito provável" && sNimpac === "Menor"));
		},

		/**
		 * Returns if combination of Probability (sPro) and Impact (sNimpac) is Very Probable and Moderate
		 **/
		isMuitoProvavelAndModerado: function(sPro, sNimpac) {
			return ((sPro === "Muito provável" && sNimpac === "Moderado"));
		},

		/**
		 * Returns if combination of Probability (sPro) and Impact (sNimpac) is Very Probable and Big
		 **/
		isMuitoProvavelAndMaior: function(sPro, sNimpac) {
			return ((sPro === "Muito provável" && sNimpac === "Maior"));
		},

		/**
		 * Returns if combination of Probability (sPro) and Impact (sNimpac) is Very Probable and Extreme
		 **/
		isMuitoProvavelAndExtremo: function(sPro, sNimpac) {
			return ((sPro === "Muito provável" && sNimpac === "Extremo"));
		},

		/**
		 * Returns if State (sSTat) is Implemented
		 **/
		isImplementado: function(sSTat) {
			return (
				(sSTat.trim() === "Implementado")
			);
		},

		/**
		 * Returns if State (sSTat) is Not Yet Started
		 **/
		isNaoIniciado: function(sSTat) {
			return (
				(sSTat.trim() === "Não Iniciado")
			);
		},

		/**
		 * Returns if State (sSTat) is Delayed
		 **/
		isAtrasado: function(sSTat) {
			return (
				(sSTat.trim() === "Atrasado")
			);
		},

		/**
		 * Returns if State (sSTat) is On Going
		 **/
		isEmAndamento: function(sSTat) {
			return (
				(sSTat.trim() === "Em Andamento")
			);
		},
		
		/**
		 * Returns if State (sSTat) is Sent
		 **/
		isEnviado: function(sSTat) {
			return (
				(sSTat.trim() === "Enviado")
			);
		},
		
		/**
		 * Returns the filters that will be applied to the OData call
		 **/
		getFilters: function() {
			var sTipoVisao = this.getTipoVisao();
			var arrFilters = [];
			if (this.getView().getModel("filter").getProperty("/Organizacao") !== "") {
				arrFilters.push(new sap.ui.model.Filter({ path: "Organizacao", operator: "EQ", value1: this.getView().getModel("filter").getProperty("/Organizacao") }));
			}
			if (this.getView().getModel("filter").getProperty("/Catrisco") !== "") {
				arrFilters.push(new sap.ui.model.Filter({ path: "Catrisco", operator: "EQ", value1: this.getView().getModel("filter").getProperty("/Catrisco") }));
			}
			if (this.getView().getModel("filter").getProperty("/Nivrisco") !== "") {
				arrFilters.push(new sap.ui.model.Filter({ path: "Pro" + sTipoVisao, operator: "EQ", value1: this.getView().getModel("filter").getProperty("/Nivrisco") }));
			}

			return arrFilters;
		},
		
		/**
		 * Returns the TipoVisao filter value
		 **/
		getTipoVisao: function() {
			var sTipoVisao = this.getModel("filter").getProperty("/tipoVisao");
			if (sTipoVisao === "") {
				sTipoVisao = "in";
			}
			return sTipoVisao;
		}
		
	});
});