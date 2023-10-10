sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ndc/BarcodeScanner",
	"sap/m/MessageBox",
	"sap/m/Button",
	"sap/m/Text",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/ui/core/Fragment",
	"../util/formatter"
], function (Controller, BarcodeScanner, MessageBox, Button, Text, MessageToast, JSONModel, Dialog, Fragment, Formatter) {
	"use strict";
	return Controller.extend("workspace.zmonit_embarque.zmonit_embarque.controller.ListaEmbarque", {
		myFormatter: Formatter,
		_onAttachRequest: function () {
			sap.ui.core.BusyIndicator.show();
		},
		_onAttachRequestCompleted: function () {
			sap.ui.core.BusyIndicator.hide();
		},
		onInitFilterBar: function (oEvent) {
			var oSmartFilterBar = oEvent.getSource();
			var oFieldChvnfe = oSmartFilterBar.getControlByKey("Chvnfe");
			oFieldChvnfe.setWidth("400px");

			var oFieldSts = oSmartFilterBar.getControlByKey("ZAT_VCMM_EMBARQUE_ITM_TO_EMBARQUE_HEADER.Status");
			oFieldSts.setSelectedKey(this.oStsCustom.todos);
		},
		onBeforeRebindTable: function (oEvent) {
			//Filtro de custom fields
			var binding = oEvent.getParameter("bindingParams");
			binding.parameters.expand =
				"ZAT_VCMM_EMBARQUE_ITM_TO_EMBARQUE_HEADER,ZAT_VCMM_EMBARQUE_ITEM_TO_NFHEADER,ZAT_VCMM_EMBARQUE_ITM_TO_EMBARQUE_HEADER/ZAT_VCMM_EMBARQUE_HEADER_TO_VHILM";

			var oSmartFilterBar = this.getView().byId("smartFilterBarEmbarque");
			var oFieldSts = oSmartFilterBar.getControlByKey("ZAT_VCMM_EMBARQUE_ITM_TO_EMBARQUE_HEADER.Status");
			var vSts = oFieldSts.getSelectedKey();

			if (vSts !== this.oStsCustom.todos) {
				var oFilter = new sap.ui.model.Filter("ZAT_VCMM_EMBARQUE_ITM_TO_EMBARQUE_HEADER/Status", sap.ui.model.FilterOperator.EQ,
					vSts);
				binding.filters.push(oFilter);
			}

			//Ordenação padrão
			if (!binding.sorter.length) {
				binding.sorter.push(new sap.ui.model.Sorter("Embarque", true));
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
			if (vScanValue && vScanValue.length === 44) {
				var oSmartFilterBar = this.getView().byId("smartFilterBarEmbarque");
				var oFieldChvnfe = oSmartFilterBar.getControlByKey("Chvnfe");
				oFieldChvnfe.addToken(new sap.m.Token({
					key: vScanValue,
					text: vScanValue
				}));
			}
		},
		handleProcEmb: function () {
			this.getView().setBusy(true);
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var that = this;
			var dialog = new Dialog({
				title: oBundle.getText("PopProcTitle"),
				type: "Message",
				content: new Text({
					text: oBundle.getText("PopProcText")
				}),
				beginButton: new Button({
					text: oBundle.getText("PopProcBtnConfirm"),
					icon: "sap-icon://accept",
					type: "Accept",
					press: function () {
						that._processarEmbarque();
						dialog.close();
					}
				}),
				endButton: new Button({
					text: oBundle.getText("PopProcBtnCancel"),
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
		_processarEmbarque: function () {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oSmartTable = this._getSmartTable();
			var oTable = oSmartTable.getTable();
			var aSelected = oTable.getSelectedItems();
			var oSmartFilterBar = this.getView().byId("smartFilterBarEmbarque");

			if (aSelected.length < 1) {
				MessageBox.error(oBundle.getText("NotSelectedEmbarque"), {
					title: oBundle.getText("Error"),
					styleClass: "sapUiSizeCompact",
					onClose: function (oAction) {
						//that.onNavBack(null);
					}
				});
			} else {
				var vEmbarqueList = "";
				for (var i = 0; i < aSelected.length; i++) {
					if (i === 0) {
						vEmbarqueList = aSelected[i].getBindingContext().getProperty("Embarque");
					} else {
						vEmbarqueList = vEmbarqueList + "-" + aSelected[i].getBindingContext().getProperty("Embarque");
					}

				}

				var oModel = this.getView().getModel();
				var oModelUtil = new sap.ui.model.odata.v2.ODataModel(oModel.sServiceUrl, {
					defaultCountMode: "Inline",
					defaultOperationMode: "Server"
				});
				var that = this;
				oModelUtil.attachRequestSent(this._onAttachRequest);
				oModelUtil.attachRequestCompleted(this._onAttachRequestCompleted);
				oModelUtil.callFunction("/procSimulEmbarque", {
					method: "POST", // http method
					urlParameters: {
						"embarqueList": vEmbarqueList
					}, // function import parameters
					success: function (oData, response) { // callback function for success
						MessageToast.show(oBundle.getText("procEmbqSuccess"));
						oSmartFilterBar.triggerSearch();
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
					},
					refreshAfterChange: true
				});
			}
		},
		handleDownFile: function () {
			var oModel = this.getView().getModel();
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oSmartTable = this._getSmartTable();
			var oTable = oSmartTable.getTable();
			var aSelected = oTable.getSelectedItems();

			if (aSelected.length < 1) {
				MessageBox.error(oBundle.getText("NotSelectedEmbarque"), {
					title: oBundle.getText("Error"),
					styleClass: "sapUiSizeCompact",
					onClose: function (oAction) {
						//that.onNavBack(null);
					}
				});
			} else {
				var aDistinct = [];
				var oUnique = {};
				for (var i = 0; i < aSelected.length; i++) {
					var vEmbarque = aSelected[i].getBindingContext().getProperty("Embarque");

					//Verificar status
					var vStatus = aSelected[i].getBindingContext().getProperty("ZAT_VCMM_EMBARQUE_ITM_TO_EMBARQUE_HEADER/Status");
					if (vStatus !== "L" && vStatus !== "D" && vStatus !== "Z") { //Liberado, divergencia ou encerrado
						aDistinct = [];

						MessageBox.error(oBundle.getText("NotSelectedEmbarqueFile", [vEmbarque]), {
							title: oBundle.getText("Error"),
							styleClass: "sapUiSizeCompact",
							onClose: function (oAction) {
								//that.onNavBack(null);
							}
						});
						break;
					}

					if (typeof (oUnique[vEmbarque]) === "undefined") {
						aDistinct.push(vEmbarque);
					}
					oUnique[vEmbarque] = vEmbarque;
				}

				for (i = 0; i < aDistinct.length; i++) {
					//Proceda
					var oURL = oModel.sServiceUrl + "/ZET_VCMM_FILESet(fileName='" + aDistinct[i] + "',fileCategory='NT',fileDescription='" +
						aDistinct[i] + "')/$value";
					sap.m.URLHelper.destroy();
					sap.m.URLHelper.redirect(oURL, true);

				}

			}

		},
		onPressLogGR: function (oEvent) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oSmartTable = this._getSmartTable();
			var oTable = oSmartTable.getTable();
			var aSelected = oTable.getSelectedItems();

			if (aSelected.length !== 1) {
				MessageBox.error(oBundle.getText("NotMultiSelectedEmbarque"), {
					title: oBundle.getText("Error"),
					styleClass: "sapUiSizeCompact",
					onClose: function (oAction) {
						//that.onNavBack(null);
					}
				});
			} else {
				var oContext = aSelected[0].getBindingContext();

				var oView = this.getView();
				var oDialog = oView.byId("idDialogTableLog");

				// create dialog lazily
				if (!oDialog) {
					// create dialog via fragment factory
					oDialog = sap.ui.xmlfragment(oView.getId(), "workspace.zmonit_embarque.zmonit_embarque.view.LogGC", this);
					// connect dialog to view (models, lifecycle)
					oView.addDependent(oDialog);
				}
				var oTbTableLog = this.getView().byId("idTbTableLog");
				var vChavNFE = oContext.getProperty("Chvnfe");
				var oFilter = new sap.ui.model.Filter("Chvnfe", sap.ui.model.FilterOperator.EQ, vChavNFE);
				var oBinding = oTbTableLog.getBinding("items");
				oBinding.filter(oFilter);

				oDialog.open();

			}

		},
		onCloseLogGR: function () {
			this.byId("idDialogTableLog").close();
		},
		onPressLogSimul: function () {

			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oSmartTable = this._getSmartTable();
			var oTable = oSmartTable.getTable();
			var aSelected = oTable.getSelectedItems();

			if (aSelected.length !== 1) {
				MessageBox.error(oBundle.getText("NotMultiSelectedEmbarque"), {
					title: oBundle.getText("Error"),
					styleClass: "sapUiSizeCompact",
					onClose: function (oAction) {
						//that.onNavBack(null);
					}
				});
			} else {
				var oContext = aSelected[0].getBindingContext();

				var oView = this.getView();
				var oDialog = oView.byId("idDialogTableSimul");

				// create dialog lazily
				if (!oDialog) {
					// create dialog via fragment factory
					oDialog = sap.ui.xmlfragment(oView.getId(), "workspace.zmonit_embarque.zmonit_embarque.view.LogSimul", this);
					// connect dialog to view (models, lifecycle)
					oView.addDependent(oDialog);
				}
				var oTbTableLog = this.getView().byId("idTbTableSimul");
				var vEmbarque = oContext.getProperty("Embarque");
				var oFilter = new sap.ui.model.Filter("Embarque", sap.ui.model.FilterOperator.EQ, vEmbarque);
				var oBinding = oTbTableLog.getBinding("items");
				oBinding.filter(oFilter);

				oDialog.open();

			}
		},
		onCloseLogSimul: function () {
			this.byId("idDialogTableSimul").close();
		},
		handleLibEmb: function () {
			this.getView().setBusy(true);
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var that = this;
			var dialog = new Dialog({
				title: oBundle.getText("PopLibTitle"),
				type: "Message",
				content: new Text({
					text: oBundle.getText("PopLibText")
				}),
				beginButton: new Button({
					text: oBundle.getText("PopLibBtnConfirm"),
					icon: "sap-icon://accept",
					type: "Accept",
					press: function () {
						that._liberarEmbarque(false);
						dialog.close();
					}
				}),
				endButton: new Button({
					text: oBundle.getText("PopLibBtnCancel"),
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
		handleDiverEmb: function () {
			this.getView().setBusy(true);
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var that = this;
			var dialog = new Dialog({
				title: oBundle.getText("PopLibTitle"),
				type: "Message",
				content: new Text({
					text: oBundle.getText("PopLibText")
				}),
				beginButton: new Button({
					text: oBundle.getText("PopLibBtnConfirm"),
					icon: "sap-icon://accept",
					type: "Accept",
					press: function () {
						that._liberarEmbarque(true);
						dialog.close();
					}
				}),
				endButton: new Button({
					text: oBundle.getText("PopLibBtnCancel"),
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
		_liberarEmbarque: function (vComDiverg) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oSmartTable = this._getSmartTable();
			var oTable = oSmartTable.getTable();
			var aSelected = oTable.getSelectedItems();
			var oSmartFilterBar = this.getView().byId("smartFilterBarEmbarque");

			if (aSelected.length !== 1) {
				MessageBox.error(oBundle.getText("NotMultiSelectedEmbarque"), {
					title: oBundle.getText("Error"),
					styleClass: "sapUiSizeCompact",
					onClose: function (oAction) {
						//that.onNavBack(null);
					}
				});
			} else {
				var aDistinct = [];
				var oUnique = {};
				for (var i = 0; i < aSelected.length; i++) {
					var vEmbarque = aSelected[i].getBindingContext().getProperty("Embarque");

					if (typeof (oUnique[vEmbarque]) === "undefined") {
						aDistinct.push(vEmbarque);
					}
					oUnique[vEmbarque] = vEmbarque;
				}

				if (aDistinct.length !== 1) {
					MessageBox.error(oBundle.getText("NotMultiSelectedEmbarque"), {
						title: oBundle.getText("Error"),
						styleClass: "sapUiSizeCompact",
						onClose: function (oAction) {
							//that.onNavBack(null);
						}
					});
				} else {

					var oModel = this.getView().getModel();
					var oModelUtil = new sap.ui.model.odata.v2.ODataModel(oModel.sServiceUrl, {
						defaultCountMode: "Inline",
						defaultOperationMode: "Server"
					});

					var vFunc = "/liberarEmbarque";
					if (vComDiverg === true) {
						vFunc = "/libDivergEmbarque";
					}

					var that = this;
					oModelUtil.attachRequestSent(this._onAttachRequest);
					oModelUtil.attachRequestCompleted(this._onAttachRequestCompleted);
					oModelUtil.callFunction(vFunc, {
						method: "POST", // http method
						urlParameters: {
							"embarque": aDistinct[0]
						}, // function import parameters
						success: function (oData, response) { // callback function for success
							var vEmbarqueOut = that.myFormatter.shiftLeadingZeros(aDistinct[0]);
							MessageToast.show(oBundle.getText("procLibSuccess", [vEmbarqueOut]));
							oSmartFilterBar.triggerSearch();
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
						},
						refreshAfterChange: true
					});
				} //	if (aDistinct.length !== 1) {
			} //if (aSelected.length !== 1) {
		},
		handleCancEmb: function () {
			this.getView().setBusy(true);
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var that = this;
			var dialog = new Dialog({
				title: oBundle.getText("PopCancTitle"),
				type: "Message",
				content: new Text({
					text: oBundle.getText("PopCancText")
				}),
				beginButton: new Button({
					text: oBundle.getText("PopCancBtnConfirm"),
					icon: "sap-icon://accept",
					type: "Accept",
					press: function () {
						that._cancelarEmbarque();
						dialog.close();
					}
				}),
				endButton: new Button({
					text: oBundle.getText("PopCancBtnCancel"),
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
		_cancelarEmbarque: function () {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oSmartTable = this._getSmartTable();
			var oTable = oSmartTable.getTable();
			var aSelected = oTable.getSelectedItems();
			var oSmartFilterBar = this.getView().byId("smartFilterBarEmbarque");

			if (aSelected.length !== 1) {
				MessageBox.error(oBundle.getText("NotMultiSelectedEmbarque"), {
					title: oBundle.getText("Error"),
					styleClass: "sapUiSizeCompact",
					onClose: function (oAction) {
						//that.onNavBack(null);
					}
				});
			} else {
				var aDistinct = [];
				var oUnique = {};
				for (var i = 0; i < aSelected.length; i++) {
					var vEmbarque = aSelected[i].getBindingContext().getProperty("Embarque");

					if (typeof (oUnique[vEmbarque]) === "undefined") {
						aDistinct.push(vEmbarque);
					}
					oUnique[vEmbarque] = vEmbarque;
				}

				if (aDistinct.length !== 1) {
					MessageBox.error(oBundle.getText("NotMultiSelectedEmbarque"), {
						title: oBundle.getText("Error"),
						styleClass: "sapUiSizeCompact",
						onClose: function (oAction) {
							//that.onNavBack(null);
						}
					});
				} else {

					var oModel = this.getView().getModel();
					var oModelUtil = new sap.ui.model.odata.v2.ODataModel(oModel.sServiceUrl, {
						defaultCountMode: "Inline",
						defaultOperationMode: "Server"
					});
					var that = this;
					oModelUtil.attachRequestSent(this._onAttachRequest);
					oModelUtil.attachRequestCompleted(this._onAttachRequestCompleted);
					oModelUtil.callFunction("/cancelarEmbarque", {
						method: "POST", // http method
						urlParameters: {
							"embarque": aDistinct[0]
						}, // function import parameters
						success: function (oData, response) { // callback function for success
							var vEmbarqueOut = that.myFormatter.shiftLeadingZeros(aDistinct[0]);
							MessageToast.show(oBundle.getText("procCancSuccess", [vEmbarqueOut]));
							oSmartFilterBar.triggerSearch();
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
						},
						refreshAfterChange: true
					});
				} //	if (aDistinct.length !== 1) {
			} //if (aSelected.length !== 1) {
		},
		handleEditEmb: function () {
			this.getView().setBusy(true);
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var that = this;
			var dialog = new Dialog({
				title: oBundle.getText("PopEditTitle"),
				type: "Message",
				content: new Text({
					text: oBundle.getText("PopEditText")
				}),
				beginButton: new Button({
					text: oBundle.getText("PopEditBtnConfirm"),
					icon: "sap-icon://accept",
					type: "Accept",
					press: function () {
						that._editarEmbarque();
						dialog.close();
					}
				}),
				endButton: new Button({
					text: oBundle.getText("PopEditBtnCancel"),
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
		_editarEmbarque: function () {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var oSmartTable = this._getSmartTable();
			var oTable = oSmartTable.getTable();
			var aSelected = oTable.getSelectedItems();
			var oSmartFilterBar = this.getView().byId("smartFilterBarEmbarque");

			if (aSelected.length !== 1) {
				MessageBox.error(oBundle.getText("NotMultiSelectedEmbarque"), {
					title: oBundle.getText("Error"),
					styleClass: "sapUiSizeCompact",
					onClose: function (oAction) {
						//that.onNavBack(null);
					}
				});
			} else {
				var aDistinct = [];
				var oUnique = {};
				for (var i = 0; i < aSelected.length; i++) {
					var vEmbarque = aSelected[i].getBindingContext().getProperty("Embarque");

					if (typeof (oUnique[vEmbarque]) === "undefined") {
						aDistinct.push(vEmbarque);
					}
					oUnique[vEmbarque] = vEmbarque;
				}

				if (aDistinct.length !== 1) {
					MessageBox.error(oBundle.getText("NotMultiSelectedEmbarque"), {
						title: oBundle.getText("Error"),
						styleClass: "sapUiSizeCompact",
						onClose: function (oAction) {
							//that.onNavBack(null);
						}
					});
				} else {

					var oModel = this.getView().getModel();
					var oModelUtil = new sap.ui.model.odata.v2.ODataModel(oModel.sServiceUrl, {
						defaultCountMode: "Inline",
						defaultOperationMode: "Server"
					});
					var that = this;
					oModelUtil.attachRequestSent(this._onAttachRequest);
					oModelUtil.attachRequestCompleted(this._onAttachRequestCompleted);
					oModelUtil.callFunction("/voltarEmbarqueInit", {
						method: "POST", // http method
						urlParameters: {
							"embarque": aDistinct[0]
						}, // function import parameters
						success: function (oData, response) { // callback function for success
							var vEmbarqueOut = that.myFormatter.shiftLeadingZeros(aDistinct[0]);
							MessageToast.show(oBundle.getText("procEditSuccess", [vEmbarqueOut]));
							oSmartFilterBar.triggerSearch();
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
						},
						refreshAfterChange: true
					});
				} //	if (aDistinct.length !== 1) {
			} //if (aSelected.length !== 1) {
		},
		_getSmartTable: function () {
			if (!this._oSmartTable) {
				this._oSmartTable = this.getView().byId("smartTableBarEmbarque");
			}
			return this._oSmartTable;
		},
		onInit: function () {
			this.oStsCustom = {
				todos: "#"
			};
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf workspace.zleituraembarque.view.ListaEmbarque
		 */
		onBeforeRendering: function () {

		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf workspace.zleituraembarque.view.ListaEmbarque
		 */
		onAfterRendering: function () {

		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf workspace.zleituraembarque.view.ListaEmbarque
		 */
		onExit: function () {

		}
	});
});