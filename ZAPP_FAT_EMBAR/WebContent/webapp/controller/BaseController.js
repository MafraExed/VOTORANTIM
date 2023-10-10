/*global history */
sap.ui.define([
					"sap/ui/core/mvc/Controller",
					"sap/ui/core/routing/History",
					"sap/m/Dialog",
					"sap/m/Button",
					"sap/m/Text"
	], function (
					Controller, 
					History, 
					Dialog, 
					Button, 
					Text) {
		
		"use strict";

		return Controller.extend("nasa.ui5.faturamentoEmbarque.controller.BaseController", {
			/**
			 * Convenience method for accessing the router in every controller of the application.
			 * @public
			 * @returns {sap.ui.core.routing.Router} the router for this component
			 */
			getRouter : function () {
				return this.getOwnerComponent().getRouter();
			},

			/**
			 * Convenience method for getting the view model by name in every controller of the application.
			 * @public
			 * @param {string} sName the model name
			 * @returns {sap.ui.model.Model} the model instance
			 */
			getModel : function (sName) {
				return this.getView().getModel(sName);
			},

			/**
			 * Convenience method for setting the view model in every controller of the application.
			 * @public
			 * @param {sap.ui.model.Model} oModel the model instance
			 * @param {string} sName the model name
			 * @returns {sap.ui.mvc.View} the view instance
			 */
			setModel : function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
			},

			/**
			 * Convenience method for getting the resource bundle.
			 * @public
			 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
			 */
			getResourceBundle : function () {
				return this.getOwnerComponent().getModel("i18n").getResourceBundle();
			},

			/**
			 * Event handler for navigating back.
			 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
			 * If not, it will replace the current entry of the browser history with the master route.
			 * @public
			 */
			onNavBack : function() {
				var sPreviousHash = History.getInstance().getPreviousHash(),
					oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

					if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
					history.go(-1);
				} else {
					this.getRouter().navTo("master", {}, true);
				}
			},
			
			/**
			 * Event handler for Hide or Show Master View.
			 * @public
			 */
			onHideUnhideMaster: function(sMode){
				if(!sap.ui.Device.system.phone){
					var oSplitApp = this.getOwnerComponent().getAggregation("rootControl").byId("idAppControl");
					oSplitApp.setMode(sMode);
				}
			},
			
			/**
			 * Event handler for Message Confirmation Choose.
			 * @public
			 */
			onMessageConfirmation: function(sQuestion, sButtonTextOK, sButtonTextNOK, sFunctionOK, sFunctionNOK){
				var dialog = new Dialog({
								            title: this.getResourceBundle().getText("titleMessageConfirm"),
								            type: 'Message',
								            content: new Text({ text: sQuestion }),
								            beginButton: new Button({
															              text: sButtonTextOK,
															              press: function () {
															                dialog.close();
															                if(!!sFunctionOK)
															                	sFunctionOK();
															              }
								            						}),
								            endButton: new Button({
															              text: sButtonTextNOK,
															              press: function () {
															                dialog.close();
															                if(!!sFunctionNOK)
															            		sFunctionNOK();
															              }
								            						}),
								            afterClose: function() {
															              dialog.destroy();
															              return false;
															            }
								          							});
		          dialog.open();
			}
		});
	}
);