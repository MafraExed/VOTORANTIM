/*global history */
sap.ui.define([
	"Y5GL_DECLAR4/Y5GL_DECLAR4/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"sap/ui/core/Fragment",
	"Y5GL_DECLAR4/Y5GL_DECLAR4/model/formatter"

], function (BaseController, JSONModel, History, Filter, Sorter, FilterOperator, GroupHeaderListItem, Device, Fragment, formatter) {
	"use strict";
	var TpDec;
	var Pernr;
	return BaseController.extend("Y5GL_DECLAR4.Y5GL_DECLAR4.controller.Master", {
			formatter: formatter,
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

					}.bind(this)
				});
				this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
				this.getRouter().attachBypassed(this.onBypassed, this);
			},

			onRefresh: function () {
				this._oList.getBinding("items").refresh();
			},

			onSelectionChange: function (oEvent) {
				var oList = oEvent.getSource(),
					bSelected = oEvent.getParameter("selected");
				// skip navigation when deselecting an item in multi selection mode
				if (!(oList.getMode() === "MultiSelect" && !bSelected)) {
					// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
					this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());

				}

			},

			_createViewModel: function () {
				return new JSONModel({
					isFilterBarVisible: false,
					filterBarLabel: "",
					delay: 0,
					title: this.getResourceBundle().getText("masterTitleCount", [0]),
					noDataText: this.getResourceBundle().getText("masterListNoDataText"),
					sortBy: "TpDec",
					groupBy: "None"
				});
			},
			_onMasterMatched: function () {
				//Set the layout property of the FCL control to 'OneColumn'
				this.getModel("appView").setProperty("/layout", "OneColumn");

			},
			_showDetail: function (oItem) {

				TpDec = oItem.getBindingContext().getProperty("TpDec");
				Pernr = oItem.getBindingContext().getProperty("Pernr");
				var Selec = "-";

				if (TpDec === "001") {
					this.AbreDialogSave();
				} else if (TpDec === "007") {
					this.AbreDialogTreinamento();
				} else {
					this.GeraPDF(Selec);
				}
			},

			AbreDialogSave: function () {
				var that = this;
				if (!that._valueHelpDialog1) {
					that._valueHelpDialog1 = sap.ui.xmlfragment("Y5GL_DECLAR4.Y5GL_DECLAR4.view.Declaracoes", that);
					that.getView().addDependent(that._valueHelpDialog1);
				}
				// open value help dialog filtered by the input value
				that._valueHelpDialog1.open();
			},

			AbreDialogTreinamento: function () {
				var that = this;
				if (!that._valueHelpDialog2) {
					that._valueHelpDialog2 = sap.ui.xmlfragment("Y5GL_DECLAR4.Y5GL_DECLAR4.view.Treinamentos", that);
					that.getView().addDependent(that._valueHelpDialog2);
				}
				// open value help dialog filtered by the input value
				that._valueHelpDialog2.open();
			},

			onAdd: function () {
				this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
				this.getRouter().navTo("Add");
			},

			GeraPDF: function (Selec) {
				var download = "/sap/opu/odata/sap/ZGWGLHR_FERIAS_ESS_SRV/ZET_GLHR_DECLARADETSet(TpDec='" + TpDec + "',Pernr='" + Pernr +
					"',Tipo='" + Selec + "')/$value";

				var oA = document.createElement("a");
				oA.href = download;
				oA.target = "_blank";
				oA.style.display = "none";
				document.body.appendChild(oA);
				oA.click();
				document.body.removeChild(oA);
			},

			onConfirmDocumento: function (oEvent) {
				var Select = oEvent.getParameter("selectedItem");
				var nome = Select.getTitle();
				this.GeraPDF(nome);
			},

			onConfirmDeclaracoes: function (oEvent) {
				var Select = oEvent.getParameter("selectedItem");
				var nome = Select.getDescription();
				this.GeraPDF(nome);
			},

			BackInicial: function (oEvent) {
				var url = "https://fioridev.votorantim.com.br/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html#Shell-home";
				window.open(url);
				window.close();
			},

			formatterIcon: function (e) {
				var sRootPath = jQuery.sap.getModulePath("Y5GL_DECLAR4.Y5GL_DECLAR4");
				var sImagePath = sRootPath + "/Icones/";
				var icone;
				icone = sImagePath + "DECLARACOES.png";
				return icone;
			}
	});
});