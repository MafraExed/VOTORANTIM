sap.ui.define([
		"fibria/com/ZFBC_SUMARIO/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("fibria.com.ZFBC_SUMARIO.controller.NotFound", {

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