sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessagePopover",
	"sap/m/MessageItem",
	"sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, MessagePopover, MessageItem, MessageBox) {
	"use strict";

	return Controller.extend("Y5CB_CONF_C_REP.Y5CB_CONF_C_REP.controller.Fornecimento", {

		handleMessagePopoverPress: function (oEvent) {
			this._getMessagePopover().openBy(oEvent.getSource());
		},
		_getMessagePopover: function () {
			if (!this._oMessagePopover) {
				this._oMessagePopover = sap.ui.xmlfragment(this.getView().getId(),
					"Y5CB_CONF_C_REP.Y5CB_CONF_C_REP.fragment.BatchProcessingReturn",
					this);
				this.getView().addDependent(this._oMessagePopover);
			}
			return this._oMessagePopover;

		},

		aReturn: {
			suc: [],
			err: []
		},

		_resetErrorCount: function () {

		},

		_bindView: function (oArguments) {

			var oModel = this.getView().getModel();
			var sKey = oModel.createKey("/ZET_CBMM_FORNECIMENTOCBSet", {
				Kunnr: oArguments.Kunnr,
				Nfnum: oArguments.Nfnum,
				Series: oArguments.Series,
				AvisoEntrega: oArguments.AvisoEntrega,
				Ebeln: oArguments.AvisoEntrega
			});

			this.getView().bindElement({
				path: sKey,
				parameters: {
					expand: "ToIT"
				}
			});
			this._resetTableFieldInputValues();
		},

		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this._handleRoutePatternMatched, this);
		},

		_clearReturnModel: function () {
			this.aReturn = {
				suc: [],
				err: []
			};
		},
		_handleRoutePatternMatched: function (oEvent) {
			if (oEvent.getParameter("name") !== "fornecimento") {
				return;
			}

			var oArguments = oEvent.getParameter("arguments");

			this._resetErrorCount(); //TODO

			this._clearReturnModel();

			this._bindView(oArguments);

		},

		onContagemCegaPress: function () {

			var oModel = this.getView().getModel();
			var aDeferredGroups = ["ContagemCegaId"];
			var este = this;

			oModel.setDeferredGroups(aDeferredGroups);
			var array = [];
			var oTable = this.byId("fornecimentoItemTable");
			var aItems = oTable.getItems();
			var obj;

			if (!this._isContagemCegaFormValid()) {
				return;
			}

			for (var i = 0; i < aItems.length; i++) {
				var oItem = aItems[i];
				var obj2 = {
					matnr: null,
					vol: null
				};

				obj = oModel.getObject(oItem.getBindingContextPath());
				var qtd = oItem.getCells()[4].getValue();
				var vol = parseFloat(oItem.getCells()[5].getValue());
				var usuario = sap.ushell.Container.getService("UserInfo").getId();

				obj2.matnr = obj.Matnr;
				obj2.vol = vol;
				array.push(obj2);
				este._array = array;

				oModel.callFunction("/ContagemCega", {
					method: "POST",
					urlParameters: {
						Cliente: obj.Kunnr,
						Matnr: obj.Matnr,
						Nfe: obj.Nfnum,
						Serie: obj.Series,
						Subitem: obj.Subit,
						Ebeln: obj.Ebeln,
						Ebelp: obj.Ebelp,
						Quantidade: qtd,
						Usuario: usuario,
						Volume: vol,
						CodAviso: obj.AvisoEntrega,
					},
					success: function (oData, response) {

						este.oModel.setData(null);
						este.oModel.updateBindings(true);
						este.oModel.setData({
							results: []
						});
						this._resetTableFieldInputValues();
						this.byId("ST_ConferenciaCega").getModel().refresh(true);
						this.byId("fornecimentoItemTable").getModel().refresh(true);
						for (var c = 0; c < este._array.length; c++) {
							este._impressao(este._array[c].matnr, este._array[c].vol);
						}

						MessageToast.show("Contagem realizada com sucesso.");
						try {
							this.aReturn.suc.push({
								text: JSON.parse(response.headers["sap-message"]).message
							});

						} catch (err) {
							MessageToast("erro");
						}
					}.bind(this),
					error: function (oError) {
						var oResponse = JSON.parse(oError.responseText);
						if (oResponse.hasOwnProperty("error")) {

							this.aReturn.err.push({
								text: oResponse.error.message.value
							});
						}

					}.bind(this),
					groupId: "ContagemCegaId"
				});

			}

			oModel.submitChanges({
				groupId: "ContagemCegaId",
				success: function (a, b) {
					oModel.refresh();

					if (this.aReturn.err.length <= 0) {

						this._resetTableFieldInputValues();

						if (this.aReturn.suc.length > 0) {
							MessageBox.error(this.aReturn.suc[0].text);
						}

						this._clearReturnModel();
					} else {
						MessageBox.error(this.aReturn.err[0].text);
						this._clearReturnModel();
					}
				}.bind(this),
				error: function (e) {
					oModel.refresh();
				}.bind(this)
			});
			this.oRouter.navTo("worklist", true);
		},

		_impressao: function (Matnr, vol) {
			var Item = "999999";
			var oModel2 = this.getOwnerComponent().getModel(),
				AvisoEntrega = this.getView().byId("IdAvisoEntrega").getText();
			//
			oModel2.callFunction("/ImprimirPorMaterial", {
				method: "POST",
				urlParameters: {
					Matnr: Matnr,
					Quantidade: vol,
					Name: this.getView().byId("imp").getSelectedItem().getKey(),
					AvisoEntrega: AvisoEntrega,
					Item: Item
				},
				success: function (oData, response) {

				}.bind(this),
				error: function (oError) {

				}
			});

		},

		_resetTableFieldInputValues: function () {
			var aItems = this.byId("fornecimentoItemTable").getItems();

			for (var i = 0; i < aItems.length; i++) {
				var oItem = aItems[i];
				oItem.getCells()[4].setValue("");
				oItem.getCells()[5].setValue("1");

			}
		},

		onRegistrarEMPress: function () {

			var oModel = this.getView().getModel();
			var obj = this.getView().getBindingContext().getObject();

			oModel.callFunction("/RegistrarEntrMerc", {
				method: "POST",
				urlParameters: {
					Kunnr: obj.Kunnr,
					Nfnum: obj.Nfnum,
					Series: obj.Series,
					AvisoEntrega: obj.AvisoEntrega,
					Ebeln: obj.AvisoEntrega

				},
				success: function (oData, response) {

					MessageToast.show("Entrada de mercadoria registrada com sucesso.");

				}.bind(this),
				error: function (oError) {
					var oResponse = JSON.parse(oError.responseText);
					if (oResponse.hasOwnProperty("error")) {

						MessageBox.error(oResponse.error.message.value);
					} else {
						MessageBox.error("Erro");
					}

				}.bind(this)
			});

		},

		_isContagemCegaFormValid: function () {

			var oTable = this.byId("fornecimentoItemTable");
			var aItems = oTable.getItems();
			var bValid = true;
			var qtd, vol;

			//TODO: substituir por constraints

			for (var i = 0; i < aItems.length; i++) {
				var oItem = aItems[i];

				qtd = oItem.getCells()[4].getValue();
				vol = oItem.getCells()[5].getValue();

				if (!oItem.getCells()[4].getEditable()) {

					qtd = 99;
				}

				if (qtd === "" || isNaN(vol) || vol === "0") {
					MessageToast.show("Erro: preencha todos os campos antes de realizar a contagem.");
					return false;
				}

			}

			return bValid;
		}

	});

});