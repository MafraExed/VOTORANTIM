sap.ui.define([
		"fibria/com/ZFBC_AMEACAS/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("fibria.com.ZFBC_AMEACAS.controller.NotFound", {

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