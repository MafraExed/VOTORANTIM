sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/m/library", "sap/ui/core/Fragment"], function (BaseController, JSONModel, formatter, mobileLibrary, Fragment) {
  "use strict";

  // shortcut for sap.m.URLHelper
  var URLHelper = mobileLibrary.URLHelper;

  return BaseController.extend("votorantim.corp.clocov2planmanagement.controller.FolderDetail", {
    formatter: formatter,

    onInit: function () {
      this.createModel(
        {
          cols: [],
        },
        "columnsSearchHelp"
      );
    },

    onDataChanged: function () {
      if (!this._folderView) this._folderView = this.getRootView("votorantim.corp.clocov2planmanagement.view.Folder");
      if (!this._folderView.getModel("folderView").getProperty("/hasChanges")) {
        this._folderView.byId("ObjectPageFolder").setShowFooter(true);
        this._folderView.getModel("folderView").setProperty("/hasChanges", true);
      }
    },

    showUserSearchHelp: function (oEvent) {
      const source = oEvent.getSource();

      if (source.getId().indexOf("idResponsavel") !== -1) {
        const dataPath = "/v2_help_user";
        const title = this.getView().getModel("i18n").getResourceBundle().getText("taskSelectUser");
        const fieldsSearch = ["email", "user", "name"];
        const columnsModel = [
          {
            label: "Nome",
            template: "name",
            width: "35%",
          },
          {
            label: "E-mail",
            template: "email",
            width: "35%",
          },
          {
            label: "Usuário",
            template: "user",
            width: "30%",
          },
        ];
        this.getView().getModel("columnsSearchHelp").setProperty("/cols", columnsModel);
        this.onValueHelpRequested(dataPath, "columnsSearchHelp", title, fieldsSearch, this.onSHPressUserResp.bind(this), false);
        return;
      }
    },

    onSHPressUserResp: function (oEvent) {
      if (!this._folderView) this._folderView = this.getRootView("votorantim.corp.clocov2planmanagement.view.Folder");
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      const contextPath = this._folderView.getBindingContext().getPath();
      this._folderView.getModel().setProperty(contextPath + "/Responsavel", object.user);
      this.onDataChanged();
      this._oValueHelpDialog.close();
    },

    showCalendarSearchHelp: function (oEvent) {
      const source = oEvent.getSource();

      if (source.getId().indexOf("btnCalendarFolder") !== -1) {
        const dataPath = "/v2_help_calendariosfabrica";
        const title = this.getView().getModel("i18n").getResourceBundle().getText("folderFactoryCal");
        const fieldsSearch = ["Texto", "IDCalendFabrica"];
        const columnsModel = [
          {
            label: "ID",
            template: "IDCalendFabrica",
            width: "40%",
          },
          {
            label: "Calendário",
            template: "Texto",
            width: "60%",
          },
        ];
        this.getView().getModel("columnsSearchHelp").setProperty("/cols", columnsModel);
        this.onValueHelpRequested(dataPath, "columnsSearchHelp", title, fieldsSearch, this.onSHPressCalendarFolder.bind(this), false);
        return;
      }
    },

    onSHPressCalendarFolder: function (oEvent) {
      if (!this._folderView) this._folderView = this.getRootView("votorantim.corp.clocov2planmanagement.view.Folder");
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      const contextPath = this._folderView.getBindingContext().getPath();
      this._folderView.getModel().setProperty(contextPath + "/CalendarioFabrica", object.IDCalendFabrica);
      this.onDataChanged();
      this._oValueHelpDialog.close();
    },
    // onAddDependent: function (oEvent, type) {
    //   let oView = this.getView();
    //   this.dependentType = type;
    //   //   var that = this;

    //   if (!this._dependentDialog) {
    //     this._dependentDialog = Fragment.load({
    //       id: oView.getId(),
    //       name: "votorantim.corp.clocov2planmanagement.fragments.NewDependent",
    //       controller: this,
    //     }).then(function (oDialog) {
    //       oDialog.setModel(oView.getModel());
    //       oView.addDependent(oDialog);
    //       return oDialog;
    //     });
    //   }

    //   this._dependentDialog.then(
    //     function (oDialog) {
    //       // this._configDialog(oButton, oDialog);
    //       oDialog.open();
    //       this.byId("Tree").expandToLevel(3);
    //     }.bind(this)
    //   );
    // },

    // onCloseDependentDialog: function () {
    //   this._dependentDialog.then(function (oDialog) {
    //     oDialog.close();
    //   });
    // },

    // onDropTable2: function (oEvent) {

    //     // var oDraggedItem = oEvent.getParameter("draggedControl");
    //     // var oDraggedItemContext = oDraggedItem.getBindingContext();
    //     // if (!oDraggedItemContext) {
    //     //     return;
    //     // }

    // //   var oTreeTable = this.byId("idProductsTable");
    //   var oDragSession = oEvent.getParameter("dragSession");
    // //   var oDroppedRow = oEvent.getParameter("droppedControl");
    //   var aDraggedRowContexts = oDragSession.getComplexData("hierarchymaintenance").draggedRowContexts;
    //   var item = aDraggedRowContexts[0].getObject();

    //   let newPredecessor = this.getModel("taskPredecessor").getProperty("/");
    //   newPredecessor.push({
    //     name: item.name,
    //     path: "VE01/B001 - Votorantim Energia/Societário/",
    //   });

    //   this.getModel("taskPredecessor").setProperty("/", newPredecessor);
    // },

    // onDropTable3: function (oEvent) {

    //     // var oDraggedItem = oEvent.getParameter("draggedControl");
    //     // var oDraggedItemContext = oDraggedItem.getBindingContext();
    //     // if (!oDraggedItemContext) {
    //     //     return;
    //     // }

    // //   var oTreeTable = this.byId("idProductsTable");
    //   var oDragSession = oEvent.getParameter("dragSession");
    // //   var oDroppedRow = oEvent.getParameter("droppedControl");
    //   var aDraggedRowContexts = oDragSession.getComplexData("hierarchymaintenance").draggedRowContexts;
    //   var item = aDraggedRowContexts[0].getObject();

    //   let newPredecessor = this.getModel("taskSucessor").getProperty("/");
    //   newPredecessor.push({
    //     name: item.name,
    //     path: "VE01/B001 - Votorantim Energia/Societário/",
    //   });

    //   this.getModel("taskSucessor").setProperty("/", newPredecessor);
    // },

    // onApplyeDependentDialog: function () {
    //   if (this.dependentType === "predecessor") {
    //     let newPredecessor = [];

    //     if (this.getModel("taskView").getProperty("/dependentDialog/display") === "tree") {
    //       let selectedItems = this.byId("Tree").getSelectedContexts();
    //       for (let item of selectedItems) {
    //         let selectedItem = item.getObject();
    //         newPredecessor.push({
    //           name: selectedItem.name,
    //           path: "VE01/B001 - Votorantim Energia/Societário/",
    //         });
    //       }
    //     } else {
    //       let selectedItems = this.byId("tableTemplate").getSelectedContexts();
    //       for (let item of selectedItems) {
    //         let selectedItem = item.getObject();
    //         newPredecessor.push({
    //           name: selectedItem.task,
    //           path: "VE01/B001 - Votorantim Energia/Societário/",
    //         });
    //       }
    //     }

    //     if (newPredecessor.length > 0) this.getModel("taskPredecessor").setProperty("/", newPredecessor);
    //   } else {
    //     let newSucessor = [];

    //     if (this.getModel("taskView").getProperty("/dependentDialog/display") === "tree") {
    //       let selectedItems = this.byId("Tree").getSelectedContexts();
    //       for (let item of selectedItems) {
    //         let selectedItem = item.getObject();
    //         newSucessor.push({
    //           name: selectedItem.name,
    //           path: "VE01/B001 - Votorantim Energia/Societário/",
    //         });
    //       }
    //     } else {
    //       let selectedItems = this.byId("tableTemplate").getSelectedContexts();
    //       for (let item of selectedItems) {
    //         let selectedItem = item.getObject();
    //         newSucessor.push({
    //           name: selectedItem.task,
    //           path: "VE01/B001 - Votorantim Energia/Societário/",
    //         });
    //       }
    //     }

    //     if (newSucessor.length > 0) this.getModel("taskSucessor").setProperty("/", newSucessor);
    //   }

    //   this._dependentDialog.then(function (oDialog) {
    //     oDialog.close();
    //   });
    // },

    // onListUpdateFinished: function (oEvent) {
    //   var sTitle,
    //     iTotalItems = oEvent.getParameter("total"),
    //     oViewModel = this.getModel("detailView");

    //   // only update the counter if the length is final
    //   if (this.byId("lineItemsList").getBinding("items").isLengthFinal()) {
    //     if (iTotalItems) {
    //       sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
    //     } else {
    //       //Display 'Line Items' instead of 'Line items (0)'
    //       sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
    //     }
    //     oViewModel.setProperty("/lineItemListTitle", sTitle);
    //   }
    // },
  });
});
