sap.ui.define([
	"Y5GL_SOLICIT/Y5GL_SOLICIT/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"sap/ui/core/Fragment",
	"Y5GL_SOLICIT/Y5GL_SOLICIT/model/formatter"
], function (BaseController, JSONModel, History, Filter, Sorter, FilterOperator, GroupHeaderListItem, Device, Fragment, formatter) {
	"use strict";

	return BaseController.extend("Y5GL_SOLICIT.Y5GL_SOLICIT.controller.Master", {

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
					//this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
				}.bind(this)
			});

			this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
			this.getRouter().attachBypassed(this.onBypassed, this);

			// var sName = sap.ushell.Container.getUser().getFullName();
			// this.getView().byId("idTitleText").setText(sName);
		},
		
		formatIconList1: function (oValue1, oValue2) {
			if (oValue1 === "ALIMENTACAO") {
				return "sap-icon://retail-store";
			}
			if (oValue1 === "AUXILIO_CRECHE") {
				return "sap-icon://family-care";
			}
			if (oValue1 === "COOPERATIVA") {
				return "sap-icon://collaborate";
			}
			if (oValue1 === "EMP_CONSIGINADO") {
				return "sap-icon://capital-projects";
			}
			if (oValue1 === "FARMACIA") {
				return "sap-icon://pharmacy";
			}
			if (oValue1 === "FUNSEJEM") {
				return "sap-icon://building";
			}
			if (oValue1 === "GREMIO_CLUBE") {
				return "sap-icon://chalkboard";
			}
			if (oValue1 === "Plano médico") {
				return "sap-icon://stethoscope";
			}
			if (oValue1 === "PLANO_ODONTOLOGICO") {
				return "sap-icon://doctor";
			}
			if (oValue1 === "PLANO_DENT_2") {
				return "sap-icon://doctor";
			}
			if (oValue1 === "REEMBOLSO_SUBSIDIO") {
				return "sap-icon://collections-insight";
			}
			if (oValue1 === "SEGURO_VIDA") {
				return "sap-icon://insurance-life";
			}
			if (oValue1 === "Transporte") {
				return "sap-icon://bus-public-transport";
			}
			if (oValue1 === "REFEITORIO") {
				return "sap-icon://meal";
			}
			if (oValue1 === "PREVIDENCIA_PRIVADA") {
				return "sap-icon://lead-outdated";
			}
			if (oValue1 === "PREV_PRIV_BAS") {
				return "sap-icon://lead-outdated";
			}
			if (oValue1 === "PREV_PRIV_ESP") {
				return "sap-icon://lead-outdated";
			}
			if (oValue1 === "PREV_PRIV_NOR") {
				return "sap-icon://lead-outdated";
			}
			if (oValue1 === "PREV_PRIV_SUP") {
				return "sap-icon://lead-outdated";
			}
			if (oValue1 === "CESTA_BASICA") {
				return "sap-icon://nutrition-activity";
			}
			if (oValue1 === "OTICA") {
				return "sap-icon://show";
			}
			if (oValue1 === "REEMBOLSO_ESTACIONAM") {
				return "sap-icon://car-rental";
			}
			if (oValue1 === "REEMBOLSO_EDUCACAO") {
				return "sap-icon://education";
			}
			return " ";
		},
		
		formatHighLight: function (oValue) {
			if (oValue === "A") {
				return "Success";
			}
			return "Information";
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * After list data is available, this handler method updates the
		 * master list counter
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function (oEvent) {},

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
				this._oListFilterState.aSearch = [new Filter("Programm", FilterOperator.Contains, sQuery)];
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
		 * Event handler for the filter, sort and group buttons to open the ViewSettingsDialog.
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
		onOpenViewSettings: function (oEvent) {
			var sDialogTab = "filter";
			if (oEvent.getSource() instanceof sap.m.Button) {
				var sButtonId = oEvent.getSource().getId();
				if (sButtonId.match("sort")) {
					sDialogTab = "sort";
				} else if (sButtonId.match("group")) {
					sDialogTab = "group";
				}
			}
			// load asynchronous XML fragment
			if (!this.byId("viewSettingsDialog")) {
				Fragment.load({
					id: this.getView().getId(),
					name: "Y5GL_SOLICIT.Y5GL_SOLICIT.view.ViewSettingsDialog",
					controller: this
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					this.getView().addDependent(oDialog);
					oDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
					oDialog.open(sDialogTab);
				}.bind(this));
			} else {
				this.byId("viewSettingsDialog").open(sDialogTab);
			}
		},

		/**
		 * Event handler called when ViewSettingsDialog has been confirmed, i.e.
		 * has been closed with 'OK'. In the case, the currently chosen filters, sorters or groupers
		 * are applied to the master list, which can also mean that they
		 * are removed from the master list, in case they are
		 * removed in the ViewSettingsDialog.
		 * @param {sap.ui.base.Event} oEvent the confirm event
		 * @public
		 */
		onConfirmViewSettingsDialog: function (oEvent) {

			this._applySortGroup(oEvent);
		},

		/**
		 * Apply the chosen sorter and grouper to the master list
		 * @param {sap.ui.base.Event} oEvent the confirm event
		 * @private
		 */
		_applySortGroup: function (oEvent) {
			var mParams = oEvent.getParameters(),
				sPath,
				bDescending,
				aSorters = [];
			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));
			this._oList.getBinding("items").sort(aSorters);
		},

		/**
		 * Event handler for the list selection event
		 * @param {sap.ui.base.Event} oEvent the list selectionChange event
		 * @public
		 */
		onSelectionChange: function (oEvent) {
			
			var bReplace = !Device.system.phone;
			var Zdesc = "object";
			var Parameter = oEvent.getParameters("listItem").listItem;
			
			if (Parameter !== undefined) {
				var Status = oEvent.getParameters("listItem").listItem.getBindingContext().getProperty("Status");
				
				if (Status === "Em processamento" || Status === "Em Processamento" || Status === "EM PROCESSAMENTO"){
					sap.m.MessageBox.show("Sua solicitação segue em processamento.");
					return;
				}
				
				if (Status === "APROVADO"){
					sap.m.MessageBox.show("Solicitação aprovada.");
					return;
				}
				if (Status === "Efetivado"){
					sap.m.MessageBox.show("Solicitação aprovada.");
					return;
				}
				
				
				var Pernr = oEvent.getParameters("listItem").listItem.getBindingContext().getProperty("Pernr");
				var Chamado = oEvent.getParameters("listItem").listItem.getBindingContext().getProperty("Chamado");

				this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
				this.getRouter().navTo(Zdesc, {
					Pernr: Pernr,
					Chamado: Chamado
				}, bReplace);
			}
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
		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		 * If not, it will navigate to the shell home
		 * @public
		 */
		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash(),
				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				// eslint-disable-next-line sap-no-history-manipulation
				history.go(-1);
			} else {
				oCrossAppNavigator.toExternal({
					target: {
						shellHash: "#Shell-home"
					}
				});
			}
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
				sortBy: "Programm",
				groupBy: "None"
			});
		},

		_onMasterMatched: function () {
			//Set the layout property of the FCL control to 'OneColumn'
			this.getModel("appView").setProperty("/layout", "OneColumn");
		},

		/**
		 * Shows the selected item on the detail page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showDetail: function (oItem) {
			var bReplace = !Device.system.phone;
			var Zdesc = oItem.getBindingContext().getProperty("Zdesc");
			var zParam = oItem.getBindingContext().getProperty("Zparam");
			// set the layout property of FCL control to show two columns
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");

			this.getRouter().navTo(zParam, bReplace);
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
		 * Internal helper method that sets the filter bar visibility property and the label's caption to be shown
		 * @param {string} sFilterBarText the selected filter value
		 * @private
		 */
		_updateFilterBar: function (sFilterBarText) {
			var oViewModel = this.getModel("masterView");
			oViewModel.setProperty("/isFilterBarVisible", (this._oListFilterState.aFilter.length > 0));
			oViewModel.setProperty("/filterBarLabel", this.getResourceBundle().getText("masterFilterBarText", [sFilterBarText]));
		},

		formatterTestStatus: function (oValue) {
			if (oValue === "A") {
				return "Em Aprovação";
			}
			return " ";
		},

		formatterStateStatus: function (oValue) {
			switch (oValue) {
			case "Ativo":
				return "Success";
				break;
			case "Inativo":
				return "Error";
				break;
			}
		},
		
		formatIconList: function (oValue, oValue2) {
			var sRootPath = jQuery.sap.getModulePath("Y5GL_SOLICIT.Y5GL_SOLICIT");
			var sImagePath = sRootPath + "/Icones/";
			var icone;
			
			switch (oValue) {
			case "BENEFICIOS":
				icone = sImagePath + "DOC_DET.png";
				return icone;
				break;
			case "DADOS_PESSOAIS":
				icone = sImagePath + "DADOS_PESSOAIS.png";
				return icone;
				break;
			case "DEPENDENTES":
				icone = sImagePath + "DEPENDENTES.png";
				return icone;
				break;
			case "DOCUMENTOS":
				icone = sImagePath + "DOCUMENTOS.png";
				return icone;
				break;
			case "ENDERECO":
				icone = sImagePath + "ENDERECO.png";
				return icone;
				break;
			case "FORMACAO":
				icone = sImagePath + "FORMACAO.png";
				return icone;
				break;
			case "PESSOA_DE_REFERÊNCIA":
				return "sap-icon://leads";
				break;
			}
		},

	});

});