sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"monitorPortocel/webServices/apiConnector"
], function(Controller, apiConnector) {
	"use strict";
	return Controller.extend("monitorPortocel.controller.DialogFiltroMotorista", {

		myParent: null,
		selecionados: [],

		constructor: function(parent) {
			this.myParent = parent;
			this.selecionados = [];
		},

		onSearch: function(oEvent) {
			var myParent = this.myParent;

			var novoFiltro = new sap.ui.model.Filter({
				path: "Nome",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: oEvent.getParameter("query")
			});

			var aFilter = [];
			aFilter.push(novoFiltro);

			var stringParam = "/ZET_VPWM_MOTORISTASET";
			apiConnector.consumeModel(stringParam, aFilter, {},
				function(oData, oResponse) {
					var json = new sap.ui.model.json.JSONModel();
					json.setData(oData.results);
					myParent.getView().setModel(json, "filtroMotorista");
				},
				function(err) {
					sap.m.MessageToast.show("Erro");
				});
		},

		onSelecionar: function(oEvent) {
			var myParent = this.myParent;
			var model = myParent.getView().getModel("filtroMotorista");
			var indice = oEvent.getSource()._oItemNavigation.iFocusedIndex;

			if (model.oData[indice].MotSelected === "Selecionado") {
				model.oData[indice].MotSelected = "";
				model.refresh();

				if (this.selecionados.includes(indice)) {
					this.selecionados.splice(this.selecionados.indexOf(indice), 1);
				}

			} else {
				model.oData[indice].MotSelected = "Selecionado";
				model.refresh();
				this.selecionados.push(indice);
			}
		},

		onClose: function(oEvent) {
			var myParent = this.myParent;
			var model = myParent.getView().getModel("filtroMotorista");
			
			if(model) {
				for (var i = 0; i < this.selecionados.length; i++) {
					model.oData[this.selecionados[i]].MotSelected = "";
				}
			}

			oEvent.getSource().getParent().close();
			oEvent.getSource().getParent().destroy();
		},

		onApply: function(oEvent) {
			var myParent = this.myParent;
			var model = myParent.getView().getModel("filtroMotorista");

			var tamanhoFiltro = myParent.aFilters.length;
			var contador = 0;
			while (contador < tamanhoFiltro) {
				if (myParent.aFilters[contador].sPath === "Usuario") {
					myParent.aFilters.splice(contador, 1);
					contador--;
					tamanhoFiltro--;
				}
				contador++;
			}

			var stringParaOInput = "";
			for (var i = 0; i < model.oData.length; i++) {
				if (model.oData[i].MotSelected === "Selecionado") {
					var novoFiltro = new sap.ui.model.Filter({
						path: "Usuario",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: model.oData[i].Usuario
					});
					myParent.aFilters.push(novoFiltro);
					stringParaOInput += model.oData[i].Nome + " ";
				}
			}
			
			myParent.getView().byId("inptMotorista").setValue(stringParaOInput);
			myParent.loadTrucksOnTheMap();

			oEvent.getSource().getParent().close();
			oEvent.getSource().getParent().destroy();
		}

	});
});