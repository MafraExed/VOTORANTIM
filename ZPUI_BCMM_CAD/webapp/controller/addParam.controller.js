sap.ui.define([
	"CADASTROAPROVADORES/CADASTROAPROVADOR/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	'sap/ui/model/Filter',
	"CADASTROAPROVADORES/CADASTROAPROVADOR/model/formatter"
], function (BaseController,
	JSONModel,
	History,
	Filter,
	formatter) {
	"use strict";

	return BaseController.extend("CADASTROAPROVADORES.CADASTROAPROVADOR.controller.addParam", {

		onSave: function () {

			var oModel = this.getView().getModel();
			var key = "";
			var oParameters = {};
			var este = this;

			oParameters.Parametro = this.getView().byId("IdParametro").getValue();
			oParameters.Valor = this.getView().byId("IdValor").getValue();

			oParameters.Parametro = oParameters.Parametro.replace(/ /g, "%20");
			oParameters.Valor = oParameters.Valor.replace(/ /g, "%20");

			while (oParameters.Valor.indexOf("/") != -1) {
				oParameters.Valor = oParameters.Valor.replace("/", "%2F");
			}
			
			while (oParameters.Valor.indexOf("#") != -1) {
				oParameters.Valor = oParameters.Valor.replace("#", "%23");
			}
			
			while (oParameters.Valor.indexOf(":") != -1) {
				oParameters.Valor = oParameters.Valor.replace(":", "%3A");
			}
			
			// while (oParameters.Valor.indexOf(".") != -1) {
			// 	oParameters.Valor = oParameters.Valor.replace(".", "%2E");
			// }

			if (!oParameters.Parametro || !oParameters.Valor) {
				sap.m.MessageBox.show("Campos obrigatórios não podem estar em branco");
				return;
			}

			var oModel2 = new sap.ui.model.json.JSONModel();
			var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_PARAMETSet/$count?$filter=Parametro eq '" +
				oParameters.Parametro +
				"'";

			oModel2.loadData(serviceUrl, null, false, "GET", false, false, null);
			var oInd = oModel2.getData();

			if (oInd < 1) {
				sap.m.MessageToast.show("Parâmetro inválido");
				return;
			}

			key = "/ZET_CBMM_CF_PARAMETSet(Parametro='" + oParameters.Parametro + "',Valor='" + oParameters.Valor + "')";

			oModel.update(key, oParameters, {
				success: function (oData, oResponse) {
					sap.m.MessageBox.success("Parâmetro inserido", {
						actions: ["OK", sap.m.MessageBox.Action.CLOSE],
						onClose: function (sAction) {
							este.getView().byId("IdParametro").setValue(null);
							este.getView().byId("IdValor").setValue(null);
							este.getRouter().navTo("Back");
						}

					});
				},

				error: function (e) {
					sap.m.MessageBox.show("Erro ao gravar registro");
				}
			});
		},

		onBack: function () {

			this.getRouter().navTo("Back");
		},

		_onModelContextChangeParam: function (oEvent) {
			var Parametro = "HELPREQUEST";

			var sFilter = Parametro;
			var oFilter = oFilter = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		onHRParam: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog2) {
				this._valueHelpDialog2 = sap.ui.xmlfragment("CADASTROAPROVADORES.CADASTROAPROVADOR.view.Param", this);
				this.getView().addDependent(this._valueHelpDialog2);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog2.open(sInputValue);
		},

		_handleValueHelpClose: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");

			this._valueHelpDialog1 = null;
			this._valueHelpDialog4 = null;
			this._valueHelpDialog6 = null;

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);
			this.getView().byId(this.inputId).setValueState("None");
		},

		_handleValueHelpParam: function (oEvent) {
			var sValue = oEvent.getParameter("value");

			if (!sValue) {
				sValue = " ";
			}

			var sFilter = sValue;
			var oFilter1 = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.EQ, 'HELPREQUEST');
			var oFilter2 = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.Contains, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter1, oFilter2]);
		},

		onValidParam: function (oEvent) {

		}

	});

});