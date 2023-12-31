sap.ui.define([
	"sap/ui/base/Object",
	"sap/m/MessageBox"
], function(UI5Object, MessageBox) {
	"use strict";

	return UI5Object.extend("portal.zvpwps0001_si.controller.ErrorHandler", {

		/**
		 * Handles application errors by automatically attaching to the model events and displaying errors when needed.
		 * @class
		 * @param {sap.ui.core.UIComponent} oComponent reference to the app's component
		 * @public
		 * @alias portalapp.votorantim.com.controller.ErrorHandler
		 */
		constructor: function(oComponent) {

			this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
			this._oComponent = oComponent;
			this._oModel = oComponent.getModel();
			this._bMessageOpen = false;
			this._sErrorText = this._oResourceBundle.getText("errorText");
			this._oModel.attachMetadataFailed(function(oEvent) {
				var oParams = oEvent.getParameters();
				this._showServiceError(oParams.response);
			}, this);

			this._oModel.attachRequestFailed(function(oEvent) {

				var oParams = oEvent.getParameters();
				// An entity that was not found in the service is also throwing a 404 error in oData.
				// We already cover this case with a notFound target so we skip it here.
				// A request that cannot be sent to the server is a technical error that we have to handle though
				if (oParams.response.statusCode !== "404" || (oParams.response.statusCode === 404 && oParams.response.responseText.indexOf(
						"Cannot POST") === 0)) {

					this._extractError(oParams.response, oComponent);

				}
			}, this);

		},

		/**
		 * Shows a {@link sap.m.MessageBox} when a service call has failed.
		 * Only the first error message will be display.
		 * @param {string} sDetails a technical error to be displayed on request
		 * @private
		 */
		_showServiceError: function(sDetails) {
			if (this._bMessageOpen) {
				return;
			}
			this._bMessageOpen = true;
			MessageBox.error(
				this._sErrorText, {
					id: "serviceErrorMessageBox",
					details: sDetails,
					styleClass: this._oComponent.getContentDensityClass(),
					actions: [MessageBox.Action.CLOSE],
					onClose: function() {
						this._bMessageOpen = false;
					}.bind(this)
				}
			);
		},
		handleConfirmationMessageBoxPress: function(oEvent, oComponent) {
			//MessageBox.confirm("Existe uma indicação de substituto.deseja anular?",this.rCallAlertBack.bind(this), "Confirmation");
			//var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			//MessageBox.confirm("Existe uma indicação de substituto.",this.rCallAlertBack, "Confirmation");
			/*MessageBox.confirm(
				"Existe uma indicação de substituto.", {
					styleClass: this._oComponent.getContentDensityClass(),
					actions: [MessageBox.Action.CLOSE],
					onClose: function() {
						this._bMessageOpen = false;
					}.bind(this)
				}
			);*/
		
			MessageBox.warning(
				"Existe uma indicação de substituto.", {
					//	actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
					actions: ["Anular", sap.m.MessageBox.Action.CANCEL],
					styleClass: this._oComponent.getContentDensityClass(),
					onClose: function(oAction,oComponent) {

						if (oAction == "Anular") {
							
							var lv_set = ("Sisbs('999999999')");
							var sServiceUrl = "/sap/opu/odata/sap/ZGWFBSISB_PORTAL_SRV/";
							var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
							var oEntry = {};
							oEntry.Numprocesso = "CANCEL_SUBS";
							var batchChanges = [];

							batchChanges.push(oModel.createBatchOperation(lv_set, "PUT", oEntry));

							oModel.addBatchChangeOperations(batchChanges);
							oModel.submitBatch(function(data, oComponent) {
								
								//var oController = sap.ui.getCore().byId("default");
								//var oServiceModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWFBSISB_PORTAL_SRV/");
								//oServiceModel.read("/Sisbs", "GET");

								//	sap.m.MessageBox.success("Documento Aprovado com Sucesso!!");
							}, function(err) {
								sap.m.MessageBox.show("Documeto não foi atualizado!", {});
							});

						} else {
							//	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
							//oRouter.navTo('default');
						}
					}.bind(this)
				}
			);
		},
		_extractError: function(sDetails, oComponent) {
			
			if (sDetails.responseText) {
				var parsedJSError = null;
				try {
					parsedJSError = jQuery.sap.parseJS(sDetails.responseText);
				} catch (err) {
					return sDetails;
				}

				if (parsedJSError && parsedJSError.error && parsedJSError.error.code) {
					var strError = "";
					//check if the error is from our backend error class
					if (parsedJSError.error.code.split("/")[0] === "E01") {
						/*	var array = parsedJSError.error.innererror.errordetails;
							for (var i = 0; i < array.length; i++) {
								strError += String.fromCharCode("8226") + " " + array[i].message + "\n";
							}
							this._showServiceError(strError);*/
						this.handleConfirmationMessageBoxPress(strError, oComponent);
					} else {
						//if there is no message class found
						var array = parsedJSError.error.innererror.errordetails;
						for (var i = 0; i < array.length; i++) {
							strError += String.fromCharCode("8226") + " " + array[i].message + "\n";
						}
						this._showServiceError(strError);
						//return sDetails;
					}

					return strError;

				}
			}
			return sDetails;
		}

	});

});