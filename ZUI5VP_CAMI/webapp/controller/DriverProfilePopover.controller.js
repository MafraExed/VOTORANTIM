sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"FibriaStatusViagem/webServices/conections"
], function(BaseController, MessageBox, Utilities, History, conections) {
	"use strict";

	return BaseController.extend("FibriaStatusViagem.controller.DriverProfilePopover", {
		driverInfo: {},
		setRouter: function(oRouter) {
			this.oRouter = oRouter;

		},
		getBindingParameters: function() {
			return {};

		},
		_onClosePopoverButtonPress: function(){
			this.closePopover();
		},
		closePopover: function(){
			var oPopover = this.getView().getContent()[0];
			oPopover.close();
		},
		setDriverInfo: function(sChanel, sEvent, oData){
			this.driverInfo = oData;
			var oJSON = new sap.ui.model.json.JSONModel();
			oJSON.setData(this.driverInfo);
			this.getView().setModel(oJSON, 'driverInfo');
		},
		onInit: function() {
			sap.ui.getCore().setModel(this, "driverPopover");
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("DriverProfilePopover", "setDriverInfo", this.setDriverInfo, this);	
			this._oDialog = this.getView().getContent()[0];

		},
		onExit: function() {
			this._oDialog.destroy();

		}
	});
}, /* bExport= */ true);