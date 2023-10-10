sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/m/library", "sap/ui/core/Fragment", "sap/m/Token", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/m/MessageToast", "sap/m/MessageBox"], function (BaseController, JSONModel, formatter, mobileLibrary, Fragment, Token, Filter, FilterOperator, MessageToast, MessageBox) {
  "use strict";

  // shortcut for sap.m.URLHelper
  var URLHelper = mobileLibrary.URLHelper;

  return BaseController.extend("votorantim.corp.clocov2planmanagement.controller.TaskApprovals", {
    formatter: formatter,

    onInit: function () {

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
      this.createModel([], "approvals");
      this.createModel([], "approvalHeader");
      this.createModel({}, "addChangeApprover");
      this.createModel([], "approvalLevels");

      this.getView().attachModelContextChange(null, this.onContextChange, this);
      this.registerEventBus();
    },

    onExit: function () {
      this.getView().detachModelContextChange(this.onContextChange, this);
      sap.ui.getCore().getEventBus().unsubscribe("TaskApprovals", "updateApprovals", this.onContextChange);
    },

    registerEventBus: function () {
      const oEventBus = sap.ui.getCore().getEventBus();
      oEventBus.subscribe("TaskApprovals", "updateApprovals", this.onContextChange, this);
    },

    onContextChange: function (oEvent) {
      if (!this.getView().getModel()) return;
      if (!this.getView().getBindingContext()) return;
      const context = this.getView().getBindingContext().getObject();
      // if (this._lastItem === context.NodeID) return;
      this._lastItem = context.NodeID;

      //Logic here
      this.getApprovalData();
    },

    onDataChanged: function () {
      if (!this._taskView) this._taskView = this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");
      if (!this._taskView.getModel("taskView").getProperty("/hasChanges")) {
        this._taskView.byId("ObjectPageTask").setShowFooter(true);
        this._taskView.getModel("taskView").setProperty("/hasChanges", true);
      }
    },

    getApprovalData: function () {
      const context = this.getView().getBindingContext().getObject();

      const filters = [
        new Filter({
          path: "Profile",
          operator: FilterOperator.EQ,
          value1: context.Profile
        }),
        new Filter({
          path: "Instance",
          operator: FilterOperator.EQ,
          value1: context.Instance
        }),
        new Filter({
          path: "Item",
          operator: FilterOperator.EQ,
          value1: context.NodeID
        })
      ]

      this.getModel().read(`/v2_workflows`, {
        filters: filters,
        success: function (oData, oResponse) {
          const approvals = [];
          for (const response of oResponse.data.results) {
            if (!response.UserId) {
              this.getModel("approvalHeader").setProperty("/", response);
              continue;
            }
            response.Level = parseInt(response.Level);
            response.highlight = this.getHighlight(response);
            response.validText = this.getValidText(response);
            response.notificationText = this.getNotificationText(response);
            approvals.push(response);
          }
          this.getModel("approvals").setProperty("/", approvals);
          this.setAvailableLevels("approvals");
        }.bind(this)
      });
    },

    setAvailableLevels: function (modelName) {
      let currentLevel = 0;
      const levels = [];
      const approvals = this.getModel(modelName).getProperty("/");

      for (const approval of approvals) {
        if (approval.Level > currentLevel) {
          currentLevel++;
          levels.push(currentLevel);
        }
      }
      currentLevel++;
      levels.push(currentLevel);
      this.getModel("approvalLevels").setProperty("/", levels);
    },

    onPressAddNewApprover: function () {
      this._operation = "add";
      this.getView().getModel("addChangeApprover").setProperty("/", { operation: "Novo Aprovador" });
      this.openApproverDialog();
    },

    openApproverDialog(operation) {

      const oView = this.getView();

      if (!this._addChangeApproverDialog) {
        this._addChangeApproverDialog = Fragment.load({
          id: oView.getId(),
          name: "votorantim.corp.clocov2planmanagement.fragments.AddChangeApproval",
          controller: this,
        }).then(function (oDialog) {
          oDialog.setModel(oView.getModel());
          oDialog.setBusyIndicatorDelay(0);
          oView.addDependent(oDialog);
          this.byId("idBtnAddChangeApproval").attachPress(null, this.addNewApprover, this);
          this.byId("idBtnAddChangeApprovalCloseDialog").attachPress(null, this.onCloseNewApproverDialog, this);
          return oDialog;
        }.bind(this));
      }

      this._addChangeApproverDialog.then(
        function (oDialog) {
          oDialog.open();
        }.bind(this)
      );
    },

    addNewApprover: async function () {

      let dialog;

      await this._addChangeApproverDialog.then(
        function (oDialog) {
          dialog = oDialog;
        }.bind(this)
      );

      dialog.setBusy(true);

      const approvals = this.getModel("approvals").getProperty("/");
      const addChangeApprover = this.getModel("addChangeApprover").getProperty("/");
      const context = this.getView().getBindingContext().getObject();

      if (!addChangeApprover.Notification) addChangeApprover.Notification = "T";

      if (!addChangeApprover.UserId) {
        MessageBox.error(`Campo "Usuário" é obrigatório`);
        dialog.setBusy(false);
        return;
      }
      if (!addChangeApprover.ValidFrom) {
        MessageBox.error(`Campo "Válido De" é obrigatório`);
        dialog.setBusy(false);
        return;
      }
      if (!addChangeApprover.ValidTo) {
        MessageBox.error(`Campo "Válido Até" é obrigatório`);
        dialog.setBusy(false);
        return;
      }
      if (addChangeApprover.ValidFrom > addChangeApprover.ValidTo) {
        MessageBox.error(`A data "Valido De" não pode ser após a data "Válido Até"`);
        dialog.setBusy(false);
        return;
      }
      if (addChangeApprover.UserId === this.getView().getBindingContext().getObject().RespExec) {
        MessageBox.error(`O Aprovador não pode ser o Executor da tarefa`);
        dialog.setBusy(false);
        return;
      }

      this.getView().setBusy(true);

      if (!addChangeApprover.ApproverName) {
        await this.getUserName(addChangeApprover);
      }

      this.validateInputSAP(["idApproverUserId#user"], null, "").then((error) => {
        if (error) {
          this.getView().setBusy(false);
          dialog.setBusy(false);
          return
        };

        this.getView().setBusy(false);
        addChangeApprover.highlight = this.getHighlight(addChangeApprover);

        addChangeApprover.validText = this.getValidText(addChangeApprover);
        addChangeApprover.notificationText = this.getNotificationText(addChangeApprover);

        addChangeApprover.Profile = context.Profile;
        addChangeApprover.Instance = context.Instance;
        addChangeApprover.Item = context.NodeID;

        if (this._operation !== "change")
          approvals.push(addChangeApprover);

        const sortApprovals = function compareFn(a, b) {
          if (a.Level < b.Level) {
            return -1;
          }
          if (a.Level > b.Level) {
            return 1;
          }
          return 0;
        }

        approvals.sort(sortApprovals);
        this.normalizeLevels(approvals);
        this.getModel("approvals").setProperty("/", approvals);
        this.setAvailableLevels("approvals");
        dialog.setBusy(false);
        this.onCloseNewApproverDialog();

        this.updateSAP();
        this.onDataChanged();

      });
    },

    getUserName: async function (addChangeApprover) {
      const filter = new Filter({
        // required from "sap/ui/model/Filter"
        path: "user",
        operator: FilterOperator.EQ, // required from "sap/ui/model/FilterOperator"
        value1: addChangeApprover.UserId,
      });

      await new Promise((resolve, reject) => {
        this.getModel().read("/v2_help_user", {
          filters: [filter],
          success: function (oData) {
            if (oData.results.length > 0)
              this.getView().getModel("addChangeApprover").setProperty("/ApproverName", oData.results[0].name);
            resolve(oData);
          }.bind(this)
        })
      })

      // this.getModel().read("/v2_help_user", {
      //   filters: [filter],
      //   success: function (oData) {
      //     if (oData.results.length > 0)
      //       this.getView().getModel("addChangeApprover").setProperty("/ApproverName", oData.results[0].name);
      //   }.bind(this)
      // })
    },

    onCloseNewApproverDialog: function () {
      if (this._addChangeApproverDialog) {
        this._addChangeApproverDialog.then(function (oDialog) {
          oDialog.close();
          oDialog.destroy();
        }.bind(this));
      }
      this._addChangeApproverDialog = undefined;
    },

    onPressRemoveApprover: function (oEvent, approver) {
      const approvals = this.getModel("approvals").getProperty("/");
      const filteredApprovals = approvals.filter(item => item.UserId !== approver.UserId || item.Level !== approver.Level || item.ValidFrom !== approver.ValidFrom || item.ValidTo !== approver.ValidTo)
      this.normalizeLevels(filteredApprovals);
      this.getModel("approvals").setProperty("/", filteredApprovals);
      this.setAvailableLevels("approvals");
      this.updateSAP();
      this.onDataChanged();
    },

    onPressChangeApprover: function (oEvent, approver) {
      this._operation = "change";
      this.getView().getModel("addChangeApprover").setProperty("/", approver);
      this.openApproverDialog();
    },

    updateSAP: function () {
      const context = this.getView().getBindingContext().getObject();
      this.removeAllFromSAP(context);

      const approvals = this.getModel("approvals").getProperty("/");
      for (const approval of approvals) {
        const wfBody = this.getWorkflowBody(approval);
        this.getModel().createEntry("/v2_workflows", { properties: wfBody, groupId: "workflows" });
      }

      const approvalHeader = this.getModel("approvalHeader").getProperty("/");
      this.getModel().createEntry("/v2_workflows", { properties: approvalHeader, groupId: "workflows" });
    },

    removeAllFromSAP: function (context) {
      const mParameters = { groupId: "workflows" };
      this.getModel().setDeferredGroups(["workflows"]);
      const fullPath = `/v2_workflows(Profile='${context.Profile}',Instance=${context.Instance},Item='${context.NodeID}',UserId='',Level='')`;
      this.getModel().remove(fullPath, mParameters);
    },

    onChangeActiveApproval: function () {
      this.onDataChanged();
      this.updateSAP();
    },

    onUserChanged: function () {
      this.getView().getModel("addChangeApprover").setProperty("/ApproverName", "");
      this.onDataChanged();
    }

  });
});