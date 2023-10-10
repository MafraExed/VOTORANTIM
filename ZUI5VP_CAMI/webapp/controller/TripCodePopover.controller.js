sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, History) {
	"use strict";

	return BaseController.extend("FibriaStatusViagem.controller.TripCodePopover", {
		setRouter: function(oRouter) {
			this.oRouter = oRouter;

		},
		getBindingParameters: function() {
			return {};

		},
		_onClosePopoverButtonPress: function(){
			this.closePopover();
		},
		_onConfirmCodeButtonPress: function() {
			this.closePopover();
			
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.publish("DialogSelectTrip", "TripSelected", "teste");

		},
		closePopover: function(){
			var oPopover = this.getView().getContent()[0];
			oPopover.close();
		},
		onInit: function() {

			this._oDialog = this.getView().getContent()[0];

		},
		onExit: function() {
			this._oDialog.destroy();

		}
	});
}, /* bExport= */ true);