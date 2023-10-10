/*global location history */
sap.ui.define([
	"CADASTROAPROVADORES/CADASTROAPROVADOR/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"CADASTROAPROVADORES/CADASTROAPROVADOR/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/m/Button',
	'sap/m/List',
	'sap/m/StandardListItem',
	'sap/ui/model/Sorter',
	'sap/m/VBox',
	'sap/m/Dialog',
	'sap/m/Text',
	'sap/m/TextArea'
], function(BaseController, JSONModel, History, formatter, Filter, FilterOperator, Button, List, StandardListItem, Sorter, VBox, Dialog,
	Text, TextArea) {
	"use strict";

	return BaseController.extend("CADASTROAPROVADORES.CADASTROAPROVADOR.controller.Worklist", {

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
				oTable = this.byId("table1");
				
			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			// keeps the search state
			this._aTableSearchState = [];

			this.getRouter().getRoute("Back").attachPatternMatched(this.atualizaSmartTable, this);

			
			
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
				intent: "#CadastrodeGrupodeAprovadores-display"
			}, true);
		},

		atualizaSmartTable: function() {
			var smartTable = this.getView().byId("smartTable1");
			smartTable.rebindTable("e");
			
			var smartTable2 = this.getView().byId("smartTable2");
			smartTable2.rebindTable("e");
			
			var smartTable3 = this.getView().byId("smartTable3");
			smartTable3.rebindTable("e");
			
			
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

		onSelectFilter: function(oControlEvent) {
			// habilitar botoes salvar e cancelar e desavilitar o restante
			this.getView().byId("BtnExclu").setProperty("visible", true);
			this.getView().byId("BtnInclu").setProperty("visible", true);
			//this.getView().byId("BtnEdit").setProperty("visible", false);
			this.getView().byId("BtnSave").setProperty("visible", false);
			this.getView().byId("BtnCanc").setProperty("visible", false);

			this.getView().byId("form1").setProperty("visible", true);
			this.getView().byId("form2").setProperty("visible", true);

		},

		// OnSave: function() {

		// 	if (this.getView().byId("iconTabBar").getProperty("selectedKey") === "2") {
		// 		var oModel = this.getView().getModel();
		// 		var key = "";
		// 		var oParameters = {};
		// 		var oTable = this.getView().byId("smartTable22").getTable();
		// 		var items = oTable.getItems();

		// 		for (var i = 0; i < items.length; i++) {
		// 			var oRow = items[i];

		// 			oParameters.Parametro = oRow.getCells()[0].getValue();
		// 			oParameters.Valor = oRow.getCells()[1].getValue();

		// 			oParameters.Valor = oParameters.Valor.replace(/ /g, "%20");
		// 			oParameters.Parametro = oParameters.Parametro.replace(/ /g, "%20");

		// 			key = "/ZET_CBMM_CF_PARAMETSet(Parametro='" + oParameters.Parametro + "',Valor='" + oParameters.Valor + "')";

		// 			oModel.update(key, oParameters, {
		// 				success: function(data) {
		// 					sap.m.MessageBox.success("Registros Atualizados com sucesso");
		// 				},

		// 				error: function(e) {
		// 					sap.m.MessageBox.error("Não foi possível atualizar o parâmetro'" + oParameters.Zparam + "'");
		// 				}
		// 			});
		// 		}

		// 		this.getView().byId("form4").setProperty("visible", false);
		// 		this.getView().byId("smartTable22").rebindTable("e");

		// 		this.getView().byId("form3").setProperty("visible", true);
		// 		this.getView().byId("smartTable2").rebindTable("e");

		// 	}

		// 	this.getView().byId("BtnSave").setProperty("visible", false);
		// 	this.getView().byId("BtnCanc").setProperty("visible", false);
		// 	this.getView().byId("BtnExclu").setProperty("visible", true);
		// 	this.getView().byId("BtnInclu").setProperty("visible", true);
		// 	//this.getView().byId("BtnEdit").setProperty("visible", false);

		// 	if (this.getView().byId("iconTabBar").getProperty("selectedKey") === "2") {
		// 		//this.getView().byId("BtnEdit").setProperty("visible", true);
		// 	}
		// },

		onAdd: function() {
			
			if (this.getView().byId("iconTabBar").getProperty("selectedKey") === "1" ||
				!this.getView().byId("iconTabBar").getProperty("selectedKey")) {
				this.getRouter().navTo("add");
			} else if (this.getView().byId("iconTabBar").getProperty("selectedKey") === "2") {
				this.getRouter().navTo("addParam");
			}
			else if (this.getView().byId("iconTabBar").getProperty("selectedKey") === "3") {
				this.getRouter().navTo("AddEkgrp");
			}

		},

		OnDelete: function() {
			var oModel = this.getView().getModel();

			if (this.getView().byId("iconTabBar").getProperty("selectedKey") === "1" ||
				!this.getView().byId("iconTabBar").getProperty("selectedKey")) {
				var oListBase = this.getView().byId("smartTable1").getTable();
			} else if (this.getView().byId("iconTabBar").getProperty("selectedKey") === "2") {
				oListBase = this.getView().byId("smartTable2").getTable();
			} else if (this.getView().byId("iconTabBar").getProperty("selectedKey") === "3") {
				oListBase = this.getView().byId("smartTable3").getTable();
			}
			
			
			var items = oListBase._aSelectedPaths;
			var length = items.length;
			var este = this;
			var texto = " ";

			if (length === 0) {
				texto = "Nenhuma linha selecionada";
				sap.m.MessageBox.error(texto);
				return;
			} else {
				texto = "Confirma exclusão dos registros selecionados?";
			}
			var dialog = new Dialog({
				title: "Confirmação",
				type: "Message",
				content: new Text({
					text: texto
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {
						for (var i = 0; i < length; i++) {
							var oEntry = oListBase._aSelectedPaths[i];

							oModel.remove(oEntry, {
								method: "DELETE",
								success: function(data) {
									sap.m.MessageBox.success("Registros Excluidos Corretamente!");
								},
								error: function(e) {
									sap.m.MessageBox.error("Registros não foram excluidos - Erro ao chamar o serviço!");
								}
							});
						}
						dialog.close();
						var oTable = este.byId("smartTable1");
						oTable.getBinding("items").refresh();

						var oTable2 = este.byId("smartTable2");
						oTable2.getBinding("items").refresh();
						
						var oTable3 = este.byId("smartTable3");
						oTable3.getBinding("items").refresh();
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
					aTableSearchState = [new Filter("Carteira", FilterOperator.Contains, sQuery)];
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
			var oTable = this.byId("table1");
			oTable.getBinding("items").refresh();

			var oTable2 = this.byId("table2");
			oTable2.getBinding("items").refresh();
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
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("Area")
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
		}

	});

});