sap.ui.define([
		"Y5GL_CSC_CBA/Y5GL_CSC_CBA/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("Y5GL_CSC_CBA.Y5GL_CSC_CBA.controller.NotFound", {

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