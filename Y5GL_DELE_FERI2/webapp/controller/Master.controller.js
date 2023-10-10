/*global history */
sap.ui.define([
	"Y5GL_DELE_FERI2/Y5GL_DELE_FERI2/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"Y5GL_DELE_FERI2/Y5GL_DELE_FERI2/model/formatter",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text"
], function (BaseController, JSONModel, History, Filter, Sorter, FilterOperator, GroupHeaderListItem, Device, formatter, Dialog, Button,
	Text) {
	"use strict";

	var Tipo;

	return BaseController.extend("Y5GL_DELE_FERI2.Y5GL_DELE_FERI2.controller.Master", {
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

		onDelega: function () {
			var bReplace = !Device.system.phone;
			var Texto = "DelegaTodos";
			var Pernr = "X";

			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getRouter().navTo(Texto, {
				Pernr: Pernr
			}, bReplace);
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
			var Texto = "Delegacao";
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
			var sRootPath = jQuery.sap.getModulePath("Y5GL_DELE_FERI2.Y5GL_DELE_FERI2");
			var sImagePath = sRootPath + "/Icones/";
			var icone;
			icone = sImagePath + "DEP_DETAIL.png";
			return icone;
		},
		
		onRevert: function(){
			var colaborador = "999";
			var gestor = "999";
			var dtInicio = "XXXX";
			var dtFim = "XXXX";
			var key = "/ZET_DELEG_FERIASSet(GestorDeleg='" + gestor + "',Empregado='" + colaborador + "')";
			var oEntry = {};
			var oModel = this.getView().getModel();
			var that = this;

			oEntry.DtInicio = dtInicio;
			oEntry.DtFim = dtFim;

			var dialog = new Dialog({
				title: "Confirmación",
				type: "Message",
				content: new Text({
					text: "¿Confirmar la revocación de la delegación de vacaciones?"
				}),
				beginButton: new Button({
					text: "Sí",
					press: function () {
						oModel.update(key, oEntry, {
							success: function (oData, oResponse) {

								sap.m.MessageBox.success(
									"Revocación de la delegación realizada", {
										actions: ["OK"],
										onClose: function (sAction) {
											that.getView().getModel().refresh(true);
										}
									});
							},
							error: function (oError) {
								var erro = oError;
								erro = erro.responseText;
								var erro2 = JSON.parse(erro);
								var messagem = erro2.error.message.value;
								sap.m.MessageBox.error(messagem, {
									actions: ["OK"],
									onClose: function (sAction) {
									}
								});
								return;
							}
						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "No",
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();

		}
	});
});