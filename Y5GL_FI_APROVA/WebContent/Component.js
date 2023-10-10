sap.ui.define([ "sap/ui/core/UIComponent", 
				"sap/ui/Device", 
				"vsa/y5gl_fi_portal/view/ListSelector",
				"vsa/y5gl_fi_portal/view/ErrorHandler" ], function(UIComponent, Device, ListSelector, ErrorHandler) {
	"use strict";

	return UIComponent.extend("vsa.y5gl_fi_portal.Component", {

		metadata : {
			manifest : "json"
		},

		init : function() {
			
			this.oListSelector = new ListSelector();
			this._oErrorHandler = new ErrorHandler(this);

			// set the device model
			var oDeviceModel = new sap.ui.model.json.JSONModel(Device);
			
			oDeviceModel.setDefaultBindingMode("OneWay");
			
			this.setModel(oDeviceModel, "device");

			// call the base component's init function and create the App view
			UIComponent.prototype.init.apply(this, arguments);

			// create the views based on the url/hash
			this.getRouter().initialize();

		},
		
		destroy : function () {
			this.oListSelector.destroy();
			this._oErrorHandler.destroy();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		},
		
		getContentDensityClass : function() {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}

	});

});