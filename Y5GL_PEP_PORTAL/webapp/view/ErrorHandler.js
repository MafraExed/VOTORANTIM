sap.ui.define([
	"sap/ui/base/Object",
	"sap/m/MessageBox"
], function (UI5Object, MessageBox) {
	"use strict";

	return UI5Object.extend("vsa.y5gl_pep_portal.view.ErrorHandler", {

		/**
		 * Handles application errors by automatically attaching to the model events and displaying errors when needed.
		 * @class
		 * @param {sap.ui.core.UIComponent} oComponent reference to the app's component
		 * @public
		 * @alias vsa.y5gl_fi_portal.controller.ErrorHandler
		 */
		constructor: function (oComponent) {
			this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
			this._oComponent = oComponent;
			this._oModel = oComponent.getModel();
			this._bMessageOpen = false;
			this._sErrorText = this._oResourceBundle.getText("errorText");

			this._oModel.attachMetadataFailed(function (oEvent) {
				var oParams = oEvent.getParameters();
				this._showServiceError(oParams.response);
			}, this);

			this._oModel.attachRequestFailed(function (oEvent) {
				var oParams = oEvent.getParameters();
				if (oParams.response.statusCode !== "404" || (oParams.response.statusCode === 404 && oParams.response.responseText.indexOf(
						"Cannot POST") === 0)) {
					this._showServiceError(oParams.response);
				}
			}, this);
		},

		_showServiceError: function (sDetails) {
			var messageText = "";
			var sResponseText = sDetails.responseText;
			if (this._bMessageOpen) {
				return;
			}
			this._bMessageOpen = true;

			try {
				var oMessage = JSON.parse(sResponseText);
				if (oMessage) {
					messageText = oMessage.error.message.value;
				}
			} catch (err) {
				try {
					switch (typeof sResponseText) {
					case "string": // XML or simple text
						if (sResponseText.indexOf("<?xml") == 0) {
							var oXML = jQuery.parseXML(sResponseText);
							var oXMLMsg = oXML.querySelector("message");
							if (oXMLMsg) {
								messageText = oXMLMsg.textContent;
							}
						} else {
							messageText = sResponseText;
						}
						break;
					case "object": // Exception
						messageText = sResponseText.toString();
						break;
					}
				} catch (err) {
					messageText = this._oResourceBundle.getText("ERRORMSG");
				}
			}

			MessageBox.error(messageText, {
				actions: [MessageBox.Action.CLOSE],
				onClose: function () {
					this._bMessageOpen = false;
				}.bind(this)
			});
		}

	});

});