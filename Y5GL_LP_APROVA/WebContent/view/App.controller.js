sap.ui.define([
		"vsa/y5gl_lp_portal/view/BaseController",
		"sap/ui/model/json/JSONModel"
	], function (BaseController, JSONModel) {
		"use strict";

		return BaseController.extend("vsa.y5gl_lp_portal.view.App", {

			onInit : function () {
//				
//				var oViewModel,
//					fnSetAppNotBusy,
//					iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

//				var oViewModel = new JSONModel({
//					busy : true,
//					delay : 0
//				});
//				
//				this.setModel(oViewModel, "appView");

//				fnSetAppNotBusy = function() {
//					oViewModel.setProperty("/busy", false);
//					oViewModel.setProperty("/delay", iOriginalBusyDelay);
//				};

//				// since then() has no "reject"-path attach to the MetadataFailed-Event to disable the busy indicator in case of an error
//				this.getOwnerComponent().getModel().metadataLoaded().then(fnSetAppNotBusy);
//				this.getOwnerComponent().getModel().attachMetadataFailed(fnSetAppNotBusy);
//
//
//				// Makes sure that master view is hidden in split app
//				// after a new list entry has been selected.
//				oListSelector.attachListSelectionChange(function () {
//					this.byId("idAppControl").hideMaster();
//				}, this);

				// apply content density mode to root view
//				this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			}

		});

	}
);