/*global location*/
sap.ui.define([
		"fibria/com/ZFBC_AMEACAS/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"fibria/com/ZFBC_AMEACAS/model/formatter",
		"sap/viz/ui5/controls/common/feeds/FeedItem",
	    "sap/viz/ui5/format/ChartFormatter",
	    "sap/viz/ui5/api/env/Format"
	], function (
		BaseController,
		JSONModel,
		History,
		formatter,
		FeedItem, ChartFormatter, Format
	) {
		"use strict";

		return BaseController.extend("fibria.com.ZFBC_AMEACAS.controller.Object", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			/**
			 * Called when the worklist controller is instantiated.
			 * @public
			 */
			oVizFrame : null,
			onInit : function () {
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				Format.numericFormatter(ChartFormatter.getInstance());
            	var formatPattern = ChartFormatter.DefaultPattern,
					iOriginalBusyDelay,
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
			},
			onAfterRendering: function() {
				var path = $.sap.getModulePath("fibria.com.ZFBC_AMEACAS", "/image/Impacto.png");
				this.getView().byId("imgImpacto").setSrc(path);
				
				path = $.sap.getModulePath("fibria.com.ZFBC_AMEACAS", "/image/Probabilidade.png");
				this.getView().byId("imgProbabilidade").setSrc(path);
			},
			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * Event handler when the share in JAM button has been clicked
			 * @public
			 */
			/*
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
			*/
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
				var oViewModel = this.getModel("objectView"),
					vAmeacasFilters = sap.ui.getCore().getModel("VAmeacasFilters"),
					organizacao =  vAmeacasFilters.organizacao,
					catrisco =  vAmeacasFilters.catrisco,
					fdrisco =  vAmeacasFilters.fdrisco,
					begda = vAmeacasFilters.begda,
					//begda =  new Date(oEvent.getParameter("arguments").begda),
					//begda =  oEvent.getParameter("arguments").begda !== " " ? new Date(new Date(oEvent.getParameter("arguments").begda).getTime() - TZOffsetMs): new Date(),
					tipovisao =  vAmeacasFilters.tipovisao;
					
				oViewModel.setProperty("/busy", true);

				this._mFilters = [];
				if (organizacao !== null && organizacao !== "") {
					this._mFilters.push(new sap.ui.model.Filter("Organizacao", "EQ", organizacao));
				}
				if (catrisco !== null && catrisco !== "") { 
					this._mFilters.push(new sap.ui.model.Filter("Catrisco", "EQ", catrisco));
				}
				if (fdrisco !== null && fdrisco !== "") { 
					this._mFilters.push(new sap.ui.model.Filter("Fdrisco", sap.ui.model.FilterOperator.Contains, fdrisco));
				}
				if (begda !== null && begda !== "") {
					var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
					this._mFilters.push(new sap.ui.model.Filter("Begda", "EQ", new Date(new Date(begda).getTime() - TZOffsetMs)));
				}
				
				var heatmapModel = new JSONModel({
					matrizimpactoameaca: [{
						Probabilidade: "Remota",
						Impacto: "Menor",
						Valor: 0,
						RiscoQuadrante: []
					}, {
						Probabilidade: "Remota",
						Impacto: "Moderado",
						Valor: 0,
						RiscoQuadrante: []
					}, {
						Probabilidade: "Remota",
						Impacto: "Maior",
						Valor: 0,
						RiscoQuadrante: []
					}, {
						Probabilidade: "Remota",
						Impacto: "Extremo",
						Valor: 0,
						RiscoQuadrante: []
					}, {
						Probabilidade: "Possível",
						Impacto: "Menor",
						Valor: 0,
						RiscoQuadrante: []
					}, {
						Probabilidade: "Possível",
						Impacto: "Moderado",
						Valor: 0,
						RiscoQuadrante: []
					}, {
						Probabilidade: "Possível",
						Impacto: "Maior",
						Valor: 0,
						RiscoQuadrante: []
					}, {
						Probabilidade: "Possível",
						Impacto: "Extremo",
						Valor: 0,
						RiscoQuadrante: []
					}, {
						Probabilidade: "Provável",
						Impacto: "Menor",
						Valor: 0,
						RiscoQuadrante: []
					}, {
						Probabilidade: "Provável",
						Impacto: "Moderado",
						Valor: 0,
						RiscoQuadrante: []
					}, {
						Probabilidade: "Provável",
						Impacto: "Maior",
						Valor: 0,
						RiscoQuadrante: []
					}, {
						Probabilidade: "Provável",
						Impacto: "Extremo",
						Valor: 0,
						RiscoQuadrante: []
					}, {
						Probabilidade: "Muito Provável",
						Impacto: "Menor",
						Valor: 0,
						RiscoQuadrante: []
					}, {
						Probabilidade: "Muito Provável",
						Impacto: "Moderado",
						Valor: 0,
						RiscoQuadrante: []
					}, {
						Probabilidade: "Muito Provável",
						Impacto: "Maior",
						Valor: 0,
						RiscoQuadrante: []
					}, {
						Probabilidade: "Muito Provável",
						Impacto: "Extremo",
						Valor: 0,
						RiscoQuadrante: []
					}]
				});
				this.setModel(heatmapModel, "heatmapModel");
				
				this.getModel().read("/GeralRiscos", {
					success: function(oData) {
						var matrizimpactoameaca = heatmapModel.getData().matrizimpactoameaca;
						for (var i = 0; i < oData.results.length; i++) {
							var probalilidade, impacto, nivelRisco;
							if (tipovisao === "01") {
								probalilidade = oData.results[i].Proin;
								impacto = oData.results[i].Nimpacin;
								nivelRisco = oData.results[i].Riscoin;
							}
							else if (tipovisao === "02") {
								probalilidade = oData.results[i].Prore;
								impacto = oData.results[i].Nimpacre;
								nivelRisco = oData.results[i].Riscore;
							}
							else if (tipovisao === "03") {
								probalilidade = oData.results[i].Prorep;
								impacto = oData.results[i].Nimpacrep;
								nivelRisco = oData.results[i].Riscorep;
							}
							if (probalilidade !== undefined && probalilidade !== "" && impacto !== undefined && impacto !== "") {
								for (var z = 0; z < matrizimpactoameaca.length; z++) {
									if (matrizimpactoameaca[z].Probabilidade.toUpperCase() === probalilidade.toUpperCase() && 
										matrizimpactoameaca[z].Impacto.toUpperCase() === impacto.toUpperCase()) {
										matrizimpactoameaca[z].Valor = matrizimpactoameaca[z].Valor + 1;
										matrizimpactoameaca[z].RiscoQuadrante.push(
											{
											Objid: oData.results[i].Objid,
											Risco: oData.results[i].Risco,
											Descricao: oData.results[i].Descricao,
											Organizacao: oData.results[i].Organizacao,
											Fdrisco: oData.results[i].Fdrisco,
											Prob: probalilidade,
											Nimpac: impacto,
											Nrisco: nivelRisco
										});
									}
								}
							}
						}
						heatmapModel.setProperty("/matrizimpactoameaca", matrizimpactoameaca);
						oViewModel.setProperty("/busy", false);
					},
					filters: this._mFilters
				});
			},
			openTableRisco: function(oEvent) {
				//var sInputValue = oEvent.getSource().getValue();
				//this.inputId = oEvent.getSource().getId();
				// create value help dialog
				var btnId = oEvent.getSource().getId().substring(oEvent.getSource().getId().indexOf("btn") + 3 , oEvent.getSource().getId().lenght);
				if (!this._valueHelpDialogTableRisco) {
					this._valueHelpDialogTableRisco = sap.ui.xmlfragment("fibria.com.ZFBC_AMEACAS.fragment.TableRiscos", this);
					this.getView().addDependent(this._valueHelpDialogTableRisco);
				}
				// create a filter for the binding
				//this._valueHelpDialogOrganizacao.getBinding("items").filter([new Filter("Stext", sap.ui.model.FilterOperator.Contains, sInputValue)]);
				// open value help dialog filtered by the input value
				//this._valueHelpDialogOrganizacao.open(sInputValue);
				var heatmapModel =  this.getModel("heatmapModel"),
					oTable = sap.ui.getCore().byId("tblRiskIntersection");
				
				oTable.setModel(new JSONModel(heatmapModel.getData().matrizimpactoameaca[btnId]));
				this._valueHelpDialogTableRisco.open();
			},
			closeTableRisco: function(evt) {
				this._valueHelpDialogTableRisco.close();
			},
			onNavToFichaRisco: function(evt) {
				this._valueHelpDialogTableRisco.close();
				this.getRouter().navTo("fichaRisco", {
					objectId: evt.getSource().getBindingContext().getProperty("Objid"),
					objectType: "OF"
				});
			}
			/**
			 * Binds the view to the object path.
			 * @function
			 * @param {string} sObjectPath path to the object to be bound
			 * @private
			 */
			 /*
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
			*/

		});

	}
);