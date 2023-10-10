sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History", "sap/ui/Device"], function(Controller, History, Device) {
	"use strict";

	return Controller.extend("com.sap.dashboardappDashboardApp.controller.Detail", {
		onInit: function() {
			if (sap.ui.Device.system.phone == true) {
				this.byId("vboxEntradaCaminhao").addStyleClass("spaceTop");
				
				this.byId("xboxSaidaTrem").addStyleClass("spaceTop");
				this.byId("xboxSaidaCaminhao").addStyleClass("spaceTop");
				// this.byId("listSaidaCaminhao").addStyleClass("spaceTop");
				
				// this.byId("listEstoqueDiario").addStyleClass("spaceTop");
			}
			
			this.carregaInformacoes();
			this.carregaLista();
		},
		carregaLista: function(oEvent) {
			var codTerm = sap.ui.getCore().getModel("codterm");
			
			var diaDetalhe = sap.ui.getCore().getModel("diaDetalhe");
			var param = "filter=Codterm+eq+%27" + codTerm + "%27+and+Data+eq+%27" + diaDetalhe + "%27";
			var JSONModelEntradaTrem = new sap.ui.model.json.JSONModel();
			var JSONModelEntradaCaminhao = new sap.ui.model.json.JSONModel();
			var JSONModelSaidaNavio = new sap.ui.model.json.JSONModel();
			var JSONModelSaidaTrem = new sap.ui.model.json.JSONModel();
			var JSONModelSaidaCaminhao = new sap.ui.model.json.JSONModel();
			var JSONModelEstoqueTotal = new sap.ui.model.json.JSONModel();
			var me = this;
			var oModel = sap.ui.getCore().getModel();
			this.byId("iconTabBar").setBusy(true);
			oModel.read("ZET_VPWM_DETALHESSet?%24" + param, {
				success: function(oData, oResponse) {
					var entradaTrem = [];
					var entradaCaminhao = [];
					var saidaTrem = [];
					var saidaCaminhao = [];
					var saidaNavio = [];
					var estoqueDiario = [];
					var totalAvaria = 0;
					var totalVolume = 0;
					var totalVolumeNavio = 0;
					var totalVolumeTrem = 0;
					var totalVolumeCaminhao = 0;
					var totalEstoque = 0;
					for (var i = 0; i < oData.results.length; i++) {
						switch (oData.results[i].Tipo) {
							case 'EN':
								switch (oData.results[i].Transporte) {
									case 'F':
										entradaTrem.push({
											material: oData.results[i].Material,
											peso: oData.results[i].Peso + " T",
											icon: oData.results[i].Icon,
											listType: oData.results[i].ListType
										});
										break;
									case 'R':
										entradaCaminhao.push({
											material: oData.results[i].Material,
											peso: oData.results[i].Peso + " T",
											icon: oData.results[i].Icon,
											listType: oData.results[i].ListType
										});
										break;
								}
								break;
							case 'SA':
								switch (oData.results[i].Transporte) {
									case 'F':
										saidaTrem.push({
											material: oData.results[i].Material,
											peso: oData.results[i].Peso + " T",
											icon: oData.results[i].Icon,
											listType: oData.results[i].ListType
										});
										totalVolumeTrem += parseInt(oData.results[i].Peso);
										break;
									case 'R':
										saidaCaminhao.push({
											material: oData.results[i].Material,
											peso: oData.results[i].Peso + " T",
											icon: oData.results[i].Icon,
											listType: oData.results[i].ListType
										});
										totalVolumeCaminhao += parseInt(oData.results[i].Peso);
										break;
									case 'M':
										saidaNavio.push({
											material: oData.results[i].Material,
											peso: oData.results[i].Peso + " T",
											icon: oData.results[i].Icon,
											listType: oData.results[i].ListType,
											avaria: oData.results[i].Avaria
										});
										totalVolumeNavio += parseInt(oData.results[i].Peso);
										if (oData.results[i].Avaria != "") {
											totalAvaria += parseInt(oData.results[i].Avaria);
										}

										break;
								}
								break;
							case 'NO':
								me.byId("nomeNavio").setText(oData.results[i].NomesNavios);
								break;
							case 'ES':
								var antigo;
								if (oData.results[i].Transporte > 0) {
									antigo = "Antigo:" + oData.results[i].Transporte + " T";
								} else {
									antigo = "";
								}
								
								estoqueDiario.push({
									material: oData.results[i].Material,
									peso: "Código: " + oData.results[i].NomesNavios.replace(/^(0+)/g, '') + " - Saldo: " + oData.results[i].Peso + " T",
									icon: oData.results[i].Icon,
									listType: oData.results[i].ListType,
									codmat: oData.results[i].NomesNavios,
									antigo: oData.results[i].Avaria,
									cargaAntiga: antigo
								});
								totalEstoque += parseInt(oData.results[i].Peso);
								break;
						}
					}
					if (saidaNavio.length == 0) {
						me.byId("vendaNavio").setVisible(false);
					} else {
						me.byId("vendaNavio").setVisible(true);
					}
					if (saidaNavio.length == 0 &&
						saidaCaminhao.length == 0 &&
						saidaTrem.length == 0) {
						me.byId("abaSaida").setVisible(false);
						me.byId("abaSaida2").setVisible(false);
					} else {
						me.byId("abaSaida").setVisible(true);
						me.byId("abaSaida2").setVisible(true);
					}
					if (estoqueDiario.length == 0) {
						me.byId("abaEstoque").setVisible(false);
						me.byId("abaEstoque2").setVisible(false);
					} else {
						me.byId("abaEstoque").setVisible(true);
						me.byId("abaEstoque2").setVisible(true);
					}

					totalVolume = totalVolumeCaminhao + totalVolumeTrem + totalVolumeNavio;
					me.byId("volumeTotal").setText(totalVolume + " T");
					me.byId("totalAvarias").setText(totalAvaria + " T");

					me.byId("qtdeVendidaNavio").setText(totalVolumeNavio + " T");
					me.byId("qtdeAvaria").setText(totalAvaria + " T");
					me.byId("qtdeVendidaTrem").setText(totalVolumeTrem + " T");
					me.byId("qtdeVendidaCaminhao").setText(totalVolumeCaminhao + " T");

					me.byId("estoqueTotal").setText(totalEstoque + " T");

					JSONModelEntradaTrem.setData(entradaTrem);
					JSONModelEntradaCaminhao.setData(entradaCaminhao);
					JSONModelSaidaNavio.setData(saidaNavio);
					JSONModelSaidaTrem.setData(saidaTrem);
					JSONModelSaidaCaminhao.setData(saidaCaminhao);
					JSONModelEstoqueTotal.setData(estoqueDiario);
					
					me.byId("iconTabBar").setBusy(false);
					me.onAtulizaCores();
				},
				error: function(erro) {
					console.log(erro);
				}
			});
			this.byId("listEntradaCaminhao").setModel(JSONModelEntradaCaminhao);
			this.byId("listEntradaTrem").setModel(JSONModelEntradaTrem);
			this.byId("listSaidaNavio").setModel(JSONModelSaidaNavio);
			this.byId("listSaidaTrem").setModel(JSONModelSaidaTrem);
			this.byId("listSaidaCaminhao").setModel(JSONModelSaidaCaminhao);
			this.byId("listEstoqueDiario").setModel(JSONModelEstoqueTotal);

		},
		carregaInformacoes: function() {
			var totalRecebido = sap.ui.getCore().getModel("totalRecebido") + " T";
			var cargaTrem = sap.ui.getCore().getModel("cargaTrem") + " T";
			var cargaCaminhao = sap.ui.getCore().getModel("cargaCaminhao") + " T";
			var dataTopo = sap.ui.getCore().getModel("dataTopo");

			this.byId("dataTopo").setText(dataTopo);
			this.byId("totalRecebido").setText(totalRecebido);
			this.byId("cargaTrem").setText(cargaTrem);
			this.byId("cargaCaminhao").setText(cargaCaminhao);

			this.byId("abaSaida").setVisible(false);
			this.byId("abaSaida2").setVisible(false);

			this.byId("abaEstoque").setVisible(false);
			this.byId("abaEstoque2").setVisible(false);

			this.byId("iconTabBar").setSelectedKey("__filter0");
		},
		onNavBack: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("master", {}, true);
		},
		onPressLocalEstoque: function(oEvent) {
			var path = oEvent.getSource().getBindingContext().getPath().split("/")[1];
			var codMat = oEvent.getSource().getModel().getData()[path].codmat;
			sap.ui.getCore().setModel(codMat, "codMat");
			if (this.getView().getParent().getParent().getDetailPages()[1] != undefined) {
				this.getView().getParent().getParent().getDetailPages()[1].getController().carregaInformacoes();
			}

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("localEstoque", {}, true);
		},
		onAtulizaCores: function(oEvent){
		  	for (var i=0; i< this.byId("listEstoqueDiario").getModel().getData().length; i++) {
		  		if(this.byId("listEstoqueDiario").getModel().getData()[i].antigo == "X"){
		  			this.byId("listEstoqueDiario").getItems()[i].addStyleClass("antigo");
		  		}
		  	}
		  	
		}

	});

}, /* bExport= */ true);