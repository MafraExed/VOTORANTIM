sap.ui.define(["sap/ui/base/Object", "sap/m/MessageBox"], function (e, t) {
	"use strict";
	return e.extend("Y5GL_SOLFER_DHO.Y5GL_SOLFER_DHO.controller.ErrorHandler", {
		constructor: function (e) {
			this._oResourceBundle = e.getModel("i18n").getResourceBundle();
			this._oComponent = e;
			this._oModel = e.getModel();
			this._bMessageOpen = false;
			this._sErrorText = this._oResourceBundle.getText("errorText");
			this._oModel.attachMetadataFailed(function (e) {
				var t = e.getParameters();
				this._showServiceError(t.response)
			}, this);
			this._oModel.attachRequestFailed(function (e) {
				var t = e.getParameters();
				if (t.response.statusCode !== "404" || t.response.statusCode === 404 && t.response.responseText.indexOf("Cannot POST") === 0) {}
			}, this)
		},
		
			_showServiceError : function (sDetails) {
				var msg = sDetails.responseText;
				var MostraMsg = JSON.parse(msg).error.message.value;
				sap.m.MessageBox.error(MostraMsg);
			}
	});
});