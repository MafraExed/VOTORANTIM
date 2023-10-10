sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/ui/core/Fragment", "sap/m/MessageToast", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/Device", "sap/ui/model/type/Boolean"], function (BaseController, JSONModel, formatter, Fragment, MessageToast, Filter, FilterOperator, Device, Boolean) {
  "use strict";

  return BaseController.extend("votorantim.corp.clocov2planmanagement.controller.DetailTable", {
    formatter: formatter,
    expandLevel: 9,

    _profile: "",
    _instance: "",

    onInit: function () {
      this.createModel(
        {
          hasSelectedItems: false,
          viewMode: "table",
          profileText: "",
          profileType: "",
          isTemplate: true,
          hasChanges: false,
          visibleRowsNode: 1,
          clipboardData: [],
        },
        "detailView"
      );
      this.createModel(
        {
          cols: [
            {
              label: "Nome",
              template: "name",
              width: "40%",
            },
            {
              label: "E-mail",
              template: "email",
              width: "40%",
            },
            {
              label: "Usuário SAP",
              template: "user",
              width: "20%",
            },
          ],
        },
        "columnsSearchUsers"
      );

      this.createModel(
        {
          cols: [],
        },
        "columnsSearchHelp"
      );

      this.createModel({}, "changeAlertConfigMass");
      this.createModel({}, "changeTaskMass");
      this.createModel({}, "newTaskPlan");
      this.createModel({}, "motives");

      this.createModel(this.newEmptyTask(), "newTask");

      this.getView().setBusyIndicatorDelay(0);
      this.getView().setBusy(true);

      this.getRouter().getRoute("detailTable").attachPatternMatched(this._onObjectMatched, this);
      this.getRouter().getRoute("taskTable").attachPatternMatched(this.onTaskView, this);
    },

    newEmptyTask: function () {
      return {
        EncerramentoMes: true,
        EncerramentoTri: true,
        EncerramentoAno: true,
        EncerramentoEspec: true,
        EncerramentoUsuario: false,
        Kind: "0",
      };
    },

    addPlanFieldsToTable: function () {
      const oTable = this.byId("tableTemplate");
      const planFields = ["Status"];

      //check if the column is arealdy there
      const columns = oTable.getColumns();
      for (const column of columns) {
        if (column.getLabel())
          if (planFields.indexOf(column.getLabel().getText()) !== -1)
            return;
      }

      const objStatus = new sap.m.ObjectStatus();
      objStatus.bindProperty("text", { path: "table>Status", formatter: formatter.getStatusTaskText });
      objStatus.bindProperty("state", { path: "table>Status", formatter: formatter.getStatusTaskState });

      const oColumnTemplate = new sap.ui.table.Column({
        label: "Status",
        template: objStatus,
        width: "150px"
      });

      // Add the new column to the table
      oTable.insertColumn(oColumnTemplate, 2);
    },

    removePlanFieldsToTable: function () {
      const oTable = this.byId("tableTemplate");
      const columns = oTable.getColumns();
      const planFields = ["Status"];

      for (const column of columns) {
        if (column.getLabel())
          if (planFields.indexOf(column.getLabel().getText()) !== -1)
            oTable.removeColumn(column);
      }
    },

    filterTable: function (oEvent) {
      this.filterItemTable(oEvent);
    },

    filterItemTable: function (oEvent) {
      var sQuery = oEvent.getParameter("query");
      this._oGlobalFilter = null;

      if (sQuery) {
        this._oGlobalFilter = new Filter([new Filter("Description", FilterOperator.Contains, sQuery), new Filter("User_respons", FilterOperator.Contains, sQuery), new Filter("User_respons_exec", FilterOperator.Contains, sQuery), new Filter("Caminho", FilterOperator.Contains, sQuery)], false);
      }

      this.byId("tableTemplate").getBinding().filter(this._oGlobalFilter, "Application");
    },
    showCompanySearchHelp: function (oEvent) {
      const source = oEvent.getSource();

      if (source.getId().indexOf("idNewTaskCompany") !== -1 || source.getId().indexOf("idChangeTaskCompany") !== -1) {
        const dataPath = "/v2_help_companies";
        const title = this.getView().getModel("i18n").getResourceBundle().getText("folderCompanyCode");
        const fieldsSearch = ["BUKRS", "Desc"];
        const columnsModel = [
          {
            label: "Empresa",
            template: "BUKRS",
            width: "40%",
          },
          {
            label: "Descrição",
            template: "Desc",
            width: "60%",
          },
        ];
        this.getView().getModel("columnsSearchHelp").setProperty("/cols", columnsModel);
        if (source.getId().indexOf("idNewTaskCompany") !== -1)
          this.onValueHelpRequested(dataPath, "columnsSearchHelp", title, fieldsSearch, this.onSHPressCompanyCreateTask.bind(this), false);
        else
          this.onValueHelpRequested(dataPath, "columnsSearchHelp", title, fieldsSearch, this.onSHPressCompanyChangeTask.bind(this), false);
        return;
      }
    },

    onSHPressCompanyCreateTask: function (oEvent) {
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      this.getView().getModel("newTask").setProperty("/Empresa", object.BUKRS);
      this.getView().getModel("newTask").refresh();
      this._oValueHelpDialog.close();
    },

    onSHPressCompanyChangeTask: function (oEvent) {
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      this.getView().getModel("changeTaskMass").setProperty("/Empresa", object.BUKRS);
      // this.getView().getModel("newTask").refresh();
      this._oValueHelpDialog.close();
    },

    onTaskView: function (oEvent) {
      let oArgs = oEvent.getParameter("arguments");

      this._profile = oArgs.profile;
      this._instance = oArgs.instance;
      this._item = oArgs.item;
      this._taskView = true;

      if (this._instance == 0) this.getView().getModel("detailView").setProperty("/isTemplate", true);
      else this.getView().getModel("detailView").setProperty("/isTemplate", false);

      this.getRouter().getRoute("task").detachPatternMatched(this.onTaskView, this);
      this.getRouter().getRoute("folder").detachPatternMatched(this.onFolderView, this);

      let sItemPath, expand;
      if (this._instance == 0) {
        sItemPath = `/v2_modelos(Profile='${oArgs.profile}',Instance=${oArgs.instance})`;
        expand = "to_modelodetalhe";
      }
      else {
        sItemPath = `/v2_planos(Profile='${oArgs.profile}',Instance=${oArgs.instance})`;
        expand = "toPlanoDetalhes";
      }

      this._bindView(sItemPath, expand);
    },

    _bindView: function (sObjectPath, expand) {
      this.getView().bindElement({
        path: sObjectPath,
        parameters: {
          expand: expand,
        },
        events: {
          change: this._onBindingChange.bind(this),
          dataRequested: function () {
            this.getView().setBusy(true);
          }.bind(this),
          // dataReceived: this._onBindingChange.bind(this),
        },
      });
    },

    _onBindingChange: function () {
      var oView = this.getView(),
        oElementBinding = oView.getElementBinding();

      if (!oElementBinding.getBoundContext()) {
        this.getRouter().getTargets().display("detailObjectNotFound");
        return;
      }

      this.clearTables();

      let property;
      if (this._instance != 0) {
        this.getModel("detailView").setProperty("/profileType", this.getView().getModel("i18n").getResourceBundle().getText("mainPlan"));
        this.getModel("detailView").setProperty("/profileText", this.getView().getBindingContext().getProperty(`/v2_planos(Profile='${this._profile}',Instance=${this._instance})/Descricao`));
        this.byId("tabBtChangeProfile").setText("trocar plano");
        property = "toPlanoDetalhes";
      }
      else {
        this.getModel("detailView").setProperty("/profileType", this.getView().getModel("i18n").getResourceBundle().getText("mainTemplate"));
        this.getModel("detailView").setProperty("/profileText", this.getView().getBindingContext().getProperty(`/v2_modelos(Profile='${this._profile}',Instance=${this._instance})/Text`));
        this.byId("tabBtChangeProfile").setText("trocar modelo");
        property = "to_modelodetalhe";
      }

      let hierarquiaList = [];
      for (const hierarquiaPath of this.getView().getBindingContext().getProperty(property)) {
        const hierarquiaObject = this.getView()
          .getModel()
          .getProperty("/" + hierarquiaPath);
        hierarquiaList.push(hierarquiaObject);
      }
      this.getModel("table").setProperty("/data", this.getItemsOnly(hierarquiaList));

      if (this._taskView) {
        const tableData = this.getView().getModel("table").getProperty("/data");
        const selectedRow = this.getSelectedRow(this._item, tableData);
        this.getView().getModel("table").setProperty("/selectedTask", selectedRow);
        this._taskView = false;
      }

      this.getView().setBusy(false);
    },

    getSelectedRow: function (item, tableData) {
      let selectedRow;
      for (const data of tableData) {
        if (data.NodeID === item) {
          selectedRow = data;
          break;
        }
      }
      return selectedRow;
    },

    onSelectChange: function () {
      let selectedItems = [];

      selectedItems = this.byId("tableTemplate").getSelectedIndices();

      let hasSelectedItems = false;

      if (selectedItems.length > 0) {
        hasSelectedItems = true;
      }
      this.getModel("detailView").setProperty("/hasSelectedItems", hasSelectedItems);
    },

    onViewModeChange: function (oEvent) {
      this.getView().getParent().getParent().removeAllBeginColumnPages();

      var bReplace = !Device.system.phone;
      this.getRouter().navTo(
        "detail",
        {
          profile: this._profile,
          instance: this._instance,
        },
        bReplace
      );
    },

    onDragStart: function (oEvent) {
      var oTable = this.byId("tableTemplate");
      var oDragSession = oEvent.getParameter("dragSession");
      var oDraggedRow = oEvent.getParameter("target");
      var iDraggedRowIndex = oDraggedRow.getIndex();
      var aSelectedIndices = oTable.getSelectedIndices();
      var aDraggedRowObject = [];

      if (aSelectedIndices.length > 0) {
        // If rows are selected, do not allow to start dragging from a row which is not selected.
        if (aSelectedIndices.indexOf(iDraggedRowIndex) === -1) {
          oEvent.preventDefault();
        } else {
          for (var i = 0; i < aSelectedIndices.length; i++) {
            aDraggedRowObject.push(oTable.getContextByIndex(aSelectedIndices[i]).getObject());
          }
        }
      } else {
        aDraggedRowObject.push(oTable.getContextByIndex(iDraggedRowIndex).getObject());
      }

      oDragSession.setComplexData("movedep", {
        draggedRowContexts: aDraggedRowObject,
      });
    },

    goToTask: function (oEvent) {

      let selectedRow;

      if (!oEvent.Profile) {
        let oRow = oEvent.getParameter("row");
        selectedRow = oRow.getBindingContext("tree").getProperty("register");
      } else selectedRow = oEvent;

      this._item = selectedRow.NodeID;

      this.getView().getModel("table").setProperty("/selectedTask", selectedRow);

      if (window.location.href.indexOf(selectedRow.NodeID) !== -1) {
        this.getModel("appView").setProperty("/layout", "TwoColumnsBeginExpanded");
        return;
      }
      if (selectedRow.Item === "X") {
        this.getRouter().navTo("taskTable", {
          profile: selectedRow.Profile,
          instance: selectedRow.Instance,
          item: selectedRow.NodeID,
        });
      } else {
        this.getRouter().navTo("folderTable", {
          profile: selectedRow.Profile,
          instance: selectedRow.Instance,
          item: selectedRow.NodeID,
        });
      }

    },

    _onObjectMatched: function (oEvent) {
      let oArgs = oEvent.getParameter("arguments");
      this._profile = oArgs.profile;
      this._instance = oArgs.instance;
      this.getModel("appView").setProperty("/layout", "OneColumn");

      if (this._instance == 0) this.getView().getModel("detailView").setProperty("/isTemplate", true);
      else this.getView().getModel("detailView").setProperty("/isTemplate", false);

      let sItemPath, expand;
      if (this._instance == 0) {
        sItemPath = `/v2_modelos(Profile='${oArgs.profile}',Instance=${oArgs.instance})`;
        expand = "to_modelodetalhe";
        this.removePlanFieldsToTable();
      }
      else {
        sItemPath = `/v2_planos(Profile='${oArgs.profile}',Instance=${oArgs.instance})`;
        expand = "toPlanoDetalhes";
        this.addPlanFieldsToTable();
      }
      this._bindView(sItemPath, expand);
    },

    clearTables: function () {
      const tableData = this.getView().getModel("table").getProperty("/data");
      tableData.splice(0, tableData.length);
    },

    // onCloseDetailPress: function () {
    //   this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
    //   // No item should be selected on list after detail page is closed
    //   // this.getOwnerComponent().oListSelector.clearListListSelection();
    //   this.getModel("appView").setProperty("/layout", "OneColumn");

    //   this.getRouter().navTo("list");
    // },

    // toggleFullScreen: function () {
    //   var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
    //   this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
    //   if (!bFullScreen) {
    //     // store current layout and go full screen
    //     this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
    //     this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
    //   } else {
    //     // reset to previous layout
    //     this.getModel("appView").setProperty("/layout", this.getModel("appView").getProperty("/previousLayout"));
    //   }
    // },

    goToMainPage: function () {
      this.getView().getParent().getParent().removeAllBeginColumnPages();
      this.getRouter().navTo("main");
    },

    onFilterTable: function (oEvent) {

      const column = oEvent.getParameter("column");

      if (column.getFilterProperty() === "Coe") {

        oEvent.getParameter("column").setFilterType(new Boolean());
        const value = oEvent.getParameter("value").trim().toLowerCase();

        oEvent.preventDefault();

        function clear() {
          column.setFiltered(false);
          this.byId("tableTemplate").getBinding().filter("", "Application");
        }

        if (!value) {
          clear.apply(this);
          return;
        }

        let filterValue;
        if (value === "s" || value === "si" || value === "sim") filterValue = true;
        if (value === "n" || value === "na" || value === "nã" || value === "não" || value === "nao") filterValue = false;

        if (filterValue !== undefined) {
          const filter = new Filter("Coe", FilterOperator.EQ, filterValue);
          column.setFiltered(true);
          this.byId("tableTemplate").getBinding().filter(filter, "Application");
        } else {
          clear.apply(this);
        }
      }
    },

  });
});
