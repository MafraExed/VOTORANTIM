sap.ui.define([
		"Y5VS_CSC/Y5VS_CSC/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("Y5VS_CSC.Y5VS_CSC.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);