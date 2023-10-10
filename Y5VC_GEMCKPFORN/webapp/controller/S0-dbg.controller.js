sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	// "../model/nfHeaderModel",
	// "../model/nfHeaderListModel",
	"../model/formatter",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, MessageToast, JSONModel, Formatter, MessageBox, Filter, FilterOperator) {
	"use strict";
	const cService = "/ZET_VCMM_POITEMSet";

	return Controller.extend("Workspace.zcockpit_fornecedor.controller.S0", {
		formatter: Formatter,
		onInit: function () {

			this.readData();

			this.aKeys = [
				"Pedido"
			];
			this.oView = this.getView();
			this.oSelectPO = this.getSelect("s0Po");
			// this.oModel.setProperty("/Filter/text", "Filtered by None");
			// this.addSnappedLabel();
		},

		readData: function () {

			var oModel = this.getOwnerComponent().getModel("POITEMS");
			var mySelf = this;

			var oModelPoItems = new JSONModel();

			this.getView().byId("dynamicPageId").setBusy(true);
			//Faz Requisição ao backend
			oModel.read(cService, {
				success: function (oData, response) {

					var oResults = oData.results;
					if (oResults.length === 0) {

						var oTranslationModel = mySelf.getView().getModel("i18n");
						var oBundle = oTranslationModel.getResourceBundle();

						var bCompact = !!mySelf.getView().$().closest(".sapUiSizeCompact").length;
						MessageBox.error(oBundle.getText("backend_read_nodata"), {
							styleClass: bCompact ? "sapUiSizeCompact" : ""
						});

						mySelf.getView().byId("dynamicPageId").setBusy(false);

					} else {

						oModelPoItems.setData(oResults);
						// sap.ui.getCore().setModel(oModelPoItems);
						mySelf.getView().setModel(oModelPoItems, "POITEMSLOC");
						mySelf.getView().byId("dynamicPageId").setBusy(false);
						mySelf.getView().getModel("POITEMSLOC").updateBindings();
					}
				},
				error: function (oData, response) {

					if (oData !== undefined) {
						var oTranslationModel = mySelf.getView().getModel("i18n");
						var oBundle = oTranslationModel.getResourceBundle();

						var bCompact = !!mySelf.getView().$().closest(".sapUiSizeCompact").length;
						MessageBox.error(oBundle.getText("backend_read_error"), {
							styleClass: bCompact ? "sapUiSizeCompact" : ""
						});

						mySelf.getView().byId("dynamicPageId").setBusy(false);

					}
				}
			});
		},

		onSelectChange: function (oEvent) {
			var aCurrentFilterValues = [];

			// aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectPO));
			
			aCurrentFilterValues.push(oEvent.getParameter("newValue"));
			// aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectCategory));
			// aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectSupplierName));

			// build filter array
			var aFilter = [];
			// var sQuery = oEvent.getParameter("query");
			if (aCurrentFilterValues) {
				aFilter.push(new Filter("ebeln", FilterOperator.Contains, aCurrentFilterValues));
			}

			// filter binding
			var oList = this.getView().byId("idPoTable");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);

		},
		getSelectedItemText: function (oSelect) {
			return oSelect.getSelectedItem() ? oSelect.getSelectedItem().getKey() : "";
		},
		getSelect: function (sId) {
			return this.getView().byId(sId);
		},
		onResetFilter: function (oEvent) {
			var aCurrentFilterValues = [];

			this.getView().byId("s0Po").setValue("");

			// build filter array
			var aFilter = [];
			// var sQuery = oEvent.getParameter("query");
			if (aCurrentFilterValues) {
				aFilter.push(new Filter("ebeln", FilterOperator.Contains, aCurrentFilterValues));
			}

			// filter binding
			var oList = this.getView().byId("idPoTable");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},
		onSendPrint: function (oEvent) {

			var mySelf = this;
			var oContext = this.getView().byId("idPoTable").getSelectedContexts();
			var oModel = this.getView().getModel("POITEMS");

			oModel.setDeferredGroups(["BackendReturn"]);
			var mParameters = {
				groupId: "BackendReturn",
				success: function (odata, resp) {

					if (odata !== undefined) {
						var oTranslationModel = mySelf.getView().getModel("i18n");
						var oBundle = oTranslationModel.getResourceBundle();

						mySelf._oDataReturnAjust(mySelf);
						mySelf._PDF(mySelf);
						// mySelf._statusAcceptButtonConverter(mySelf);

						var bCompact = !!mySelf.getView().$().closest(".sapUiSizeCompact").length;
						MessageBox.success(oBundle.getText("update_success"), {
							styleClass: bCompact ? "sapUiSizeCompact" : ""
						});
						mySelf.getView().byId("dynamicPageId").setBusy(false);
					}
				},
				error: function (odata, resp) {

					if (odata !== undefined) {
						var oTranslationModel = mySelf.getView().getModel("i18n");
						var oBundle = oTranslationModel.getResourceBundle();

						var bCompact = !!mySelf.getView().$().closest(".sapUiSizeCompact").length;
						MessageBox.error(oBundle.getText("update_error"), {
							styleClass: bCompact ? "sapUiSizeCompact" : ""
						});

						// mySelf._oDataReturnAjust(mySelf, "E");
					}
				}
			};

			for (let oCtx of oContext) {

				var oEntry = {};

				oEntry.ebeln = oCtx.getProperty("ebeln");
				oEntry.ebelp = oCtx.getProperty("ebelp");
				oEntry.qtdEtq = oCtx.getProperty("qtdEtq");
				oEntry.qtdMat = oCtx.getProperty("qtdMat");

				oModel.update(cService + "(ebeln='" + oEntry.ebeln + "',ebelp='" + oEntry.ebelp + "')", oEntry, mParameters);
				this.getView().byId("dynamicPageId").setBusy(true);
			}

			oModel.submitChanges(mParameters);
		},
		_oDataReturnAjust: function (that) {

			var oContext = that.getView().byId("idPoTable").getSelectedContexts();

			var oModel = this.getView().getModel("POITEMSLOC");
			var oData = oModel.getData();

			for (let oCtx of oContext) {
				var oItem = oData.find(POITEMSLOC => POITEMSLOC.ebeln === oCtx.getProperty("ebeln") &&
					POITEMSLOC.ebelp === oCtx.getProperty("ebelp"));
				oItem.qtdEtqImp = "0000000000001";
				oModel.updateBindings();
			}
		},
		_PDF: function (that) {

			var oContext = that.getView().byId("idPoTable").getSelectedContexts();

			var vItens = "";
			for (let oCtx of oContext) {
				vItens = vItens.concat(oCtx.getProperty("ebeln"));
				vItens = vItens.concat("-", oCtx.getProperty("ebelp"), "-");
			}

			var string = that.getView().getModel("POITEMS").sServiceUrl +
				"/ZET_VCMM_FILESet(fileName='" + vItens + "',fileCategory='MAT',fileDescription='PO')/$value";
			// var oModel = that.getView().getModel("NFHEADER");
			// var mySelf = that;
			window.open(string);
		},
		onInputChangeEtq: function (oEvent) {
			// var oSelectedItem = oEvent.getParameter("listItem");
			var vNewValue = oEvent.getParameter("newValue");

			var oModel = oEvent.getSource()._getPropertiesToPropagate().oBindingContexts.POITEMSLOC.oModel;
			var vPath = oEvent.getSource()._getPropertiesToPropagate().oBindingContexts.POITEMSLOC.sPath;
			var oContext = oModel.getContext(vPath);
			var oData = oModel.getData();

			var oItem = oData.find(POITEMSLOC => POITEMSLOC.ebeln === oContext.getProperty("ebeln") &&
				POITEMSLOC.ebelp === oContext.getProperty("ebelp"));
			oItem.qtdEtq = vNewValue;
			oModel.updateBindings();

		},
		onInputChangeMat: function (oEvent) {
			var vNewValue = oEvent.getParameter("newValue");

			var oModel = oEvent.getSource()._getPropertiesToPropagate().oBindingContexts.POITEMSLOC.oModel;
			var vPath = oEvent.getSource()._getPropertiesToPropagate().oBindingContexts.POITEMSLOC.sPath;
			var oContext = oModel.getContext(vPath);
			var oData = oModel.getData();

			var oItem = oData.find(POITEMSLOC => POITEMSLOC.ebeln === oContext.getProperty("ebeln") &&
				POITEMSLOC.ebelp === oContext.getProperty("ebelp"));
			oItem.qtdMat = vNewValue;
			oModel.updateBindings();
		}
	});
});