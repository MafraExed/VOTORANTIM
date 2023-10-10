sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.sap.build.standard.operadorLogisticoCons.controller.Home", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.sap.build.standard.operadorLogisticoCons.view.Home
		 */
		onInit: function () {
		/*	var oStartupParameters = this.getMyComponent().getComponentData().startupParameters;
			if (oStartupParameters["ROLE"]) {
				if (oStartupParameters["ROLE"][0] === "ALMOX") {
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("Page1");
				}
			}*/

		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.sap.build.standard.operadorLogisticoCons.view.Home
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.sap.build.standard.operadorLogisticoCons.view.Home
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.sap.build.standard.operadorLogisticoCons.view.Home
		 */
		//	onExit: function() {
		//
		//	},

		getMyComponent: function () {
			"use strict";
			var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
			return sap.ui.component(sComponentId);
		}

	});

});