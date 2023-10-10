sap.ui.define([], function() {
	"use strict";

	return {

		statusText : function(value) {
			var bundle = this.getModel("i18n").getResourceBundle();
			return bundle.getText("StatusText" + value, "?");
		},

		statusState : function(value) {
			var map = {					
				"E" : "Error",
				"L" : "Success",
				"Q" : "Warning",
				"I" : "Error",
				"P" : "Error",
				"S" : "Neutral",
				"B" : "Error",
				"R" : "Error"
			}
			return (value && map[value]) ? map[value] : "None";
		},

		statusIcon : function(value) { 
			switch (value) {
			case "S":
				return "sap-icon://citizen-connect"
				break;
			case "I":
				return "sap-icon://personnel-view"
				break;								
			case "Q":
				return "sap-icon://sys-help"
				break;
			case "P":
				return "sap-icon://pending"
				break;
			case "B":
				return "sap-icon://sys-cancel-2"
				break;
			case "E":
				return "sap-icon://error"				
				break;
			case "R":
				return "sap-icon://error"
				break;	
			}
		},

		currencyInternal : function(sValue) {
			if (!sValue) {
				return "";
			}

			return parseFloat(sValue).toFixed(2);
		},

		currencyExternal : function(fValue) {
			if (fValue && fValue != "") {
				var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
					minFractionDigits : 2,
					maxFractionDigits : 2,
					groupingEnabled : true,
					groupingSeparator : ".",
					decimalSeparator : ","
				});

				return oNumberFormat.format(fValue);
			}

			return fValue;
		},

		dateExternal : function(sValue) {
			if (sValue) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern : "dd/MM/YYYY"
				});

				var dDate = undefined;

				if (sValue instanceof Date)
					dDate = sValue;
				else
					dDate = new Date(parseInt(sValue.substr(6)));

				var sLocal = dDate.toUTCString();
				dDate = new Date(sLocal.substr(0, 16));

				return oDateFormat.format(dDate);
			} else {
				return sValue;
			}
		},

		iconTabBar : function(value) {
			switch (value) {
			case "L":
				return "sap-icon://employee-approvals"
				break;
			case "S":
				return "sap-icon://citizen-connect"
				break;
			case "Q":
				return "sap-icon://sys-help"
				break;
			case "T":
				return "sap-icon://document-text"
				break;
			case "A":
				return "sap-icon://attachment"
				break;				
			default:
				return "sap-icon://employee-rejections"
				break;
			}
		},

		iconColor : function(value) {
			
			switch (value) {
			case "L":
				return sap.ui.core.IconColor.Positive
				break;
			case "S":
				return sap.ui.core.IconColor.Critical
				break;
			case "Q":
				return sap.ui.core.IconColor.Neutral
				break;
			case "A" || "T":
				return sap.ui.core.IconColor.Default
				break;
			default:
				return sap.ui.core.IconColor.Negative
				break;
			}				
		}
	}

});