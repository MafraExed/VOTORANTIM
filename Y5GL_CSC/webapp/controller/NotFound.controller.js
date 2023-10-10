sap.ui.define([
		"Y5GL_CSC/Y5GL_CSC/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("Y5GL_CSC.Y5GL_CSC.controller.NotFound", {

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