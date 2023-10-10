sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/sap/build/standard/operadorLogisticoCons/model/models",
	"./model/errorHandling"
], function (UIComponent, Device, models, errorHandling) {
	"use strict";

	var navigationWithContext = {
		"NFDocSet": {
			"Page2": ""
		}
	};

	return UIComponent.extend("com.sap.build.standard.operadorLogisticoCons.Component", {

		metadata: {
			manifest: "json",
			config: { fullWidth: true }
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			// set the FLP model
			this.setModel(models.createFLPModel(), "FLP");

			// set application model
			var oApplicationModel = new sap.ui.model.json.JSONModel({});
			this.setModel(oApplicationModel, "applicationModel");

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// delegate error handling
			//errorHandling.register(this);

			// create the views based on the url/hash
			this.getRouter().initialize();

			var oComponentData = this.getComponentData();
			var oStartupParameters = oComponentData.startupParameters;
			var oRouter = this.getRouter();
			//oRouter.navTo("Page1", {}, true /*no history*/);
			
			 if (oStartupParameters["ACT"]) {
				if (oStartupParameters["ACT"][0] === "CONS") {
					oRouter.navTo("Consult", {}, true );
					oRouter.getTargets().display("Consult");
				} else {
					if (oStartupParameters["ACT"][0] === "MON") {
						oRouter.navTo("Page1", {}, true );
						oRouter.getTargets().display("Page1");
					} 
				} 
			}  

		},

		createContent: function () {
			var app = new sap.m.App({
				id: "App"
			});
			var appType = "App";
			var appBackgroundColor = "";
			if (appType === "App" && appBackgroundColor) {
				app.setBackgroundColor(appBackgroundColor);
			}

			return app;
		},

		getNavigationPropertyForNavigationWithContext: function (sEntityNameSet, targetPageName) {
			//	var entityNavigations = navigationWithContext[sEntityNameSet];
			//	return entityNavigations == null ? null : entityNavigations[targetPageName];
		}

	});

});