sap.ui.define([ "y5fb/ui5/Dashboard/controller/BaseController",
		"sap/ui/model/json/JSONModel", "sap/ui/core/routing/History",
		"y5fb/ui5/Dashboard/model/formatter", "sap/ui/model/Filter",
		"sap/ui/model/FilterOperator", 'sap/ui/model/Sorter',

], function(BaseController, JSONModel, History, formatter, Filter,
		FilterOperator, Sorter) {
	"use strict";

	return BaseController.extend("y5fb.ui5.Dashboard.controller.Main", {
		formatter : formatter,

		_oResponsivePopover : null,

		onInit : function(evt) {

			this.setModel(new JSONModel(), "Model1");

			var csspath = jQuery.sap.getModulePath("y5fb.ui5.Dashboard",
					"/css/style.css");
			jQuery.sap.includeStyleSheet(csspath);

		},

		onBeforeRendering : function() {

		},

		onAfterRendering : function() {

		},

		onExit : function() {

		},

		onClick : function(oEvent) {

			var select = oEvent.getSource().getBindingContext().getProperty(
					"UnidadeDash");

			this._navToRouter(select);

		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		_navToRouter : function(select) {
			debugger;

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var destiny = {
				UnidadeDash : select
			};

			//Implementar tipos de tiles para definir qual navigation utilizar
			var x = select.split('_')[1]//pegar o parametro passado na chave

			if (x === "P") {//tipo de grafico 'PIE'

				oRouter.navTo("object", destiny);//Routes in manifest.json
			} else if (x === "B") {//Tipo de gráfico 'Bar'

				//this.getRouter().navTo("main", {}, true);
				oRouter.navTo("object_bar", destiny);//Routes in manifest.json
			}

		}
	});
});