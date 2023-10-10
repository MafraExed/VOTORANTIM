sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"../model/nfHeaderModel",
	"../model/nfHeaderListModel",
	"../model/formatter",
	"sap/ui/core/UIComponent",
	"sap/m/MessageToast"
], function (BaseController, MessageBox, Utilities, History, NFHeaderModel, NFHeaderListModel, formatter, UIComponent, MessageToast) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.operadorLogisticoCons.controller.NFdetail", {
		formatter: formatter,
		handleRouteMatched: function (oEvent) {
			var sAppId = "App5c06d9238147af3ab5537f2a";

			var oParams = {};
			this._oData = oEvent.getParameter("data"); //store the data
			if (oEvent.getParameter("data").chvNfe) {
				var oView = this.getView();
				var vPath = "NFHEADER>/ZET_VCMM_NFHEADERSet('" + oEvent.getParameter("data").chvNfe + "')";
				oView.bindElement({
					path: vPath,

				});

				let oColumn = this.getView().byId("idMultiQtd");
				oColumn.setHeaderSpan([5, 1]);

				oColumn = this.getView().byId("idMultiDescrPedido");
				oColumn.setHeaderSpan([4, 1]);

				oColumn = this.getView().byId("idMultiMaterial");
				oColumn.setHeaderSpan([2, 1]);

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function (oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype") {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};

					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);
				}
			}

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				//this.getView().bindObject(oPath);
			}

		},
		_onNavBack: function (oEvent) {

			let oView = this.getView();

			var vView = Utilities.getInitialViewFromParameters(oView);

			if (vView) {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(oView);
				oRouter.navTo(vView, true);
			} else {
				window.history.go(-1);
			}

		},
		_onLoadSuccess: function (oView, oModel, oModelItem) {
			//oView.setModel(oModel, "NFHEADER");
			//oView.setModel(oModelItem, "NFITEMLIST");
		},

		_onFioriObjectPageHeaderPress: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			var oQueryParams = this.getQueryParameters(window.location);

			if (sPreviousHash !== undefined || oQueryParams.navBackToLaunchpad) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("default", true);
			}

		},

		getInstanceNfHeaderList: function () {
			this._nFheaderList = NFHeaderListModel.getInstance();
		},
		getQueryParameters: function (oLocation) {
			var oQuery = {};
			var aParams = oLocation.search.substring(1).split("&");
			for (var i = 0; i < aParams.length; i++) {
				var aPair = aParams[i].split("=");
				oQuery[aPair[0]] = decodeURIComponent(aPair[1]);
			}
			return oQuery;

		},
		_onFioriObjectPageHeaderContactPress: function (oEvent) {

			var oPopover;
			var oSource = oEvent.getSource();
			var oBindingContext = oSource.getBindingContext();
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			this.getOwnerComponent().runAsOwner(function () {
				oPopover = oSource.getDependents()[0];
				oPopover.setPlacement("Auto");
			});

			return new Promise(function (fnResolve) {
				oPopover.attachEventOnce("afterOpen", null, fnResolve);
				oPopover.openBy(oSource);
				if (sPath) {
					oPopover.bindElement(sPath);
				}
			}).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onPressCancel: function (oEvent) {

			let oView = this.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();
			let that = this;
			let oContext = oEvent.getSource().getBindingContext("NFHEADER");

			MessageBox.show(
				oBundle.getText("MessageQuestionCancelNFe"), {
					icon: MessageBox.Icon.INFORMATION,
					title: oBundle.getText("TitleCancelNFe"),
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: function (oAction) {
						if (oAction === "YES") {
							that._cancelNFe(that, oContext);
						} else {
							MessageToast.show(oBundle.getText("messageCanceledByUser"));
						}
					}
				}
			);

		},
		_cancelNFe: function (oThat, oContext) {

			let oModel = oContext.getModel("NFHEADER");
			let oView = oThat.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();

			let oControl = oThat.byId("ObjectPageLayout");
			oControl.setBusy(true);

			oModel.setProperty(oContext.getPath() + "/statusNfe", "96");
			//"gpIDUpdNFHeader
			let mParameters = {
				//groupId: "gpIDUpdNFHeader",
				success: (oData, oResp) => {
					if (oData) {
						// Verifica se tivemos erro na execução
						// Verifica se tivemos erro na execução
						if (oData.__batchResponses[0].response) {
							oModel.resetChanges();
							let responseText = oData.__batchResponses[0].response.body;
							let responseParser = JSON.parse(responseText);
							if (responseParser.error.innererror) {
								MessageBox.error(responseParser.error.innererror.errordetails[0].message, {
									styleClass: "sapUiSizeCompact"
								});
							} else {
								MessageBox.error(responseParser.error.message.value, {
									styleClass: "sapUiSizeCompact"
								});
							}
						} else {

							// Sucesso
							oControl.setBusy(false);
							MessageToast.show(oBundle.getText("messageNfeInactiveSuccess"));
							oThat._onNavBack();
						}
					}
					oControl.setBusy(false);
				},
				error: (oData, oResp) => {

					if (oData !== undefined) {
						let responseText = oData.responseText;
						let responseParser = JSON.parse(responseText);
						MessageBox.error(responseParser.error.message.value, {
							title: oBundle.getText("errorTitle"),
							styleClass: "sapUiSizeCompact"
						});
					} else {

						MessageBox.success(oBundle.getText("ErrorCommunication"), {
							styleClass: "sapUiSizeCompact"
						});
					}
					oControl.setBusy(false);
				}
			};
			//oModel.setDeferredGroups(["gpIDUpdNFHeader"]);
			if (oModel.hasPendingChanges()) {
				oModel.submitChanges(mParameters);
			} else {
				oControl.setBusy(false);
			}
		},
		_onPressActive: function (oEvent) {

			let oView = this.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();
			let that = this;
			let oContext = oEvent.getSource().getBindingContext("NFHEADER");

			// Só é possível ativar uma NF-e inativa - statusNfe === 96
			if (oContext.getProperty("statusNfe") !== "96") {
				MessageBox.error(oBundle.getText("erroInvalidStatusActiveNfe"), {
					title: oBundle.getText("errorTitle"),
					styleClass: "sapUiSizeCompact"
				});
				return;
			}

			MessageBox.show(
				oBundle.getText("MessageQuestionActiveNFe"), {
					icon: MessageBox.Icon.INFORMATION,
					title: oBundle.getText("TitleActiveNFe"),
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: function (oAction) {
						if (oAction === "YES") {
							that._activeNFe(that, oContext);
						} else {
							MessageToast.show(oBundle.getText("messageCanceledByUser"));
						}
					}
				}
			);
		},

		_activeNFe: function (oThat, oContext) {

			let oModel = oContext.getModel("NFHEADER");
			let oControl = oThat.byId("ObjectPageLayout");
			oControl.setBusy(true);

			//"gpIDUpdNFHeader
			let mParameters = {
				groupId: "gpIDUpdNFHeader",
				success: (oData, oResp) => {
					oThat._handlerSuccess(oThat,oData,oResp);
				},
				error: (oData, oResp) => {
					oThat._handlerError(oThat,oData,oResp);
				}
			};

			let oNfHeader = {};
			oModel.setDeferredGroups(["gpIDUpdNFHeader"]);
			oNfHeader.chvnfe = oContext.getProperty("Chvnfe");
			oModel.callFunction("/ativarNfe", {
				method: "POST", // http method
				urlParameters: oNfHeader,
				groupId: "gpIDUpdNFHeader"
			}); // function import pa

			oModel.submitChanges(mParameters);

		},

		_handlerSuccess: function (oThat, oData, oResp) {
			let oView = oThat.getView();
			let oModel = oView.getModel("NFHEADER");
			let oBundle = oView.getModel("i18n").getResourceBundle();
			let oControl = oThat.byId("ObjectPageLayout");

			if (oData) {
				// Verifica se tivemos erro na execução
				if (oData.__batchResponses[0].response) {
					oModel.resetChanges();
					let responseText = oData.__batchResponses[0].response.body;
					let responseParser = JSON.parse(responseText);
					if (responseParser.error.innererror) {
						MessageBox.error(responseParser.error.innererror.errordetails[0].message, {
							styleClass: "sapUiSizeCompact"
						});
					} else {
						MessageBox.error(responseParser.error.message.value, {
							styleClass: "sapUiSizeCompact"
						});
					}
				} else {

					// Sucesso
					oControl.setBusy(false);
					oModel.refresh(true);
					MessageToast.show(oBundle.getText("messageNfeInactiveSuccess"));
					oThat._onNavBack();
				}
			}
			oControl.setBusy(false);
		},

		_handlerError: function (oThat, oData, oResp) {

			let oView = oThat.getView();
			let oBundle = oView.getModel("i18n").getResourceBundle();
			let oControl = oThat.byId("ObjectPageLayout");

			if (oData !== undefined) {
				let responseText = oData.responseText;
				let responseParser = JSON.parse(responseText);
				MessageBox.error(responseParser.error.message.value, {
					title: oBundle.getText("errorTitle"),
					styleClass: "sapUiSizeCompact"
				});
			} else {

				MessageBox.success(oBundle.getText("ErrorCommunication"), {
					styleClass: "sapUiSizeCompact"
				});
			}
			oControl.setBusy(false);
		},

		_onPressUpdateIntNFe: function (oEvent) {
			
			let oView = this.getView();	
			let oModel = oView.getModel("NFHEADER");
			let oControl = this.byId("ObjectPageLayout");
			let oContext = oEvent.getSource().getBindingContext("NFHEADER");
			let sGroupId = "gpIDUpdNFHeader";
			let that = this;
			
			oControl.setBusy(true);
			
			//"gpIDUpdNFHeader
			let mParameters = {
				groupId: sGroupId ,
				success: (oData, oResp) => {
					that._handlerSuccess(that,oData,oResp);
				},
				error: (oData, oResp) => {
					that._handlerError(that,oData,oResp);
				}
			};

			let oNfHeader = {};
			oModel.setDeferredGroups([sGroupId]);
			oNfHeader.chvnfe = oContext.getProperty("Chvnfe");
			oModel.callFunction("/atualizarDadosIntNfe", {
				method: "POST", // http method
				urlParameters: oNfHeader,
				groupId: sGroupId
			}); // function import pa

			oModel.submitChanges(mParameters);
		},

		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("NFdetail").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
		},
		onExit: function () {

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			var aControls = [{
				"controlId": "Fiori_ObjectPage_ObjectPage_0-sections-Fiori_ObjectPage_Section-2-sectionContent-Fiori_ObjectPage_Table-1544114644361",
				"groups": ["items"]
			}];
			/* for (var i = 0; i < aControls.length; i++) {
				var oControl = this.getView().byId(aControls[i].controlId);
				for (var j = 0; j < aControls[i].groups.length; j++) {
					var sAggregationName = aControls[i].groups[j];
					var oBindingInfo = oControl.getBindingInfo(sAggregationName);
					var oTemplate = oBindingInfo.template;
					oTemplate.destroy();
				}
			} */

		}
	});
}, /* bExport= */ true);