sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/Filter',
	'sap/ui/model/json/JSONModel',
	'zvpwsd0001_lp/model/formatter',
	'sap/m/MessageBox'
], function (jQuery, Controller, Filter, JSONModel, formatter, MessageBox) {
	"use strict";

	return Controller.extend("zvpwsd0001_lp.controller.Default", {
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

		onAfterRendering: function () {
			//Disabilita o Titulo do launchpad
			sap.ui.getCore().byId("shellAppTitle").setVisible(false);
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
		onItemSelect: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			var IdDocumento = oEvent.getSource().getBindingContext().getProperty("Documento");
			oRouter.navTo("page", {
				Documento: IdDocumento
			});

		},
		/*onSort: function() {
			var oSmartTable = this._getSmartTable();
			if (oSmartTable) {
				oSmartTable.openPersonalisationDialog("Sort");
			}
		},*/
		_getSmartTable: function () {
			if (!this._oSmartTable) {
				this._oSmartTable = this.getView().byId("objectList");
			}
			return this._oSmartTable;
		},

		onRefresh: function (oEvent) {
			var oSmartTable = this.byId("objectList");
			var oModelD = this.getView("default").getModel();
			var btnAprovDD = this.getView().byId('BtAprovarD');
			oSmartTable._oTable.removeSelections();
			btnAprovDD.setEnabled(false);
			oModelD.refresh();
		},
		onSearch: function (oEvt) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("Nome", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// update list binding
			var list = this.getView().byId("objectList");
			//var binding = list.getBinding("items");
			var binding = list._oTable.getBinding("items");
			binding.filter(aFilters, "Application");
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
		onApproveLote: function (oEvent) {
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
					var vBusyDialog = sap.ui.xmlfragment("zvpwsd0001_lp.fragment.BusyDialog", this);
					this.getView().addDependent(vBusyDialog);
				}

				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), vBusyDialog);
				vBusyDialog.open();
				var oEntry = {};
				//Header
				oEntry.Documento = '9999999999';
				//Itens

				var ItemData = [];
				for (var i = 0; i < rows.length; i++) {
					var str = rows[i].sPath,
						array = str.split("('");

					documentos = (array[1].substring(0, 10));

					ItemData.push({
						Dmkey: documentos
					});
				}
				oEntry.ToItem = ItemData;
				var oDataModel = this.getView("default").getModel();
				oDataModel.create("/ListaPrecos", oEntry, {
					success: function (oData, oResp) {
						setTimeout(function () {
							that._showMsgProcesso(oTitleDocsProcessMass, 2000);
							vBusyDialog.close();
							btnAprovDD.setEnabled(false);
							oSmartTable._oTable.removeSelections();
							oModelD.refresh();
						}, 5000);

					},
					error: function (oError) {
						vBusyDialog.close();
						that._showMsgProcesso(oError.statusText, 2000);
					}
				});
			}
		},
		onApprove: function (oEvent) {
			var oModelD = this.getView("default").getModel();
			var documentos = "";

			var oSmartTable = this.byId("objectList");
			var rows = oSmartTable._oTable.getSelectedContexts();
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var oTitleFavorSele = oResourceBundle.getText("TitleFavorSele");
			var oTitleAprovalMass = oResourceBundle.getText("TitleAprovalMass");
			var oTitleDocsProcessMass = oResourceBundle.getText("TitleDocsProcessMass");

			if (rows.length === 0) {
				sap.m.MessageToast.show(oTitleFavorSele, {
					duration: 3000, // default
					width: "15em", // default
					//	my: "default", // default center bottom
					//	at: "default", // default center bottom
					//	of: window, // default
					offset: "0 0", // default
					collision: "fit fit", // default
					onClose: null, // default
					autoClose: true, // default
					animationTimingFunction: "ease-in", // default
					animationDuration: 1000, // default
					closeOnBrowserNavigation: true // default
				});

			} else {

				var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZGWFBLP_PORTAL_SRV/");

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
						Documento: documentos

					});
					batchChanges.push(oModel.createBatchOperation("ListaPrecos", "POST", oEntry));
				}

				oModel.addBatchChangeOperations(batchChanges); //teste para ver se espera o processamento
				oModel.setUseBatch(true); //teste para ver se espera o processamento
				oModel.setRefreshAfterChange(true); //teste para ver se espera o processamento
				oModelD.setRefreshAfterChange(true);
				sap.m.MessageToast.show(oTitleAprovalMass, {
					duration: 5000, // default
					width: "15em", // default
					//	my: "default", // default center bottom
					//	at: "default", // default center bottom
					//		of: window, // default
					offset: "0 0", // default
					collision: "fit fit", // default
					onClose: null, // default
					autoClose: false, // default
					animationTimingFunction: "ease",
					animationDuration: 2000, // default
					closeOnBrowserNavigation: true // default
				});

				oModel.submitBatch(function (data) {
					sap.m.MessageToast.show(oTitleDocsProcessMass, {
						duration: 3000, // default
						width: "15em", // default
						//	my: "default", // default center bottom
						//at: "default", // default center bottom
						//		of: window, // default
						offset: "0 0", // default
						collision: "fit fit", // default
						onClose: null, // default
						autoClose: false, // default
						animationTimingFunction: "ease-in", // default
						animationDuration: 2000, // default
						closeOnBrowserNavigation: true // default
					});
					setTimeout(function () {
						oModelD.refresh();
					}, 5000);
				}, function (err) {
					//	alert("Problema no recebimento da aprovação, por favor, tente novamente! ");
				});

			}
		},
		_showMsgProcesso: function (oTexto, oTime) {
			sap.m.MessageToast.show(oTexto, {
				duration: oTime, // default
				width: "15em", // default
				my: "default", // default center bottom
				at: "default", // default center bottom
				offset: "0 0", // default
				collision: "fit fit", // default
				onClose: null, // default
				autoClose: false, // default
				animationTimingFunction: "ease-in", // default
				animationDuration: 2000, // default
				closeOnBrowserNavigation: true // default
			});
		},

	});
});