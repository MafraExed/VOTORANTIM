sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("cba.hr.sdvCalibracaoSF.controller.CalibrationSessions", {

		/***************************************************************************
			onInit
	    ****************************************************************************/
		onInit: function () {

			sap.ui.core.BusyIndicator.show(0);
			this.getPendingCalibrationSessions();
		},

		/***************************************************************************
			setSfUser
	    ****************************************************************************/
		setSfUser: function (sfUser) {
			this._sfUser = sfUser;
		},

		/***************************************************************************
			getSfUser
	    ****************************************************************************/
		getSfUser: function () {
			return this._sfUser;
		},

		/***************************************************************************
			getPendingCalibrationSessions
	    ****************************************************************************/
		getPendingCalibrationSessions: function () {

			var that = this;
			var oModelEcc = this.getOwnerComponent().getModel("ECC");

			oModelEcc.read("/Usuarios('" + this.getUserFiori() + "')", {
				success: function (oUser) {

					var oTable = that.getView().byId("CalibrationSessionTable");
					var oModel = that.getOwnerComponent().getModel("SFactors");
					var aFilters = [];

					that.setSfUser(oUser.SfUser);

					aFilters.push(new sap.ui.model.Filter("ownerId", "EQ", that.getSfUser()));

					oModel.read("/CalibrationSession", {
						urlParameters: {
							"$select": "sessionId,sessionName"
						},
						filters: aFilters,
						success: function (oData) {

							var oDataCalibration = new sap.ui.model.json.JSONModel(oData);
							oDataCalibration.setData(oData);
							oTable.setModel(oDataCalibration);
							oTable.bindAggregation("items", {
								path: "/results",
								template: oTable.getBindingInfo("items").template
							});
							sap.ui.core.BusyIndicator.hide();
						},
						error: function () {
							sap.ui.core.BusyIndicator.hide();
						}
					});
				},
				error: function (e) {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageToast.show(JSON.parse(e.responseText).error.message.value);
				}
			});
		},

		/***************************************************************************
			getUserFiori
	    ****************************************************************************/
		getUserFiori: function () {
			var oUserModel = new sap.ui.model.json.JSONModel();
			oUserModel.loadData("/sap/bc/ui2/start_up?", "", false);
			return ((oUserModel.getData().id) ? oUserModel.getData().id : "");
		},

		/***************************************************************************
			onExibirSessaoPress
	    ****************************************************************************/
		onExibirSessaoPress: function (oEvent) {
			var sessionId = oEvent.getSource().data("sessionId");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("TargetCalibrationRoom", {
				calibrationSessionId: sessionId,
				calibrationOwnerId: this.getSfUser()
			});
		}

	});
});