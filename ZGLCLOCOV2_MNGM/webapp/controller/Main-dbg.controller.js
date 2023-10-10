sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/ui/model/Sorter", "sap/ui/model/FilterOperator", "sap/m/GroupHeaderListItem", "sap/ui/Device", "sap/ui/core/Fragment", "../model/formatter"], function (BaseController, JSONModel, Filter, Sorter, FilterOperator, GroupHeaderListItem, Device, Fragment, formatter) {
  "use strict";

  return BaseController.extend("votorantim.corp.clocov2planmanagement.controller.Main", {
    formatter: formatter,

    onInit: function () {
      let oList = this.byId("tableTemplatesMain"),
        oViewModel = new JSONModel({
          isFilterBarVisible: false,
          filterBarLabel: "",
          delay: 0,
          title: this.getResourceBundle().getText("listTitleCount", [0]),
          noDataText: this.getResourceBundle().getText("listListNoDataText"),
          sortBy: "OrderID",
          groupBy: "None",
          isTemplate: true,
        }),
        iOriginalBusyDelay = oList.getBusyIndicatorDelay();

      this._oList = oList;

      this.setModel(oViewModel, "mainView");

      oList.attachEventOnce("updateFinished", function () {
        oViewModel.setProperty("/delay", iOriginalBusyDelay);
      });

      this.getRouter().getRoute("main").attachPatternMatched(this._onMasterMatched, this);
      this.getRouter().attachBypassed(this.onBypassed, this);
    },

    onChangeTab: function (oEvent) {
      let isTemplate = false;
      if (oEvent.getParameter("key") === "templates") {
        isTemplate = true;
      }
      this.getView().getModel("mainView").setProperty("/isTemplate", isTemplate);
    },

    onPressTemplate: function (oEvent) {
      this.onSelectionChange(oEvent);
    },

    onSearch: function (oEvent) {
      if (oEvent.getParameters().refreshButtonPressed) {
        this.onRefresh();
        return;
      }

      this.filterTable();
    },

    filterTable: function () {
      let aFilters = [];

      if (this.getView().getModel("mainView").getProperty("/isTemplate")) {
        if (this.byId("filterProfileTemplateMain").getValue().trim()) aFilters.push(new Filter("Profile", FilterOperator.EQ, this.byId("filterProfileTemplateMain").getValue()));
        if (this.byId("filterDescriptionTemplateMain").getValue().trim()) aFilters.push(new Filter("Text", FilterOperator.Contains, this.byId("filterDescriptionTemplateMain").getValue()));

        let oBinding = this.byId("tableTemplatesMain").getBinding("items");
        oBinding.filter(aFilters);
        oBinding.refresh(true);
      } else {
        if (this.byId("filterProfilePlanMain").getValue().trim()) aFilters.push(new Filter("Profile", FilterOperator.EQ, this.byId("filterProfilePlanMain").getValue()));
        if (this.byId("filterPeriodPlanMain").getValue().trim()) aFilters.push(new Filter("Periodo", FilterOperator.EQ, parseInt(this.byId("filterPeriodPlanMain").getValue())));
        if (this.byId("filterDescriptionPlanMain").getValue().trim()) aFilters.push(new Filter("Descricao", FilterOperator.EQ, this.byId("filterDescriptionPlanMain").getValue()));

        let oBinding = this.byId("tablePlans").getBinding("items");
        oBinding.filter(aFilters);
        oBinding.refresh(true);
      }
    },

    onRefresh: function () {
      this._oList.getBinding("items").refresh();
    },

    onSelectionChange: function (oEvent) {
      this._showDetail(oEvent);
    },

    onBypassed: function () {
      this._oList.removeSelections(true);
    },

    onNavBack: function () {
      history.go(-1);
    },

    _onMasterMatched: function () {
      this.getModel("appView").setProperty("/layout", "OneColumn");
    },

    _showDetail: function (oEvent) {
      this.getView().getParent().getParent().removeAllBeginColumnPages();
      var bReplace = !Device.system.phone;
      // set the layout property of FCL control to show two columns
      // this.getModel("appView").setProperty("/layout", "OneColumn");
      this.getRouter().navTo(
        "detail",
        {
          profile: oEvent.getSource().getSelectedContexts()[0].getProperty("Profile"),
          instance: oEvent.getSource().getSelectedContexts()[0].getProperty("Instance"),
        },
        bReplace
      );
    },
  });
});
