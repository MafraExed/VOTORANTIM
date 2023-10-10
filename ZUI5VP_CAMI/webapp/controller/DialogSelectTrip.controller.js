sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, History) {
	"use strict";

	return BaseController.extend("FibriaStatusViagem.controller.DialogSelectTrip", {
		startTripEvent: {},
		setRouter: function(oRouter) {
			this.oRouter = oRouter;

		},
		getBindingParameters: function() {
			return {};

		},
		_onStartNewTripButtonPress: function(oEvent){
			this.startTripEvent = oEvent;
			// this.openPopover("SelectTruckPopover",oEvent, "selectTruck", "selectTruck");
		},
		_onContinueTripButtonPress: function(oEvent){
			this.openPopover("TripCodePopover",oEvent);
		},
		openPopover: function(sPopoverName, oEvent, eventBusData, eventBusName) {

			this.mPopovers = this.mPopovers || {};
			var oPopover = this.mPopovers[sPopoverName];
			var oSource = oEvent.getSource();
			var oBindingContext = oSource.getBindingContext();
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oView;
			if (!oPopover) {
				this.getOwnerComponent().runAsOwner(function() {
					oView = sap.ui.xmlview({
						viewName: "FibriaStatusViagem.view." + sPopoverName
					});
					this.getView().addDependent(oView);
					oView.getController().setRouter(this.oRouter);
					oPopover = oView.getContent()[0];
					oPopover.setPlacement("Auto");
					this.mPopovers[sPopoverName] = oPopover;
				}.bind(this));
			}
			if(eventBusData){
				var oEventBus = sap.ui.getCore().getEventBus();
				oEventBus.publish(sPopoverName, eventBusName, eventBusData);	
			}

			return new Promise(function(fnResolve) {
				oPopover.attachEventOnce("afterOpen", null, fnResolve);
				oPopover.openBy(oSource);
				if (oView) {
					oPopover.attachAfterOpen(function() {
						oPopover.rerender();
					});
				} else {
					oView = oPopover.getParent();
				}

				var oModel = this.getView().getModel();
				if (oModel) {
					oView.setModel(oModel);
				}
				if (sPath) {
					var oParams = oView.getController().getBindingParameters();
					oView.bindObject({
						path: sPath,
						parameters: oParams
					});
				}
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		TripSelected: function(sChanel, sEvent, oData){
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.publish("App", "TripSelected", oData);
			this.closeDialog();
		},
		closeDialog: function(){
			var oDialog = this.getView().getContent()[0];
			oDialog.close();
		},
		handleUnauthorizedAccess: function(){
			sap.m.MessageToast.show("Você não tem autorização para acessar esse aplicativo. Entre em contato com o administrador do sistema para realizar seu registo", {
				duration: 5000
			});
			this.byId("newTripButton").setEnabled(false);
		},
		onInit: function() {
			sap.ui.getCore().setModel(this, "dialogSelectTrip");
			this._oDialog = this.getView().getContent()[0];
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("DialogSelectTrip", "TripSelected", this.TripSelected, this);

		},
		onExit: function() {
			this._oDialog.destroy();

		}
	});
}, /* bExport= */ true);