sap.ui.define([
		"Y5GL_REL_FERI/Y5GL_REL_FERI/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("Y5GL_REL_FERI.Y5GL_REL_FERI.controller.NotFound", {

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