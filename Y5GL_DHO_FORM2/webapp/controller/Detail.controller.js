/*global location */
sap.ui.define([
	"Y5GL_DHO_FORM2/Y5GL_DHO_FORM2/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"Y5GL_DHO_FORM2/Y5GL_DHO_FORM2/model/formatter",
	"sap/ui/Device"
], function (BaseController, JSONModel, formatter, Device) {
	"use strict";

	var hard_subty = "";

	return BaseController.extend("Y5GL_DHO_FORM2.Y5GL_DHO_FORM2.controller.Detail", {

		formatter: formatter,
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "detailView");

			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},

		_onMetadataLoaded: function () {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("detailView");

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		},

		_onObjectMatched: function (oEvent) {
			var Infty = oEvent.getParameter("arguments").Infty;
			var Subty = oEvent.getParameter("arguments").Subty;
			hard_subty = Subty;

			var oList = this.getView().byId("list");
			var oFilterInfty = new sap.ui.model.Filter("Infty", sap.ui.model.FilterOperator.EQ, Infty);
			var oFilterSubty = new sap.ui.model.Filter("Subty", sap.ui.model.FilterOperator.EQ, Subty);

			oList.getBinding("items").filter([oFilterInfty, oFilterSubty]);
		},

		formatIconList: function (oValue) {
			var sRootPath = jQuery.sap.getModulePath("Y5GL_DHO_FORM2.Y5GL_DHO_FORM2");
			var sImagePath = sRootPath + "/Icone/";
			var icone;

			if (oValue === "AUXÍLIO CRECHE") {
				icone = sImagePath + "AUXILIO_CRECHE.png";
				return icone;
			}
			if (oValue === "FARMACIA") {
				icone = sImagePath + "FARMACIA.png";
				return icone;
			}
			if (oValue === "FUNSEJEM") {
				icone = sImagePath + "ADIANTAMENTO_15.png";
				return icone;
			}
			if (oValue === "PLANO MEDICO") {
				icone = sImagePath + "PLANO_MEDICO.png";
				return icone;
			}
			if (oValue === "PLANO ODONTOLOGICO") {
				icone = sImagePath + "ODONTO.png";
				return icone;
			}
			if (oValue === "SEGURO DE VIDA") {
				icone = sImagePath + "SEGURO_VIDA.png";
				return icone;
			}
			if (oValue === "TRANSPORTE") {
				icone = sImagePath + "TRANSPORTE.png";
				return icone;
			}
			if (oValue === "PREVIDENCIA PRIVADA") {
				icone = sImagePath + "PREVIDENCIA.png";
				return icone;
			}
			if (oValue === "PREV PRIV BAS") {
				icone = sImagePath + "ADIANTAMENTO_15.png";
				return icone;
			}
			if (oValue === "PREV PRIV ESP") {
				icone = sImagePath + "ADIANTAMENTO_15.png";
				return icone;
			}
			if (oValue === "PREV PRIV NOR") {
				icone = sImagePath + "ADIANTAMENTO_15.png";
				return icone;
			}
			if (oValue === "PREV PRIV SUP") {
				icone = sImagePath + "ADIANTAMENTO_15.png";
				return icone;
			}
			if (oValue === "CESTA BASICA") {
				icone = sImagePath + "CESTA_BASICA.png";
				return icone;
			}
			if (oValue === "REEMBOLSO ESTACIONAM") {
				icone = sImagePath + "ESTACIONAMENTO.png";
				return icone;
			}
			if (oValue === "REEMBOLSO EDUCAÇÃO") {
				icone = sImagePath + "REEMBOLSO_EDUCACAO.png";
				return icone;
			}

			if (oValue === "COOPERATIVA") {
				icone = sImagePath + "PREVIDENCIA.png";
				return icone;
			}

			if (oValue === "MATERIAL ESCOLAR") {
				icone = sImagePath + "REEMBOLSO_EDUCACAO.png";
				return icone;
			}

			if (oValue === "REEMBOLSO_MEDICAM") {
				icone = sImagePath + "FARMACIA.png";
				return icone;
			}
			
			if (oValue === "EMP_CONSIGNADO") {
				icone = sImagePath + "ADIANTAMENTO_15.png";
				return icone;
			}
			return " ";
		},

		onSelectionChange: function (oEvent) {
			// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
			this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
		},

		_showDetail: function (oItem) {
			var bReplace = !Device.system.phone;
			var Infty = oItem.getBindingContext().getProperty("Infty");
			var Subty = oItem.getBindingContext().getProperty("Subty");

			this.getRouter().navTo("Detalhe", {
				Infty: Infty,
				Subty: Subty
			}, bReplace);
		},

		formatName: function (oValue) {
			var retorno;

			if (oValue === "EMP_CONSIGNADO") {
				retorno = "EMPRESTIMO CONSIGNADO";
			}

			if (oValue === "REEMBOLSO_MEDICAM") {
				retorno = "REEMBOLSO MEDICAMENTO";
			}

			if (!retorno) {
				retorno = oValue;
			}

			return retorno;

		}
	});

});