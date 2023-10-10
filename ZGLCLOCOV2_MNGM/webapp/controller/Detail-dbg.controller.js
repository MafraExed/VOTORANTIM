sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/ui/core/Fragment", "sap/m/MessageToast", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/Device", "sap/m/MessageBox"], function (BaseController, JSONModel, formatter, Fragment, MessageToast, Filter, FilterOperator, Device, MessageBox) {
  "use strict";

  return BaseController.extend("votorantim.corp.clocov2planmanagement.controller.Detail", {
    formatter: formatter,
    expandLevel: 9,

    _profile: "",
    _instance: "",

    onInit: function () {
      this.createModel(
        {
          hasSelectedItems: false,
          viewMode: "tree",
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

      this.createModel(
        {
          HierarchyLevel: "",
          Description: "",
          User_respons: "",
          Calend: "",
          selectedRow: {},
        },
        "newFolder"
      );

      this.createModel(
        {},
        "changeAlertConfigMass"
      );

      this.createModel({}, "changeTaskMass");
      this.createModel({}, "newTaskPlan");
      this.createModel({}, "motives");

      this.createModel(this.newEmptyTask(), "newTask");

      this.createModel([], "hierarchyChanges");

      this._aClipboardData = [];
      this.getView().setBusyIndicatorDelay(0);
      this.getView().setBusy(true);
      this.getRouter().getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
      this.getRouter().getRoute("task").attachPatternMatched(this.onTaskView, this);
      this.getRouter().getRoute("folder").attachPatternMatched(this.onFolderView, this);
      this.byId("TreeTemplate").expandToLevel(3);
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

    filterTable: function (oEvent) {
      this.filterTreeTable(oEvent.getParameter("query"));
    },

    filterTreeTable: function (text) {
      const treeData = this.getView().getModel("tree").getProperty("/data");
      const treeCompleteData = this.getView().getModel("tree").getProperty("/complete");
      if (treeCompleteData.length > 0) {
        treeData.length = 0;
        this.getView().getModel("tree").setProperty("/data", treeCompleteData);
      }
      if (!text) {
        this.getView().getModel("tree").refresh();
        return;
      }

      this.getView().getModel("tree").setProperty("/complete", treeData);

      var res = treeData[0].nodes.filter(function f(node) {
        if (node.register.Item) return node.register.Description.indexOf(text) !== -1;

        if (node.nodes) {
          return (node.nodes = node.nodes.filter(f)).length;
        }
      });

      this.getView().getModel("tree").setProperty("/data", res);
      this.getView().getModel("tree").refresh();

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

    _onBindingChange: function (oEvent) {

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
        this.byId("btChangeProfile").setText("trocar plano");
        property = "toPlanoDetalhes";
      }
      else {
        this.getModel("detailView").setProperty("/profileType", this.getView().getModel("i18n").getResourceBundle().getText("mainTemplate"));
        this.getModel("detailView").setProperty("/profileText", this.getView().getBindingContext().getProperty(`/v2_modelos(Profile='${this._profile}',Instance=${this._instance})/Text`));
        this.byId("btChangeProfile").setText("trocar modelo");
        property = "to_modelodetalhe";
      }

      let hierarquiaList = [];
      for (const hierarquiaPath of this.getView().getBindingContext().getProperty(property)) {
        const hierarquiaObject = this.getView()
          .getModel()
          .getProperty("/" + hierarquiaPath);
        hierarquiaList.push(hierarquiaObject);
      }
      this.getModel("tree").setProperty("/data", this.createNodeHierarchy(hierarquiaList));

      if (this._taskView || this._folderView) {
        const treeNodes = this.getView().getModel("tree").getProperty("/data");
        const selectedRow = this.getNode(this._item, treeNodes);
        this.getView().getModel("tree").setProperty("/selectedTask", selectedRow.register);
        this._taskView = false;
        this._folderView = false;
      }

      this.getView().setBusy(false);
    },

    onFolderView: function (oEvent) {
      let oArgs = oEvent.getParameter("arguments");

      this._profile = oArgs.profile;
      this._instance = oArgs.instance;
      this._item = oArgs.item;
      this._folderView = true;

      if (this._instance == 0) this.getView().getModel("detailView").setProperty("/isTemplate", true);
      else this.getView().getModel("detailView").setProperty("/isTemplate", false);

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

      this.getRouter().getRoute("task").detachPatternMatched(this.onTaskView, this);
      this.getRouter().getRoute("folder").detachPatternMatched(this.onFolderView, this);
    },

    onExpand: function () {
      if (this.expandLevel < 3) {
        this.expandLevel += 1;
      } else {
        this.expandLevel = 9;
      }
      this.byId("TreeTemplate").collapseAll();
      this.byId("TreeTemplate").expandToLevel(this.expandLevel);
    },

    onCollapse: function () {
      if (this.expandLevel === 0) return;
      if (this.expandLevel === 9) {
        this.expandLevel = 3;
      } else {
        this.expandLevel -= 1;
      }
      this.byId("TreeTemplate").collapseAll();
      this.byId("TreeTemplate").expandToLevel(this.expandLevel);
    },

    onSelectChange: function () {
      let selectedItems = [];

      selectedItems = this.byId("TreeTemplate").getSelectedIndices();

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
        "detailTable",
        {
          profile: this._profile,
          instance: this._instance,
        },
        bReplace
      );
    },

    goToTask: function (oEvent) {
      const hierarchyChanges = this.getView().getModel("hierarchyChanges").getProperty("/");

      let selectedRow;
      let oRow = oEvent.getParameter("row");
      selectedRow = oRow.getBindingContext("tree").getProperty("register");
      this._item = selectedRow.NodeID;

      this.getView().getModel("tree").setProperty("/selectedTask", selectedRow);

      const openTask = (oEvent) => {
        if (selectedRow.Item === "X") {
          if (window.location.href.indexOf(selectedRow.NodeID) !== -1) {
            this.getModel("appView").setProperty("/layout", "TwoColumnsBeginExpanded");
            return;
          }
          this.getView().getParent().getParent().removeAllMidColumnPages();
          this.getRouter().navTo("task", {
            profile: selectedRow.Profile,
            instance: selectedRow.Instance,
            item: selectedRow.NodeID,
          });
        } else {
          if (window.location.href.indexOf(selectedRow.NodeID) !== -1) {
            this.getModel("appView").setProperty("/layout", "TwoColumnsBeginExpanded");
            return;
          }
          this.getView().getParent().getParent().removeAllMidColumnPages();
          this.getRouter().navTo("folder", {
            profile: selectedRow.Profile,
            instance: selectedRow.Instance,
            item: selectedRow.NodeID,
          });
        }
      };

      if (hierarchyChanges.length > 0) {
        MessageBox.warning("Deseja salvar as alterações feitas até o momento?", {
          actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
          emphasizedAction: MessageBox.Action.OK,
          onClose: function (sAction) {
            if (sAction === MessageBox.Action.OK) {
              this.onSaveDetailChanges();
              if (selectedRow.NodeID.indexOf("NEW") !== -1) this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
              else openTask(oEvent);
            }
          }.bind(this),
        });
      } else openTask(oEvent);
    },

    goToTaskMenu: function (data) {
      const hierarchyChanges = this.getView().getModel("hierarchyChanges").getProperty("/");

      let selectedRow;
      selectedRow = data.register;
      this._item = selectedRow.NodeID;

      this.getView().getModel("tree").setProperty("/selectedTask", selectedRow);

      const openTask = (oEvent) => {
        if (selectedRow.Item === "X") {
          if (window.location.href.indexOf(selectedRow.NodeID) !== -1) return;
          this.getView().getParent().getParent().removeAllMidColumnPages();
          this.getRouter().navTo("task", {
            profile: selectedRow.Profile,
            instance: selectedRow.Instance,
            item: selectedRow.NodeID,
          });
        } else {
          if (window.location.href.indexOf(selectedRow.NodeID) !== -1) return;
          this.getView().getParent().getParent().removeAllMidColumnPages();
          this.getRouter().navTo("folder", {
            profile: selectedRow.Profile,
            instance: selectedRow.Instance,
            item: selectedRow.NodeID,
          });
        }

      };

      if (hierarchyChanges.length > 0) {
        MessageBox.warning("Deseja salvar as alterações feitas até o momento?", {
          actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
          emphasizedAction: MessageBox.Action.OK,
          onClose: function (sAction) {
            if (sAction === MessageBox.Action.OK) {
              this.onSaveDetailChanges();
              if (selectedRow.NodeID.indexOf("NEW") !== -1) this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
              else openTask(data);
            }
          }.bind(this),
        });
      } else openTask(data);
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
      }
      else {
        sItemPath = `/v2_planos(Profile='${oArgs.profile}',Instance=${oArgs.instance})`;
        expand = "toPlanoDetalhes";
      }
      this._bindView(sItemPath, expand);
    },

    clearTables: function () {
      const tableData = this.getView().getModel("table").getProperty("/data");
      // const treeData = this.getView().getModel("tree").getProperty("/data");
      this.getView().getModel("tree").setProperty("/data", []);
      const hierarchyChanges = this.getView().getModel("hierarchyChanges").getProperty("/");

      hierarchyChanges.splice(0, hierarchyChanges.length);
      tableData.splice(0, tableData.length);
    },

    openCreateFolderDialog: function (oEvent) {
      let oView = this.getView();
      this.getView().getModel("newFolder").setProperty("/selectedRow", oEvent);

      if (!this._newFolderDialog) {
        this._newFolderDialog = Fragment.load({
          id: oView.getId(),
          name: "votorantim.corp.clocov2planmanagement.fragments.NewFolder",
          controller: this,
        }).then(function (oDialog) {
          oDialog.setModel(oView.getModel());
          oView.addDependent(oDialog);
          return oDialog;
        });
      }

      this._newFolderDialog.then(
        function (oDialog) {
          oDialog.open();
        }.bind(this)
      );
    },

    openCreateTaskDialog: function (oEvent) {
      this.clearValueState(["newTaskDesc", "jobNewTask", "varNewTask", "tcodeNewTask"]);

      let oView = this.getView();
      this.getView().getModel("newTask").setProperty("/selectedRow", oEvent.getSource().data("rowkey"));

      if (!this._newTaskDialog) {
        this._newTaskDialog = Fragment.load({
          id: oView.getId(),
          name: "votorantim.corp.clocov2planmanagement.fragments.NewTask",
          controller: this,
        }).then(function (oDialog) {
          oDialog.setModel(oView.getModel());
          oView.addDependent(oDialog);
          return oDialog;
        });
      }

      this._newTaskDialog.then(
        function (oDialog) {
          oDialog.open();
        }.bind(this)
      );
    },

    onCreateFolder: function () {
      const newFolderData = this.getView().getModel("newFolder").getProperty("/");

      const fields = ["newFolderInputDescription", "btnRespNewFolder", "btnCalendarNewFolder"];

      // if (this.byId("idFolderType").getSelectedKey() === "BUKRS") fields.push("btnCompanyNewFolder");

      if (this.validateInputFields(fields)) return;

      this.validateInputSAP(["btnRespNewFolder#user", "btnCalendarNewFolder#calendar"]).then((error) => {
        if (error) return;

        if (newFolderData.selectedRow.register.Item) newFolderData.ParentNodeID = newFolderData.selectedRow.register.ParentNodeID;
        else newFolderData.ParentNodeID = newFolderData.selectedRow.register.NodeID;

        newFolderData.Profile = newFolderData.selectedRow.register.Profile;
        newFolderData.Instance = newFolderData.selectedRow.register.Instance;
        newFolderData.NodeID = "";

        this.addHierarchyChange(newFolderData, "new");
        this.getView().getModel("newFolder").setProperty("/", {});
        this.onCloseNewFolderDialog();
        this.byId("TreeTemplate").clearSelection();
      });
    },

    onCreateTask: function () {
      const fields = ["idNewTaskCompany", "newTaskDesc", "idBtnCreateUserExec", "newTaskPlanDias", "newTaskPlanHoras", "newTaskPlaDuracHoras"];

      if (this.byId("newTaskType").getSelectedKey() === "0") {
        fields.push("jobNewTask");
        fields.push("varNewTask");
      }

      if (this.byId("newTaskType").getSelectedKey() === "2") {
        fields.push("tcodeNewTask");
      }

      if (this.validateInputFields(fields)) return;

      this.validateInputSAP(["idNewTaskCompany#companies", "idBtnCreateUserExec#user", "idBtnCreateUserResp#user", "jobNewTask#program", "tcodeNewTask#tcode", "varNewTask#variant"], null, "jobNewTask").then((error) => {
        if (error) return;

        const newTaskData = this.getView().getModel("newTask").getProperty("/");

        if (newTaskData.selectedRow.register.Item) newTaskData.ParentNodeID = newTaskData.selectedRow.register.ParentNodeID;
        else newTaskData.ParentNodeID = newTaskData.selectedRow.register.NodeID;

        newTaskData.Profile = newTaskData.selectedRow.register.Profile;
        newTaskData.Instance = newTaskData.selectedRow.register.Instance;
        newTaskData.NodeID = "";
        newTaskData.Item = "X";

        this.addHierarchyChange(newTaskData, "new");
        this.getView().getModel("newTask").setProperty("/", this.newEmptyTask());
        this.onCloseNewTaskDialog();
        this.byId("TreeTemplate").clearSelection();
      });
    },

    addHierarchyChange: function (newHierarchyChange, typeOfChange) {
      const treeNodes = this.getView().getModel("tree").getProperty("/data");
      const hierarchyChanges = this.getView().getModel("hierarchyChanges").getProperty("/");
      const visibleRow = this.getModel("detailView").getProperty("/visibleRowsNode");

      if (!this.byId("detailPage").getShowFooter()) this.byId("detailPage").setShowFooter(true);

      // newHierarchyChange.typeOfChange = this.getTypeOfChange(typeOfChange);

      if (typeOfChange === "new") {
        let newObjectChange = {};
        Object.assign(newObjectChange, newHierarchyChange);
        newObjectChange.highlight = "Success";
        newObjectChange.typeOfChange = this.getTypeOfChange(typeOfChange);
        const hierarchyLevel = this.addNodeHierarchy(newObjectChange, treeNodes);
        newObjectChange.HierarchyLevel = hierarchyLevel;
        hierarchyChanges.push(newObjectChange);
        this.getModel("detailView").setProperty("/visibleRowsNode", visibleRow + 1);
      }

      if (typeOfChange === "delete") {
        let newObjectChange = {};
        Object.assign(newObjectChange, newHierarchyChange);
        newObjectChange.highlight = "Error";
        newObjectChange.typeOfChange = this.getTypeOfChange(typeOfChange);
        this.removeNodeHierarchy(newHierarchyChange, treeNodes);
        hierarchyChanges.push(newObjectChange);
      }
      this.getView().getModel("tree").refresh();
    },

    onCloseNewFolderDialog: function () {
      this._newFolderDialog.then(function (oDialog) {
        oDialog.close();
      });
    },

    onCloseNewTaskDialog: function () {
      this._newTaskDialog.then(function (oDialog) {
        oDialog.close();
      });
    },

    onSaveDetailChanges: function () {
      const newRecord = this.getTypeOfChange("new");
      const updateRecord = this.getTypeOfChange("update");
      const deleteRecord = this.getTypeOfChange("delete");
      const oParams = {
        json: true,
        useBatch: true,
      };

      this.getView().setBusy(true);

      const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/", oParams);

      const hierarchyChanges = this.getView().getModel("hierarchyChanges").getProperty("/");

      if (hierarchyChanges.length === 0) return;

      const sGroupId = new Date().getTime();
      const requestParams = {};
      requestParams.groupId = sGroupId;
      requestParams.changeSetId = "changeset";

      oModel.setDeferredGroups([sGroupId]);

      for (const hierarchyChange of hierarchyChanges) {
        const dataHierarquias = this.getBodyHierarchy(hierarchyChange);

        if (hierarchyChange.typeOfChange === newRecord) {
          oModel.create("/" + `v2_hierarquias`, dataHierarquias, requestParams);
        }
        if (hierarchyChange.typeOfChange === updateRecord) {
          oModel.update("/" + `v2_hierarquias(Profile='${hierarchyChange.Profile}',Instance=${hierarchyChange.Instance},NodeID='${hierarchyChange.NodeID}')`, dataHierarquias, requestParams);
        }
        if (hierarchyChange.typeOfChange === deleteRecord) {
          if (hierarchyChange.NodeID.indexOf("NEW") !== -1) continue;
          oModel.remove("/" + `v2_hierarquias(Profile='${hierarchyChange.Profile}',Instance=${hierarchyChange.Instance},NodeID='${hierarchyChange.NodeID}')`, requestParams);
        }
      }

      oModel.submitChanges({
        success: function (oData, sResponse) {
          console.log(sResponse);
          const hierarchyChanges = this.getView().getModel("hierarchyChanges").getProperty("/");
          hierarchyChanges.splice(0, hierarchyChanges.length);
          const currentDoc = this.getView().getModel("tree").getProperty("/data/0");
          this.getModel().refresh(true);
          MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("appDataSaved"));
          this.byId("detailPage").setShowFooter(false);
        }.bind(this),
        error: function (oError) {
          // this.getView().setBusy(false);
        }.bind(this),
      });
    },

    menuDeleteNode: function (oEvent) {
      const nodeDelete = oEvent.getSource().data("rowkey");
      this.removeFromHierarchyChanges(nodeDelete);
      this.addHierarchyChange(nodeDelete.register, "delete");
    },

    removeFromHierarchyChanges: function (node) {
      let hierarchyChanges = this.getView().getModel("hierarchyChanges").getProperty("/");
      hierarchyChanges = hierarchyChanges.filter((item) => {
        if (node.NodeID === item.NodeID) return false;
        else return true;
      });
      this.getView().getModel("hierarchyChanges").setProperty("/", hierarchyChanges);
    },

    onCopyByMenuContext: function (oEvent) {
      const clipboardData = this.getView().getModel("detailView").getProperty("/clipboardData");
      const newObject = {};
      const nodeCopy = oEvent.getSource().data("rowkey");
      if (clipboardData.length > 0) clipboardData.splice(0, clipboardData.length);
      Object.assign(newObject, nodeCopy);
      clipboardData.push(newObject);
      MessageToast.show("Dados copiados");
    },

    onPasteByMenuContext: function (oEvent) {
      const clipboardData = this.getView().getModel("detailView").getProperty("/clipboardData");
      const nodePaste = oEvent.getSource().data("rowkey");

      clipboardData[0].register.CopyFrom = clipboardData[0].NodeID;
      if (clipboardData[0].NodeID.indexOf("NEW") !== -1) {
        clipboardData[0].register.NodeID = clipboardData[0].NodeID;
        clipboardData[0].register.CopyFrom = clipboardData[0].register.CopyFrom.replace("NEW", "");
      }
      else {
        clipboardData[0].NodeID += "NEW";
        clipboardData[0].register.NodeID += "NEW";
      }

      if (nodePaste.register.Item) {
        clipboardData[0].ParentNodeID = nodePaste.parent.NodeID;
        clipboardData[0].register.ParentNodeID = nodePaste.parent.NodeID;
      } else {
        clipboardData[0].ParentNodeID = nodePaste.NodeID;
        clipboardData[0].register.ParentNodeID = nodePaste.NodeID;
      }

      this.addHierarchyChange(clipboardData[0].register, "new");

      const pasteNodes = (clipboardNode) => {
        const newNode = {};

        Object.assign(newNode, clipboardNode);

        newNode.register.CopyFrom = newNode.NodeID;
        newNode.NodeID += "NEW";
        newNode.register.NodeID += "NEW";
        newNode.register.ParentNodeID += "NEW";
        newNode.ParentNodeID += "NEW";

        this.addHierarchyChange(newNode.register, "new");

        if (newNode.nodes.length > 0) {
          for (const node of newNode.nodes) {
            pasteNodes(node);
          }
        }
      };
      if (clipboardData[0].nodes.length > 0) {
        for (const node of clipboardData[0].nodes) {
          pasteNodes(node);
        }
      }
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

    showCalendarSearchHelp: function (oEvent) {
      const source = oEvent.getSource();

      if (source.getId().indexOf("btnCalendarNewFolder") !== -1 || source.getId().indexOf("btnCalendarChangeFolder")) {
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
        this.onValueHelpRequested(dataPath, "columnsSearchHelp", title, fieldsSearch, this.onSHPressCalendarCreateFolder.bind(this), false);
        return;
      }
    },

    onSHPressCalendarCreateFolder: function (oEvent) {
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      this.getView().getModel("newFolder").setProperty("/Calend", object.IDCalendFabrica);
      this.getView().getModel("newFolder").refresh();
      this._oValueHelpDialog.close();
    },

    onPressChangeFolderMass: function () {
      let hasFolder = false;
      let oView = this.getView();
      let table;
      const type = this.getView().getModel("detailView").getProperty("/viewMode");

      if (type === "tree") table = this.getView().byId("TreeTemplate");
      else table = this.getView().byId("tableTemplate");

      const indices = table.getSelectedIndices();

      for (const indice of indices) {
        const object = table.getContextByIndex(indice).getObject();
        if (!object.register.Item) {
          hasFolder = true;
          break;
        }
      }

      if (!hasFolder) {
        MessageToast.show("Nenhuma pasta selecionada");
        return;
      }

      if (!this._changeFolderMassDialog) {
        this._changeFolderMassDialog = Fragment.load({
          id: oView.getId(),
          name: "votorantim.corp.clocov2planmanagement.fragments.ChangeFolderMass",
          controller: this,
        }).then(function (oDialog) {
          oDialog.setModel(oView.getModel());
          oView.addDependent(oDialog);
          return oDialog;
        });
      }

      this._changeFolderMassDialog.then(
        function (oDialog) {
          oDialog.open();
        }.bind(this)
      );
    },

    onCloseChangeMassFolderDialog: function () {
      this._changeFolderMassDialog.then(function (oDialog) {
        oDialog.close();
      });
    },

    onChangeFolderMass: function () {
      const fields = [];

      // if (this.byId("typeFolderMass").getSelectedKey() === "BUKRS") fields.push("btnCompanyChangeFolder");

      if (this.validateInputFields(fields)) return;

      this.validateInputSAP(["btnRespChangeFolder#user", "btnCalendarChangeFolder#calendar"]).then((error) => {
        if (error) return;

        MessageBox.warning("Atenção! Todas as pastas selecionadas serão modificadas com as novas entradas inseridas. Tem certeza que deseja aplicar as alterações?", {
          actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
          emphasizedAction: MessageBox.Action.OK,
          onClose: function (sAction) {
            if (sAction === MessageBox.Action.OK) {
              let totalItems;
              let totalCompleted = 0;

              const requestParams = { groupId: "updateFolderMass" };
              const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/", requestParams);
              oModel.setDeferredGroups([requestParams.groupId]);

              this.getView().setBusy(true);
              let table;
              const type = this.getView().getModel("detailView").getProperty("/viewMode");

              if (type === "tree") table = this.getView().byId("TreeTemplate");
              else table = this.getView().byId("tableTemplate");

              const folderChangeMass = this.getView().getModel("newFolder").getProperty("/");

              const indices = table.getSelectedIndices();
              totalItems = indices.length;

              this.setProgress(0);
              this.displayDialogProgress();

              const updateItems = (fromIndex) => {
                let updatedItems = 0;
                for (let index = fromIndex; index < indices.length; index++) {

                  const indice = indices[index];
                  const object = this.getModel("tree").getProperty(table.getContextByIndex(indice).getPath());
                  if (object.register.Item) {
                    totalItems--;
                    continue;
                  }
                  if (folderChangeMass.Description) object.register.Description = folderChangeMass.Description;
                  if (folderChangeMass.User_respons) object.register.User_respons = folderChangeMass.User_respons;
                  if (folderChangeMass.Type) object.register.Type = folderChangeMass.Type;
                  if (folderChangeMass.BUKRS) object.register.BUKRS = folderChangeMass.BUKRS;
                  if (folderChangeMass.Calend) object.register.Calend = folderChangeMass.Calend;

                  const updateTask = this.getBodyHierarchy(object.register);
                  this.getModel("tree").setProperty(table.getContextByIndex(indice).getPath(), object);

                  oModel.update(`/v2_hierarquias(Profile='${updateTask.Profile}',Instance=${updateTask.Instance},NodeID='${updateTask.NodeID}')`, updateTask, { groupId: "updateFolderMass" });
                  updatedItems++;
                  totalCompleted++;

                  if (updatedItems === this.massBatchSize || totalCompleted === totalItems) {
                    this.submitChangesSync(oModel, "updateFolderMass").then(() => {
                      this.setProgress((totalCompleted / totalItems) * 100);
                      if (totalCompleted !== totalItems)
                        updateItems(totalCompleted);
                      else {
                        const hierarchyChanges = this.getView().getModel("hierarchyChanges").getProperty("/");
                        hierarchyChanges.splice(0, hierarchyChanges.length);
                        this.onCloseChangeMassFolderDialog();
                        this.getView().setBusy(false);
                        this.closeDialogProgress();
                        if (this._item)
                          this.getModel().read(`/v2_pastas(Profile='${this._profile}',Instance=${this._instance},Item='${this._item}')`);
                        MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("appDataSaved"));
                      }
                    })
                    return;
                  }
                }
              }
              updateItems(totalCompleted);
            }
          }.bind(this),
        });
      });
    },

    onDragStart: function (oEvent) {
      var oTreeTable = this.byId("TreeTemplate");
      var oDragSession = oEvent.getParameter("dragSession");
      var oDraggedRow = oEvent.getParameter("target");
      var iDraggedRowIndex = oDraggedRow.getIndex();
      var aSelectedIndices = oTreeTable.getSelectedIndices();
      var aDraggedRowContexts = [];

      if (aSelectedIndices.length > 0) {
        // If rows are selected, do not allow to start dragging from a row which is not selected.
        if (aSelectedIndices.indexOf(iDraggedRowIndex) === -1) {
          oEvent.preventDefault();
        } else {
          for (var i = 0; i < aSelectedIndices.length; i++) {
            aDraggedRowContexts.push(oTreeTable.getContextByIndex(aSelectedIndices[i]));
          }
        }
      } else {
        aDraggedRowContexts.push(oTreeTable.getContextByIndex(iDraggedRowIndex));
      }

      oDragSession.setComplexData("hierarchymaintenance", {
        draggedRowContexts: aDraggedRowContexts,
      });
    },

    onDrop: function (oEvent) {
      const parameters = oEvent.getParameters();
      var oTreeTable = this.byId("TreeTemplate");
      var oDragSession = oEvent.getParameter("dragSession");
      var oDroppedRow = oEvent.getParameter("droppedControl");
      var aDraggedRowContexts = oDragSession.getComplexData("hierarchymaintenance").draggedRowContexts;
      var oNewParentContext = oTreeTable.getContextByIndex(oDroppedRow.getIndex());
      let hasChanges = false;

      if (aDraggedRowContexts.length === 0 || !oNewParentContext) {
        return;
      }

      var oModel = oTreeTable.getBinding().getModel();
      var oNewParent = oNewParentContext.getProperty();

      if (oNewParent.register.Item !== "X" && parameters.dropPosition !== "Before") {
        for (var i = 0; i < aDraggedRowContexts.length; i++) {
          if (oNewParentContext.getPath().indexOf(aDraggedRowContexts[i].getPath()) === 0) {
            continue;
          }
          hasChanges = true;
          const oDraggedObject = aDraggedRowContexts[i].getProperty();
          oDraggedObject.ParentNodeID = oNewParent.NodeID;
          oDraggedObject.parent = oNewParent;
          oDraggedObject.register.ParentNodeID = oNewParent.NodeID;
          const objectContext = aDraggedRowContexts[i].getObject();
          oModel.setProperty(aDraggedRowContexts[i].getPath(), undefined, aDraggedRowContexts[i], true);
          oNewParent.nodes.unshift(objectContext);
        }
        this.recalculateHierarchyLevel(oNewParent.nodes);
        this.getView().getModel("tree").refresh();
      } else {
        for (var i = 0; i < aDraggedRowContexts.length; i++) {
          if (oNewParentContext.getPath().indexOf(aDraggedRowContexts[i].getPath()) === 0) {
            continue;
          }
          hasChanges = true;
          const oDraggedObject = aDraggedRowContexts[i].getProperty();
          oDraggedObject.ParentNodeID = oNewParent.parent.NodeID;
          oDraggedObject.register.ParentNodeID = oNewParent.parent.NodeID;
          oDraggedObject.parent = oNewParent.parent;
          const objectContext = aDraggedRowContexts[i].getObject();
          oModel.setProperty(aDraggedRowContexts[i].getPath(), undefined, aDraggedRowContexts[i], true);
          if (parameters.dropPosition === "After" || parameters.dropPosition === "On") oNewParent.parent.nodes.splice(oNewParent.register.HierarchyLevel, 0, objectContext);
          else oNewParent.parent.nodes.splice(oNewParent.register.HierarchyLevel - 1, 0, objectContext);
        }
        this.recalculateHierarchyLevel(oNewParent.parent.nodes);
        this.getView().getModel("tree").refresh();
      }
      if (hasChanges) if (!this.byId("detailPage").getShowFooter()) this.byId("detailPage").setShowFooter(true);
    },

    recalculateHierarchyLevel: function (parentNode) {
      let index = 0;
      const filtered = parentNode.filter(function (value, index, arr) {
        return value !== undefined;
      });
      parentNode.length = 0;
      parentNode.push(...filtered);
      for (const child of parentNode) {
        if (child) {
          child.register.HierarchyLevel = index + 1;
          this.updateNode(child.register);
          index++;
        }
      }
    },

    updateNode: function (node) {
      if (!node.typeOfChange) node.typeOfChange = "U";
      const hierarchyChanges = this.getView().getModel("hierarchyChanges").getProperty("/");
      const foundNode = hierarchyChanges.find((hierarchyChange) => {
        return hierarchyChange.NodeID === node.NodeID;
      });
      if (foundNode) {
        foundNode.ParentNodeID = node.ParentNodeID;
        foundNode.HierarchyLevel = node.HierarchyLevel;
      } else {
        hierarchyChanges.push(node);
      }
      this.getView().getModel("hierarchyChanges").setProperty("/", hierarchyChanges);
    },

    onCutByMenuContext: function (oEvent) {
      this.onCopyByMenuContext(oEvent);
      this.menuDeleteNode(oEvent);
    },

    onDragDepStart: function (oEvent) {
      var oTable = this.byId("TreeTemplate");
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
            aDraggedRowObject.push(oTable.getContextByIndex(aSelectedIndices[i]).getObject().register);
          }
        }
      } else {
        aDraggedRowObject.push(oTable.getContextByIndex(iDraggedRowIndex).getObject().register);
      }

      oDragSession.setComplexData("movedep", {
        draggedRowContexts: aDraggedRowObject,
      });
    },

    goToMainPage: function () {
      this.getView().getParent().getParent().removeAllBeginColumnPages();
      this.getRouter().navTo("main");
    },
  });
});
