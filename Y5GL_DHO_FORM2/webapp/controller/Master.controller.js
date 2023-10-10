/*global history */
sap.ui.define([
	"Y5GL_DHO_FORM2/Y5GL_DHO_FORM2/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"Y5GL_DHO_FORM2/Y5GL_DHO_FORM2/model/formatter"
], function (BaseController, JSONModel, Filter, FilterOperator, GroupHeaderListItem, Device, formatter) {
	"use strict";

	return BaseController.extend("Y5GL_DHO_FORM2.Y5GL_DHO_FORM2.controller.Master", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the master list controller is instantiated. It sets up the event handling for the master/detail communication and other lifecycle tasks.
		 * @public
		 */
		onInit: function () {
			// Control state model
			var oList = this.byId("list"),
				oViewModel = this._createViewModel(),
				// Put down master list's original value for busy indicator delay,
				// so it can be restored later on. Busy handling on the master list is
				// taken care of by the master list itself.
				iOriginalBusyDelay = oList.getBusyIndicatorDelay();

			this._oList = oList;
			// keeps the filter and search state
			this._oListFilterState = {
				aFilter: [],
				aSearch: []
			};

			this.setModel(oViewModel, "masterView");
			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oList.attachEventOnce("updateFinished", function () {
				// Restore original busy indicator delay for the list
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

			this.getView().addEventDelegate({
				onBeforeFirstShow: function () {
					this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
				}.bind(this)
			});

			this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
			this.getRouter().attachBypassed(this.onBypassed, this);
		},

		/**
		 * Event handler for the master search field. Applies current
		 * filter value and triggers a new search. If the search field's
		 * 'refresh' button has been pressed, no new search is triggered
		 * and the list binding is refresh instead.
		 * @param {sap.ui.base.Event} oEvent the search event
		 * @public
		 */
		onSearch: function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
				return;
			}

			var sQuery = oEvent.getParameter("query");

			if (sQuery) {
				this._oListFilterState.aSearch = [new Filter("DescInfotipo", FilterOperator.Contains, sQuery)];
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
		onRefresh: function () {
			this._oList.getBinding("items").refresh();
		},

		/**
		 * Event handler for the list selection event
		 * @param {sap.ui.base.Event} oEvent the list selectionChange event
		 * @public
		 */
		onSelectionChange: function (oEvent) {
			// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
			this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
		},

		/**
		 * Event handler for the bypassed event, which is fired when no routing pattern matched.
		 * If there was an object selected in the master list, that selection is removed.
		 * @public
		 */
		onBypassed: function () {
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
		createGroupHeader: function (oGroup) {
			return new GroupHeaderListItem({
				title: oGroup.text,
				upperCase: false
			});
		},

		/**
		 * Event handler for navigating back.
		 * We navigate back in the browser historz
		 * @public
		 */
		onNavBack: function () {
			history.go(-1);
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		_createViewModel: function () {
			return new JSONModel({
				isFilterBarVisible: false,
				filterBarLabel: "",
				delay: 0,
				title: this.getResourceBundle().getText("masterTitleCount", [0]),
				noDataText: this.getResourceBundle().getText("masterListNoDataText"),
				sortBy: "DescInfotipo",
				groupBy: "None"
			});
		},

		/**
		 * If the master route was hit (empty hash) we have to set
		 * the hash to to the first item in the list as soon as the
		 * listLoading is done and the first item in the list is known
		 * @private
		 */
		_onMasterMatched: function () {
			this.getOwnerComponent().oListSelector.oWhenListLoadingIsDone.then(
				function (mParams) {
					if (mParams.list.getMode() === "None") {
						return;
					}
					var Infty = mParams.firstListitem.getBindingContext().getProperty("Infty");
					var Subty = mParams.firstListitem.getBindingContext().getProperty("Subty");
					this.getRouter().navTo("object", {
						Infty: Infty,
						Subty: Subty
					}, true);
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
		_showDetail: function (oItem) {
			var bReplace = !Device.system.phone;
			var Infty = oItem.getBindingContext().getProperty("Infty");
			var Subty = oItem.getBindingContext().getProperty("Subty");
			
			this.getRouter().navTo("object", {
				Infty: Infty,
				Subty: Subty
			}, bReplace);
		},

		/**
		 * Sets the item count on the master list header
		 * @param {integer} iTotalItems the total number of items in the list
		 * @private
		 */
		_updateListItemCount: function (iTotalItems) {
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
		_applyFilterSearch: function () {
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
		_applyGroupSort: function (aSorters) {
			this._oList.getBinding("items").sort(aSorters);
		},

		/**
		 * Internal helper method that sets the filter bar visibility property and the label's caption to be shown
		 * @param {string} sFilterBarText the selected filter value
		 * @private
		 */
		_updateFilterBar: function (sFilterBarText) {
			var oViewModel = this.getModel("masterView");
			oViewModel.setProperty("/isFilterBarVisible", (this._oListFilterState.aFilter.length > 0));
			oViewModel.setProperty("/filterBarLabel", this.getResourceBundle().getText("masterFilterBarText", [sFilterBarText]));
		},

		formatIconList: function (oValue) {
			var sRootPath = jQuery.sap.getModulePath("Y5GL_DHO_FORM2.Y5GL_DHO_FORM2");
			var sImagePath = sRootPath + "/Icone/";
			var icone;

			if (oValue === "AUXILIO CRECHE") {
				icone = sImagePath + "AUXILIO_CRECHE.png";
				return icone;
			}
			if (oValue === "FARMACIA") {
				icone = sImagePath + "FARMACIA.png";
				return icone;
			}
			if (oValue === "FUNSEJEM") {
				icone = sImagePath + "ADIANTAMENTO_15.png";
				return icone;
			}
			if (oValue === "PLANO MEDICO") {
				icone = sImagePath + "PLANO_MEDICO.png";
				return icone;
			}
			if (oValue === "PLANO ODONTOLOGICO") {
				icone = sImagePath + "ODONTO.png";
				return icone;
			}
			if (oValue === "SEGURO DE VIDA") {
				icone = sImagePath + "SEGURO_VIDA.png";
				return icone;
			}
			if (oValue === "TRANSPORTE") {
				icone = sImagePath + "TRANSPORTE.png";
				return icone;
			}
			if (oValue === "PREVIDENCIA PRIVADA") {
				icone = sImagePath + "PREVIDENCIA.png";
				return icone;
			}
			if (oValue === "PREV PRIV BAS") {
				icone = sImagePath + "ADIANTAMENTO_15.png";
				return icone;
			}
			if (oValue === "PREV PRIV ESP") {
				icone = sImagePath + "ADIANTAMENTO_15.png";
				return icone;
			}
			if (oValue === "PREV PRIV NOR") {
				icone = sImagePath + "ADIANTAMENTO_15.png";
				return icone;
			}
			if (oValue === "PREV PRIV SUP") {
				icone = sImagePath + "ADIANTAMENTO_15.png";
				return icone;
			}
			if (oValue === "CESTA BASICA") {
				icone = sImagePath + "CESTA_BASICA.png";
				return icone;
			}
			if (oValue === "REEMBOLSO ESTACIONAM") {
				icone = sImagePath + "ESTACIONAMENTO.png";
				return icone;
			}
			if (oValue === "REEMBOLSO EDUCACAO") {
				icone = sImagePath + "REEMBOLSO_EDUCACAO.png";
				return icone;
			}
			if (oValue === "REEMBOLSO IDIOMA") {
				icone = sImagePath + "REEMBOLSO_EDUCACAO.png";
				return icone;
			}
			if (oValue === "REEMBOLSO EXT UNIV") {
				icone = sImagePath + "REEMBOLSO_EDUCACAO.png";
				return icone;
			}
			if (oValue === "COOPERATIVA") {
				icone = sImagePath + "PREVIDENCIA.png";
				return icone;
			}
			if (oValue === "GREMIO CLUBE") {
				icone = sImagePath + "PREVIDENCIA.png";
				return icone;
			}
			if (oValue === "MATERIAL ESCOLAR") {
				icone = sImagePath + "REEMBOLSO_EDUCACAO.png";
				return icone;
			}
			
			if (oValue === "REEMBOLSO MEDICAM") {
				icone = sImagePath + "FARMACIA.png";
				return icone;
			}
			
			if (oValue === "EMP CONSIGNADO") {
				icone = sImagePath + "ADIANTAMENTO_15.png";
				return icone;
			}
			if (oValue === "REEMBOLSO ALUGUEL") {
				icone = sImagePath + "ADIANTAMENTO_15.png";
				return icone;
			}
			return " ";
		},
		
		formatName: function (oValue){
			var retorno;
			
			if (oValue === "EMP CONSIGNADO"){
				retorno = "EMPRESTIMO CONSIGNADO";
			}
			
			if (oValue === "REEMBOLSO MEDICAM"){
				retorno = "REEMBOLSO MEDICAMENTO";
			}
			
			if (!retorno){
				retorno = oValue;
			}
			
			return retorno;
		}

	});

});