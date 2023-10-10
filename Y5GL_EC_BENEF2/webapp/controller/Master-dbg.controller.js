sap.ui.define([
	"Y5GL_EC_BENEF2/Y5GL_EC_BENEF2/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"sap/ui/core/Fragment",
	"Y5GL_EC_BENEF2/Y5GL_EC_BENEF2/model/formatter"
], function (BaseController, JSONModel, History, Filter, Sorter, FilterOperator, GroupHeaderListItem, Device, Fragment, formatter) {
	"use strict";

	return BaseController.extend("Y5GL_EC_BENEF2.Y5GL_EC_BENEF2.controller.Master", {

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

		formatStateEStatus: function (oValue) {
			if (oValue === "A") {
				return "Success";
			}
			return "None";
		},

		formatTextEStatus: function (oValue) {
			if (oValue === "A") {
				return "Em Aprovação";
			}
			return " ";
		},

		formatIconList: function (oValue) {
			var sRootPath = jQuery.sap.getModulePath("Y5GL_EC_BENEF2.Y5GL_EC_BENEF2");
			var sImagePath = sRootPath + "/Icone/";
			var icone;
		
			if (oValue === "COOPERATIVA") {
				icone = sImagePath + "PREVIDENCIA.png";
				return icone;
			}
			if (oValue === "GREMIO_CLUBE") {
				icone = sImagePath + "PREVIDENCIA.png";
				return icone;
			}
			if (oValue === "EMP_CONSIGNADO") {
				icone = sImagePath + "ADIANTAMENTO_15.png";
				return icone;
			}
			if (oValue === "REEMBOLSO_ALUGUEL") {
				icone = sImagePath + "ADIANTAMENTO_15.png";
				return icone;
			}
			if (oValue === "REEMBOLSO_EXT_UNIV") {
				icone = sImagePath + "REEMBOLSO_EDUCACAO.png";
				return icone;
			}
			if (oValue === "AUXILIO_CRECHE") {
				icone = sImagePath + "AUXILIO_CRECHE.png";
				return icone;
			}
			if (oValue === "ALIMENTACAO") {
				icone = sImagePath + "CESTA_BASICA.png";
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
			if (oValue === "PLANO_MEDICO") {
				icone = sImagePath + "PLANO_MEDICO.png";
				return icone;
			}
			if (oValue === "PLANO_ODONTOLOGICO") {
				icone = sImagePath + "ODONTO.png";
				return icone;
			}
			if (oValue === "SEGURO_VIDA") {
				icone = sImagePath + "SEGURO_VIDA.png";
				return icone;
			}
			if (oValue === "TRANSPORTE") {
				icone = sImagePath + "TRANSPORTE.png";
				return icone;
			}
			if (oValue === "PREVIDENCIA_PRIVADA") {
				icone = sImagePath + "PREVIDENCIA.png";
				return icone;
			}
			if (oValue === "PREV_PRIV_BAS") {
				icone = sImagePath + "ADIANTAMENTO_15.png";
				return icone;
			}
			if (oValue === "PREV_PRIV_ESP") {
				icone = sImagePath + "ADIANTAMENTO_15.png";
				return icone;
			}
			if (oValue === "PREV_PRIV_NOR") {
				icone = sImagePath + "ADIANTAMENTO_15.png";
				return icone;
			}
			if (oValue === "PREV_PRIV_SUP") {
				icone = sImagePath + "ADIANTAMENTO_15.png";
				return icone;
			}
			if (oValue === "CESTA_BASICA") {
				icone = sImagePath + "CESTA_BASICA.png";
				return icone;
			}
			if (oValue === "REEMBOLSO_ESTACIONAM") {
				icone = sImagePath + "ESTACIONAMENTO.png";
				return icone;
			}
			if (oValue === "REEMBOLSO_EDUCACAO") {
				icone = sImagePath + "REEMBOLSO_EDUCACAO.png";
				return icone;
			}
			if (oValue === "REEMBOLSO_SUBSIDIO") {
				icone = sImagePath + "PPRRV.png";
				return icone;
			}
			
			if (oValue === "MATERIAL_ESCOLAR") {
				icone = sImagePath + "REEMBOLSO_EDUCACAO.png";
				return icone;
			}
			
			if (oValue === "REEMBOLSO_IDIOMA") {
				icone = sImagePath + "REEMBOLSO_EDUCACAO.png";
				return icone;
			}
			
			if (oValue === "REEMBOLSO_MEDICAM") {
				icone = sImagePath + "FARMACIA.png";
				return icone;
			}
			return " ";},

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
					name: "Y5GL_EC_BENEF2.Y5GL_EC_BENEF2.view.ViewSettingsDialog",
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
			var Bukrs = oEvent.getParameters("listItem").listItem.getBindingContext().getProperty("Bukrs");
			// set the layout property of FCL control to show two columns
			this.setEmpresa(Bukrs);
			var bReplace = !Device.system.phone;
			var Zdesc = "BENEFICIOS_DETAIL";
			var Parameter = oEvent.getParameters("listItem").listItem;
			if (Parameter !== undefined) {
				var ZdescNew = oEvent.getParameters("listItem").listItem.getBindingContext().getProperty("Zdesc");
				var zParam = oEvent.getParameters("listItem").listItem.getBindingContext().getProperty("Zparam");

				this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
				this.getRouter().navTo(Zdesc, {
					Zparam: zParam,
					Zdesc: ZdescNew
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

		formatterIcon: function (oValue) {

			switch (oValue) {
			case "BENEFÍCIOS":
				return "sap-icon://folder";
				break;
			case "DADOS PESSOAIS":
				return "sap-icon://business-card";
				break;
			case "DEPENDENTES":
				return "sap-icon://family-care";
				break;
			case "DOCUMENTOS":
				return "sap-icon://sap-box";
				break;
			case "ENDERECO":
				return "sap-icon://addresses";
				break;
			case "FORMACAO EDUCACIONAL":
				return "sap-icon://study-leave";
				break;
			}
		}

	});

});