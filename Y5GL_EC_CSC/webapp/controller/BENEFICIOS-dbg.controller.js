sap.ui.define([
	"Y5GL_EC_CSC/Y5GL_EC_CSC/controller/BaseController",
	"sap/ui/Device"
], function (BaseController, Device) {
	"use strict";

	return BaseController.extend("Y5GL_EC_CSC.Y5GL_EC_CSC.controller.BENEFICIOS", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Y5GL_EC_CSC.Y5GL_EC_CSC.view.BENEFICIOS
		 */
		onInit: function () {
			this.getRouter().getRoute("BENEFICIOS").attachPatternMatched(this._onRefreshList, this);
		},

		_onRefreshList: function () {
			var lista = this.getView().byId("list");
			var Listb = lista.getBinding("items");

			Listb.refresh(true);

		},

		formatTextEStatus: function (oValue) {
			if (oValue === "A") {
				return "Em Aprovação";
			}
			return " ";
		},

		formatHighLight: function (oValue) {
			if (oValue === "A") {
				return "Success";
			}
			return "Information";
		},

		formatStateEStatus: function (oValue) {
			if (oValue === "A") {
				return "Success";
			}
			return "None";
		},

		onSelectionChange: function (oEvent) {
			var bReplace = !Device.system.phone;
			var Zdesc = "BENEFICIOS_DETAIL";
			var Parameter = oEvent.getParameters("listItem").listItem;
			if (Parameter !== undefined) {
				var ZdescNew = oEvent.getParameters("listItem").listItem.getBindingContext().getProperty("Zdesc");
				var zParam = oEvent.getParameters("listItem").listItem.getBindingContext().getProperty("Zparam");

				this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
				this.getRouter().navTo(Zdesc, {
					Zparam: zParam,
					Zdesc: ZdescNew
				}, bReplace);
			}

		},
		
		formatIconList: function (oValue) {
			if (oValue === "ALIMENTACAO") {
				return "sap-icon://retail-store";
			}
			if (oValue === "AUXILIO_CRECHE") {
				return "sap-icon://family-care";
			}
			if (oValue === "COOPERATIVA") {
				return "sap-icon://collaborate";
			}
			if (oValue === "EMP_CONSIGINADO") {
				return "sap-icon://capital-projects";
			}
			if (oValue === "FARMACIA") {
				return "sap-icon://pharmacy";
			}
			if (oValue === "FUNSEJEM") {
				return "sap-icon://building";
			}
			if (oValue === "GREMIO_CLUBE") {
				return "sap-icon://chalkboard";
			}
			if (oValue === "PLANO_MEDICO") {
				return "sap-icon://stethoscope";
			}
			if (oValue === "PLANO_ODONTOLOGICO") {
				return "sap-icon://doctor";
			}
			if (oValue === "PLANO_DENT_2") {
				return "sap-icon://doctor";
			}
			if (oValue === "REEMBOLSO_SUBSIDIO") {
				return "sap-icon://collections-insight";
			}
			if (oValue === "SEGURO_DE_VIDA") {
				return "sap-icon://insurance-life";
			}
			if (oValue === "VALE_TRANSPORTE") {
				return "sap-icon://bus-public-transport";
			}
			if (oValue === "REFEITORIO") {
				return "sap-icon://meal";
			}
			if (oValue === "PREVIDENCIA_PRIVADA") {
				return "sap-icon://lead-outdated";
			}
			if (oValue === "PREV_PRIV_BAS") {
				return "sap-icon://lead-outdated";
			}
			if (oValue === "PREV_PRIV_ESP") {
				return "sap-icon://lead-outdated";
			}
			if (oValue === "PREV_PRIV_NOR") {
				return "sap-icon://lead-outdated";
			}
			if (oValue === "PREV_PRIV_SUP") {
				return "sap-icon://lead-outdated";
			}
			if (oValue === "CESTA_BASICA") {
				return "sap-icon://nutrition-activity";
			}
			if (oValue === "OTICA") {
				return "sap-icon://show";
			}
			return " ";
		},

		onBackMaster: function () {
			this.getRouter().navTo("master");
		}

	});

});