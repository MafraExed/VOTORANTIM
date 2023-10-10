sap.ui.define([], function() {
	"use strict";
	return {
		mudarStatus: function(pValue) {
			switch (pValue) {
				case "L":
					return "Warning";
				default:
					return "None";
			}
		},
		mudarIcon: function(pValue) {
			switch (pValue) {
				case "L":
					//return "sap-icon://message-warning";
					return "sap-icon://message-error";
				case "S":
					return "sap-icon://collaborate";
				//	return "sap-icon://citizen-connect";
				default:
					return "None";
			}

		},

		mudarCor: function(pValue) {
			switch (pValue) {
				case "L":
					//return "sap-icon://message-warning";
					return "#27a3dd";
				case "S":
					//return "sap-icon://message-warning";
					return "#27a3dd";
				default:
					return "None";
			}

		},
		tooltip: function(pValue) {
			switch (pValue) {
				case "L":
					var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
					var oTextBtn = oResourceBundle.getText("Log");
					return oTextBtn;
				case "S":
					var oSubst = this.getView().getModel("i18n").getResourceBundle();
					var oTextBtn1 = oSubst.getText("UsurSub");
					return oTextBtn1;
				default:
					return "None";
			}

		}

	};
});