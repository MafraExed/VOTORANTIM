sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"monitorPortocel/webServices/apiConnector"
], function(Controller, apiConnector) {
	"use strict";
	return Controller.extend("monitorPortocel.controller.DialogFiltroEtapa", {

		myParent: null,
		aFilter: [],
		selecionados: [],
		etapaDoFiltro: null,

		constructor: function(parent) {
			this.myParent = parent;
			this.aFilters = [];
			this.selecionados = [];
			this.etapaDoFiltro = null;

			var myParent = this.myParent;
			var oView = myParent.getView();
			var model = myParent.getView().getModel("filtroEtapa");
			if (model) {
				for (var i = 0; i < model.oData.length; i++) {
					if (model.oData[i].EtapaSelected === "Selecionado") {
						this.etapaDoFiltro = i;
					}
				}
			}
		},

		onFilterByCentroOrigem: function() {
			var myParent = this.myParent;
			var oView = myParent.getView();
			this.startModelCentro();
			var oDialog = sap.ui.xmlfragment("monitorPortocel.view.DialogFiltroEtapa_CentroOrigem", this);
			oView.addDependent(oDialog);
			oDialog.open();
		},

		onFilterByDestino: function() {
			var myParent = this.myParent;
			var oView = myParent.getView();
			this.startModelDestino();
			var oDialog = sap.ui.xmlfragment("monitorPortocel.view.DialogFiltroEtapa_Destino", this);
			oView.addDependent(oDialog);
			oDialog.open();
		},

		loadEtapas: function() {
			var myParent = this.myParent;
			var oView = myParent.getView();
			var centroOrigem = oView.getModel("selecionados").oData.centroOrigem;
			var centroDestino = oView.getModel("selecionados").oData.centroDestino;
			var depositoDestino = oView.getModel("selecionados").oData.depositoDestino;

			if (centroOrigem !== "" && centroDestino !== "" && depositoDestino !== "") {
				var aFilter = [];
				aFilter.push(new sap.ui.model.Filter({
					path: "CentroOrigem",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: centroOrigem
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
					function(oData, oResponse) {
						for (var i = 0; i < oData.results.length; i++) {
							oData.results[i].Etapa = oData.results[i].Etapa.trim();
						}

						var json = new sap.ui.model.json.JSONModel();
						json.setData(oData.results);
						oView.setModel(json, "filtroEtapa");
					},

					function(err) {
						sap.m.MessageToast.show("Erro");
					});

			} else {
				var json = new sap.ui.model.json.JSONModel();
				oView.setModel(json, "filtroEtapa");
				this.limpaFiltrosVelhos();
			}

		},

		onEtapaSelecionada: function(oEvent) {
			var myParent = this.myParent;
			var model = myParent.getView().getModel("filtroEtapa");
			var indice = oEvent.getSource().getBindingContextPath().split("/")[1];

			if (model.oData[indice].EtapaSelected === "Selecionado") {
				model.oData[indice].EtapaSelected = "";
				model.refresh();
				
				if(this.selecionados.includes(indice)) {
					this.selecionados.splice(this.selecionados.indexOf(indice), 1);
				}
				
				
			} else {
				model.oData[indice].EtapaSelected = "Selecionado";
				model.refresh();
				this.selecionados.push(indice);
			}
		},

		onClose: function(oEvent) {
			var myParent = this.myParent;
			var model = myParent.getView().getModel("filtroEtapa");
			
			if (model) {
				for (var i = 0; i < this.selecionados.length; i++) {
					model.oData[this.selecionados[i]].EtapaSelected = "";
				}
			}

			oEvent.getSource().getParent().close();
			oEvent.getSource().getParent().destroy();
		},

		onApplyFilter: function(oEvent) {
			var myParent = this.myParent;
			var model = myParent.getView().getModel("filtroEtapa");
			this.limpaFiltrosVelhos();

			var stringParaOInput = "";
			for (var i = 0; i < model.oData.length; i++) {
				if (model.oData[i].EtapaSelected === "Selecionado") {
					var novoFiltro = new sap.ui.model.Filter({
						path: "CentroOrigem",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: model.oData[i].CentroOrigem
					});
					myParent.aFilters.push(novoFiltro);

					novoFiltro = new sap.ui.model.Filter({
						path: "Etapa",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: model.oData[i].Etapa
					});
					myParent.aFilters.push(novoFiltro);

					novoFiltro = new sap.ui.model.Filter({
						path: "CentroDestino",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: model.oData[i].CentroDestino
					});
					myParent.aFilters.push(novoFiltro);

					novoFiltro = new sap.ui.model.Filter({
						path: "DepositoDestino",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: model.oData[i].DepositoDestino
					});
					myParent.aFilters.push(novoFiltro);

					stringParaOInput += model.oData[i].Etapa + " ";
				}
			}
			myParent.getView().byId("inptEtapa").setValue(stringParaOInput);
			myParent.loadTrucksOnTheMap();

			oEvent.getSource().getParent().close();
			oEvent.getSource().getParent().destroy();
		},

		limpaFiltrosVelhos: function() {
			var myParent = this.myParent;

			var tamanhoFiltro = myParent.aFilters.length;
			var contador = 0;
			while (contador < tamanhoFiltro) {
				if (myParent.aFilters[contador].sPath === "Etapa") {
					myParent.aFilters.splice(contador, 1);
					contador--;
					tamanhoFiltro--;
				}
				contador++;
			}
			tamanhoFiltro = myParent.aFilters.length;
			contador = 0;
			while (contador < tamanhoFiltro) {
				if (myParent.aFilters[contador].sPath === "CentroOrigem") {
					myParent.aFilters.splice(contador, 1);
					contador--;
					tamanhoFiltro--;
				}
				contador++;
			}
			tamanhoFiltro = myParent.aFilters.length;
			contador = 0;
			while (contador < tamanhoFiltro) {
				if (myParent.aFilters[contador].sPath === "CentroDestino") {
					myParent.aFilters.splice(contador, 1);
					contador--;
					tamanhoFiltro--;
				}
				contador++;
			}
			tamanhoFiltro = myParent.aFilters.length;
			contador = 0;
			while (contador < tamanhoFiltro) {
				if (myParent.aFilters[contador].sPath === "DepositoDestino") {
					myParent.aFilters.splice(contador, 1);
					contador--;
					tamanhoFiltro--;
				}
				contador++;
			}
		},

		/*filtra: function() {
			var myParent = this.myParent;
			var novoFiltro;

			if (this.centroOrigem !== "") {
				novoFiltro = new sap.ui.model.Filter({
					path: "CentroOrigem",
					operator: sap.ui.model.FilterOperator.Contains,
					value1: this.centroOrigem
				});
				this.aFilter.push(novoFiltro);
			}
			if (this.centroDestino !== "") {
				novoFiltro = new sap.ui.model.Filter({
					path: "CentroDestino",
					operator: sap.ui.model.FilterOperator.Contains,
					value1: this.centroDestino
				});
				this.aFilter.push(novoFiltro);
			}
			if (this.depositoDestino !== "") {
				novoFiltro = new sap.ui.model.Filter({
					path: "DepositoDestino",
					operator: sap.ui.model.FilterOperator.Contains,
					value1: this.depositoDestino
				});
				this.aFilter.push(novoFiltro);
			}

			var stringParam = "/ZET_VPWM_VIAGENSSET";
			apiConnector.consumeModel(stringParam, this.aFilter, {},
				function(oData, oResponse) {
					var json = new sap.ui.model.json.JSONModel();
					json.setData(oData.results);
					myParent.getView().setModel(json, "filtroEtapa");
				},
				function(err) {
					sap.m.MessageToast.show("Erro");
				});

		},*/

		/* ####################################
		### FUNÇÕES DO DIALOG CENTRO ORIGEM ###
		#################################### */

		onSelecionarCentroOrigem: function(oEvent) {
			var myParent = this.myParent;
			var oView = myParent.getView();
			var indice = oEvent.getSource().getBindingContextPath().split("/")[1];
			var descricao = oView.getModel("selecionados").oData.centroOrigemDescr  = oEvent.getSource().getModel("centros").getData()[indice].Descricao;
			oView.getModel("selecionados").oData.centroOrigem = oEvent.getSource().getModel("centros").getData()[indice].Centro;

			
			var DialogEtapas = oView.getDependents()[0].getContent()[0].getItems()[1].getItems()[1];
			DialogEtapas.setEnabled(true);

			oView.getDependents()[0].getContent()[0].getItems()[0].getItems()[1].setValue(descricao);
			oView.getDependents()[0].getContent()[0].getItems()[1].getItems()[1].setValue("");
			oView.getModel("selecionados").oData.centroDestino = "";
			oView.getModel("selecionados").oData.depositoDestino = "";

			this.loadEtapas();

			oEvent.getSource().getParent().getParent().close();
			oEvent.getSource().getParent().getParent().destroy();
		},

		onCloseCentroOrigem: function(oEvent) {
			oEvent.getSource().getParent().close();
			oEvent.getSource().getParent().destroy();
		},

		/* ####################################
		###### FUNÇÕES DO DIALOG DESTINO ######
		#################################### */

		onSelecionarDestinos: function(oEvent) {
			var oView = this.myParent.getView();
			var indice = oEvent.getSource().getBindingContextPath().split("/")[1];
			var destinos = oEvent.getSource().getModel("destinos").getData()[indice];
			var descrCentro = oView.getModel("selecionados").oData.centroDestinoDescr = destinos.DescricaoCentroDestino;
			var descrDeposito = oView.getModel("selecionados").oData.depositoDescr = destinos.DescricaoDeposito;

			oView.getModel("selecionados").oData.centroDestino = destinos.CentroDestino;
			oView.getModel("selecionados").oData.depositoDestino = destinos.Deposito;

			oView.getDependents()[0].getContent()[0].getItems()[1].getItems()[1].setValue(descrDeposito);

			this.loadEtapas();

			oEvent.getSource().getParent().getParent().close();
			oEvent.getSource().getParent().getParent().destroy();
		},

		onCloseDestinos: function(oEvent) {
			oEvent.getSource().getParent().close();
			oEvent.getSource().getParent().destroy();
		},

		/* ####################################
		############# START MODELS ############
		#################################### */

		startModelCentro: function() {
			var myParent = this.myParent;
			var oView = myParent.getView();

			var stringParam = "/ZET_VPWM_CENTRO_DESCRICAOSSET";
			apiConnector.consumeModel(stringParam, {}, {},
				function(oDataDestino, oResponseDestino) {
					var jsonDestino = new sap.ui.model.json.JSONModel();
					jsonDestino.setData(oDataDestino.results);
					oView.setModel(jsonDestino, "centros");
				},
				function(err) {
					sap.m.MessageToast.show("Erro Centro");
				});
		},

		startModelDestino: function() {
			var myParent = this.myParent;
			var oView = myParent.getView();
			var centro = oView.getModel("selecionados").oData.centroOrigem;

			var aFilter = [];
			if (centro !== "") {
				aFilter.push(new sap.ui.model.Filter({
					path: "CentroOrigem",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: centro
				}));
			}

			var stringParam = "/ZET_VPWM_DESTINOSET";
			apiConnector.consumeModel(stringParam, aFilter, {},
				function(oDataDestino, oResponseDestino) {
					var jsonDestino = new sap.ui.model.json.JSONModel();
					jsonDestino.setData(oDataDestino.results);
					oView.setModel(jsonDestino, "destinos");
				},
				function(err) {
					sap.m.MessageToast.show("Erro Destino");
				});
		}

	});
});