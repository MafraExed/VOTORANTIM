sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"monitorPortocel/webServices/apiConnector"
], function(Controller, JSONModel, apiConnector) {
	"use strict";

	return Controller.extend("monitorPortocel.controller.DetalhesMeta", {

		primeiraData: "",
		segundaData: "",
		tituloDaLista: "Viagens da etapa",
		acimaDaMedia: "",

		onInit: function() {
			if (sap.ui.Device.system.phone) {
				this.getView().byId("colunaMotorista").setWidth("100px");
				this.getView().byId("colunaOrigem").setWidth("100px");
				this.getView().byId("colunaDestino").setWidth("100px");
				this.getView().byId("colunaCod").setWidth("100px");
				this.getView().byId("colunaInicio").setWidth("100px");
				this.getView().byId("colunaFim").setWidth("100px");
			}
			if (this.byId("idVizFrame") !== undefined) {
				this.byId("idVizFrame").setBusyIndicatorDelay(1);
				this.byId("idVizFrame").setBusy(true);
			}
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("dadosMeta", "meta", this.carregaModelo, this);
		},

		carregaModelo: function(sChanel, sEvent, params) {
			if (this.byId("tableViagens") !== undefined) {
				this.byId("tableViagens").setHeaderText(this.tituloDaLista);
			}
			this.acimaDaMedia = params.acimaDaMedia;
			var json = new JSONModel();
			json.setData({});
			this.getView().setModel(json, "motoristas");

			this.primeiraData = params.primeiraData;
			this.segundaData = params.segundaData;

			var oView = this.getView();
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
				path: "AcimaDaMedia",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: params.acimaDaMedia
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "Data",
				operator: sap.ui.model.FilterOperator.BT,
				value1: params.primeiraData,
				value2: params.segundaData
			}));

			var me = this;
			var stringParam = "/ZET_VPWM_ET_CICLOSSET";
			apiConnector.consumeModel(stringParam, aFilter, {},
				function(oData, oResponse) {
					var modelo = new sap.ui.model.json.JSONModel();
					modelo.setData(oData.results);
					oView.setModel(modelo, "detalhesEtapa");
					if (me.byId("idVizFrame") !== undefined) {
						me.byId("idVizFrame").setBusy(false);
					}
				},
				function(err) {
					sap.m.MessageToast.show("Erro");
				});
		},

		onSelectMeta: function(oEvent) {
			var clicado = oEvent.getParameter("data")[0].data._context_row_number;
			var model = this.getView().getModel("detalhesEtapa");

			var descrEtapa = model.oData[clicado].DescricaoEtapa;
			if (descrEtapa[0] === " ") {
				this.byId("tableViagens").setHeaderText(this.tituloDaLista + descrEtapa);
			} else {
				var descr = " ";
				descr += descrEtapa;
				this.byId("tableViagens").setHeaderText(this.tituloDaLista + descr);
			}

			var centroOrigem = model.oData[clicado].CentroOrigem;
			var centroDestino = model.oData[clicado].CentroDestino;
			var depositoDestino = model.oData[clicado].DepositoDestino;
			var acimaDaMedia = this.acimaDaMedia; //model.oData[clicado].AcimaDaMedia;
			var etapa = model.oData[clicado].Etapa.trim();

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
			aFilter.push(new sap.ui.model.Filter({
				path: "AcimaDaMedia",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: acimaDaMedia
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "DataInicio",
				operator: sap.ui.model.FilterOperator.BT,
				value1: this.primeiraData,
				value2: this.segundaData
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "Etapa",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: etapa
			}));

			var oView = this.getView();
			var stringParam = "/ZET_VPWM_DETALHES_ETAPASET";
			apiConnector.consumeModel(stringParam, aFilter, {},
				function(data, response) {
					for (var i = 0; i < data.results.length; i++) {
						var anoInicio = data.results[i].DataInicio.substring(0, 4);
						var mesInicio = data.results[i].DataInicio.substring(4, 6);
						var diaInicio = data.results[i].DataInicio.substring(6, 8);
						var horaInicio = data.results[i].HoraInicio.substring(0, 2);
						var minInicio = data.results[i].HoraInicio.substring(2, 4);
						var segInicio = data.results[i].HoraInicio.substring(4, 6);

						var anoFim = data.results[i].DataFim.substring(0, 4);
						var mesFim = data.results[i].DataFim.substring(4, 6);
						var diaFim = data.results[i].DataFim.substring(6, 8);
						var horaFim = data.results[i].HoraFim.substring(0, 2);
						var minFim = data.results[i].HoraFim.substring(2, 4);
						var segFim = data.results[i].HoraFim.substring(4, 6);

						data.results[i].formatDataIni = diaInicio + "/" + mesInicio + "/" + anoInicio;
						data.results[i].formatHoraIni = horaInicio + ":" + minInicio + ":" + segInicio;
						data.results[i].formatDataFim = diaFim + "/" + mesFim + "/" + anoFim;
						data.results[i].formatHoraFim = horaFim + ":" + minFim + ":" + segFim;
					}

					var json = new sap.ui.model.json.JSONModel();
					json.setData(data.results);
					oView.setModel(json, "motoristas");
				},
				function(err) {
					sap.m.MessageToast.show("Erro");
				});
		},

		onNavBack: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("grafico", {}, true);
		}

	});

});