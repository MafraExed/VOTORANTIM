sap.ui.define([
	"sap/ui/base/Object"
], function(Object) {
	"use strict";

	var services = {
		url: "/sap/opu/odata/sap/ZGWVPWM_VESSELS_SOF_SRV",
		ODataModel: null,

		consumeAsync: function(params, filter, urlParametersX, successCb, errorCb, async) {
			
			var oModel = new sap.ui.model.odata.ODataModel(this.url, true);
			oModel.read(params, {
				urlParameters: urlParametersX,
				filters: filter,
				async: async,
				success: function(oData, oResponse) {
					successCb(oData, oResponse);
				},
				error: function(err) {
						errorCb(err);
					}
					// }, this);
			});
		},

		consumeModel: function(params, filter, urlParametersX , successCb, errorCb) {
			if(this.ODataModel === null){
				this.ODataModel = new sap.ui.model.odata.v2.ODataModel(this.url);
			}
			this.ODataModel.read(params, {
				urlParameters: urlParametersX,
				filters: filter,
				success: function(oData, oResponse) {
					successCb(oData, oResponse);
				},
				error: function(err) {
						errorCb(err);
					}
					// }, this);
			});
		},

		consumeModelPic: function(params, successCb, errorCb) {
			var oModel = new sap.ui.model.odata.ODataModel(this.url, true);
			oModel.read(params, {
				async: false,
				success: function(oData, oResponse) {
					successCb(oData, oResponse);
				},
				error: function(err) {
						errorCb(err);
					}
					// }, this);
			});
		},

		createModel: function(params, object, successCb, errorCb, urlParameters) {
			var oModel = new sap.ui.model.odata.ODataModel(this.url, true);
			// oModel.setHeaders({"X-Requested-With" : "X" });
			oModel.attachRequestSent(function() {
				sap.ui.core.BusyIndicator.show();
			});
			oModel.attachRequestCompleted(function() {
				sap.ui.core.BusyIndicator.hide();
			});
			oModel.create(params, object, {
				urlParameters: {
					tokenHendling: false,
					disebleHeaedRequestForToken: true
				},
				//method: "PUT",
				success: function(oData, oResponse) {
					successCb(oData, oResponse);
				},
				error: function(err) {
					errorCb(err);
				}
			});
		},

		sendImage: function(params, object, successCb, errorCb, header) {
			var oModel = new sap.ui.model.odata.ODataModel(this.url, true);
			oModel.setHeaders({
				"slug": header.slug.toString()
			});
			oModel.create(params, object, {
				//method: "PUT",
				success: function(oData, oResponse) {
					successCb(oData, oResponse);
				},
				error: function(err) {
					errorCb(err);
				}
			});
		},

		updateModel: function(params, object, successCb, errorCb) {
			//if(this.ODataModel === null){
			this.ODataModel = new sap.ui.model.odata.ODataModel(this.url, true);
			//}
			//this.ODataModel.setHeaders({"Content-Type" : "application/json" });
			this.ODataModel.update(params, object, {
				async: true,
				success: function(oData, oResponse) {
					successCb(oData, oResponse);
				},
				error: function(err) {
					errorCb(err);
				}
			});
		},

		deleteModel: function(params, object, successCb, errorCb) {
			var oModel = new sap.ui.model.odata.ODataModel(this.url, true);
			// oModel.setHeaders({"X-Requested-With" : "X" });
			oModel.remove(params, {
				// method: "DELETE",
				success: function(oData, oResponse) {
					successCb(oData, oResponse);

				},
				error: function(err) {
					errorCb(err);
				}
			});
		},

		montaStringHora: function(Data) {
			var hora = Data.getHours().toString();
			if (hora.length < 2) {
				hora = '0' + hora;
			}
			var minutos = Data.getMinutes().toString();
			if (minutos.length < 2) {
				minutos = '0' + minutos;
			}
			var segundos = Data.getSeconds().toString();
			if (segundos.length < 2) {
				segundos = '0' + segundos;
			}
			return hora + minutos + segundos;
		},

		formatDate: function(Date) {
			var yyyy = Date.getFullYear();
			var mm = Date.getMonth() < 9 ? "0" + (Date.getMonth() + 1) : (Date.getMonth() + 1); // getMonth() is zero-based
			var dd = Date.getDate() < 10 ? "0" + Date.getDate() : Date.getDate();
			return "".concat(yyyy).concat(mm).concat(dd);
		}
	};
	
	return services;
});