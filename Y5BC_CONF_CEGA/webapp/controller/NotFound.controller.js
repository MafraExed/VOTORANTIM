sap.ui.define([
		"Y5BC_CONF_CEGA/Y5BC_CONF_CEGA/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("Y5BC_CONF_CEGA.Y5BC_CONF_CEGA.controller.NotFound", {

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