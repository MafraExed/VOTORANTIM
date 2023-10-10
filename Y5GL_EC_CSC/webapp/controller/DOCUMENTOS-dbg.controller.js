sap.ui.define([
	"Y5GL_EC_CSC/Y5GL_EC_CSC/controller/BaseController",
	"sap/ui/Device",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text",
	"sap/ui/model/Filter"

], function (BaseController, Device, Dialog, Button, Text, Filter) {
	"use strict";

	return BaseController.extend("Y5GL_EC_CSC.Y5GL_EC_CSC.controller.DOCUMENTOS", {
		onInit: function () {

		},

		onBackMaster: function () {
			this.getRouter().navTo("master");
		},

		onSelectionChange: function (oEvent) {
			var bReplace = !Device.system.phone;
			var Zdesc = "Documentos_Detail";
			var Parameter = oEvent.getParameters("listItem").listItem;
			if (Parameter !== undefined) {
				var Subty = oEvent.getParameters("listItem").listItem.getBindingContext().getProperty("Subty");
				var Stext = oEvent.getParameters("listItem").listItem.getBindingContext().getProperty("Stext");

				if (Stext === "PIS/PASEP") {
					Stext = "PIS PASEP";
				}

				this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
				this.getRouter().navTo(Zdesc, {
					Subty: Subty,
					Stext: Stext,
					Tipo: "V"
				}, bReplace);
			}
		},

		FormatStatus: function (oValue) {
			if (oValue === "Em ResoluÃ§Ã£o") {
				return "Aguardando aprovação";
			} else {
				return "";
			}
		},

		onAdd: function () {
			var that = this;
			var dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Confirma inclusão de um novo documento?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						// create value help dialog
						if (!that._valueHelpDialog1) {
							that._valueHelpDialog1 = sap.ui.xmlfragment("Y5GL_EC_CSC.Y5GL_EC_CSC.view.LocNascimento", that);
							that.getView().addDependent(that._valueHelpDialog1);
						}
						// open value help dialog filtered by the input value
						that._valueHelpDialog1.open();
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "N\xE3o",
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();
		},

		onConfirmDocumento: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			this._valueHelpDialog1 = null;

			if (oSelectedItem) {
				var Subty = oSelectedItem.getTitle();
				var Stext = oSelectedItem.getDescription();
				var Zdesc = "Documentos_Detail";
				var bReplace = !Device.system.phone;

				if (Stext === "PIS/PASEP") {
					Stext = "PIS PASEP";
				}

				this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
				this.getRouter().navTo(Zdesc, {
					Subty: Subty,
					Stext: Stext,
					Tipo: "N"
				}, bReplace);

			}
		}

	});

});