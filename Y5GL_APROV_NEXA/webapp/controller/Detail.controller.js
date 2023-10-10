/*global history */
sap.ui.define([
	"Y5GL_APROV_NEXA/Y5GL_APROV_NEXA/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"Y5GL_APROV_NEXA/Y5GL_APROV_NEXA/model/formatter"
], function (BaseController, JSONModel, History, Filter, Sorter, FilterOperator, GroupHeaderListItem, Device, formatter) {
	"use strict";
	return BaseController.extend("Y5GL_APROV_NEXA.Y5GL_APROV_NEXA.controller.Detail", {
		formatter: formatter,
		onInit: function () {

			this.getRouter().getRoute("object").attachPatternMatched(this._onMasterMatched, this);

		},
		onSelectionChange: function (oEvent) {
			var oList = oEvent.getSource(),
				bSelected = oEvent.getParameter("selected");
			// skip navigation when deselecting an item in multi selection mode
			if (!(oList.getMode() === "MultiSelect" && !bSelected)) {
				// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
				this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
			}
		},
		_createViewModel: function () {
			return new JSONModel({
				isFilterBarVisible: false,
				filterBarLabel: "",
				delay: 0,
				title: this.getResourceBundle().getText("masterTitleCount", [0]),
				noDataText: this.getResourceBundle().getText("masterListNoDataText"),
				sortBy: "Pernr",
				groupBy: "None"
			});
		},
		_onMasterMatched: function (oItem) {

			var Pernr = oItem.getParameter("arguments").Pernr;
			var Tipo = "X";

			if (Pernr !== "") {
				var oFilterPernr = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, Pernr);
				var oFilterTipo = new sap.ui.model.Filter("Tipo", sap.ui.model.FilterOperator.EQ, Tipo);
				
				var oList = this.getView().byId("list");
				oList.getBinding("items").filter([oFilterPernr, oFilterTipo]);

			}
			//Set the layout property of the FCL control to 'OneColumn'
			//this.getModel("appView").setProperty("/layout", "OneColumn");
		},

		FormatStatus: function (value) {
			if (value === "Em Programação") {
				return "Warning";
			}
			if (value === "Homologado") {
				return "Success";
			}
			if (value === "Em Aberto") {
				return "Error";
			}
			if (value === "Em aprovação") {
				return "Warning";
			} else {
				return "Success";
			}
		},

		onVoltar: function (oEvent) {
			this.getRouter().navTo("master");
		},

		onVoltarM: function (oEvent) {

			var bReplace = !Device.system.phone;
			var Texto = "master";

			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");

			this.getRouter().navTo(Texto, {
				Texto: Texto
			}, bReplace);
		},

		_showDetail: function (oItem) {
			var bReplace = !Device.system.phone;
			var Texto = "DetalheFerias";
			var Texto2 = "DetalheFeriasBr";
			var Index = oItem.getBindingContext().getProperty("Index");
			var Pernr = oItem.getBindingContext().getProperty("Pernr");
			var Endda = oItem.getBindingContext().getProperty("Endda");
			var Begda = oItem.getBindingContext().getProperty("Begda");
			var Molga = oItem.getBindingContext().getProperty("Molga");
		
			if (Molga === "PE") {
				if (Texto !== "" && Index !== "" && Pernr !== "" && Endda !== "" && Begda !== "") {

					this.getRouter().navTo(Texto, {
						Index: Index,
						Pernr: Pernr,
						Endda: Endda,
						Begda: Begda
					}, bReplace);

					this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
				} else {
					sap.m.MessageBox.error("Não foi possivel determinar rota.");
					return;
				}

			}

			if (Molga === "37") {
				if (Texto !== "" && Index !== "" && Pernr !== "" && Endda !== "" && Begda !== "") {

					this.getRouter().navTo(Texto2, {
						Index: Index,
						Pernr: Pernr,
						Endda: Endda,
						Begda: Begda
					}, bReplace);

					this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
				} else {
					sap.m.MessageBox.error("Não foi possivel determinar rota.");
					return;
				}

			}
		},
		onAdd: function () {
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getRouter().navTo("Add");
		},
		/**
		 *@memberOf Y5GL_APROV_NEXA.Y5GL_APROV_NEXA.controller.Master
		 */
		 formatterIcon: function (e) {
			var sRootPath = jQuery.sap.getModulePath("Y5GL_APROV_NEXA.Y5GL_APROV_NEXA");
			var sImagePath = sRootPath + "/Icones/";
			var icone;
			icone = sImagePath + "FERIAS.png";
			return icone;
		}
	});
});