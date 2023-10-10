sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"Charm/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("Charm.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			var oRouter = this.getRouter();
			if (oRouter) {
				if(!sap.ui.Device.system.phone){
			//		oRouter._oRoutes.Main._oConfig.target[0] = "MainDesk";
				}
				oRouter.initialize();
			}

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		}
	});

});