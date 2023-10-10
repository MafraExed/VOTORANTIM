sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ndc/BarcodeScanner",
	"sap/m/MessageToast",
	"../util/formatter"
], function (Controller, MessageBox, BarcodeScanner, MessageToast, Formatter) {
	"use strict";
	const cProcChaveNfe = "1"; //Processado por chave de acesso
	const cProcNrEtq = "2"; //processado por etiqueta
	return Controller.extend("Workspace.zagrupador_v2.controller.S1", {
		myFormatter: Formatter,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Workspace.zagrupador_v2.controller.S1
		 */
		_onAttachRequest: function () {
			sap.ui.core.BusyIndicator.show();
		},
		_onAttachRequestCompleted: function () {
			sap.ui.core.BusyIndicator.hide();
		},

		onInit: function () {
			//Routing
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("S1").attachMatched(this.onRouterMatched, this);

			var oTable = this.getView().byId("tableAgrupador");
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
			var vAgrupador = oArgs.agrupador;
			oView.bindElement({
				path: "/ZET_VCMM_AGRUPSet('" + vAgrupador + "')",
				parameters: {
					expand: "ZAT_VCMM_AGRUP_HEADER_TO_AGRUP_ITM"
				},
				model: "GE",
				events: {
					change: function (oEvent) {
						// No data for the binding
						if (!oView.getBindingContext("GE")) {
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
			this._goNavBack("S1");
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
			this.onScanInputSubmit(vScanValue);
		},
		onScanInputSubmit: function (vScanValue) {
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
			var oModel = this.getView().getModel("GE");
			var oTable = this.getView().byId("tableAgrupador");
			var oModelUtil = new sap.ui.model.odata.v2.ODataModel(oModel.sServiceUrl, {
				defaultCountMode: "Inline",
				defaultOperationMode: "Server"
			});
			var that = this;
			var oAgrupador = this.getModelLoc(); //Obtem dados do objeto selecionado
			oModelUtil.attachRequestSent(this._onAttachRequest);
			oModelUtil.attachRequestCompleted(this._onAttachRequestCompleted);
			oModelUtil.callFunction("/addVolLidoAgrupador", {
				method: "POST", // http method
				urlParameters: {
					"Nretq": oEtiqueta.nretq,
					"Agrupador": oAgrupador.Agrupador
				}, // function import parameters
				success: function (oData, response) { // callback function for success
					if (oData.Nretq) {
						var vNretqOut = that.myFormatter.shiftLeadingZeros(oData.Nretq);
						MessageToast.show(oBundle.getText("addVolSuccess", [vNretqOut]));
					}
					oTable.getModel("GE").refresh();
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
			var oTable = this.getView().byId("tableAgrupador");
			var that = this;

			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			if (oTable.getItems().length === 0) {
				MessageBox.warning(
					oBundle.getText("PopCancelAgrup"), {
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						styleClass: bCompact ? "sapUiSizeCompact" : "",
						onClose: function (oAction) {
							if (oAction === "YES") {
								that._processarCancelAgrup();
							} else {
								// Não fazer nada.
								MessageToast.show(oBundle.getText("message_canceled_by_user"));
								that.getView().setBusy(false);
							}
						}
					}
				);
			} else {
				MessageBox.warning(
					oBundle.getText("PopResetTitle"), {
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						styleClass: bCompact ? "sapUiSizeCompact" : "",
						onClose: function (oAction) {
							if (oAction === "YES") {
								that._processarReset();
								that.getView().getModel("GE").refresh();
							} else {
								// Não fazer nada.
								MessageToast.show(oBundle.getText("message_canceled_by_user"));
								that.getView().setBusy(false);
							}
						}
					}
				);
			}
		},
		getModelLoc: function () {
			var vPath = this.getView().getBindingContext("GE").getPath();
			var oAgrupador = this.getView().getModel("GE").getProperty(vPath);
			return oAgrupador;
		},
		_processarReset: function () {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oModel = this.getView().getModel("GE");
			var oTable = this.getView().byId("tableAgrupador");
			var aSelected = oTable.getSelectedItems();
			var that = this;

			if (aSelected.length < 1) {
				MessageBox.error(oBundle.getText("NotSelectedVol"), {
					title: oBundle.getText("Error"),
					styleClass: "sapUiSizeCompact",
					onClose: function (oAction) {
						//that.onNavBack(null);
					}
				});
			} else {

				var vVolumeList = "";
				for (var i = 0; i < aSelected.length; i++) {
					if (i === 0) {
						vVolumeList = aSelected[i].getBindingContext("GE").getProperty("Nretq");
					} else {
						vVolumeList = vVolumeList + "-" + aSelected[i].getBindingContext("GE").getProperty("Nretq");
					}
				}

				var oModelUtil = new sap.ui.model.odata.v2.ODataModel(oModel.sServiceUrl, {
					defaultCountMode: "Inline",
					defaultOperationMode: "Server"
				});
				var oAgrupador = this.getModelLoc(); //Obtem dados do objeto selecionado
				oModelUtil.attachRequestSent(this._onAttachRequest);
				oModelUtil.attachRequestCompleted(this._onAttachRequestCompleted);
				oModelUtil.callFunction("/cancelVolLidoAgrupador", {
					method: "POST", // http method
					urlParameters: {
						"Agrupador": oAgrupador.Agrupador,
						"NretqList": vVolumeList
					}, // function import parameters
					success: function (oData, response) { // callback function for success
						var vNretqOut = that.myFormatter.shiftLeadingZeros(oData.vNretqOut);
						MessageToast.show(oBundle.getText("resetVolSuccess", [vNretqOut]));
						oTable.getModel("GE").refresh();
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

			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.warning(
				oBundle.getText("PopFinalizarText"), {
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: function (oAction) {
						if (oAction === "YES") {
							that._processarFinalizar();
						} else {
							// Não fazer nada.
							MessageToast.show(oBundle.getText("message_canceled_by_user"));
							that.getView().setBusy(false);
						}
					}
				}
			);
		},
		_processarFinalizar: function () {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oModel = this.getView().getModel("GE");
			var oTable = this.getView().byId("tableAgrupador");
			
			if (oTable.getItems().length <= 0) {
				MessageBox.error(oBundle.getText("ErrorVolumeAgrupado"), {
					styleClass: "sapUiSizeCompact"
				});
				return;
			}
			var oModelUtil = new sap.ui.model.odata.v2.ODataModel(oModel.sServiceUrl, {
				defaultCountMode: "Inline",
				defaultOperationMode: "Server"
			});
			var that = this;
			var oAgrupador = this.getModelLoc(); //Obtem dados do objeto selecionado
			oModelUtil.attachRequestSent(this._onAttachRequest);
			oModelUtil.attachRequestCompleted(this._onAttachRequestCompleted);
			oModelUtil.callFunction("/finalizarAgrupador", {
				method: "POST", // http method
				urlParameters: {
					"Agrupador": oAgrupador.Agrupador
				}, // function import parameters
				success: function (oData, response) { // callback function for success
					var vAgrupadorOut = that.myFormatter.shiftLeadingZeros(oData.Agrupador);
					MessageToast.show(oBundle.getText("PopCancelConfirm", [vAgrupadorOut]));
					that._PDF(that, oData.Agrupador);
					var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
					oRouter.navTo("S0", {
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
		_PDF: function (that, vAgrupador) {

			jQuery.sap.log.info("OnPDF print");

			var string = that.getView().getModel("GE").sServiceUrl +
				"/ZET_VCMM_FILESet(fileName='" + vAgrupador + "',fileCategory='AGR',fileDescription='PE')/$value";
			window.open(string);
		},

		_processarCancelAgrup: function () {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oModel = this.getView().getModel("GE");
			var oModelUtil = new sap.ui.model.odata.v2.ODataModel(oModel.sServiceUrl, {
				defaultCountMode: "Inline",
				defaultOperationMode: "Server"
			});
			var that = this;
			var oAgrupador = this.getModelLoc(); //Obtem dados do objeto selecionado
			oModelUtil.attachRequestSent(this._onAttachRequest);
			oModelUtil.attachRequestCompleted(this._onAttachRequestCompleted);
			oModelUtil.callFunction("/cancelarAgrupador", {
				method: "POST", // http method
				urlParameters: {
					"Agrupador": oAgrupador.Agrupador
				}, // function import parameters
				success: function (oData, response) { // callback function for success
					var vAgrupadorOut = that.myFormatter.shiftLeadingZeros(oData.Agrupador);
					MessageToast.show(oBundle.getText("PopCancelConfirm", [vAgrupadorOut]));
					var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
					oRouter.navTo("S0", {
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
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf "Workspace.zagrupador_v2.controller.S1"
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf "Workspace.zagrupador_v2.controller.S1"
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf "Workspace.zagrupador_v2.controller.S1"
		 */
		//	onExit: function() {
		//
		//	}

	});

});