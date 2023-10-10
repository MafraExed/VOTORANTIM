sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter"
], function (Controller, JSONModel, formatter) {
	"use strict";
	var kunnr;
	var stcd1;
	var stcd2;
	var kkber;
	return Controller.extend("Y5VC_PAINEL_NE2.Y5VC_PAINEL_NE2.controller.ListaClientes", {

		formatter: formatter,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Y5VC_PAINEL_NE2.Y5VC_PAINEL_NE2.view.Items
		 */
		onInit: function () {

			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});

			this.getRouter().getRoute("ListaClientes").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "ListaClientesView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

		},

		_onObjectMatched: function (oEvent) {
			kunnr = oEvent.getParameter("arguments").Kunnr;
			stcd1 = oEvent.getParameter("arguments").stcd1;
			stcd2 = oEvent.getParameter("arguments").stcd2;
			kkber = oEvent.getParameter("arguments").kkber;
			
			var table = this.getView().byId("IdList");
			table.rebindTable("e");

			// this.getModel().metadataLoaded().then( function() {
			// 	var sObjectPath = this.getModel().createKey("ZET_VCFI_COD_CLISet", {
			// 		Kunnr: kunnr,
			// 		Stcd1: stcd1,
			// 		Stcd2: stcd2
			// 	});
			// 	this._bindView("/" + sObjectPath);
			// }.bind(this));
		},

		BeforeTable: function (oEvent) {

			if (kunnr !== "") {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Kunnr",
					operator: "EQ",
					value1: kunnr
				}));

			}
			if (stcd1 !== "") {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Stcd1",
					operator: "EQ",
					value1: stcd1
				}));
			}

			if (stcd2 !== "") {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Stcd2",
					operator: "EQ",
					value1: stcd2
				}));
			}
			
			if (kkber !== "") {
				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Kkber",
					operator: "EQ",
					value1: kkber
				}));
			}
			
			oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "NivelDet",
					operator: "EQ",
					value1: 'X'
				}));

		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function (sObjectPath) {
			var oViewModel = this.getModel("ListaClientesView"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oDataModel.metadataLoaded().then(function () {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function () {
			var oView = this.getView(),
				oViewModel = this.getModel("ListaClientesView"),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.Belnr,
				sObjectName = oObject.Cliente;

			oViewModel.setProperty("/busy", false);
			// Add the object page to the flp routing history
			this.addHistoryEntry({
				title: this.getResourceBundle().getText("objectTitle") + " - " + sObjectName,
				icon: "sap-icon://enter-more",
				intent: "#Y5VC_PAINEL_NE2-display&/ZET_VCFI_COD_CLISet/" + sObjectId
			});

			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf Y5VC_PAINEL_NE2.Y5VC_PAINEL_NE2.view.Items
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Y5VC_PAINEL_NE2.Y5VC_PAINEL_NE2.view.Items
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Y5VC_PAINEL_NE2.Y5VC_PAINEL_NE2.view.Items
		 */
		//	onExit: function() {
		//
		//	}

	});

});