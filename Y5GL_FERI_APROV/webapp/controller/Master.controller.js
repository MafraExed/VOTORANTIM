/*global history */
sap.ui.define([
	"Y5GL_FERI_APROV/Y5GL_FERI_APROV/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"Y5GL_FERI_APROV/Y5GL_FERI_APROV/model/formatter"
], function (BaseController, JSONModel, History, Filter, Sorter, FilterOperator, GroupHeaderListItem, Device, formatter) {
	"use strict";

	var Tipo;

	return BaseController.extend("Y5GL_FERI_APROV.Y5GL_FERI_APROV.controller.Master", {
		formatter: formatter,
		onInit: function () {

			this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
			this.getRouter().attachBypassed(this.onBypassed, this);
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
		_onMasterMatched: function () {

			//Set the layout property of the FCL control to 'OneColumn'
			this.getModel("appView").setProperty("/layout", "OneColumn");
		},

		onVoltar: function (oEvent) {
			this.getRouter().navTo("masterprime");
		},

		_showDetail: function (oItem) {

			var bReplace = !Device.system.phone;
			var Texto = "object";
			var Pernr = oItem.getBindingContext().getProperty("Pernr");

			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getRouter().navTo(Texto, {
				Pernr: Pernr
			}, bReplace);

		},
		
		onAdd: function () {
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getRouter().navTo("Add");
		},
		
		formatterIcon: function (e) {
			var sRootPath = jQuery.sap.getModulePath("Y5GL_FERI_APROV.Y5GL_FERI_APROV");
			var sImagePath = sRootPath + "/Icones/";
			var icone;
			icone = sImagePath + "DEP_DETAIL.png";
			return icone;
		}
	});
});