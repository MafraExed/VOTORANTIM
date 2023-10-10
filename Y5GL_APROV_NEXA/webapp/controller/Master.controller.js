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

	var Tipo;

	return BaseController.extend("Y5GL_APROV_NEXA.Y5GL_APROV_NEXA.controller.Master", {
		formatter: formatter,
		onInit: function () {
			
			var view = this.getView();

			view.setModel(this.getOwnerComponent().getModel('CADASTRO'));
			
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
				isFilterBarVisible: true,
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
			
			var oModeltable = this.getView().byId("list").getModel();
            oModeltable.setSizeLimit("999999");
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
		
		onSelect: function () {
			var selected = this.getView().byId("Segment").getSelectedKey();

			if (selected === "Indiretos") {
				this.ExecutaFiltro("S");
			} else if (selected === "Diretos") {
				this.ExecutaFiltro("N");
			}
		},
		
		ExecutaFiltro: function (Indiretos) {
			var lista = this.getView().byId("list");
			var oFilterIndiretos = new sap.ui.model.Filter("Indiretos", sap.ui.model.FilterOperator.EQ, Indiretos);
			lista.getBinding("items").filter(oFilterIndiretos);
		},
		
		onAdd: function () {
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getRouter().navTo("Add");
		},
		
		formatterIcon: function (e) {
			var sRootPath = jQuery.sap.getModulePath("Y5GL_APROV_NEXA.Y5GL_APROV_NEXA");
			var sImagePath = sRootPath + "/Icones/";
			var icone;
			icone = sImagePath + "DEP_DETAIL.png";
			return icone;
		}
	});
});