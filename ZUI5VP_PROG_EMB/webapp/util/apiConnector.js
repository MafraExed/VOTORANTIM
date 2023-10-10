sap.ui.define([
	"sap/ui/base/Object"
], function(Object) {
	"use strict";

	var services = {
		consumeModel: function(url, params, filters, successCb, errorCb) {
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			oModel.read(params, {
				filters: filters,
				success: function(oData, oResponse) {
					successCb(oData, oResponse);
				},
				error: function(err) {
					errorCb(err);
				}
			});
		},
		createModel: function(url, params, object, successCb, errorCb) {
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			oModel.create(params, object,{
				method: "PUT",
				success: function(oData, oResponse) {
					successCb(oData, oResponse);
				},
				error: function(err) {
					errorCb(err);
				}
			});
		},
		updateModel: function(url, params, object, successCb, errorCb) {
			var oModel = new sap.ui.model.odata.ODataModel(url, true);
			oModel.update(params, object,{
				method: "PUT",
				success: function(oData, oResponse) {
					successCb(oData, oResponse);
				},
				error: function(err) {
					errorCb(err);
				}
			});
		}
	};
	return services;
});