sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"ClocoEmailSetup/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("ClocoEmailSetup.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			if(sap.ui.Device.system.phone)
				this.getRouter()._oRoutes.monitor._oConfig.target[0] = "MonitorMobile";
			
			// We need to add the below one line code to initialize and enable the hash (#) based routing
			// enable hash based routing
			this.getRouter().initialize();
		}
	});

});