sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"FibriaStatusViagem/webServices/conections"
], function(BaseController, MessageBox, Utilities, History, conections) {
	"use strict";

	return BaseController.extend("FibriaStatusViagem.controller.DialogValueHelp", {
		value: [],
		selectedValue: "",
		originInput: "",
		setRouter: function(oRouter) {
			this.oRouter = oRouter;

		},
		_onCompositionItemPress:function(oEvent){
			var oModel = oEvent.getSource().getSelectedItem().getBindingContext("value").getModel().getData();
			var path = oEvent.getSource().getSelectedItem().getBindingContext("value").getPath();
			var index = parseInt(path.substring(path.lastIndexOf("/") + 1,path.length), 10);
			var oItem = oModel[index];
			this.selectedValue = oItem.value;
			var oData = {
				inputId: this.originInput,
				selectedValue: this.selectedValue
			};
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.publish("DialogValueHelp", "ValueSelected", oData);
			this.closeDialog();
		},
		_onCloseDialogButtonPress: function(oEvent){
			this.closeDialog();
		},
		_onSearchFieldLiveChange: function(oEvent){
			var sControlId = "compositionList";
			var oControl = this.getView().byId(sControlId);

			// Get the search query, regardless of the triggered event ('query' for the search event, 'newValue' for the liveChange one).
			var sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue");
			var sSourceId = oEvent.getSource().getId();

			return new Promise(function(fnResolve) {
				var aFinalFilters = [];

				var aFilters = [];
				// 1) Search filters (with OR)
				if (sQuery && sQuery.length > 0) {
					aFilters.push(new sap.ui.model.Filter("value", sap.ui.model.FilterOperator.Contains, sQuery));
				}

				aFinalFilters = aFilters.length > 0 ? [new sap.ui.model.Filter(aFilters, false)] : [];
				var oBindingOptions = this.updateBindingOptions(sControlId, {
					filters: aFinalFilters
				}, sSourceId);
				var oBindingInfo = oControl.getBindingInfo("items");
				oControl.bindAggregation("items", {
					model: oBindingInfo.model,
					path: oBindingInfo.path,
					parameters: oBindingInfo.parameters,
					template: oBindingInfo.template,
					sorter: oBindingOptions.sorters,
					filters: oBindingOptions.filters
				});
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		updateBindingOptions: function(sCollectionId, oBindingData, sSourceId) {
			this.mBindingOptions = this.mBindingOptions || {};
			this.mBindingOptions[sCollectionId] = this.mBindingOptions[sCollectionId] || {};

			var aSorters = this.mBindingOptions[sCollectionId].sorters;
			var oGroupby = this.mBindingOptions[sCollectionId].groupby;

			// If there is no oBindingData parameter, we just need the processed filters and sorters from this function
			if (oBindingData) {
				if (oBindingData.sorters) {
					aSorters = oBindingData.sorters;
				}
				if (oBindingData.groupby) {
					oGroupby = oBindingData.groupby;
				}
				// 1) Update the filters map for the given collection and source
				this.mBindingOptions[sCollectionId].sorters = aSorters;
				this.mBindingOptions[sCollectionId].groupby = oGroupby;
				this.mBindingOptions[sCollectionId].filters = this.mBindingOptions[sCollectionId].filters || {};
				this.mBindingOptions[sCollectionId].filters[sSourceId] = oBindingData.filters || [];
			}

			// 2) Reapply all the filters and sorters
			var aFilters = [];
			for (var key in this.mBindingOptions[sCollectionId].filters) {
				aFilters = aFilters.concat(this.mBindingOptions[sCollectionId].filters[key]);
			}

			// Add the groupby first in the sorters array
			if (oGroupby) {
				aSorters = aSorters ? [oGroupby].concat(aSorters) : [oGroupby];
			}

			var aFinalFilters = aFilters.length > 0 ? [new sap.ui.model.Filter(aFilters, true)] : undefined;
			return {
				filters: aFinalFilters,
				sorters: aSorters
			};
		},
		closeDialog: function(){
			var oDialog = this.getView().getContent()[0];
			oDialog.close();
		},
		setViewModel: function(sChanel, sEvent, oData){
			this.originInput = oData.inputId;
			this.getView().getContent()[0].setTitle(oData.title);
			this.byId("customTitle").setText(oData.title);
			this.value = oData.values;
			var oJSON = new sap.ui.model.json.JSONModel();
			oJSON.setData(this.value);
			this.getView().setModel(oJSON, 'value');
		},
		
		onInit: function() {
			sap.ui.getCore().setModel(this, "dialogValueHelp");
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("DialogValueHelp", "loadData", this.setViewModel, this);
			this._oDialog = this.getView().getContent()[0];

		},
		onExit: function() {
			this._oDialog.destroy();

		}
	
	});
}, /* bExport= */ true);