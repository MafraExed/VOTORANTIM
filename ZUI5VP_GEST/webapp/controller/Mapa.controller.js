sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"monitorPortocel/controller/DialogDadosDoSpot",
	"monitorPortocel/controller/DialogFiltroMaterial",
	"monitorPortocel/controller/DialogFiltroMotorista",
	"monitorPortocel/controller/DialogFiltroCaminhao",
	"monitorPortocel/controller/DialogFiltroEtapa",
	"monitorPortocel/webServices/apiConnector"
], function(Controller, MessageToast, DialogDadosDoSpot, DialogFiltroMaterial, DialogFiltroMotorista, DialogFiltroCaminhao,
	DialogFiltroEtapa, apiConnector) {
	"use strict";

	return Controller.extend("monitorPortocel.controller.Mapa", {

		aFilters: [],
		compFilter: [],
		matFilter: [],
		timerAtualizaMapa: null,
		checkBoxSelecionados: [false, true, true, true],

		onInit: function() {
			var accessTokenMapbox =
				'pk.eyJ1IjoiZmlicmlhc3V6YW5vIiwiYSI6ImNqdGswNjFpNTA2NGs0M29pOXY3OWk0a3EifQ.NIbh_jZHNxs5zfnsr1noMg';
			var oGeoMap = this.getView().byId("geoMap");
			var oMapConfig = {
				"MapProvider": {
					"name": "MAPBOX_STARTER",
					"type": "",
					"description": "",
					"tileX": "256",
					"tileY": "256",
					"maxLOD": "20",
					"copyright": "Tiles Courtesy of MapBox.com",
					"Source": [{
						"id": "s1",
						"url": "https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{LOD}/{X}/{Y}@2x?access_token=" + accessTokenMapbox
					}]
				},
				"MapLayerStacks": {
					"name": "Default",
					"MapLayer": [{
						"name": "MapBox",
						"refMapProvider": "MAPBOX_STARTER",
						"opacity": "1",
						"colBkgnd": "RGB(255,255,255)"
					}]
				}
			};
			oGeoMap.setMapConfiguration(oMapConfig);
			oGeoMap.setRefMapLayerStack("Default");

			var oView = this.getView();
			oView.addEventDelegate({
				onAfterRendering: function(oEvent) {
					var me = this;
					// this.timerAtualizaMapa = window.setInterval(function() {
					// 	var stringParam = "/ZET_VPWM_VIAGENSSET";
					// 	apiConnector.consumeModel(stringParam, me.aFilters, {},
					// 		function(oData, oResponse) {
					// 			for (var i = 0; i < oData.results.length; i++) {
					// 				oData.results[i].Etapa = oData.results[i].Etapa.trim();
					// 			}
					// 			var json = new sap.ui.model.json.JSONModel();
					// 			json.setData(oData.results);
					// 			me.getView().setModel(json, "spots");
					// 		},
					// 		function(err) {
					// 			sap.m.MessageToast.show("Erro");
					// 		});
					// }, 10000);
					clearInterval(window.timerMapa);
					me.onIniciaTimer();
					me.loadTrucksOnTheMap();
				}
			}, this);
		},

		onAtualizarMapa: function(Event) {
			this.loadTrucksOnTheMap();
		},
		loadTrucksOnTheMap: function() {
			var me = this;
			var stringParam = "/ZET_VPWM_VIAGENSSET";
			apiConnector.consumeModel(stringParam, me.aFilters, {},
				function(oData, oResponse) {
					for (var i = 0; i < oData.results.length; i++) {
						oData.results[i].Etapa = oData.results[i].Etapa.trim();
					}

					var json = new sap.ui.model.json.JSONModel();
					json.setData(oData.results);
					me.getView().setModel(json, "spots");
					me.getView().getModel("spots").refresh();
				},
				function(err) {
					sap.m.MessageToast.show("Erro");
				});
		},

		handleRouteMatched: function(oEvent) {
			// var oParams = {};

			// if (oEvent.mParameters.data.context) {
			// 	this.sContext = oEvent.mParameters.data.context;
			// 	var oPath;
			// 	if (this.sContext) {
			// 		oPath = {
			// 			path: "/" + this.sContext,
			// 			parameters: oParams
			// 		};
			// 		this.getView().bindObject(oPath);
			// 	}
			// }

		},

		_onSpotClick: function(oEvent) {
			var me = this;
			var oView = this.getView();
			var model = oView.getModel("spots");

			var spotSelecionado = oEvent.getSource().oBindingContexts.spots.getPath().split("/")[1];

			var json = new sap.ui.model.json.JSONModel();
			json.setData(model.oData[spotSelecionado]);
			me.getView().setModel(json, "spotSelecionado");

			if (model.oData[spotSelecionado].Tipo == "E") {
				var filterExtra = [];

				var chaveExtra = "(CentroOrigem='" + model.oData[spotSelecionado].CentroOrigem +
					"',CentroDestino='" + model.oData[spotSelecionado].CentroDestino +
					"',DepositoDestino='" + model.oData[spotSelecionado].DepositoDestino +
					"',Etapa='" + model.oData[spotSelecionado].Etapa +
					"',Composicao='" + model.oData[spotSelecionado].Composicao +
					"',DataInicio='" + model.oData[spotSelecionado].DataInicio +
					"',HoraInicio='" + model.oData[spotSelecionado].HoraInicio + "')";

				var stringParamExtra = "/ZET_VPWM_EXTRA_REGI_ETAPASET" + chaveExtra;
				apiConnector.consumeModel(stringParamExtra, filterExtra, {},
					function(oData, oResponse) {
						var json = new sap.ui.model.json.JSONModel();
						json.setData(oData);
						if (oData.Descricao != "") {
							oData.exibe = true;
						} else {
							oData.exibe = false;
						}
						me.getView().setModel(json, "dadosSpotExtra");
					},

					function(err) {
						//sap.m.MessageToast.show("Erro");
						var json = new sap.ui.model.json.JSONModel();

						var oData = {
							"exibe": false
						};
						json.setData(oData);
						me.getView().setModel(json, "dadosSpotExtra");
					});
			} else {
				var json = new sap.ui.model.json.JSONModel();

				var oData = {
					"exibe": false
				};
				json.setData(oData);
				me.getView().setModel(json, "dadosSpotExtra");
			}

			var filter = [];
			filter.push(new sap.ui.model.Filter({
				path: "Composicao",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: model.oData[spotSelecionado].Composicao
			}));
			filter.push(new sap.ui.model.Filter({
				path: "Viagem",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: model.oData[spotSelecionado].Viagem
			}));
			filter.push(new sap.ui.model.Filter({
				path: "Oc",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: model.oData[spotSelecionado].Oc
			}));
			filter.push(new sap.ui.model.Filter({
				path: "ItemOc",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: model.oData[spotSelecionado].ItemOc
			}));

			var stringParam = "/ZET_VPWM_MAT_COMPSET";
			apiConnector.consumeModel(stringParam, filter, {},
				function(oData, oResponse) {
					var json = new sap.ui.model.json.JSONModel();
					json.setData(oData.results);
					me.getView().setModel(json, "dadosSpot");
				},

				function(err) {
					sap.m.MessageToast.show("Erro");
				});

			var filter2 = [];
			filter2.push(new sap.ui.model.Filter({
				path: "CentroOrigem",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: model.oData[spotSelecionado].CentroOrigem
			}));
			filter2.push(new sap.ui.model.Filter({
				path: "CentroDestino",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: model.oData[spotSelecionado].CentroDestino
			}));
			filter2.push(new sap.ui.model.Filter({
				path: "DepositoDestino",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: model.oData[spotSelecionado].DepositoDestino
			}));
			filter2.push(new sap.ui.model.Filter({
				path: "Composicao",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: model.oData[spotSelecionado].Composicao
			}));

			stringParam = "/ZET_VPWM_COMP_MINSET";
			apiConnector.consumeModel(stringParam, filter2, {},
				function(oData, oResponse) {
					var json = new sap.ui.model.json.JSONModel();
					json.setData(oData.results);
					me.getView().setModel(json, "graficoSpot");
				},

				function(err) {
					sap.m.MessageToast.show("Erro");
				});

			if (oView.getDependents().length > 0) {
				for (var i = 0; i < oView.getDependents().length; i++) {
					oView.getDependents()[0].destroy();
				}
			}

			var oDialog = oView.byId("dialogDadosSpot");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				var controller = new DialogDadosDoSpot(this);
				oDialog = sap.ui.xmlfragment(oView.getId(), "monitorPortocel.view.DialogDadosDoSpot", controller);
				oView.addDependent(oDialog);
			}
			oDialog.open();
		},

		openPopover: function(oEvent) {

			// create popover
			this._oPopover = sap.ui.xmlfragment("monitorPortocel.view.Popover", this);
			this.getView().addDependent(this._oPopover);
			//this._oPopover.bindElement("/ProductCollection/0");

			this._oPopover.openBy(oEvent.getSource());

		},
		onExit: function() {
			clearInterval(window.timerLocalizacao);
			if (this._oPopover) {
				this._oPopover.destroy();
			}
		},
		onPresGoTempoPermanencia: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("tempomedio", {}, true);
		},
		onPresGoCiclos: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("grafico", {}, true);
		},
		_onOverflowToolbarButtonPress: function(oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function(fnResolve) {

				this.doNavigate("Page2", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					sap.m.MessageBox.error(err.message);
				}
			});

		},
		doNavigate: function(sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

			var sEntityNameSet;
			if (sPath !== null && sPath !== "") {
				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				sEntityNameSet = sPath.split("(")[0];
			}
			var sNavigationPropertyName;
			var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

			if (sEntityNameSet !== null) {
				sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet,
					sRouteName);
			}
			if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
				if (sNavigationPropertyName === "") {
					this.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext
					}, false);
				} else {
					oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function(bindingContext) {
						if (bindingContext) {
							sPath = bindingContext.getPath();
							if (sPath.substring(0, 1) === "/") {
								sPath = sPath.substring(1);
							}
						} else {
							sPath = "undefined";
						}

						// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
						if (sPath === "undefined") {
							this.oRouter.navTo(sRouteName);
						} else {
							this.oRouter.navTo(sRouteName, {
								context: sPath,
								masterContext: sMasterContext
							}, false);
						}
					}.bind(this));
				}
			} else {
				this.oRouter.navTo(sRouteName);
			}

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}

		},
		/*_onIconPress: function(oEvent) {

			var sPopoverName = "Popover1";
			this.mPopovers = this.mPopovers || {};
			var oPopover = this.mPopovers[sPopoverName];
			var oSource = oEvent.getSource();
			var oBindingContext = oSource.getBindingContext();
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oView;
			if (!oPopover) {
				this.getOwnerComponent().runAsOwner(function() {
					oView = sap.ui.xmlview({
						viewName: "com.sap.build.standard.appDeGerencia.view." + sPopoverName
					});
					this.getView().addDependent(oView);
					oView.getController().setRouter(this.oRouter);
					oPopover = oView.getContent()[0];
					oPopover.setPlacement("Left");
					this.mPopovers[sPopoverName] = oPopover;
				}.bind(this));
			}

			return new Promise(function(fnResolve) {
				oPopover.attachEventOnce("afterOpen", null, fnResolve);
				oPopover.openBy(oSource);
				if (oView) {
					oPopover.attachAfterOpen(function() {
						oPopover.rerender();
					});
				} else {
					oView = oPopover.getParent();
				}

				var oModel = this.getView().getModel();
				if (oModel) {
					oView.setModel(oModel);
				}
				if (sPath) {
					var oParams = oView.getController().getBindingParameters();
					oView.bindObject({
						path: sPath,
						parameters: oParams
					});
				}
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					sap.m.MessageBox.error(err.message);
				}
			});

		},*/

		onFilterByMaterial: function() {
			var oView = this.getView();
			if (oView.getDependents().length > 0) {
				for (var i = 0; i < oView.getDependents().length; i++) {
					oView.getDependents()[0].destroy();
				}
			}
			var controller = new DialogFiltroMaterial(this);
			var oDialog = sap.ui.xmlfragment("monitorPortocel.view.DialogFiltroMaterial", controller);
			oView.addDependent(oDialog);
			oDialog.open();
			if (!this.getView().getModel("filtroMaterial")) {
				this.startModelMaterial();
			}
		},

		onFilterByMotorista: function() {
			var oView = this.getView();
			if (oView.getDependents().length > 0) {
				for (var i = 0; i < oView.getDependents().length; i++) {
					oView.getDependents()[0].destroy();
				}
			}
			var controller = new DialogFiltroMotorista(this);
			var oDialog = sap.ui.xmlfragment("monitorPortocel.view.DialogFiltroMotorista", controller);
			oView.addDependent(oDialog);
			oDialog.open();
			if (!this.getView().getModel("filtroMotorista")) {
				this.startModelMotorista();
			}
		},

		onFilterByCaminhao: function() {
			var oView = this.getView();
			if (oView.getDependents().length > 0) {
				for (var i = 0; i < oView.getDependents().length; i++) {
					oView.getDependents()[0].destroy();
				}
			}
			var controller = new DialogFiltroCaminhao(this);
			var oDialog = sap.ui.xmlfragment("dialogCaminhao", "monitorPortocel.view.DialogFiltroCaminhao", controller);
			oView.addDependent(oDialog);
			oDialog.open();
			if (!this.getView().getModel("filtroCaminhao")) {
				this.startModelCaminhao();
			}
		},

		onFilterByEtapa: function() {
			var oView = this.getView();
			if (oView.getDependents().length > 0) {
				for (var i = 0; i < oView.getDependents().length; i++) {
					oView.getDependents()[0].destroy();
				}
			}

			if (!this.getView().getModel("filtroEtapa")) {
				this.startModelEtapa();
			}

			var controller = new DialogFiltroEtapa(this);
			var oDialog = sap.ui.xmlfragment("monitorPortocel.view.DialogFiltroEtapa", controller);
			oView.addDependent(oDialog);
			oDialog.open();

			var model = this.getView().getModel("selecionados");
			var descrCentroOrigem = model.oData.centroOrigemDescr;
			var descrCentroDestino = model.oData.centroDestinoDescr;
			var descrDeposito = model.oData.depositoDescr;
			oView.getDependents()[0].getContent()[0].getItems()[0].getItems()[1].setValue(descrCentroOrigem);
			oView.getDependents()[0].getContent()[0].getItems()[1].getItems()[1].setValue(descrDeposito);
		},

		onCleanAllFilters: function() {
			var oView = this.getView();
			var model;

			this.aFilters = [];
			this.loadTrucksOnTheMap();

			oView.byId("inptMaterial").setValue("");
			if (oView.getModel("filtroMaterial")) {
				model = oView.getModel("filtroMaterial");
				for (var i = 0; i < model.oData.length; i++) {
					model.oData[i].MatSelected = "";
				}
			}

			oView.byId("inptMotorista").setValue("");
			if (oView.getModel("filtroMotorista")) {
				model = oView.getModel("filtroMotorista");
				for (var i = 0; i < model.oData.length; i++) {
					model.oData[i].MotSelected = "";
				}
			}

			oView.byId("inptCaminhao").setValue("");
			if (oView.getModel("filtroCaminhao")) {
				model = oView.getModel("filtroCaminhao");
				for (var i = 0; i < model.oData.length; i++) {
					model.oData[i].CompSelected = "";
				}

			}

			oView.byId("inptEtapa").setValue("");
			if (oView.getModel("filtroEtapa")) {
				model = oView.getModel("filtroEtapa");
				for (var i = 0; i < model.oData.length; i++) {
					model.oData[i].EtapaSelected = "";
				}
			}
		},

		onSelectFilters: function(oEvent) {
			var oView = this.getView();
			var oDialog = sap.ui.xmlfragment("monitorPortocel.view.DialogSelecionarFiltros", this);
			oView.addDependent(oDialog);
			oDialog.open();
			if (this.checkBoxSelecionados[0]) {
				oDialog.getContent()[0].getItems()[0].setSelected(true);
			} else {
				oDialog.getContent()[0].getItems()[0].setSelected(false);
			}

			if (this.checkBoxSelecionados[1]) {
				oDialog.getContent()[0].getItems()[1].setSelected(true);
			} else {
				oDialog.getContent()[0].getItems()[1].setSelected(false);
			}

			if (this.checkBoxSelecionados[2]) {
				oDialog.getContent()[0].getItems()[2].setSelected(true);
			} else {
				oDialog.getContent()[0].getItems()[2].setSelected(false);
			}

			if (this.checkBoxSelecionados[3]) {
				oDialog.getContent()[0].getItems()[3].setSelected(true);
			} else {
				oDialog.getContent()[0].getItems()[3].setSelected(false);
			}
		},

		startModelMaterial: function() {
			var me = this;

			var stringParam = "/ZET_VPWM_MATERIALSET";
			apiConnector.consumeModel(stringParam, {}, {},
				function(oData, oResponse) {
					var json = new sap.ui.model.json.JSONModel();
					json.setData(oData.results);
					me.getView().setModel(json, "filtroMaterial");
				},

				function(err) {
					sap.m.MessageToast.show("Erro");
				});
		},

		startModelMotorista: function() {
			var me = this;

			var stringParam = "/ZET_VPWM_MOTORISTASET";
			apiConnector.consumeModel(stringParam, {}, {},
				function(oData, oResponse) {
					var json = new sap.ui.model.json.JSONModel();
					json.setData(oData.results);
					me.getView().setModel(json, "filtroMotorista");
				},

				function(err) {
					sap.m.MessageToast.show("Erro");
				});
		},

		startModelCaminhao: function() {
			var me = this;

			var stringParam = "/ZET_VPWM_COMPOSICAOSET";
			apiConnector.consumeModel(stringParam, {}, {},
				function(oData, oResponse) {
					var json = new sap.ui.model.json.JSONModel();
					json.setData(oData.results);
					me.getView().setModel(json, "filtroCaminhao");
				},

				function(err) {
					sap.m.MessageToast.show("Erro");
				});
		},

		startModelEtapa: function() {
			var me = this;

			var model = this.getView().getModel("selecionados");
			if (!model) {
				var json = new sap.ui.model.json.JSONModel();
				json.setData({
					centroOrigemDescr: "Un. Aracruz",
					centroOrigem: "3070",
					centroDestinoDescr: "Aracruz",
					centroDestino: "3803",
					depositoDescr: "PORTOCEL",
					deposito: "1244"
				});
				this.getView().setModel(json, "selecionados");
			}

			var aFilter = [];
			aFilter.push(new sap.ui.model.Filter({
				path: "CentroOrigem",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "3070"
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "CentroDestino",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "3803"
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "DepositoDestino",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "1244"
			}));

			var stringParam = "/ZET_VPWM_ETAPAS_TRPSET";
			apiConnector.consumeModel(stringParam, {}, {},
				function(oData, oResponse) {
					for (var i = 0; i < oData.results.length; i++) {
						oData.results[i].Etapa = oData.results[i].Etapa.trim();
					}

					var json = new sap.ui.model.json.JSONModel();
					json.setData(oData.results);
					me.getView().setModel(json, "filtroEtapa");
				},

				function(err) {
					sap.m.MessageToast.show("Erro");
				});
		},

		startModelCentro: function() {
			var me = this;
			var stringParam = "/ZET_VPWM_CENTRO_DESCRICAOSSET";
			apiConnector.consumeModel(stringParam, {}, {},
				function(oData, oResponse) {
					for (var i = 0; i < oData.results.length; i++) {
						oData.results[i].visible = true;
					}
					var json = new sap.ui.model.json.JSONModel();
					json.setData(oData.results);
					me.getView().setModel(json, "dialogCentro");
				},

				function(err) {
					sap.m.MessageToast.show("Erro");
				});
		},

		startModelCavalo: function() {
			var me = this;
			var stringParam = "/ZET_VPWM_PLACA_CAVALOSET";
			apiConnector.consumeModel(stringParam, {}, {},
				function(oData, oResponse) {
					for (var i = 0; i < oData.results.length; i++) {
						oData.results[i].visible = true;
					}
					var json = new sap.ui.model.json.JSONModel();
					json.setData(oData.results);
					me.getView().setModel(json, "placaCavalo");
				},

				function(err) {
					sap.m.MessageToast.show("Erro");
				});
		},

		startModelCarreta1: function() {
			var me = this;
			var stringParam = "/ZET_VPWM_PLACA_CARRETA1SET";
			apiConnector.consumeModel(stringParam, {}, {},
				function(oData, oResponse) {
					for (var i = 0; i < oData.results.length; i++) {
						oData.results[i].visible = true;
					}
					var json = new sap.ui.model.json.JSONModel();
					json.setData(oData.results);
					me.getView().setModel(json, "placaCarreta1");
				},

				function(err) {
					sap.m.MessageToast.show("Erro");
				});
		},
		
		onIniciaTimer: function() {
			var controller = this;
			var qtde = 0;
			window.timerMapa = setInterval(function() {
				somaTempo();
			}, 1000);

			function somaTempo() {
				if (qtde == 300) {
					controller.loadTrucksOnTheMap();
					qtde = 0;
				}
				qtde++;
			}
		},

		startModelCarreta2: function() {
			var me = this;
			var stringParam = "/ZET_VPWM_PLACA_CARRETA2SET";
			apiConnector.consumeModel(stringParam, {}, {},
				function(oData, oResponse) {
					for (var i = 0; i < oData.results.length; i++) {
						oData.results[i].visible = true;
					}
					var json = new sap.ui.model.json.JSONModel();
					json.setData(oData.results);
					me.getView().setModel(json, "placaCarreta2");
				},

				function(err) {
					sap.m.MessageToast.show("Erro");
				});
		},

		onCloseSelecionarFiltros: function(oEvent) {
			var filtroMaterial = oEvent.getSource().getParent().getContent()[0].getItems()[0].getSelected();
			var filtroMotorista = oEvent.getSource().getParent().getContent()[0].getItems()[1].getSelected();
			var filtroCaminhao = oEvent.getSource().getParent().getContent()[0].getItems()[2].getSelected();
			var filtroEtapa = oEvent.getSource().getParent().getContent()[0].getItems()[3].getSelected();
			var oView = this.getView();
			var tamanhoFiltro = this.aFilters.length;
			var contador = 0;
			var model;

			if (filtroMaterial) {
				oView.byId("containerMaterial").setVisible(true);
				this.checkBoxSelecionados[0] = true;
			} else {
				oView.byId("containerMaterial").setVisible(false);
				this.checkBoxSelecionados[0] = false;

				contador = 0;
				while (contador < tamanhoFiltro) {
					if (this.aFilters[contador].sPath === "Material") {
						this.aFilters.splice(contador, 1);
						contador--;
						tamanhoFiltro--;
					}
					contador++;
				}

				model = this.getView().getModel("filtroMaterial");
				if (model) {
					for (var i = 0; i < model.oData.length; i++) {
						model.oData[i].MatSelected = "";
					}
					oView.byId("inptMaterial").setValue("");
				}
			}

			if (filtroMotorista) {
				oView.byId("containerMotorista").setVisible(true);
				this.checkBoxSelecionados[1] = true;
			} else {
				oView.byId("containerMotorista").setVisible(false);
				this.checkBoxSelecionados[1] = false;

				contador = 0;
				while (contador < tamanhoFiltro) {
					if (this.aFilters[contador].sPath === "Usuario") {
						this.aFilters.splice(contador, 1);
						contador--;
						tamanhoFiltro--;
					}
					contador++;
				}

				model = this.getView().getModel("filtroMotorista");
				if (model) {
					for (var i = 0; i < model.oData.length; i++) {
						model.oData[i].MotSelected = "";
					}
					oView.byId("inptMotorista").setValue("");
				}
			}

			if (filtroCaminhao) {
				oView.byId("containerCaminhao").setVisible(true);
				this.checkBoxSelecionados[2] = true;
			} else {
				oView.byId("containerCaminhao").setVisible(false);
				this.checkBoxSelecionados[2] = false;

				contador = 0;
				while (contador < tamanhoFiltro) {
					if (this.aFilters[contador].sPath === "Composicao") {
						this.aFilters.splice(contador, 1);
						contador--;
						tamanhoFiltro--;
					}
					contador++;
				}

				model = this.getView().getModel("filtroCaminhao");
				if (model) {
					for (var i = 0; i < model.oData.length; i++) {
						model.oData[i].CompSelected = "";
					}
					oView.byId("inptCaminhao").setValue("");
				}
			}

			if (filtroEtapa) {
				oView.byId("containerEtapa").setVisible(true);
				this.checkBoxSelecionados[3] = true;
			} else {
				oView.byId("containerEtapa").setVisible(false);
				this.checkBoxSelecionados[3] = false;

				contador = 0;
				while (contador < tamanhoFiltro) {
					if (this.aFilters[contador].sPath === "Etapa") {
						this.aFilters.splice(contador, 1);
						contador--;
						tamanhoFiltro--;
					}
					contador++;
				}

				model = this.getView().getModel("filtroEtapa");
				if (model) {
					for (var i = 0; i < model.oData.length; i++) {
						model.oData[i].EtapaSelected = "";
					}
					oView.byId("inptEtapa").setValue("");
				}
			}

			oEvent.getSource().getParent().close();
			oEvent.getSource().getParent().destroy();
		},

		onPressResize: function ()	{
			if(this.byId("btnResize").getTooltip()=="Minimizar"){
				if (sap.ui.Device.system.phone) {
					this.byId("geoMap").minimize(132,56,1320,560);//Height: 3,5 rem; Width: 8,25 rem
				} else {
					this.byId("filtersBlockLayout").setVisible(true);
				}				
				this.byId("btnResize").setTooltip("Maximizar");
			}
			else{
				this.byId("geoMap").maximize();
				this.byId("filtersBlockLayout").setVisible(false);
				this.byId("btnResize").setTooltip("Minimizar");
			}
		}

	});

});