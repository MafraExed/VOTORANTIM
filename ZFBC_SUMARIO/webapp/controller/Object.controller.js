/*global location*/
sap.ui.define([
		"fibria/com/ZFBC_SUMARIO/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"fibria/com/ZFBC_SUMARIO/model/formatter"
	], function (
		BaseController,
		JSONModel,
		History,
		formatter
	) {
		"use strict";

		return BaseController.extend("fibria.com.ZFBC_SUMARIO.controller.Object", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			/**
			 * Called when the worklist controller is instantiated.
			 * @public
			 */
			onInit : function () {
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var iOriginalBusyDelay,
					oViewModel = new JSONModel({
						busy : true,
						delay : 0
					});

				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

				// Store original busy indicator delay, so it can be restored later on
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
				this.setModel(oViewModel, "objectView");
				this.getOwnerComponent().getModel().metadataLoaded().then(function () {
						// Restore original busy indicator delay for the object view
						oViewModel.setProperty("/delay", iOriginalBusyDelay);
					}
				);
				
				var heatmapModel = new JSONModel({
					"matrizimpactoameaca": [{
						"Probabilidade": "Remota",
						"Impacto": "Menor",
						"Cor": "1"
					}, {
						"Probabilidade": "Remota",
						"Impacto": "Moderado",
						"Cor": "1"
					}, {
						"Probabilidade": "Remota",
						"Impacto": "Maior",
						"Cor": "2"
					}, {
						"Probabilidade": "Remota",
						"Impacto": "Extremo",
						"Cor": "3"
					}, {
						"Probabilidade": "Possível",
						"Impacto": "Menor",
						"Cor": "1"
					}, {
						"Probabilidade": "Possível",
						"Impacto": "Moderado",
						"Cor": "2"
					}, {
						"Probabilidade": "Possível",
						"Impacto": "Maior",
						"Cor": "3"
					}, {
						"Probabilidade": "Possível",
						"Impacto": "Extremo",
						"Cor": "4"
					}, {
						"Probabilidade": "Provável",
						"Impacto": "Menor",
						"Cor": "2"
					}, {
						"Probabilidade": "Provável",
						"Impacto": "Moderado",
						"Cor": "3"
					}, {
						"Probabilidade": "Provável",
						"Impacto": "Maior",
						"Cor": "4"
					}, {
						"Probabilidade": "Provável",
						"Impacto": "Extremo",
						"Cor": "5"
					}, {
						"Probabilidade": "Muito Provável",
						"Impacto": "Menor",
						"Cor": "3"
					}, {
						"Probabilidade": "Muito Provável",
						"Impacto": "Moderado",
						"Cor": "4"
					}, {
						"Probabilidade": "Muito Provável",
						"Impacto": "Maior",
						"Cor": "5"
					}, {
						"Probabilidade": "Muito Provável",
						"Impacto": "Extremo",
						"Cor": "5"
					}],
					"matrizimpactooportunidade": [{
						"Probabilidade": "Remota",
						"Impacto": "Extremo",
						"Cor": "3"
					}, {
						"Probabilidade": "Remota",
						"Impacto": "Maior",
						"Cor": "2"
					}, {
						"Probabilidade": "Remota",
						"Impacto": "Moderado",
						"Cor": "1"
					}, {
						"Probabilidade": "Remota",
						"Impacto": "Menor",
						"Cor": "1"
					}, {
						"Probabilidade": "Possível",
						"Impacto": "Extremo",
						"Cor": "4"
					}, {
						"Probabilidade": "Possível",
						"Impacto": "Maior",
						"Cor": "3"
					}, {
						"Probabilidade": "Possível",
						"Impacto": "Moderado",
						"Cor": "2"
					}, {
						"Probabilidade": "Possível",
						"Impacto": "Menor",
						"Cor": "1"
					}, {
						"Probabilidade": "Provável",
						"Impacto": "Extremo",
						"Cor": "5"
					}, {
						"Probabilidade": "Provável",
						"Impacto": "Maior",
						"Cor": "4"
					}, {
						"Probabilidade": "Provável",
						"Impacto": "Moderado",
						"Cor": "3"
					}, {
						"Probabilidade": "Provável",
						"Impacto": "Menor",
						"Cor": "2"
					}, {
						"Probabilidade": "Muito Provável",
						"Impacto": "Extremo",
						"Cor": "5"
					}, {
						"Probabilidade": "Muito Provável",
						"Impacto": "Maior",
						"Cor": "5"
					}, {
						"Probabilidade": "Muito Provável",
						"Impacto": "Moderado",
						"Cor": "4"
					}, {
						"Probabilidade": "Muito Provável",
						"Impacto": "Menor",
						"Cor": "3"
					}]
				});
				this.setModel(heatmapModel, "heatmapModel");
	
				var oVizFrame = this.oVizFrame = this.getView().byId("vzfMatrizImpacto");
				oVizFrame.setModel(heatmapModel);
				oVizFrame.setVizProperties({
					plotArea: {
						background: {
							border: {
								top: {
									visible: false
								},
								bottom: {
									visible: false
								},
								left: {
									visible: false
								},
								right: {
									visible: false
								}
							}
						}
					},
					legend: {
						visible: false
					},
					title: {
						visible: false
					}
				});
	
				oVizFrame.setVizScales([{
					"feed": "color",
					"type": "color",
					"numOfSegments": 5,
					"palette": [
						"#92D050",
						"#00B050",
						"#FFFF00",
						"#DE8703",
						"#FF0000"
					]
				}]);
				/*
				oVizFrame.setVizScales([{
					"feed": "color",
					"type": "color",
					"numOfSegments": 5,
					"palette": [
						"#DEEBF7",
						"#9DC3E6",
						"#00B0F0",
						"#2E75b6",
						"#1F4E79"
					]
				}]);
				*/
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * Event handler when the share in JAM button has been clicked
			 * @public
			 */
			onShareInJamPress : function () {
				var oViewModel = this.getModel("objectView"),
					oShareDialog = sap.ui.getCore().createComponent({
						name: "sap.collaboration.components.fiori.sharing.dialog",
						settings: {
							object:{
								id: location.href,
								share: oViewModel.getProperty("/shareOnJamTitle")
							}
						}
					});
				oShareDialog.open();
			},


			/* =========================================================== */
			/* internal methods                                            */
			/* =========================================================== */

			/**
			 * Binds the view to the object path.
			 * @function
			 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
			 * @private
			 */
			_onObjectMatched : function (oEvent) {
				//var sObjectId =  oEvent.getParameter("arguments").objectId;
				/*
				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("GeralRiscos",  {
						Objid :  sObjectId
					});
					this._bindView("/" + sObjectPath);
				}.bind(this));
				/*
				var listBinding = this.getModel().bindList("GeralRiscos");
				// call OData service and handle results
				listBinding.attachChange(function (oEvent) {
					listBinding.detachChange(function (oEvent) {
					});
					var aTotals = oEvent.oSource.getContexts().length;
				});
				listBinding.getContexts();
				*/
				var oViewModel = this.getModel("objectView");
				oViewModel.setProperty("/busy", false);
			},

			/**
			 * Binds the view to the object path.
			 * @function
			 * @param {string} sObjectPath path to the object to be bound
			 * @private
			 */
			_bindView : function (sObjectPath) {
				var oViewModel = this.getModel("objectView"),
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

			_onBindingChange : function () {
				var oView = this.getView(),
					oViewModel = this.getModel("objectView"),
					oElementBinding = oView.getElementBinding();

				// No data for the binding
				if (!oElementBinding.getBoundContext()) {
					this.getRouter().getTargets().display("objectNotFound");
					return;
				}

				var oResourceBundle = this.getResourceBundle(),
					oObject = oView.getBindingContext().getObject(),
					sObjectId = oObject.Objid,
					sObjectName = oObject.Risco;

				// Everything went fine.
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
				oViewModel.setProperty("/shareOnJamTitle", sObjectName);
				oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
				oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
			}

		});

	}
);