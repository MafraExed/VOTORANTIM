sap.ui.define([
		"Y5GL_FINANCEIR2/Y5GL_FINANCEIR2/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("Y5GL_FINANCEIR2.Y5GL_FINANCEIR2.controller.NotFound", {

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