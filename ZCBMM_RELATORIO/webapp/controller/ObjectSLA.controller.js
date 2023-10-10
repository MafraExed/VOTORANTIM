/*global location*/
sap.ui.define([
	"ZCBMM_RELATORIO/ZCBMM_RELATORIO/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"ZCBMM_RELATORIO/ZCBMM_RELATORIO/model/formatter",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(
	BaseController,
	JSONModel,
	History,
	formatter,
	MessageBox,
	Filter,
	FO
) {
	"use strict";

	return BaseController.extend("ZCBMM_RELATORIO.ZCBMM_RELATORIO.controller.ObjectSLA", {

		formatter: formatter,

		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getRouter().getRoute("objectSla").attachPatternMatched(this._onObjectMatched, this);
			this.getOwnerComponent().getModel().metadataLoaded().then(function() {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

			this.colorPalette = ["#5cbae6", "#b6d957", "#fac364"];
			var chartContainer = this.getView().byId("idChartContainerSla");
			chartContainer.detachContentChange();
			var oDataset = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: 'Status',
					value: "{Status}"
				}, {
					name: 'Situacao',
					value: "{Situacao}"
				}],
				measures: [{
					name: 'Valor',
					value: '{Valor}'
				}],
				data: {
					path: "/ZET_CBMM_CF_AN_SLASet"
				}
			});
			var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
					'uid': "primaryValues",
					'type': "Measure",
					'values': ["Valor"]
				}),
				feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem({
					'uid': "axisLabels",
					'type': "Dimension",
					'values': ["Situacao", "Status"]
				});

			// -------- VizFrame ----------------
			this.chartPopover = this.getView().byId("idPopOverSla");
			this.oVizFrame = this.getView().byId("idoVizFrameSla");
			this.oVizFrame.setDataset(oDataset);
			this.oVizFrame.setModel(this.getView().getModel());
			this.oVizFrame.addFeed(feedPrimaryValues);
			this.oVizFrame.addFeed(feedAxisLabels);
			this.oVizFrame.setVizType('column');
			this.oVizFrame.setVizProperties({
				plotArea: {
					dataPointStyle: {
						rules: [{
							dataContext: {
								Status: 'Com atraso'
							},
							properties: {
								color: '#bb0000'
							},
							displayName: 'Com atraso',
							dataName: {
								Status: 'Status'
							}
						}, {
							dataContext: {
								Status: 'No prazo'
							},
							properties: {
								color: '#2b7c2b'
							},
							displayName: 'No prazo',
							dataName: {
								Status: 'Status'
							}
						}]
					}
				},
				legend: {
					title: {
						visible: false
					}
				},
				title: {
					visible: true,
					text: 'Relatório SLA'
				}
			});

			//Popover
			var popoverProps = {};
			this.chartPopover = new sap.viz.ui5.controls.Popover(popoverProps);

			this.chartPopover.setActionItems();
			this.chartPopover.connect(this.oVizFrame.getVizUid());

		},

		onChangeChart: function(evt) {
			var key = evt.getParameter("selectedItem").getKey();

			switch (key) {
				case 'Bar':
					this.oVizFrame.setVizType('bar');

					break;
				case 'Line':
					this.oVizFrame.setVizType('line');

					break;
				case 'Column':
					this.oVizFrame.setVizType("column");

					break;
				default:
			}

		},

		_onObjectMatched: function(oEvent) {
			var oParameter = oEvent.getParameter("arguments");
			var filters = [];
			for (var value in oParameter) {
				oParameter[value] = decodeURIComponent(oParameter[value]);
				var oFilter = (value === "DtInic") ?
					new Filter(value, FO.GE, oParameter[value]) :
					new Filter(value, FO.LE, oParameter[value]);
				filters.push(oFilter);
			}
			this.getModel().metadataLoaded().then(function() {
				this._bindView("/ZET_CBMM_CF_AN_SLASet", filters);
			}.bind(this));
		},

		_bindView: function(sObjectPath, filters) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("objectView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);
			this.getView().bindElement({
				path: sObjectPath
			});
			this.getView().byId("idoVizFrameSla").getDataset().getBinding("data").filter(filters).attachDataReceived(function(evt) {
				if (evt.getParameter("data").results.length === 0) {
					sap.m.MessageBox.error("Serviço não encontrou nenhum registro");
				}
			});
		},

		navButtonPress: function(evt) {
			this.getRouter().navTo("worklist");
		}
	});

});