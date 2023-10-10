sap.ui.define([ "sap/ui/core/UIComponent", 
				"sap/ui/Device", 
				"vsa/y5gl_22_delega/view/ErrorHandler" ], function(UIComponent, Device, ErrorHandler) {
	"use strict";

	return UIComponent.extend("vsa.y5gl_22_delega.Component", {

		metadata : {
			manifest : "json"
		},

		init : function() {
			
			this._oErrorHandler = new ErrorHandler(this);

			// set the device model
			var oDeviceModel = new sap.ui.model.json.JSONModel(Device);
			
			oDeviceModel.setDefaultBindingMode("OneWay");
			
			this.setModel(oDeviceModel, "device");

			// call the base component's init function and create the App view
			UIComponent.prototype.init.apply(this, arguments);

			// create the views based on the url/hash
			this.getRouter().initialize();

		}

	});

});