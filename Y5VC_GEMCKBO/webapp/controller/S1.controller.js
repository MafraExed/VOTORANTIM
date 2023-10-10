sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ndc/BarcodeScanner",
	"sap/f/library",
	"sap/m/Dialog",
	"sap/m/List",
	"sap/m/StandardListItem",
	"../model/formatter",
	"sap/m/MessageToast",
	"sap/m/UploadCollectionParameter",
	"sap/ui/model/Filter",
	"sap/m/Button",
	"sap/m/Text"
], function (Controller, JSONModel, MessageBox, BarcodeScanner, fioriLibrary, Dialog, List, StandardListItem, Formatter, MessageToast,
	UploadCollectionParameter, Filter, Button, Text) {
	"use strict";

	const cItemAdd = 900000;

	return Controller.extend("workspace.zcockpit_bo_v3.controller.S1", {
		myFormatter: Formatter,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf workspace.zcockpit_bo_v3.view.S1
		 */
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("detail").attachPatternMatched(this.handleRouteMatched, this);
		},

		handleRouteMatched: function (oEvent) {
			this._BOPath = oEvent.getParameter("arguments").BOPath;
			var oView = this.getView();
			var that = this;
			var oTranslationModel = this.getView().getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();

			oView.bindElement({
				path: "/" + this._BOPath,
				parameters: {
					expand: "ZAT_VCMM_BOHEADER_TO_BOITEM"
				},
				model: "GE",
				events: {
					change: function (oEventChange) {
						// No data for the binding
						var oCtx = oView.getBindingContext("GE");
						if (!oCtx) {
							MessageBox.error(oBundle.getText("NotFound"), {
								title: oBundle.getText("Error"),
								styleClass: "sapUiSizeCompact",
								onClose: function (oAction) {
									that.handleClose();
								}
							});
						} else {
							that.verificarModeEdit();
						}
					},
					dataRequested: function (oData) {
						sap.ui.core.BusyIndicator.show();
						//oView.setBusy(true);
					},
					dataReceived: function (oData) {
						sap.ui.core.BusyIndicator.hide();
						//oView.setBusy(false);
					}
				}
			});
		},
		verificarModeEdit: function () {
			var oCtx = this.getView().getBindingContext("GE");
			if (oCtx) {
				//Para exibir opção para salvar
				if (oCtx.bCreated) {
					this.enableEditNewMode(true);

				} else {
					this.enableEditExistMode(true);
				}
			}

		},
		enableEditNewMode: function (vEdit) {
			var oView = this.getView();

			//Chave de acesso NFE
			var oInputChvnfe = oView.byId("InputNfeKeyId");
			oInputChvnfe.setEditable(vEdit);

			//Buscar NF-e
			var oButtonScan = oView.byId("ButtonScanId");
			oButtonScan.setVisible(true);

			this._enabledEdiCommons(vEdit);
		},
		enableEditExistMode: function (vEdit) {
			var oView = this.getView();

			this._enabledEdiCommons(vEdit);

			//Buscar NF-e
			var oButtonScan = oView.byId("ButtonScanId");
			oButtonScan.setVisible(false);

			//Chave de acesso NFE
			var oInputChvnfe = oView.byId("InputNfeKeyId");
			oInputChvnfe.setEditable(false);
		},
		_enabledEdiCommons: function (vEdit) {
			var oView = this.getView();

			//Inserir item
			var oBtnAddItem = oView.byId("btnAddItem");
			var oBtnAddItemGeneric = oView.byId("btnAddItemGneric");
			if (oView.byId("InputNfeKeyId").getValue() !== "") {
				oBtnAddItem.setEnabled(vEdit);
				oBtnAddItemGeneric.setEnabled(vEdit);
			} else {
				oBtnAddItem.setEnabled(false);
				oBtnAddItemGeneric.setEnabled(false);
			}
		},

		handleFullScreen: function () {
			this.oModel = this.getOwnerComponent().getModel("FlexibleColumn");
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.oRouter.navTo("detail", {
				layout: sNextLayout,
				BOPath: this._BOPath
			});
		},

		handleExitFullScreen: function () {
			var sNextLayout = this.getOwnerComponent().getModel("FlexibleColumn").getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
			this.oRouter.navTo("detail", {
				layout: sNextLayout,
				BOPath: this._BOPath
			});
		},
		_verificarSairSave: function (fnFunction) {
			let oView = this.getView();
			let oModel = oView.getModel("GE");
			let oTranslationModel = this.getView().getModel("i18n");
			let oBundle = oTranslationModel.getResourceBundle();
			let that = this;
			if (oModel && oModel.hasPendingChanges()) {

				var dialog = new Dialog({
					title: oBundle.getText("PopSairSave"),
					type: "Message",
					content: new Text({
						text: oBundle.getText("PopSairSaveText")
					}),
					beginButton: new Button({
						text: oBundle.getText("PopSairSaveBtnConfirm"),
						icon: "sap-icon://accept",
						type: "Accept",
						press: function () {
							if (oModel) {
								oModel.resetChanges();
								//oModel.refresh();
							}
							fnFunction();
							dialog.close();
						}
					}),
					endButton: new Button({
						text: oBundle.getText("PopSairSaveBtnCancel"),
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
			} else {
				fnFunction();
			}
		},

		handleClose: function () {
			var that = this;
			this._verificarSairSave(function () {
				that._closeFlexColumn();
			});
		},
		_closeFlexColumn: function () {
			var oCtx = this.getView().getBindingContext("GE");
			if (oCtx && oCtx.getModel()) {
				oCtx.getModel().resetChanges();
				//oCtx.getModel().refresh();
			}
			var sNextLayout = this.getOwnerComponent().getModel("FlexibleColumn").getProperty("/actionButtonsInfo/midColumn/closeColumn");
			this.oRouter.navTo("master", {
				layout: sNextLayout
			});
		},
		onPressScan: function (oEvent) {
			var that = this;
			BarcodeScanner.scan(
				function (mResult) {
					that.handleScan(mResult.text);
				},
				function (Error) {
					MessageBox.error("Scanning failed: " + Error);
				}
			);
		},

		handleScan: function (ScanValue) {
			this.byId("InputNfeKeyId").setValue(ScanValue);
			if (ScanValue !== "") {
				this.byId("InputNfeKeyId").fireEvent("submit");
			}
		},

		onChaveNfeInputSubmit: function (oEvent) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();

			var vBarCode = oEvent.getParameter("value");
			if (vBarCode === undefined) {
				vBarCode = this.byId("InputNfeKeyId").getValue();
			}

			var vChvNfe = this._getChvnfeByBarcode(vBarCode);

			if (vChvNfe && vChvNfe.length === 44) {
				this.readNFByChv(vChvNfe);
			} else {
				MessageBox.error(oBundle.getText("error_BarCod_Invalid"), {
					title: oBundle.getText("error"),
					styleClass: "sapUiSizeCompact"
				});
				this.getView().byId("InputNfeKeyId").setValueState("Error");
			}
		},

		_getChvnfeByBarcode: function (vBarCode) {
			var vChvNfe = "";
			if (vBarCode.length === 184) { // etiqueta
				vChvNfe = vBarCode.substring(0, 44);
			} else if (vBarCode.length === 44) { //chave de acess
				vChvNfe = vBarCode;
			}
			return vChvNfe;
		},

		readNfe: function (vChvNfe) {
			var that = this;
			var oView = this.getView();
			var oModel = oView.getModel("GE");

			var oTranslationModel = that.getView().getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();

			//oModel.attachRequestSent(this._onAttachRequest);
			//oModel.attachRequestCompleted(this._onAttachRequestCompleted);

			var aFilter = [];
			var sFilter = {};

			if (vChvNfe) {
				// Monta Filtro
				sFilter = new sap.ui.model.Filter({
					path: "Chvnfe",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: vChvNfe
				});
				aFilter.push(sFilter);
			}

			//Faz Requisição ao backend
			oModel.read("/ZET_VCMM_NFHEADERSet", {
				filters: aFilter,
				success: function (oData, response) {
					var oResults = oData.results;
					if (oResults.length === 0) {

						var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
						MessageBox.warning(oBundle.getText("backend_read_nodata"), {
							styleClass: bCompact ? "sapUiSizeCompact" : ""
						});
						oView.byId("InputNfeKeyId").setEditable(true);
						oView.byId("InputNfeKeyId").setValueState("Error");
						oView.byId("btnAddItem").setEnabled(false);
						oView.byId("btnAddItemGneric").setEnabled(false);
					} else {
						for (let oResult of oResults) {
							that._updateNfHeaderFromResult(oResult, that);
							break;
						}
						oView.byId("InputNfeKeyId").setEditable(false);
						oView.byId("InputNfeKeyId").setValueState("None");
						oView.byId("btnAddItem").setEnabled(true);
						oView.byId("btnAddItemGneric").setEnabled(true);

						MessageToast.show(oBundle.getText("success_nfe_ok"), {
							duration: 3000,
							width: "30em",
							closeOnBrowserNavigation: false // default
						});
					}
				},
				error: function (oData, response) {
					//that._onAttachRequestCompleted();

					if (oData !== undefined && oData.responseText !== undefined) {
						var vMsgErro = "";
						try {
							var responseParser = JSON.parse(oData.responseText);
							var errorDetails = responseParser.error.innererror.errordetails;
							if (errorDetails.length > 1) {
								vMsgErro = errorDetails[0].message;
							} else {
								vMsgErro = responseParser.error.message.value;
							}
						} catch (err) {
							vMsgErro = oData.responseText;
						}
						MessageBox.error(vMsgErro, {
							title: oBundle.getText("Error"),
							styleClass: "sapUiSizeCompact"
						});
					} else {
						MessageBox.error(oBundle.getText("backend_read_error"));
					}
				}
			});
		},

		onListItemPress: function (oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext("GE"),
				oNextUIState;
			if (oBindingContext) {
				var vBOPath = oBindingContext.getPath();
				vBOPath = vBOPath.split("/").slice(-1).pop();

				this.getOwnerComponent().getHelper().then(function (oHelper) {
					oNextUIState = oHelper.getNextUIState(3);
					this.oRouter.navTo("detailDetail", {
						layout: oNextUIState.layout,
						BOPathParent: this._BOPath,
						BOPath: vBOPath
					});
				}.bind(this));
			}
		},
		_updateNfHeaderFromResult: function (oResult, that) {
			var oCtx = that.getView().getBindingContext("GE");

			if (oCtx.bCreated) {
				var oModel = oCtx.getModel();
				oModel.setProperty(oCtx.getPath() + "/Bukrs", oResult.bukrs);
				oModel.setProperty(oCtx.getPath() + "/Werks", oResult.branch); //werks
				oModel.setProperty(oCtx.getPath() + "/Lifnr", oResult.fornecedor);
				oModel.setProperty(oCtx.getPath() + "/NomeLifnr", oResult.fornecedorNome.toString().substring(0, 30));
				oModel.setProperty(oCtx.getPath() + "/ChaveXmlNfe", oResult.Chvnfe);
				oModel.setProperty(oCtx.getPath() + "/Nfenum", oResult.nfenum);
				oModel.setProperty(oCtx.getPath() + "/Serie", oResult.series);
				oModel.setProperty(oCtx.getPath() + "/Docdat", oResult.docDat);
				oModel.setProperty(oCtx.getPath() + "/VlrTotalBrtNf", oResult.nfTot);

				oModel.updateBindings();
			}
		},
		onAddItemPressed: function (oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment(this.getView().getId(), "workspace.zcockpit_bo_v3.view.NFItemAdd", this);
				this.getView().addDependent(this._oDialog);
			}
			this._oDialog.setMultiSelect(false);

			this._oDialog.setRememberSelections(false);
			this._oDialog._updateSelection();

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);

			var vChavNFE = this.byId("InputNfeKeyId").getValue();
			if (vChavNFE && vChavNFE !== "") {
				var oTbTableLog = this.getView().byId("TableSelectDialogID");
				var oFilter = new sap.ui.model.Filter("Chvnfe", sap.ui.model.FilterOperator.EQ, vChavNFE);
				var oBinding = oTbTableLog.getBinding("items");
				oBinding.detachDataRequested(this._onAttachRequest);
				oBinding.detachDataReceived(this._onAttachRequestCompleted);
				oBinding.filter(oFilter);

				this._oDialog.open();

			}
		},

		handleSearchNFItem: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var aFilter = [];

			var vChavNFE = this.byId("InputNfeKeyId").getValue();
			aFilter.push(new Filter("Chvnfe", sap.ui.model.Filter.EQ, vChavNFE));

			if (sValue) {
				aFilter.push(new Filter("maktx", sap.ui.model.Filter.Contains, sValue));
			}
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(aFilter);
		},

		handleCloseNFItemFragment: function (oEvent) {
			var aCtxSelNfItem = oEvent.getParameter("selectedContexts");
			if (aCtxSelNfItem && aCtxSelNfItem.length) {
				var oPropertyNF = aCtxSelNfItem[0].getObject();

				var oCtxHdr = this.getView().getBindingContext("GE");
				var vNumeroBo, vNfeNum, vSeries;
				if (!oCtxHdr.bCreated) {
					vNumeroBo = oCtxHdr.getProperty(oCtxHdr.getPath() + "/NumeroBo");
					vNfeNum = oCtxHdr.getProperty(oCtxHdr.getPath() + "/Nfenum");
					vSeries = oCtxHdr.getProperty(oCtxHdr.getPath() + "/Serie");
				}

				//forçar para update o parent
				var oDate = new Date();
				oCtxHdr.getModel().setProperty(oCtxHdr.getPath() + "/Chadat", oDate);

				var aBoItem = oCtxHdr.getProperty(oCtxHdr.getPath() + "/ZAT_VCMM_BOHEADER_TO_BOITEM");
				if (!aBoItem) {
					aBoItem = [];
					oCtxHdr.getModel().setProperty(oCtxHdr.getPath() + "/ZAT_VCMM_BOHEADER_TO_BOITEM", aBoItem);
				}

				var oModel = this.getOwnerComponent().getModel("GE");

				var oContextNew = oModel.createEntry("ZET_VCMM_BOITEMSet");
				var oModelNew = oContextNew.getModel();
				var vPathNew = oContextNew.getPath();
				oModelNew.setProperty(vPathNew + "/Ebeln", oPropertyNF.ebeln);
				oModelNew.setProperty(vPathNew + "/Ebelp", oPropertyNF.ebelp);
				oModelNew.setProperty(vPathNew + "/Itmnum", oPropertyNF.Itmnum);
				oModelNew.setProperty(vPathNew + "/Maktx", oPropertyNF.maktx);
				oModelNew.setProperty(vPathNew + "/Matnr", oPropertyNF.matnr);
				oModelNew.setProperty(vPathNew + "/Nfnum", oPropertyNF.nfenum);
				oModelNew.setProperty(vPathNew + "/VlrTotal", oPropertyNF.nfnet);
				oModelNew.setProperty(vPathNew + "/QuantidadeBo", oPropertyNF.menge);
				oModelNew.setProperty(vPathNew + "/Meins", oPropertyNF.meins);
				oModelNew.setProperty(vPathNew + "/TpItem", "00"); //Referente ao item da NF
				oModelNew.setProperty(vPathNew + "/TpItemTxt", "Referente ao item da NF");

				oModelNew.setProperty(vPathNew + "/NumeroBo", vNumeroBo);
				oModelNew.setProperty(vPathNew + "/Nfnum", vNfeNum);
				oModelNew.setProperty(vPathNew + "/Series", vSeries);

				//Por ser editado cada item, não é necessário
				var vItemBo = cItemAdd + (aBoItem.length + 1);
				oModelNew.setProperty(vPathNew + "/ItemBo", vItemBo.toString());

				//add path
				vPathNew = vPathNew.split("/").slice(-1).pop();
				aBoItem.push(vPathNew);

				oCtxHdr.getModel().updateBindings();

				//ir para detalhes
				var oNextUIState;
				this.getOwnerComponent().getHelper().then(function (oHelper) {
					oNextUIState = oHelper.getNextUIState(3);
					this.oRouter.navTo("detailDetail", {
						layout: oNextUIState.layout,
						BOPathParent: this._BOPath,
						BOPath: vPathNew
					});
				}.bind(this));

			}
		},

		onAddItemGenericPressed: function (oEvent) {
			var that = this;
			var oTranslationModel = this.getView().getModel("i18n");
			var oBundle = oTranslationModel.getResourceBundle();
			var dialog = new Dialog({
				title: oBundle.getText("PopCriarGnc"),
				type: "Message",
				content: new Text({
					text: oBundle.getText("PopCriarGncText")
				}),
				beginButton: new Button({
					text: oBundle.getText("PopCriarGncBtnConfirm"),
					icon: "sap-icon://accept",
					type: "Accept",
					press: function () {
						that._criarItemGeneric();
						dialog.close();
					}
				}),
				endButton: new Button({
					text: oBundle.getText("PopCriarGncBtnCancel"),
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

		_criarItemGeneric: function () {
			var oCtxHdr = this.getView().getBindingContext("GE");
			var vNumeroBo, vNfeNum, vSeries;
			if (!oCtxHdr.bCreated) {
				vNumeroBo = oCtxHdr.getProperty(oCtxHdr.getPath() + "/NumeroBo");
				vNfeNum = oCtxHdr.getProperty(oCtxHdr.getPath() + "/Nfenum");
				vSeries = oCtxHdr.getProperty(oCtxHdr.getPath() + "/Serie");
			}

			//forçar para update o parent
			var oDate = new Date();
			oCtxHdr.getModel().setProperty(oCtxHdr.getPath() + "/Chadat", oDate);
			//oCtxHdr.getModel().setProperty(oCtxHdr.getPath() + "/Chatim", oDate.getTime());

			var aBoItem = oCtxHdr.getProperty(oCtxHdr.getPath() + "/ZAT_VCMM_BOHEADER_TO_BOITEM");
			if (!aBoItem) {
				aBoItem = [];
				oCtxHdr.getModel().setProperty(oCtxHdr.getPath() + "/ZAT_VCMM_BOHEADER_TO_BOITEM", aBoItem);
			}

			var oModel = this.getOwnerComponent().getModel("GE");

			var oContextNew = oModel.createEntry("ZET_VCMM_BOITEMSet");
			var oModelNew = oContextNew.getModel();
			var vPathNew = oContextNew.getPath();
			oModelNew.setProperty(vPathNew + "/TpItem", "01"); //Item genérico
			oModelNew.setProperty(vPathNew + "/TpItemTxt", "Item avulso");
			oModelNew.setProperty(vPathNew + "/NumeroBo", vNumeroBo);
			oModelNew.setProperty(vPathNew + "/Nfnum", vNfeNum);
			oModelNew.setProperty(vPathNew + "/Series", vSeries);

			//Por ser editado cada item, não é necessário
			var vItemBo = cItemAdd + (aBoItem.length + 1);
			oModelNew.setProperty(vPathNew + "/ItemBo", vItemBo.toString());

			//add path
			vPathNew = vPathNew.split("/").slice(-1).pop();
			aBoItem.push(vPathNew);

			oCtxHdr.getModel().updateBindings();

			//ir para detalhes
			var oNextUIState;
			this.getOwnerComponent().getHelper().then(function (oHelper) {
				oNextUIState = oHelper.getNextUIState(3);
				this.oRouter.navTo("detailDetail", {
					layout: oNextUIState.layout,
					BOPathParent: this._BOPath,
					BOPath: vPathNew
				});
			}.bind(this));
		},

		onPressCancel: function (oEvent) {
			this.handleClose();
		},

		readNFByChv: function (vChvNfe) {
			var that = this;
			var oView = this.getView();
			var oModel = this.getView().getModel("GE");
			var vChvNfeL = vChvNfe;

			oModel.attachRequestSent(this._onAttachRequest);
			oModel.attachRequestCompleted(this._onAttachRequestCompleted);

			var aFilter = [];
			var sFilter = {};

			if (vChvNfe) {
				// Monta Filtro
				sFilter = new sap.ui.model.Filter({
					path: "ChaveXmlNfe",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: vChvNfe
				});
				aFilter.push(sFilter);
			}

			//Faz Requisição ao backend
			oModel.read("/ZET_VCMM_BOHEADERSet", {
				filters: aFilter,
				success: function (oData, response) {
					that._onAttachRequestCompleted();

					var oResults = oData.results;

					var oTranslationModel = oView.getModel("i18n");
					var oBundle = oTranslationModel.getResourceBundle();

					var vTemBO = false;
					for (let oResult of oResults) {
						vTemBO = true;
						var vNumeroBoOut = that.myFormatter.shiftLeadingZeros(oResult.NumeroBo);
						var sTextMessage = oBundle.getText("error_read_bo_created", [vNumeroBoOut]);
						MessageBox.warning(sTextMessage);
						that.getView().byId("InputNfeKeyId").setValue(null);

						break;
					}

					if (!vTemBO) {
						that.readNfe(vChvNfeL);
					}
				},
				error: function (oData, response) {
					that._onAttachRequestCompleted();
					var oTranslationModel = oView.getModel("i18n");
					var oBundle = oTranslationModel.getResourceBundle();

					if (oData !== undefined && oData.responseText !== undefined) {
						var vMsgErro = "";
						try {
							var responseParser = JSON.parse(oData.responseText);
							var errorDetails = responseParser.error.innererror.errordetails;
							if (errorDetails.length > 1) {
								vMsgErro = errorDetails[0].message;
							} else {
								vMsgErro = responseParser.error.message.value;
							}
						} catch (err) {
							vMsgErro = oData.responseText;
						}
						MessageBox.error(vMsgErro, {
							title: oBundle.getText("Error"),
							styleClass: "sapUiSizeCompact"
						});
					} else {
						MessageBox.error(oBundle.getText("backend_read_error"));
					}

				}
			});
		},
		_onAttachRequest: function () {
			sap.ui.core.BusyIndicator.show();
		},
		_onAttachRequestCompleted: function () {
			sap.ui.core.BusyIndicator.hide();
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf workspace.zcockpit_bo_v3.view.S1
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf workspace.zcockpit_bo_v3.view.S1
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf workspace.zcockpit_bo_v3.view.S1
		 */
		onExit: function () {
			//evitar erros no launchpad
			//this.oRouter.getRoute("detail").detachPatternMatched(this.handleRouteMatched, this);
		}

	});

});