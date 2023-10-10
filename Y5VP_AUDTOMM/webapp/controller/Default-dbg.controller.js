sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("portal.y5vp_auditoria_mm.controller.Default", {

		onBeforeRebindTable: function (oEvent) {
			var mBindingParams = oEvent.getParameter("bindingParams");
			var oSmtFilter = this.getView().byId("smartFilterBar");
			var oSelect = oSmtFilter.getControlByKey("MyOwnFilterField");
			var sVariant = oSelect.getSelectedKeys();

			for (var i = 0; i < sVariant.length; i++) {
				//	var item = sVariant[i].getBindingContext().getObject();
				//	var id = new Filter("ID", FilterOperator.Contains, item.ID);
				var newFilter = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, sVariant[i]);
				//filters.push(newFilter);
				mBindingParams.filters.push(newFilter);
			}
			var oSelect1 = oSmtFilter.getControlByKey("FilterRela");
			var sVariant1 = oSelect1.getSelectedKey();
			var newFilter1 = new sap.ui.model.Filter("Tipodocu", sap.ui.model.FilterOperator.EQ, sVariant1);
			mBindingParams.filters.push(newFilter1);

		}

	});
});