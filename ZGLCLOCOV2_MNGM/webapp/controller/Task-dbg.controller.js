sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/m/library", "sap/ui/core/Fragment", "sap/m/Link", "sap/m/MessageToast", "sap/m/Token", "sap/m/MessageBox"], function (BaseController, JSONModel, formatter, mobileLibrary, Fragment, Link, MessageToast, Token, MessageBox) {
  "use strict";

  return BaseController.extend("votorantim.corp.clocov2planmanagement.controller.Task", {
    formatter: formatter,

    onInit: function () {
      this.createModel(
        {
          hasChanges: false,
          dependentDialog: {
            display: "tree",
          },
          suggestMassChanges: false
        },
        "taskView"
      );

      // this.createModel(
      //   {
      //     nodes: [],
      //     lines: [],
      //   },
      //   "graphPredSuc"
      // );

      this.createModel(
        {
          lembreteEmails: [],
          AtividadeNaoInicEmails: [],
          AtividadeNaoEncEmails: [],
          AtividadeDispEmails: [],
          AtividadeRepEmails: [],
          AtividadeFinEmails: []
        },
        "alertEmails"
      );

      this.createModel(
        {
          data: [],
        },
        "tarefas_pred"
      );

      this.createModel(
        {
          data: [],
        },
        "tarefas_suc"
      );

      this.createModel(
        {
          cols: [],
        },
        "columnsSearchHelp"
      );

      this.createModel({}, "notificacao");
      this.createModel({}, "suggestMassDep");

      this.getRouter().getRoute("task").attachPatternMatched(this._onObjectMatched, this);
      this.getRouter().getRoute("taskTable").attachPatternMatched(this._onObjectMatched, this);
    },

    mountBreadcumb: function () {
      const pathComplete = this.getView("task").getBindingContext().getProperty("Caminho");
      const paths = pathComplete.split("/");
      const breadcumb = this.byId("idBreadcumb");
      breadcumb.destroyLinks();
      for (const path of paths) {
        const link = new Link({ text: path, enabled: false });
        breadcumb.addLink(link);
      }
    },

    getTaskDetailViewId: function () {
      const sections = this.byId("ObjectPageTask").getSections();
      const subsection = sections[0].getSubSections();
      const blocks = subsection[0].getBlocks();
      return blocks[0].getSelectedView();
    },

    getTaskAlertViewId: function () {
      const sections = this.byId("ObjectPageTask").getSections();
      const subsection = sections[3].getSubSections();
      const blocks = subsection[0].getBlocks();
      return blocks[0].getSelectedView();
    },

    getTaskWorkflowViewId: function () {
      const sections = this.byId("ObjectPageTask").getSections();
      const subsection = sections[4].getSubSections();
      const blocks = subsection[0].getBlocks();
      return blocks[0].getSelectedView();
    },

    validateWorkflowFields: function () {
      const workflowViewId = this.getTaskWorkflowViewId();
      const approvalsList = sap.ui.getCore().byId(workflowViewId).byId("gridList");
      const switchApproval = sap.ui.getCore().byId(workflowViewId).byId("idSwitchApproval");

      if (switchApproval.getState())
        if (approvalsList.getAggregation("items").length === 0) {
          MessageBox.error("É necessário selecionar ao menos um aprovador");
          return true;
        }

      return false;
    },

    validateAlertFields: function () {
      const taskAlertId = this.getTaskAlertViewId();
      const alertData = this.getView().getModel().getProperty(this.getView().getBindingContext().getPath() + "/to_notificacao");
      const multiInputLembrete = sap.ui.getCore().byId(taskAlertId).byId("idMultiEmailLembrete");
      const multiInputNaoInic = sap.ui.getCore().byId(taskAlertId).byId("idMultiEmailatividadeNaoInic");
      const multiInputNaoEnc = sap.ui.getCore().byId(taskAlertId).byId("idMultiEmailAtividadeNaoEnc");
      const multiInputDisp = sap.ui.getCore().byId(taskAlertId).byId("idMultiEmailAtividadeDisp");
      const multiInputRep = sap.ui.getCore().byId(taskAlertId).byId("idMultiEmailAtividadeReoroc");
      const multiInputFin = sap.ui.getCore().byId(taskAlertId).byId("idMultiEmailAtividadeFin");
      let emails;

      if (alertData.Lembrete) {
        multiInputLembrete.setValueState("None");
        for (const token of multiInputLembrete.getTokens()) {
          if (!emails) emails = token.getKey();
          else emails = emails + ";" + token.getKey();
        }
        this.getView().getModel().setProperty(this.getView().getBindingContext().getPath() + "/to_notificacao/LembreteEmails", emails)
        // }
        emails = null;
      }

      if (alertData.AtividadeNaoIniciada) {
        multiInputNaoInic.setValueState("None");
        for (const token of multiInputNaoInic.getTokens()) {
          if (!emails) emails = token.getKey();
          else emails = emails + ";" + token.getKey();
        }
        this.getView().getModel().setProperty(this.getView().getBindingContext().getPath() + "/to_notificacao/AtividadeNaoInicEmails", emails)
        emails = null;
      }

      if (alertData.AtividadeNaoEncerrada) {
        multiInputNaoEnc.setValueState("None");
        for (const token of multiInputNaoEnc.getTokens()) {
          if (!emails) emails = token.getKey();
          else emails = emails + ";" + token.getKey();
        }
        this.getView().getModel().setProperty(this.getView().getBindingContext().getPath() + "/to_notificacao/AtividadeNaoEncEmails", emails)
        emails = null;
      }

      if (alertData.AtividadeDisponivel) {
        multiInputDisp.setValueState("None");
        const emailsDisp = multiInputDisp.getTokens();
        if (emailsDisp.length === 0) {
          multiInputDisp.setValueState("Error");
          MessageBox.error("É necessário incluir ao menos um e-mail para o Alerta de Tarefa Disponível");
          return true;
        }
        for (const token of emailsDisp) {
          if (!emails) emails = token.getKey();
          else emails = emails + ";" + token.getKey();
        }
        this.getView().getModel().setProperty(this.getView().getBindingContext().getPath() + "/to_notificacao/AtividadeDispEmails", emails)
        emails = null;
      }

      if (alertData.AtividadeReprocessada) {
        multiInputRep.setValueState("None");
        const emailsReproc = multiInputRep.getTokens();
        if (emailsReproc.length === 0) {
          multiInputRep.setValueState("Error");
          MessageBox.error("É necessário incluir ao menos um e-mail para o Alerta de Tarefa Reprocessada");
          return true;
        }
        for (const token of emailsReproc) {
          if (!emails) emails = token.getKey();
          else emails = emails + ";" + token.getKey();
        }
        this.getView().getModel().setProperty(this.getView().getBindingContext().getPath() + "/to_notificacao/AtividadeRepEmails", emails)
        emails = null;
      }

      if (alertData.AtividadeFinalizada) {
        multiInputFin.setValueState("None");
        const emailsFin = multiInputFin.getTokens();
        if (emailsFin.length === 0) {
          multiInputFin.setValueState("Error");
          MessageBox.error("É necessário incluir ao menos um e-mail para o Alerta de Tarefa Finalizada");
          return true;
        }
        for (const token of emailsFin) {
          if (!emails) emails = token.getKey();
          else emails = emails + ";" + token.getKey();
        }
        this.getView().getModel().setProperty(this.getView().getBindingContext().getPath() + "/to_notificacao/AtividadeFinEmails", emails)
        emails = null;
      }

      const contextData = this.getView().getBindingContext().getObject();

      this.getView().getModel().setProperty(this.getView().getBindingContext().getPath() + "/to_notificacao/Profile", contextData.Profile)
      this.getView().getModel().setProperty(this.getView().getBindingContext().getPath() + "/to_notificacao/Instance", contextData.Instance)
      this.getView().getModel().setProperty(this.getView().getBindingContext().getPath() + "/to_notificacao/Item", contextData.NodeID)

      return false;

    },

    onPressSaveTask: function (oEvent, executeMassDep) {

      if (executeMassDep) {
        this._suggestChangeMassDep.then(function (oDialog) {
          oDialog.setBusy(true);
          oDialog.setBusyIndicatorDelay(0);
        });
      }

      const fields = ["idCompanyTask", "taskDetailDesc", "idBtnRespExec", "taskDetailPlanDias", "taskDetailPlanHoras", "taskDetailPlanDuracHoras"];
      const blockId = this.getTaskDetailViewId();

      if (sap.ui.getCore().byId(blockId).byId("taskDetailType").getSelectedKey() === "0") {
        fields.push("jobTaskDetail");
        fields.push("varTaskDetail");
        sap.ui.getCore().byId(blockId).byId("tcodeTaskDetail").setValue("");
      }

      if (sap.ui.getCore().byId(blockId).byId("taskDetailType").getSelectedKey() === "2") {
        fields.push("tcodeTaskDetail");
        sap.ui.getCore().byId(blockId).byId("jobTaskDetail").setValue("");
        sap.ui.getCore().byId(blockId).byId("varTaskDetail").setValue("");
      }

      if (sap.ui.getCore().byId(blockId).byId("taskDetailType").getSelectedKey() === "3") {
        sap.ui.getCore().byId(blockId).byId("tcodeTaskDetail").setValue("");
        sap.ui.getCore().byId(blockId).byId("jobTaskDetail").setValue("");
        sap.ui.getCore().byId(blockId).byId("varTaskDetail").setValue("");
      }

      if (this.validateInputFields(fields, sap.ui.getCore().byId(blockId))) return;

      if (this.validateWorkflowFields()) return;

      if (this.validateAlertFields()) return;

      this.validateInputSAP(["idCompanyTask#companies", "idBtnRespExec#user", "idBtnResp#user", "jobTaskDetail#program", "tcodeTaskDetail#tcode", "varTaskDetail#variant"], sap.ui.getCore().byId(blockId), "jobTaskDetail").then((error) => {
        if (error) return;

        this.getView().setBusy(true);
        // this.getModel().setProperty("/" + this.getView().getBindingContext().getPath(), this.getView().getBindingContext().getObject());
        this.getModel().submitChanges({
          success: function (oData) {
            this.getView().setBusy(false);
            MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("appDataSaved"));
            this.byId("ObjectPageTask").setShowFooter(false);
            this.getView().getModel("taskView").setProperty("/hasChanges", false);
            this.getView().getModel("taskView").setProperty("/suggestMassChanges", false);

            if (this._getRouteName() === "taskTable")
              this.updateDetailView('table');
            else
              this.updateDetailView('tree');

            if (executeMassDep) {
              this.applySuggestMassDep();
              this.getView().getModel().refresh(true, true);
            }


            // const tarefasEntries = this.getView().getModel().getProperty("/");
            // for (const [key, value] of Object.entries(tarefasEntries)) {
            //   if (key.indexOf("v2_tarefas(Profile") !== -1) this.getView().getModel().read("/" + key + "/toDependentes");
            // }

          }.bind(this),
        });
      });
    },

    updateDetailView: function (view) {
      const currentTaskData = this.getView().getBindingContext().getObject();
      const selectedTask = this.getView().getModel(view).getProperty("/selectedTask");

      for (const key in currentTaskData) {
        if (selectedTask.hasOwnProperty(key)) {
          selectedTask[key] = currentTaskData[key];
        }
      }

      selectedTask.Description = currentTaskData.DescTarefa;
      selectedTask.User_respons = currentTaskData.Resp;
      selectedTask.User_respons_exec = currentTaskData.RespExec;
      selectedTask.Kind = currentTaskData.TipoTarefa;
      selectedTask.Programa = currentTaskData.NomePrograma;
      selectedTask.Variante = currentTaskData.VariantePrograma;

      this.getView().getModel(view).setProperty("/selectedTask", selectedTask);

    },

    datachanged: function () {
      if (!this.getView().getModel("taskView").getProperty("/hasChanges")) {
        this.byId("ObjectPageTask").setShowFooter(true);
        this.getView().getModel("taskView").setProperty("/hasChanges", true);
      }
    },

    _onObjectMatched: function (oEvent) {
      this.getView().byId("ObjectPageTask").setSelectedSection(null);
      this.getModel("appView").setProperty("/layout", "TwoColumnsBeginExpanded");
      let oArgs = oEvent.getParameter("arguments");

      let sItemPath = `/v2_tarefas(Profile='${oArgs.profile}',Instance=${oArgs.instance},NodeID='${oArgs.item}')`;
      this._profile = oArgs.profile;
      this._instance = oArgs.instance;
      this._item = oArgs.item;
      this._route = oEvent.getSource().getPattern();
      this._bindView(sItemPath);
    },

    _bindView: function (sObjectPath) {
      this.getView().bindElement({
        path: sObjectPath,
        parameters: {
          expand: "to_tarefas_pred,to_tarefas_suc,to_notificacao,toDependentes",
        },
        events: {
          change: this._onBindingChange.bind(this),
          dataRequested: function () {
            this.getView().setBusy(true);
          }.bind(this),
          dataReceived: function (oEvent) {
            if (!oEvent.getParameter("data").Profile) this.goToDetail();
          }.bind(this),
        },
      });
    },

    goToDetail: function () {
      let route;

      if (this._route.indexOf("tree") !== -1) route = "detail";
      else route = "detailTable";

      this.getRouter().navTo(
        route,
        {
          profile: this._profile,
          instance: this._instance,
        },
        true
      );
    },

    _onBindingChange: function () {


      var oView = this.getView(),
        oElementBinding = oView.getElementBinding();

      if (!oElementBinding.getBoundContext()) {
        this.goToDetail();
        // this.getRouter().getTargets().display("detailObjectNotFound");
        return;
      }
      this.getTarefasPred();
      this.getTarefasSuc();
      this.mountBreadcumb();
      // this.mountGraph();
      this.getView().setBusy(false);
    },

    getEmailTokens: function (emails) {
      // const tokens = [];
      // if (emails === "") return tokens;
      // const emailList = emails.split(";");
      // for (const email of emailList) {
      //   const tokenEmail =  new Token({ key: email, text: email });
      //   // const tokenEmail = new Token({ text: email, key: email });
      //   tokens.push(tokenEmail);
      // }
      // return tokens;
    },

    getTarefasPred: function () {
      const tarefasPredPaths = this.getView("task").getBindingContext().getProperty("to_tarefas_pred");

      const tarefasPredEntries = this.getView().getModel("tarefas_pred").getProperty("/data");
      tarefasPredEntries.splice(0, tarefasPredEntries.length);
      for (const tarefaPath of tarefasPredPaths) {
        const tarefasPredObject = this.getView()
          .getModel()
          .getProperty("/" + tarefaPath);
        tarefasPredEntries.push(tarefasPredObject);
      }
      this.getView().getModel("tarefas_pred").refresh();
    },

    getTarefasSuc: function () {
      const tarefasSucPaths = this.getView("task").getBindingContext().getProperty("to_tarefas_suc");

      const tarefasSucEntries = this.getView().getModel("tarefas_suc").getProperty("/data");
      tarefasSucEntries.splice(0, tarefasSucEntries.length);
      for (const tarefaPath of tarefasSucPaths) {
        const tarefasSucObject = this.getView()
          .getModel()
          .getProperty("/" + tarefaPath);
        tarefasSucEntries.push(tarefasSucObject);
      }
      this.getView().getModel("tarefas_suc").refresh();
    },

    onCloseDetailPress: function () {
      this.getModel("appView").setProperty("/actionButtonsInfo/endColumn/fullScreen", false);
      // No item should be selected on list after detail page is closed
      // this.getOwnerComponent().oListSelector.clearListListSelection();
      // set the layout property of FCL control to show two columns
      this.getModel("appView").setProperty("/layout", "OneColumn");
      this.getRouter().navTo("object", {
        objectId: "01",
        // objectId : oItem.getBindingContext().getProperty("OrderID")
      });
    },

    onPressSuggestMassChanges: function () {

      const currentObject = this.getView().getBindingContext().getObject();
      if (currentObject.Empresa === "") {
        MessageBox.error("Campo Empresa é obrigatório");
        return;
      }

      sap.ui.core.BusyIndicator.show();

      const getKey = (request, keyId) => {
        const begin = request.indexOf(keyId) + keyId.length + 2;
        const end = begin + 12;
        return request.substring(begin, end)
      }

      // pega as alterações feitas até o momento (relacionadas a Dependência)
      const changes = this.getView().getModel().mDeferredRequests;

      const requests = changes.changeDep?.changes.undefined;

      if (!requests) return;

      const oParams = {
        useBatch: true,
        defaultUpdateMethod: "GET",
        groupId: "getSuggestMassDep"
      };

      const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/", oParams);
      const requestParams = {};
      requestParams.groupId = oParams.groupId;
      requestParams.urlParameters = { "$expand": "toSugestaoMassaDep" };

      oModel.setDeferredGroups([oParams.groupId]);

      for (const request of requests) {

        let NodeID;
        let Item_prev;

        if (request.request.method === "DELETE") {
          NodeID = getKey(request.request.requestUri, "NodeID");
          Item_prev = getKey(request.request.requestUri, "Item_prev");
        }
        else {
          NodeID = request.request.data.NodeID;
          Item_prev = request.request.data.Item_prev;
        }

        oModel.read("/" + `v2_sugestao_massa_deps(Profile='${this._profile}',Instance=${this._instance},Empresa='',NodeID='${NodeID}',Item_prev='${Item_prev}',Method='${request.request.method}')`, requestParams);

      }

      oModel.submitChanges({
        groupId: requestParams.groupId,
        success: function (oData) {

          const responses = [];
          const compatibleCompanies = [];

          for (const response of oData.__batchResponses) {
            responses.push(...response.data.toSugestaoMassaDep.results);
          }

          for (const response of responses) {
            const pos = compatibleCompanies.map(e => e.Empresa).indexOf(response.Empresa);
            if (pos !== -1) {
              if (compatibleCompanies[pos].Status === false) {
                if (response.Profile !== "") compatibleCompanies[pos].Status = true;

              }
            }
            else {
              let newItem = { Empresa: response.Empresa, Apply: false };
              if (response.Profile !== "") newItem.Status = true;
              else newItem.Status = false;
              compatibleCompanies.push(newItem);
            }
          }

          compatibleCompanies.sort((a, b) => {
            return a.Empresa - b.Empresa;
          });

          const title = `<h5>Abaixo você encontra a lista de empresas e o status que indica a possibilidade de replicar as mesmas alterações de Dependências que acabou de realizar.</h5>`;

          this.getView().getModel("suggestMassDep").setProperty("/", { title: title, changes: responses, compatibleCompanies: [...compatibleCompanies], selectAll: false, hasSelectedItems: false });

          if (!this._suggestChangeMassDep) {
            this._suggestChangeMassDep = Fragment.load({
              id: this.getView().getId(),
              name: "votorantim.corp.clocov2planmanagement.fragments.DependentMassSuggestions",
              controller: this,
            }).then(function (oDialog) {
              this.getView().addDependent(oDialog);

              if (compatibleCompanies.length === 0)
                this.byId("buttonApplySuggestMass").setEnabled(false);

              return oDialog;
            }.bind(this));
          }
          sap.ui.core.BusyIndicator.hide();

          this._suggestChangeMassDep.then(
            function (oDialog) {
              oDialog.open();
            }.bind(this)
          );

        }.bind(this),
      });

    },

    closeSuggestMassDep: function () {
      if (this._suggestChangeMassDep) {
        this._suggestChangeMassDep.then(function (oDialog) {
          oDialog.close();
          oDialog.close();
          oDialog.destroy();
        });
        this._suggestChangeMassDep = undefined;
      }
    },

    slectAllSuggest: function () {

      const selectAll = this.getView().getModel("suggestMassDep").getProperty("/selectAll");
      const suggestItems = this.getView().getModel("suggestMassDep").getProperty("/compatibleCompanies");

      if (selectAll) {

        for (const suggestItem of suggestItems) {
          if (suggestItem.Status)
            suggestItem.Apply = true;
        }
      }
      else {
        for (const suggestItem of suggestItems) {

          if (suggestItem.main) continue;
          suggestItem.Apply = false;
        }
      }

      this.getView().getModel("suggestMassDep").setProperty("/compatibleCompanies", suggestItems);

      this.onSelectSuggestChange();

    },

    applySuggestMassDep: function () {

      this.closeSuggestMassDep();
      const suggestMassDep = this.getView().getModel("suggestMassDep").getProperty("/");
      const oParams = {
        useBatch: true,
        defaultUpdateMethod: "PUT",
        groupId: "changeDepSuggestMass"
      };
      const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/", oParams);
      const requestParams = {};
      requestParams.groupId = oParams.groupId;
      oModel.setDeferredGroups([oParams.groupId]);

      const suggestItems = suggestMassDep.compatibleCompanies.filter(item => item.Apply && !item.main);

      const changes = suggestMassDep.changes.filter(change => suggestItems.map(e => e.Empresa).indexOf(change.Empresa) !== -1 && change.NodeID !== "");

      let totalItems;
      let totalCompleted = 0;

      totalItems = changes.length;

      this.setProgress(0);
      this.displayDialogProgress();

      const updateItems = (fromIndex) => {
        let updatedItems = 0;

        for (let index = fromIndex; index < changes.length; index++) {

          const change = changes[index];

          if (change.Method === "POST") {
            const newDependentBody = this.newTaskBody(change, { NodeID: change.Item_prev });
            oModel.createEntry("/v2_dependentes", { properties: newDependentBody, groupId: requestParams.groupId });
          }

          if (change.Method === "DELETE") {
            const fullPath = `/v2_dependentes(Profile='${change.Profile}',Instance=${change.Instance},NodeID='${change.NodeID}',Item_prev='${change.Item_prev}')`;
            oModel.remove(fullPath, { groupId: requestParams.groupId });
          }

          updatedItems++;
          totalCompleted++;

          if (updatedItems === this.massBatchSize || totalCompleted === totalItems) {
            this.submitChangesSync(oModel, "changeDepSuggestMass").then(() => {
              this.setProgress((totalCompleted / totalItems) * 100);
              if (totalCompleted !== totalItems)
                updateItems(totalCompleted);
              else {
                MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("appDataSaved"));
                this.closeDialogProgress();
              }
            })
            return;
          }
        }
      }

      updateItems(totalCompleted);

    },

    onSelectSuggestChange: function () {
      const suggestMassDep = this.getView().getModel("suggestMassDep").getProperty("/");
      const suggestItems = suggestMassDep.compatibleCompanies.filter(item => item.Apply && !item.main);

      let hasSelectedItems = false;

      if (suggestItems.length > 0) hasSelectedItems = true;

      this.getView().getModel("suggestMassDep").setProperty("/hasSelectedItems", hasSelectedItems);

    },

    toggleFullScreen: function () {
      var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/endColumn/fullScreen");
      this.getModel("appView").setProperty("/actionButtonsInfo/endColumn/fullScreen", !bFullScreen);
      if (!bFullScreen) {
        // store current layout and go full screen
        this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
        this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
      } else {
        // reset to previous layout
        this.getModel("appView").setProperty("/layout", this.getModel("appView").getProperty("/previousLayout"));
      }
    },
  });
});
