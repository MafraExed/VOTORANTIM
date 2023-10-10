sap.ui.define([
	"CADASTROAPROVADORES/CADASTROAPROVADOR/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	'sap/ui/model/Filter',
	"sap/ui/core/mvc/Controller",
	"CADASTROAPROVADORES/CADASTROAPROVADOR/model/formatter"
], function (BaseController,
	JSONModel,
	History,
	Filter,
	Controller,
	formatter) {
	"use strict";

	return BaseController.extend("CADASTROAPROVADORES.CADASTROAPROVADOR.controller.AddEkgrp", {
		formatter: formatter,

		onSave: function () {

			var oModel = this.getView().getModel();
			var key = "";
			var oParameters = {};
			var este = this;

			oParameters.Ekgrp = this.getView().byId("IdEkgrp").getValue();
			oParameters.Aprov = this.getView().byId("IdAprov").getValue();
			if (this.getView().byId("idEmail").getSelected() === true) {
				oParameters.EnvioEmail = "X";
			} else {
				oParameters.EnvioEmail = "";
			}
			if (!oParameters.Ekgrp || !oParameters.Aprov) {
				sap.m.MessageBox.show("Campos obrigatórios não podem estar em branco");
				return;
			}

			var oModel2 = new sap.ui.model.json.JSONModel();
			var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_APROVADORSet/$count?$filter=User eq '" + oParameters
				.Aprov + "'";

			oModel2.loadData(serviceUrl, null, false, "GET", false, false, null);
			var oInd = oModel2.getData();

			if (oInd !== 1) {
				sap.m.MessageToast.show("Aprovador inválido, não é possível gravar o registro");
				return;
			}

			key = "/ZET_CBMM_CF_EKGRPSet(Ekgrp='" + oParameters.Ekgrp + "')";

			oModel.update(key, oParameters, {
				success: function (oData, oResponse) {
					sap.m.MessageBox.success("Registro inserido com sucesso", {
						actions: ["OK", sap.m.MessageBox.Action.CLOSE],
						onClose: function (sAction) {
							este.getView().byId("IdEkgrp").setValue(null);
							este.getView().byId("IdAprov").setValue(null);
							este.getRouter().navTo("Back");
						}

					});

				},

				error: function (e) {
					sap.m.MessageBox.error("Não foi possível gravar registro no banco");
				}
			});

		},

		onBack: function () {

			this.getRouter().navTo("Back");
		},

		_onModelContextChangeEkgrp: function (oEvent) {
			var Parametro = "GRP COMPRAS";

			var sFilter = Parametro;
			var oFilter = oFilter = new sap.ui.model.Filter("Parametro", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		onHREkgrp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog1) {
				this._valueHelpDialog1 = sap.ui.xmlfragment("CADASTROAPROVADORES.CADASTROAPROVADOR.view.Ekgrp", this);
				this.getView().addDependent(this._valueHelpDialog1);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog1.open(sInputValue);
		},

		onHRAprov: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog2) {
				this._valueHelpDialog2 = sap.ui.xmlfragment("CADASTROAPROVADORES.CADASTROAPROVADOR.view.Aprov", this);
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

		_handleValueHelpEkgrp: function (oEvent) {

			var oFilter = new sap.ui.model.Filter("Parametro",
				sap.ui.model.FilterOperator.EQ, 'GRP COMPRAS');

			var sValue = oEvent.getParameter("value");
			var oFilter2 = new sap.ui.model.Filter("Valor",
				sap.ui.model.FilterOperator.Contains, sValue);

			oEvent.getSource().getBinding("items").filter([oFilter, oFilter2]);

		},

		_handleValueHelpAprovador: function (oEvent) {
			var sValue = oEvent.getParameter("value");

			if (!sValue) {
				sValue = " ";
			}

			var sFilter = sValue;

			var oFilter = oFilter = new sap.ui.model.Filter("User", sap.ui.model.FilterOperator.EQ, sFilter);
			oEvent.getSource().getBinding("items").filter([oFilter]);

			// var sValue = oEvent.getParameter("value");
			// var oFilter = new sap.ui.model.Filter("Aprovador",
			// 	sap.ui.model.FilterOperator.Contains, sValue);
			// oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		onValidAprov: function (oEvent) {

			var sValue = oEvent.getSource().getValue();
			var oModel = new sap.ui.model.json.JSONModel();
			var serviceUrl = "/sap/opu/odata/sap/ZGWCBMM_CONTRATACAO_FRETE_SRV/ZET_CBMM_CF_APROVADORSet/$count?$filter=User eq '" + sValue +
				"'";

			oModel.loadData(serviceUrl, null, false, "GET", false, false, null);
			var oInd = oModel.getData();

			if (oInd < 1) {
				sap.m.MessageToast.show("Aprovador inválido");
			}
		}
	});

});