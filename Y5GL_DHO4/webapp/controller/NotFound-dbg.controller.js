sap.ui.define([
		"Y5GL_DHO4/Y5GL_DHO4/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("Y5GL_DHO4.Y5GL_DHO4.controller.NotFound", {

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