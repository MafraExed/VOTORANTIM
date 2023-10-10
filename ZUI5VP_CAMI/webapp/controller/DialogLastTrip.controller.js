sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"FibriaStatusViagem/webServices/conections"
], function(Controller, conections) {
	"use strict";

	return Controller.extend("FibriaStatusViagem.controller.DialogLastTrip", {

		setRouter: function(oRouter) {
			this.oRouter = oRouter;
		},

		onInit: function() {
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("DialogLastTrip", "DialogClose", this._onButtonNoPress, this);
			this._oDialog = this.getView().getContent()[0];
		},

		_onButtonYesPress: function() {
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.publish("DialogLastTrip", "deleteTrip", "resetApp");
			var oDialog = this.getView().getContent()[0];
			oDialog.close();
		},

		_onButtonNoPress: function() {
			var oDialog = this.getView().getContent()[0];
			oDialog.close();
		},

		onExit: function() {
			this._oDialog.destroy();
		}

	});

});