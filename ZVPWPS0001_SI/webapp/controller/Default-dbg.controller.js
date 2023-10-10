/* =========================================================== */
/* Portal de Aprovações                                        */
/* Allan Roberto do Nascimento                                 */
/* =========================================================== */
sap.ui.define([
	'sap/m/MessageBox',
	'sap/ui/core/mvc/Controller',
	'portal/zvpwps0001_si/model/formatter',
	'sap/ui/model/Filter',
	'sap/ui/model/Sorter',
	'sap/ui/core/Fragment',
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/ui/model/json/JSONModel',
	'sap/ui/unified/DateRange'
], function (MessageBox, Controller, formatter, Filter, Sorter, Fragment, Dialog, Button, JSONModel, DateRange) {
	"use strict";
	return Controller.extend("portal.zvpwps0001_si.controller.Default", {
		formatter: formatter,
		onInit: function () {
			var that = this;
			var oModelAdm = this.getOwnerComponent().getModel();
			var oViewAdm = new JSONModel({
				isAdm: false,
				isApro: true
			});
			this.getView().setModel(oViewAdm, "Administrador");
			oViewAdm = this.getModel("Administrador");
			var sServiceUrl1 = "/sap/opu/odata/sap/ZGWFBGL_ADM_PORTAL_UTIL_SRV/";
			oModelAdm = new sap.ui.model.odata.ODataModel(sServiceUrl1, true);
			oModelAdm.read("/Administradors", {
				success: function (oData) {
					if (oData.results.length) {
						if (oData.results[0].ButtonAdm === false) {
							oViewAdm.oData.isAdm = false;
							oViewAdm.oData.isApro = true;
						} else if (oData.results[0].ButtonAdm === true) {
							oViewAdm.oData.isAdm = true;
							oViewAdm.oData.isApro = false;

							that.getUserAdm();
						}
						oViewAdm.refresh(true);
					}
				}
			});
		},

		onAfterRendering: function () {
			//Disabilita o Titulo do launchpad
			sap.ui.getCore().byId("shellAppTitle").setVisible(false);
		},
		getUserAdm: function (oEvent) {
			var oModel = this.getOwnerComponent().getModel();
			oModel.setSizeLimit(999);
			var oViewModel = new JSONModel({
				Usuarios: []
			});
			this.getView().setModel(oViewModel, "Substituto");
			oViewModel.setSizeLimit(999);
			oViewModel = this.getModel("Substituto");
			var sServiceUrl = "/sap/opu/odata/sap/ZGWFBGL_ADM_PORTAL_UTIL_SRV/";
			oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
			oModel.read("/Usuarios", {
				success: function (oData) {
					if (oData.results.length) {
						oViewModel.setProperty("/Usuarios", oData.results);
						oViewModel.refresh(true);
					}
				}
			});
		},
		getModel: function (name) {
			return this.getView().getModel(name) || this.getOwnerComponent().getModel(name);
		},
		onSort: function (oEvent) {
			this.fnApplyFiltersAndOrdering();
		},
		fnApplyFiltersAndOrdering: function (oEvent) {
			var aFilters = [];
			var valueC = this.getView().byId("IdSubstituto").getSelectedKey();
			aFilters.push(new sap.ui.model.Filter("IUser", "EQ", valueC));
			this.byId("IdHeaderSet").getBinding("items").filter(aFilters);
		},

		onDataReceived: function (oData) {
			/*	var itemCount = oData.getParameters().getParameter('data')['results'].length;
				if (oData && itemCount === 0) {
					var msg1 = oData.getSource().getModel().oMessageParser;
					if (msg1._lastMessages[0].code === "E01/000") {
						this.handleConfirmationMessageBoxPress(msg1._lastMessages[0].message);
					}
				} */
		},

		handleCloseButton: function (oEvent) {
			this._oPopover.close();
		},
		onCloseDialog: function (oEvent) {
			this._oDialog.close();
		},

		onItemSelect: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var IdDocumento = oEvent.getSource().getBindingContext().getProperty("Numprocesso");
			oRouter.navTo("page", {
				Numprocesso: IdDocumento
			});

		},
		onRefresh: function (oEvent) {
			var oSmartTable = this.byId("objectList");
			var oModelD = this.getView("default").getModel();
			var btnAprovDD = this.getView().byId('BtAprovarD');
			oSmartTable._oTable.removeSelections();
			btnAprovDD.setEnabled(false);
			oModelD.refresh();

		},
		onGeneratedRowSelectionChange: function (oEvent) {
			var oSmartTable = this.byId("objectList");
			var rows = oSmartTable._oTable.getSelectedContexts();
			if (rows.length > 0) {
				this.getView().byId('BtAprovarD').setEnabled(true);
			} else {
				this.getView().byId('BtAprovarD').setEnabled(false);
			}
		},

		handleSelectionChange: function (oEvent) {
			//	var IdDate = sap.ui.core.Fragment.byId("IdFrag", "TextError");
			//	IdDate.setText("");
			//IdDate.setState("");
		},

		onApprove: function (oEvent) {
			var that = this;
			var oModelD = this.getView("default").getModel();
			var documentos = "";
			var oSmartTable = this.byId("objectList");
			var btnAprovDD = this.getView().byId('BtAprovarD');
			var rows = oSmartTable._oTable.getSelectedContexts();
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var oTitleDocsProcessMass = oResourceBundle.getText("TitleDocsProcessMass");
			var oTitleError = oResourceBundle.getText("TitleError");
			var oTitleFavorSele = oResourceBundle.getText("TitleFavorSele");
			if (rows.length === 0) {
				that._showMsgProcesso(oTitleFavorSele, 2000);
			} else {

				if (!this._dialog) {
					var vBusyDialog = sap.ui.xmlfragment("portal.zvpwps0001_si.fragment.BusyDialog", this);
					this.getView().addDependent(vBusyDialog);
				}

				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), vBusyDialog);
				vBusyDialog.open();
				var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZGWFBSISB_PORTAL_SRV/");

				oModel.setHeaders({
					"Content-Type": "multipart/mixed; multipart/mixed; boundary=changeset"
				});

				var batchChanges = [];

				var oEntry = {};
				for (var i = 0; i < rows.length; i++) {
					var str = rows[i].sPath,
						array = str.split("('");
					documentos = (array[1].substring(0, 10));
					oEntry = ({
						Numprocesso: documentos
					});
					batchChanges.push(oModel.createBatchOperation("Sisbs", "POST", oEntry));
				}

				oModel.addBatchChangeOperations(batchChanges);
				oModel.setUseBatch(true);
				oModel.setRefreshAfterChange(true);
				oModelD.setRefreshAfterChange(true);

				oModel.submitBatch(function (oData, oResp) {
						for (var i = 0; i < oData.__batchResponses.length; i++) {

							var oResponse = oData.__batchResponses[i].response;
							if (typeof oResponse !== "undefined" && oResponse.statusCode !== "200") {
								vBusyDialog.close();
								that._showTextInfo(oResponse.body, oResponse.statusText);
							}
						}

						if (typeof oResponse === "undefined" && oResp.statusCode === 202) {

							setTimeout(function () {
								that._showMsgProcesso(oTitleDocsProcessMass, 2000);
								vBusyDialog.close();
								btnAprovDD.setEnabled(false);
								oSmartTable._oTable.removeSelections();
								oModelD.refresh();
							}, 4000);
						}
					},
					function (err) {

						vBusyDialog.close();
						that._showMsgProcesso(err.response.statusText, 2000);
					});

			}
		},

		_showMsgProcesso: function (oTexto, oTime) {
			sap.m.MessageToast.show(oTexto, {
				duration: oTime, // default
				width: "15em", // default
				my: "default", // default center bottom
				at: "default", // default center bottom
				//of: window, // default
				offset: "0 0", // default
				collision: "fit fit", // default
				onClose: null, // default
				autoClose: false, // default
				animationTimingFunction: "ease-in", // default
				animationDuration: 2000, // default
				closeOnBrowserNavigation: true // default
			});
		},
		_showTextInfo: function (oResponse, oStatus) {
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.show("Information", {
				icon: MessageBox.Icon.INFORMATION,
				title: oStatus,
				actions: [MessageBox.Action.OK],
				id: "messageBoxId1",
				details: oResponse,
				styleClass: bCompact ? "sapUiSizeCompact" : "",
				contentWidth: "100px"
			});
		},
		handleConfirmationMessageBoxPress: function (oMessage) {

			MessageBox.warning(
				oMessage, {
					actions: ["Anular", sap.m.MessageBox.Action.CANCEL],
					//styleClass: this._oComponent.getContentDensityClass(),
					onClose: function (oAction) {

						if (oAction == "Anular") {
							var that = this;
							var lv_set = ("Sisbs('999999999')");
							var sServiceUrl = "/sap/opu/odata/sap/ZGWFBSISB_PORTAL_SRV/";
							var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
							var oEntry = {};
							oEntry.Numprocesso = "CANCEL_SUBS";
							var batchChanges = [];
							batchChanges.push(oModel.createBatchOperation(lv_set, "PUT", oEntry));
							oModel.addBatchChangeOperations(batchChanges);
							oModel.submitBatch(function (data) {
								that.onRefresh();
							}, function (err) {
								sap.m.MessageBox.show(err, {});
							});

						} else {

						}
					}.bind(this)
				}
			);
		},
	});
});