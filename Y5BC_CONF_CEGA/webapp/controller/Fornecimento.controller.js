sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessagePopover",
	"sap/m/MessageItem",
	"sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, MessagePopover, MessageItem, MessageBox) {
	"use strict";

	// var oMessageTemplate = new MessageItem({
	// 	type: '{msgModel>type}',
	// 	title: '{msgModel>title}',
	// 	description: '{msgModel>description}',
	// 	subtitle: '{msgModel>subtitle}',
	// 	counter: '{msgModel>counter}'
	// });

	return Controller.extend("Y5BC_CONF_CEGA.Y5BC_CONF_CEGA.controller.Fornecimento", {

		handleMessagePopoverPress: function (oEvent) {
			this._getMessagePopover().openBy(oEvent.getSource());
		},
		_getMessagePopover: function () {
			if (!this._oMessagePopover) {
				this._oMessagePopover = sap.ui.xmlfragment(this.getView().getId(), "Y5BC_CONF_CEGA.Y5BC_CONF_CEGA.fragment.BatchProcessingReturn",
					this);
				this.getView().addDependent(this._oMessagePopover);
			}
			return this._oMessagePopover;

		},

		aReturn: {
			suc: [],
			err: []
		},

		// _setMessages: function() {
		// 	var oMsgModel = this.getView().getModel("msgModel");

		// 	var aMsgs = [];

		// 	for (var i = 0; i < this.aReturn.err.length; i++) {
		// 		aMsgs.push({
		// 			type: 'Error',
		// 			title: this.aReturn.err[i].text
		// 		});
		// 	}

		// 	for (var i = 0; i < this.aReturn.suc.length; i++) {

		// 		if (this.aReturn.suc[i].text !== "") {
		// 			aMsgs.push({
		// 				type: 'Warning',
		// 				title: this.aReturn.suc[i].text
		// 			});
		// 		}
		// 	}

		// },

		_resetErrorCount: function () {

		},

		_bindView: function (oArguments) {

			var that = this;

			this._confTecnicaFlag = oArguments.confTecnica;

			if (!oArguments.series) {
				oArguments.series = '';
			}

			var btnRealizarContagem = this.getView().byId("btnRealizarContagem");

			if (!oArguments.erroContagem) {
				btnRealizarContagem.setText("Realizar Contagem Cega");
			} else {
				btnRealizarContagem.setText("Realizar Recontagem Cega");
			}

			var oModel = this.getView().getModel();
			var sKey = oModel.createKey("/ZET_CBEWM_FORNECIMENTOCBSet", {
				Lifnr: oArguments.lifnr,
				Nfnum: oArguments.nfnum,
				Series: oArguments.series
			});

			this.getView().bindElement({
				path: sKey,
				parameters: {
					expand: "ToIt"
				},
				events: {
					change: function (oEvent) {
						var oBndContext = that.getView().getElementBinding().getBoundContext();
						if (oBndContext) {
							that.setConfTecnicaStatus();
						}
					},
					dataReceived: function (oData) {
						that.setConfTecnicaStatus();
					}
				}
			});

			this._fornecimentoKey = {
				Lifnr: oArguments.lifnr,
				Nfnum: oArguments.nfnum,
				Series: oArguments.series
			};

			//this._resetTableFieldInputValues();
		},

		setConfTecnicaStatus: function () {
			var btnRealizarContagem = this.getView().byId("btnRealizarContagem");
			if (this._isContagemCegaFormValid(true)) {
				btnRealizarContagem.setText("Realizar Conferência Técnica");
				this._confTecnicaFlag = true;
			}
		},

		onInit: function () {

			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this._handleRoutePatternMatched, this);

			// this.getView().setModel(new JSONModel({}), "msgModel");

		},

		_clearReturnModel: function () {
			this.aReturn = {
				suc: [],
				err: []
			};
		},
		_handleRoutePatternMatched: function (oEvent) {

			if (oEvent.getParameter("name") !== "fornecimento") {
				return;
			}

			var oArguments = oEvent.getParameter("arguments");

			this._resetErrorCount(); //TODO

			this._clearReturnModel();

			this._bindView(oArguments);

		},

		onContagemCegaPress: function () {

			var oModel = this.getView().getModel();
			var aDeferredGroups = ["ContagemCegaId"];
			var este = this;

			oModel.setDeferredGroups(aDeferredGroups);
			var array = [];
			var oTable = this.byId("fornecimentoItemTable");
			var aItems = oTable.getItems();
			var obj;
			var gera_imp;

			if (!this._isContagemCegaFormValid()) {
				return;
			}

			this._contCegaRemainItems = aItems.length;
			this._contCegaTotalItems = aItems.length;
			this._contCegaProcessedItems = 0;

			for (var i = 0; i < aItems.length; i++) {
				var oItem = aItems[i];
				var obj2 = {
					matnr: null,
					vol: null
				};

				// if( qtd === 0 ){
				// 	qtd = parseFloat(oItem.getCells()[3].getValue().replace(',','.'));
				// }

				obj = oModel.getObject(oItem.getBindingContextPath());
				var vol = parseFloat(oItem.getCells()[6].getValue());

				obj2.matnr = obj.Matnr;
				obj2.vol = vol;
				obj2.pep = '';
				obj2.lote = '';
				array.push(obj2);
				este._array = array;

				this.callFunctionContagemCega(este, oItem, gera_imp);

			}

		},

		//Início - T3RODRIGODC - 03.02.2021

		hasConfTecnicaAsync: function (sParams) {
			var that = this;
			return new Promise(function (resolve, reject) {

				var oFilters = [
					new sap.ui.model.Filter('Lifnr', 'EQ', sParams.Lifnr),
					new sap.ui.model.Filter('Nfnum', 'EQ', sParams.Nfnum),
					new sap.ui.model.Filter('Series', 'EQ', sParams.Series)
				];

				that.getView().getModel().read("/ZET_CBEWM_FORNECIMENTOCBSet", {
					filters: oFilters,
					success: function (oData, response) {
						if (!oData.results.length) {
							resolve(false);
						} else {

							var oDados = oData.results[0];
							//Como essa função é chamada apenas em caso de Sucesso na contagem, 
							//Se mostrar erros, é por que ainda falta a conferência técnica.
							if (oDados.ErroContagem && oDados.ContagemRealizada) {
								resolve(true);
							} else {
								resolve(false);
							}
						}

					},
					error: function () {
						resolve(false);
					}
				});
			});
		},

		checkHasConfTecnica: async function (sParams) {

			var hasConfTecnica = await this.hasConfTecnicaAsync(sParams);

			if (hasConfTecnica) {
				this.goToConferenciaTecnica();
			} else {
				//for (var c = 0; c < this._array.length; c++) { 
				//	this._impressao(this._array[c].matnr, this._array[c].vol, this._array[c].pep, this._array[c].lote);
				//}

				MessageToast.show("Contagem realizada com sucesso.");
				if (this._confTecnicaItems) {
					if (!this._confTecnicaItems.length) {
						this.oRouter.navTo("worklist", true);
					}
				} else {
					this.oRouter.navTo("worklist", true);
				}
			}
		},

		callFunctionContagemCega: function (este, oItem, gera_imp, sConfTecnica) {

			var oModel = this.getView().getModel();

			if (oItem) {

				this._contCegaProcessedItems++;

				var obj = oModel.getObject(oItem.getBindingContextPath());
				var qtd = oItem.getCells()[5].getValue();
				var vol = parseFloat(oItem.getCells()[6].getValue());
				var usuario = sap.ushell.Container.getUser().getId();
				var sUrlParams = {};

				if (sConfTecnica) {
					sUrlParams = {
						Fornecedor: obj.Lifnr,
						Matnr: obj.Matnr,
						Nfe: obj.Nfnum,
						Serie: obj.Series,
						Subitem: obj.Subit,
						Ebeln: obj.Ebeln,
						Ebelp: obj.Ebelp,
						Quantidade: qtd,
						Usuario: usuario,
						Volume: vol,
						Maabc: "",
						Conferente: sConfTecnica.conferente,
						Matricula: sConfTecnica.matricula,
						Observacao: sConfTecnica.observacao
					};
				} else {
					sUrlParams = {
						Fornecedor: obj.Lifnr,
						Matnr: obj.Matnr,
						Nfe: obj.Nfnum,
						Serie: obj.Series,
						Subitem: obj.Subit,
						Ebeln: obj.Ebeln,
						Ebelp: obj.Ebelp,
						Quantidade: qtd,
						Usuario: usuario,
						Volume: vol,
						Maabc: obj.Maabc,
						Conferente: "",
						Matricula: "",
						Observacao: ""
					};
				}

				oModel.callFunction("/ContagemCega", {
					method: "POST",
					urlParameters: sUrlParams,
					success: function (oData, response) {

						este.checkHasConfTecnica(este._fornecimentoKey);
						
						// Ajuste Impressão por item
						this._impressao(obj.Matnr, vol, '', '', )

					}.bind(this),
					error: function (oError) {
						var oResponse = JSON.parse(oError.responseText);
						if (oResponse.hasOwnProperty("error")) {

							this.aReturn.err.push({
								text: oResponse.error.message.value
							});
							//MessageBox.error(oResponse.error.message.value);
							// oMessageModel.getData().push({
							// 	type: 'Error',
							// 	title: 'Erro',
							// 	description: oResponse.error.message.value
							// });
						}

					}.bind(this),
					groupId: "ContagemCegaId"
				});
			}

			este._contCegaRemainItems--;

			//Se o contador estiver zerado, significa que não falta nenhum item para ser enviado
			if (!este._contCegaRemainItems) {

				//Envia dados, caso tenha dados a ser processado
				if (this._contCegaProcessedItems) {
					este.submitChangesContagemCega(oModel);
				}
			}
		},

		goToConferenciaTecnica: function () {

			var that = this;

			this.getView().getModel().refresh();

			MessageBox.alert("Contagem realizada com sucesso, porém é necessário fazer a conferência técnica de um ou mais materiais", {
				onClose: function () {
					var sParams = that._fornecimentoKey;

					that.getOwnerComponent().getRouter().navTo("fornecimento", {
						lifnr: sParams.Lifnr,
						nfnum: sParams.Nfnum,
						series: sParams.Series,
						confTecnica: true
					});
				}
			});

		},

		checkConferenciaTecnica: function () {
			var that = this;

			if (this._confTecnicaItems.length) {
				var confTecnica = this._confTecnicaItems.shift();

				MessageBox.warning("Material " + confTecnica.obj.Matnr + " (" + confTecnica.obj.Maktx +
					") é crítico! \n Conferência técnica obrigatória para o item " + confTecnica.obj.Ebelp +
					".\nDeseja seguir para conferência técnica?", {
						actions: ["OK", "Voltar"],
						onClose: function (sAction) {
							if (sAction === "OK") {
								that.loadDialog(confTecnica.oItem);
								that._oDialog.open();
							} else {
								that.callFunctionContagemCega(that);
								that.checkConferenciaTecnica();
							}
						}
					});
			} else {
				//Verifica se usuário cancelou alguma conferência técnica
				if (this._contCegaProcessedItems !== this._contCegaTotalItems) {
					MessageBox.warning("Não foi realizada a conferência técnica para um ou mais material crítico", {
						onClose: function (sAction) {
							that.getView().getModel().refresh();
							that.oRouter.navTo("worklist", true);
						}
					});
				} else {
					this.oRouter.navTo("worklist", true);
				}
			}
		},

		submitChangesContagemCega: function (oModel) {
			var that = this;
			oModel.submitChanges({
				groupId: "ContagemCegaId",
				success: function (a, b) {
					oModel.refresh();

					var aItems = this.byId("fornecimentoItemTable").getItems();
					var aReturnTemp = [];
					var aReturnErrors = [];

					var aReturn = this.aReturn.err[0].text.split("|");

					that._confTecnicaItems = [];

					for (var e = 0; e < aReturn.length; e++) {

						var tipoMsg = aReturn[e].substring(0, 11);
						var oEbelp = aReturn[e].substring(12);

						if (tipoMsg === "CONFTECNICA") {

							for (var i = 0; i < aItems.length; i++) {
								var oItem = aItems[i];
								var obj = oModel.getObject(oItem.getBindingContextPath());

								if (obj.Ebelp === oEbelp) {
									that._confTecnicaItems.push({
										obj: obj,
										oItem: oItem
									});
								}
							}

						} else if (tipoMsg === "DIVERGENCIA") {
							aReturnTemp.push(oEbelp);
						} else {
							aReturnErrors.push(aReturn[e]);
						}
					}

					that._contCegaRemainItems = that._confTecnicaItems.length;
					that._contCegaTotalItems = that._confTecnicaItems.length;
					that._contCegaProcessedItems = 0;

					var sMessage;

					if (aReturnTemp.length <= 0) {

						if (aReturnErrors.length > 0) {

							for (var nErro = 0; nErro < aReturnErrors.length; nErro++) {
								sMessage = sMessage ? sMessage + "\n" + aReturnTemp[nErro] : aReturnTemp[nErro];
							}

						} else {

							//this._resetTableFieldInputValues();

							if (this.aReturn.suc.length > 0) {
								MessageBox.error(this.aReturn.suc[0].text);
							}

							this._clearReturnModel();
							if (that._confTecnicaFlag) {
								that.checkConferenciaTecnica();
							} else {
								if (that._confTecnicaItems.length) {
									that.goToConferenciaTecnica();
									return;
								}
							}
						}
					} else {
						sMessage = "A contagem cega foi salva, mas há divergência entre a quantidade inserida e a quantidade registrada na NF.";
						for (var n = 0; n < aReturnTemp.length; n++) {
							sMessage = sMessage + "\nItem: " + aReturnTemp[n];
						}

						this._clearReturnModel();
					}

					if (sMessage) {
						MessageBox.error(sMessage, {
							onClose: function () {
								that._resetTableFieldInputValues(aReturnTemp);
								that.oRouter.navTo("worklist", true);
							}
						});
					}

					// this._setMessages();

				}.bind(this),
				error: function (e) {
					oModel.refresh();
				}.bind(this)
			});
		},

		loadDialog: function (oItem) {
			//Diáologo dos Cadastro
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("Y5BC_CONF_CEGA.Y5BC_CONF_CEGA.view.conferenciaTecnica", this);
				this._oDialog.setModel(this.getView().getModel());
				this.getView().addDependent(this._oDialog);
				this._oDialog.setContentWidth("30rem");
				this._oItem = oItem;
			}
		},

		onBtnConfTecnicaConfirmPress: function () {

			var sConfTecnica = {
				conferente: sap.ui.getCore().byId("InputConferente").getValue(),
				matricula: sap.ui.getCore().byId("InputMatricula").getValue(),
				observacao: sap.ui.getCore().byId("InputObs").getValue()
			};

			if (!(sConfTecnica.conferente && sConfTecnica.matricula && sConfTecnica.observacao)) {
				MessageBox.error("Todos os campos devem ser preenchidos");
				return;
			}

			this.callFunctionContagemCega(this, this._oItem, sConfTecnica);
			this.oDialogConfCegaClose();
		},

		onBtnConfTecnicaClosePress: function () {
			this.callFunctionContagemCega(this);
			this.oDialogConfCegaClose();
		},

		oDialogConfCegaClose: function () {
			if (this._oDialog) {
				this._oDialog.close();
				this._oDialog.destroy();
				this._oDialog = undefined;
				this._oItem = undefined;
			}

			this.checkConferenciaTecnica();
		},
		//Fim - T3RODRIGODC - 03.02.2021

		_impressao: function (Matnr, vol, pep, lote) {
			var Id_Imp = 'M';
			var oModel2 = this.getOwnerComponent().getModel(),
				AvisoEntrega = this.getView().byId("IdAvisoEntrega").getText(),
				Item = ''; //"999999";
			//
			oModel2.callFunction("/ImprimirPorMaterial", {
				method: "POST",
				urlParameters: {
					Matnr: Matnr,
					Quantidade: vol,
					Name: this.getView().byId("imp").getSelectedItem().getKey(),
					AvisoEntrega: AvisoEntrega,
					Item: Item,
					Pep: pep,
					Lote: lote,
					Id_Imp: Id_Imp
				},
				success: function (oData, response) {

				}.bind(this),
				error: function (oError) {

				}
			});

		},

		_resetTableFieldInputValues: function (rItems) {
			var aItems = this.byId("fornecimentoItemTable").getItems();

			for (var i = 0; i < aItems.length; i++) {
				var oItem = aItems[i];
				var nItem = oItem.getCells()[1].getText();

				// oItem.getCells()[0].setValue("");
				// oItem.getCells()[1].setValue("");
				// oItem.getCells()[2].setValue("");
				for (var n = 0; n < rItems.length; n++) {
					if (rItems[n] === nItem) {
						oItem.getCells()[5].setValue("");
						oItem.getCells()[6].setValue("1");
						break;
					}
				}
			}
		},

		// onRegistrarEMPress: function(){

		// 	var oModel = this.getView().getModel();
		// 	var obj = this.getView().getBindingContext().getObject();
		// 	var sXmlChaveNfe = obj.XmlChaveNfe;
		// 	var sUrl = "http://vide0401.votorantim.grupo:8004/sap/bc/gui/sap/its/webgui?~transaction=ZGLMM490 S_BUKRS-LOW=2001&S_CHAVE-LOW=" + sXmlChaveNfe + "&~okcode=ONLI";

		// 	 sap.m.URLHelper.redirect(sUrl, true);
		// },

		onRegistrarEMPress: function () {

			var oModel = this.getView().getModel();
			var obj = this.getView().getBindingContext().getObject();

			oModel.callFunction("/RegistrarEntrMerc", {
				method: "POST",
				urlParameters: {
					Lifnr: obj.Lifnr,
					Nfnum: obj.Nfnum,
					Series: obj.Series

				},
				success: function (oData, response) {

					MessageToast.show("Entrada de mercadoria registrada com sucesso.");

				}.bind(this),
				error: function (oError) {
					var oResponse = JSON.parse(oError.responseText);
					if (oResponse.hasOwnProperty("error")) {

						MessageBox.error(oResponse.error.message.value);
					} else {
						MessageBox.error("Erro");
					}

				}.bind(this)
			});

		},

		_isContagemCegaFormValid: function (hideMessage) {

			var oTable = this.byId("fornecimentoItemTable");
			var aItems = oTable.getItems();
			var bValid = true;
			var qtd, vol;

			//TODO: substituir por constraints

			for (var i = 0; i < aItems.length; i++) {
				var oItem = aItems[i];

				qtd = oItem.getCells()[5].getValue();
				vol = oItem.getCells()[6].getValue();

				if (!oItem.getCells()[5].getEditable()) {

					qtd = 99;
				}

				//typeof x == "number" && x >= 0

				if (qtd === "" || isNaN(vol) || vol === "0") {
					if (!hideMessage) {
						MessageToast.show("Erro: preencha todos os campos antes de realizar a contagem.");
					}
					return false;
					// bValid = false; 
				}

			}

			return bValid;
		}

	});

});