sap.ui.define(["jquery.sap.global"],
	function (jQuery) {
		"use strict";

		// Very simple page-context personalization
		// persistence service, not for productive use!
		var TablePersoService = {

			oDataPerso: {
				_persoSchemaVersion: "1.0",
				aColumns: []
			},

			getPersData: function () {
				var oDeferred = new jQuery.Deferred();
				if (!this._oBundle) {
					this._oBundle = this.oDataPerso;
				}
				var oBundle = this._oBundle;
				oDeferred.resolve(oBundle);
				return oDeferred.promise();
			},

			setPersData: function (oBundle) {
				var oDeferred = new jQuery.Deferred();
				this._oBundle = oBundle;
				oDeferred.resolve();
				return oDeferred.promise();
			},

			//this caption callback will modify the TablePersoDialog'
			getCaption: function (oColumn) {
				return null;
			},

			getGroup: function (oColumn) {
				return "";
			}
		};

		return TablePersoService;

	}, /* bExport= */ true);