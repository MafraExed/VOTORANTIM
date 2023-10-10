sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ndc/BarcodeScanner",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"../util/formatter",
	"sap/m/MessageBox",
	"sap/m/Button",
	"sap/m/Text",
	"sap/m/Dialog",
	"sap/ui/core/routing/History"
], function (Controller, BarcodeScanner, MessageToast, JSONModel, Formatter, MessageBox, Button, Text, Dialog, History) {
	"use strict";
	//******Constante em conformidade com a constante ABAP ZCLMM0095_SGEEST_EMBARQUE_ITEM=>c_tp_add_vol
	const cProcChaveNfe = "1"; //Processado por chave de acesso
	const cProcNrEtq = "2"; //processado por etiqueta

	return Controller.extend("workspace.zleituraembarque.controller.Leitura", {
		myFormatter: Formatter,
		_onAttachRequest: function () {
			sap.ui.core.BusyIndicator.show();
		},
		_onAttachRequestCompleted: function () {
			sap.ui.core.BusyIndicator.hide();
		},
		onInit: function () {
			//Routing
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Leitura").attachMatched(this.onRouterMatched, this);

			var oTable = this.getView().byId("tableLeitura");
			oTable.attachEventOnce("updateStarted", this._onAttachRequest);
			oTable.attachEventOnce("updateFinished", this._onAttachRequestCompleted, this);

		},

		onRouterMatched: function (evt) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oArgs;
			var oView;
			var that = this;
			oArgs = evt.getParameter("arguments");
			oView = this.getView();
			var vEmbarque = oArgs.embarque; 
			oView.bindElement({
				path: "/ZET_VCMM_EMBARQUE_HEADERSet('" + vEmbarque + "')",
				parameters: {
					expand: "ZAT_VCMM_EMBARQUE_HEADER_TO_EMBARQUE_ITM"
				},
				events: {
					change: function (oEvent) {
						// No data for the binding
						if (!oView.getBindingContext()) {
							MessageBox.error(oBundle.getText("NotFound"), {
								title: oBundle.getText("Error"),
								styleClass: "sapUiSizeCompact",
								onClose: function (oAction) {
									that.onNavBack(null);
								}
							});
						}
					},
					dataRequested: function (oData) {
						sap.ui.core.BusyIndicator.show();
					},
					dataReceived: function (oData) {
						sap.ui.core.BusyIndicator.hide();
					}
				}
			});
		},
		onNavBack: function (oEvent) {
			this._goNavBack("default");
		},
		_goNavBack: function (sRoute) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo(sRoute,
				null, // Parametro do routing
				true // otherwise we go backwards with a forward history
			);

		},
		onPressScan: function (oEvent) {
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
			this.onChaveNfeInputSubmit(vScanValue);
		},

		onChaveNfeInputSubmit: function (vScanValue) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var vBarCode = vScanValue;
			var oEtiqueta = {};

			switch (vBarCode.length) {
			case 0:
				return;
			case 44: //chave de acesso
				oEtiqueta.chvnfe = vBarCode;
				oEtiqueta.nretq = "";
				this._processarInput(oEtiqueta, cProcChaveNfe);
				break;
			case 184: // etiqueta
				oEtiqueta.chvnfe = vBarCode.substring(0, 44);
				oEtiqueta.branch = vBarCode.substring(44, 48);
				oEtiqueta.branchName = vBarCode.substring(48, 78);
				oEtiqueta.vendor = vBarCode.substring(78, 113);
				oEtiqueta.volume = vBarCode.substring(113, 121);
				oEtiqueta.dummy = vBarCode.substring(121, 171);
				oEtiqueta.categoriaEtq = vBarCode.substring(171, 174);
				oEtiqueta.nretq = vBarCode.substring(174, 184);

				this._processarInput(oEtiqueta, cProcNrEtq);
				break;
			default:
				MessageBox.error(oBundle.getText("errorNrEtqNotFound"), {
					title: oBundle.getText("Error"),
					styleClass: "sapUiSizeCompact"
				});
			}
		},

		_processarInput: function (oEtiqueta, vTipoInput) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oModel = this.getView().getModel();
			var oTable = this.getView().byId("tableLeitura");
			var oModelUtil = new sap.ui.model.odata.v2.ODataModel(oModel.sServiceUrl, {
				defaultCountMode: "Inline",
				defaultOperationMode: "Server"
			});
			var that = this;
			var oEmbarque = this.getModelLoc(); //Obtem dados do objeto selecionado
			oModelUtil.attachRequestSent(this._onAttachRequest);
			oModelUtil.attachRequestCompleted(this._onAttachRequestCompleted);
			oModelUtil.callFunction("/addVolLidoEmbarque", {
				method: "POST", // http method
				urlParameters: {
					"nretq": oEtiqueta.nretq,
					"chvnfe": oEtiqueta.chvnfe,
					"embarque": oEmbarque.Embarque,
					"tipo": vTipoInput
				}, // function import parameters
				success: function (oData, response) { // callback function for success
					if (oData.Embarque) {
						var vEmbarqueOut = that.myFormatter.shiftLeadingZeros(oData.Embarque);
						MessageToast.show(oBundle.getText("addVolSuccess", [vEmbarqueOut]));
					}
					
					oModel.refresh(true);
					oTable.getBinding("items").refresh();
				},
				error: function (oData) { // callback function for error
					that._onAttachRequestCompleted();
					var responseText = oData.responseText;
					if (responseText !== undefined) {
						var vMsgErro = "";
						try {
							var responseParser = JSON.parse(responseText);
							var errorDetails = responseParser.error.innererror.errordetails;
							if (errorDetails.length > 1) {
								vMsgErro = errorDetails[0].message;
							} else {
								vMsgErro = responseParser.error.message.value;
							}
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
			});

		},

		handleCancelar: function (evt) {
			var oView = this.getView();
			var oBundle = oView.getModel("i18n").getResourceBundle();
			var that = this;
			var dialog = new Dialog({
				title: oBundle.getText("PopResetTitle"),
				type: "Message",
				content: new Text({
					text: oBundle.getText("PopResetText")
				}),
				beginButton: new Button({
					text: oBundle.getText("PopResetBtnConfirm"),
					icon: "sap-icon://accept",
					type: "Accept",
					press: function () {
						that._processarReset();
						//	MessageToast.show(oBundle.getText("PopResetConfirm"));
						dialog.close();
					}
				}),
				endButton: new Button({
					text: oBundle.getText("PopResetBtnCancel"),
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
		_processarReset: function () {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oModel = this.getView().getModel();
			var oTable = this.getView().byId("tableLeitura");
			var aSelected = oTable.getSelectedItems();

			if (aSelected.length < 1) {
				MessageBox.error(oBundle.getText("NotSelectedNfe"), {
					title: oBundle.getText("Error"),
					styleClass: "sapUiSizeCompact",
					onClose: function (oAction) {
						//that.onNavBack(null);
					}
				});
			} else {

				var vChvnfeList = "";
				for (var i = 0; i < aSelected.length; i++) {
					if (i === 0) {
						vChvnfeList = aSelected[i].getBindingContext().getProperty("Chvnfe");
					} else {
						vChvnfeList = vChvnfeList + "-" + aSelected[i].getBindingContext().getProperty("Chvnfe");
					}

				}
				var oModelUtil = new sap.ui.model.odata.v2.ODataModel(oModel.sServiceUrl, {
					defaultCountMode: "Inline",
					defaultOperationMode: "Server"
				});
				var that = this;
				var oEmbarque = this.getModelLoc(); //Obtem dados do objeto selecionado
				oModelUtil.attachRequestSent(this._onAttachRequest);
				oModelUtil.attachRequestCompleted(this._onAttachRequestCompleted);
				oModelUtil.callFunction("/cancelVolLidoEmbarque", {
					method: "POST", // http method
					urlParameters: {
						"embarque": oEmbarque.Embarque,
						"chvnfeList": vChvnfeList
					}, // function import parameters
					success: function (oData, response) { // callback function for success
						var vEmbarqueOut = that.myFormatter.shiftLeadingZeros(oData.Embarque);
						MessageToast.show(oBundle.getText("resetVolSuccess", [vEmbarqueOut]));
						
						oModel.refresh(true);
						oTable.getBinding("items").refresh();
					},
					error: function (oData) { // callback function for error
						that._onAttachRequestCompleted();
						var responseText = oData.responseText;
						if (responseText !== undefined) {
							var vMsgErro = "";
							try {
								var responseParser = JSON.parse(responseText);
								var errorDetails = responseParser.error.innererror.errordetails;
								if (errorDetails.length > 1) {
									vMsgErro = errorDetails[0].message;
								} else {
									vMsgErro = responseParser.error.message.value;
								}
							} catch (err) {
								vMsgErro = responseText;
							}
							MessageBox.error(vMsgErro, {
								title: oBundle.getText("Error"),
								styleClass: "sapUiSizeCompact"
							});
						} else {
							MessageBox.error(oBundle.getText("ErrorReset"), {
								styleClass: "sapUiSizeCompact"
							});
						}
					}
				});

			}

		},
		handleSalvar: function (evt) {
			var oView = this.getView();
			var oBundle = oView.getModel("i18n").getResourceBundle();
			var that = this;
			var dialog = new Dialog({
				title: oBundle.getText("PopFinalizarTitle"),
				type: "Message",
				content: new Text({
					text: oBundle.getText("PopFinalizarText")
				}),
				beginButton: new Button({
					text: oBundle.getText("PopFinalizarBtnConfirm"),
					icon: "sap-icon://accept",
					type: "Accept",
					press: function () {
						that._processarFinalizar();
						//	var vEmbarqueOut = that.myFormatter.shiftLeadingZeros(that.vEmbarque);
						//	MessageToast.show(oBundle.getText("PopFinalizarConfirm", [vEmbarqueOut]));

						dialog.close();
					}
				}),
				endButton: new Button({
					text: oBundle.getText("PopFinalizarBtnCancel"),
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
		_processarFinalizar: function () {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oModel = this.getView().getModel();
			var oModelUtil = new sap.ui.model.odata.v2.ODataModel(oModel.sServiceUrl, {
				defaultCountMode: "Inline",
				defaultOperationMode: "Server"
			});
			var that = this;
			var oEmbarque = this.getModelLoc(); //Obtem dados do objeto selecionado
			oModelUtil.attachRequestSent(this._onAttachRequest);
			oModelUtil.attachRequestCompleted(this._onAttachRequestCompleted);
			oModelUtil.callFunction("/finalizarEmbarque", {
				method: "POST", // http method
				urlParameters: {
					"embarque": oEmbarque.Embarque
				}, // function import parameters
				success: function (oData, response) { // callback function for success
					var vEmbarqueOut = that.myFormatter.shiftLeadingZeros(oData.Embarque);
					MessageToast.show(oBundle.getText("PopFinalizarConfirm", [vEmbarqueOut]));

					var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
					oRouter.navTo("ListaEmbarque", {
							atualizarLista: true
						}, // Parametro do routing
						false // no go again
					);
				},
				error: function (oData) { // callback function for error
					that._onAttachRequestCompleted();
					var responseText = oData.responseText;
					if (responseText !== undefined) {
						var vMsgErro = "";
						try {
							var responseParser = JSON.parse(responseText);
							var errorDetails = responseParser.error.innererror.errordetails;
							if (errorDetails.length > 1) {
								vMsgErro = errorDetails[0].message;
							} else {
								vMsgErro = responseParser.error.message.value;
							}
						} catch (err) {
							vMsgErro = responseText;
						}
						MessageBox.error(vMsgErro, {
							title: oBundle.getText("Error"),
							styleClass: "sapUiSizeCompact"
						});
					} else {
						MessageBox.error(oBundle.getText("ErrorReset"), {
							styleClass: "sapUiSizeCompact"
						});
					}
				}
			});

		},
		handleChangeTpTransp: function (oEvent) {
			var vTpTransp = oEvent.getParameter("selectedItem").getProperty("key");
			if (vTpTransp && vTpTransp !== "") {

				var oBundle = this.getView().getModel("i18n").getResourceBundle();
				var oModel = this.getView().getModel();
				var oModelUtil = new sap.ui.model.odata.v2.ODataModel(oModel.sServiceUrl, {
					defaultCountMode: "Inline",
					defaultOperationMode: "Server"
				});
				var that = this;
				var oEmbarque = this.getModelLoc(); //Obtem dados do objeto selecionado

				oModelUtil.attachRequestSent(this._onAttachRequest);
				oModelUtil.attachRequestCompleted(this._onAttachRequestCompleted);
				oModelUtil.callFunction("/alterarTipoTransp", {
					method: "POST", // http method
					urlParameters: {
						"embarque": oEmbarque.Embarque,
						"vhilm": vTpTransp
					}, // function import parameters
					success: function (oData, response) { // callback function for success
						var vEmbarqueOut = that.myFormatter.shiftLeadingZeros(oData.Embarque);
						MessageToast.show(oBundle.getText("AltTpTransp", [vEmbarqueOut]));
					},
					error: function (oData) { // callback function for error
						that._onAttachRequestCompleted();
						var responseText = oData.responseText;
						if (responseText !== undefined) {
							var vMsgErro = "";
							try {
								var responseParser = JSON.parse(responseText);
								var errorDetails = responseParser.error.innererror.errordetails;
								if (errorDetails.length > 1) {
									vMsgErro = errorDetails[0].message;
								} else {
									vMsgErro = responseParser.error.message.value;
								}
							} catch (err) {
								vMsgErro = responseText;
							}
							MessageBox.error(vMsgErro, {
								title: oBundle.getText("Error"),
								styleClass: "sapUiSizeCompact"
							});
						} else {
							MessageBox.error(oBundle.getText("ErrorReset"), {
								styleClass: "sapUiSizeCompact"
							});
						}
					}
				});
			}

		},
		getModelLoc: function () {
			var vPath = this.getView().getBindingContext().getPath();
			var oEmbarque = this.getView().getModel().getProperty(vPath);
			return oEmbarque;
		},
		onAfterRendering: function () {

		}

	});
});