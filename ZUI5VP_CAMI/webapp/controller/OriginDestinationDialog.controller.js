sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"FibriaStatusViagem/webServices/conections"
], function(BaseController, MessageBox, Utilities, History, conections) {
	"use strict";

	return BaseController.extend("FibriaStatusViagem.controller.OriginDestinationDialog", {
		setRouter: function(oRouter) {
			this.oRouter = oRouter;
		},
		closeDialog: function() {
			var oDialog = this.getView().getContent()[0];
			oDialog.close();
		},
		setOffline: function(){
			this.closeDialog();
		},
		onAfterOpen: function(oEvent){
			oEvent.getSource().setEscapeHandler(function(oPromise) {
				oPromise.reject();
			});
			var stringParam = "/ZET_VPWM_CENTRO_MOTORISTASet";
			var aFilters = [];
			var param = { "$expand": "CentroMotoristaToDestinoNav" };
			conections.consumeModel(stringParam,
				
				function(oData, oResponse) {
				},
				function(err) {
					sap.ui.getCore().getModel("OriginDestinationDialog").setOffline();
				}, param , aFilters);	
		},
		openDialog: function(dialogName, eventBusData, eventBusName) {
			var sDialogName = dialogName;
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			var oView;
			if (!oDialog) {
				this.getOwnerComponent().runAsOwner(function() {
					oView = sap.ui.xmlview({
						viewName: "FibriaStatusViagem.view." + sDialogName
					});
					this.getView().addDependent(oView);
					oView.getController().setRouter(this.oRouter);
					oDialog = oView.getContent()[0];
					this.mDialogs[sDialogName] = oDialog;

				}.bind(this));
			}
			if (eventBusData) {
				var oEventBus = sap.ui.getCore().getEventBus();
				oEventBus.publish(dialogName, eventBusName, eventBusData);
			}

			return new Promise(function(fnResolve) {
				oDialog.attachEventOnce("afterOpen", null, fnResolve);
				oDialog.open();
				if (oView) {
					oDialog.attachAfterOpen(function() {
						oDialog.rerender();
					});
				} else {
					oView = oDialog.getParent();
				}

				var oModel = this.getView().getModel();
				if (oModel) {
					oView.setModel(oModel);
				}
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {}
			});
		},
		_onSearchFieldLiveChange: function(oEvent) {
			var sControlId = "destinationList";
			var oControl = this.getView().byId(sControlId);

			// Get the search query, regardless of the triggered event ('query' for the search event, 'newValue' for the liveChange one).
			var sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue");
			var sSourceId = oEvent.getSource().getId();

			return new Promise(function(fnResolve) {
				var aFinalFilters = [];

				var aFilters = [];
				// 1) Search filters (with OR)
				if (sQuery && sQuery.length > 0) {

					aFilters.push(new sap.ui.model.Filter("CentroOrigem", sap.ui.model.FilterOperator.Contains, sQuery));
					aFilters.push(new sap.ui.model.Filter("Deposito", sap.ui.model.FilterOperator.Contains, sQuery));
					aFilters.push(new sap.ui.model.Filter("CentroDestino", sap.ui.model.FilterOperator.Contains, sQuery));
					aFilters.push(new sap.ui.model.Filter("DescricaoDeposito", sap.ui.model.FilterOperator.Contains, sQuery));
					aFilters.push(new sap.ui.model.Filter("DescricaoCentroDestino", sap.ui.model.FilterOperator.Contains, sQuery));
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
		_onDestinationItemPress: function(oEvent) {
			var oModel = oEvent.getSource().getSelectedItem().getBindingContext("destinations").getModel().getData();
			var path = oEvent.getSource().getSelectedItem().getBindingContext("destinations").getPath();
			var index = parseInt(path.substring(path.lastIndexOf("/") + 1, path.length), 10);
			var oItem = oModel[index];
			sap.ui.getCore().setModel(oItem, "SelectedDestination");
			this.openDialog("SelectTruckPopover", 1, "selectTruck");
			this.closeDialog();
		},
		onSetModel: function(sChanel, SEvent, oData) {
			var json = new sap.ui.model.json.JSONModel();
			json.setData(oData.destinations);
			this.getView().setModel(json, "destinations");
		},
		onInit: function() {
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("OriginDestinationDialog", "onSetModel", this.onSetModel, this);
			sap.ui.getCore().setModel(this, "OriginDestinationDialog");
			this._oDialog = this.getView().getContent()[0];
		},
		onExit: function() {
			this._oDialog.destroy();

		}

	});
}, /* bExport= */ true);