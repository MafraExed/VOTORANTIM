sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"monitorPortocel/webServices/apiConnector"
], function(Controller, Filter, apiConnector) {
	"use strict";
	return Controller.extend("monitorPortocel.controller.DialogFiltroCaminhao", {

		myParent: null,
		centro: "",
		placaCavalo: "",
		placaCarreta1: "",
		placaCarreta2: "",
		aFilter: [],
		selecionados: null,

		constructor: function(parent) {
			this.myParent = parent;
			this.aFilter = [];
			this.selecionados = [];
			this.centro = "";
			this.placaCavalo = "";
			this.placaCarreta1 = "";
			this.placaCarreta2 = "";
		},
		
		onFilterByCentro: function() {
			var myParent = this.myParent;
			var oView = myParent.getView();
			var oDialog = sap.ui.xmlfragment("monitorPortocel.view.DialogFiltroCaminhao_Centro", this);
			oView.addDependent(oDialog);
			oDialog.open();
			if (!oView.getModel("dialogCentro")) {
				myParent.startModelCentro();
			}
		},

		onFilterByCavalo: function() {
			var myParent = this.myParent;
			var oView = myParent.getView();
			var oDialog = sap.ui.xmlfragment("monitorPortocel.view.DialogFiltroCaminhao_PlacaCavalo", this);
			oView.addDependent(oDialog);
			oDialog.open();
			if (!oView.getModel("placaCavalo")) {
				myParent.startModelCavalo();
			}
		},

		onFilterByCarreta1: function() {
			var myParent = this.myParent;
			var oView = myParent.getView();
			var oDialog = sap.ui.xmlfragment("monitorPortocel.view.DialogFiltroCaminhao_PlacaCarreta1", this);
			oView.addDependent(oDialog);
			oDialog.open();
			if (!oView.getModel("placaCarreta1")) {
				myParent.startModelCarreta1();
			}
		},

		onFilterByCarreta2: function() {
			var myParent = this.myParent;
			var oView = myParent.getView();
			var oDialog = sap.ui.xmlfragment("monitorPortocel.view.DialogFiltroCaminhao_PlacaCarreta2", this);
			oView.addDependent(oDialog);
			oDialog.open();
			if (!oView.getModel("placaCarreta2")) {
				myParent.startModelCarreta2();
			}
		},
		
		_onSearchFieldLiveChange: function(oEvent){
			var sControlId = this.myParent.getView().getDependents()[0].getContent()[1].getId();
			var oControl = this.myParent.getView().getDependents()[0].getContent()[1];

			// Get the search query, regardless of the triggered event ('query' for the search event, 'newValue' for the liveChange one).
			var sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue");
			var sSourceId = oEvent.getSource().getId();

			return new Promise(function(fnResolve) {
				var aFinalFilters = [];

				var aFilters = [];
				// 1) Search filters (with OR)
				if (sQuery && sQuery.length > 0) {
					aFilters.push(new sap.ui.model.Filter("PlcCavalo", sap.ui.model.FilterOperator.Contains, sQuery));
					aFilters.push(new sap.ui.model.Filter("PlcCarro1", sap.ui.model.FilterOperator.Contains, sQuery));
					aFilters.push(new sap.ui.model.Filter("PlcCarro2", sap.ui.model.FilterOperator.Contains, sQuery));
					aFilters.push(new sap.ui.model.Filter("Composicao", sap.ui.model.FilterOperator.Contains, sQuery));
				}

				aFinalFilters = aFilters.length > 0 ? [new sap.ui.model.Filter(aFilters, false)] : [];
				var oBindingOptions = this.updateBindingOptions(sControlId, {
					filters: aFinalFilters
				}, sSourceId);
				var oBindingInfo = oControl.getBindingInfo("items");
				oControl.bindAggregation("items", {
					model: oBindingInfo.model,
					path: oBindingInfo.path,
					parameters: oBindingInfo.parameters,
					template: oBindingInfo.template,
					sorter: oBindingOptions.sorters,
					filters: oBindingOptions.filters
				});
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		updateBindingOptions: function(sCollectionId, oBindingData, sSourceId) {
			this.mBindingOptions = this.mBindingOptions || {};
			this.mBindingOptions[sCollectionId] = this.mBindingOptions[sCollectionId] || {};

			var aSorters = this.mBindingOptions[sCollectionId].sorters;
			var oGroupby = this.mBindingOptions[sCollectionId].groupby;

			// If there is no oBindingData parameter, we just need the processed filters and sorters from this function
			if (oBindingData) {
				if (oBindingData.sorters) {
					aSorters = oBindingData.sorters;
				}
				if (oBindingData.groupby) {
					oGroupby = oBindingData.groupby;
				}
				// 1) Update the filters map for the given collection and source
				this.mBindingOptions[sCollectionId].sorters = aSorters;
				this.mBindingOptions[sCollectionId].groupby = oGroupby;
				this.mBindingOptions[sCollectionId].filters = this.mBindingOptions[sCollectionId].filters || {};
				this.mBindingOptions[sCollectionId].filters[sSourceId] = oBindingData.filters || [];
			}

			// 2) Reapply all the filters and sorters
			var aFilters = [];
			for (var key in this.mBindingOptions[sCollectionId].filters) {
				aFilters = aFilters.concat(this.mBindingOptions[sCollectionId].filters[key]);
			}

			// Add the groupby first in the sorters array
			if (oGroupby) {
				aSorters = aSorters ? [oGroupby].concat(aSorters) : [oGroupby];
			}

			var aFinalFilters = aFilters.length > 0 ? [new sap.ui.model.Filter(aFilters, true)] : undefined;
			return {
				filters: aFinalFilters,
				sorters: aSorters
			};
		},

		onComposicaoSelecionada: function(oEvent) {
			var myParent = this.myParent;
			var model = myParent.getView().getModel("filtroCaminhao");
			var indice = oEvent.getSource().getBindingContextPath().split("/")[1];

			if (model.oData[indice].CompSelected === "Selecionado") {
				model.oData[indice].CompSelected = "";
				model.refresh();

				if (this.selecionados.includes(indice)) {
					this.selecionados.splice(this.selecionados.indexOf(indice), 1);
				}
			} else {
				model.oData[indice].CompSelected = "Selecionado";
				model.refresh();
				this.selecionados.push(indice);
			}
		},

		onCleanFilters: function() {
			var myParent = this.myParent;

			this.aFilter = [];
			this.centro = "";
			this.placaCavalo = "";
			this.placaCarreta1 = "";
			this.placaCarreta2 = "";
	
			myParent.getView().getDependents()[0].getContent()[0].getItems()[0].getItems()[1].setValue("");
			myParent.getView().getDependents()[0].getContent()[0].getItems()[1].getItems()[1].setValue("");
			myParent.getView().getDependents()[0].getContent()[0].getItems()[2].getItems()[1].setValue("");
			myParent.getView().getDependents()[0].getContent()[0].getItems()[3].getItems()[1].setValue("");
			this.filtra();
		},

		onClose: function(oEvent) {
			var myParent = this.myParent;
			var model = myParent.getView().getModel("filtroCaminhao");

			for (var i = 0; i < this.selecionados.length; i++) {
				model.oData[this.selecionados[i]].CompSelected = "";
			}

			oEvent.getSource().getParent().close();
			oEvent.getSource().getParent().destroy();
		},

		onApplyFilter: function(oEvent) {
			var myParent = this.myParent;
			var model = myParent.getView().getModel("filtroCaminhao");

			var tamanhoFiltro = myParent.aFilters.length;
			var contador = 0;
			while (contador < tamanhoFiltro) {
				if (myParent.aFilters[contador].sPath === "Composicao") {
					myParent.aFilters.splice(contador, 1);
					contador--;
					tamanhoFiltro--;
				}
				contador++;
			}

			var stringParaOInput = "";
			for (var i = 0; i < model.oData.length; i++) {
				if (model.oData[i].CompSelected === "Selecionado") {
					var novoFiltro = new sap.ui.model.Filter({
						path: "Composicao",
						operator: sap.ui.model.FilterOperator.Contains,
						value1: model.oData[i].Composicao
					});
					myParent.aFilters.push(novoFiltro);
					stringParaOInput += model.oData[i].Composicao + " ";
				}
			}
			myParent.getView().byId("inptCaminhao").setValue(stringParaOInput);
			myParent.loadTrucksOnTheMap();
			oEvent.getSource().getParent().close();
			oEvent.getSource().getParent().destroy();
		},

		filtra: function() {
			var myParent = this.myParent;
			var novoFiltro;
			
			if (this.centro !== "") {
				novoFiltro = new sap.ui.model.Filter({
					path: "Centro",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: this.centro
				});
				this.aFilter.push(novoFiltro);
			}
			if (this.placaCavalo !== "") {
				novoFiltro = new sap.ui.model.Filter({
					path: "PlcCavalo",
					operator: sap.ui.model.FilterOperator.Contains,
					value1: this.placaCavalo
				});
				this.aFilter.push(novoFiltro);
			}
			if (this.placaCarreta1 !== "") {
				novoFiltro = new sap.ui.model.Filter({
					path: "PlcCarro1",
					operator: sap.ui.model.FilterOperator.Contains,
					value1: this.placaCarreta1
				});
				this.aFilter.push(novoFiltro);
			}
			if (this.placaCarreta2 !== "") {
				novoFiltro = new sap.ui.model.Filter({
					path: "PlcCarro2",
					operator: sap.ui.model.FilterOperator.Contains,
					value1: this.placaCarreta2
				});
				this.aFilter.push(novoFiltro);
			}

			var stringParam = "/ZET_VPWM_COMPOSICAOSET";
			apiConnector.consumeModel(stringParam, this.aFilter, {},
				function(oData, oResponse) {
					var json = new sap.ui.model.json.JSONModel();
					json.setData(oData.results);
					myParent.getView().setModel(json, "filtroCaminhao");
				},
				function(err) {
					sap.m.MessageToast.show("Erro");
				});

		},
		/* ####################################
		###### FUNÇÕES DO DIALOG CENTRO #######
		#################################### */
		
		onSearchCentro: function(oEvent) {
			var myParent = this.myParent;
			var model = myParent.getView().getModel("dialogCentro");
			var query = oEvent.getParameter("query").toLowerCase();

			if (query === "") {
				for (var i = 0; i < model.oData.length; i++) {
					model.oData[i].visible = true;
				}
			} else {
				for (var i = 0; i < model.oData.length; i++) {
					var centro = model.oData[i].Descricao.toLowerCase();
					if (centro.includes(query)) {
						model.oData[i].visible = true;
					} else {
						model.oData[i].visible = false;
					}
				}
			}
			model.refresh();
		},
		
		onSelecionarCentro: function(oEvent) {
			var myParent = this.myParent;
			var model = myParent.getView().getModel("dialogCentro");
			var indice = oEvent.getSource()._oItemNavigation.iFocusedIndex;
			this.centro = model.oData[indice].Centro;
			myParent.getView().getDependents()[0].getContent()[0].getItems()[0].getItems()[1].setValue(model.oData[indice].Descricao);
			
			this.filtra();
			oEvent.getSource().getParent().close();
			oEvent.getSource().getParent().destroy();
		},
		
		onCloseCentro: function(oEvent) {
			var myParent = this.myParent;
			var model = myParent.getView().getModel("dialogCentro");
			for (var i = 0; i < model.oData.length; i++) {
				model.oData[i].visible = true;
			}
			oEvent.getSource().getParent().close();
			oEvent.getSource().getParent().destroy();
		},

		/* ####################################
		### FUNÇÕES DO DIALOG PLACA CAVALO ####
		#################################### */

		onSearchPlacaCavalo: function(oEvent) {
			var myParent = this.myParent;
			var model = myParent.getView().getModel("placaCavalo");
			var query = oEvent.getParameter("query").toLowerCase();

			if (query === "") {
				for (var i = 0; i < model.oData.length; i++) {
					model.oData[i].visible = true;
				}
			} else {
				for (var i = 0; i < model.oData.length; i++) {
					var PlcCavalo = model.oData[i].PlcCavalo.toLowerCase();
					if (PlcCavalo.includes(query)) {
						model.oData[i].visible = true;
					} else {
						model.oData[i].visible = false;
					}
				}
			}
			model.refresh();
		},

		onSelecionarPlacaCavalo: function(oEvent) {
			var myParent = this.myParent;
			var model = myParent.getView().getModel("placaCavalo");
			var indice = oEvent.getSource()._oItemNavigation.iFocusedIndex;
			this.placaCavalo = model.oData[indice].PlcCavalo;
			myParent.getView().getDependents()[0].getContent()[0].getItems()[1].getItems()[1].setValue(model.oData[indice].PlcCavalo);

			this.filtra();

			oEvent.getSource().getParent().close();
			oEvent.getSource().getParent().destroy();
		},

		onClosePlacaCavalo: function(oEvent) {
			var myParent = this.myParent;
			var model = myParent.getView().getModel("placaCavalo");
			for (var i = 0; i < model.oData.length; i++) {
				model.oData[i].visible = true;
			}
			oEvent.getSource().getParent().close();
			oEvent.getSource().getParent().destroy();
		},

		/* ####################################
		## FUNÇÕES DO DIALOG PLACA CARRETA 1 ##
		#################################### */

		onSearchPlacaCarreta1: function(oEvent) {
			var myParent = this.myParent;
			var model = myParent.getView().getModel("placaCarreta1");
			var query = oEvent.getParameter("query").toLowerCase();

			if (query === "") {
				for (var i = 0; i < model.oData.length; i++) {
					model.oData[i].visible = true;
				}
			} else {
				for (var i = 0; i < model.oData.length; i++) {
					var PlcCarro1 = model.oData[i].PlcCarro1.toLowerCase();
					if (PlcCarro1.includes(query)) {
						model.oData[i].visible = true;
					} else {
						model.oData[i].visible = false;
					}
				}
			}
			model.refresh();
		},

		onSelecionarPlacaCarreta1: function(oEvent) {
			var myParent = this.myParent;
			var model = myParent.getView().getModel("placaCarreta1");
			var indice = oEvent.getSource()._oItemNavigation.iFocusedIndex;
			this.placaCarreta1 = model.oData[indice].PlcCarro1;
			myParent.getView().getDependents()[0].getContent()[0].getItems()[2].getItems()[1].setValue(model.oData[indice].PlcCarro1);

			this.filtra();

			oEvent.getSource().getParent().close();
			oEvent.getSource().getParent().destroy();
		},

		onClosePlacaCarreta1: function(oEvent) {
			var myParent = this.myParent;
			var model = myParent.getView().getModel("placaCarreta1");
			for (var i = 0; i < model.oData.length; i++) {
				model.oData[i].visible = true;
			}
			oEvent.getSource().getParent().close();
			oEvent.getSource().getParent().destroy();
		},

		/* ####################################
		## FUNÇÕES DO DIALOG PLACA CARRETA 2 ##
		#################################### */

		onSearchPlacaCarreta2: function(oEvent) {
			var myParent = this.myParent;
			var model = myParent.getView().getModel("placaCarreta2");
			var query = oEvent.getParameter("query").toLowerCase();

			if (query === "") {
				for (var i = 0; i < model.oData.length; i++) {
					model.oData[i].visible = true;
				}
			} else {
				for (var i = 0; i < model.oData.length; i++) {
					var PlcCarro2 = model.oData[i].PlcCarro2.toLowerCase();
					if (PlcCarro2.includes(query)) {
						model.oData[i].visible = true;
					} else {
						model.oData[i].visible = false;
					}
				}
			}
			model.refresh();
		},

		onSelecionarPlacaCarreta2: function(oEvent) {
			var myParent = this.myParent;
			var model = myParent.getView().getModel("placaCarreta2");
			var indice = oEvent.getSource()._oItemNavigation.iFocusedIndex;
			this.placaCarreta2 = model.oData[indice].PlcCarro2;
			myParent.getView().getDependents()[0].getContent()[0].getItems()[3].getItems()[1].setValue(model.oData[indice].PlcCarro2);

			this.filtra();

			oEvent.getSource().getParent().close();
			oEvent.getSource().getParent().destroy();
		},

		onClosePlacaCarreta2: function(oEvent) {
			var myParent = this.myParent;
			var model = myParent.getView().getModel("placaCarreta2");
			for (var i = 0; i < model.oData.length; i++) {
				model.oData[i].visible = true;
			}
			oEvent.getSource().getParent().close();
			oEvent.getSource().getParent().destroy();
		}

	});
});