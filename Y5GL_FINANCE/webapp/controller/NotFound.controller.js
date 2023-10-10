sap.ui.define([
		"Y5GL_FINANCE/Y5GL_FINANCE/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("Y5GL_FINANCE.Y5GL_FINANCE.controller.NotFound", {

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