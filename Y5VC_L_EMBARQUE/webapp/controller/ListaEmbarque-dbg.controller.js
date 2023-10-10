sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ndc/BarcodeScanner",
	"../util/formatter",
	"sap/m/MessageBox",
	"sap/m/Button",
	"sap/m/Text",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
    "sap/ui/model/Filter"
], function (Controller, BarcodeScanner, Formatter, MessageBox, Button, Text, MessageToast, JSONModel, Dialog, Filter) {
	"use strict";
	const cStatusInit = "''"; //Status inicial
	return Controller.extend("workspace.zleituraembarque.controller.ListaEmbarque", {
		myFormatter: Formatter,
		_onAttachRequest: function () {
			sap.ui.core.BusyIndicator.show();
		},
		_onAttachRequestCompleted: function () {
			sap.ui.core.BusyIndicator.hide();
		},
		_filtrarInicial: function () {
			var oList = this.getView().byId("list0");
			/*oList.attachEventOnce("updateStarted", this._onAttachRequest);
			oList.attachEventOnce("updateFinished", this._onAttachRequestCompleted);*/

			var oFilter = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, cStatusInit);
			var oSorter = new sap.ui.model.Sorter("Embarque", true); // sort descending
			var oTemplate = oList.getItems()[0].clone();
			oList.bindAggregation("items", {
				path: "/ZET_VCMM_EMBARQUE_HEADERSet",
				sorter: oSorter,
				filters: [oFilter],
				template: oTemplate
			});

		},
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf workspace.zleituraembarque.view.ListaEmbarque
		 */
		onInit: function () {

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("ListaEmbarque").attachMatched(this.onRouterMatched, this);

		},
		onRouterMatched: function (evt) {
			this._filtrarInicial();
			if (this.atualizarLista) {
				this.atualizarLista = false;
				var oList = this.getView().byId("list0");
				oList.getBinding("items").refresh();
			}
		},
		handleCriar: function (oEvent) {
			this.getView().setBusy(true);
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var that = this;
			var dialog = new Dialog({
				title: oBundle.getText("PopCriarTitle"),
				type: "Message",
				content: new Text({
					text: oBundle.getText("PopCriarText")
				}),
				beginButton: new Button({
					text: oBundle.getText("PopCriarBtnConfirm"),
					icon: "sap-icon://accept",
					type: "Accept",
					press: function () {
						that._handleRouteTypeValueHelp();
						// that._criarNovoEmbarque();
						dialog.close();
					}
				}),
				endButton: new Button({
					text: oBundle.getText("PopCriarBtnCancel"),
					icon: "sap-icon://decline",
					type: "Reject",
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					that.getView().setBusy(false);
					dialog.destroy();
				}
			});
			dialog.open();
		},
		_criarNovoEmbarque: function (vKey) {
			var that = this;
			var oView = this.getView();
			var oBundle = oView.getModel("i18n").getResourceBundle();

			var oModel = oView.getModel();
			oView.setBusy(true);

			var mParameters = {
				groupId: "gpIdLeituraEmbarque",
				success: (oData, oResp) => {
					if (oData) {
						if (oData.Embarque === undefined) {
							var responseText = oData.responseText;
							if (responseText !== undefined) {
								var responseParser = JSON.parse(responseText);
								MessageBox.error(responseParser.error.message.value, {
									title: oBundle.getText("Error"),
									styleClass: "sapUiSizeCompact"
								});
							}
						} else {
							var vEmbarqueOut = this.myFormatter.shiftLeadingZeros(oData.Embarque);
							MessageBox.success(oBundle.getText("RecordedData", [vEmbarqueOut]), {
								styleClass: "sapUiSizeCompact",
								onClose: function (oAction) {
									that._goToLeitura(oData.Embarque);
								}
							});

						}

					}
				},
				error: (oData, resp) => {
					var responseText = oData.responseText;
					if (responseText !== undefined) {
						var vMsgErro = "";
						try {
							var responseParser = JSON.parse(responseText);
							vMsgErro = responseParser.error.message.value;
						} catch (err) {
							vMsgErro = responseText;
						}
						MessageBox.error(vMsgErro, {
							title: oBundle.getText("Error"),
							styleClass: "sapUiSizeCompact"
						});
					} else {
						MessageBox.error(oBundle.getText("ErrorRecordedData"), {
							styleClass: "sapUiSizeCompact"
						});
					}
				}
			};

			oModel.attachRequestSent(this._onAttachRequest);
			oModel.attachRequestCompleted(this._onAttachRequestCompleted);

			oModel.setDeferredGroups(["gpIdLeituraEmbarque"]);
			let oListaEmbarque = {};
			oListaEmbarque.Embarque = "0"; //Temp
			oListaEmbarque.Rota = vKey;
			oModel.create("/ZET_VCMM_EMBARQUE_HEADERSet", oListaEmbarque, mParameters);
			oModel.submitChanges(mParameters);
			oView.setBusy(false);
		},
		handleSearch: function (oEvent) {
			var oList = this.getView().byId("list0");
			var vQuery = oEvent.getSource().getValue();
			var oFilter = null;
			//vQuery = "'" + vQuery + "'";
			if (vQuery && vQuery.length > 0) {
				oFilter = new sap.ui.model.Filter("Embarque", sap.ui.model.FilterOperator.EQ, vQuery);
			}
			var oBinding = oList.getBinding("items");
			oBinding.filter(oFilter);
		},
		_goToLeitura: function (vEmbarque) {
			this.atualizarLista = true;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Leitura", { // nome do Router
				embarque: vEmbarque // Parametro do routing
			});
		},
		_onListItemPress: function (vEmbarque) {
			var vEmbarqueOut = this.myFormatter.shiftLeadingZeros(vEmbarque);
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var that = this;
			var dialog = new Dialog({
				title: oBundle.getText("PopEditarTitle", [vEmbarqueOut]),
				type: "Message",
				content: new Text({
					text: oBundle.getText("PopEditarText", [vEmbarqueOut])
				}),
				beginButton: new Button({
					text: oBundle.getText("PopEditarBtnConfirm"),
					icon: "sap-icon://accept",
					type: "Accept",
					press: function () {
						that._goToLeitura(vEmbarque);
						dialog.close();
					}
				}),
				endButton: new Button({
					text: oBundle.getText("PopEditarBtnCancel"),
					icon: "sap-icon://decline",
					type: "Reject",
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
		handleListItemPress: function (oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext();
			if (oBindingContext) {
				var vEmbarque = oBindingContext.getProperty("Embarque");
				this._onListItemPress(vEmbarque);
			}
		},
		handlePressScan: function (oEvent) {
			var that = this;
			BarcodeScanner.scan(
				function (mResult) {
					that.handleScan(mResult.text);
				},
				function (Error) {
					MessageToast.show(Error);
				}
			);
		},
		handleScan: function (vScanValue) {
			this.procurarByEtiq(vScanValue);
		},
		procurarByEtiq: function (vScanValue) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var vBarCode = vScanValue;

			switch (vBarCode.length) {
			case 0:
				return;
			case 44: //chave de acesso
				var vChvNfe = vBarCode;
				this.procurarEmbarqueByChvNfe(vChvNfe);
				break;
			case 184: // etiqueta
				var oEtiqueta = {};
				oEtiqueta.chvnfe = vBarCode.substring(0, 44);
				oEtiqueta.branch = vBarCode.substring(44, 48);
				oEtiqueta.branchName = vBarCode.substring(48, 78);
				oEtiqueta.vendor = vBarCode.substring(78, 113);
				oEtiqueta.volume = vBarCode.substring(113, 121);
				oEtiqueta.dummy = vBarCode.substring(121, 171);
				oEtiqueta.categoriaEtq = vBarCode.substring(171, 174);
				oEtiqueta.nretq = vBarCode.substring(174, 184);

				this.procurarEmbarqueByChvNfe(oEtiqueta.chvnfe);
				break;
			default:
				MessageBox.error(oBundle.getText("errorNrEtqNotFound"), {
					title: oBundle.getText("Error"),
					styleClass: "sapUiSizeCompact"
				});
			}
		},
		procurarEmbarqueByChvNfe: function (vChvNfe) {
			var oView = this.getView();
			var that = this;

			var oBundle = oView.getModel("i18n").getResourceBundle();
			var filter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("Chvnfe", sap.ui.model.FilterOperator.EQ, vChvNfe)
				],
				and: true
			});
			var aFilter = [];
			aFilter.push(filter);

			var oSorter = new sap.ui.model.Sorter("Embarque", true); // sort descending
			var aSorter = [];
			aSorter.push(oSorter);

			var oModel = oView.getModel();
			var oModelUtil = new sap.ui.model.odata.v2.ODataModel(oModel.sServiceUrl, {
				defaultCountMode: "Inline",
				defaultOperationMode: "Server"
			});
			oModelUtil.attachRequestSent(this._onAttachRequest);
			oModelUtil.attachRequestCompleted(this._onAttachRequestCompleted);
			oModelUtil.read("/ZET_VCMM_EMBARQUE_ITEMSet", {
				filters: aFilter,
				sorters: aSorter,
				templateShareable: true,
				async: false,
				urlParameters: {
					"$expand": "ZAT_VCMM_EMBARQUE_ITM_TO_EMBARQUE_HEADER"
				},
				success: (oDataRead, response) => {
					var oResults = oDataRead.results;
					if (oResults.length === 0) {
						MessageBox.error(oBundle.getText("NotFound"), {
							title: oBundle.getText("Error"),
							styleClass: "sapUiSizeCompact"
						});
					} else {
						//obtem o mais recem criado
						var oEmbarqueItem = oResults[0];
						if (oEmbarqueItem.ZAT_VCMM_EMBARQUE_ITM_TO_EMBARQUE_HEADER.Status !== cStatusInit) {
							var vEmbarqueOut = this.myFormatter.shiftLeadingZeros(oEmbarqueItem.Embarque);
							MessageBox.error(oBundle.getText("AlreadyFinished", [vEmbarqueOut]), {
								title: oBundle.getText("Error"),
								styleClass: "sapUiSizeCompact"
							});
						} else {
							this._onListItemPress(oEmbarqueItem.Embarque);
						}

					}
				},
				error: function (oData, response) {
					that._onAttachRequestCompleted();
					if (oData !== undefined) {
						var responseText = oData.responseText;
						var vMsgErro = "";
						try {
							var responseParser = JSON.parse(responseText);
							vMsgErro = responseParser.error.message.value;
						} catch (err) {
							vMsgErro = responseText;
						}
						MessageBox.error(vMsgErro, {
							title: oBundle.getText("Error"),
							styleClass: "sapUiSizeCompact"
						});
					} else {
						MessageBox.error(oBundle.getText("errorSearchNrEtq"), {
							title: oBundle.getText("Error"),
							styleClass: "sapUiSizeCompact"
						});
					}
				}
			});
		},
///////////////////////////////////////////////////////////////
		_handleRouteTypeValueHelp: function (oEvent) {

			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment("workspace.zleituraembarque.view.SRota", this);
				this.getView().addDependent(this._valueHelpDialog);
			}

			this._valueHelpDialog.open();
		},

		_handleRouteTypeValueHelpSearch: function (evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter(
				"Descricao",
				sap.ui.model.FilterOperator.Contains, sValue);

			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleRouteTypeValueHelpClose: function (evt) {
			let oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var vKey = oSelectedItem.getDescription();
				
				// this._criarNovoAgrupador(vKey);
			    this._criarNovoEmbarque(vKey);
			}
	    }
///////////////////////////////////////////////////////////////
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf workspace.zleituraembarque.view.ListaEmbarque
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf workspace.zleituraembarque.view.ListaEmbarque
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf workspace.zleituraembarque.view.ListaEmbarque
		 */
		//	onExit: function() {
		//
		//	}

	});

});