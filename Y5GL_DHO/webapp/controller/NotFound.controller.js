sap.ui.define([
		"Y5GL_DHO/Y5GL_DHO/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("Y5GL_DHO.Y5GL_DHO.controller.NotFound", {

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