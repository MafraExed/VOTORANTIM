/*global history */
sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/routing/History",
		"sap/m/Dialog",
		"sap/m/Button",
		"sap/m/Text",
		"sap/m/MessageBox",
		"sap/m/MessageToast",
		'sap/m/MessagePopover',
		'sap/m/MessagePopoverItem',
		'sap/ui/model/Sorter',
		"y5fb/ui5/Dashboard/model/formatter"
	], function (Controller, History, Dialog, Button, Text, MessageBox, MessageToast, MessagePopover, MessagePopoverItem, Sorter, formatter) {
		"use strict";

		return Controller.extend("y5fb.ui5.Dashboard.controller.BaseController", {

			getRouter : function () {
				
				return this.getOwnerComponent().getRouter();
			},

			getModel : function (sName) {
				
				return this.getView().getModel(sName);
			},

			setModel : function (oModel, sName) {
				
				return this.getView().setModel(oModel, sName);
			},


			getResourceBundle : function () {
				
				return this.getOwnerComponent().getModel("i18n").getResourceBundle();
			},

			getTextI18n: function (pId) {
				return this.getResourceBundle().getText(pId);
			},
			
			
			onNavBack : function() {
				var sPreviousHash = History.getInstance().getPreviousHash(),
					oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

					if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
					history.go(-1);
				} else {
					this.getRouter().navTo("main", {}, true);
				}
			}

			
                
		});

	}
);