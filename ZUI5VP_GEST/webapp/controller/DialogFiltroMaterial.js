sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"monitorPortocel/webServices/apiConnector"
], function(Controller, apiConnector) {
	"use strict";
	return Controller.extend("monitorPortocel.controller.DialogFiltroMaterial", {

		myParent: null,
		selecionados: [],

		constructor: function(parent) {
			this.myParent = parent;
			this.selecionados = [];
		},

		onSearch: function(oEvent) {
			var myParent = this.myParent;

			var novoFiltro = new sap.ui.model.Filter({
				path: "DescMaterial",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: oEvent.getParameter("query")
			});

			var aFilter = [];
			aFilter.push(novoFiltro);

			var stringParam = "/ZET_VPWM_MATERIALSET";
			apiConnector.consumeModel(stringParam, aFilter, {},
				function(oData, oResponse) {
					var json = new sap.ui.model.json.JSONModel();
					json.setData(oData.results);
					myParent.getView().setModel(json, "filtroMaterial");
				},
				function(err) {
					sap.m.MessageToast.show("Erro");
				});
		},

		onSelecionarMaterial: function(oEvent) {
			var myParent = this.myParent;
			var model = myParent.getView().getModel("filtroMaterial");
			var indice = oEvent.getSource()._oItemNavigation.iFocusedIndex;

			if (model.oData[indice].MatSelected === "Selecionado") {
				model.oData[indice].MatSelected = "";
				model.refresh();
				
				if(this.selecionados.includes(indice)) {
					this.selecionados.splice(this.selecionados.indexOf(indice), 1);
				}
				
			} else {
				model.oData[indice].MatSelected = "Selecionado";
				model.refresh();
				this.selecionados.push(indice);
			}
		},

		onCloseMaterial: function(oEvent) {
			var myParent = this.myParent;
			var model = myParent.getView().getModel("filtroMaterial");

			for (var i = 0; i < this.selecionados.length; i++) {
				model.oData[this.selecionados[i]].MatSelected = "";
			}
			
			oEvent.getSource().getParent().close();
			oEvent.getSource().getParent().destroy();
		},

		onApplyFilterMaterial: function(oEvent) {
			var myParent = this.myParent;
			var model = myParent.getView().getModel("filtroMaterial");

			var tamanhoFiltro = myParent.aFilters.length;
			var contador = 0;
			while (contador < tamanhoFiltro) {
				if (myParent.aFilters[contador].sPath === "Material") {
					myParent.aFilters.splice(contador, 1);
					contador--;
					tamanhoFiltro--;
				}
				contador++;
			}

			var stringParaOInput = "";
			for (var i = 0; i < model.oData.length; i++) {
				if (model.oData[i].MatSelected === "Selecionado") {
					var novoFiltro = new sap.ui.model.Filter({
						path: "Material",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: model.oData[i].Material
					});
					myParent.aFilters.push(novoFiltro);
					stringParaOInput += model.oData[i].DescMaterial + " ";
				}
			}
			
			myParent.getView().byId("inptMaterial").setValue(stringParaOInput);
			myParent.loadTrucksOnTheMap();
			oEvent.getSource().getParent().close();
			oEvent.getSource().getParent().destroy();
		}

	});
});