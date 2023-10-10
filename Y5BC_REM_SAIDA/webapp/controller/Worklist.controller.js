/*global location history */
sap.ui.define([
	"ZCBLE_PR_REM_SAIDA/ZCBLE_PR_REM_SAIDA/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"ZCBLE_PR_REM_SAIDA/ZCBLE_PR_REM_SAIDA/model/formatter",
	"sap/ui/model/Filter",
	"sap/m/MessageToast",
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/Text',
	'jquery.sap.global',
	'sap/m/List',
	'sap/m/StandardListItem',
	'sap/m/MessageBox',
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, History, formatter, Filter, MessageToast, Dialog, Button, Text, Jquery, List, StandardListItem,
	MessageBox, FilterOperator) {
	"use strict";

	return BaseController.extend("ZCBLE_PR_REM_SAIDA.ZCBLE_PR_REM_SAIDA.controller.Worklist", {

		formatter: formatter,

		onInit: function() {
			var oViewModel;
			oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				saveAsTileTitle: this.getResourceBundle().getText("saveAsTileTitle", this.getResourceBundle().getText("worklistViewTitle")),
				shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0
			});
			this.setModel(oViewModel, "worklistView");
			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
			this.addHistoryEntry({
				title: this.getResourceBundle().getText("worklistViewTitle"),
				icon: "sap-icon://table-view",
				intent: "#Processoderemessadesaída-display"
			}, true);

			var oJsonModel = new sap.ui.model.json.JSONModel();
			oJsonModel.setData({
				Messages: []
			});

			oJsonModel.setSizeLimit(1000);

		},
		onSort: function() {
			var oTable = this.getView().byId("table2");
			oTable.sort(oTable.getColumns()[0]);
		},
		_getSmartTable: function() {
			if (!this._oSmartTable) {
				this._oSmartTable = this.getView().byId("smartTable2");
			}
			return this._oSmartTable;
		},
		onBeforeRendering: function() {
			this.byId('table1').setModel(this.jModel);
			this.byId('table2').setModel(this.jModel);

			//this.getView().byId("table2").getAggregation("rows").length)
		},
		onPress: function(oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},
		setState: function(oEvent) {
			var value = oEvent.getParameter("value");
			if (!value) {
				this.getView().byId("idTrans").setValueState("Error");
			} else {
				this.getView().byId("idTrans").setValueState("None");
			}
		},

		SetTransp: function(oEvent, sValue, sContador, sKey) {
			var table = this.getView().byId("table2");
			var cont = table.getSelectedIndex();

			var oModel = this.getView().getModel();
			//oModel.setUseBatch(false);

			var smartTable = this.getView().byId("smartTable2");
			var value = "";
			var cont = "";

			if (oEvent !== "") {

				value = oEvent.getParameter("value");
				cont = oEvent.getSource().getBindingContext().getObject().Contador;
				sKey = oEvent.getSource().getBindingContext().sPath;
			} else {
				if (cont === -1) {
					sap.m.MessageBox.error("Selecione ao menos um registro para alteração.");
					return;
				}
				cont = sContador;
				value = sValue;
			}

			var oParameters = {};
			oParameters.Transportadora = value;
			oParameters.Contador = cont;
			oParameters.Ano = oEvent.getSource().getBindingContext().getObject().Ano;
			oParameters.Fim = 'Z';
			oModel.update(sKey, oParameters);
			//			smartTable.rebindTable("e");
			//			this.getView().getModel().refresh();

		},
		SetTp: function(oEvent, sValue, sContador, sKey) {
			var table = this.getView().byId("table2");
			var cont = table.getSelectedIndex();

			var value = "";
			var cont = "";
			var oModel = this.getView().getModel();
			//oModel.setUseBatch(false);
			var smartTable = this.getView().byId("smartTable2");

			if (oEvent !== "") {
				value = oEvent.getParameter("value");
				cont = oEvent.getSource().getBindingContext().getObject().Contador;
				sKey = oEvent.getSource().getBindingContext().sPath;
			} else {
				if (cont === -1) {
					sap.m.MessageBox.error("Selecione ao menos um registro para alteração.");
					return;
				}
				cont = sContador;
				value = sValue;
			}

			var oParameters = {};

			oParameters.Tptrans = value;
			oParameters.Contador = cont;
			oParameters.Ano = oEvent.getSource().getBindingContext().getObject().Ano;
			oParameters.Fim = 'Y';
			oModel.update(sKey, oParameters);
			//				smartTable.rebindTable("e");
			//				this.getView().getModel().refresh();

		},

		SetDate: function(oEvent, sValue) {
			// var value = "";
			// if (!oEvent) {
			var value = oEvent.getParameter("value");
			// } else {
			// 	value = sValue;
			// }
			var oModel = this.getView().getModel();
			//oModel.setUseBatch(false);
			var smartTable = this.getView().byId("smartTable2");

			var oParameters = {};

			oParameters.Contador = oEvent.getSource().getBindingContext().getObject().Contador;
			oParameters.Audat = value;
			oParameters.Fim = 'D';
			oParameters.Ano = oEvent.getSource().getBindingContext().getObject().Ano;
			oModel.update(oEvent.getSource().getBindingContext().sPath, oParameters);
			//			smartTable.rebindTable("e");
			//			this.getView().getModel().refresh();

		},

		SetQtde: function(oEvent) {
			var value = oEvent.getParameter("value");
			var oModel = this.getView().getModel();
			//oModel.setUseBatch(false);
			var smartTable = this.getView().byId("smartTable2");
			//oModel.setUseBatch(false);

			var oParameters = {};

			oParameters.Qtde = value;
			oParameters.Contador = oEvent.getSource().getBindingContext().getObject().Contador;
			oParameters.Vbeln = oEvent.getSource().getBindingContext().getObject().Vbeln;
			oParameters.Posnr = oEvent.getSource().getBindingContext().getObject().Posnr;
			oParameters.Etenr = oEvent.getSource().getBindingContext().getObject().Etenr;
			oParameters.Banfn = oEvent.getSource().getBindingContext().getObject().Banfn;
			oParameters.Bnfpo = oEvent.getSource().getBindingContext().getObject().Bnfpo;
			oParameters.Ano = oEvent.getSource().getBindingContext().getObject().Ano;
			oParameters.Parceiro = oEvent.getSource().getBindingContext().getObject().Parceiro;
			oParameters.Fim = 'Q';
			oModel.update(oEvent.getSource().getBindingContext().sPath, oParameters);

			//			smartTable.rebindTable("e");
			//			this.getView().getModel().refresh();

		},
		CountCheck: function(oEvent) {
			var tot = "";
			var val = "";
			var table = this.getView().byId("table1");
			var selecionados = this.getView().byId("table1").getSelectedIndices();

			for (var i = 0; i < selecionados.length; i++) {

				val = parseFloat(table.getContextByIndex([selecionados[i]]).getObject().Qtd);
				tot = parseFloat(tot + val);
			}
			if (selecionados.length === 0) {
				tot = "";
			} else {
				tot = parseFloat(tot).toFixed(3);
			}
			this.getView().byId("Faturar").setValue(tot);
		},

		AnexarUC: function() {

			var table = this.getView().byId("table2");
			var selecionados = table.getSelectedIndices();
			if (selecionados.length > 1) {
				sap.m.MessageBox.error("Selecionar apenas um item");
			}
			if (selecionados.length < 1) {
				sap.m.MessageBox.error("Nenhum item selecionado");
			}

			var Contador = table.getContextByIndex([selecionados[0]]).getObject().Contador;
			var Vbeln = table.getContextByIndex([selecionados[0]]).getObject().Vbeln;
			var Etenr = table.getContextByIndex([selecionados[0]]).getObject().Etenr;
			var Parceiro = table.getContextByIndex([selecionados[0]]).getObject().Parceiro;
			var Matnr = table.getContextByIndex([selecionados[0]]).getObject().Matnr;
			var Qtde = table.getContextByIndex([selecionados[0]]).getObject().Qtde;

			this.getRouter().navTo("Ucs", {
				Contador: Contador,
				Vbeln: Vbeln,
				Etenr: Etenr,
				Parceiro: Parceiro,
				Matnr: Matnr,
				Qtde: Qtde

			});
		},
		onSelectFilter: function(oControlEvent) {

			// if (oControlEvent.getParameter("key") === "1") {
			// 	var smartTable = this.getView().byId("smartTable");
			// 	smartTable.rebindTable("e");

			// 	this.getView().byId("Faturar").setValue("");
			// } else if (oControlEvent.getParameter("key") === "2") {
			// 	var smartTable2 = this.getView().byId("smartTable2");
			// 	smartTable2.rebindTable("e");
			// } else if (oControlEvent.getParameter("key") === "3") {
			// 	var smartTable3 = this.getView().byId("smartTable3");
			// 	smartTable3.rebindTable("e");
			// }
		},

		_showObject: function(oItem) {
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("Vbeln")
			});
		},

		atualizasmart: function(oEvent) {
			this.getView().byId("Faturar").setValue("");

		},

		atualizasmart2: function(oEvent) {

			var filter01 = new sap.ui.model.Filter({
				path: "Fim",
				operator: "EQ",
				value1: "Z"
			});
			// var user = sap.ushell.Container.getUser().getId();
			// var filter02 = new sap.ui.model.Filter({
			// 	path: "Uname",
			// 	operator: "EQ",
			// 	value1: user
			// });
			oEvent.getParameter("bindingParams").filters.push(filter01);

		},

		atualizasmart3: function(oEvent) {
			var filter01 = new sap.ui.model.Filter({
				path: "Fim",
				operator: "EQ",
				value1: "X"
			});

			oEvent.getParameter("bindingParams").filters.push(filter01);

		},
		CriarPedTrans: function() {
			var oModel = this.getView().getModel();
			oModel.setUseBatch(true);
			var table = this.getView().byId("table1");
			var selecionados = table.getSelectedIndices();
			var smartTable = this.getView().byId("smartTable");
			var oParameters = {};
			var este = this;
			var sTexto;
			// var _oComponent = this.getOwnerComponent();
			// var oList = _oComponent.oListSelector._oList;
			// var oListBinding = oList.getBinding("items");

			if (selecionados.length === 0) {
				sap.m.MessageBox.error("Nenhum registro selecionado.");
				return;
			} else {
				for (var i = 0; i < selecionados.length; i++) {

					var ped = table.getContextByIndex([selecionados[i]]).getObject().Ebeln;
					var req = table.getContextByIndex([selecionados[i]]).getObject().Banfn;
					if (ped) {
						sap.m.MessageBox.error("Requisição" + req + "Já tem pedido de transferência");
						return;
					}
					var ov = table.getContextByIndex([selecionados[i]]).getObject().Vbeln;
					if (ov) {
						sap.m.MessageBox.error("Não é possível criar pedido de transferência para ordem de venda!");
						return;
					}
				}

				for (i = 0; i < selecionados.length; i++) {

					oParameters = {};
					oParameters.Vbeln = table.getContextByIndex([selecionados[i]]).getObject().Vbeln;
					oParameters.Posnr = table.getContextByIndex([selecionados[i]]).getObject().Posnr;
					oParameters.Matnr = table.getContextByIndex([selecionados[i]]).getObject().Matnr;
					oParameters.Etenr = table.getContextByIndex([selecionados[i]]).getObject().Etenr;
					oParameters.Banfn = table.getContextByIndex([selecionados[i]]).getObject().Banfn;
					oParameters.Bnfpo = table.getContextByIndex([selecionados[i]]).getObject().Bnfpo;
					oParameters.Parceiro = table.getContextByIndex([selecionados[i]]).getObject().Parceiro;
					oParameters.Meins = table.getContextByIndex([selecionados[i]]).getObject().Meins;
					// oParameters.Vkorg = table.getContextByIndex([selecionados[i]]).getObject().Vkorg;
					// oParameters.Vtweg = table.getContextByIndex([selecionados[i]]).getObject().Vtweg;
					// oParameters.Spart = table.getContextByIndex([selecionados[i]]).getObject().Spart;
					oParameters.Auart = table.getContextByIndex([selecionados[i]]).getObject().Auart;
					oParameters.Werks = table.getContextByIndex([selecionados[i]]).getObject().Werks;
					oParameters.Audat = table.getContextByIndex([selecionados[i]]).getObject().Wadat;

					oParameters.Uname = sap.ushell.Container.getUser().getId();
					oParameters.Fim = "P";

					// oModel.update("/" + smartTable._getRowBinding().aKeys[selecionados[i]], oParameters);

					oModel.update("/" + smartTable._getRowBinding().aKeys[selecionados[i]], oParameters, {
						success: function(oData, oResponse) {
							// var hdrMessage = oResponse.headers["sap-message"];
							// var hdrMessageObject = JSON.parse(hdrMessage);
							// sap.m.MessageBox.warning(hdrMessageObject.message);
							//oListBinding.refresh(true);
							if (!sTexto) {
								sTexto = "Pedido criado com sucesso!";
								//smartTable.rebindTable("e");
								//este.getView().getModel().refresh();

								MessageBox.show(sTexto);
							}
						},
						error: function(oError) {
							if (!sTexto) {
								for (i = 0; i < JSON.parse(oError.responseText).error.innererror.errordetails.length; i++) {
									var message = "- " + JSON.parse(oError.responseText).error.innererror.errordetails[i].message + "\n";
									sTexto = sTexto + message;
								}
								sap.m.MessageBox.error(sTexto);
							}
							//sap.m.MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
						}
					});
				}
				// for (i = 0; i < selecionados.length; i++) {
				// 	table.setSelectedIndex(selecionados[i]);
				// }

			}

		},

		agruparRemessa: function() {

			var oModel = this.getView().getModel();
			oModel.setUseBatch(true);
			var table = this.getView().byId("table1");
			var table3 = this.getView().byId("table3");
			var selecionados = table.getSelectedIndices();
			var smartTable = this.getView().byId("smartTable");
			var smartTable3 = this.getView().byId("smartTable3");
			var oParameters = {};
			var valor;
			var este = this;
			var sTexto;

			var tpveic = this.getView().byId("IdTpVeiculo").getValue();
			if (!tpveic) {
				sap.m.MessageBox.error("é necessário informar o veículo antes de agrupar!");
				return;
			}

			var oModel2 = new sap.ui.model.json.JSONModel();
			var serviceUrl = "/sap/opu/odata/sap/ZGWCBLE_REMESSA_SAIDA_SRV/ZET_CBMM_CF_VEIC_HSet/$count?$filter=Matnr eq '" +
				tpveic + "'";

			oModel2.loadData(serviceUrl, null, false, "GET", false, false, null);
			var oInd = oModel2.getData();

			if (oInd < 1) {
				sap.m.MessageToast.show("Veículo inválido!");
				return;
			}

			for (var i = 0; i < selecionados.length; i++) {
				var Ebeln = table.getContextByIndex([selecionados[i]]).getObject().Ebeln;
				var banfn = table.getContextByIndex([selecionados[i]]).getObject().Banfn;
				if (!Ebeln && banfn) {

					sap.m.MessageBox.error("Não é possível agrupar RC sem pedido de transferência");
					return;
				}

			}

			if (selecionados.length === 0) {
				sap.m.MessageBox.error("Nenhum registro selecionado.");
				return;
			} else {

				var qtd_veic = parseFloat(this.getView().byId("IdCapa").getValue());
				var tot_selec = parseFloat(this.getView().byId("Faturar").getValue());

				if (tot_selec > qtd_veic) {
					//sap.m.MessageBox.error("Veículo informado não suporta a capacidade total dos itens selecionados, deseja prosseguir?");
					var texto = "Veículo informado não suporta a capacidade total dos itens selecionados, deseja prosseguir?";
					var dialog = new Dialog({
						title: "Confirmação",
						type: "Message",
						content: new Text({
							text: texto
						}),
						beginButton: new Button({
							text: "Sim",
							press: function() {
								// var index = este.getView().byId("table3").getBinding("rows").getLength();

								// if (index === 0) {
								// 	var contador = 1;
								// } else {
								// 	index = index - 1;
								// 	contador = table3.getContextByIndex(index).getObject().Contador;
								// 	contador = parseInt(contador) + 1;
								// }

								for (i = 0; i < selecionados.length; i++) {

									oParameters = {};
									//oParameters.Contador = contador.toString();
									oParameters.Vbeln = table.getContextByIndex([selecionados[i]]).getObject().Vbeln;
									oParameters.Remessa = table.getContextByIndex([selecionados[i]]).getObject().Remessa;
									oParameters.Posnr = table.getContextByIndex([selecionados[i]]).getObject().Posnr;
									oParameters.Banfn = table.getContextByIndex([selecionados[i]]).getObject().Banfn;
									oParameters.Bnfpo = table.getContextByIndex([selecionados[i]]).getObject().Bnfpo;
									oParameters.Matnr = table.getContextByIndex([selecionados[i]]).getObject().Matnr;
									oParameters.Qtd = table.getContextByIndex([selecionados[i]]).getObject().Qtd;
									//capacidade do veículo
									//oParameters.Faturar = this.getView().byId("IdCapa").getValue();
									oParameters.Etenr = table.getContextByIndex([selecionados[i]]).getObject().Etenr;
									oParameters.Emissor = table.getContextByIndex([selecionados[i]]).getObject().Emissor;
									oParameters.Tpveic = este.getView().byId("IdTpVeiculo").getValue();
									oParameters.Ebeln = table.getContextByIndex([selecionados[i]]).getObject().Ebeln;
									oParameters.Ebelp = table.getContextByIndex([selecionados[i]]).getObject().Ebelp;

									oParameters.Meins = table.getContextByIndex([selecionados[i]]).getObject().Meins;
									// oParameters.Vkorg = table.getContextByIndex([selecionados[i]]).getObject().Vkorg;
									// oParameters.Vtweg = table.getContextByIndex([selecionados[i]]).getObject().Vtweg;
									// oParameters.Spart = table.getContextByIndex([selecionados[i]]).getObject().Spart;
									oParameters.Auart = table.getContextByIndex([selecionados[i]]).getObject().Auart;
									oParameters.FamExpedicaoD = table.getContextByIndex([selecionados[i]]).getObject().FamExpedicaoD;
									oParameters.Werks = table.getContextByIndex([selecionados[i]]).getObject().Werks;
									oParameters.Matkl = table.getContextByIndex([selecionados[i]]).getObject().Matkl;
									oParameters.WerksSol = table.getContextByIndex([selecionados[i]]).getObject().WerksSol;
									oParameters.Wadat = table.getContextByIndex([selecionados[i]]).getObject().Wadat;
									oParameters.Uname = sap.ushell.Container.getUser().getId();

									oParameters.Fim = "A";

									oModel.update("/" + smartTable._getRowBinding().aKeys[selecionados[i]], oParameters, {
										success: function(oData, oResponse) {
											// var hdrMessage = oResponse.headers["sap-message"];
											// var hdrMessageObject = JSON.parse(hdrMessage);
											// sap.m.MessageBox.warning(hdrMessageObject.message);
											// //oListBinding.refresh(true);
											if (!sTexto) {
												sTexto = "Agrupamento efetuado com sucesso";
												smartTable.rebindTable("e");
												este.getView().getModel().refresh();
												MessageBox.show(sTexto);
											}
										},
										error: function(oError) {
											// var sTexto = "";
											// for (i = 0; i < JSON.parse(oError.responseText).error.innererror.errordetails.length; i++) {
											// 	var message = "- " + JSON.parse(oError.responseText).error.innererror.errordetails[i].message + "\n";
											// 	sTexto = sTexto + message;
											// }
											// sap.m.MessageBox.error(sTexto);
											//sap.m.MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
										}
									});
								}

								este.getView().byId("IdCapa").setValue("");
								este.getView().byId("IdTpVeiculo").setValue("");
								este.getView().byId("IdUM").setValue("");
								dialog.close();
							}
						}),
						endButton: new Button({
							text: "Cancelar",
							press: function() {
								dialog.close();
							}
						}),
						afterClose: function() {
							dialog.destroy();
						}
					});
					dialog.open();

				} else {
					// var index = este.getView().byId("table3").getBinding("rows").getLength();

					// if (index === 0) {
					// 	var contador = 1;
					// } else {
					// 	index = index - 1;
					// 	contador = table3.getContextByIndex(index).getObject().Contador;
					// 	contador = parseInt(contador) + 1;
					// }

					for (i = 0; i < selecionados.length; i++) {

						oParameters = {};
						//oParameters.Contador = contador.toString();
						oParameters.Vbeln = table.getContextByIndex([selecionados[i]]).getObject().Vbeln;
						oParameters.Remessa = table.getContextByIndex([selecionados[i]]).getObject().Remessa;
						oParameters.Posnr = table.getContextByIndex([selecionados[i]]).getObject().Posnr;
						oParameters.Banfn = table.getContextByIndex([selecionados[i]]).getObject().Banfn;
						oParameters.Bnfpo = table.getContextByIndex([selecionados[i]]).getObject().Bnfpo;
						oParameters.Matnr = table.getContextByIndex([selecionados[i]]).getObject().Matnr;
						oParameters.Qtd = table.getContextByIndex([selecionados[i]]).getObject().Qtd;
						//capacidade do veículo
						//oParameters.Faturar = this.getView().byId("IdCapa").getValue();
						oParameters.Etenr = table.getContextByIndex([selecionados[i]]).getObject().Etenr;
						oParameters.Emissor = table.getContextByIndex([selecionados[i]]).getObject().Emissor;
						oParameters.Tpveic = este.getView().byId("IdTpVeiculo").getValue();
						oParameters.Ebeln = table.getContextByIndex([selecionados[i]]).getObject().Ebeln;
						oParameters.Ebelp = table.getContextByIndex([selecionados[i]]).getObject().Ebelp;

						oParameters.Meins = table.getContextByIndex([selecionados[i]]).getObject().Meins;
						// oParameters.Vkorg = table.getContextByIndex([selecionados[i]]).getObject().Vkorg;
						// oParameters.Vtweg = table.getContextByIndex([selecionados[i]]).getObject().Vtweg;
						// oParameters.Spart = table.getContextByIndex([selecionados[i]]).getObject().Spart;
						oParameters.Auart = table.getContextByIndex([selecionados[i]]).getObject().Auart;
						oParameters.FamExpedicaoD = table.getContextByIndex([selecionados[i]]).getObject().FamExpedicaoD;
						oParameters.Werks = table.getContextByIndex([selecionados[i]]).getObject().Werks;
						oParameters.Matkl = table.getContextByIndex([selecionados[i]]).getObject().Matkl;
						oParameters.WerksSol = table.getContextByIndex([selecionados[i]]).getObject().WerksSol;
						oParameters.Wadat = table.getContextByIndex([selecionados[i]]).getObject().Wadat;
						oParameters.Uname = sap.ushell.Container.getUser().getId();

						oParameters.Fim = "A";

						oModel.update("/" + smartTable._getRowBinding().aKeys[selecionados[i]], oParameters, {
							success: function(oData, oResponse) {
								// var hdrMessage = oResponse.headers["sap-message"];
								// var hdrMessageObject = JSON.parse(hdrMessage);
								// sap.m.MessageBox.warning(hdrMessageObject.message);
								// //oListBinding.refresh(true);
								if (!sTexto) {
									sTexto = "Agrupamento efetuado com sucesso";
									smartTable.rebindTable("e");
									este.getView().getModel().refresh();
									MessageBox.show(sTexto);
								}
							},
							error: function(oError) {
								// var sTexto;
								// for (i = 0; i < JSON.parse(oError.responseText).error.innererror.errordetails.length; i++) {
								// 	var message = "- " + JSON.parse(oError.responseText).error.innererror.errordetails[i].message + "\n";
								// 	sTexto = sTexto + message;
								// }
								// sap.m.MessageBox.error(sTexto);
								//sap.m.MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
							}
						});
					}

					este.getView().byId("IdCapa").setValue("");
					este.getView().byId("IdTpVeiculo").setValue("");
					este.getView().byId("IdUM").setValue("");
					smartTable.rebindTable("e");
					este.getView().getModel().refresh();
				}

			}

		},

		gravaObs: function(oEvent) {
			var oModel = this.getView().getModel();
			var obs = oEvent.getParameter("newValue");
			var oParameters = {};
			var smartTable = this.getView().byId("smartTable");
			var este = this;

			oParameters.Obs = obs;
			oParameters.Fim = 'O';
			oParameters.Contador = oEvent.getSource().getBindingContext().getObject().Contador;
			oParameters.VbelnR = oEvent.getSource().getBindingContext().getObject().VbelnR;
			oParameters.Ano = oEvent.getSource().getBindingContext().getObject().Ano;
			oModel.update(oEvent.getSource().getBindingContext().sPath, oParameters, {
				success: function(oData, oResponse) {

					//smartTable.rebindTable("e");
					//este.getView().getModel().refresh();
				},
				error: function(oError) {
					// var sTexto = "";
					// for (var i = 0; i < JSON.parse(oError.responseText).error.innererror.errordetails.length; i++) {
					// 	var message = "- " + JSON.parse(oError.responseText).error.innererror.errordetails[i].message + "\n";
					// 	sTexto = sTexto + message;
					// }
					// sap.m.MessageBox.error(sTexto);
					// //sap.m.MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
				}
			});

		},

		quebraItens: function() {

			var oModel = this.getView().getModel();
			oModel.setUseBatch(true);
			var table = this.getView().byId("table1");
			var table3 = this.getView().byId("table3");
			var selecionados = table.getSelectedIndices();
			var smartTable = this.getView().byId("smartTable");
			var smartTable3 = this.getView().byId("smartTable3");
			var oParameters = {};
			var tpveic = this.getView().byId("IdTpVeiculo").getValue();
			var este = this;
			var sTexto;

			var oModel2 = new sap.ui.model.json.JSONModel();
			var serviceUrl = "/sap/opu/odata/sap/ZGWCBLE_REMESSA_SAIDA_SRV/ZET_CBMM_CF_VEIC_HSet/$count?$filter=Matnr eq '" +
				tpveic + "'";

			oModel2.loadData(serviceUrl, null, false, "GET", false, false, null);
			var oInd = oModel2.getData();

			if (oInd < 1) {
				sap.m.MessageToast.show("Veículo inválido!");
				return;
			}

			if (!tpveic) {
				sap.m.MessageBox.error("é necessário informar o veículos antes de efetuar a quebra!");
				return;
			}

			for (var i = 0; i < selecionados.length; i++) {
				var Ebeln = table.getContextByIndex([selecionados[i]]).getObject().Ebeln;
				var banfn = table.getContextByIndex([selecionados[i]]).getObject().Banfn;
				if (!Ebeln && banfn) {

					sap.m.MessageBox.error("Não é possível fazer a quebra de RC sem pedido de transferência");
					return;
				}

			}

			// var index = this.getView().byId("table3").getBinding("rows").getLength();

			// if (index === 0) {
			// 	var contador = 1;
			// } else {
			// 	index = index - 1;
			// 	contador = table3.getContextByIndex(index).getObject().Contador;
			// 	contador = parseInt(contador) + 1;
			// }

			if (selecionados.length === 0) {
				sap.m.MessageBox.error("Nenhum registro selecionado.");
				return;
			} else {
				for (var a = 0; a < selecionados.length; a++) {
					oParameters = {};
					//oParameters.Contador = contador.toString();
					oParameters.Remessa = table.getContextByIndex([selecionados[a]]).getObject().Remessa;
					oParameters.Vbeln = table.getContextByIndex([selecionados[a]]).getObject().Vbeln;
					oParameters.Posnr = table.getContextByIndex([selecionados[a]]).getObject().Posnr;
					oParameters.Etenr = table.getContextByIndex([selecionados[a]]).getObject().Etenr;
					oParameters.Banfn = table.getContextByIndex([selecionados[a]]).getObject().Banfn;
					oParameters.Bnfpo = table.getContextByIndex([selecionados[a]]).getObject().Bnfpo;
					oParameters.Matnr = table.getContextByIndex([selecionados[a]]).getObject().Matnr;
					oParameters.Qtd = table.getContextByIndex([selecionados[a]]).getObject().Qtd;
					//oParameters.Faturar = this.getView().byId("IdCapa").getValue();
					oParameters.Emissor = table.getContextByIndex([selecionados[a]]).getObject().Emissor;
					oParameters.Meins = table.getContextByIndex([selecionados[a]]).getObject().Meins;
					// oParameters.Vkorg = table.getContextByIndex([selecionados[a]]).getObject().Vkorg;
					// oParameters.Vtweg = table.getContextByIndex([selecionados[a]]).getObject().Vtweg;
					// oParameters.Spart = table.getContextByIndex([selecionados[a]]).getObject().Spart;
					oParameters.Ebeln = table.getContextByIndex([selecionados[a]]).getObject().Ebeln;
					oParameters.Ebelp = table.getContextByIndex([selecionados[a]]).getObject().Ebelp;
					oParameters.Auart = table.getContextByIndex([selecionados[a]]).getObject().Auart;
					oParameters.Matkl = table.getContextByIndex([selecionados[a]]).getObject().Matkl;
					oParameters.Werks = table.getContextByIndex([selecionados[a]]).getObject().Werks;
					oParameters.FamExpedicaoD = table.getContextByIndex([selecionados[a]]).getObject().FamExpedicaoD;
					oParameters.WerksSol = table.getContextByIndex([selecionados[a]]).getObject().WerksSol;
					oParameters.Wadat = table.getContextByIndex([selecionados[a]]).getObject().Wadat;
					oParameters.Tpveic = this.getView().byId("IdTpVeiculo").getValue();
					oParameters.Uname = sap.ushell.Container.getUser().getId();

					oParameters.Fim = "X";

					oModel.update("/" + smartTable._getRowBinding().aKeys[selecionados[a]], oParameters, {
						success: function(oData, oResponse) {
							// var hdrMessage = oResponse.headers["sap-message"];
							// var hdrMessageObject = JSON.parse(hdrMessage);
							// sap.m.MessageBox.warning(hdrMessageObject.message);
							//oListBinding.refresh(true);
							if (!sTexto) {
								sTexto = "Quebra efetuado com sucesso";
								smartTable.rebindTable("e");
								este.getView().getModel().refresh();
								MessageBox.show(sTexto);

							}

						},
						error: function(oError) {

							for (i = 0; i < JSON.parse(oError.responseText).error.innererror.errordetails.length; i++) {
								var message = "- " + JSON.parse(oError.responseText).error.innererror.errordetails[i].message + "\n";
								sTexto = sTexto + message;
							}
							sap.m.MessageBox.error(sTexto);
							//sap.m.MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
						}
					});

				}
			}
			this.getView().byId("IdCapa").setValue("");
			this.getView().byId("IdTpVeiculo").setValue("");
			this.getView().byId("IdUM").setValue("");
		},

		CriarRemessaAgrup: function() {

			var oModel = this.getView().getModel();
			oModel.setUseBatch(true);
			var table = this.getView().byId("table2");
			var selecionados = table.getSelectedIndices();
			var smartTable = this.getView().byId("smartTable2");
			var oParameters = {};
			var sTexto;
			var este = this;

			if (parseInt(this.getView().byId("table2").getAggregation("rows").length) !== 0) {
				table.setVisibleRowCount(parseInt(this.getView().byId("table2").getAggregation("rows").length));
			}

			if (selecionados.length === 0) {
				sap.m.MessageBox.error("Nenhum item selecionado");
				return;
			}

			for (var i = 0; i < selecionados.length; i++) {
				oParameters = {};
				var rem = table.getContextByIndex([selecionados[i]]).getObject().VbelnR;
				if (rem) {
					sap.m.MessageBox.error("Item já tem remessa criada");
					return;
				}

				var cred = table.getContextByIndex([selecionados[i]]).getObject().Cmgst;
				if (cred === "B" || cred === "C") {
					sap.m.MessageBox.error("Não é possível criar remessa para OV com bloqueio de crédito");
					return;
				}
			}

			for (i = 0; i < selecionados.length; i++) {
				if (oParameters.Contador !== table.getContextByIndex([selecionados[i]]).getObject().Contador) {
					oParameters = {};
					oParameters.Vbeln = table.getContextByIndex([selecionados[i]]).getObject().Vbeln;
					oParameters.Posnr = table.getContextByIndex([selecionados[i]]).getObject().Posnr;
					oParameters.Ano = table.getContextByIndex([selecionados[i]]).getObject().Ano;
					oParameters.Etenr = table.getContextByIndex([selecionados[i]]).getObject().Etenr;
					oParameters.Banfn = table.getContextByIndex([selecionados[i]]).getObject().Banfn;
					oParameters.Bnfpo = table.getContextByIndex([selecionados[i]]).getObject().Bnfpo;
					oParameters.Parceiro = table.getContextByIndex([selecionados[i]]).getObject().Parceiro;
					oParameters.Contador = table.getContextByIndex([selecionados[i]]).getObject().Contador;
					// oParameters.Vkorg = table.getContextByIndex([selecionados[i]]).getObject().Vkorg;
					// oParameters.Vtweg = table.getContextByIndex([selecionados[i]]).getObject().Vtweg;
					// oParameters.Spart = table.getContextByIndex([selecionados[i]]).getObject().Spart;
					oParameters.Auart = table.getContextByIndex([selecionados[i]]).getObject().Auart;
					oParameters.Werks = table.getContextByIndex([selecionados[i]]).getObject().Werks;
					oParameters.Audat = table.getContextByIndex([selecionados[i]]).getObject().Audat;

					oParameters.Uname = sap.ushell.Container.getUser().getId();
					oParameters.Fim = 'R';

					oModel.update("/" + smartTable._getRowBinding().aKeys[selecionados[i]], oParameters, {
						success: function(oData, oResponse) {
							// var hdrMessage = oResponse.headers["sap-message"];
							// var hdrMessageObject = JSON.parse(hdrMessage);
							// sap.m.MessageBox.warning(hdrMessageObject.message);
							// oListBinding.refresh(true);
							if (!sTexto) {
								sTexto = "Remessa criada";
								smartTable.rebindTable("e");
								este.getView().getModel().refresh();
								MessageBox.show(sTexto);
							}
						},
						error: function(oError) {
							if (!sTexto) {
								for (i = 0; i < JSON.parse(oError.responseText).error.innererror.errordetails.length; i++) {
									var message = "- " + JSON.parse(oError.responseText).error.innererror.errordetails[i].message + "\n";
									sTexto = sTexto + message;
								}
								sap.m.MessageBox.error(sTexto);
								//sap.m.MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
							}
						}
					});
				}
			}

		},

		CriarRemessaIndiv: function() {

			var oModel = this.getView().getModel();
			oModel.setUseBatch(true);
			var table = this.getView().byId("table2");
			var selecionados = table.getSelectedIndices();
			var smartTable = this.getView().byId("smartTable2");
			var oParameters = {};
			var este = this;
			var sTexto;

			if (selecionados.length === 0) {
				sap.m.MessageBox.error("Nenhum item selecionado");
				return;
			}

			for (var i = 0; i < selecionados.length; i++) {
				oParameters = {};
				var rem = table.getContextByIndex([selecionados[i]]).getObject().VbelnR;
				if (rem) {
					sap.m.MessageBox.error("Item já tem remessa criada");
					return;
				}

				var cred = table.getContextByIndex([selecionados[i]]).getObject().Cmgst;
				if (cred === "B" || cred === "C") {
					sap.m.MessageBox.error("Não é possível criar remessa para OV com bloqueio de crédito");
					return;
				}
			}

			for (i = 0; i < selecionados.length; i++) {

				oParameters = {};
				oParameters.Vbeln = table.getContextByIndex([selecionados[i]]).getObject().Vbeln;
				oParameters.Posnr = table.getContextByIndex([selecionados[i]]).getObject().Posnr;
				oParameters.Etenr = table.getContextByIndex([selecionados[i]]).getObject().Etenr;
				oParameters.Banfn = table.getContextByIndex([selecionados[i]]).getObject().Banfn;
				oParameters.Ano = table.getContextByIndex([selecionados[i]]).getObject().Ano;
				oParameters.Bnfpo = table.getContextByIndex([selecionados[i]]).getObject().Bnfpo;
				oParameters.Parceiro = table.getContextByIndex([selecionados[i]]).getObject().Parceiro;
				oParameters.Contador = table.getContextByIndex([selecionados[i]]).getObject().Contador;
				// oParameters.Vkorg = table.getContextByIndex([selecionados[i]]).getObject().Vkorg;
				// oParameters.Vtweg = table.getContextByIndex([selecionados[i]]).getObject().Vtweg;
				// oParameters.Spart = table.getContextByIndex([selecionados[i]]).getObject().Spart;
				oParameters.Auart = table.getContextByIndex([selecionados[i]]).getObject().Auart;
				oParameters.Werks = table.getContextByIndex([selecionados[i]]).getObject().Werks;
				oParameters.Audat = table.getContextByIndex([selecionados[i]]).getObject().Audat;
				oParameters.Uname = sap.ushell.Container.getUser().getId();
				oParameters.Fim = 'I';

				oModel.update("/" + smartTable._getRowBinding().aKeys[selecionados[i]], oParameters, {
					success: function(oData, oResponse) {
						// var hdrMessage = oResponse.headers["sap-message"];
						// var hdrMessageObject = JSON.parse(hdrMessage);
						// sap.m.MessageBox.warning(hdrMessageObject.message);
						// oListBinding.refresh(true);
						if (!sTexto) {
							sTexto = "Remessa criada";
							//smartTable.rebindTable("e");
							este.getView().getModel().refresh();
							MessageBox.show(sTexto);
						}
					},
					error: function(oError) {

						if (!sTexto) {
							for (i = 0; i < JSON.parse(oError.responseText).error.innererror.errordetails.length; i++) {
								var message = "- " + JSON.parse(oError.responseText).error.innererror.errordetails[i].message + "\n";
								sTexto = sTexto + message;
							}
							sap.m.MessageBox.error(sTexto);
							//sap.m.MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
						}

						//sap.m.MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
					}
				});
			}

		},

		Desagrupar: function() {

			var oModel = this.getView().getModel();
			oModel.setUseBatch(true);
			var table = this.getView().byId("table2");
			var selecionados = table.getSelectedIndices();
			var smartTable = this.getView().byId("smartTable2");
			var erro = "";
			var este = this;

			for (var i = 0; i < selecionados.length; i++) {

				var rem = table.getContextByIndex([selecionados[i]]).getObject().VbelnR;
				if (rem) {
					sap.m.MessageBox.error("Não é possível desagrupar item com remessa criada");
					return;
				}

			}

			if (selecionados.length === 0) {
				sap.m.MessageBox.error("Nenhum registro selecionado.");
				return;
			} else {

				var texto = "Deseja desagrupar o item selecionado?";
				var dialog = new Dialog({
					title: "Confirmação",
					type: "Message",
					content: new Text({
						text: texto
					}),
					beginButton: new Button({
						text: "Sim",
						press: function() {
							for (var i = 0; i < selecionados.length; i++) {
								var oEntry = "/" + smartTable._getRowBinding().aKeys[selecionados[i]];

								oModel.remove(oEntry, {
									method: "DELETE",
									success: function(data) {

										smartTable.rebindTable("e");
										este.getView().getModel().refresh();
										sap.m.MessageBox.success("Desagrupamento efetuado com sucesso!");
										erro = 0;
									},
									error: function(e) {
										sap.m.MessageBox.error("Não foi possível efetuar o desagrupamento");
										erro = 1;
									}
								});
							}

							dialog.close();

						}
					}),
					endButton: new Button({
						text: "Cancelar",
						press: function() {
							dialog.close();
						}
					}),
					afterClose: function() {
						dialog.destroy();
					}
				});
				dialog.open();

			}

		},

		CriarTransp: function() {

			var oModel = this.getView().getModel();
			oModel.setUseBatch(true);
			var table = this.getView().byId("table2");
			var selecionados = table.getSelectedIndices();
			var smartTable = this.getView().byId("smartTable2");
			var oParameters = {};
			var este = this;
			var sTexto;

			if (selecionados.length === 0) {
				sap.m.MessageBox.error("Nenhum item selecionado");
				return;
			}

			for (var i = 0; i < selecionados.length; i++) {
				if (oParameters.Contador !== table.getContextByIndex([selecionados[i]]).getObject().Contador) {
					oParameters = {};
					if (table.getContextByIndex([selecionados[i]]).getObject().DocTransp) {
						MessageBox.error("Contador " + table.getContextByIndex([selecionados[i]]).getObject().Contador + " já tem transporte criado");
					} else {
						oParameters.Vbeln = table.getContextByIndex([selecionados[i]]).getObject().Vbeln;
						oParameters.Posnr = table.getContextByIndex([selecionados[i]]).getObject().Posnr;
						oParameters.Banfn = table.getContextByIndex([selecionados[i]]).getObject().Banfn;
						oParameters.Bnfpo = table.getContextByIndex([selecionados[i]]).getObject().Bnfpo;
						oParameters.Ano = table.getContextByIndex([selecionados[i]]).getObject().Ano;
						oParameters.Parceiro = table.getContextByIndex([selecionados[i]]).getObject().Parceiro;
						oParameters.Contador = table.getContextByIndex([selecionados[i]]).getObject().Contador;
						// oParameters.Vkorg = table.getContextByIndex([selecionados[i]]).getObject().Vkorg;
						// oParameters.Vtweg = table.getContextByIndex([selecionados[i]]).getObject().Vtweg;
						// oParameters.Spart = table.getContextByIndex([selecionados[i]]).getObject().Spart;
						oParameters.Auart = table.getContextByIndex([selecionados[i]]).getObject().Auart;
						oParameters.Werks = table.getContextByIndex([selecionados[i]]).getObject().Werks;
						oParameters.Audat = table.getContextByIndex([selecionados[i]]).getObject().Audat;
						// oParameters.Tptrans = table.getRows()[selecionados[i]].getCells()[7].getValue();
						// oParameters.Transportadora = table.getRows()[selecionados[i]].getCells()[6].getValue();
						oParameters.Uname = sap.ushell.Container.getUser().getId();
						oParameters.Fim = 'T';

						oModel.update("/" + smartTable._getRowBinding().aKeys[selecionados[i]], oParameters, {
							success: function(oData, oResponse) {
								// var hdrMessage = oResponse.headers["sap-message"];
								// var hdrMessageObject = JSON.parse(hdrMessage);
								// sap.m.MessageBox.warning(hdrMessageObject.message);
								//oListBinding.refresh(true);
								if (!sTexto) {
									sTexto = "Transporte criado com sucesso!";
									smartTable.rebindTable("e");
									este.getView().getModel().refresh();
									MessageBox.show(sTexto);
								}
							},
							error: function(oError) {

								// este.pressDialog.open();
								if (!sTexto) {
									for (i = 0; i < JSON.parse(oError.responseText).error.innererror.errordetails.length; i++) {
										var message = "- " + JSON.parse(oError.responseText).error.innererror.errordetails[i].message + "\n";
										sTexto = sTexto + message;
									}
									sap.m.MessageBox.error(sTexto);
									//sap.m.MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
								}
								//sap.m.MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
							}
						});
					}
				}
			}

		},

		onTpVeiculo: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog8) {
				this._valueHelpDialog8 = sap.ui.xmlfragment("ZCBLE_PR_REM_SAIDA.ZCBLE_PR_REM_SAIDA.view.Veic", this);
				this.getView().addDependent(this._valueHelpDialog8);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog8.open(sInputValue);
		},

		onTrans: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog2) {
				this._valueHelpDialog2 = sap.ui.xmlfragment("ZCBLE_PR_REM_SAIDA.ZCBLE_PR_REM_SAIDA.view.Transp", this);
				this.getView().addDependent(this._valueHelpDialog2);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog2.open(sInputValue);
			this.getView().byId("idTranspo").setValue(sInputValue);
		},

		onTptrans: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog3) {
				this._valueHelpDialog3 = sap.ui.xmlfragment("ZCBLE_PR_REM_SAIDA.ZCBLE_PR_REM_SAIDA.view.Tptrans", this);
				this.getView().addDependent(this._valueHelpDialog3);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog3.open(sInputValue);
			this.getView().byId("idTptrans").setValue(sInputValue);
		},

		OnClear: function(oEvent) {
			var veiculo = this.getView().byId("IdTpVeiculo").getValue();
			var oModel2 = new sap.ui.model.json.JSONModel();

			var serviceUrl = "/sap/opu/odata/sap/ZGWCBLE_REMESSA_SAIDA_SRV/ZET_CBMM_CF_VEIC_HSet/$count?$filter=Matnr eq '" +
				veiculo + "'";

			serviceUrl = encodeURI(serviceUrl);

			oModel2.loadData(serviceUrl, null, false, "GET", false, false, null);
			var oInd = oModel2.getData();

			if (oInd < 1) {

				sap.m.MessageToast.show("Veículo inválido!");
				this.getView().byId("IdTpVeiculo").setValueState("Error");
				return;
			}

			this.getView().byId("IdTpVeiculo").setValueState("None");

			serviceUrl = "/sap/opu/odata/sap/ZGWCBLE_REMESSA_SAIDA_SRV/ZET_CBMM_CF_VEIC_HSet(Matnr='" +
				veiculo + "')";

			serviceUrl = encodeURI(serviceUrl);

			oModel2.loadData(serviceUrl, null, false, "GET", false, false, null);

			this.getView().byId("IdCapa").setValue(oModel2.oData.d.Capa);
			this.getView().byId("IdUM").setValue(oModel2.oData.d.Um);

		},

		_handleValueHelpCloseV: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			this._valueHelpDialog1 = null;
			this._valueHelpDialog4 = null;
			this._valueHelpDialog6 = null;
			this._valueHelpDialog3 = null;
			this._valueHelpDialog2 = null;
			this._valueHelpDialog8 = null;

			if (oSelectedItem) {

				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());

				this.getView().byId("IdCapa").setValue(oSelectedItem.getBindingContext().getProperty("Capa"));
				this.getView().byId("IdUM").setValue(oSelectedItem.getBindingContext().getProperty("Um"));
			}
			evt.getSource().getBinding("items").filter([]);
			this.getView().byId(this.inputId).setValueState("None");
		},

		_handleValueHelpClose: function(evt) {
			var table = this.getView().byId("table2");
			var cont = table.getSelectedIndex();

			if (cont === -1) {
				sap.m.MessageBox.error("Selecione ao menos um registro para alteração.");
				return;
			}
			var oSelectedItem = evt.getParameter("selectedItem");
			var id = evt.getSource().getProperty("title");
			this._valueHelpDialog1 = null;
			this._valueHelpDialog4 = null;
			this._valueHelpDialog6 = null;
			this._valueHelpDialog3 = null;
			this._valueHelpDialog2 = null;
			this._valueHelpDialog8 = null;

			if (oSelectedItem) {

				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
				var oModel = this.getView().getModel();
				var value = oSelectedItem.getTitle();
				var table = this.getView().byId("table2");
				var cont = table.getSelectedIndex();
				var transp = '';
				var tptransp = '';
				//oModel.setUseBatch(false);
				var index = this.getView().byId("table2").getBinding("rows").getLength();

				if (value) {
					if (table.getContextByIndex(cont).getObject().Contador) {
						if (id === "Transportadora") {
							var key = table.getContextByIndex(cont).sPath;
							var oParameters = {};

							oParameters.Transportadora = value;
							oParameters.Contador = table.getContextByIndex(cont).getObject().Contador;
							oParameters.Fim = 'Z';
							this.SetTransp(transp, value, oParameters.Contador, key);
							//oModel.update(table.getContextByIndex(i).sPath, oParameters);
						}

						if (id === "Tipo de Transporte") {
							var key = table.getContextByIndex(cont).sPath;
							var oParameters = {};
							oParameters.Tptrans = value;
							oParameters.Contador = table.getContextByIndex(cont).getObject().Contador;
							oParameters.Fim = 'Y';
							this.SetTp(transp, value, oParameters.Contador, key);
							//oModel.update(table.getContextByIndex(i).sPath, oParameters);
						}
						tptransp = '';
						transp = '';
					}
				}

				this.getView().byId("IdCapa").setValue(oSelectedItem.getBindingContext().getProperty("Capa"));
				this.getView().byId("IdUM").setValue(oSelectedItem.getBindingContext().getProperty("Um"));
			}
			evt.getSource().getBinding("items").filter([]);
			this.getView().byId(this.inputId).setValueState("None");
			//smartTable.rebindTable("e");
		},

		_handleValueHelpVeic: function(oEvent) {
			var sValue = oEvent.getParameter("value");

			if (!sValue) {
				sValue = " ";
			}

			var sFilter = sValue;
			var oFilter = oFilter = new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);

		},

		_handleValueHelpTransp: function(oEvent) {
			var sValue = oEvent.getParameter("value");

			if (!sValue) {
				sValue = " ";
			}

			var sFilter = sValue;
			var oFilter = oFilter = new sap.ui.model.Filter("Lifnr", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);

		},

		_handleValueHelpTptrans: function(oEvent) {
			var sValue = oEvent.getParameter("value");

			if (!sValue) {
				sValue = " ";
			}

			var sFilter = sValue;
			var oFilter = oFilter = new sap.ui.model.Filter("SHTYP", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);

		},

		onBeforeOpenContextMenu: function(oEvent) {
			oEvent.getParameters().listItem.setSelected(true);
		},
		_onMetadataLoaded: function() {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("WorklistView");
			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			// oViewModel.setProperty("/delay", 0);
			// // Binding the view will set it to not busy - so the view is always busy if it is not bound
			// oViewModel.setProperty("/busy", true);
			// // Restore original busy indicator delay for the detail view
			// oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		}

	});
});