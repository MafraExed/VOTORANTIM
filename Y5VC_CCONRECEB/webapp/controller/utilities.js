sap.ui.define([
	"./utilities"
], function () {
	"use strict";

	// class providing static utility methods to retrieve entity default values.

	return {

		getStartupParameters: function (oView) {
			var sComponentId = sap.ui.core.Component.getOwnerIdFor(oView);
			return sap.ui.component(sComponentId).getComponentData().startupParameters;
		},

		getInitialViewFromParameters: function (oView) {

			var oStartupParameters = this.getStartupParameters(oView);

			if (oStartupParameters["ACT"]) {
				if (oStartupParameters["ACT"][0] === "CONS") {
					return "Consult";
				} else {
					if (oStartupParameters["ACT"][0] === "MON") {
						return "Page1";
					}
				}
			}
		},
		
		getActionFromParameters: function(oView){
			var oStartupParameters = this.getStartupParameters(oView);

			if (oStartupParameters["ACT"]) {
				return oStartupParameters["ACT"][0];
			}
		},
		
		
		getRoleFromParameters: function (oView) {
			var oStartupParameters = this.getStartupParameters(oView);

			if (oStartupParameters["ROLE"]) {
				return oStartupParameters["ROLE"][0];
			}
		},

		isAlmox: function (oView) {
			if (this.getRoleFromParameters(oView) === "ALMOX") {
				return true;
			}
			else{
				return false; 
			}

		},

		isOpLog: function (oView) {
			if (this.getRoleFromParameters(oView) === "OPLOG") {
				return true;
			}
			else{
				return false; 
			}
		},
		
		isConsult: function(oView){
			if (this.getActionFromParameters(oView) === "CONS") {
				return true;
			}
			else{
				return false; 
			}
		},
		
		getRoleHeaders: function(oView){
			
			let headers = {};
			
			if(this.isOpLog(oView)){
				headers["ROLE"] = "OPLOG";
			}
			else{
				headers["ROLE"] = "ALMOX";
			}
			
			if(this.isConsult(oView)){
				headers["ACT"] = "CONS";
			}
			else{
				headers["ACT"] = "MON";
			}
			return headers;
		}
	};
});