/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
jQuery.sap.require("hcm.mypaystubs.utils.ConcurrentEmployment");
jQuery.sap.require("hcm.mypaystubs.utils.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
jQuery.sap.require("sap.ca.ui.model.type.Date");
jQuery.sap.require("hcm.mypaystubs.utils.DataManager");
sap.ca.scfld.md.controller.ScfldMasterController.extend("hcm.mypaystubs.view.S2", {
	extHookChangeFooterButtons: null,
	/*global hcm:true window setTimeout */
	onInit: function() {
		// execute the onInit for the base class ScfldMasterController
		sap.ca.scfld.md.controller.ScfldMasterController.prototype.onInit.call(this);
		this.oApplication = this.oApplicationFacade.oApplicationImplementation;
		this.oBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();
		this._page = this.getView().byId("PAYSLIP_MASTER_PAGE");
		this.delayDataLoad = false;
		this._oRouterArgs = null;
		
		hcm.mypaystubs.utils.DataManager.init(this.oDataModel, this.oBundle);
		this.oRouter.getRoute("master").attachMatched(this._onRouteMatched, this); 
		
		var self = this;

		var m = new sap.ui.core.routing.HashChanger();
		var hash = m.getHash();
		var pernr = hash.match(/PersonnelAssignment='(\d{1,8})'/);
		if (pernr) {
			this.oApplication.pernr = pernr[1];
		}
		
		//if the hash contains a search query parameter ("?search=") 
		//then we delay the list loading until the 'master'-route was hit
		if (hash.indexOf("?search=") !== -1) {
			this.delayDataLoad = true;
		}
		
		if (!this.oApplication.pernr) {
			hcm.mypaystubs.utils.ConcurrentEmployment.getCEEnablement(this, function() {
				self._initialize();
			});
		} else if (!this.delayDataLoad) {
			self._initialize();
		}
	},

	onDataLoaded: function() {
		var items = this.getList().getItems();
		if (items.length === 0) {			//MELN2238741
			this.showEmptyView("DETAIL_TITLE", sap.ui.getCore().getConfiguration().getLanguage(), this.oBundle.getText("NO_PAYSLIPS_AVAILABLE"));
		} 
	},
	_initialize: function(searchPattern) {
		//fill the data in the UI
		var oList = this.getList();
		var oPernr = this.oApplication.pernr;
		var oTemplate = oList.getItems()[0].clone();
		var aFilters = this._getFilters(oPernr, searchPattern);
		oList.bindItems("/Paystubs", oTemplate, null, aFilters);
		//fill search hash value into search field
		if (searchPattern !== undefined) {
			this._oControlStore.oMasterSearchField.setValue(searchPattern);	
		}
		this.registerMasterListBind();
		this.refreshHeaderFooterForEditToggle();
	},

	_getFilters: function (oPernr, searchPattern) {
		var aFilters = [];
		
		var oFilterPernr = new sap.ui.model.Filter("PersonnelAssignment", sap.ui.model.FilterOperator.EQ, oPernr);	
		aFilters.push(oFilterPernr);		
		
		if (searchPattern !== undefined) {
			var oFilterReason = new sap.ui.model.Filter("Reason", sap.ui.model.FilterOperator.Contains, searchPattern);
			var oFilterPeriod = new sap.ui.model.Filter("Period", sap.ui.model.FilterOperator.Contains, searchPattern);
			var oFilterCurrency = new sap.ui.model.Filter("Currency", sap.ui.model.FilterOperator.Contains, searchPattern);
			
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance();
			var dateFormatted = dateFormat.parse(searchPattern, true, true);
			if (dateFormatted) {
				var oFilterPaydate = new sap.ui.model.Filter("PayDate", sap.ui.model.FilterOperator.EQ, dateFormatted);
				aFilters.push(oFilterPaydate);
			}
			aFilters.push(oFilterReason);
			aFilters.push(oFilterPeriod);
			aFilters.push(oFilterCurrency);
		}
		return aFilters;
	},

	_onRouteMatched : function (oEvent) {
		// save the current query state
		this._oRouterArgs = oEvent.getParameter("arguments");
		this._oRouterArgs.query = this._oRouterArgs["?query"] || null;
		delete this._oRouterArgs["?query"];
		// load the list
		if (this.delayDataLoad) {
			this.delayDataLoad = false;
			this._initialize(decodeURIComponent(this._oRouterArgs.query.search));
		}
	},
		
	//"MELN2270488: enable backend search   
	isBackendSearch: function() {
		return true;
	},

	//apply filter patterns for the relevant fields and trigger backend ODATA request
	applyBackendSearchPattern: function(sFilterPattern, oBinding) {
		var aFilters = this._getFilters(this.oApplication.pernr, sFilterPattern);
		oBinding.filter(aFilters,sap.ui.model.FilterType.Application);

		// update the hash with the current search term
		if (sFilterPattern) {
			this._oRouterArgs.query = {search: encodeURIComponent(sFilterPattern)};
		} else {
			this._oRouterArgs.query = null;
		}
		this._bListLoaded = false;
		this.oRouter.navTo("master",this._oRouterArgs, true /*no history*/);
	},

	getHeaderFooterOptions: function() {
		var objHdrFtr = {
			sI18NMasterTitle: "DISPLAY_NAME_LIST"
		};
		/**
		 * @ControllerHook Modify the footer buttons
		 * This hook method can be used to add and change buttons for the master view header/footer
		 * @callback hcm.mypaystubs.view.S2~extHookChangeFooterButtons
		 * @param {object} Header Footer Object
		 * @return {object} Header Footer Object
		 */

		if (this.extHookChangeFooterButtons) {
			objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
		}
		return objHdrFtr;
	},

	setListItem: function(oItem) {
		var query = this._oRouterArgs.query;	
		this.oRouter.navTo("detail", {
			from: oItem.getTitle(),
			contextPath: oItem.getBindingContext().sPath.substr(1),
			query: query
		}, !sap.ui.Device.system.phone);
		this.refreshHeaderFooterForEditToggle();
	}
});