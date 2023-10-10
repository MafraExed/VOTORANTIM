sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"zvpwfi0001_fi/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("zvpwfi0001_fi.Component", {

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
			
			this.getRouter().initialize();
		}
	});
});
