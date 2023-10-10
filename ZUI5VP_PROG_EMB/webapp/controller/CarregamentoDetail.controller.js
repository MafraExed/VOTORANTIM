sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"fibriembarque/util/apiConnector",
	"fibriembarque/util/Collection"
], function(BaseController, MessageBox, History, apiConnector, Collection) {
	"use strict";

	var _currentOrdem = {
		oc: '',
		itemOc: '',
		rowId: ''
	};

	var _camadasMap = {};
	var _currentPage = null;
	//var _pages = [];
	var _headerData = {};

	return BaseController.extend("fibriembarque.controller.CarregamentoDetail", {

		onExit: function() {
			clearInterval(window.timerOrdem);
			clearInterval(window.timerPorao);
			clearInterval(window.timerMaster);
			_currentOrdem = {
				oc: '',
				itemOc: '',
				rowId: ''
			};

			_camadasMap = {};
			_currentPage = null;
			//_pages = [];
		},
		onInit: function() {
			var controller = this;
			this.oResourceModel = new sap.ui.model.resource.ResourceModel({
				bundleName: "fibriembarque.i18n.i18n"
			});

			// logica para verificar se esta "parado" ou carregando
			controller.byId("btnPlay").setVisible(false);

			var oView = this.getView();
			oView.addEventDelegate({
				onBeforeShow: function(oEvent) {
					if (sap.ui.Device.system.phone === true) {
						controller.byId("image").setVisible(false);
						controller.byId("headerhader").setIsObjectIconAlwaysVisible(true);
						controller.byId("headerhader").setObjectTitle("");
						controller.byId("headerhader").setObjectSubtitle("");
						controller.byId("iconProduct").setSize("25px");
						controller.byId("iconProduct").addStyleClass("margimRight");
						controller.byId("iconUpload").setSize("25px");
						controller.byId("iconUpload").addStyleClass("margimRight");
						controller.byId("textRemaining").setText(controller.oResourceModel._oResourceBundle.getText("carrTextRemaing"));
						controller.byId("textShippedAmount").setText(controller.oResourceModel._oResourceBundle.getText("carrTextShip"));
						controller.byId("textSeparator").setVisible(false);
						controller.byId("textRemaining").setVisible(false);
						controller.byId("textShippedAmount").setVisible(false);
					}

					controller._onAtualizaoData();
					controller._onAtualizaCarregamentoOcItem();
					controller._onAtualizaList();
					controller._onAtulizaCores();
				}

			}, oView);

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("carregamento").attachPatternMatched(this._onObjectMatched, this);

			var eventBus = sap.ui.getCore().getEventBus();
			eventBus.subscribe("PoraoCarregamentoChannel", "onNavigateEvent", this.onDataReceived, this);
			eventBus.subscribe("PoraoCarregamentoChannel", "onChangeStatusViagem", this.onChangeStatusViagem, this);
		},
		onChangeStatusViagem: function(sChanel, sEvent, oData) {
			var itemChamado = this.byId("tableViagens").getModel().getData()[parseInt(oData.id, 10)];
			//var entityUrl = "/ZET_VPWM_CAR_POROESSet(Oc='"+ itemChamado.Oc+"',Item='"+ itemChamado.Item+"')";
			var entityUrl = "/ZET_VPWM_CONTROL_VIAGEMSet";
			var object = {};
			object.OcRowid = itemChamado.OcRowid.toString();
			object.Oc = itemChamado.Oc;
			object.Item = itemChamado.Item;
			object.Adiado = oData.adiado;

			this.setDataFromAPIChnageStatusViagem(entityUrl, object);
		},
		setDataFromAPIChnageStatusViagem: function(entityUrl, object) {
			var controller = this;
			var serviceUrl = "/sap/opu/odata/sap/ZGWVPWM_PROGRAMACAO_EMBARQUE_SRV/";
			//CREATE
			apiConnector.createModel(serviceUrl, entityUrl, object, 
				function(oData, oResponse) {
					controller._onAtualizaoData();
					controller._onAtualizaCarregamentoOcItem();
					//controller._onAtualizaList();
					controller._onAtulizaCores();
					controller._unitsDialogsButtonControl();
					sap.m.MessageToast.show(controller.oResourceModel._oResourceBundle.getText("dialogStatusViagemAlterado"), {
						duration: 3000
				});
				}, 
				function(err) {
					controller._unitsDialogsButtonControl();
					var message;
					try {
						message = err.response.body.split("value")[1].split("},")[0];
					} catch (erro) {
						message = controller.oResourceModel._oResourceBundle.getText("dialogStopErrorServidor");
					}
					for (var i = 0; i < 10; i++) {
						message = message.replace('"', '');
					}
					sap.m.MessageToast.show(message, {
						duration: 3000
					});
			});
		},
		onDataReceived: function(channel, event, data) {
			_headerData = data.porao;

			var headerDataModel = new sap.ui.model.json.JSONModel();
			headerDataModel.setData(_headerData);

			this.getView().setModel(headerDataModel, "headerData");
		},
		_onObjectMatched: function(oEvent) {

			var oc = oEvent.getParameter("arguments").oc;
			var itemOc = oEvent.getParameter("arguments").itemoc;

			_currentOrdem = {
				oc: oc,
				itemOc: itemOc
			};

			_camadasMap = {};
			_currentPage = null;

			this._onAtualizaList();
		},
		getDataFromAPI: function(ordemCarregamento, itemOrdem, entityUrl, filter, filterArray) {
			var dataPromise = jQuery.Deferred();
			var serviceUrl = "/sap/opu/odata/sap/ZGWVPWM_PROGRAMACAO_EMBARQUE_SRV/";

			apiConnector.consumeModel(serviceUrl, entityUrl + filter, filterArray, 
				function(oData, oResponse) {
					dataPromise.resolve(oData.results);
				}, function(err) {
					dataPromise.reject(err);
			});

			return dataPromise;
		},
		_onAtulizaCores: function() {
			var controller = this;
			var list = controller.byId("tableViagens").getItems();
			for (var i = 0; i < list.length; i++) {
				var lastColumnIndex = list[i].getCells().length - 1;
				//var lastColumnIndex = list[i].getCells().length - 1;

				if (list[i].getCells()[lastColumnIndex] && list[i].getCells()[lastColumnIndex].getSrc() === "sap-icon://accept") {
					///list[i].addStyleClass("sapMLIBSelected");
					list[i].addStyleClass("styleTest");
				}
			}
		},
		_onAtualizaCarregamentoOcItem: function() {
			var controller = this;

			//var jsonModel = new sap.ui.model.json.JSONModel();
			var entityUrl = '/ZET_VPWM_PORAOSet?';
			var filter = "$filter=Oc eq '" + _currentOrdem.oc + "'";
			var dataPromise = this.getDataFromAPI(_currentOrdem.oc, _currentOrdem.itemOc, entityUrl, filter, []);

			jQuery.when(dataPromise).then(
				function(results) {
					if (results.length > 0) {
						for (var i = 0; i < results.length; i++) {
							if (results[i].Itemoc === _currentOrdem.itemOc) {
								switch (results[i].Status) {
									case '1':
										controller.byId("btnPlay").setVisible(false);
										controller.byId("btnPause").setVisible(true);
										break;
									case '2':
										controller.byId("btnPlay").setVisible(true);
										controller.byId("btnPause").setVisible(false);
										break;
									case '3':
										controller.byId("btnPlay").setVisible(false);
										controller.byId("btnPause").setVisible(true);
										break;
									case '4':
										controller.byId("btnPlay").setVisible(false);
										controller.byId("btnPause").setVisible(false);
										break;
									case '5':
										controller.byId("btnPlay").setVisible(false);
										controller.byId("btnPause").setVisible(false);
										break;
								}
								break;
							}
						}
					}
					controller.byId("btnRefreshData").setEnabled(true);
				},
				function(err) {
					jQuery.sap.log.error(err);
					controller.byId("btnRefreshData").setEnabled(true);
				}
			);
		},
		_onAtualizaCabecalho: function() {
			var index = sap.ui.getCore().getModel("rowPressViewPorao");
			var eventBus = sap.ui.getCore().getEventBus();
			eventBus.publish("Porao", "_onAtualizaList");
			var dadosCabecalho = sap.ui.getCore().getModel("dadosCabecalhoPorao");

			var controller = this;
			var serviceUrl = "/sap/opu/odata/sap/ZGWVPWM_PROGRAMACAO_EMBARQUE_SRV/";
			var JSONModel = new sap.ui.model.json.JSONModel();
			var param = "/ZET_VPWM_PORAOSet?%24filter=Oc+eq+%27" + dadosCabecalho.Oc + "%27";
			var oModel = new sap.ui.model.odata.ODataModel(serviceUrl, true);
			oModel.read(param, {
				success: function(oData, oResponse) {
					if (oData.results.length > 0) {
						JSONModel.setData(oData.results);
					}
					for (var i = 0; i < JSONModel.getData().length; i++) {
						JSONModel.getData()[i].Porcentagem = parseFloat(JSONModel.getData()[i].Porcentagem);
						try {
							JSONModel.getData()[i].Carga_total = Number.parseInt(JSONModel.getData()[i].Carga_total, 10);
							JSONModel.getData()[i].Carregados = Number.parseInt(JSONModel.getData()[i].Carregados, 10);
						} catch (erro) {
							sap.m.MessageToast.show("Catch Error Urgent!!!");
						}
					}
					JSONModel.setData(JSONModel.getData()[index]);
					controller.getView().setModel(JSONModel, "headerData");
				},
				error: function(erro) {
					// Mensagem não a carregamentos
				}
			});
		},
		_onAtualizaoData: function() {
			// Busca no banco e atualiza tabela
			this._onAtualizaCabecalho();
			var controller = this;
			var jsonModel = new sap.ui.model.json.JSONModel();
			var entityUrl = 'ZET_VPWM_CAR_POROESSet?';
			var filter = "$filter=Oc eq '" + _currentOrdem.oc + "' and Item eq '" + _currentOrdem.itemOc + "'";
			var dataPromise = this.getDataFromAPI(_currentOrdem.oc, _currentOrdem.itemOc, entityUrl, filter, []);

			jQuery.when(dataPromise).then(
				function(results) {

					if (results.length > 0) {

						_camadasMap = Collection.arrayToPaginatedHashMap(results, 'Camada');
						for (var i = 0; i < _camadasMap.length; i++) {
							_camadasMap[i].key = parseInt(_camadasMap[i].key, 10);
						}
						
						
						_camadasMap.sort(function(a, b) {
							if (a.key > b.key) {
								return 1;
							}
							if (a.key < b.key) {
								return -1;
							}

							return 0;
						});

						for (i = 0; i < _camadasMap.length; i++) {
							_camadasMap[i].key = i + 1;
						}
						
						_camadasMap.first = _camadasMap[0];
						_camadasMap.last = _camadasMap[_camadasMap.length - 1];

						if (_currentPage === null) {
							_currentPage = _camadasMap[0];
						} else {
							if (_currentPage.key === 0) {
								_currentPage = _camadasMap[0];
							} else {
								_currentPage = _camadasMap[_currentPage.key - 1];
							}
						}
						jsonModel.setData(_currentPage.value);
						sap.ui.getCore().setModel(jsonModel, "listaCompleta");
					} else {
						jsonModel.setData({});
						sap.ui.getCore().setModel(jsonModel, "listaCompleta");
					}

					controller.atualizaLista();
					controller._onAtulizaCores();
				},
				function(err) {
					jQuery.sap.log.error(err);
				}
			);
		},
		_onAtualizaList: function(oEvent) {
			// logica para atualizar a lista pelo oData e aparecer conforme os carregamentos

			//var controller = this;
			this.byId("btnRefreshData").setEnabled(false);
			this._onAtualizaoData();
			this._onAtualizaCarregamentoOcItem();

		},
		atualizaLista: function() {

			var controller = this;
			var contador = 0;
			var contadorReverso;
			var contadorItem = 0;
			var array = [];
			var JSONModel = new sap.ui.model.json.JSONModel();
			var list = controller.byId("tableViagens");
			var oModel = sap.ui.getCore().getModel("listaCompleta");

			while ((oModel && oModel.getData()) && (contador < oModel.getData().length && contadorItem < 15)) {

				if (contadorItem > 0) {
					array.push(oModel.getData()[contador]);
					contadorItem++;
				}
				if (contadorItem === 0 && oModel.getData()[contador].Situacao === "accept") {
					contadorReverso = contador - 1;
					while (contadorReverso >= 0 && contadorItem < 4) {
						//array.push(oModel.getData()[contadorReverso]);
						array.splice(0, 0, oModel.getData()[contadorReverso]);
						contadorReverso--;
						contadorItem++;
					}
					array.push(oModel.getData()[contador]);
					contadorItem++;
				}

				if (contador === (oModel.getData().length - 1)) {
					contadorReverso = contador;
					// while (contadorReverso >= 0 && contadorItem < 15) {
					while (contadorReverso >= 0) {
						// >>>> Joao 01/08/18
						oModel.getData()[contadorReverso].Total = parseInt(oModel.getData()[contadorReverso].Total, 10);
						// <<<< Joao 01/08/18
						array.splice(0, 0, oModel.getData()[contadorReverso]);

						contadorReverso--;
						contadorItem++;
					}
				}

				contador++;
			}

			JSONModel.setData(array);
			//list.getModel().setData(JSONModel);
			list.setModel(JSONModel);
		},
		_onNavPress: function() {
			// var oEventBus = sap.ui.getCore().getEventBus();
			// oEventBus.publish("Master", "getDadosBackEnd");
			// oEventBus.publish("Ordem", "_onAtualizaList");
			//oEventBus.publish("Porao", "_onAtualizaList");

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.getView().getParent().getParent().getController().byId("app").setVisible(false);
			this.getView().getParent().getParent().getController().byId("split").setVisible(true);
			oRouter.navTo("porao", {}, true);
		},
		_onPrevPress: function() {

			if (!_camadasMap[0]) {
				return;
			}

			if (_currentPage === _camadasMap[0]) {
				return;
			}

			var prevPage = _currentPage.key;

			var jsonModel = new sap.ui.model.json.JSONModel();
			_currentPage = _camadasMap[prevPage - 2];

			jsonModel.setData(_currentPage.value);
			sap.ui.getCore().setModel(jsonModel, "listaCompleta");

			this.atualizaLista();
			this._onAtulizaCores();

		},
		_onNextPress: function() {

			if (!_camadasMap[_camadasMap.length - 1]) {
				return;
			}

			if (_currentPage === _camadasMap[_camadasMap.length - 1]) {
				return;
			}

			var jsonModel = new sap.ui.model.json.JSONModel();
			var nextPage = _currentPage.key;

			_currentPage = _camadasMap[nextPage];
			jsonModel.setData(_currentPage.value);
			sap.ui.getCore().setModel(jsonModel, "listaCompleta");

			this.atualizaLista();
			this._onAtulizaCores();
		},
		_onChangeStatusItem: function(oEvent) {
			var controller = this;
			sap.ui.getCore().setModel(oEvent.getSource(), "evento");
			_currentOrdem.rowId = this.byId("tableViagens").getModel().getData()[parseInt(sap.ui.getCore().getModel("evento").getParent().getBindingContextPath().split("/")[1], 10)].OcRowid.toString().trim();
			sap.ui.getCore().setModel(controller, "controllerCarregamento");
			var oDialog = new sap.m.Dialog();
			oDialog.setTitle(controller.oResourceModel._oResourceBundle.getText("carrChangeStatus"));
			oDialog.addContent(new sap.m.Text({
				width: "10px",
				maxLines: 1,
				height: "3px",
				wrapping: false,
				textAlign: "Begin",
				textDirection: "Inherit",
				class: "margin"
			}));
			if (oEvent.getSource().getSrc() === "sap-icon://refresh" || oEvent.getSource().getSrc() === "sap-icon://pending") {
				var textStatus = "";
				if (oEvent.getSource().getSrc() === "sap-icon://refresh") {
					textStatus = controller.oResourceModel._oResourceBundle.getText("carrChangeForShipped");
				} else {
					textStatus = controller.oResourceModel._oResourceBundle.getText("carrChangeForNextTravel");
				}
				oDialog.setState("Success");
				oDialog.setIcon("sap-icon://shipping-status");
				oDialog.addContent(new sap.m.Text({
					text: textStatus,
					width: "100%",
					textAlign: sap.ui.core.TextAlign.Center
				}));

				oDialog.addContent(new sap.m.Text({
					width: "10px",
					maxLines: 1,
					height: "3px",
					wrapping: false,
					textAlign: "Begin",
					textDirection: "Inherit",
					class: "margin"
				}));
				oDialog.addButton(new sap.m.Button({
					text: controller.oResourceModel._oResourceBundle.getText("dialogPlaySim"),
					type: sap.m.ButtonType.Accept,
					press: function() {
						// Logica do Banco pra alterar a viaagem
						var evento = sap.ui.getCore().getModel("evento");
						var adiadoEvento = "";
						if (evento.getSrc() === "sap-icon://refresh") {
							adiadoEvento = "X";
						}
						var idEvento = evento.getParent().getBindingContextPath().split("/")[1];
						var oEventBus = sap.ui.getCore().getEventBus();
						oEventBus.publish("PoraoCarregamentoChannel", "onChangeStatusViagem", {
							id: idEvento,
							adiado: adiadoEvento
						});
						oDialog.close();
					}
				}));
				oDialog.addButton(new sap.m.Button({
					text: controller.oResourceModel._oResourceBundle.getText("dialogPlayNao"),
					type: sap.m.ButtonType.Reject,
					press: function() {
						oDialog.close();
					}
				}));
				oDialog.open();
			} else {
				this.handleUnitsDialogPress(oEvent);
			}
		},
		_onPlayCarregamento: function(oEvent) {
			var controller = this;
			var oDialog = new sap.m.Dialog();
			oDialog.setState("Success");
			oDialog.setTitle(controller.oResourceModel._oResourceBundle.getText("dialogPlayTitle"));
			oDialog.addContent(new sap.m.Text({
				text: controller.oResourceModel._oResourceBundle.getText("dialogPlayText"),
				width: "100%",
				textAlign: sap.ui.core.TextAlign.Center
			}));
			oDialog.addButton(new sap.m.Button({
				text: controller.oResourceModel._oResourceBundle.getText("dialogPlaySim"),
				type: sap.m.ButtonType.Accept,
				press: function() {

					var entityUrl = "/ZET_VPWM_PAUSE_PLAYSet(codigoParada='0',oc='" + _currentOrdem.oc + "',item='" + _currentOrdem.itemOc + "')";
					var object = {};
					object.codigoParada = "";
					object.justificativa = "";
					object.oc = controller.getCurrentOC();
					object.item = controller.getCurrentItem();
					controller.setDataFromAPI(entityUrl, object, 2, oDialog);

					//oDialog.close();
				}
			}));
			oDialog.addButton(new sap.m.Button({
				text: controller.oResourceModel._oResourceBundle.getText("dialogPlayNao"),
				type: sap.m.ButtonType.Reject,
				press: function() {
					oDialog.close();
				}
			}));
			oDialog.setIcon("sap-icon://shipping-status");
			oDialog.open();

		},
		_getMotivosParada: function() {
			//var controller = this;

			var jsonModel = new sap.ui.model.json.JSONModel();
			var entityUrl = '/ZET_VPWM_PAUSE_PLAYSet';
			var filter = "";
			var dataPromise = this.getDataFromAPI(_currentOrdem.oc, _currentOrdem.itemOc, entityUrl, filter, []);

			jQuery.when(dataPromise).then(
				function(results) {
					jsonModel.setData(results);
				},
				function(err) {
					jQuery.sap.log.error(err);
				}
			);
			return jsonModel;
		},
		_onStopCarregamento: function(oEvent) {
			var controller = this;
			/*var select = new sap.m.ComboBox({
				width: "100%",
				items: {
					path: '/',
					template: new sap.ui.core.Item({
						key: "{codigoParada}",
						text: "{justificativa}"
					})
				}
			});*/
			if (!sap.ui.getCore().byId("motivoParadaInput")) {
				var fnValueHelpPress = this.handleValueHelpParadas.bind(this);
				var select = new sap.m.Input("motivoParadaInput", {
					type: "Text",
					value: "",
					placeholder: "{i18n>selectCode...}",
					showValueHelp: true,
					valueHelpOnly: true,
					valueHelpRequest: fnValueHelpPress,
					width: "15rem",
					class: "sapUiSmallMarginBottom"
				});
			} else {
				select = sap.ui.getCore().byId("motivoParadaInput");
			}
			
			select.setModel(controller._getMotivosParada());

			var textMotivo = new sap.m.Text({
				text: controller.oResourceModel._oResourceBundle.getText("dialogStopMotivo"),
				width: "100%",
				textAlign: sap.ui.core.TextAlign.Center
			});

			var textDescricao = new sap.m.Text({
				text: controller.oResourceModel._oResourceBundle.getText("dialogStopDescricaoMotivo"),
				width: "100%",
				textAlign: sap.ui.core.TextAlign.Center
			});

			var VboxMotiv = new sap.m.VBox({
				alignItems: "Center",
				width: "100%",
				height: "auto",
				justifyContent: "Center"
			});
			var descricao = new sap.m.TextArea({
				width: "100%",
				rows: 3,
				wrapping: "Soft"
			});
			var text1 = new sap.m.Text({
				width: "10px",
				class: "margin"
			});
			var text2 = new sap.m.Text({
				width: "10px",
				class: "margin"
			});
			var text3 = new sap.m.Text({
				width: "10px",
				class: "margin"
			});
			var text4 = new sap.m.Text({
				width: "10px",
				class: "margin"
			});
			VboxMotiv.addItem(text1);
			VboxMotiv.addItem(textMotivo);
			VboxMotiv.addItem(text2);
			VboxMotiv.addItem(select);
			VboxMotiv.addItem(text3);
			VboxMotiv.addItem(textDescricao);
			VboxMotiv.addItem(text4);
			VboxMotiv.addItem(descricao);

			var oDialog = new sap.m.Dialog({
				state: "Error",
				title: controller.oResourceModel._oResourceBundle.getText("dialogStopTitle"),
				content: [
					VboxMotiv
				]
			});
			oDialog.addButton(new sap.m.Button({
				text: controller.oResourceModel._oResourceBundle.getText("dialogStopDescricaoStop"),
				type: sap.m.ButtonType.Accept,
				press: function() {
					if (select.getValue() !== "") {
						var entityUrl = '/ZET_VPWM_PAUSE_PLAYSet';
						var object = {};
						object.codigoParada = select.getValue();
						object.justificativa = descricao.getValue();
						object.oc = controller.getCurrentOC();
						object.item = controller.getCurrentItem();
						controller.setDataFromAPI(entityUrl, object, 1, oDialog);
					} else {
						sap.m.MessageToast.show(controller.oResourceModel._oResourceBundle.getText("dialogSelecionarMotivo"), {
							duration: 3000
						});
					}
				}
			}));
			oDialog.addButton(new sap.m.Button({
				text: controller.oResourceModel._oResourceBundle.getText("dialogStopDescricaoCancel"),
				type: sap.m.ButtonType.Reject,
				press: function() {
					oDialog.close();
				}
			}));

			oDialog.open();
		},
		getCurrentOC: function() {
			return _currentOrdem.oc;
		},
		getCurrentItem: function() {
			return _currentOrdem.itemOc;
		},
		setDataFromAPI: function(entityUrl, object, tipo, oDialog) {
			var controller = this;
			var serviceUrl = "/sap/opu/odata/sap/ZGWVPWM_PROGRAMACAO_EMBARQUE_SRV/";
			if (tipo === 1) {
				//CREATE
				apiConnector.createModel(serviceUrl, entityUrl, object, 
					function(oData, oResponse) {
						sap.m.MessageToast.show(controller.oResourceModel._oResourceBundle.getText("dialogStopDescricaoStopStop"), {
							duration: 3000
						});
						controller.byId("btnPlay").setVisible(true);
						controller.byId("btnPause").setVisible(false);
						var oEventBus = sap.ui.getCore().getEventBus();
						oEventBus.publish("Master", "getDadosBackEnd");
						oEventBus.publish("Ordem", "_onAtualizaList");
						oDialog.close();
					}, function(err) {
						sap.m.MessageToast.show(controller.oResourceModel._oResourceBundle.getText("dialogStopDescricaoImpossivelPausar"), {
							duration: 3000
						});
				});
			} else {
				//UPDATE	
				apiConnector.updateModel(serviceUrl, entityUrl, object, 
					function(oData, oResponse) {
						sap.m.MessageToast.show(controller.oResourceModel._oResourceBundle.getText("dialogStopDescricaoEmCarregamento"), {
							duration: 3000
						});
						controller.byId("btnPlay").setVisible(false);
						controller.byId("btnPause").setVisible(true);
						var oEventBus = sap.ui.getCore().getEventBus();
						oEventBus.publish("Master", "getDadosBackEnd");
						oEventBus.publish("Ordem", "_onAtualizaList");
						controller._onAtualizaoData();
						controller._onAtualizaCarregamentoOcItem();
						controller._onAtulizaCores();
						controller._unitsDialogsButtonControl();
						controller.handleUnitsDialogPress(null);
						if(oDialog) {
							oDialog.close();
						}
					}, function(err) {
						controller._unitsDialogsButtonControl();
						controller.handleUnitsDialogPress(null);
						sap.m.MessageToast.show(controller.oResourceModel._oResourceBundle.getText("dialogStopDescricaoImpossivelRetomarCarregamento"), {
							duration: 3000
						});
				});
			}
		},
		formatValue: function(sQtde) {
			if (sQtde) {
				return Number(sQtde).toFixed(0);
			} else {
				return "0";
			}

		},
		formatQuantidadeRestante: function(cargaTotal, quantidadeCarregada) {
			return cargaTotal;

		},
		formatToNumber: function(quantidade) {
			return quantidade;
		},
		handleUnitsDialogPress: function(oEvent) {
			if(oEvent) {
				var entityUrl = '/ZET_VPWM_UNITS_VIAGEMSet';
				var aFilter = [];
				aFilter.push(new sap.ui.model.Filter({
					path: "Oc",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: _currentOrdem.oc
				}));
				aFilter.push(new sap.ui.model.Filter({
					path: "ItemOc",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: _currentOrdem.itemOc
				}));
				aFilter.push(new sap.ui.model.Filter({
					path: "RowId",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: _currentOrdem.rowId
				}));
				var jsonModel = new sap.ui.model.json.JSONModel();
				var me = this;
				var dataPromise = this.getDataFromAPI(_currentOrdem.oc, _currentOrdem.itemOc, entityUrl, "", aFilter);
				jQuery.when(dataPromise).then(
					function(results) {
						jsonModel.setData(results);
						me.getView().setModel(jsonModel, "UnitsEmbarcadasViagem");
						sap.ui.getCore().byId("unitsDialog").setBusy(false);
					},
					function(err) {
						jQuery.sap.log.error(err);
						sap.ui.getCore().byId("unitsDialog").setBusy(false);
					}
				);

				if (!this._oUnitsDialog) {
					this._oUnitsDialog = sap.ui.xmlfragment("fibriembarque.view.UnitsDialog", this);
				}
	
				this.getView().addDependent(this._oUnitsDialog, "unitsLoadedFragment");
				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oUnitsDialog);
				this._oUnitsDialog.open();
				sap.ui.getCore().byId("unitsDialog").setBusyIndicatorDelay(1);
				sap.ui.getCore().byId("unitsDialog").setBusy(true);

				if (oEvent.getSource().getSrc() === "sap-icon://accept") {
					sap.ui.getCore().byId("unitsDialogOpenVoyage").setVisible(true);
					sap.ui.getCore().byId("unitsDialogUnloadUnits").setVisible(false);
					sap.ui.getCore().byId("unitsDialogCloseVoyage").setVisible(false);
					sap.ui.getCore().byId("unitsDialogTable").setMode(sap.m.ListMode.None);
				} else {
					sap.ui.getCore().byId("unitsDialogOpenVoyage").setVisible(false);
					sap.ui.getCore().byId("unitsDialogUnloadUnits").setVisible(true);
					sap.ui.getCore().byId("unitsDialogCloseVoyage").setVisible(true);
					sap.ui.getCore().byId("unitsDialogTable").setMode(sap.m.ListMode.MultiSelect);
				}

				sap.ui.getCore().byId("unitsDialogOpenVoyage").addStyleClass("unitsDialogButtons");
				sap.ui.getCore().byId("unitsDialogUnloadUnits").addStyleClass("unitsDialogButtons");
				sap.ui.getCore().byId("unitsDialogCloseVoyage").addStyleClass("unitsDialogButtons");				
			}
		},
		onUnitsDialogCloseBtnPress: function(oEvent) {
			oEvent.getSource().getParent().close();
		},
		onUnitsDialogOpenVoyage: function(oEvent) {
			var me = this;
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			var message = "";
			
			if (oEvent.getParameter("id") === "unitsDialogOpenVoyage") {
				message = this.oResourceModel._oResourceBundle.getText("messageReopenVoyage");
				MessageBox.warning(
					message,
					{
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
						styleClass: bCompact ? "sapUiSizeCompact" : "",
						onClose: function(sAction) {
							if(sAction === sap.m.MessageBox.Action.YES) {
								me._reopenVoyage();
							}
						}
					}
				);
			} else if(oEvent.getParameter("id") === "unitsDialogCloseVoyage") {
				message = this.oResourceModel._oResourceBundle.getText("messageCloseVoyage");
				MessageBox.confirm(
					message,
					{
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
						styleClass: bCompact ? "sapUiSizeCompact" : "",
						onClose: function(sAction) {
							if(sAction === sap.m.MessageBox.Action.YES) {
								me._closeVoyage();
							}
						}
					}
				);
			}
		},
		onUnitsDialogUnloadUnits: function(oEvent) {
			var selectedItems = sap.ui.getCore().byId("unitsDialogTable").getSelectedItems();
				
			if (selectedItems.length > 0) {
				var message = this.oResourceModel._oResourceBundle.getText("messageUnloadunits");
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				var controller = this;
				MessageBox.warning(
					message,
					{
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
						styleClass: bCompact ? "sapUiSizeCompact" : "",
						onClose: function(sAction) {
							if(sAction === sap.m.MessageBox.Action.YES) {
								sap.ui.getCore().byId("unitsDialog").setBusyIndicatorDelay(1);
								sap.ui.getCore().byId("unitsDialog").setBusy(true);
				
								var entityUrl = "";
								var params = {
									Oc: _currentOrdem.oc,
									ItemOc: _currentOrdem.itemOc,
									RowId: _currentOrdem.rowId,
									Unit: "",
									Produto: "",
									DataCarr: "",
									HoraCarr: "",
									UserId: "",
									NomeOperador: "",
									Carregado: "",
									Adiado: ""
								};
								for(var i = 0; i < selectedItems.length; i++) {
									params.Unit = selectedItems[i].getAggregation("cells")[0].getProperty("title");
									params.Produto = selectedItems[i].getAggregation("cells")[0].getProperty("text");
									params.DataCarr = selectedItems[i].getAggregation("cells")[1].getProperty("text").substr(6,4) + selectedItems[i].getAggregation("cells")[1].getProperty("text").substr(3,2) + selectedItems[i].getAggregation("cells")[1].getProperty("text").substr(0,2);
									params.HoraCarr = selectedItems[i].getAggregation("cells")[1].getProperty("text").substr(13,2) + selectedItems[i].getAggregation("cells")[1].getProperty("text").substr(16,2) + selectedItems[i].getAggregation("cells")[1].getProperty("text").substr(19,2);
									params.UserId = selectedItems[i].getAggregation("cells")[2].getProperty("text");
									params.NomeOperador = selectedItems[i].getAggregation("cells")[2].getProperty("title");
									entityUrl = "/ZET_VPWM_UNITS_VIAGEMSet" + 
												"(Oc='" + _currentOrdem.oc + 
												"',ItemOc='" +  _currentOrdem.itemOc +
												"',RowId='" + _currentOrdem.rowId +
												"',Unit='" + selectedItems[i].getAggregation("cells")[0].getProperty("title") + "')";
									controller.setDataFromAPI(entityUrl, params, 2, null);
								}
							}
						}
					}
				);
			} else {
				sap.m.MessageToast.show("Selecione ao menos um registro");
			}
		},
		_reopenVoyage: function(sAction) {
			sap.ui.getCore().byId("unitsDialog").setBusyIndicatorDelay(1);
			sap.ui.getCore().byId("unitsDialog").setBusy(true);

			var sEvento = "A";
			var idEvento;

			var viagensModel = this.byId("tableViagens").getModel().oData;
			for(var i = 0; i < viagensModel.length; i++) {
				if (viagensModel[i].OcRowid.trim() === _currentOrdem.rowId) {
					idEvento = i;
				}
			}
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.publish("PoraoCarregamentoChannel", "onChangeStatusViagem", {
				id: idEvento,
				adiado: sEvento
			});
		},
		_closeVoyage: function() {
			sap.ui.getCore().byId("unitsDialog").setBusyIndicatorDelay(1);
			sap.ui.getCore().byId("unitsDialog").setBusy(true);

			var sEvento = "E";
			var idEvento;
			
			var viagensModel = this.byId("tableViagens").getModel().oData;
			for(var i = 0; i < viagensModel.length; i++) {
				if (viagensModel[i].OcRowid.trim() === _currentOrdem.rowId) {
					idEvento = i;
				}
			}
			
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.publish("PoraoCarregamentoChannel", "onChangeStatusViagem", {
				id: idEvento,
				adiado: sEvento
			});
		},
		_unitsDialogsButtonControl: function() {
			if (_currentOrdem.oc && _currentOrdem.itemOc && _currentOrdem.rowId) {
				var entityUrl = 'ZET_VPWM_CAR_POROESSet?';
				var filter = "$filter=Oc eq '" + _currentOrdem.oc + "' and Item eq '" + _currentOrdem.itemOc + "' and OcRowid eq '" + _currentOrdem.rowId + "'";
				var dataPromise = this.getDataFromAPI(_currentOrdem.oc, _currentOrdem.itemOc, entityUrl, filter, []);
	
				jQuery.when(dataPromise).then(
					function(results) {
						if (results.length > 0) {
							if (results[0].Carregado === "X") {
								sap.ui.getCore().byId("unitsDialogOpenVoyage").setVisible(true);
								sap.ui.getCore().byId("unitsDialogUnloadUnits").setVisible(false);
								sap.ui.getCore().byId("unitsDialogCloseVoyage").setVisible(false);
								sap.ui.getCore().byId("unitsDialogTable").setMode(sap.m.ListMode.None);
							} else {
								sap.ui.getCore().byId("unitsDialogOpenVoyage").setVisible(false);
								sap.ui.getCore().byId("unitsDialogUnloadUnits").setVisible(true);
								sap.ui.getCore().byId("unitsDialogCloseVoyage").setVisible(true);
								sap.ui.getCore().byId("unitsDialogTable").setMode(sap.m.ListMode.MultiSelect);
							}
						}
						sap.ui.getCore().byId("unitsDialog").setBusy(false);
					},
					function(err) {
						jQuery.sap.log.error(err);
					}
				);
			}
		},
		handleValueHelpParadas: function(oEvent) {
			//var sInputValue = oEvent.getSource().getValue(),
			var	oModel = oEvent.getSource().getModel(),
				aMotivos = oModel.getProperty('/');
			if (!this._oValueHelpDialog) {
				this._oValueHelpDialog = sap.ui.xmlfragment(
					"fibriembarque.view.MotivosParadaTableDialog",
					this
				);
				this.getView().addDependent(this._oValueHelpDialog);
			}

			oModel.setProperty('/', aMotivos);
			this._oValueHelpDialog.setModel(oModel);
			this._oValueHelpDialog.open();
		},
		handleSearchMotivoParada: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter({
						path: "Descr_EN", 
						operator: sap.ui.model.FilterOperator.Contains, 
						value1: sValue
					}),
					new sap.ui.model.Filter({
						path: "Descr_PT",
						operator: sap.ui.model.FilterOperator.Contains,
						value1: sValue
					}),
					new sap.ui.model.Filter({
						path: "codigoParada",
						operator: sap.ui.model.FilterOperator.Contains,
						value1: sValue
					}),
					new sap.ui.model.Filter({
						path: "Descricao",
						operator: sap.ui.model.FilterOperator.Contains,
						value1: sValue
					})
				],
				or: true|false
			});
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
		handleCloseMotivoParada : function(oEvent) {
			var oModel = oEvent.getSource().getModel(),
				aMotivos = oModel.getProperty('/'),
				oInput = sap.ui.getCore().byId("motivoParadaInput");

			if (oEvent.getId() === "confirm") {
				oInput.setValue(aMotivos[parseInt(oEvent.getParameter("selectedContexts")[0].sPath.substr(1))].codigoParada);
			} else {				
				oInput.setValue(null);
			}
		}
	});
}, /* bExport= */ true);