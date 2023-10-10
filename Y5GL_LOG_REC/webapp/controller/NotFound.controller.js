sap.ui.define([
		"Y5GL_LOG_REC/Y5GL_LOG_REC/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("Y5GL_LOG_REC.Y5GL_LOG_REC.controller.NotFound", {

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