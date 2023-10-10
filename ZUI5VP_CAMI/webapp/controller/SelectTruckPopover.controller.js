sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"FibriaStatusViagem/webServices/conections"
], function(BaseController, MessageBox, Utilities, History, conections) {
	"use strict";

	return BaseController.extend("FibriaStatusViagem.controller.SelectTruckPopover", {
		composition: [],
		selectedItem: {},
		setRouter: function(oRouter) {
			this.oRouter = oRouter;

		},
		afterOpen: function(Event) {
			Event.getSource().setEscapeHandler(function(oPromise) {
				oPromise.reject();
			});
		},
		getBindingParameters: function() {
			return {};

		},
		_onAddFiltersButtonPress: function(oEvent){
			this.openDialog("DialogCompositionFilters");
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

					aFilters.push(new sap.ui.model.Filter("Centro", sap.ui.model.FilterOperator.Contains, sQuery));
					aFilters.push(new sap.ui.model.Filter("CodTransp", sap.ui.model.FilterOperator.Contains, sQuery));
					aFilters.push(new sap.ui.model.Filter("Composicao", sap.ui.model.FilterOperator.Contains, sQuery));
					aFilters.push(new sap.ui.model.Filter("PlcCarro1", sap.ui.model.FilterOperator.Contains, sQuery));
					aFilters.push(new sap.ui.model.Filter("PlcCarro2", sap.ui.model.FilterOperator.Contains, sQuery));
					aFilters.push(new sap.ui.model.Filter("PlcCavalo", sap.ui.model.FilterOperator.Contains, sQuery));
					aFilters.push(new sap.ui.model.Filter("TagComp", sap.ui.model.FilterOperator.Contains, sQuery));
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
		_onCompositionItemPress:function(oEvent){
			var oModel = oEvent.getSource().getSelectedItem().getBindingContext("composition").getModel().getData();
			var path = oEvent.getSource().getSelectedItem().getBindingContext("composition").getPath();
			var index = parseInt(path.substring(path.lastIndexOf("/") + 1,path.length), 10);
			var oItem = oModel[index];
			this.selectedItem = oItem;
		},
		_onClosePopoverButtonPress: function(){
			this.closePopover();
		},
		_onConfirmCodeButtonPress: function() {
			if(this.selectedItem.Composicao){
				this.closePopover();
				var oEventBus = sap.ui.getCore().getEventBus();
				oEventBus.publish("App", "TripSelected", this.selectedItem);
			}
			else{
				sap.m.MessageToast.show("Selecione uma Composição", {
					duration: 3000
				});
			}
		},
		closePopover: function(){
			var oPopover = this.getView().getContent()[0];
			oPopover.close();
		},
		openDialog: function(dialogName, eventBusData, eventBusName){
			var sDialogName = dialogName;
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			var oView;
			if (!oDialog) {
				this.getOwnerComponent().runAsOwner(function () {
					oView = sap.ui.xmlview({
						viewName: "FibriaStatusViagem.view." + sDialogName
					});
					this.getView().addDependent(oView);
					oView.getController().setRouter(this.oRouter);
					oDialog = oView.getContent()[0];
					this.mDialogs[sDialogName] = oDialog;

				}.bind(this));
			}
			if(eventBusData){
				var oEventBus = sap.ui.getCore().getEventBus();
				oEventBus.publish(dialogName, eventBusName, eventBusData);	
			}

			return new Promise(function (fnResolve) {
				oDialog.attachEventOnce("afterOpen", null, fnResolve);
				oDialog.open();
				if (oView) {
					oDialog.attachAfterOpen(function () {
						oDialog.rerender();
					});
				} else {
					oView = oDialog.getParent();
				}

				var oModel = this.getView().getModel();
				if (oModel) {
					oView.setModel(oModel);
				}
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});
		},
		setCompositionModel: function(oData){
			this.composition = oData;
			var oJSON = new sap.ui.model.json.JSONModel();
			oJSON.setData(this.composition);
			this.getView().setModel(oJSON, 'composition');
		},
		selectTruck: function(filters){
			var aFilters = [];
			var stringParam = "/ZET_VPWM_COMPOSICAOSET";
			
			if(filters.centerValue){
				var oFilter = new sap.ui.model.Filter({
	                path: "Centro",
	                operator: sap.ui.model.FilterOperator.EQ,
	                value1: sap.ui.getCore().getModel("SelectedDestination").CentroOrigem
	            });
	            aFilters.push(oFilter);
	            
	            oFilter = new sap.ui.model.Filter({
	                path: "Composicao",
	                operator: sap.ui.model.FilterOperator.Contains,
	                value1: filters.compositionValue
	            });
	            aFilters.push(oFilter);	
	            
	            oFilter = new sap.ui.model.Filter({
	                path: "PlcCavalo",
	                operator: sap.ui.model.FilterOperator.Contains,
	                value1: filters.truckValue
	            });
	            aFilters.push(oFilter);
	            
	            oFilter = new sap.ui.model.Filter({
	                path: "PlcCarro1",
	                operator: sap.ui.model.FilterOperator.Contains,
	                value1: filters.carreta1Value
	            });
	            aFilters.push(oFilter);
	            
	            oFilter = new sap.ui.model.Filter({
	                path: "PlcCarro2",
	                operator: sap.ui.model.FilterOperator.Contains,
	                value1: filters.carreta2Value
	            });
	            aFilters.push(oFilter);
			}
			else{
				var oFilter = new sap.ui.model.Filter({
	                path: "Centro",
	                operator: sap.ui.model.FilterOperator.EQ,
	                value1: sap.ui.getCore().getModel("SelectedDestination").CentroOrigem
	            });
	            aFilters.push(oFilter);	
			}
			
			conections.consumeModel(stringParam,
				function(oData, oResponse) {
					sap.ui.getCore().getModel("truckPopover").setCompositionModel(oData.results);
				},
				function(err) {
					sap.m.MessageToast.show("Erro inesperado", {
						duration: 3000
					});
				}, "", aFilters);
		},
		setFilters: function(sChanel, sEvent, oData){
			this.selectTruck(oData);
		},
		onInit: function() {
			sap.ui.getCore().setModel(this, "truckPopover");
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("SelectTruckPopover", "selectTruck", this.selectTruck, this);
			oEventBus.subscribe("DialogCompositionFilters", "FiltersSet", this.setFilters, this);
			this._oDialog = this.getView().getContent()[0];

		},
		onExit: function() {
			this._oDialog.destroy();

		}
	});
}, /* bExport= */ true);