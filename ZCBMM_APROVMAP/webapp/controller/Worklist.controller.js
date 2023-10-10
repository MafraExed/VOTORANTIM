/*global location history */
sap.ui.define([
	"ZCBMM_APROVMAP/ZCBMM_APROVMAP/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"ZCBMM_APROVMAP/ZCBMM_APROVMAP/model/formatter",
	"sap/ui/model/Filter",
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Text',
	"sap/ui/model/FilterOperator",
	"sap/ui/model/resource/ResourceModel"
], function(BaseController, JSONModel, History, formatter, Filter, Button, Dialog, Text, FilterOperator, ResourceModel) {
	"use strict";

	return BaseController.extend("ZCBMM_APROVMAP.ZCBMM_APROVMAP.controller.Worklist", {

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

			//			this.getRouter().getRoute("Object").attachPatternMatched(this._onObjectMatched, this);

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

			this.getRouter().navTo("Worklist_Detail", {
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
			var oListBase = this.getView().byId("smartTable").getTable();
			var items = oListBase._aSelectedPaths;
			var length = items.length;
			var This = this;
			var mensagemAprov = "Deseja Aprovar as Solicitações selecionadas?";
			var Erro = 0;
			var Aprov = "AVSO";

			if (length === 0) {
				sap.m.MessageBox.error("Não existem solicitações marcadas para Aprovação!");
				return;
			}

			var dialog = "";
			dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: mensagemAprov
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {
						for (var i = 0; i < length; i++) {

							var sLinha = items[i];
							var oKey = oListBase._aSelectedPaths[i];
							var key = oKey;
							var oEntry = {};
							oEntry.Status = Aprov;
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
							sap.m.MessageBox.success("Solicitação aprovada!");
						}
						if (Erro === 1) {
							sap.m.MessageBox.error("Solicitação não aprovada!");
						}

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
					//sap.m.MessageBox.error("Erro ao chamar o serviço");

				}
			});
			dialog.open();

		},

		OnRepov: function() {
			var oModel = this.getView().getModel();
			var oListBase = this.getView().byId("smartTable").getTable();
			var items = oListBase._aSelectedPaths;
			var length = items.length;
			var This = this;
			var mensagemReprov = "Deseja Reprovar as Solicitações selecionadas?";
			var Erro = 0;
			var Reprov = "INIC";

			if (length === 0) {
				sap.m.MessageBox.error("Não existem solicitações marcadas para Reprovação!");
				return;
			}

			var dialog = "";
			dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: mensagemReprov
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {
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
							sap.m.MessageBox.success("Solicitação Reprovada!");
						}
						if (Erro === 1) {
							sap.m.MessageBox.error("Solicitação não Reprovada!");
						}

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
					//sap.m.MessageBox.error("Erro ao chamar o serviço");

				}
			});
			dialog.open();
		},
		onbeforeRebindTable: function(oEvent) {
			oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
				path: "Status",
				operator: "EQ",
				value1: "MAPA"
			}));
		},

		handleFooter: function(oEvent) {

			var that = this;
			var msg;
			var oBundle = this.getModel("i18n").getResourceBundle();

			function onUpdateSuccess(oData, response) {
				sap.m.MessageBox.success("Solicitação atualizada com sucesso"); //TODO receber msg do backend
				that.getModel().refresh();
			}

			function onUpdateError(oError) {
				sap.m.MessageBox.error(oBundle.getText("updateError"));
			}

			//Tratar Cenários de aprovação e rejeição
			/* @type sap.m.Table */
			var table = this.byId("table");

			var contexts = table.getSelectedContexts();
			var ids = [];

			for (var i = 0; i < contexts.length; i++) {
				var id = this.getModel().oData[contexts[i].getPath().substr(1)].IdSolicitacao;
				ids.push(id);
			}

			if (contexts.length == 0) {
				sap.m.MessageBox.error(oBundle.getText("updateEmpty"));
				return;
			}

			if (oEvent.getSource().getId().match("approve")) {
				msg = "updateConfirmA";
			} else {
				msg = "updateConfirmR";
			}

			sap.m.MessageBox.confirm(oBundle.getText(msg, [ids]), function(oAction) {

				if (oAction === "OK") {

					for (var i = 0; i < contexts.length; i++) {
						var path = contexts[i].getPath();
						var context = this.getModel().oData[path.substr(1)];
						if (oEvent.getSource().getId().match("approve")) {
							context.Status = 'MAIL';
						} else {
							context.Status = 'COTV';
						}
						delete context.__metadata;

						this.getModel().update(path, context, {
							success: $.proxy(onUpdateSuccess, this),
							error: $.proxy(onUpdateError, this),
						});

					}
				}
			});
		}
	});
});