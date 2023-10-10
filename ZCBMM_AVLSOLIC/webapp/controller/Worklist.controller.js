/*global location history */
sap.ui.define([
	"ZCBMM_AVLSOLIC/ZCBMM_AVLSOLIC/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"ZCBMM_AVLSOLIC/ZCBMM_AVLSOLIC/model/formatter",
	"sap/ui/model/Filter",
	'sap/m/MessageToast',
	'sap/m/Label',
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Text',
	'sap/m/TextArea',
	'sap/ui/core/mvc/Controller',
	'sap/ui/layout/HorizontalLayout',
	'sap/ui/layout/VerticalLayout',
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, History, formatter, Filter, MessageToast, Label, Button, Dialog, Text, TextArea, Controller,
	HorizontalLayout, VerticalLayout, FilterOperator) {
	"use strict";

	return BaseController.extend("ZCBMM_AVLSOLIC.ZCBMM_AVLSOLIC.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("table");

			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			// keeps the search state
			this._aTableSearchState = [];

			this.getRouter().getRoute("Back").attachPatternMatched(this._onObjectMatched, this);

			// Model used to manipulate control states
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

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oTable.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for worklist's table
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});
			// Add the worklist page to the flp routing history
			this.addHistoryEntry({
				title: this.getResourceBundle().getText("worklistViewTitle"),
				icon: "sap-icon://table-view",
				intent: "#SolicitaçãodeFrete-display"
			}, true);
		},

		_onObjectMatched: function() {
			var smartTable = this.getView().byId("smartTable");
			smartTable.rebindTable("e");
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function(oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function(oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		_AtualizaTabela: function() {
			var smartTable = this.getView().byId("smartTable");
			smartTable.rebindTable("e");
		},

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function() {
			var oViewModel = this.getModel("worklistView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		},

		onSearch: function(oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var aTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					aTableSearchState = [new Filter("Finalidade", FilterOperator.Contains, sQuery)];
				}
				this._applySearch(aTableSearchState);
			}

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function() {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject: function(oItem) {
			var IdSolicitacao = oItem.getBindingContext().getProperty("IdSolicitacao");
			var WerksO = oItem.getBindingContext().getProperty("WerksO");

			this.getRouter().navTo("object", {
				IdSolicitacao: IdSolicitacao,
				WerksO: WerksO
			});
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		_applySearch: function(aTableSearchState) {
			var oTable = this.byId("table"),
				oViewModel = this.getModel("worklistView");
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		},

		onAprove: function() {
			var oModel = this.getView().getModel();
			var oModel1 = this.getView().getModel();
			var oListBase = this.getView().byId("smartTable").getTable();
			var items = oListBase._aSelectedPaths;
			var length = items.length;
			var This = this;
			var menssagemAprov = "Deseja Aprovar as Solicitações selecionadas?";
			var Erro = 0;
			var Aprov = "CNDC";
			var oEntryPedido = {};
			var Motivo = "";
			var oModel10 = new sap.ui.model.json.JSONModel();
			var oModel11 = new sap.ui.model.json.JSONModel();

			if (length === 0) {
				sap.m.MessageBox.error("Não existem solicitações marcadas para Aprovação!");
				return;
			}

			var smartTable = this.getView().byId("smartTable");

			var dialog = "";
			dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: menssagemAprov
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {
						for (var i = 0; i < length; i++) {

							var sLinha = items[i];
							var oKey = oListBase._aSelectedPaths[i];
							var key = oKey;

							var Key2 = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV" + key;
							oModel10.loadData(Key2, null, false, "GET", false, false, null);
							if (oModel10.oData.d.Modalidade === "PEDIDO DE COMPRAS") {
								Aprov = "APRO";
								var Werkso = oModel10.oData.d.WerksO;
								var IdIdSolicitacao = oModel10.oData.d.IdSolicitacao;
								
								var sService = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_PEDIDOSet(Werkso='" + Werkso + "',IdSolicitacao=" + IdIdSolicitacao + ",NrItem='-',NrRequisicao='-')";
								oModel11.loadData(sService, null, false, "GET", false, false, null);

								if (oModel11.oData.d.Pedido === "" || oModel11.oData.d.Pedido === undefined) {
									sap.m.MessageBox.error("O pedido ainda não foi criado, a liberação não será executada.");
									dialog.close();
									return;
								}
							}

							if (oModel10.oData.d.Status !== "AVSO") {
								sap.m.MessageBox.error("O status não permite liberação.");
								dialog.close();
								return;
							}

							var oEntry = {};
							oEntry.Status = Aprov;
							oModel.update(key, oEntry, {
								error: function(oError) {
									sap.m.MessageBox.error("Erro ao chamar o serviço.");
									return;
								}
							});
							dialog.close();
						}
						//if (pedido !== "SIM"){
						sap.m.MessageBox.success("Solicitação aprovada!");
						//}
						smartTable.rebindTable("e");
					}
				}),
				endButton: new Button({
					text: "Não",
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});
			dialog.open();

		},

		OnReprov: function() {
			var oModel = this.getView().getModel();
			var oListBase = this.getView().byId("smartTable").getTable();
			var items = oListBase._aSelectedPaths;
			var length = items.length;
			var This = this;
			var menssagemReprov = "Deseja Reprovar as Solicitações selecionadas?";
			var Erro = 0;
			var Reprov = "REPR";
			var oModel10 = new sap.ui.model.json.JSONModel();

			if (length === 0) {
				sap.m.MessageBox.error("Não existem solicitações marcadas para Reprovação!");
				return;
			}

			var smartTable = this.getView().byId("smartTable");

			for (var i = 0; i < length; i++) {

				var sLinha = items[i];
				var oKey = oListBase._aSelectedPaths[i];
				var key = oKey;

				var Key2 = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV" + key;
				oModel10.loadData(Key2, null, false, "GET", false, false, null);

				if (oModel10.oData.d.Status !== "AVSO") {
					sap.m.MessageBox.error("O status não permite reprovação.");
					dialog.close();
					return;
				}
			}

			var dialog = "";
			dialog = new Dialog({
				title: "Motivo da reprovação",
				type: "Message",
				content: [
					new Label({
						text: "Descreva o motivo da reprovação:",
						labelFor: "submitDialogTextarea"
					}),
					new TextArea("submitDialogTextarea", {
						liveChange: function(oEvent) {
							var sText = oEvent.getParameter("value");
							var parent = oEvent.getSource().getParent();

							parent.getBeginButton().setEnabled(sText.length > 0);
						},
						width: "100%",
						placeholder: "Digite aqui."
					})
				],
				beginButton: new Button({
					text: 'Enviar',
					enabled: false,
					press: function() {
						var sText = sap.ui.getCore().byId('submitDialogTextarea').getValue();
						//sap.m.MessageBox.error(sText);
						for (var i = 0; i < length; i++) {

							var sLinha = items[i];
							var oKey = oListBase._aSelectedPaths[i];
							var key = oKey;
							var oEntry = {};
							oEntry.Status = Reprov;
							oModel.update(key, oEntry, {
								success: function(oData, oResponse) {
									Erro = 0;
								},
								error: function(oError) {
									Erro = 1;
								}
							});

							dialog.close();
						}

						if (Erro === 0) {
							var oModel10 = new sap.ui.model.json.JSONModel();
							var Key2 = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV" + key;
							oModel10.loadData(Key2, null, false, "GET", false, false, null);
							var idSolicitacao = oModel10.oData.d.IdSolicitacao;
							var emailsol = oModel10.oData.d.Emailsol;
							var keymail = "/ZET_CBMM_CF_EMAILSet(Titulo='A%20solicitacao%20" + idSolicitacao + "%20foi%20recusada.')";
							var oEntrymail = {};
							oEntrymail.Destinatario = emailsol;
							oEntrymail.Corpo = sText;
							oModel.update(keymail, oEntrymail, {
								success: function(oData, oResponse) {
									Erro = 0;
								},
								error: function(oError) {
									Erro = 1;
								}
							});
							if (Erro === 0) {
								sap.m.MessageBox.success("Reprovação enviada ao solicitante!");
							}
							if (Erro === 1) {
								sap.m.MessageBox.error("Erro ao chamar o serviço.");
							}
						}
						if (Erro === 1) {
							sap.m.MessageBox.error("Erro ao chamar o serviço.");
						}
						smartTable.rebindTable("e");
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
		},

		onbeforeRebindTable: function(oEvent) {
			oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
				path: "Status",
				operator: "EQ",
				value1: "AVSO"
			}));
		}

	});
});