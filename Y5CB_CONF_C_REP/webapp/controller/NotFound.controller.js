sap.ui.define([
		"Y5CB_CONF_C_REP/Y5CB_CONF_C_REP/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("Y5CB_CONF_C_REP.Y5CB_CONF_C_REP.controller.NotFound", {

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