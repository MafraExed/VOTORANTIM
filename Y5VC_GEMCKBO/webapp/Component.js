sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"workspace/zcockpit_bo_v3/model/models",
	"sap/f/FlexibleColumnLayoutSemanticHelper",
	"sap/f/library",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (UIComponent, Device, models, FlexibleColumnLayoutSemanticHelper, fioriLibrary, JSONModel, MessageBox) {
	"use strict";
	return UIComponent.extend("workspace.zcockpit_bo_v3.Component", {

		metadata: {
			manifest: "json"
		},
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			
			var oModel = new JSONModel();
			this.setModel(oModel,"FlexibleColumn");

			// enable routing
			var oRouter = this.getRouter();
			oRouter.attachBeforeRouteMatched(this._onBeforeRouteMatched, this);
			oRouter.initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

		},
		_onBeforeRouteMatched: function(oEvent) {
			var oModel = this.getModel("FlexibleColumn"),
				sLayout = oEvent.getParameters().arguments.layout,
				oNextUIState;

			// If there is no layout parameter, query for the default level 0 layout (normally OneColumn)
			if (!sLayout) {
				this.getHelper().then(function(oHelper) {
					oNextUIState = oHelper.getNextUIState(0);
					oModel.setProperty("/layout", oNextUIState.layout);
				});
				return;
			}
			oModel.setProperty("/layout", sLayout);
		},

		getHelper: function () {
			return this._getFcl().then(function (oFCL) {
				var oSettings = {
					defaultTwoColumnLayoutType: fioriLibrary.LayoutType.TwoColumnsMidExpanded,
					defaultThreeColumnLayoutType: fioriLibrary.LayoutType.ThreeColumnsMidExpanded
				};
				return (FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings));
			});
		},

		_getFcl: function () {
			return new Promise(function (resolve, reject) {
				var oFCL = this.getRootControl().byId("flexibleColumnLayout");
				if (!oFCL) {
					this.getRootControl().attachAfterInit(function (oEvent) {
						resolve(oEvent.getSource().byId("flexibleColumnLayout"));
					}, this);
					return;
				}
				resolve(oFCL);

			}.bind(this));
		}
	});
});