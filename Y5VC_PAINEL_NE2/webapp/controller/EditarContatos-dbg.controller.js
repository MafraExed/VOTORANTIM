sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/m/Button',
	'sap/m/Text',
	'sap/m/MessageBox',
	'sap/m/Dialog',
	"../model/formatter"
], function (Controller, JSONModel, Filter, FilterOperator, Button, Text, MessageBox, Dialog, formatter) {
	"use strict";
	var kunnr, stcd1, stcd2, kkber, Fikrs, NivelDet;
	return Controller.extend("Y5VC_PAINEL_NE2.Y5VC_PAINEL_NE2.controller.EditarContatos", {
		formatter: formatter,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Y5VC_PAINEL_NE2.Y5VC_PAINEL_NE2.view.Items
		 */
		onInit: function () {

			// var iOriginalBusyDelay,
			// 	oViewModel = new JSONModel({
			// 		busy: true,
			// 		delay: 0
			// 	});

			this.getRouter().getRoute("EditarContatos").attachPatternMatched(this._onObjectMatched, this);

			// // Store original busy indicator delay, so it can be restored later on
			// iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			// this.setModel(oViewModel, "EditarContatosView");
			// this.getOwnerComponent().getModel().metadataLoaded().then(function () {
			// 	// Restore original busy indicator delay for the object view
			// 	oViewModel.setProperty("/delay", iOriginalBusyDelay);
			// });

		},

		_onObjectMatched: function (oEvent) {
			kunnr = oEvent.getParameter("arguments").Kunnr;

			//	this.getView().byId("IdKunnr2").setText(kunnr);

			stcd1 = oEvent.getParameter("arguments").stcd1;
			stcd2 = oEvent.getParameter("arguments").stcd2;
			kkber = oEvent.getParameter("arguments").Kkber;
			Fikrs = oEvent.getParameter("arguments").Fikrs;
			NivelDet = oEvent.getParameter("arguments").NivelDet;

			//	var table = this.getView().byId("smartTableCont");
			var table = this.getView().byId("tableCont");

			table.bindAggregation("rows", {
				path: '/ZET_VCFI_CONTATO_CLISet',
				filters: [ new Filter("Kunnr", FilterOperator.EQ, kunnr),
				new Filter("Kkber", FilterOperator.EQ, kkber),
				//new Filter("Fikrs", FilterOperator.EQ, Fikrs),
				new Filter("NivelDet", FilterOperator.EQ, NivelDet)]
				// template: new sap.ui.table.Row({
				// 	label: "{ContTyp}",
				// 	value: "{Contat}",
				// 	type: "{ContTyp}"
				// })

			});

			//table.rebindTable("e");
		},

		Inserir: function (oEvent) {
			//var table = this.getView().byId("tableCont");
			var este = this;
			var oModel = this.getView().getModel();
			oModel.setUseBatch(true);
			var oParameters = {};
			var sTexto;

			var smartTable = this.getView().byId("smartTableCont");

			if (!este.getView().byId("idSel2").getSelectedKey()) {
				MessageBox.show("Selecione o tipo de contato");
			}

			if (!este.getView().byId("idContat2").getValue()) {
				MessageBox.show("Informe o dado de contato");
			}

			if (!este.getView().byId("idPrior2").getValue()) {
				MessageBox.show("Informe a prioridade do contato");
			}

			var texto = "Inserir registro?";
			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: texto
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {

						oParameters = {};
						oParameters.Kunnr = kunnr;
						oParameters.ContTyp = este.getView().byId("idSel2").getSelectedKey();
						oParameters.Contat = este.getView().byId("idContat2").getValue();
						oParameters.Prior = este.getView().byId("idPrior2").getValue();
						oParameters.Tag = este.getView().byId("IdTag2").getValue();
						oParameters.Kkber = kkber;
						oParameters.Fikrs = Fikrs;
						oParameters.NivelDet = NivelDet;
						// oParameters.Contador = table.getContextByIndex([selecionados[i]]).getObject().Contador;
						// oParameters.Parceiro = table.getContextByIndex([selecionados[i]]).getObject().Parceiro;
						// oParameters.Ano = table.getContextByIndex([selecionados[i]]).getObject().Ano;
						// oParameters.VbelnR = table.getContextByIndex([selecionados[i]]).getObject().VbelnR;
						// oParameters.Fim = 'W';
						oModel.update("/" + "ZET_VCFI_CONTATO_CLISet(Kunnr='"+kunnr+"',PosnrCt='999')", oParameters, {
							success: function (oData, oResponse) {
								// var hdrMessage = oResponse.headers["sap-message"];
								// var hdrMessageObject = JSON.parse(hdrMessage);
								// sap.m.MessageBox.warning(hdrMessageObject.message);
								//oListBinding.refresh(true);
								if (!sTexto) {
									sTexto = "Regitro inserido com sucesso";
									//smartTable.rebindTable("e");
									//este.getView().getModel().refresh();

									MessageBox.show(sTexto);
									smartTable.rebindTable("e");
									//	este.getView().getModel().refresh();

									//este.getView().byId("idSel2").setSelectKey("");
									este.getView().byId("idContat2").setValue("");
									este.getView().byId("idPrior2").setValue("");
									este.getView().byId("IdTag2").setValue("");
								}
							},
							error: function (oError) {
								if (!sTexto) {
									for (var i = 0; i < JSON.parse(oError.responseText).error.innererror.errordetails.length; i++) {
										var message = "- " + JSON.parse(oError.responseText).error.innererror.errordetails[i].message + "\n";
										sTexto = sTexto + message;
									}
									sap.m.MessageBox.error(sTexto);
								}
								//sap.m.MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
							}
						});

						dialog.close();

					}
				}),
				endButton: new Button({
					text: "Cancelar",
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();

		},

		Remover: function (oEvent) {
			var oModel = this.getView().getModel();
			oModel.setUseBatch(true);
			var table = this.getView().byId("tableCont");
			var selecionados = table.getSelectedIndices();
			var smartTable = this.getView().byId("smartTableCont");
			var este = this;

			if (selecionados.length === 0) {
				sap.m.MessageBox.error("Nenhum registro selecionado.");
				return;
			} else {

				var texto = "Deseja deletar o item selecionado?";
				var dialog = new Dialog({
					title: "Confirmação",
					type: "Message",
					content: new Text({
						text: texto
					}),
					beginButton: new Button({
						text: "Sim",
						press: function () {
							for (var i = 0; i < selecionados.length; i++) {
								var oEntry = "/" + smartTable._getRowBinding().aKeys[selecionados[i]];

								oModel.remove(oEntry, {
									method: "DELETE",
									success: function (data) {

										smartTable.rebindTable("e");
									//	este.getView().getModel().refresh();
										sap.m.MessageBox.success("Item deletado com sucesso!");
									
									},
									error: function (e) {
										sap.m.MessageBox.error("Não foi possível deletar o item");
										
									}
								});
							}

							dialog.close();

						}
					}),
					endButton: new Button({
						text: "Cancelar",
						press: function () {
							dialog.close();
						}
					}),
					afterClose: function () {
						dialog.destroy();
					}
				});
				dialog.open();

			}

		},

		OnSave: function (oEvent) {
			var table = this.getView().byId("tableCont");
			var items = this.getView().byId("tableCont").getBinding("rows").getLength();
			var oModel = this.getView().getModel();
			oModel.setUseBatch(true);
			var oParameters = {};
			var sTexto;
			var smartTable = this.getView().byId("smartTableCont");

			var texto = "Os dados de contatos serão atualizados, deseja continuar?";
			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: texto
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {

						for (var i = 0; i < items; i++) {

							oParameters = {};
							oParameters.Kunnr = kunnr;
							oParameters.PosnrCt = table.getContextByIndex(i).getObject().PosnrCt;
							oParameters.ContTyp = table.getContextByIndex(i).getObject().ContTyp;
							oParameters.Contat = table.getContextByIndex(i).getObject().Contat;
							oParameters.Prior = table.getContextByIndex(i).getObject().Prior;
							oParameters.Tag = table.getContextByIndex(i).getObject().Tag;
							oParameters.Fikrs = table.getContextByIndex(i).getObject().Fikrs;
							oParameters.Kkber = kkber;
							oParameters.NivelDet = NivelDet;
							oModel.update("/" + smartTable._getRowBinding().aKeys[0], oParameters, {
								success: function (oData, oResponse) {
									// var hdrMessage = oResponse.headers["sap-message"];
									// var hdrMessageObject = JSON.parse(hdrMessage);
									// sap.m.MessageBox.warning(hdrMessageObject.message);
									//oListBinding.refresh(true);
									if (!sTexto) {
										sTexto = "Dados atualizados com sucesso";
										smartTable.rebindTable("e");
										//este.getView().getModel().refresh();

										MessageBox.show(sTexto);
									}
								},
								error: function (oError) {
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
						dialog.close();

					}
				}),
				endButton: new Button({
					text: "Cancelar",
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();
		},

		BeforeTable: function (oEvent) {

			if (kunnr !== "") {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Kunnr",
					operator: "EQ",
					value1: kunnr
				}));

			}
			if (NivelDet !== "") {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "NivelDet",
					operator: "EQ",
					value1: NivelDet
				}));

			}
			// if (Fikrs !== "") {
			// 	oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
			// 		path: "Fikrs",
			// 		operator: "EQ",
			// 		value1: Fikrs
			// 	}));

			// }
			if (stcd1 !== "") {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Stcd1",
					operator: "EQ",
					value1: stcd1
				}));
			}

			if (stcd2 !== "") {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Stcd2",
					operator: "EQ",
					value1: stcd2
				}));
			}
			if (kkber !== "") {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Kkber",
					operator: "EQ",
					value1: kkber
				}));
			}

		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function (sObjectPath) {
			var oViewModel = this.getModel("EditarContatosView"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oDataModel.metadataLoaded().then(function () {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function () {
			var oView = this.getView(),
				oViewModel = this.getModel("EditarContatosView"),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.Belnr,
				sObjectName = oObject.Cliente;

			oViewModel.setProperty("/busy", false);
			// Add the object page to the flp routing history
			this.addHistoryEntry({
				title: this.getResourceBundle().getText("objectTitle") + " - " + sObjectName,
				icon: "sap-icon://enter-more",
				intent: "#Y5VC_PAINEL_NE2-display&/ZET_VCFI_CONTATO_CLISet/" + sObjectId
			});

			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf Y5VC_PAINEL_NE2.Y5VC_PAINEL_NE2.view.Items
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Y5VC_PAINEL_NE2.Y5VC_PAINEL_NE2.view.Items
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Y5VC_PAINEL_NE2.Y5VC_PAINEL_NE2.view.Items
		 */
		//	onExit: function() {
		//
		//	}

	});

});