sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/m/Button',
	'sap/m/Text',
	'sap/ui/model/Sorter',
	'sap/m/MessageBox',
	'sap/m/Dialog',
	"../model/formatter"
], function (Controller, JSONModel, Button, Text, Sorter, MessageBox, Dialog, formatter) {
	"use strict";
	var belnr;
	var bukrs;
	var buzei;
	var fikrs;
	var gjahr;
	var knkli;
	return Controller.extend("Y5VC_PAINEL_NE2.Y5VC_PAINEL_NE2.controller.Notas", {

		formatter: formatter,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Y5VC_PAINEL_NE2.Y5VC_PAINEL_NE2.view.Items
		 */
		onInit: function () {

			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});

			this.getRouter().getRoute("Notas").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "NotasView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

		},

		_onObjectMatched: function (oEvent) {
			
			

			belnr = oEvent.getParameter("arguments").Belnr;
			bukrs = oEvent.getParameter("arguments").Bukrs;
			buzei = oEvent.getParameter("arguments").Buzei;
			fikrs = oEvent.getParameter("arguments").Fikrs;
			gjahr = oEvent.getParameter("arguments").Gjahr;
			knkli = oEvent.getParameter("arguments").Knkli;

			var table = this.getView().byId("ItNotas");
			table.rebindTable("e");
		},
		
		NotasBeforeRebindTable: function (oEvent) {

			if (belnr !== "") {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Belnr",
					operator: "EQ",
					value1: belnr
				}));

			}
			if (bukrs !== "") {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Bukrs",
					operator: "EQ",
					value1: bukrs
				}));
			}

			if (buzei !== "") {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Buzei",
					operator: "EQ",
					value1: buzei
				}));
			}

			if (fikrs !== "") {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Fikrs",
					operator: "EQ",
					value1: fikrs
				}));
			}

			if (gjahr !== "") {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Gjahr",
					operator: "EQ",
					value1: gjahr
				}));
			}

			if (knkli !== "") {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Knkli",
					operator: "EQ",
					value1: knkli
				}));
			}
		},
		
		AnexosVisu: function (oEvent) {
			var anexos = oEvent.getSource().getText();

			if (anexos === "00000") {
				sap.m.MessageBox.error("Não existe anexo para essa nota!");
				return;
			}

			var NotaId = oEvent.getSource().getBindingContext().getObject().NotaId;
			var GjahrNota = oEvent.getSource().getBindingContext().getObject().GjahrNota;
			var fikrs2 = oEvent.getSource().getBindingContext().getObject().Fikrs;

			this.getRouter().navTo("Anexos", {
				Fikrs: fikrs2,
				NotaId: NotaId,
				GjahrNota: GjahrNota

			});
		},
		
		VisualizarNotas: function (oEvent) {

			var selecionados = this.getView().byId("table4").getSelectedIndices();
			var table = this.getView().byId("table4");

			if (selecionados.length < 1) {
				sap.m.MessageBox.error("Nenhum item selecionado");
				return;
			}
			var FilterFikrs;
			var FilterNotaId;
			var FilterGjahrNota;
			for (var i = 0; i < selecionados.length; i++) {
				if (i === 0) {
					FilterFikrs = table.getContextByIndex([selecionados[i]]).getObject().Fikrs;
					FilterNotaId = table.getContextByIndex([selecionados[i]]).getObject().NotaId;
					FilterGjahrNota = table.getContextByIndex([selecionados[i]]).getObject().GjahrNota;
				} else {
					FilterFikrs = FilterFikrs + ";" + table.getContextByIndex([selecionados[i]]).getObject().Fikrs;
					FilterNotaId = FilterNotaId + ";" + table.getContextByIndex([selecionados[i]]).getObject().NotaId;
					FilterGjahrNota = FilterGjahrNota + ";" + table.getContextByIndex([selecionados[i]]).getObject().GjahrNota;
				}
			}

			var oModel2 = new sap.ui.model.json.JSONModel();
			var serviceUrl = "/sap/opu/odata/sap/ZGWVCFI_PAINEL_NEGOCIACAO_SRV/ZET_VCFI_BUSCA_NOTASet(Fikrs='" +
				FilterFikrs + "',NotaId='" + FilterNotaId + "',GjahrNota='" + FilterGjahrNota + "')";

			oModel2.loadData(serviceUrl, null, false, "GET", false, false, null);
			var oInd = oModel2.getData();

			var that = this;
			var oModel = this.getView().getModel();
			var stexto = oModel2.oData.d.Texto;

			//	var test = "\n" + stexto + "\n ricardo \n alcantara \n";

			var est = stexto.replace(/&&/g, "\n");

			var dialog = "";
			dialog = new Dialog({
				title: "",
				type: "Message",
				content: [
					new sap.m.Label({
						text: "Notas",
						labelFor: "submitDialogTextarea"
					}),
					new sap.m.TextArea("submitDialogTextarea", {
						id: "IdTextArea",
						value: est,
						//value: "\n TESTE TABELAS REGISTRO CONTATO CLIENTES. \n TESTE DE QUEBRA DE LINHA 01. \n  \n TALEXANDRETA--21/07/2020------ \n",
						//width: "150%",
						editable: true,
						growing: true
						//rows: 30,
						//cols: 140,
						//liveChange: getText()
						//placeholder: "Digite aqui."
					})
				],
				beginButton: new Button({
					type: sap.m.ButtonType.Emphasized,
					text: "Ok",
					press: function () {

						dialog.close();

					}.bind(this)
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


		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function (sObjectPath) {
			var oViewModel = this.getModel("NotasView"),
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
				oViewModel = this.getModel("NotasView"),
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
				intent: "#Y5VC_PAINEL_NE2-display&/ZET_VCFI_NOTASSet/" + sObjectId
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