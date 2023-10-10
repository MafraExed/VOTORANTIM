/*global location */
sap.ui.define([
	"Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/model/formatter",
	"sap/ui/Device"
], function (BaseController, JSONModel, formatter, Device) {
	"use strict";

	var hard_subty = "";

	return BaseController.extend("Y5GL_DHO_FORM3.Y5GL_DHO_FORM3.controller.Detail", {

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
			var sRootPath = jQuery.sap.getModulePath("Y5GL_DHO_FORM3.Y5GL_DHO_FORM3");
			var sImagePath = sRootPath + "/Icone/";
			var icone;

			if (oValue === "EMP CONSIGNADO") {
				icone = sImagePath + "EMPRESTIMO.png";
				return icone;
			}

			if (oValue === "ESTAC MOVBUS") {
				icone = sImagePath + "ESTACIONAMENTO.png";
				return icone;
			}

			if (oValue === "LABORAL") {
				icone = sImagePath + "PPRRV.png";
				return icone;
			}

			if (oValue === "PASAJE") {
				icone = sImagePath + "TRANSPORTE.png";
				return icone;
			}

			if (oValue === "REEMBOLSO CURSOS") {
				icone = sImagePath + "FORMACAO.png";
				return icone;
			}

			if (oValue === "REEMBOLSO EXPATRIADO") {
				icone = sImagePath + "ADIANTAMENTO_15.png";
				return icone;
			}

			if (oValue === "REEMBOLSO IDIOMA") {
				icone = sImagePath + "FORMACAO.png";
				return icone;
			}

			if (oValue === "SEGURO DE VIDA") {
				icone = sImagePath + "SEGURO_VIDA.png";
				return icone;
			}

			if (oValue === "PLANO MEDICO") {
				icone = sImagePath + "PLANO_MEDICO.png";
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
			
			if (oValue === "EMP_CONSIGNADO"){
				retorno = "PRESTAMO";
			}
			
			if (oValue === "REEMBOLSO MEDICAM"){
				retorno = "REEMBOLSO MEDICAMENTO";
			}
			
			if (oValue === "STAC MOVBUS"){
				retorno = "ESTACIONAMIENTO MOVILIDAD BUS";
			}
			
			if (oValue === "LABORAL"){
				retorno = "Reembolso Laboral / Convenio Colectivo";
			}
			
			if (oValue === "PASAJE"){
				retorno = "Pasaje Universitario / Asignacion Escolar / Aguinaldo Navideño";
			}
			
			if (oValue === "PLANO MEDICO"){
				retorno = "Plan de Salud";
			}
			
			if (oValue === "SEGURO DE VIDA"){
				retorno = "Essalud Vida	";
			}
			
			if (oValue === "ADELANTO"){
				retorno = "Adelanto de Gratificación a Solicitud";
			}

			if (oValue === "ADELANTO_SUELDOS"){
				retorno = "Adelanto de Sueldos";
			}

			if (oValue === "ASIGNACION"){
				retorno = "Asignación por Fallecimiento";
			}

			if (oValue === "PASAJE_UNIVERSITARIO"){
				retorno = "Pasaje Universitario";
			}

			if (oValue === "ASIGNACION_ESCOLAR"){
				retorno = "Asignación Escolar";
			}

			if (oValue === "AGUINALDO_NAVIDENO"){
				retorno = "Aguinaldo Navideño";
			}

			if (!retorno){
				retorno = oValue;
			}
			
			return retorno;
		}
	});

});