/*global history */
sap.ui.define([
		"br/com/suzano/ZUI5VP_SHIP_SOF/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/m/GroupHeaderListItem",
		"sap/ui/Device",
		"br/com/suzano/ZUI5VP_SHIP_SOF/model/formatter",
		"br/com/suzano/ZUI5VP_SHIP_SOF/model/grouper",
		"br/com/suzano/ZUI5VP_SHIP_SOF/model/GroupSortState",
		"br/com/suzano/ZUI5VP_SHIP_SOF/webServices/apiConnector"
	], function (BaseController, JSONModel, History, Filter, FilterOperator, GroupHeaderListItem, Device, formatter, grouper, GroupSortState, apiConnector) {
		"use strict";

		return BaseController.extend("br.com.suzano.ZUI5VP_SHIP_SOF.controller.Master", {

			formatter: formatter,
			_smartFilterBar: null,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			/**
			 * Called when the master list controller is instantiated. It sets up the event handling for the master/detail communication and other lifecycle tasks.
			 * @public
			 */
			onInit : function () {

				var oList = this.byId("travelList"),
					oViewModel = this._createViewModel(),
					// Put down master list's original value for busy indicator delay,
					// so it can be restored later on. Busy handling on the master list is
					// taken care of by the master list itself.
					iOriginalBusyDelay = oList.getBusyIndicatorDelay();

				this.oRouter = this.getOwnerComponent().getRouter();
				this._oGroupSortState = new GroupSortState(oViewModel, grouper.groupUnitNumber(this.getResourceBundle()));

				this._oList = oList;
				// keeps the filter and search state
				this._oListFilterState = {
					aFilter : [],
					aSearch : []
				};

				this.setModel(oViewModel, "masterView");
				// Make sure, busy indication is showing immediately so there is no
				// break after the busy indication for loading the view's meta data is
				// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
				oList.attachEventOnce("updateFinished", function(){
					// Restore original busy indicator delay for the list
					oViewModel.setProperty("/delay", iOriginalBusyDelay);
				});
				
				this.getView().addEventDelegate({
					onBeforeFirstShow: function () {
						this.getBackendData();
				//		this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
					}.bind(this)
				});

				this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
				this.getRouter().attachBypassed(this.onBypassed, this);
				
				sap.ui.getCore().setModel(this, "controllerViewMaster");

////////////////////////////////////////////////////////////////////////////////////////////
				var oFilterBar = this.getView().byId("masterFilterBar");
				oFilterBar.setFilterBarExpanded(false);

				var oBasicSearch = new sap.m.SearchField({
					id: "searchField",
					showSearchButton: true,
					width: "100%",
					visible: "{= !${device>/support/touch} }",
					showRefreshButton: "{= !${device>/support/touch} }"
				});

				oBasicSearch.attachBrowserEvent("keyup", function (e) {
						if (e.which === 13) {
							this.onSearch();
						}
					}.bind(this)
				);
				oBasicSearch.attachSearch(function (oEvent) {
					this.onSearch(oEvent);
				}.bind(this), oBasicSearch);

				oBasicSearch.attachLiveChange(function(oEvent) {
					this.getView().byId("masterFilterBar").fireFilterChange(oEvent);
				}.bind(this), oBasicSearch);

				oFilterBar.setBasicSearch(oBasicSearch);
				//oFilterBar.setFilterContainerWidth("100%");
			},

			getBackendData: function() {

				var me = this;

				// Control state model
				me.zSetBusyTrue(me);
				var iFilter = [];
				iFilter.push(new sap.ui.model.Filter({
					path: "DataCreat",
					operator: sap.ui.model.FilterOperator.BT,
					value1: apiConnector.formatDate(me.getModel("masterView").getData().dateValue), //me.getModel("masterView").getData().dateValue.toLocaleDateString().substr(6,4) + me.getModel("masterView").getData().dateValue.toLocaleDateString().substr(3,2) + me.getModel("masterView").getData().dateValue.toLocaleDateString().substr(0,2),
					value2: apiConnector.formatDate(me.getModel("masterView").getData().secondDateValue) //me.getModel("masterView").getData().secondDateValue.toLocaleDateString().substr(6,4) + me.getModel("masterView").getData().secondDateValue.toLocaleDateString().substr(3,2) + me.getModel("masterView").getData().secondDateValue.toLocaleDateString().substr(0,2)
				}));

				var stringParam = "/ZET_VPWM_VIAGENSSet";
				apiConnector.consumeModel(stringParam, iFilter, {},
					function(oData, oResponse) {
						var model = new JSONModel();
						for(var i = 0; i < oData.results.length; i++) {
								oData.results[i].PercOpFormatted = parseFloat(oData.results[i].PercOperacional);
						}
						model.setData(oData);
						model.setProperty('/', oData);
						me.getView().setModel(model);
						me.zSetBusyFalse(me);
						if (oData.results.length > 1) {
							me.setVesselListFilter(model);
						}
					},
					function(err) {
						sap.m.MessageToast.show("Erro");
						me.zSetBusyFalse(me);
					}
				);
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * After list data is available, this handler method updates the
			 * master list counter and hides the pull to refresh control, if
			 * necessary.
			 * @param {sap.ui.base.Event} oEvent the update finished event
			 * @public
			 */
			onUpdateFinished : function (oEvent) {
				// update the master list object counter after new data is loaded
				this._updateListItemCount(oEvent.getParameter("total"));
				// hide pull to refresh if necessary
				this.byId("pullToRefresh").hide();
			},

			/**
			 * Event handler for the master search field. Applies current
			 * filter value and triggers a new search. If the search field's
			 * 'refresh' button has been pressed, no new search is triggered
			 * and the list binding is refresh instead.
			 * @param {sap.ui.base.Event} oEvent the search event
			 * @public
			 */
			onSearch : function (oEvent) {
				if (!oEvent) return;
				
				if (oEvent.getParameters().refreshButtonPressed) {
					// Search field's 'refresh' button has been pressed.
					// This is visible if you select any master list item.
					// In this case no new search is triggered, we only
					// refresh the list binding.
					this.onRefresh();
					return;
				}

				var sQuery = sap.ui.getCore().byId("searchField").getValue();
				if(!sQuery) {
					sQuery = oEvent.getParameter("query");
				}

				if (sQuery) {
					this._oListFilterState.aSearch = [new Filter("NomeNavio", FilterOperator.Contains, sQuery)];
				} else {
					this._oListFilterState.aSearch = [];
				}
				this._applyFilterSearch();

			},

			/**
			 * Event handler for refresh event. Keeps filter, sort
			 * and group settings and refreshes the list binding.
			 * @public
			 */
			onRefresh : function () {
				//this._oList.getBinding("items").refresh();
				this.getBackendData();
			},

			/**
			 * Event handler for the sorter selection.
			 * @param {sap.ui.base.Event} oEvent the select event
			 * @public
			 */
			onSort : function (oEvent) {
				var sKey = oEvent.getSource().getSelectedItem().getKey(),
					aSorters = this._oGroupSortState.sort(sKey);

				this._applyGroupSort(aSorters);
			},

			/**
			 * Event handler for the grouper selection.
			 * @param {sap.ui.base.Event} oEvent the search field event
			 * @public
			 */
			onGroup : function (oEvent) {
				var sKey = oEvent.getSource().getSelectedItem().getKey(),
					aSorters = this._oGroupSortState.group(sKey);

				this._applyGroupSort(aSorters);
			},

			/**
			 * Event handler for the filter button to open the ViewSettingsDialog.
			 * which is used to add or remove filters to the master list. This
			 * handler method is also called when the filter bar is pressed,
			 * which is added to the beginning of the master list when a filter is applied.
			 * @public
			 */
			onOpenViewSettings : function () {
				if (!this._oViewSettingsDialog) {
					this._oViewSettingsDialog = sap.ui.xmlfragment("br.com.suzano.ZUI5VP_SHIP_SOF.view.ViewSettingsDialog", this);
					this.getView().addDependent(this._oViewSettingsDialog);
					// forward compact/cozy style into Dialog
					this._oViewSettingsDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				}
				this._oViewSettingsDialog.open();
			},

			/**
			 * Event handler called when ViewSettingsDialog has been confirmed, i.e.
			 * has been closed with 'OK'. In the case, the currently chosen filters
			 * are applied to the master list, which can also mean that the currently
			 * applied filters are removed from the master list, in case the filter
			 * settings are removed in the ViewSettingsDialog.
			 * @param {sap.ui.base.Event} oEvent the confirm event
			 * @public
			 */
			onConfirmViewSettingsDialog : function (oEvent) {
				var aFilterItems = oEvent.getParameters().filterItems,
					aFilters = [],
					aCaptions = [];

				// update filter state:
				// combine the filter array and the filter string
				aFilterItems.forEach(function (oItem) {
					switch (oItem.getKey()) {
						case "Filter1" :
							aFilters.push(new Filter("VolEmbarcado", FilterOperator.LE, 100));
							break;
						case "Filter2" :
							aFilters.push(new Filter("VolEmbarcado", FilterOperator.GT, 100));
							break;
						default :
							break;
					}
					aCaptions.push(oItem.getText());
				});

				this._oListFilterState.aFilter = aFilters;
				this._updateFilterBar(aCaptions.join(", "));
				this._applyFilterSearch();
			},

			/**
			 * Event handler for the list selection event
			 * @param {sap.ui.base.Event} oEvent the list selectionChange event
			 * @public
			 */
			onSelectionChange : function (oEvent) {
				// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
				this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
			},

			/**
			 * Event handler for the bypassed event, which is fired when no routing pattern matched.
			 * If there was an object selected in the master list, that selection is removed.
			 * @public
			 */
			onBypassed : function () {
				this._oList.removeSelections(true);
			},

			/**
			 * Used to create GroupHeaders with non-capitalized caption.
			 * These headers are inserted into the master list to
			 * group the master list's items.
			 * @param {Object} oGroup group whose text is to be displayed
			 * @public
			 * @returns {sap.m.GroupHeaderListItem} group header with non-capitalized caption.
			 */
			createGroupHeader : function (oGroup) {
				return new GroupHeaderListItem({
					title : oGroup.text,
					upperCase : false
				});
			},

			/**
			 * Event handler for navigating back.
			 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
			 * If not, it will navigate to the shell home
			 * @public
			 */
			onNavBack : function() {
				var sPreviousHash = History.getInstance().getPreviousHash(),
					oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

				if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
					history.go(-1);
				} else {
					oCrossAppNavigator.toExternal({
						target: {shellHash: "#Shell-home"}
					});
				}
			},

			/* =========================================================== */
			/* begin: internal methods                                     */
			/* =========================================================== */

			_createViewModel : function() {
				var dDateValue = new Date();
				dDateValue.setDate(dDateValue.getDate()-7);
					
				return new JSONModel({
					isFilterBarVisible: false,
					filterBarLabel: "",
					delay: 0,
					busy: false,
					title: this.getResourceBundle().getText("masterTitleCount", [0]),
					noDataText: this.getResourceBundle().getText("masterListNoDataText"),
					sortBy: "NomeNavio",
					groupBy: "None",
					dateValue: dDateValue,
					secondDateValue: new Date()
				});
			},

			/**
			 * If the master route was hit (empty hash) we have to set
			 * the hash to to the first item in the list as soon as the
			 * listLoading is done and the first item in the list is known
			 * @private
			 */
			_onMasterMatched :  function() {
			//var objectCabecalhoOrdem =	this.byId("listNaviosCarga").getModel().getData()[oEvent.getSource().getBindingContext().getPath().split("/")[1]];
			//sap.ui.getCore().setModel(objectCabecalhoOrdem, "dadosCadbecalhoViewOrdem");

				this.getOwnerComponent().oListSelector.oWhenListLoadingIsDone.then(
					function (mParams) {
						if (mParams.list.getMode() === "None") {
							return;
						}
						var sObjectId = mParams.firstListitem.getBindingContext().getProperty("DocTransporte");
						this.getRouter().navTo("object", {objectId : sObjectId}, true);
					}.bind(this),
					function (mParams) {
						if (mParams.error) {
							return;
						}
						this.getRouter().getTargets().display("detailNoObjectsAvailable");
					}.bind(this)
				);
			},

			/**
			 * Shows the selected item on the detail page
			 * On phones a additional history entry is created
			 * @param {sap.m.ObjectListItem} oItem selected Item
			 * @private
			 */
			_showDetail : function (oItem) {
				var bReplace = !Device.system.phone;
				
				var model = new JSONModel();
				var objectCabEmb = oItem.getBindingContext().getProperty();
				
				if (objectCabEmb.DataInicio) {
					objectCabEmb.DataInicioFormatted = objectCabEmb.DataInicio.toDateString();
				}
				if(objectCabEmb.DataFim) {
					objectCabEmb.DataFimFormatted = objectCabEmb.DataFim.toDateString();
				}
				if(objectCabEmb.NomeNavio) {
					objectCabEmb.IniciaisNavio = (objectCabEmb.NomeNavio.indexOf(" ") < 1) ? objectCabEmb.NomeNavio.substr(0,2) : objectCabEmb.NomeNavio.substr(0,1) + objectCabEmb.NomeNavio.substr(objectCabEmb.NomeNavio.indexOf(" ") + 1, 1);
				}
				objectCabEmb.Changed = true;

				model.setData(objectCabEmb, "dadosCabEmbarque");
				sap.ui.getCore().setModel(model);

				/*this.DocTransporte = oItem.getBindingContext().getProperty("DocTransporte");
				this.ViagemArm = oItem.getBindingContext().getProperty("ViagemArm");
				this.CodigoNavio = oItem.getBindingContext().getProperty("CodigoNavio");*/

				//if (sap.ui.getCore().getModel("controllerViewDetail") !== undefined) {
				//sap.ui.controller("br.com.suzano.ZUI5VP_SHIP_SOF.controller.Detail")._bindView('/');
				//}

				var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
				this.oRouter.navTo("object", {Layout: oNextUIState.layout, DocTransporte: oItem.getBindingContext().getProperty("DocTransporte")}, bReplace);
			},

			/**
			 * Sets the item count on the master list header
			 * @param {integer} iTotalItems the total number of items in the list
			 * @private
			 */
			_updateListItemCount : function (iTotalItems) {
				var sTitle;
				// only update the counter if the length is final
				if (this._oList.getBinding("items").isLengthFinal()) {
					sTitle = this.getResourceBundle().getText("masterTitleCount", [iTotalItems]);
					this.getModel("masterView").setProperty("/title", sTitle);
				}
			},

			/**
			 * Internal helper method to apply both filter and search state together on the list binding
			 * @private
			 */
			_applyFilterSearch : function () {
				var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
					oViewModel = this.getModel("masterView");
				this._oList.getBinding("items").filter(aFilters, "Application");
				// changes the noDataText of the list in case there are no filter results
				if (aFilters.length !== 0) {
					oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"));
				} else if (this._oListFilterState.aSearch.length > 0) {
					// only reset the no data text to default when no new search was triggered
					oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"));
				}
			},

			/**
			 * Internal helper method to apply both group and sort state together on the list binding
			 * @param {sap.ui.model.Sorter[]} aSorters an array of sorters
			 * @private
			 */
			_applyGroupSort : function (aSorters) {
				this._oList.getBinding("items").sort(aSorters);
			},

			/**
			 * Internal helper method that sets the filter bar visibility property and the label's caption to be shown
			 * @param {string} sFilterBarText the selected filter value
			 * @private
			 */
			_updateFilterBar : function (sFilterBarText) {
				var oViewModel = this.getModel("masterView");
				oViewModel.setProperty("/isFilterBarVisible", (this._oListFilterState.aFilter.length > 0));
				oViewModel.setProperty("/filterBarLabel", this.getResourceBundle().getText("masterFilterBarText", [sFilterBarText]));
			},

			zSetBusyTrue: function(pController) {
				var oController = sap.ui.getCore().getModel("controllerViewMaster");
				var oViewModel = oController.getModel("masterView");

				oViewModel.setProperty("/busy", true);
			},

			zSetBusyFalse: function(pController) {
				var oController = sap.ui.getCore().getModel("controllerViewMaster");
				var oViewModel = oController.getModel("masterView");

				oViewModel.setProperty("/busy", false);
			},
			setVesselListFilter: function(oDataModel) {
/*				var oAuxModel = oDataModel,
					sNomeNavioAnt = "";
				
				oAuxModel.sort(function(a, b) {
				    var textA = a.NomeNavio.toUpperCase();
				    var textB = b.NomeNavio.toUpperCase();
				    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
				});
				
				for(var i = 0; i < oAuxModel.length; i++) {
					if (oAuxModel.NomeNavio != sNomeNavioAnt) {
						var oVesselListFilter = oAuxModel[i];
						oVesselListFilter.push();
						sNomeNavioAnt = oAuxModel.NomeNavio;
					}
				}
*/
			}
		});
	}
);