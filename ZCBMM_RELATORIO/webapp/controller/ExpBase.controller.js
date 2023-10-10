/*global location*/
sap.ui.define([
	"ZCBMM_RELATORIO/ZCBMM_RELATORIO/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"ZCBMM_RELATORIO/ZCBMM_RELATORIO/model/formatter",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (
	BaseController,
	JSONModel,
	History,
	formatter,
	MessageBox,
	Filter,
	FO
) {
	"use strict";

	return BaseController.extend("ZCBMM_RELATORIO.ZCBMM_RELATORIO.controller.ExpBase", {

		formatter: formatter,

		onInit: function () {
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
			this.setModel(oViewModel, "ExpBase");
			this.getRouter().getRoute("ExpBase").attachPatternMatched(this._onObjectMatched, this);

			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

		},

		_onObjectMatched: function (oEvent) {

			var oParameter = oEvent.getParameter("arguments");
			var filters = [];
			for (var value in oParameter) {
				oParameter[value] = decodeURIComponent(oParameter[value]);
				var oFilter = (value === "DtInic") ?
					new Filter(value, FO.GE, oParameter[value]) :
					new Filter(value, FO.LE, oParameter[value]);
				filters.push(oFilter);
			}
			this.getView().byId("IdDtIni").setValue(filters[0].oValue1);
			this.getView().byId("IdDtFim").setValue(filters[1].oValue1);

			var smartTable = this.getView().byId("smartTable");
			smartTable.rebindTable();

		},

		_bindView: function (sObjectPath, filters) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("ExpBase");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);
			this.getView().bindElement({
				path: sObjectPath
			});
		},

		navButtonPress: function (evt) {
			this.getRouter().navTo("worklist");
		},

		onbeforeRebindTable: function (oEvent) {
			var dtinic = [];
			var dtfim = [];
			var sDtInic = this.getView().byId("IdDtIni").getValue();
			var sDtFim = this.getView().byId("IdDtFim").getValue();

			if (sDtInic !== "") {

				dtinic = sDtInic.split("-");
				if (dtinic[1] < 10) {
					sDtInic = dtinic[0] + "0" + dtinic[1] + dtinic[2];
				} else {
					sDtInic = dtinic[0] + dtinic[1] + dtinic[2];
				}

				dtfim = sDtFim.split("-");
				if (dtfim[1] < 10) {
					sDtFim = dtfim[0] + "0" + dtfim[1] + dtfim[2];
				} else {
					sDtFim = dtfim[0] + dtfim[1] + dtfim[2];
				}

				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "DT_INIC",
					operator: "EQ",
					value1: sDtInic
				}));

				oEvent.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "DT_FIM",
					operator: "EQ",
					value1: sDtFim
				}));
			}
		},
		onSelectIconTab: function(oEvent){
			var key = oEvent.getParameters().selectedKey;
			if (key === "0"){
				this.getView().byId("smartTable").rebindTable();
			}else {
				this.getView().byId("smartTable2").rebindTable();
			}
			
		},
		AfterUpdate: function (oEvent) {
			var count = this.getView().byId("table1").getBinding("rows").getLength();
			if (count>0){
				this.getView().byId("table1").setVisibleRowCount(count);
			}else{
				this.getView().byId("table1").setVisibleRowCount(1);
			}
		},
		
		AfterUpdate2: function(oEvent){
			var count = this.getView().byId("table2").getBinding("rows").getLength();
			
			if (count>0){
				this.getView().byId("table2").setVisibleRowCount(count);
			}else{
				this.getView().byId("table2").setVisibleRowCount(1);
			}
			
		}
			
		
	});

});