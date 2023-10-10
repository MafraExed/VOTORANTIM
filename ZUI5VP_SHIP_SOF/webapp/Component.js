sap.ui.define([
		"jquery.sap.global",
		"sap/ui/core/UIComponent",
		"br/com/suzano/ZUI5VP_SHIP_SOF/model/models",
		"sap/ui/model/json/JSONModel",
		"br/com/suzano/ZUI5VP_SHIP_SOF/controller/ListSelector",
		"sap/f/FlexibleColumnLayoutSemanticHelper",
		"br/com/suzano/ZUI5VP_SHIP_SOF/controller/ErrorHandler",
		"br/com/suzano/ZUI5VP_SHIP_SOF/webServices/apiConnector"
], function (jQuery, UIComponent, models, JSONModel, ListSelector, FlexibleColumnLayoutSemanticHelper, ErrorHandler, apiConnector) {
	"use strict";

	return UIComponent.extend("br.com.suzano.ZUI5VP_SHIP_SOF.Component", {
		metadata: {
			manifest: "json"
		},

		init: function () {
			
			this.oListSelector = new ListSelector();
			//this._oErrorHandler = new ErrorHandler(this);
			this.setModel(models.createDeviceModel(), "device");
			this.setModel(models.createFLPModel(), "FLP");

			var oModel = new JSONModel();
			this.setModel(oModel);
			UIComponent.prototype.init.apply(this, arguments);

			this.getRouter().initialize();
		},

		createContent: function () {
			return sap.ui.view({
				viewName: "br.com.suzano.ZUI5VP_SHIP_SOF.view.App",
				type: "XML"
			});
		},

		/**
		 * Returns an instance of the semantic helper
		 * @returns {sap.f.FlexibleColumnLayoutSemanticHelper} An instance of the semantic helper
		 */
		getHelper: function () {
			var oFCL = this.getRootControl().byId("idBoardingControl"),
				oParams = jQuery.sap.getUriParameters(),
				oSettings = {
					defaultTwoColumnLayoutType: sap.f.LayoutType.TwoColumnsMidExpanded,
					defaultThreeColumnLayoutType: sap.f.LayoutType.ThreeColumnsMidExpanded,
					mode: oParams.get("mode"),
					initialColumnsCount: oParams.get("initial"),
					maxColumnsCount: oParams.get("max")
				};

			return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
		}/*,

		constructor: function () {
			sap.ui.core.UIComponent.prototype.constructor.apply(this, arguments);

			//Start Mockserver
			var iFilter = [];
			var stringParam = "/ZET_VPWM_VIAGENSSet";
			var me = this;
			apiConnector.consumeModel(stringParam, iFilter, {},
				function(oData, oResponse) {
					var model = new JSONModel();
					for(var i = 0; i < oData.results.length; i++) {
							oData.results[i].PercOpFormatted = parseFloat(oData.results[i].PercOperacional);
					}
					model.setData(oData);
					me.setModel(oData, "oMasterFilterModel");
				},
				function(err) {
					sap.m.MessageToast.show("Erro");
				}
			);
		}*/
	});
}, true);