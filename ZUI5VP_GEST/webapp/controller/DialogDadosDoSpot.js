sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"monitorPortocel/webServices/apiConnector"
], function(Controller, apiConnector) {
	"use strict";
	return Controller.extend("monitorPortocel.controller.DialogDadosDoSpot", {

		myParent: null,

		constructor: function(myParent) {
			this.myParent = myParent;
		},
		onDialogSpotDetailsOpen: function(oEvent){
			if(!sap.ui.Device.system.phone) {
                oEvent.getSource().getContent()[0].setProperty("direction", "Row");
            }
			
		},

		onCloseDialog: function(evt) {
			evt.getSource().getParent().close();
			evt.getSource().getParent().destroy();
		}

	});
});