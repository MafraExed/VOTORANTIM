/* global document */
sap.ui.define([
		"sap/ui/core/UIComponent",
		"sap/ui/Device",
		"Y5BC_CONF_CEGA/Y5BC_CONF_CEGA/model/models",
		"Y5BC_CONF_CEGA/Y5BC_CONF_CEGA/controller/ErrorHandler"
	], function (UIComponent, Device, models, ErrorHandler) {
		"use strict";

		return UIComponent.extend("Y5BC_CONF_CEGA.Y5BC_CONF_CEGA.Component", {

			metadata : {
				manifest: "json"
			},

			init : function () {
				// call the base component's init function
				UIComponent.prototype.init.apply(this, arguments);
				// initialize the error handler with the component
				// this._oErrorHandler = new ErrorHandler(this);
				this.setModel(models.createDeviceModel(), "device");
				this.setModel(models.createFLPModel(), "FLP");
				this.setModel(models.createAceiteModel(), "aceiteModel");
				
				this.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");
				

				// create the views based on the url/hash
				this.getRouter().initialize();
			},

			destroy : function () {
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

	}
);