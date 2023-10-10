sap.ui.define([
	"Y5VC_CCRM_EV_OM/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"Y5VC_CCRM_EV_OM/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, History, formatter, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("Y5VC_CCRM_EV_OM.controller.EvOM", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the evOM controller is instantiated.
		 * @public
		 */
		onInit: function() {

			this.getRouter().getRoute("evOM").attachPatternMatched(this._onObjectMatched, this);

			var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
			oVizFrame.setVizProperties({
				plotArea: {
					dataLabel: {
						visible: true
					},
					adjustScale: true
				},
				valueAxis: {
					title: {
						visible: false
					}
				},
				categoryAxis: {
					title: {
						visible: false
					}
				},
				title: {
					visible: false
				}
			});
			var oPopOver = this.getView().byId("idPopOver");
			oPopOver.connect(oVizFrame.getVizUid());

			var oView = this.getView();

			sap.ui.getCore().loadLibrary("sap.suite.ui.commons");
			var vizframe = oView.byId("idVizFrame");
			var oChartContainerContent = new sap.suite.ui.commons.ChartContainerContent({
				content: [vizframe]
			});
			var oChartContainer = new sap.suite.ui.commons.ChartContainer({
				content: [oChartContainerContent]
			});
			oChartContainer.setShowFullScreen(true);
			oChartContainer.setAutoAdjustHeight(true);
			oView.byId('chartFixFlex').setFlexContent(oChartContainer);

			var oDateRangeSelection = this.getView().byId("dataRefId");
			oDateRangeSelection.setValueFormat("YYYYww");
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler disparado ao preencher dados no filtro. É utilizado para
		 * validar os dados do mesmo, efetuar consumo do oData ZET_VCPM_ReservasSet e
		 * preencher/atualizar oModel dos gráficos.
		 * 
		 * @public
		 */
		onFilterChange: function(oEvent) {

			var that = this;
			if (oEvent.mParameters.id.indexOf("regionalId") > -1)
				that._filterUpdate(oEvent.mParameters.id, oEvent.oSource.mProperties.selectedKeys);

			var filters = new Array();
			var total = new Array();

			if (that.byId("regionalId").mProperties.selectedKeys.length !== 0)
				total.push(this._mountFilters(that.byId("regionalId").mProperties.selectedKeys, "Regional"));

			if (that.byId("siglaId").mProperties.selectedKeys.length !== 0)
				total.push(this._mountFilters(that.byId("siglaId").mProperties.selectedKeys, "Sigla"));

			if (that.byId("periodoId").mProperties.selectedKeys.length !== 0)
				total.push(this._mountFilters(that.byId("periodoId").mProperties.selectedKeys, "Periodo"));

			if (that.byId("tipoCustoId").mProperties.selectedKeys.length !== 0)
				total.push(this._mountFilters(that.byId("tipoCustoId").mProperties.selectedKeys, "TipoCusto"));

			if (that.byId("gpRecorrenteId").mProperties.selectedKeys.length !== 0)
				total.push(this._mountFilters(that.byId("gpRecorrenteId").mProperties.selectedKeys, "TipoAtividade"));

			if (that.byId("matSerId").mProperties.selectedKeys.length !== 0)
				total.push(this._mountFilters(that.byId("matSerId").mProperties.selectedKeys, "TipoClasseCusto"));

			if (total.length !== 0) {
				filters.push(new sap.ui.model.Filter({
					filters: total,
					and: true
				}));
			};

			if (that.byId("aberturaId").mProperties.selectedKey !== "")
				filters.push(new sap.ui.model.Filter("Abertura", sap.ui.model.FilterOperator.EQ, that.byId("aberturaId").mProperties.selectedKey));
			if (that.byId("tipoId").mProperties.selectedKey !== "")
				filters.push(new sap.ui.model.Filter("Visao", sap.ui.model.FilterOperator.EQ, that.byId("tipoId").mProperties.selectedKey));
			if (that.byId("anoId").mProperties.value !== "")
				filters.push(new sap.ui.model.Filter("Ano", sap.ui.model.FilterOperator.EQ, that.byId("anoId").mProperties.value));

			if (that.byId("dataRefId").mProperties.value !== "" && that.byId("dataRefId").mProperties.value.length > 22) {
				var dataRef = that.byId("dataRefId").mProperties.value;
				var dateFrom = dataRef.slice(6, 10) + dataRef.slice(3, 5) + dataRef.slice(0, 2);
				var dateTo = dataRef.slice(19, 23) + dataRef.slice(16, 18) + dataRef.slice(13, 15);

				filters.push(new sap.ui.model.Filter({
					filters: [
						new sap.ui.model.Filter("DataRef", sap.ui.model.FilterOperator.GE, dateFrom),
						new sap.ui.model.Filter("DataRef", sap.ui.model.FilterOperator.LE, dateTo)
					],
					and: true
				}));
			};
			//	new sap.ui.model.Filter("DataRef", sap.ui.model.FilterOperator.EQ, that.byId("dataRefId").mProperties.value);

			that._readODataEvol_OMSet(filters);
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Métod executado uma única vez, chamado no onInit, e utilizado para consumir 
		 * o oData ZET_VCPM_SearchHelpSet e preencher, a partir dele, os dados dos select
		 * presentes no filtro.
		 * 
		 * @private
		 */
		_readRegional: function() {
			var that = this;

			that.oView.setBusy(true);

			that.oView.getModel().read("/ZET_VCPM_SearchHelpSet", {
				headers: {
					"accept": "application/json"
				},
				success: function(oData, oResponse) {

					var oModel = new JSONModel(oData);
					that.oView.setModel(oModel, "searchHelpSet");

					var oModelRegiao = new JSONModel({
						regioes: [...new Set(oData.results.map(item => item.Regional))].map(obj => {
							return {
								regiao: obj
							}
						})
					});
					that.oView.setModel(oModelRegiao, "regioesSet");
					that._filterUpdate("regional");
					that.oView.setBusy(false);
				},
				error: function(oError) {
					that.oView.setBusy(false);
					var oModel = new JSONModel({
						results: []
					});

				}
			});

			var filters = new Array();
			if (that.byId("aberturaId").mProperties.selectedKey !== "")
				filters.push(new sap.ui.model.Filter("Abertura", sap.ui.model.FilterOperator.EQ, that.byId("aberturaId").mProperties.selectedKey));
			if (that.byId("tipoId").mProperties.selectedKey !== "")
				filters.push(new sap.ui.model.Filter("Visao", sap.ui.model.FilterOperator.EQ, that.byId("tipoId").mProperties.selectedKey));
			that._readODataEvol_OMSet(filters);

		},

		/**
		 * Métod para validar se uma variável é vazia
		 * 
		 * @private
		 */
		_isEmpty: function(value) {
			return (value == null || value.length === 0);
		},

		/**
		 * Métod para preencher os dados dos selects do filtro de 
		 * acordo com a dependência lógica de cada informação
		 * 
		 * @private
		 */
		_filterUpdate: function(field, key) {
			var that = this;
			var results = that.oView.getModel("searchHelpSet").oData.results;

			if (field.indexOf("regional") > -1) {

				if (that._isEmpty(key)) {
					var oModelSigla = new JSONModel({
						siglas: [...new Set(results.map(item => item.Sigla))].map(obj => {
							return {
								sigla: obj
							}
						})
					});
				} else {
					var oModelSigla = new JSONModel({
						siglas: [...new Set(results.filter(function(element) {
							return key.includes(element.Regional)
						}).map(item => item.Sigla))].map(obj => {
							return {
								sigla: obj
							}
						})
					});
				};
				that.oView.setModel(oModelSigla, "siglasSet");
			};
		},

		_mountFilters: function(array, filterName) {
			return new sap.ui.model.Filter({
				filters: array.map(result => {
					result = new sap.ui.model.Filter(filterName, sap.ui.model.FilterOperator.EQ, result);
					return result
				}),
				and: false
			});
		},

		/**
		 * Métod para consumir o oData ZET_VCPM_ReservasSet.
		 * 
		 * @private
		 */
		_readODataEvol_OMSet: function(filters) {
			var that = this;
			that.oView.setBusy(true);
			that.oView.getModel().read("/ZET_VCPM_Evol_OMSet", {
				headers: {
					"accept": "application/json"
				},
				filters: filters,
				success: function(oData, oResponse) {
					oData.results.map(result => {
						result.DataRef = result.DataRef.slice(6, 8) + "/" + result.DataRef.slice(4, 6) + "/" + result.DataRef.slice(0, 4);
						return result
					});
					var oModel = new JSONModel({
						evolOM: oData.results
					});
					that.oView.setModel(oModel, "evolOMSet");
					that.oView.setBusy(false);
				},
				error: function(oError) {
					that.oView.setBusy(false);
					var oModel = new JSONModel({
						results: []
					});

				}
			});
		},

		/**
		 * Métod para fazer redirecionamento do métod onInit
		 * para a primeira carga dos filtros
		 * 
		 * @private
		 */
		_onObjectMatched: function() {
			this._readRegional();
		}

	});
});