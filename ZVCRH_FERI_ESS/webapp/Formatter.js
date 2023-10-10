sap.ui.define(function() {
	"use strict";

	var Formatter = {

		status :  function (sLabelStatus) {
				if (sLabelStatus == "Em Programação") {
					return "Success";
				} else if (sLabelStatus == "Out of Stock") {
					return "Warning";
				} else if (sLabelStatus == "Discontinued"){
					return "Error";
				} else {
					return "None";
				}
		}
	};

	return Formatter;

}, /* bExport= */ true);
