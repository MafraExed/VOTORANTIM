sap.ui.define([], function () {
	"use strict";
	return {
		forcedPickingText: function (vValue) {
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (vValue) {
				case true:
					return resourceBundle.getText("txt_yes");
				case false:
					return resourceBundle.getText("txt_no");
				default:
					return vValue;
			}
		}
	};
});