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

	return BaseController.extend("ZCBLE_PR_REM_SAIDA.ZCBLE_PR_REM_SAIDA.controller.Ucst", {

		formatter: formatter,

		onInit: function() {
			
			
			//this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
			
			this.getRouter().getRoute("Ucs").attachPatternMatched(this._onObjectMatched, this);
			
			this.addHistoryEntry({
				title: this.getResourceBundle().getText("worklistViewTitle"),
				icon: "sap-icon://table-view",
				intent: "#Processoderemessadesaída-display"
			}, true);

			var oJsonModel = new sap.ui.model.json.JSONModel();
			oJsonModel.setData({
				Messages: []
			});

		},
		
		_onObjectMatched: function(oEvent) {
		    this.getView().byId("IdContador").setValue(oEvent.getParameter("arguments").Contador);
			this.getView().byId("IdVbeln").setValue(oEvent.getParameter("arguments").Vbeln);
			this.getView().byId("IdEtenr").setValue(oEvent.getParameter("arguments").Etenr);
			this.getView().byId("IdParceiro").setValue(oEvent.getParameter("arguments").Parceiro);
			this.getView().byId("IdMatnr").setValue(oEvent.getParameter("arguments").Matnr);
			this.getView().byId("IdQtde").setValue(oEvent.getParameter("arguments").Qtde);
			
		},
		
		atualizasmart: function(oEvent) {
			var filter01 = new sap.ui.model.Filter({
				path: "Matnr",
				operator: "EQ",
				value1: this.getView().byId("IdMatnr").getValue()
			});
			
			var filter02 = new sap.ui.model.Filter({
				path: "Parceiro",
				operator: "EQ",
				value1: this.getView().byId("IdParceiro").getValue()
			});
			var filter03 = new sap.ui.model.Filter({
				path: "Etenr",
				operator: "EQ",
				value1: this.getView().byId("IdEtenr").getValue()
			});
			
			var filter04 = new sap.ui.model.Filter({
				path: "Vbeln",
				operator: "EQ",
				value1: this.getView().byId("IdVbeln").getValue()
			});
			var filter05 = new sap.ui.model.Filter({
				path: "Contador",
				operator: "EQ",
				value1: this.getView().byId("IdContador").getValue()
			});
			
	
			oEvent.getParameter("bindingParams").filters.push(filter01, filter02, filter03, filter04, filter05);

		},
		
		onBeforeRendering: function() {
			this.byId('table1').setModel(this.jModel);
		},
		onPress: function(oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},
		
		onSelectFilter: function(oControlEvent) {

			if (oControlEvent.getParameter("key") === "1") {
				var smartTable = this.getView().byId("smartTable");
				smartTable.rebindTable("e");

				this.getView().byId("Faturar").setValue("");
			} else if (oControlEvent.getParameter("key") === "2") {
				var smartTable2 = this.getView().byId("smartTable2");
				smartTable2.rebindTable("e");
			} else if (oControlEvent.getParameter("key") === "3") {
				var smartTable3 = this.getView().byId("smartTable3");
				smartTable3.rebindTable("e");
			}
		},

		_showObject: function(oItem) {
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("Vbeln")
			});
		},


		


		AnexarUCS: function() {
			var oModel = this.getView().getModel();
			oModel.setUseBatch(false);
			var table = this.getView().byId("table1");
			var selecionados = table.getSelectedIndices();
			var smartTable = this.getView().byId("smartTable");
			var oParameters = {};

			if (selecionados.length === 0) {
				sap.m.MessageBox.error("Nenhum registro selecionado.");
				return;
			} else {
				
				for (var i = 0; i < selecionados.length; i++) {

					oParameters = {};
					oParameters.Vbeln = table.getContextByIndex([selecionados[i]]).getObject().Vbeln;
					oParameters.Contador = table.getContextByIndex([selecionados[i]]).getObject().Contador;
					oParameters.Matnr = table.getContextByIndex([selecionados[i]]).getObject().Matnr;
					oParameters.Qtde = table.getContextByIndex([selecionados[i]]).getObject().Qtde;
					oParameters.Etenr = table.getContextByIndex([selecionados[i]]).getObject().Etenr;
					oParameters.Parceiro = table.getContextByIndex([selecionados[i]]).getObject().Parceiro;
					oParameters.Uc = table.getContextByIndex([selecionados[i]]).getObject().Uc;
					oParameters.QtdeUc = table.getContextByIndex([selecionados[i]]).getObject().QtdeUc;

					oModel.update("/" + smartTable._getRowBinding().aKeys[selecionados[i]], oParameters, {
						success: function(oData, oResponse) {
							// var hdrMessage = oResponse.headers["sap-message"];
							// var hdrMessageObject = JSON.parse(hdrMessage);
							// sap.m.MessageBox.warning(hdrMessageObject.message);
							//oListBinding.refresh(true);
							smartTable.rebindTable("e");
						},
						error: function(oError) {
							sap.m.MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
						}
					});
				}

			}

		},

		Desagrupar: function() {

			var oModel = this.getView().getModel();
			oModel.setUseBatch(true);
			var table = this.getView().byId("table2");
			var selecionados = table.getSelectedIndices();
			var smartTable = this.getView().byId("smartTable2");
			var erro = "";

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

										erro = 0;
									},
									error: function(e) {

										erro = 1;
									}
								});
							}

							dialog.close();

							if (erro === 0) {
								sap.m.MessageBox.success("Desagrupamento efetuado com sucesso!");
								smartTable.rebindTable("e");
							} else if (erro === 1) {
								sap.m.MessageBox.error("Não foi possível efetuar o desagrupamento");
							}
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

		onBeforeOpenContextMenu: function(oEvent) {
			oEvent.getParameters().listItem.setSelected(true);
		},
		_onMetadataLoaded: function() {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("WorklistView");
			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);
			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		}

	});
});