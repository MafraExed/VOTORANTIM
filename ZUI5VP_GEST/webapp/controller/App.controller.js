Date.prototype.yyyymmdd = function() {
	var yyyy = this.getFullYear();
	var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
	var dd = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
	return "".concat(yyyy).concat(mm).concat(dd);
};

sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("monitorPortocel.controller.App", {
		
		onInit: function() {
			var sUrl = "/sap/opu/odata/sap/ZGWVPWM_GESTAO_CAMINHOES_SRV/";
			var oModel = new sap.ui.model.odata.v2.ODataModel({
				serviceUrl: sUrl
			});
			sap.ui.getCore().setModel(oModel, "oModel");
		}
		
	});
});