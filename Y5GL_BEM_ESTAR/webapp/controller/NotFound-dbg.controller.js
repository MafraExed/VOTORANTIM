sap.ui.define([
		"Y5GL_BEM_ESTAR/Y5GL_BEM_ESTAR/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("Y5GL_BEM_ESTAR.Y5GL_BEM_ESTAR.controller.NotFound", {

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