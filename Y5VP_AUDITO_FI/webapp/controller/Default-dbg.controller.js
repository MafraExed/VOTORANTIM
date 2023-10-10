sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("portal.y5vp_audito_fi.controller.Default", {

		onBeforeRebindTable: function (oEvent) {
			var mBindingParams = oEvent.getParameter("bindingParams");
			var oSmtFilter = this.getView().byId("smartFilterBar");
			var oSelect = oSmtFilter.getControlByKey("MyOwnFilterField");
			var sVariant = oSelect.getSelectedKeys();

			for (var i = 0; i < sVariant.length; i++) {
				var newFilter = new sap.ui.model.Filter("StatusA", sap.ui.model.FilterOperator.EQ, sVariant[i]);
				mBindingParams.filters.push(newFilter);
			}

		}

	});
});