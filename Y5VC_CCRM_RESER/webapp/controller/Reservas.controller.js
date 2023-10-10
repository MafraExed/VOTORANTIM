sap.ui.define([
	"Y5VC_CCRM_RESER/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"Y5VC_CCRM_RESER/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, History, formatter, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("Y5VC_CCRM_RESER.controller.Reservas", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the evOM controller is instantiated.
		 * @public
		 */
		onInit: function() {

			// Model used to manipulate control states
			var oViewModel = new JSONModel({
				reservasTableTitle: this.getResourceBundle().getText("reservasTableTitle"),
				saveAsTileTitle: this.getResourceBundle().getText("saveAsTileTitle", this.getResourceBundle().getText("reservasViewTitle")),
				shareOnJamTitle: this.getResourceBundle().getText("reservasTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailreservasSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailreservasMessage", [location.href]),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0,
				regionalKey: "",
				siglaKey: "",
				revisaoKey: ""

			});
			this.setModel(oViewModel, "reservasView");

			this.getRouter().getRoute("reservas").attachPatternMatched(this._onObjectMatched, this);
			var oBindingProperty = new sap.ui.model.PropertyBinding(oViewModel, "/regionalSet");

			oBindingProperty.attachChange(function(oEvent) {
				//this.triggerDetailChange(oEvent, that.oView);
			});

			for (var i = 1; i < 5; i++) {
				var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame" + i);
				oVizFrame.setVizProperties({
					plotArea: {
						dataLabel: {
							visible: true,
							type: 'value'
						}
					},
					valueAxis: {
						label: {},
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

				var oPopOver = this.getView().byId("idPopOver" + i);
				oPopOver.connect(oVizFrame.getVizUid());
			}

			var oView = this.getView();

			sap.ui.getCore().loadLibrary("sap.suite.ui.commons");
			var vizframe = oView.byId("idVizFrame1");
			var vizframe2 = oView.byId("idVizFrame2");
			var vizframe3 = oView.byId("idVizFrame3");
			var vizframe4 = oView.byId("idVizFrame4");
			var oChartContainerContent = new sap.suite.ui.commons.ChartContainerContent({
				icon: "sap-icon://vertical-bar-chart-2",
				title: "Numero de Reservas por mês",
				content: [vizframe]
			});
			var oChartContainerContent2 = new sap.suite.ui.commons.ChartContainerContent({
				icon: "sap-icon://vertical-bar-chart-2",
				title: "Valor Reserva",
				content: [vizframe2]
			});
			var oChartContainerContent3 = new sap.suite.ui.commons.ChartContainerContent({
				icon: "sap-icon://pie-chart",
				title: "Status Atendimento",
				content: [vizframe3]
			});
			var oChartContainerContent4 = new sap.suite.ui.commons.ChartContainerContent({
				icon: "sap-icon://pie-chart",
				title: "Status Liberação",
				content: [vizframe4]
			});

			var icon = oView.byId("customIcon");
			var oChartContainer = new sap.suite.ui.commons.ChartContainer({
				content: [oChartContainerContent, oChartContainerContent2, oChartContainerContent3, oChartContainerContent4],
				customIcons: icon
			});
			oChartContainer.setShowFullScreen(true);
			oChartContainer.setAutoAdjustHeight(true);
			oView.byId('chartFixFlex').setFlexContent(oChartContainer);

		},

		onExit: function() {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
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
			that._filterUpdate(oEvent.mParameters.id, oEvent.oSource.mProperties.selectedKeys);

			var filters = new Array();
			var total = new Array();

			if (that.byId("regionalId").mProperties.selectedKeys.length !== 0)
				total.push(this._mountFilters(that.byId("regionalId").mProperties.selectedKeys, "Regional"));

			if (that.byId("siglaId").mProperties.selectedKeys.length !== 0)
				total.push(this._mountFilters(that.byId("siglaId").mProperties.selectedKeys, "Sigla"));

			if (that.byId("revisaoId").mProperties.selectedKeys.length !== 0)
				total.push(this._mountFilters(that.byId("revisaoId").mProperties.selectedKeys, "Revisao"));

			if (that.byId("tipoCustoId").mProperties.selectedKeys.length !== 0)
				total.push(this._mountFilters(that.byId("tipoCustoId").mProperties.selectedKeys, "TipoCusto"));

			if (total.length !== 0) {
				filters.push(new sap.ui.model.Filter({
					filters: total,
					and: true
				}));
			};

			that.oView.getModel("searchHelpSet").oData.results.filter(function(element) {
				return that.byId("regionalId").mProperties.selectedKeys.includes(element.Regional);
			});

			that._readODataReservasSet(filters);
		},

		/**
		 * Event handler disparado ao clicar pra selecionar dialog de filtro
		 * do mês de referência
		 * 
		 * @public
		 */
		handleSelectDialogPress: function(oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("fragmentId", "Y5VC_CCRM_RESER.view.Dialog", this);
				this._oDialog.setModel(this.getView().getModel("MesxRes"));
			}

			// Multi-select if required
			this._oDialog.setMultiSelect(true);

			// Remember selections if required
			this._oDialog.setRememberSelections(true);

			// clear the old search filter
			this._oDialog.getBinding("items").filter([]);

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);

			this._oDialog.open();
		},

		/**
		 * Event handler para o filtro das opções do dialog de mês de referência
		 * 
		 * @public
		 */
		handleSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("MesRef", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		/**
		 * Event handler para o botão OK do dialog de mês de Referência
		 * 
		 * @public
		 */
		handleClose: function(oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			var oReservas = JSON.parse(JSON.stringify(this.oView.getModel("ReservasSet").oData.results))

			if (aContexts.length) {
				var selected = aContexts.map(function(oContext) {
					return oContext.getObject().MesRef;
				});
				oReservas = oReservas.filter(item =>
					selected.includes(item.MesRef));
			};

			var oReservasModel = new JSONModel({
				results: oReservas
			});

			this._montarGraficosBarras(oReservasModel.oData, "MesxRes");
			this._montarGraficosBarras(oReservasModel.oData, "MesxVal");
			this._montarGraficosPizza(oReservasModel.oData, "StAtendxRes");
			this._montarGraficosPizza(oReservasModel.oData, "StResxRes");

			oEvent.getSource().getBinding("items").filter([]);
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
					that._filterUpdate("sigla");
					that.oView.setBusy(false);
				},
				error: function(oError) {
					that.oView.setBusy(false);
					var oModel = new JSONModel({
						results: []
					});

				}
			});
			that._readODataReservasSet();
		},

		/**
		 * Métod para separar dados, obtidos através do oData ZET_VCPM_ReservasSet,
		 * em oModels distintos para cada gráfico.
		 * 
		 * @private
		 */
		_montarGraficosBarras: function(oData, chartName) {
			var that = this;
			var filteredArray = oData.results.filter(function(element) {
				return element.Analise.indexOf(chartName) > -1;
			});
			var oModel = new JSONModel({
				reservas: filteredArray
			});
			that.oView.setModel(oModel, chartName);
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
				field = "sigla";
				key = that._isEmpty(that.byId("siglaId").mProperties.selectedKeys) ? null : that.byId("siglaId").mProperties.selectedKeys;

			};
			if (field.indexOf("sigla") > -1) {
				if (that._isEmpty(key)) {
					if (that._isEmpty(that.byId("regionalId").mProperties.selectedKeys)) {
						var oModelRev = new JSONModel({
							revisoes: [...new Set(results.map(item => item.Revisao))].map(obj => {
								return {
									revisao: obj
								}
							})
						});
					} else {
						var oModelRev = new JSONModel({
							revisoes: [...new Set(results.filter(function(element) {
								return that.byId("regionalId").mProperties.selectedKeys.includes(element.Regional)
							}).map(item => item.Revisao))].map(obj => {
								return {
									revisao: obj
								}
							})
						});
					};
				} else {
					var oModelRev = new JSONModel({
						revisoes: [...new Set(results.filter(function(element) {
							return key.includes(element.Sigla)
						}).map(item => item.Revisao))].map(obj => {
							return {
								revisao: obj
							}
						})
					});
				};
				that.oView.setModel(oModelRev, "revisoesSet");
				if (oModelRev.oData.revisoes.length === 1)
					that.byId("revisaoId").setSelectedKeys("");
				that.byId("revisaoId").setSelectedKeys(null);
			};
		},

		/**
		 * Métod para montar os filtros de seleções múltipla por MultiComboBox.
		 * 
		 * @private
		 */
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
		_montarGraficosPizza: function(oData, chartName) {
			var that = this;

			var results = [...oData.results.reduce((r, o) => {
				const key = o.Analise + '-' + o.StatRes + '-' + o.StatAtend;

				const item = r.get(key) || Object.assign({}, o, {
					Contador: 0
				});

				item.Contador += o.Contador;

				return r.set(key, item);
			}, new Map).values()].filter(function(element) {
				if (((element.StatRes !== "")
				||
				(element.StatAtend !== ""))
				&&
				(element.Analise == chartName))
				return element;
			});
			
			var oModel = new JSONModel({
				reservas: results
			});
			that.oView.setModel(oModel, chartName);
		},

		/**
		 * Métod para consumir o oData ZET_VCPM_ReservasSet.
		 * 
		 * @private
		 */
		_readODataReservasSet: function(filters) {
			var that = this;
			that.oView.setBusy(true);
			that.oView.getModel().read("/ZET_VCPM_ReservasSet", {
				headers: {
					"accept": "application/json"
				},
				filters: filters,
				success: function(oData, oResponse) {
					oData.results.map(result => {
						result.MesRef = result.MesRef.slice(4, 6) + "/" + result.MesRef.slice(0, 4);
						return result
					});
					var oModel = new JSONModel({
						results: oData.results
					});
					that.oView.setModel(oModel, "ReservasSet");
					that._montarGraficosBarras(oData, "MesxRes");
					that._montarGraficosBarras(oData, "MesxVal");
					that._montarGraficosPizza(oData, "StAtendxRes");
					that._montarGraficosPizza(oData, "StResxRes");
					if (!!that._oDialog)
						that._oDialog.setModel(that.getView().getModel("MesxRes"));
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