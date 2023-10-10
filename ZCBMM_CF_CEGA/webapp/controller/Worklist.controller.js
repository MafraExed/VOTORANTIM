/*global location history */
sap.ui.define([
	"ZCBMM_CF_CEGA/ZCBMM_CF_CEGA/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ZCBMM_CF_CEGA/ZCBMM_CF_CEGA/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/MessageToast",
	"sap/m/Text"
], function(BaseController, JSONModel, formatter, Filter, FilterOperator, Dialog, Button, MessageToast, Text) {
	"use strict";

	return BaseController.extend("ZCBMM_CF_CEGA.ZCBMM_CF_CEGA.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {

			var oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				selectedTab: "1"
			});
			// this.getRouter().getRoute("worklist").attachPatternMatched(this._onObjectMatched, this);
			this.setModel(oViewModel, "WorklistView");
			
			var smartTable = this.getView().byId("ST_AceiteAreaReceb");
						smartTable.rebindTable("e");

			// this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));

			this.setModel(new JSONModel({
				modo: 0,
				param: {
					CodAviso_0: "",
					Qtd_0: "",

					Matnr_1: "",
					Qtd_1: ""
				}
			}), "impressaoModel");

			this._data = {
				Products: [

					{
						Matnr: '',
						Quantidade: ''
					}

				]
			};

			this.jModel = new sap.ui.model.json.JSONModel();
			this.jModel.setData(this._data);

		},

		onBeforeRendering: function() {
			this.byId('ins').setModel(this.jModel);
		},

		addRow: function(oArg) {
			this._data.Products.push({
				Matnr: '',
				Quantidade: ''
			});
			this.jModel.refresh(); //which will add the new record

		},

		deleteRow: function(oArg) {
			var deleteRecord = oArg.getSource().getBindingContext().getObject();
			for (var i = 0; i < this._data.Products.length; i++) {
				if (this._data.Products[i] == deleteRecord) {
					//	pop this._data.Products[i] 
					this._data.Products.splice(i, 1); //removing 1 record from i th index.
					this.jModel.refresh();
					break; //quit the loop
				}
			}
		},

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

		onPress_aceite: function(oEvent) {
			// The source is the list item that got pressed
			this._showObject3(oEvent.getSource());
		},
		handleBeforeRebindTable: function(oEvent) {
			var mBindingParams = oEvent.getParameter("bindingParams"),
				aCustomFilters = [],
				sFilterValue = 1; // it's an example, use your filter value 

			// Getting filter parameters value 
			if (sFilterValue) {
				aCustomFilters.push(new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.StartsWith, sFilterValue));
			}
		},

		onPrint: function(oEvent) {

			debugger;
			var oModel = this.getOwnerComponent().getModel();
			var oImpressaoModel = this.getView().getModel("impressaoModel");

			if (!oImpressaoModel.getProperty("/param/Name")) {
				MessageToast.show("Selecione uma impressora.");
				return;
			}

			switch (oImpressaoModel.getProperty("/modo")) {
				case 0:
					this._reimprimirRecebimento(oModel, oImpressaoModel);

					break;

				case 1:
					this._impressaoManual(oModel, oImpressaoModel);

					break;
				default:
			}

		},

		_reimprimirRecebimento: function(oModel, oImpressaoModel) {

			if (!oImpressaoModel.getProperty("/param/CodAviso")) {
				MessageToast.show("Informe o código do aviso de entrega.");
				return;
			}

			var oModel2 = new sap.ui.model.json.JSONModel();
			var aviso = oImpressaoModel.getProperty("/param/CodAviso");
			var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONF_CEGA_SRV/FornecimentoCBSet/$count?$filter=AvisoEntrega eq '" +
				aviso + "'";

			oModel2.loadData(serviceUrl, null, false, "GET", false, false, null);
			var oInd = oModel2.getData();

			if (oInd < 1) {
				sap.m.MessageToast.show("Recebimento " + aviso + " não encontrado");
				return;
			}

			this.getRouter().navTo("impressaoPorAviso", {
				CodAviso: oImpressaoModel.getProperty("/param/CodAviso"),
				Name: oImpressaoModel.getProperty("/param/Name")
			});
			/*
			oModel.callFunction("/ImprimirPorAviso", {
				method: "POST",
				urlParameters: {
					CodAviso: oImpressaoModel.getProperty("/param/CodAviso_0"),
					Quantidade: !parseFloat(oImpressaoModel.getProperty("/param/Qtd_0")) ? 0 : parseFloat(oImpressaoModel.getProperty("/param/Qtd_0"))
				},
				success: function(oData, response) {
					this._impressaoSucceded();
				},
				error: function(oError) {
					debugger;
				}
			});*/

		},
		_impressaoManual: function(oModel, oImpressaoModel) {
			var items = this.getView().byId("ins").getItems();

			// if (!oImpressaoModel.getProperty("/param/Matnr") || !oImpressaoModel.getProperty("/param/Qtd")) {
			if (items.length === 0) {
				MessageToast.show("Informe material e quantidade.");
				return;
			}

			for (var i = 0; i < items.length; i++) {
				var oModel2 = new sap.ui.model.json.JSONModel();
				var matnr = this.getView().byId("ins").getItems()[i].getCells()[1].getValue();
				var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONF_CEGA_SRV/SearchHelpMatnrSet/$count?$filter=Matnr eq '" +
					matnr + "'";

				oModel2.loadData(serviceUrl, null, false, "GET", false, false, null);
				var oInd = oModel2.getData();

				if (oInd < 1) {
					sap.m.MessageToast.show("Material " + matnr + " inválido!");
					this.getView().byId("ins").getItems()[i].setHighlight("Error");
					return;
				} else {
					this.getView().byId("ins").getItems()[i].setHighlight("None");
				}

			}

			for (i = 0; i < items.length; i++) {

				var matnr = this.getView().byId("ins").getItems()[i].getCells()[1].getValue();
				var quant = parseFloat(this.getView().byId("ins").getItems()[i].getCells()[2].getValue());

				oModel.callFunction("/ImprimirPorMaterial", {
					method: "POST",
					urlParameters: {
						// Matnr: oImpressaoModel.getProperty("/param/Matnr"),
						// Quantidade: parseFloat(oImpressaoModel.getProperty("/param/Qtd")),
						Matnr: matnr,
						Quantidade: quant,
						Name: oImpressaoModel.getProperty("/param/Name")
					},
					success: function(oData, response) {
						this._impressaoSucceded();
					}.bind(this),
					error: function(oError) {
						debugger;
					}
				});

			}

			this._data.Products.splice(0, items.length); //removing 1 record from i th index.
			this.jModel.refresh();

		},

		_impressaoSucceded: function() {
			//TODO: substituir por server message
			MessageToast.show("Etiquetas impressas com sucesso");
		},

		onImpressaoRBGChange: function(oEvent) {
			console.log(oEvent.getParameter("selectedIndex"));
			var oImpressaoModel = this.getView().getModel("impressaoModel");

			oImpressaoModel.setProperty("/modo", oEvent.getParameter("selectedIndex"));

		},

		/*onPrint: function(oEvent) {


			debugger;
			var oModel = this.getView().getModel();
			var mat = this.getView().byId("idMatnr").getValue();
			var qtd = this.getView().byId("idLfimg").getValue();

			var dialog = new Dialog({
				title: "Impressão de Etiquetas",
				type: "Message",
				state: sap.ui.core.ValueState.Success,
				content: new Text({
					text: "Deseja realizar a impressão da etiqueta?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {
						var oEntry = {};
						oEntry.Matnr = mat;
						oEntry.Lfimg = qtd;
						// oEntry.Lfimg = parseInt(qtd);
						var Key = "/ZET_CBMM_CF_CEGA_ETIQUETASet(Matnr='" + oEntry.Matnr +
							"',Lfimg='" + oEntry.Lfimg +
							"')";
						// "',AvisoEntrega='" + oEntry.AvisoEntrega +
						oModel.update(Key, oEntry, {
							success: function() {
								sap.m.MessageBox.success("Impressão realizada com sucesso!");
							},
							error: function() {
								sap.m.MessageBox.error("Impressão não efetuada");
							}
						});
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
		},*/

		onContCegPress: function(oEvent) {

			var oModel = this.getView().getModel();
			var oTable = this.byId("ST_ConferenciaCega").getTable();

			var aSelectedContextPaths = oTable.getSelectedContextPaths();

			if (aSelectedContextPaths.length <= 0) {
				MessageToast.show("Selecione ao menos um registro");
				return;
				
			}

			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("ZCBMM_CF_CEGA.ZCBMM_CF_CEGA.fragment.NovosValoresContagemCega", this);
				this.getView().addDependent(this._oDialog);
			}
			// this._oDialog.bindElement(aSelectedContextPaths[0]);//single select
			this._oDialog.setBindingContext(oModel.getContext(aSelectedContextPaths[0]));
			this._oDialog.open();
		},

		onDialogBeforeOpen: function(oEvent) {},
		onDialogAfterClose: function(oEvent) {
			this._oDialog.setBindingContext("");
		},
		onDialogSavePress: function(oEvent) {
			debugger;

			var that = this;

			var oModel = this.getView().getModel();
			var oItemData = this._oDialog.getBindingContext().getObject();
			var oInputQtd = sap.ui.getCore().byId("inputQtd");
			var oInputVol = sap.ui.getCore().byId("inputVol");

			oModel.callFunction("/ContagemCega", {
				method: 'POST',
				urlParameters: {
					Fornecedor: oItemData.Fornecedor,
					Matnr: oItemData.Matnr,
					Nfe: oItemData.Nfe,
					Serie: oItemData.Serie,
					Quantidade: oInputQtd.getValue(),
					Volume: oInputVol.getValue()
				},
				success: function(oData, response) {
					MessageToast.show("Contagem realizada com sucesso.");
					that._oDialog.close();
				},
				error: function(oError) {
					debugger;
				}
			});

		},
		onDialogClosePress: function(oEvent) {
			debugger;
			this._oDialog.close();
		},

		onReg: function() { //Substituido por evento onContCegPress
			var self = this;
			var chk = 'x';
			var dialog = new sap.m.Dialog({
				title: "Registrar EM",
				type: 'Message',
				content: new sap.ui.layout.VerticalLayout({
					width: "100%",
					content: [
						new sap.m.Text({
							text: 'Selecione a opção desejada'
						}).addStyleClass("sapUiSmallMargin"),
						new sap.m.Bar({
							design: "Footer",
							contentLeft: new sap.m.Button({
								text: "Ajustar Conf. Cega",
								press: function(oItem, chk) {
									self.onSelectionChange(oItem);
									dialog.close();
								}
							}),
							contentMiddle: new sap.m.Button({
								text: "Registrar EM",
								press: function(oItem) {
									self.onGerar();
									dialog.close();
								}
							}),
							contentRight: new sap.m.Button({
								text: "Voltar",
								press: function() {
									dialog.close();
								}
							})
						})
					]
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});
			dialog.addStyleClass("sapUiNoContentPadding");

			dialog.open();
		},

		onSelectionChange: function(oItem) {
			var itemsSelected = this.getView().byId("table2").getSelectedItems();

			for (var i = 0; i < itemsSelected.length; i++) {
				var cells = itemsSelected[i].getCells();
				for (var a = 0; a < cells.length; a++) {
					if (cells[a].getId().match("qtd")) {
						cells[a].setEditable(true);
					}
					if (cells[a].getId().match("vlm")) {
						cells[a].setEditable(true);
					}
				}
			}

		},

		onGerar: function() {

			var oModel = this.getView().getModel();
			var oListBase = this.getView().byId("ST_ConferenciaCega").getTable();
			var items = oListBase._aSelectedPaths;
			var length = items.length;

			var itemsSelected = this.getView().byId("table2").getSelectedItems();

			for (var i = 0; i < itemsSelected.length; i++) {
				var cells = itemsSelected[i].getCells();
				for (var a = 0; a < cells.length; a++) {
					if (cells[a].getId().match("qtd")) {
						cells[a].setEditable(true);
						var qtd = cells[a].getValue();

					}
					if (cells[a].getId().match("vlm")) {
						cells[a].setEditable(true);
						var vlm = cells[a].getValue();
					}
				}
			}

			if (length === 0) {
				sap.m.MessageBox.error("Erro");
				return;
			}

			var dialog = new Dialog({
				title: "Gerar EM",
				type: "Message",
				state: sap.ui.core.ValueState.Success,
				content: new Text({
					text: "Gravar o Recebimento Cega, sem registrar EM?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function() {

						for (var i = 0; i < length; i++) {
							var oKey = oListBase._aSelectedPaths[i];
							var oEntry = {};
							oEntry.Quantidade = qtd;
							oEntry.Volume = vlm;
							oModel.update(oKey, oEntry, {
								success: function() {
									sap.m.MessageBox.success("Gravado com sucesso");
								},
								error: function() {
									sap.m.MessageBox.error("Há divergências entre a quantidade da NF e quantidade informada");
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
					aTableSearchState = [new Filter("Aceite", FilterOperator.Contains, sQuery)];
				}
				this._applySearch(aTableSearchState);
			}

		},
		OnChange: function() {
			var impressao = sap.ui.getCore().byId(this.createId("IdImpressao")).getSelectedButton().getText();
			// this.getView().byId("idMatnrL").setVisible(true);
			// this.getView().byId("idLfimgL").setVisible(true);
			// this.getView().byId("idAvisoEntregaL").setVisible(true);
			if (impressao === "Impressão manual") {
				this.getView().byId("idAvisoEntrega").setEditable(true);
				this.getView().byId("idLfimg").setEditable(false);
				this.getView().byId("idMatnr").setEditable(false);
			}
			if (impressao === "Reimprimir recebimento") {

				this.getView().byId("idAvisoEntrega").setEditable(false);
				this.getView().byId("idLfimg").setEditable(true);
				this.getView().byId("idMatnr").setEditable(true);
				// this.getView().byId("idAvisoEntregaL").setEditable(false);
				// this.getView().byId("idLfimg").setVisible(true);
				// this.getView().byId("idMatnr").setVisible(true);
			}

		},

		onRefresh: function() {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();

			var oTable2 = this.byId("smartTable");
			oTable2.getBinding("items").refresh();
		},

		_showObject: function(oItem) {
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("Matnr")
			});
		},

		_showObject2: function(oItem) {
			this.getRouter().navTo("Recebimento", {
				objectId: oItem.getBindingContext().getProperty("AvisoEntrega")

			});
		},
		_showObject3: function(oItem) {
			// var Bukrs = this.getView().byId("IdBBukrs").getValue();
			//oItem.getBindingContext().getProperty("Bukrs");
			var item = this.getView().byId("table3").getSelectedItems();
			if (item.length < 1) {
				sap.m.MessageToast.show("Selecione ao menos 1 item");
				return;
			}

			//this.getRouter().navTo("Aceite");

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
		onaju: function() {

			var oModel = this.getView().getModel();
			var oListBase = this.getView().byId("ST_ConferenciaCega").getTable();
			var items = oListBase._aSelectedPaths;
			var length = items.length;
			if (length === 0) {
				sap.m.MessageBox.error("Erro");
				return;
			}

		},

		onBtnAceitePress: function() {

			var item = this.getView().byId("table3").getSelectedItems();
			if (item.length < 1) {
				sap.m.MessageToast.show("Selecione ao menos 1 item");
				return;
			}

			var oTable = this.byId("ST_AceiteAreaReceb").getTable();

			var aSelectedItems = oTable.getSelectedItems();

			this.getOwnerComponent().getModel("aceiteModel").setData({
				items: aSelectedItems
			});

			this.getRouter().navTo("Teste");
		},

		onConferenciaCegaBeforeRebindTable: function(oEvent) {

		},

		onSelectedTabChange: function(oEvent) {

			this.getView().getModel("WorklistView").setProperty("/selectedTab", oEvent.getParameter("key"));
		},
		onFornecimentoListItemPress: function(oEvent) {

			var oPath = oEvent.getSource().getBindingContextPath();
			var oContext = this.getView().getModel().getContext(oPath);
			if ((oContext.getProperty("ErroContagem") && oContext.getProperty("ContagemRealizada")) ||
				(!oContext.getProperty("ErroContagem") && !oContext.getProperty("ContagemRealizada"))) {
				this.getRouter().navTo("fornecimento", {
					lifnr: oContext.getProperty("Lifnr"),
					nfnum: oContext.getProperty("Nfnum"),
					series: oContext.getProperty("Series")
				});
			} else {
				sap.m.MessageToast.show("Já foi fetia a contagem para o item selecionado");
				return;
			}
		},
		onHistoricoListItemPress: function(oEvent) {

			var oPath = oEvent.getSource().getBindingContextPath();
			var oContext = this.getView().getModel().getContext(oPath);

			this.getRouter().navTo("entradaHistorico", {
				CodAviso: oContext.getProperty("CodAviso"),
				Fornecedor: oContext.getProperty("Fornecedor"),
				Nfe: oContext.getProperty("Nfe"),
				Serie: oContext.getProperty("Serie"),
				Ebeln: oContext.getProperty("Ebeln")
			});
		}

	});
});