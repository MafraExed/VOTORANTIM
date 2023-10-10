sap.ui.define([
		"Y5GL_CSC2/Y5GL_CSC2/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("Y5GL_CSC2.Y5GL_CSC2.controller.NotFound", {

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