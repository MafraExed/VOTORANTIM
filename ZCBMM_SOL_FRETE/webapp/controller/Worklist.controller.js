/*global location history */
sap.ui.define([
	"ZCBMM_SOLICITACAO_FRETE/ZCBMM_SOLICITACAO_FRETE/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"ZCBMM_SOLICITACAO_FRETE/ZCBMM_SOLICITACAO_FRETE/model/formatter",
	"sap/ui/model/Filter",
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Text',
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, History, formatter, Filter, Button, Dialog, Text, FilterOperator) {
	"use strict";

	return BaseController.extend("ZCBMM_SOLICITACAO_FRETE.ZCBMM_SOLICITACAO_FRETE.controller.Worklist", {

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
				oTable = this.byId("smartTable");

			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			// keeps the search state
			this._aTableSearchState = [];

			this.onAdd();

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

		onAssignedFiltersChanged: function(oEvent) {
			var oStatusText = sap.ui.getCore().byId(this.getView().getId() + "--statusText");
			var oFilterBar = sap.ui.getCore().byId(this.getView().getId() + "--smartFilterBar");
			if (oStatusText && oFilterBar) {
				var sText = oFilterBar.retrieveFiltersWithValuesAsText();

				oStatusText.setText(sText);
			}
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

		onAdd: function() {
			this.getRouter().navTo("Add_Solicitacao");
		},

		OnDelete: function() {
			var oModel = this.getView().getModel();
			var oListBase = this.getView().byId("smartTable").getTable();
			var items = oListBase._aSelectedPaths;
			var length = items.length;
			var This = this;
			var menssagem = "";
			var Erro = 0;
			var conta = 0;
			var statusNinic = 0;

			if (length === 0) {
				sap.m.MessageBox.error("Não existem solicitações marcadas para exclusão!");
				return;
			}

			for (var i = 0; i < length; i++) {

				var sLinha = items[i];
				var oEntry = oListBase._aSelectedPaths[i];

				var busca = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/" + oEntry + "";
				var oModelVer = new sap.ui.model.json.JSONModel();
				var oModelVer10 = new sap.ui.model.json.JSONModel();

				oModelVer.loadData(busca, null, false, "GET", false, false, null);
				var Bukrs = oModelVer.oData.d.Bukrs;
				var WerksO = oModelVer.oData.d.WerksO;
				var IdSolicitacao = oModelVer.oData.d.IdSolicitacao;
				var Status = oModelVer.oData.d.Status;

				if (Status !== "INIC") {
					sap.m.MessageBox.error("So será permitida exclusão de solicitação com status inicial!");
					return;
				}

				var Carrega = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_ROTASet(Bukrs='" + Bukrs + "',WerksO='" +
					WerksO + "',IdSolicitacao=" + IdSolicitacao + ",IdRota=1)";

				oModelVer10.loadData(Carrega, null, false, "GET", false, false, null);
				var oInd = oModelVer10.oData.d.WerksoDescr;

				if (oInd !== "") {
					conta = conta + 1;
				} else {
					conta = conta;
				}
			}

			if (conta === 0) {
				menssagem = "Confirma a exclusão da solicitação?";
			} else {
				menssagem = "Rotas existentes para a solicitação, deseja excluir completamente a solicitação?";
			}

			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: menssagem
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {

						for (var i = 0; i < length; i++) {

							var oEntry = oListBase._aSelectedPaths[i];

							oModel.remove(oEntry, {
								method: "DELETE",
								success: function(data) {
									Erro = 0;
								},
								error: function(e) {
									Erro = 1;
								}
							});
						}
						if (Erro === 0) {
							sap.m.MessageBox.success("Registros Excluidos Corretamente!", {
								actions: ["OK", sap.m.MessageBox.Action.CLOSE],
								onClose: function(sAction) {
									var smartTable = This.getView().byId("smartTable");
									smartTable.rebindTable("e");
								}
							});

						}
						if (Erro === 1) {
							sap.m.MessageBox.error("Registros não foram excluidos - Erro ao chamar o serviço!");
						}
						dialog.close();
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

		onLibera: function() {
			var oModel = this.getView().getModel();
			var oListBase = this.getView().byId("smartTable").getTable();
			var items = oListBase._aSelectedPaths;
			var length = items.length;
			var eStatus = 0;
			var sucesso = 0;
			var erro = 0;

			if (length === 0) {
				sap.m.MessageBox.error("Marque uma solicitção para enviar para aprovação.");
				return;
			}

			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: "Confirma o envio para aprovação?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {

						for (var i = 0; i < length; i++) {

							var sLinha = items[i];
							var Key = oListBase._aSelectedPaths[i];
							var busca = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/" + Key + "";
							var oModelVer = new sap.ui.model.json.JSONModel();
							var oEntry = {};

							oModelVer.loadData(busca, null, false, "GET", false, false, null);

							var status = oModelVer.oData.d.Status;
							var Prioridade = oModelVer.oData.d.Prioridade;

							if (status !== "INIC") {
								eStatus = 1;
							}

							if (Prioridade === "EMERGENCIAL") {
								oEntry.Status = "APEM";
							} else {
								oEntry.Status = "AVSO";
							}

							oModel.update(Key, oEntry, {
								success: function(oData, oResponse) {
									sucesso = sucesso + 1;
								},
								error: function(oError) {
									erro = erro + 1;
								}
							});
						}
						dialog.close();
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

			if (eStatus === 1) {
				sap.m.MessageBox.error("Uma ou mais solicitações em processamento.");
			}

			if (sucesso > 0) {
				sap.m.MessageBox.success(sucesso + "Solicitações enviadas para aprovação com sucesso.");
			}

			if (erro > 0) {
				sap.m.MessageBox.error("Foram encontrados erros em" + erro + "Solicitações");
			}

		},

		onbeforeRebindTable: function(oEvent) {

			var sName = sap.ushell.Container.getUser().getId();

			if (sName === "DEFAULT_USER") {

			} else {

				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Usuario",
					operator: "EQ",
					value1: sName
				}));
			}
		}
	});
});