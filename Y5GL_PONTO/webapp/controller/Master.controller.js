sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "sap/ui/core/routing/History", "sap/ui/model/Filter",
	"sap/ui/model/Sorter", "sap/ui/model/FilterOperator", "sap/m/GroupHeaderListItem", "sap/ui/Device", "sap/ui/core/Fragment",
	"../model/formatter"
], function (e, JSONModel, i, a, r, s, n, o, l, c) {
	"use strict";
	return e.extend("Y5GL_PONTO.Y5GL_PONTO.controller.Master", {

		onInit: function () {

			this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);

		},

		_onMasterMatched: function () {
			//Set the layout property of the FCL control to 'OneColumn'
			this.getModel("appView").setProperty("/layout", "OneColumn");
		},

		_onMetadataLoaded: function () {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("masterView");

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		},

		onSave: function () {
			var rota = "object";
			var Periodo = this.getView().byId("IdPeriodoPGTO_MENSAL").getSelectedKey();

			this.getRouter().navTo(rota, {
				Periodo: Periodo,
				Tipo: "W",
				Check: "X"
			}, r);
		},
		
		BackInicial: function(oEvent){
			var url = "https://fioridev.votorantim.com.br/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html#Shell-home";
			window.open(url);
			window.close();
		}

	});
});