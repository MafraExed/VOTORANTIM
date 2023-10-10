/* =========================================================== */
/* Portal de Aprovações                                        */
/* Allan Roberto do Nascimento                                 */
/* =========================================================== */
sap.ui.define([
	'jquery.sap.global',
	'sap/m/MessageBox',
	'sap/ui/core/mvc/Controller',
	'zvpwmm0001_fs/model/formatter',
	'sap/ui/model/json/JSONModel'
], function (jQuery, MessageBox, Controller, formatter, JSONModel) {
	"use strict";
	return Controller.extend("zvpwmm0001_fs.controller.Default", {

		formatter: formatter,
		onInit: function () {
			//	this._oTable = this.byId("IdHeaderSet");
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
		onItemSelect: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var IdDocumento = oEvent.getSource().getBindingContext().getProperty("Documento");
			oRouter.navTo("page", {
				Documento: IdDocumento
			});

		},
		onDataReciver: function (oEvent) {

		},
		onBeforeRebindTable: function (oEvent) {

		},
		//	debugger;
		//	sap.ui.table.Table.prototype.onAfterRendering.apply(this, arguments);
		//if (sap.ui.comp.smarttable.SmartTable.prototype.onAfterRendering) {
		//	sap.ui.comp.smarttable.SmartTable.prototype.onAfterRendering.apply(this, arguments);
		//}

		//			var items = this.getItems();
		///for (var i = 0; i < items.length; i++) {
		//	var item = items[i];
		//	var obj = item.getBindingContext().getObject();
		//				var lv = obj.title.split("<$>");
		//	if (lv[1] === 'T') {
		//		item.$().find('.sapUiIcon').addClass('blueIcon');
		//	} else if (lv[1] === 'H') {
		//		item.$().find('.sapUiIcon').addClass('redIcon');
		//	} else if (lv[1] === 'VH') {
		//		item.$().find('.sapUiIcon').addClass('greenIcon');
		//	}

		//}

		// Shorthand (trinity) operator for the above if-statement
		//this.addStyleClass((this.getStatus() === 'CHECKED' )? 'checkedItem' : 'uncheckedItem');
		//	},
		onRefresh: function (oEvent) {
			var oSmartTable = this.byId("objectList");
			var oModelD = this.getView("default").getModel();
			var btnAprovDD = this.getView().byId('BtAprovarD');
			oSmartTable._oTable.removeSelections();
			btnAprovDD.setEnabled(false);
			oModelD.refresh(true);
		},

		_getSmartTable: function () {
			if (!this._oSmartTable) {
				this._oSmartTable = this.getView().byId("objectList");
			}
			return this._oSmartTable;
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
					var vBusyDialog = sap.ui.xmlfragment("zvpwmm0001_fs.fragment.BusyDialog", this);
					this.getView().addDependent(vBusyDialog);
				}

				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), vBusyDialog);
				vBusyDialog.open();
				//	var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZGWFBFS_PORTAL_SRV/");

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
						Ebeln: documentos
					});
				}
				oEntry.ToItem = ItemData;
				var oDataModel = this.getView("default").getModel();
				oDataModel.create("/FolhaServicos", oEntry, {
					success: function (oData, oResp) {
						// response header
						//debugger;
						//var hdrMessage = oResp.headers["sap-message"];
						//var hdrMessageObject = JSON.parse(hdrMessage);

						//if (oResp.statusCode === 201 || hdrMessageObject.code === 'MM/001') {
						setTimeout(function () {
							that._showMsgProcesso(oTitleDocsProcessMass, 2000);
							vBusyDialog.close();
							btnAprovDD.setEnabled(false);
							oSmartTable._oTable.removeSelections();
							oModelD.refresh();
						}, 5000);
						//	} else {
						//		vBusyDialog.close();
						//		oModelD.refresh();
						//	}
					},
					error: function (oError) {
						vBusyDialog.close();
						that._showMsgProcesso(oError.response.statusText, 2000);
					}
				});
			}
		},
		_showMsgProcesso: function (oTexto, oTime) {
			sap.m.MessageToast.show(oTexto, {
				duration: oTime, // default
				width: "15em", // default
				//	my: "default", // default center bottom
				//	at: "default", // default center bottom
				//	of: window, // default
				//	offset: "0 0", // default
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
		}
	});
});