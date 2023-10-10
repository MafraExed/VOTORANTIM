sap.ui.define([
		"fibria/com/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("fibria.com.controller.NotFound", {
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}
		});
	}
);