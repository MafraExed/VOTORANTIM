sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History", "sap/ui/model/json/JSONModel", "sap/ui/core/Fragment", "sap/m/SearchField", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/model/ValidateException", "sap/ui/model/SimpleType", "sap/m/MessageBox", "sap/m/MessageToast", "sap/m/Token", "../model/formatter", "sap/m/ColumnListItem", "sap/m/Label"], function (Controller, History, JSONModel, Fragment, SearchField, Filter, FilterOperator, ValidateException, SimpleType, MessageBox, MessageToast, Token, formatter, ColumnListItem, Label) {
  "use strict";

  return Controller.extend("votorantim.corp.clocov2planmanagement.controller.BaseController", {
    /**
     * Convenience method for accessing the router in every controller of the application.
     * @public
     * @returns {sap.ui.core.routing.Router} the router for this component
     */
    massBatchSize: 500,

    getRouter: function () {
      return this.getOwnerComponent().getRouter();
    },

    onPressChangeAlertConfigMass: function () {
      let hasItem = false;
      let oView = this.getView();
      let table;
      const type = this.getView().getModel("detailView").getProperty("/viewMode");

      if (type === "tree") {
        table = this.getView().byId("TreeTemplate");
        const indices = table.getSelectedIndices();

        for (const indice of indices) {
          const object = table.getContextByIndex(indice).getObject();
          if (object.register.Item) {
            hasItem = true;
            break;
          }
        }
      } else hasItem = true;

      if (!hasItem) {
        MessageToast.show("Nenhuma tarefa selecionada");
        return;
      }

      this.getView().getModel("changeAlertConfigMass").setProperty("/", { Lembrete: false, AtividadeNaoIniciada: false, AtividadeNaoEncerrada: false, AtividadeDisponivel: false, AtividadeReprocessada: false, AtividadeFinalizada: false, updateLembrete: false, updateNaoInic: false, updateNaoEnc: false, updateDisp: false, updateRepro: false, updateFin: false });

      if (!this._changeAlertConfigMassDialog) {
        this._changeAlertConfigMassDialog = Fragment.load({
          id: oView.getId(),
          name: "votorantim.corp.clocov2planmanagement.fragments.ChangeAlertConfigMass",
          controller: this,
        }).then(
          function (oDialog) {
            oDialog.setModel(oView.getModel());
            oView.addDependent(oDialog);

            const multiInputs = ["idChangeAlertEmailLembrete", "idChangeAlertEmailatividadeNaoInic", "idChangeAlertEmailAtividadeNaoEnc", "idChangeAlertEmailAtividadeDisp", "idChangeAlertEmailAtividadeReoroc", "idChangeAlertEmailAtividadeFin"]
            for (const multiInput of multiInputs) {
              this.getView().byId(multiInput).addValidator(this.multiInputEmailValidator);
            }

            // this.getView().byId("idChangeAlertEmailLembrete").attachBrowserEvent("keydown", this.updateEmailSuggestions, this);
            // this.getView().byId("idChangeAlertEmailatividadeNaoInic").attachBrowserEvent("keydown", this.updateEmailSuggestions, this);
            // this.getView().byId("idChangeAlertEmailAtividadeNaoEnc").attachBrowserEvent("keydown", this.updateEmailSuggestions, this);
            // this.getView().byId("idChangeAlertEmailAtividadeDisp").attachBrowserEvent("keydown", this.updateEmailSuggestions, this);
            // this.getView().byId("idChangeAlertEmailAtividadeReoroc").attachBrowserEvent("keydown", this.updateEmailSuggestions, this);
            // this.getView().byId("idChangeAlertEmailAtividadeFin").attachBrowserEvent("keydown", this.updateEmailSuggestions, this);

            return oDialog;
          }.bind(this)
        );
      }

      this._changeAlertConfigMassDialog.then(
        function (oDialog) {
          oDialog.open();
        }.bind(this)
      );
    },

    onChangeAlertConfigMass: function () {
      MessageBox.warning("Atenção! As Configurações de Alerta serão aplicadas a todas as tarefas selecionadas. Tem certeza que deseja aplicar as alterações?", {
        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
        emphasizedAction: MessageBox.Action.OK,
        onClose: function (sAction) {
          if (sAction !== MessageBox.Action.OK) return;
          else {
            this.getView().setBusy(true);

            let table;
            let totalItems;
            let totalCompleted = 0;

            const type = this.getView().getModel("detailView").getProperty("/viewMode");
            const changeAlertMass = this.getView().getModel("changeAlertConfigMass").getProperty("/");

            if (type === "tree") table = this.getView().byId("TreeTemplate");
            else table = this.getView().byId("tableTemplate");

            const indices = table.getSelectedIndices();

            const oParams = {
              useBatch: true,
              defaultUpdateMethod: "PUT",
              groupId: "updateAlertMass"
            };
            const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/", oParams);
            const requestParams = {};
            requestParams.groupId = oParams.groupId;
            oModel.setDeferredGroups([oParams.groupId]);

            totalItems = indices.length;

            this.setProgress(0);
            this.displayDialogProgress();

            const updateItems = (fromIndex) => {
              let updatedItems = 0;
              for (let index = fromIndex; index < indices.length; index++) {
                const indice = indices[index];
                let isItem = false;
                const object = table.getContextByIndex(indice).getObject();

                if (object.register) {
                  if (object.register.Item === "X") isItem = true;
                } else if (object.Item === "X") isItem = true;

                if (!isItem) {
                  totalItems--;
                  continue;
                }

                const instance = object.hasOwnProperty('Instance') ? object.Instance : object.register.Instance;

                const updateData = {
                  Profile: object.Profile || object.register.Profile,
                  Instance: instance,
                  Item: object.NodeID,
                  Lembrete: changeAlertMass.Lembrete,
                  LembreteEmails: this.getEmailValuesFromTokens("idChangeAlertEmailLembrete"),
                  LembreteTipoNotificacao: changeAlertMass.LembreteTipoNotificacao,
                  AtividadeNaoIniciada: changeAlertMass.AtividadeNaoIniciada,
                  AtividadeNaoInicEmails: this.getEmailValuesFromTokens("idChangeAlertEmailatividadeNaoInic"),
                  AtividadeNaoInicTipoNotificacao: changeAlertMass.AtividadeNaoInicTipoNotificacao,
                  AtividadeNaoEncerrada: changeAlertMass.AtividadeNaoEncerrada,
                  AtividadeNaoEncEmails: this.getEmailValuesFromTokens("idChangeAlertEmailAtividadeNaoEnc"),
                  AtividadeNaoEncTipoNotificacao: changeAlertMass.AtividadeNaoEncTipoNotificacao,
                  AtividadeDisponivel: changeAlertMass.AtividadeDisponivel,
                  AtividadeDispEmails: this.getEmailValuesFromTokens("idChangeAlertEmailAtividadeDisp"),
                  AtividadeDispTipoNotificacao: changeAlertMass.AtividadeDispTipoNotificacao,
                  AtividadeReprocessada: changeAlertMass.AtividadeReprocessada,
                  AtividadeRepTipoNotificacao: changeAlertMass.AtividadeRepTipoNotificacao,
                  AtividadeRepEmails: this.getEmailValuesFromTokens("idChangeAlertEmailAtividadeReoroc"),
                  AtividadeFinalizada: changeAlertMass.AtividadeFinalizada,
                  AtividadeFinTipoNotificacao: changeAlertMass.AtividadeFinTipoNotificacao,
                  AtividadeFinEmails: this.getEmailValuesFromTokens("idChangeAlertEmailAtividadeFin"),
                  updateFin: changeAlertMass.updateFin,
                  updateLembrete: changeAlertMass.updateLembrete,
                  updateNaoInic: changeAlertMass.updateNaoInic,
                  updateNaoEnc: changeAlertMass.updateNaoEnc,
                  updateDisp: changeAlertMass.updateDisp,
                  updateRepro: changeAlertMass.updateRepro,
                };

                oModel.update("/" + `v2_notificacoes(Profile='${object.Profile || object.register.Profile}',Instance=${instance},Item='${object.NodeID}')`, updateData, requestParams);
                updatedItems++;
                totalCompleted++;

                if (updatedItems === this.massBatchSize || totalCompleted === totalItems) {
                  this.submitChangesSync(oModel, "updateAlertMass").then(() => {
                    this.setProgress((totalCompleted / totalItems) * 100);
                    if (totalCompleted !== totalItems)
                      updateItems(totalCompleted);
                    else {
                      const type = this.getView().getModel("detailView").getProperty("/viewMode");
                      if (type === "tree") {
                        const hierarchyChanges = this.getView().getModel("hierarchyChanges").getProperty("/");
                        hierarchyChanges.splice(0, hierarchyChanges.length);
                      }
                      this.getView().setBusy(false);
                      if (this._item)
                        this.getModel().read(`/v2_tarefas(Profile='${this._profile}',Instance=${this._instance},NodeID='${this._item}')/to_notificacao`);
                      table.clearSelection();
                      MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("appDataSaved"));
                      this.closeDialogProgress();
                      this.onCloseChangeAlertConfigDialog();
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
    },

    onCloseChangeAlertConfigDialog: function () {
      // this.getView().byId("idChangeAlertEmailLembrete").detachBrowserEvent("keydown", this.updateEmailSuggestions, this);
      // this.getView().byId("idChangeAlertEmailatividadeNaoInic").detachBrowserEvent("keydown", this.updateEmailSuggestions, this);
      // this.getView().byId("idChangeAlertEmailAtividadeNaoEnc").detachBrowserEvent("keydown", this.updateEmailSuggestions, this);
      // this.getView().byId("idChangeAlertEmailAtividadeDisp").detachBrowserEvent("keydown", this.updateEmailSuggestions, this);
      // this.getView().byId("idChangeAlertEmailAtividadeReoroc").detachBrowserEvent("keydown", this.updateEmailSuggestions, this);
      // this.getView().byId("idChangeAlertEmailAtividadeFin").detachBrowserEvent("keydown", this.updateEmailSuggestions, this);

      this._changeAlertConfigMassDialog.then(function (oDialog) {
        oDialog.close();
        oDialog.destroy();
        this._changeAlertConfigMassDialog = undefined;
      }.bind(this));
    },

    updateEmailSuggestions: function (oEvent) {
      this._updateEmailSuggestion = 4;

      if (this._updatingSuggestion === undefined) this._updatingSuggestion = false;

      if (!this._updatingSuggestion) {
        this._updatingSuggestion = true;
        this.updateSuggestion(oEvent);
      }
    },

    updateSuggestion: function (oEvent) {
      setTimeout(() => {

        if (this._updateEmailSuggestion === undefined) this._updateEmailSuggestion = 4;

        this._updateEmailSuggestion -= 1;

        if (this._updateEmailSuggestion > 0) this.updateSuggestion(oEvent);
        else {
          let controlId;

          if (oEvent.target.id.indexOf("idMultiEmailLembrete") !== -1) controlId = "idMultiEmailLembrete";
          if (oEvent.target.id.indexOf("idMultiEmailatividadeNaoInic") !== -1) controlId = "idMultiEmailatividadeNaoInic";
          if (oEvent.target.id.indexOf("idMultiEmailAtividadeNaoEnc") !== -1) controlId = "idMultiEmailAtividadeNaoEnc";
          if (oEvent.target.id.indexOf("idMultiEmailAtividadeDisp") !== -1) controlId = "idMultiEmailAtividadeDisp";
          if (oEvent.target.id.indexOf("idMultiEmailAtividadeReoroc") !== -1) controlId = "idMultiEmailAtividadeReoroc";
          if (oEvent.target.id.indexOf("idMultiEmailAtividadeFin") !== -1) controlId = "idMultiEmailAtividadeFin";

          if (oEvent.target.id.indexOf("idChangeAlertEmailLembrete") !== -1) controlId = "idChangeAlertEmailLembrete";
          if (oEvent.target.id.indexOf("idChangeAlertEmailatividadeNaoInic") !== -1) controlId = "idChangeAlertEmailatividadeNaoInic";
          if (oEvent.target.id.indexOf("idChangeAlertEmailAtividadeNaoEnc") !== -1) controlId = "idChangeAlertEmailAtividadeNaoEnc";
          if (oEvent.target.id.indexOf("idChangeAlertEmailAtividadeDisp") !== -1) controlId = "idChangeAlertEmailAtividadeDisp";
          if (oEvent.target.id.indexOf("idChangeAlertEmailAtividadeReoroc") !== -1) controlId = "idChangeAlertEmailAtividadeReoroc";
          if (oEvent.target.id.indexOf("idChangeAlertEmailAtividadeFin") !== -1) controlId = "idChangeAlertEmailAtividadeFin";

          const multiInput = this.byId(controlId);

          multiInput.setBusy(true);

          const filter = new Filter({
            // required from "sap/ui/model/Filter"
            path: "Name",
            operator: FilterOperator.EQ, // required from "sap/ui/model/FilterOperator"
            value1: multiInput.getValue(),
          });

          const oParams = {
            useBatch: false,
          };
          const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/", oParams);

          oModel.read("/v2_help_users_office", {
            filters: [filter],
            top: 5,
            success: function (oData) {
              multiInput.setBusy(false);

              multiInput.removeAllSuggestionRows();

              for (const result of oData.results) {
                const newRow = new sap.m.ColumnListItem({
                  cells: [
                    new sap.m.Text({
                      text: result.DisplayName,
                    }),
                    new sap.m.Text({
                      text: result.UserPrincipalName,
                    }),
                  ],
                });

                multiInput.addSuggestionRow(newRow);
              }

              this._updatingSuggestion = false;
            }.bind(this),
            error: function (error) {
              multiInput.setBusy(false);
              MessageToast.show("Erro ao buscar emails");
              this._updatingSuggestion = false;
            }.bind(this)
          });
        }
      }, 250);
    },

    emailSugestionSelected: function (oEvent) {
      const selectedCells = oEvent.getParameter('selectedRow').getCells();
      const newToken = new Token({ key: selectedCells[1].getText(), text: selectedCells[1].getText() });
      oEvent.getSource().addToken(newToken);
    },

    getEmailValuesFromTokens: function (idMultiInput) {
      let value;
      const multInput = this.getView().byId(idMultiInput);
      const tokens = multInput.getTokens();

      for (const token of tokens) {
        if (value) value += ";" + token.getText();
        else value = token.getText();
      }

      return value;
    },

    onPressChangeTaskMass: function () {
      let hasItem = false;
      let oView = this.getView();
      let table;
      const type = this.getView().getModel("detailView").getProperty("/viewMode");

      if (type === "tree") {
        table = this.getView().byId("TreeTemplate");
        const indices = table.getSelectedIndices();

        for (const indice of indices) {
          const object = table.getContextByIndex(indice).getObject();
          if (object.register.Item) {
            hasItem = true;
            break;
          }
        }
      } else hasItem = true;

      if (!hasItem) {
        MessageToast.show("Nenhuma tarefa selecionada");
        return;
      }

      this.getView().getModel("changeTaskMass").setProperty("/", { InicioPlanAposDataBase: "NULL" });

      if (!this._changeTaskMassDialog) {
        this._changeTaskMassDialog = Fragment.load({
          id: oView.getId(),
          name: "votorantim.corp.clocov2planmanagement.fragments.ChangeTaskMass",
          controller: this,
        }).then(function (oDialog) {
          oDialog.setModel(oView.getModel());
          oView.addDependent(oDialog);
          return oDialog;
        });
      }

      this._changeTaskMassDialog.then(
        function (oDialog) {
          oDialog.open();
        }.bind(this)
      );
    },

    onChangeTaskMass: function () {
      const fields = [];

      if (this.byId("TypeTaskMass").getSelectedKey() === "0") {
        fields.push("jobTaskMass");
        fields.push("varTaskMass");
      }

      if (this.byId("TypeTaskMass").getSelectedKey() === "2") {
        fields.push("tcodeTaskMass");
      }

      if (this.validateInputFields(fields)) return;

      this.validateInputSAP(["idChangeTaskCompany#companies", "idBtnChangeUserExec#user", "idBtnChangeUserResp#user", "jobTaskMass#program", "tcodeTaskMass#tcode", "varTaskMass#variant"], null, "jobTaskMass").then((error) => {
        if (error) return;

        MessageBox.warning("Atenção! Todas as tarefas selecionadas serão modificadas com as novas entradas inseridas. Tem certeza que deseja aplicar as alterações?", {
          actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
          emphasizedAction: MessageBox.Action.OK,
          onClose: function (sAction) {
            if (sAction !== MessageBox.Action.OK) {
            } else {
              this.getView().setBusy(true);
              let table;
              let controlName;
              let modelName;
              let totalItems;
              let totalCompleted = 0;
              const requestParams = { groupId: "updateTaskMass" };
              const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/", requestParams);

              oModel.setDeferredGroups([requestParams.groupId]);

              const type = this.getView().getModel("detailView").getProperty("/viewMode");
              const taskChangeMass = this.getView().getModel("changeTaskMass").getProperty("/");

              if (type === "tree") {
                controlName = "TreeTemplate";
                modelName = "tree"
              }
              else {
                controlName = "tableTemplate";
                modelName = "table"
              }

              table = this.getView().byId(controlName);
              const indices = table.getSelectedIndices();
              totalItems = indices.length;

              this.setProgress(0);
              this.displayDialogProgress();

              const updateItems = (fromIndex) => {
                let updatedItems = 0;
                for (let index = fromIndex; index < indices.length; index++) {
                  const indice = indices[index];
                  const object = this.getModel(modelName).getProperty(table.getContextByIndex(indice).getPath());
                  if (type === "tree") {
                    if (!object.register.Item) {
                      totalItems--;
                      continue;
                    }
                    this.updateChangeMass(object.register, taskChangeMass, oModel);
                  }
                  else
                    this.updateChangeMass(object, taskChangeMass, oModel);
                  this.getModel(modelName).setProperty(table.getContextByIndex(indice).getPath(), object);
                  updatedItems++;
                  totalCompleted++;

                  if (updatedItems === this.massBatchSize || totalCompleted === totalItems) {
                    this.submitChangesSync(oModel, "updateTaskMass").then(() => {
                      this.setProgress((totalCompleted / totalItems) * 100);
                      if (totalCompleted !== totalItems)
                        updateItems(totalCompleted);
                      else {
                        const type = this.getView().getModel("detailView").getProperty("/viewMode");
                        if (type === "tree") {
                          const hierarchyChanges = this.getView().getModel("hierarchyChanges").getProperty("/");
                          hierarchyChanges.splice(0, hierarchyChanges.length);
                        }
                        this.getView().getModel("changeTaskMass").setProperty("/", {});
                        this.getModel().invalidate();
                        this.onCloseChangeTasMasskDialog();
                        this.getView().setBusy(false);
                        this.closeDialogProgress();
                        if (this._item)
                          this.getModel().read(`/v2_tarefas(Profile='${this._profile}',Instance=${this._instance},NodeID='${this._item}')`);
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

    submitChangesSync: async function (oModel, groupId) {
      const requestParams = { groupId: groupId };
      oModel.setDeferredGroups([groupId]);

      await new Promise((resolve, reject) => {
        oModel.submitChanges({
          groupId: requestParams.groupId,
          success: function (oData) {
            resolve(oData);
          }.bind(this),
        });
      })
    },

    setProgress: function (percent) {
      this.getView().getModel("appView").setProperty("/progress", percent);
    },

    displayDialogProgress: function () {

      if (!this.oDialogProgress) {
        this.oDialogProgress = new sap.m.Dialog({
          title: "Atualização em andamento",
          content: new sap.m.ProgressIndicator({
            percentValue: "{appView>/progress}",
            displayValue: { path: 'appView>/progress', formatter: formatter.formatProgress }
          })
        }).addStyleClass("sapUiContentPadding")
      } this
      this.getView().addDependent(this.oDialogProgress);
      this.oDialogProgress.open();
    },

    closeDialogProgress: function () {
      this.oDialogProgress.close();
    },

    onPressDeleteSelection: function () {
      let table;
      const type = this.getView().getModel("detailView").getProperty("/viewMode");

      if (type === "tree") table = this.getView().byId("TreeTemplate");
      else table = this.getView().byId("tableTemplate");

      const indices = table.getSelectedIndices();
      const nodesToDelete = [];

      for (const indice of indices) {
        const object = table.getContextByIndex(indice).getObject();
        nodesToDelete.push(object);
      }

      if (type === "tree") {
        for (const node of nodesToDelete) {
          this.removeFromHierarchyChanges(node);
          this.addHierarchyChange(node.register, "delete");
        }
        return;
      }

      MessageBox.warning("Atenção! Todas as tarefas selecionadas serão excluídas. Deseja continuar?", {
        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
        emphasizedAction: MessageBox.Action.OK,
        onClose: function (sAction) {
          if (sAction === MessageBox.Action.OK) {
            this.getView().setBusy(true);
            const oParams = {
              useBatch: true,
            };
            const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/", oParams);
            const sGroupId = new Date().getTime();
            const requestParams = {};
            requestParams.groupId = sGroupId;
            requestParams.changeSetId = "changeset";
            oModel.setDeferredGroups([sGroupId]);

            for (const node of nodesToDelete) {
              oModel.remove("/" + `v2_hierarquias(Profile='${node.Profile}',Instance=${node.Instance},NodeID='${node.NodeID}')`, requestParams);
            }

            oModel.submitChanges({
              success: function (oData, sResponse) {
                this.getModel().refresh(true);
                this.getView().byId("tableTemplate").clearSelection();
                MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("appDataSaved"));
              }.bind(this),
              error: function (oError) { }.bind(this),
            });
          }
        }.bind(this),
      });
    },

    clearValueState(Ids) {
      for (const id of Ids) {
        const oInput = this.byId(id);
        if (!oInput) continue;
        const sValueState = "None";
        oInput.setValueState(sValueState);
      }
    },

    validateInputFields(inputIds, global) {
      let view;
      if (global) view = global;
      else view = this;
      let bValidationError = false;
      for (const id of inputIds) {
        const oInput = view.byId(id);

        let sValueState = "None";
        const oBinding = oInput.getBinding("value");
        const oBindingList = oInput.getBinding("selectedKey");

        try {
          if (oBinding)
            oBinding.getType().validateValue(oInput.getValue());
          if (oBindingList)
            oBindingList.getType().validateValue(oInput.getSelectedKey());
        } catch (oException) {
          sValueState = "Error";
          bValidationError = true;
          oInput.setValueState(sValueState);
          MessageBox.error("Preencher todos os campos obrigatórios")
          return bValidationError;
        }

        oInput.setValueState(sValueState);
      }
      return bValidationError;
    },

    updateChangeMass: function (object, taskChangeMass, oModel) {
      if (taskChangeMass.Description) object.Description = taskChangeMass.Description;
      if (taskChangeMass.User_respons) object.User_respons = taskChangeMass.User_respons;
      if (taskChangeMass.User_respons_exec) object.User_respons_exec = taskChangeMass.User_respons_exec;
      if (taskChangeMass.CaminhoCritico) object.CaminhoCritico = taskChangeMass.CaminhoCritico;
      if (taskChangeMass.Kind) object.Kind = taskChangeMass.Kind;
      if (taskChangeMass.InicioPlanAposDataBase !== "NULL") object.InicioPlanAposDataBase = taskChangeMass.InicioPlanAposDataBase;
      if (taskChangeMass.Transacao) object.Transacao = taskChangeMass.Transacao;
      if (taskChangeMass.Programa) object.Programa = taskChangeMass.Programa;
      if (taskChangeMass.Variante) object.Variante = taskChangeMass.Variante;
      if (taskChangeMass.InicioPlanejadoDias) object.InicioPlanejadoDias = taskChangeMass.InicioPlanejadoDias;
      if (taskChangeMass.InicioPlanejadoHoras) object.InicioPlanejadoHoras = taskChangeMass.InicioPlanejadoHoras;
      if (taskChangeMass.DuracaoPlanejadoHoras) object.DuracaoPlanejadoHoras = taskChangeMass.DuracaoPlanejadoHoras;
      if (taskChangeMass.DuracaoPlanejadoDias) object.DuracaoPlanejadoDias = taskChangeMass.DuracaoPlanejadoDias;
      if (taskChangeMass.Empresa) object.Empresa = taskChangeMass.Empresa;
      if (taskChangeMass.updateCoe) {
        object.updateCoe = taskChangeMass.updateCoe;
        if (object.updateCoe === "NO") object.Coe = false; else object.Coe = true;
      }
      if (taskChangeMass.Departamento) object.Departamento = taskChangeMass.Departamento;

      const updateTask = this.getBodyHierarchy(object);

      oModel.update(`/v2_hierarquias(Profile='${updateTask.Profile}',Instance=${updateTask.Instance},NodeID='${updateTask.NodeID}')`, updateTask, { groupId: "updateTaskMass" });
    },

    onCloseChangeTasMasskDialog: function () {
      this.getView().getModel("newTask").setProperty("/", this.newEmptyTask());
      this._changeTaskMassDialog.then(function (oDialog) {
        oDialog.close();
      });
    },

    getBodyHierarchy(data) {
      return {
        Profile: data.Profile,
        Instance: data.Instance,
        NodeID: data.NodeID,
        HierarchyLevel: data.HierarchyLevel,
        Description: data.Description,
        ParentNodeID: data.ParentNodeID,
        Kind: data.Kind,
        Item: data.Item,
        User_respons: data.User_respons,
        Calend: data.Calend,
        Type: data.Type,
        BUKRS: data.BUKRS,
        User_respons_exec: data.User_respons_exec,
        Programa: data.Programa,
        Variante: data.Variante,
        CaminhoCritico: data.CaminhoCritico,
        EncerramentoMes: data.EncerramentoMes,
        EncerramentoTri: data.EncerramentoTri,
        EncerramentoAno: data.EncerramentoAno,
        EncerramentoEspec: data.EncerramentoEspec,
        EncerramentoUsuario: data.EncerramentoUsuario,
        InicioPlanejadoDias: data.InicioPlanejadoDias,
        InicioPlanejadoHoras: data.InicioPlanejadoHoras,
        InicioPlanAposDataBase: data.InicioPlanAposDataBase,
        DuracaoPlanejadoDias: data.DuracaoPlanejadoDias,
        DuracaoPlanejadoHoras: data.DuracaoPlanejadoHoras,
        Transacao: data.Transacao,
        Empresa: data.Empresa,
        Coe: data.Coe,
        updateCoe: data.updateCoe,
        Departamento: data.Departamento,
        CopyFrom: data.CopyFrom,
      };
    },

    onPressCreateTaskPlan: function () {
      let oView = this.getView();

      if (!this._createTaskPlanDialog) {
        this._createTaskPlanDialog = Fragment.load({
          id: oView.getId(),
          name: "votorantim.corp.clocov2planmanagement.fragments.CreateTaskPlan",
          controller: this,
        }).then(function (oDialog) {
          oDialog.setModel(oView.getModel());
          oView.addDependent(oDialog);
          return oDialog;
        });
      }

      this._createTaskPlanDialog.then(
        function (oDialog) {
          oDialog.open();
        }.bind(this)
      );
    },

    onCloseCreateTaskPlanDialog: function () {
      this._createTaskPlanDialog.then(function (oDialog) {
        oDialog.close();
      });
    },

    CreateTaskPlan: function () {

      const fields = ["idCreateTaskDesc", "idCreateTaskDataBase", "idCreateTaskExerc", "idCreateTaskPeriodo", "idCreateTaskTpEnc"];
      if (this.validateInputFields(fields)) return;

      this.getView().setBusy(true);
      this.onCloseCreateTaskPlanDialog();

      const newTaskPlanData = this.getView().getModel("newTaskPlan").getProperty("/");
      newTaskPlanData.Profile = this._profile;
      newTaskPlanData.Instance = parseInt(this._instance);
      newTaskPlanData.Periodo = parseInt(newTaskPlanData.Periodo);

      MessageBox.warning("Deseja planejar os jobs para execução automática?", {
        actions: ["Sim", "Não"],
        emphasizedAction: "Sim",
        onClose: function (sAction) {
          if (sAction === "Sim")
            newTaskPlanData.schedule_tasks = true;
          else
            newTaskPlanData.schedule_tasks = false;

          const sGroupId = new Date().getTime();
          const requestParams = {};
          requestParams.groupId = sGroupId;

          const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/", requestParams);
          oModel.setUseBatch(true);
          oModel.setDeferredGroups([sGroupId]);
          oModel.create("/v2_planos", newTaskPlanData, requestParams);

          oModel.submitChanges({
            success: function (oData, sResponse) {
              this.getView().setBusy(false);
              if (oData.__batchResponses[0].response) {
                const resp = JSON.parse(oData.__batchResponses[0].response.body);
                this.displayErrorMessage(resp.error.message.value);
              } else {
                this.getView().getModel("newTaskPlan").setProperty("/", {});
                this.getView().getModel().refresh(true);
                MessageToast.show("Plano de Tarefas criado com sucesso");
              }
            }.bind(this),
            error: function (oError) {
              this.displayErrorMessage("Erro ao Liberar Plano de Tarefas");
              this.getView().setBusy(false);
              // this.getView().setBusy(false);
            }.bind(this),
          });
        }.bind(this)
      });
    },

    showTcodeSearchHelp: function (oEvent) {
      const source = oEvent.getSource();

      const dataPath = "/v2_help_transacao";
      const title = "Transação";
      const fieldsSearch = ["Transacao", "Aplicacao"];
      const columnsModel = [
        {
          label: "Transacao",
          template: "Transacao",
          width: "40%",
        },
        {
          label: "Aplicacao",
          template: "Aplicacao",
          width: "60%",
        },
      ];
      this.getView().getModel("columnsSearchHelp").setProperty("/cols", columnsModel);
      if (source.getId().indexOf("tcodeNewTask") !== -1) {
        this.onValueHelpRequested(dataPath, "columnsSearchHelp", title, fieldsSearch, this.onSHPressTcodeCreateTask.bind(this), false);
      }
      if (source.getId().indexOf("tcodeTaskDetail") !== -1) {
        this.onValueHelpRequested(dataPath, "columnsSearchHelp", title, fieldsSearch, this.onSHPressTcodeTaskDetail.bind(this), false);
      }
      if (source.getId().indexOf("tcodeTaskMass") !== -1) {
        this.onValueHelpRequested(dataPath, "columnsSearchHelp", title, fieldsSearch, this.onSHPressTcodeTaskMass.bind(this), false);
      }
      return;
    },

    onSHPressTcodeTaskMass: function (oEvent) {
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      this.getView().getModel("changeTaskMass").setProperty("/Transacao", object.Transacao);
      this.getView().getModel("changeTaskMass").refresh();
      this._oValueHelpDialog.close();
    },

    onSHPressTcodeCreateTask: function (oEvent) {
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      this.getView().getModel("newTask").setProperty("/Transacao", object.Transacao);
      this.getView().getModel("newTask").refresh();
      this._oValueHelpDialog.close();
    },

    showJobSearchHelp: function (oEvent) {
      const source = oEvent.getSource();

      const dataPath = "/v2_help_programas";
      const title = "Job";
      const fieldsSearch = ["Programa"];
      const columnsModel = [
        {
          label: "Programa",
          template: "Programa",
          width: "50%",
        },
        {
          label: "Descrição",
          template: "DescProg",
          width: "50%",
        },
      ];
      this.getView().getModel("columnsSearchHelp").setProperty("/cols", columnsModel);

      if (source.getId().indexOf("jobNewTask") !== -1) {
        this.onValueHelpRequested(dataPath, "columnsSearchHelp", title, fieldsSearch, this.onSHPressJobCreateTask.bind(this), false);
      }

      if (source.getId().indexOf("jobTaskDetail") !== -1) {
        this.onValueHelpRequested(dataPath, "columnsSearchHelp", title, fieldsSearch, this.onSHPressJobTaskDetail.bind(this), false);
      }

      if (source.getId().indexOf("jobTaskMass") !== -1) {
        this.onValueHelpRequested(dataPath, "columnsSearchHelp", title, fieldsSearch, this.onSHPressJobTaskMass.bind(this), false);
      }

      return;
    },

    onSHPressJobTaskMass: function (oEvent) {
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      this.getView().getModel("changeTaskMass").setProperty("/Programa", object.Programa);
      this.getView().getModel("changeTaskMass").refresh();
      this._oValueHelpDialog.close();
    },

    onSHPressJobCreateTask: function (oEvent) {
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      this.getView().getModel("newTask").setProperty("/Programa", object.Programa);
      this.getView().getModel("newTask").refresh();
      this._oValueHelpDialog.close();
    },

    showVarSearchHelp: function (oEvent) {
      const source = oEvent.getSource();

      const title = "Variante";
      const fieldsSearch = ["Nome_variante"];
      const columnsModel = [
        {
          label: "Variante",
          template: "Nome_variante",
          width: "50%",
        },
        {
          label: "Descrição",
          template: "Descricao_variante",
          width: "50%",
        },
      ];
      this.getView().getModel("columnsSearchHelp").setProperty("/cols", columnsModel);
      if (source.getId().indexOf("varNewTask") !== -1) {
        const program = this.getView().getModel("newTask").getProperty("/Programa");
        const dataPath = `/v2_help_programas(Programa='${program}')/to_variantes`;
        this.onValueHelpRequested(dataPath, "columnsSearchHelp", title, fieldsSearch, this.onSHPressVarCreateTask.bind(this), false);
      }
      if (source.getId().indexOf("varTaskMass") !== -1) {
        const program = this.getView().getModel("changeTaskMass").getProperty("/Programa");
        const dataPath = `/v2_help_programas(Programa='${program}')/to_variantes`;
        this.onValueHelpRequested(dataPath, "columnsSearchHelp", title, fieldsSearch, this.onSHPressVarTaskMass.bind(this), false);
      }
    },

    onSHPressVarCreateTask: function (oEvent) {
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      this.getView().getModel("newTask").setProperty("/Variante", object.Nome_variante);
      this.getView().getModel("newTask").refresh();
      this._oValueHelpDialog.close();
    },

    onSHPressVarTaskMass: function (oEvent) {
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      this.getView().getModel("changeTaskMass").setProperty("/Variante", object.Nome_variante);
      this.getView().getModel("changeTaskMass").refresh();
      this._oValueHelpDialog.close();
    },

    showUserSearchHelp: function (oEvent) {
      const source = oEvent.getSource();

      if (source.getId().indexOf("btnRespNewFolder") !== -1 || source.getId().indexOf("btnRespChangeFolder") !== -1) {
        const dataPath = "/v2_help_user";
        const title = this.getView().getModel("i18n").getResourceBundle().getText("taskSelectUser");
        const fieldsSearch = ["email", "user", "name"];
        this.onValueHelpRequested(dataPath, "columnsSearchUsers", title, fieldsSearch, this.onSHPressUserCreateFolder.bind(this), false);
        return;
      }

      if (source.getId().indexOf("idBtnCreateUserResp") !== -1) {
        const dataPath = "/v2_help_user";
        const title = this.getView().getModel("i18n").getResourceBundle().getText("taskSelectUser");
        const fieldsSearch = ["email", "user", "name"];
        this.onValueHelpRequested(dataPath, "columnsSearchUsers", title, fieldsSearch, this.onSHPressUserRespCreateTask.bind(this), false);
        return;
      }

      if (source.getId().indexOf("idBtnCreateUserExec") !== -1) {
        const dataPath = "/v2_help_user";
        const title = this.getView().getModel("i18n").getResourceBundle().getText("taskSelectUser");
        const fieldsSearch = ["email", "user", "name"];
        this.onValueHelpRequested(dataPath, "columnsSearchUsers", title, fieldsSearch, this.onSHPressUserExecCreateTask.bind(this), false);
        return;
      }

      if (source.getId().indexOf("idBtnChangeUserResp") !== -1) {
        const dataPath = "/v2_help_user";
        const title = this.getView().getModel("i18n").getResourceBundle().getText("taskSelectUser");
        const fieldsSearch = ["email", "user", "name"];
        this.onValueHelpRequested(dataPath, "columnsSearchUsers", title, fieldsSearch, this.onSHPressUserRespChangeTask.bind(this), false);
        return;
      }

      if (source.getId().indexOf("idBtnChangeUserExec") !== -1) {
        const dataPath = "/v2_help_user";
        const title = this.getView().getModel("i18n").getResourceBundle().getText("taskSelectUser");
        const fieldsSearch = ["email", "user", "name"];
        this.onValueHelpRequested(dataPath, "columnsSearchUsers", title, fieldsSearch, this.onSHPressUserExecChangeTask.bind(this), false);
        return;
      }

      if (source.getId().indexOf("idCreatePlanResp") !== -1 || source.getId().indexOf("btnRespChangeFolder") !== -1) {
        const dataPath = "/v2_help_user";
        const title = this.getView().getModel("i18n").getResourceBundle().getText("taskSelectUser");
        const fieldsSearch = ["email", "user", "name"];
        this.onValueHelpRequested(dataPath, "columnsSearchUsers", title, fieldsSearch, this.onSHPressUserCreatePlanResp.bind(this), false);
        return;
      }

      if (source.getId().indexOf("idApproverUserId") !== -1) {
        const dataPath = "/v2_help_user";
        const title = this.getView().getModel("i18n").getResourceBundle().getText("taskSelectUser");
        const fieldsSearch = ["email", "user", "name"];
        this.onValueHelpRequested(dataPath, "columnsSearchUsers", title, fieldsSearch, this.onSHPressUserAddChangeApprover.bind(this), false);
        return;
      }
    },

    onSHPressUserAddChangeApprover: function (oEvent) {
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      const addChangeApprover = this.getView().getModel("addChangeApprover").getProperty("/");
      addChangeApprover.UserId = object.user;
      addChangeApprover.ApproverName = object.name;
      this.getView().getModel("addChangeApprover").setProperty("/", addChangeApprover);
      this._oValueHelpDialog.close();
    },

    onSHPressUserCreatePlanResp: function (oEvent) {
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      this.getView().getModel("newTaskPlan").setProperty("/RespPE", object.user);
      this.getView().getModel("newTaskPlan").refresh();
      this._oValueHelpDialog.close();
    },

    onSHPressUserRespCreateTask: function (oEvent) {
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      this.getView().getModel("newTask").setProperty("/User_respons", object.user);
      this.getView().getModel("newTask").refresh();
      this._oValueHelpDialog.close();
    },

    onSHPressUserRespChangeTask: function (oEvent) {
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      this.getView().getModel("changeTaskMass").setProperty("/User_respons", object.user);
      this.getView().getModel("changeTaskMass").refresh();
      this._oValueHelpDialog.close();
    },

    onSHPressUserExecChangeTask: function (oEvent) {
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      this.getView().getModel("changeTaskMass").setProperty("/User_respons_exec", object.user);
      this.getView().getModel("changeTaskMass").refresh();
      this._oValueHelpDialog.close();
    },

    onSHPressUserExecCreateTask: function (oEvent) {
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      this.getView().getModel("newTask").setProperty("/User_respons_exec", object.user);
      this.getView().getModel("newTask").refresh();
      this._oValueHelpDialog.close();
    },

    onSHPressUserCreateFolder: function (oEvent) {
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      this.getView().getModel("newFolder").setProperty("/User_respons", object.user);
      this.getView().getModel("newFolder").refresh();
      this._oValueHelpDialog.close();
    },

    onPressRejectChanges: function () {
      this.getView().setBusy(true);
      this.getView().getModel().resetChanges(null);
      this.getView().getModel().mDeferredRequests = {};
      if (this.getView().getViewName() === "votorantim.corp.clocov2planmanagement.view.Detail") {
        this.byId("detailPage").setShowFooter(false);
        this.getView().getModel().refresh(true);
        // this.getData(this._profile, this._instance);
      }
      if (this.getView().getViewName() === "votorantim.corp.clocov2planmanagement.view.Task") {
        this.getView().getModel().refresh(true);
        this.getView().getModel("taskView").setProperty("/hasChanges", false);
        this.byId("ObjectPageTask").setShowFooter(false);
      }
      if (this.getView().getViewName() === "votorantim.corp.clocov2planmanagement.view.Folder") {
        this.getView().getModel().refresh(true);
        this.getView().getModel("folderView").setProperty("/hasChanges", false);
        this.byId("ObjectPageFolder").setShowFooter(false);
      }
    },

    getModel: function (sName) {
      return this.getView().getModel(sName);
    },

    setModel: function (oModel, sName) {
      return this.getView().setModel(oModel, sName);
    },

    getResourceBundle: function () {
      return this.getOwnerComponent().getModel("i18n").getResourceBundle();
    },

    onNavBack: function () {
      var sPreviousHash = History.getInstance().getPreviousHash();

      if (sPreviousHash !== undefined) {
        // eslint-disable-next-line sap-no-history-manipulation
        history.go(-1);
      } else {
        this.getRouter().navTo("list", {}, true);
      }
    },

    validateInputSAP: async function (inputIds, global, idValue2) {
      let view;
      let error = false;
      let errorMessage;
      let responseBtach;
      let dataSent = false;
      const requestParams = {};

      if (global) view = global;
      else view = this;

      requestParams.groupId = "createFolder";
      const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/", requestParams);
      oModel.setDeferredGroups(["createFolder"]);
      const validEntry = [];

      for (const id of inputIds) {
        const ids = id.split("#");
        const oInput = view.byId(ids[0]);
        const setName = ids[1];

        if (oInput.getValue().trim() === "") continue;

        validEntry.push(id);

        if (setName === "companies") {
          dataSent = true;
          oModel.read(`/v2_help_companies(BUKRS='${oInput.getValue()}')`, requestParams);
        }
        if (setName === "user") {
          dataSent = true;
          oModel.read(`/v2_help_user(user='${oInput.getValue()}')`, requestParams);
        }
        if (setName === "calendar") {
          dataSent = true;
          oModel.read(`/v2_help_calendariosfabrica(IDCalendFabrica='${oInput.getValue()}')`, requestParams);
        }
        if (setName === "program") {
          dataSent = true;
          oModel.read(`/v2_help_programas('${encodeURIComponent(oInput.getValue())}')`, requestParams);
        }
        if (setName === "tcode") {
          dataSent = true;
          oModel.read(`/v2_help_transacao('${encodeURIComponent(oInput.getValue())}')`, requestParams);
        }
        if (setName === "variant") {
          dataSent = true;
          const programInput = view.byId(idValue2);
          oModel.read(`/v2_help_variantes_prog(Programa='${encodeURIComponent(programInput.getValue())}',Nome_variante='${encodeURIComponent(oInput.getValue())}')`, requestParams);
        }
      }
      if (!dataSent) return false;
      await new Promise((resolve, reject) => {
        oModel.submitChanges({
          groupId: requestParams.groupId,
          success: function (oData) {
            responseBtach = oData.__batchResponses;
            resolve(oData);
          }.bind(this),
        });
      });

      for (const [index, respBatch] of responseBtach.entries()) {
        if (respBatch.response) {
          error = true;
          const json = JSON.parse(respBatch.response.body);
          MessageBox.error(json.error.message.value);
          break;
        }
      }
      return error;
    },

    createModel: function (json, modelName) {
      const oViewModel = new JSONModel(json);
      this.getView().setModel(oViewModel, modelName);
    },

    getItemsOnly: function (data) {
      if (data.length > 0)
        return data.filter((item) => {
          return item.Item !== "";
        });
    },

    displayErrorMessage: function (msg) {
      MessageBox.error(msg);
    },

    onValueHelpRequested: function (dataPath, columns, title, fieldsSearch, functionOk, multiSelect) {
      // var aCols = this.oColModel.getData().cols;
      this._oBasicSearchField = new SearchField();
      this._fieldsSearch = fieldsSearch;

      Fragment.load({
        name: "votorantim.corp.clocov2planmanagement.fragments.SearchHelp",
        controller: this,
      }).then(
        function (oValueHelpDialog) {
          this._oValueHelpDialog = oValueHelpDialog;
          this.getView().addDependent(this._oValueHelpDialog);

          var oFilterBar = this._oValueHelpDialog.getFilterBar();
          oFilterBar.setFilterBarExpanded(false);
          oFilterBar.setBasicSearch(this._oBasicSearchField);

          this._oBasicSearchField.onsapenter = function (e) {
            var oFilterBar = this._oValueHelpDialog.getFilterBar();
            oFilterBar.search();
          }.bind(this);

          this._oValueHelpDialog.setTitle(title);
          this._oValueHelpDialog.setSupportMultiselect(multiSelect);

          this._oValueHelpDialog.attachOk(functionOk);

          this._oValueHelpDialog.getTableAsync().then(
            function (oTable) {
              oTable.setModel(this.getModel());
              oTable.setModel(this.getModel(columns), "columns");

              if (oTable.bindRows) {
                oTable.bindAggregation("rows", dataPath);
              }

              if (oTable.bindItems) {
                oTable.bindAggregation("items", dataPath, function () {
                  return new ColumnListItem({
                    cells: this.getModel("columnsSearchUsers").getProperty("/").cols.map(function (column) {
                      return new Label({ text: "{" + column.template + "}" });
                    }),
                  });
                }.bind(this));
              }
              this._oValueHelpDialog.update();
            }.bind(this)
          );

          this._oValueHelpDialog.open();
        }.bind(this)
      );
    },

    onFilterBarSearch: function (oEvent) {
      var sSearchQuery = this._oBasicSearchField.getValue(),
        aSelectionSet = oEvent.getParameter("selectionSet");
      var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
        if (oControl.getValue()) {
          aResult.push(
            new Filter({
              path: oControl.getName(),
              operator: FilterOperator.Contains,
              value1: oControl.getValue(),
            })
          );
        }

        return aResult;
      }, []);

      for (const fieldSearch of this._fieldsSearch) {
        aFilters.push(
          new Filter({
            filters: [new Filter({ path: fieldSearch, operator: FilterOperator.Contains, value1: sSearchQuery })],
            and: false,
          })
        );
      }

      this._filterTable(
        new Filter({
          filters: aFilters,
          and: true,
        })
      );
    },

    _filterTable: function (oFilter) {
      var oValueHelpDialog = this._oValueHelpDialog;

      oValueHelpDialog.getTableAsync().then(function (oTable) {
        if (oTable.bindRows) {
          oTable.getBinding("rows").filter(oFilter);
        }

        if (oTable.bindItems) {
          oTable.getBinding("items").filter(oFilter);
        }

        oValueHelpDialog.update();
      });
    },

    onValueHelpCancelPress: function () {
      this._oValueHelpDialog.close();
    },

    onValueHelpAfterClose: function () {
      this._oValueHelpDialog.destroy();
    },

    getRootView(viewName) {
      let stop = false;
      let parent = this.oParentBlock;
      while (!stop) {
        if (parent.getMetadata().getElementName() === "sap.ui.core.mvc.XMLView") {
          if (parent.getViewName() === viewName) {
            return parent;
          }
        }
        parent = parent.oParent;
      }
    },

    getTypeOfChange: function (type) {
      if (type === "new") return "I";
      if (type === "update") return "U";
      if (type === "delete") return "D";
    },

    getRandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },

    markDeleteNodeHierarchy: function (nodeToDelete, nodes) {
      if (!nodeToDelete.Item) nodeToDelete.Item = "";

      const searchNodeToDelete = (nodeToDelete, nodes) => {
        for (const node of nodes) {
          if (node.NodeID === nodeToDelete.NodeID) {
            node.highlight = nodeToDelete.highlight;
            return true;
          }
          if (node.nodes.length > 0) {
            if (searchNodeToDelete(nodeToDelete, node.nodes)) return true;
          }
        }
      };
      return searchNodeToDelete(nodeToDelete, nodes);
    },

    getNode: function (nodeId, nodes) {
      if (!nodeId) return;
      const searchNode = (nodeId, nodes) => {
        let nodeFound;

        for (const node of nodes) {
          if (nodeFound) return nodeFound;
          if (node.NodeID === nodeId) {
            nodeFound = node;
            return nodeFound;
          }
          if (node.nodes.length > 0) {
            nodeFound = searchNode(nodeId, node.nodes);
            if (nodeFound) return nodeFound;
          }
        }
        return nodeFound;
      };
      return searchNode(nodeId, nodes)
    },

    removeNodeHierarchy: function (nodeToDelete, nodes) {
      if (!nodeToDelete.Item) nodeToDelete.Item = "";

      const searchNodeToDelete = (nodeToDelete, nodes) => {
        let result = { removed: false, indexToRemove: null };

        for (const [index, node] of nodes.entries()) {
          if (result.removed) return result;
          if (node.NodeID === nodeToDelete.NodeID) {
            node.highlight = nodeToDelete.highlight;
            result.indexToRemove = index;
            return result;
          }
          if (node.nodes.length > 0) {
            result = searchNodeToDelete(nodeToDelete, node.nodes);
            if (result.removed) return result;
            if (result.indexToRemove !== null) {
              node.nodes.splice(result.indexToRemove, 1);
              result.removed = true;
              return result;
            }
          }
        }
        return result;
      };
      const result = searchNodeToDelete(nodeToDelete, nodes);
      if (!result.removed && result.indexToRemove !== null) {
        nodes.splice(indexToRemove, 1);
      }
    },

    addNodeHierarchy: function (item, nodes) {
      if (item.NodeID === "") item.NodeID = "NEW_" + this.getRandomNumber(1, 10000).toString();

      if (!item.Item) item.Item = "";

      const newNode = this.createNode(item);

      const searchParentId = (newNode, nodes) => {
        let HierarchyLevel = 0;
        for (const node of nodes) {
          if (node.NodeID === newNode.ParentNodeID) {
            HierarchyLevel = node.nodes.length + 1;
            newNode.parent = node;
            newNode.register.HierarchyLevel = HierarchyLevel;
            node.nodes.push(newNode);
            return HierarchyLevel;
          }
          if (node.nodes.length > 0) {
            HierarchyLevel = searchParentId(newNode, node.nodes);
            if (HierarchyLevel > 0) return HierarchyLevel;
          }
        }
      };
      return searchParentId(newNode, nodes);
    },

    createNode: function (item, parent) {
      let icon = "";
      let color = "";

      if ((item.Kind === "" || !item.Kind) && item.Item === "X") item.Kind = "0";

      if (item.Item !== "X") icon = "sap-icon://folder-full";
      else if (item.Kind === "2") icon = "sap-icon://person-placeholder";
      else if (item.Kind === "3") icon = "sap-icon://notes";
      else if (item.Kind === "0") icon = "sap-icon://media-play";

      if (item.Item !== "X") color = "#dcb67a";
      else color = "black";

      return {
        NodeID: item.NodeID,
        register: item,
        ParentNodeID: item.ParentNodeID,
        highlight: item.highlight,
        Icon: icon,
        parent: parent,
        Color: color,
        nodes: [],
      };
    },

    createNodeHierarchy: function (data) {
      let hierarchy = [];

      const addNewNode = (nodes, item) => {
        let parentFound = false;

        for (let node of nodes) {
          if (node.NodeID === item.ParentNodeID) {
            node.nodes.push(this.createNode(item, node));
            parentFound = true;
            break;
          }
          if (node.nodes.length > 0) {
            parentFound = addNewNode(node.nodes, item);
            if (parentFound) break;
          }
        }
        return parentFound;
      };

      const sortHierarchy = (hierarchy) => {
        hierarchy.sort((a, b) => {
          return a.register.HierarchyLevel - b.register.HierarchyLevel;
        });

        for (const hierarchyItem of hierarchy) {
          if (hierarchyItem.nodes.length > 0) {
            sortHierarchy(hierarchyItem.nodes);
          }
        }
      };

      while (data.length !== 0) {
        for (const [index, item] of data.entries()) {
          if (hierarchy.length === 0) {
            if (item.ParentNodeID === "null") {
              hierarchy.push(this.createNode(item, hierarchy));
              data.splice(index, 1);
              break;
            } else continue;
          }

          if (item.ParentNodeID === "null") {
            hierarchy.push(this.createNode(item, hierarchy));
            data.splice(index, 1);
            break;
          }

          if (addNewNode(hierarchy, item)) {
            data.splice(index, 1);
            break;
          }
        }
      }

      sortHierarchy(hierarchy);

      return hierarchy;
    },

    pressInfoAlert: function (alertType) {
      if (alertType === "lembrete")
        MessageBox.information("Será enviado lembrete aproximadamente 30 minutos antes do início planejado da tarefa, para prevenir atraso.");
      if (alertType === "tarefaNaoInic")
        MessageBox.information("Caso já tenha passado o horário planejamento para início da execução da tarefa, e ela não tenha sido iniciada, será enviada notificação de atraso.");
      if (alertType === "tarefaNaoEnc")
        MessageBox.information("Caso já tenha passado o horário planejamento para término da execução da tarefa, e ela não tenha sido encerrada, será enviada notificação de atraso.");
      if (alertType === "tarefaDisp")
        MessageBox.information("O responsável por esta tarefa será notificado assim que a tarefa precedente for concluída. Este tipo de alerta somente é relevante quando da existência de relação de dependência entre tarefas.");
      if (alertType === "tarefaRep")
        MessageBox.information("Em caso de reprocessamento de tarefa predecessora, será enviada notificação para o responsável pela execução desta tarefa. Este tipo de alerta somente é relevante quando da existência de relação de dependência entre tarefas.");
      if (alertType === "tarefaFin")
        MessageBox.information("Os destinatários informados aqui serão notificados da conclusão desta tarefa assim que o status for alterado para “Concluído sem erros”.");

    },

    onPressChangeStatusPlan: function () {
      let oView = this.getView();
      this._oldStatus = this.getView().getBindingContext().getObject().Status;

      if (!this._changeStatusPlanDialog) {
        this._changeStatusPlanDialog = Fragment.load({
          id: oView.getId(),
          name: "votorantim.corp.clocov2planmanagement.fragments.ChangeStatusPlan",
          controller: this,
        }).then(function (oDialog) {
          oDialog.setModel(oView.getModel());
          oView.addDependent(oDialog);
          return oDialog;
        });
      }

      this._changeStatusPlanDialog.then(
        function (oDialog) {
          oDialog.open();
        }.bind(this)
      );
    },

    onCloseChangeStatusPlanDialog: function () {
      this.getModel().setProperty(this.getView().getBindingContext().getPath() + "/Status", this._oldStatus);
      if (this._changeStatusPlanDialog) {
        this._changeStatusPlanDialog.then(function (oDialog) {
          oDialog.close();
          oDialog.close();
          oDialog.destroy();
        });

        this._changeStatusPlanDialog = undefined;
      }
    },

    ChangeStatusPlan: function () {

      const changeStatus = () => {
        this.getView().setBusy(true);

        const changeStatusPlan = {
          Profile: this._profile,
          Instance: parseInt(this._instance),
          Status: this.getView().getBindingContext().getObject().Status
        }

        this.getView().getModel().callFunction("/change_plan_status", {    // function import name
          method: "POST",                             // http method
          urlParameters: changeStatusPlan, // function import parameters        
          success: function (oData, response) {
            this.getView().setBusy(false);
            if (response.statusCode !== "200") {
              this.displayErrorMessage("Erro ao alterar Status do Plano de Tarefas");
            } else {
              this._oldStatus = changeStatusPlan.Status;
              this.getView().getModel().refresh(true);
              MessageToast.show("Status do Plano de Tarefas atualizado com sucesso");
              this.onCloseChangeStatusPlanDialog();
            }
          }.bind(this),
          error: function (oError) {
            this.displayErrorMessage("Erro ao alterar Status do Plano de Tarefas");
            this.getView().setBusy(false);
            this.onCloseChangeStatusPlanDialog();
          }.bind(this)
        });
      }

      if (this.getView().getBindingContext().getObject().Status === "") {
        this.getView().setBusy(true);
        const hasActiveItems = this.checkIfHasActiveItems();
        this.getView().setBusy(false);
        if (hasActiveItems) {
          MessageBox.warning("Já existe apontamento de status no Plano de Tarefas selecionado. Tem certeza que deseja voltar o status para 'Não Liberado'?", {
            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
            emphasizedAction: MessageBox.Action.OK,
            onClose: function (sAction) {
              if (sAction !== MessageBox.Action.OK) {
                this.getModel().setProperty(this.getView().getBindingContext().getPath() + "/Status", this._oldStatus);
                return;
              }
              else {
                changeStatus();
              }
            }.bind(this)
          })
        }
        else
          changeStatus();
      }
      else
        changeStatus();
    },

    onPressChangeApprovalMass: function () {
      let hasItem = false;
      let oView = this.getView();
      let table;
      const type = this.getView().getModel("detailView").getProperty("/viewMode");

      if (type === "tree") {
        table = this.getView().byId("TreeTemplate");
        const indices = table.getSelectedIndices();

        for (const indice of indices) {
          const object = table.getContextByIndex(indice).getObject();
          if (object.register.Item) {
            hasItem = true;
            break;
          }
        }
      } else hasItem = true;

      if (!hasItem) {
        MessageToast.show("Nenhuma tarefa selecionada");
        return;
      }

      if (!this.getModel("addChangeApprover")) {
        this.createModel({ Active: false }, "addChangeApprover");
        this.createModel([], "newApprovalList");
        this.createModel([], "approvalLevels");

      }
      else {
        this.getModel("addChangeApprover").setProperty("/", { Active: false });
        this.getModel("newApprovalList").setProperty("/", [{ Level: 1 }]);
        this.getModel("approvalLevels").setProperty("/", []);
      }

      this.setAvailableLevels("newApprovalList");

      if (!this._changeApprovalMassDialog) {
        this._changeApprovalMassDialog = Fragment.load({
          id: oView.getId(),
          name: "votorantim.corp.clocov2planmanagement.fragments.ChangeApprovalMass",
          controller: this,
        }).then(
          function (oDialog) {
            oDialog.setModel(oView.getModel());
            oView.addDependent(oDialog);
            return oDialog;
          }.bind(this)
        );
      }

      this._changeApprovalMassDialog.then(
        function (oDialog) {
          oDialog.open();
        }.bind(this)
      );
    },

    openApproverForm(operation) {

      const oView = this.getView();

      this._operation = operation;

      if (operation !== "change")
        this.getModel("addChangeApprover").setProperty("/", { Active: true });

      if (!this._approverFormDialog) {
        this._approverFormDialog = Fragment.load({
          id: oView.getId(),
          name: "votorantim.corp.clocov2planmanagement.fragments.AddChangeApproval",
          controller: this,
        }).then(function (oDialog) {
          oDialog.setModel(oView.getModel());
          oView.addDependent(oDialog);
          this.byId("idBtnAddChangeApprovalCloseDialog").attachPress(null, this.onCloseApproverFormDialog, this);
          this.byId("idBtnAddChangeApproval").attachPress(null, this.addApproverMass, this);
          return oDialog;
        }.bind(this));
      }

      this._approverFormDialog.then(
        function (oDialog) {
          oDialog.open();
        }.bind(this)
      );
    },

    onCloseApproverFormDialog: function () {
      if (this._approverFormDialog) {
        this._approverFormDialog.then(function (oDialog) {
          oDialog.close();
          oDialog.destroy();
        }.bind(this));
      }
      this._approverFormDialog = undefined;
    },

    onPressChangeApproverMass: function (oEvent, approver) {
      this._operation = "change";
      this.getView().getModel("addChangeApprover").setProperty("/", approver);
      this.openApproverForm("change");
    },

    addApproverMass: function () {
      const approvals = this.getModel("newApprovalList").getProperty("/");
      const addChangeApprover = this.getModel("addChangeApprover").getProperty("/");
      // const context = this.getView().getBindingContext().getObject();

      if (!addChangeApprover.Notification) addChangeApprover.Notification = "T";

      if (!addChangeApprover.UserId) {
        MessageBox.error(`Campo "Usuário" é obrigatório`);
        return;
      }
      if (!addChangeApprover.ValidFrom) {
        MessageBox.error(`Campo "Válido De" é obrigatório`);
        return;
      }
      if (!addChangeApprover.ValidTo) {
        MessageBox.error(`Campo "Válido Até" é obrigatório`);
        return;
      }
      if (addChangeApprover.ValidFrom > addChangeApprover.ValidTo) {
        MessageBox.error(`A data "Valido De" não pode ser após a data "Válido Até"`);
        return;
      }

      addChangeApprover.highlight = this.getHighlight(addChangeApprover);

      addChangeApprover.validText = this.getValidText(addChangeApprover);
      addChangeApprover.notificationText = this.getNotificationText(addChangeApprover);

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
      this.getModel("newApprovalList").setProperty("/", approvals);
      this.setAvailableLevels("newApprovalList");
      this.onCloseApproverFormDialog();
    },

    onChangeApppprovalMass: function () {
      MessageBox.warning("Atenção! As Configurações de Aprovação serão aplicadas a todas as tarefas selecionadas. Tem certeza que deseja aplicar as alterações?", {
        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
        emphasizedAction: MessageBox.Action.OK,
        onClose: function (sAction) {
          if (sAction !== MessageBox.Action.OK) return;
          else {
            this.getView().setBusy(true);

            let table;
            let totalItems;
            let totalCompleted = 0;

            const type = this.getView().getModel("detailView").getProperty("/viewMode");
            const approvals = this.getModel("newApprovalList").getProperty("/");
            const addChangeApprover = this.getModel("addChangeApprover").getProperty("/");

            if (type === "tree") table = this.getView().byId("TreeTemplate");
            else table = this.getView().byId("tableTemplate");

            const indices = table.getSelectedIndices();

            const oParams = {
              useBatch: true,
              defaultUpdateMethod: "PUT",
              groupId: "updateApprovalMass"
            };
            const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/", oParams);
            const requestParams = { groupId: oParams.groupId };
            oModel.setDeferredGroups([oParams.groupId]);

            totalItems = indices.length;
            this.setProgress(0);
            this.displayDialogProgress();

            const updateItems = (fromIndex) => {
              let updatedItems = 0;
              for (const indice of indices) {
                let isItem = false;
                const object = table.getContextByIndex(indice).getObject();

                if (object.register) {
                  if (object.register.Item === "X") isItem = true;
                } else if (object.Item === "X") isItem = true;

                if (!isItem) {
                  totalItems--;
                  continue;
                }

                addChangeApprover.Profile = object.Profile || object.register.Profile;
                addChangeApprover.Instance = object.hasOwnProperty('Instance') ? object.Instance : object.register.Instance;
                addChangeApprover.Item = object.NodeID;

                let headerApproval = {};
                Object.assign(headerApproval, addChangeApprover);

                headerApproval.UserId = "";
                const wfHeaderBody = this.getWorkflowBody(headerApproval);
                oModel.remove(`/v2_workflows(Profile='${addChangeApprover.Profile}',Instance=${addChangeApprover.Instance},Item='${addChangeApprover.Item}',UserId='',Level='')`, requestParams);
                oModel.create("/v2_workflows", wfHeaderBody, requestParams);

                for (const approval of approvals) {

                  approval.Profile = object.Profile || object.register.Profile;
                  approval.Instance = object.hasOwnProperty('Instance') ? object.Instance : object.register.Instance;
                  approval.Item = object.NodeID;
                  const wfBody = this.getWorkflowBody(approval);

                  oModel.create("/v2_workflows", wfBody, requestParams);
                }

                updatedItems++;
                totalCompleted++;

                if (updatedItems === this.massBatchSize || totalCompleted === totalItems) {
                  this.submitChangesSync(oModel, "updateApprovalMass").then(() => {
                    this.setProgress((totalCompleted / totalItems) * 100);
                    if (totalCompleted !== totalItems)
                      updateItems(totalCompleted);
                    else {
                      this.getView().setBusy(false);
                      sap.ui.getCore().getEventBus().publish("TaskApprovals", "updateApprovals");
                      table.clearSelection();
                      this.onCloseApprovalMassDialog();
                      MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("appDataSaved"));
                      this.closeDialogProgress();
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
    },

    onCloseApprovalMassDialog: function () {
      this._changeApprovalMassDialog.then(function (oDialog) {
        oDialog.close();
        oDialog.destroy();
        this._changeApprovalMassDialog = undefined;
      }.bind(this));
    },

    getValidText: function (data) {
      return `<strong style="color:navy">Válido de</strong> ${formatter.convertFromSapDate(data.ValidFrom)} <strong style="color:navy">até</strong> ${formatter.convertFromSapDate(data.ValidTo)}`;
    },

    getNotificationText: function (data) {
      return `<strong style="color:navy">Tipo de Notificação:</strong> ${formatter.getNotificationText(data.Notification)}`;
    },

    getHighlight: function (approval) {
      let todayDate = new Date().toISOString().slice(0, 10);
      todayDate = todayDate.replaceAll("-", "");

      if (todayDate < approval.ValidFrom) return "Warning";
      if (todayDate <= approval.ValidTo) return "Success";
      return "Error";
    },

    normalizeLevels: function (approvals) {
      let currentLevel = 0;

      for (const approval of approvals) {
        if (approval.Level > currentLevel) {
          currentLevel++;
          approval.Level = currentLevel;
        }
      }
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

    onPressRemoveApproverMass: function (oEvent, approver) {
      const approvals = this.getModel("newApprovalList").getProperty("/");
      const filteredApprovals = approvals.filter(item => item.Email !== approver.Email || item.ValidFrom !== approver.ValidFrom || item.ValidTo !== approver.ValidTo)
      this.normalizeLevels(filteredApprovals);
      this.getModel("newApprovalList").setProperty("/", filteredApprovals);
      this.setAvailableLevels("newApprovalList");
    },

    getWorkflowBody: function (data) {

      let level;
      if (data.Level) level = data.Level.toString();

      return {
        Profile: data.Profile,
        Instance: data.Instance,
        Item: data.Item,
        UserId: data.UserId,
        Level: level,
        Active: data.Active,
        ApproverName: data.Name,
        ValidFrom: data.ValidFrom,
        ValidTo: data.ValidTo,
        Notification: data.Notification,
      }
    },

    showDepartamentSearchHelp: function (departamentId) {

      const oView = this.getView();
      this._departamentId = departamentId;
      const currentContext = oView.getBindingContext().getObject();

      this._departamentDialog = Fragment.load({
        id: this.getView().getId(),
        name: "votorantim.corp.clocov2planmanagement.fragments.DepartamentHelp",
        controller: this,
      }).then(
        function (oDialog) {
          oDialog.setModel(oView.getModel());
          oView.addDependent(oDialog);
          this.getView().byId("departamentTable").bindAggregation("rows", `/v2_departamentos(Profile='${currentContext.Profile}',Departamento='')/toDepartamentos`);
          return oDialog;
        }.bind(this)
      );

      this._departamentDialog.then(
        function (oDialog) {
          oDialog.open();
        }.bind(this)
      );
    },

    filterDepartament: function (oEvent) {
      const sQuery = oEvent.getParameter("query");
      this._oFilterDepartament = null;

      if (sQuery) {
        this._oFilterDepartament = new Filter([
          new Filter("Departamento", FilterOperator.Contains, sQuery)
        ], false);
      }

      this.byId("departamentTable").getBinding().filter(this._oFilterDepartament, "Application");
    },

    onPressApplyDepartament: function (oEvent) {
      const table = this.getView().byId("departamentTable");
      const selectedContext = table.getContextByIndex(table.getSelectedIndex()).getObject();
      this.byId(this._departamentId).setValue(selectedContext.Departamento);
      if (this._departamentId === "idAreaTask")
        this.onDataChanged();
      this.onCloseDepartamentDialog();
    },

    onPressCreateDepartament: function () {
      this._oCreateDepartamentDialog = new sap.m.Dialog({
        title: "Criar Área/Departamento",
        content: new sap.m.Input({ placeholder: "Área/Departamento", id: "idNewDepartament" }),
        beginButton: new sap.m.Button({
          type: sap.m.ButtonType.Emphasized,
          text: "Criar Departamento",
          press: this.createDepartament.bind(this)
        }),
        endButton: new sap.m.Button({
          text: "Cancelar",
          press: this.onCloseDepartamentCreateDialog.bind(this)
        })
      }).addStyleClass("sapUiResponsivePadding--content");
      this.getView().addDependent(this._oCreateDepartamentDialog);
      this._oCreateDepartamentDialog.open();
    },

    onCloseDepartamentCreateDialog: function () {
      this._oCreateDepartamentDialog.close();
      this._oCreateDepartamentDialog.destroy();
      this._oCreateDepartamentDialog = null;
    },

    createDepartament() {

      const currentContext = this.getView().getBindingContext().getObject();

      const newDepartament = {
        Profile: currentContext.Profile,
        Departamento: this._oCreateDepartamentDialog.getContent()[0].getValue()
      }
      this.getView().setBusy(true);

      this.getModel().create("/v2_departamentos", newDepartament,
        {
          success: function (oData, sResponse) {
            this.getView().setBusy(false);
            this.byId(this._departamentId).setValue(newDepartament.Departamento);
            this.onCloseDepartamentDialog();
            this.onCloseDepartamentCreateDialog();
          }.bind(this),
          error: function (oData, sResponse) {
            this.getView().setBusy(false);
            const json = JSON.parse(oData.responseText);
            MessageBox.error(json.error.message.value);
          }.bind(this),
        })
    },

    onCloseDepartamentDialog: function () {
      if (this._departamentDialog) {
        this._departamentDialog.then(function (oDialog) {
          oDialog.close();
          oDialog.destroy();
        }.bind(this));
      }
      this._departamentDialog = undefined;
    },

    _getRouteName: function () {
      const router = this.getOwnerComponent().getRouter();
      const currentHash = router.getHashChanger().getHash();
      const { name } = router.getRouteInfoByHash(currentHash); // since 1.75
      return name;
    },

    checkIfHasActiveItems: function () {
      let hasActiveItems = false;
      const tasksPath = this.getView().getBindingContext().getProperty("toPlanoDetalhes");
      for (const taskPath of tasksPath) {
        const object = this.getView().getModel().getProperty("/" + taskPath);
        if (object.Status !== "") {
          hasActiveItems = true;
          break;
        }
      }
      return hasActiveItems;
    },

    onPressDeletePlan: function () {

      const status = this.getView().getBindingContext().getObject().Status;

      if (status !== "") {
        this.displayErrorMessage("Só é possível excluir Plano de Tarefas com status de 'Não Liberado'.");
        return;
      }

      let text;
      this.getView().setBusy(true);
      const hasActiveItems = this.checkIfHasActiveItems();
      this.getView().setBusy(false);
      if (hasActiveItems)
        text = "Já existe apontamento de status no Plano de Tarefas selecionado. Tem certeza que deseja Eliminar? O Plano não poderá ser recuperado posteriormente."
      else
        text = "Tem certeza que deseja Eliminar? O Plano não poderá ser recuperado posteriormente."

      MessageBox.warning(text, {
        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
        emphasizedAction: MessageBox.Action.OK,
        onClose: function (sAction) {
          if (sAction !== MessageBox.Action.OK) return;
          else {
            this.getView().setBusy(true);

            const oParams = {
              useBatch: true,
              defaultUpdateMethod: "PUT",
              groupId: "deletePlan"
            };
            const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/", oParams);
            const requestParams = {};
            requestParams.groupId = oParams.groupId;
            oModel.setDeferredGroups([oParams.groupId]);

            const currentContextObject = this.getView().getBindingContext().getObject()

            oModel.remove("/" + `v2_planos(Profile='${currentContextObject.Profile}',Instance=${currentContextObject.Instance})`, requestParams);

            oModel.submitChanges({
              success: function (oData, sResponse) {
                this.getView().setBusy(false);
                if (oData.__batchResponses[0].response) {
                  const resp = JSON.parse(oData.__batchResponses[0].response.body);
                  this.displayErrorMessage(resp.error.message.value);
                } else {
                  MessageToast.show("Plano de Tarefas excluído com sucesso");
                  this.goToMainPage();
                }
              }.bind(this),
              error: function (oError) {
                this.displayErrorMessage("Erro ao excluir Plano de Tarefas");
                this.getView().setBusy(false);
              }.bind(this),
            });
          }
        }.bind(this),
      });
    },

    onPressOpenSettings: function () {
      const oView = this.getView();

      if (!this._settingsDialog) {
        this._settingsDialog = Fragment.load({
          id: oView.getId(),
          name: "votorantim.corp.clocov2planmanagement.fragments.Settings",
          controller: this,
        }).then(
          function (oDialog) {
            oDialog.setModel(oView.getModel());
            oView.addDependent(oDialog);
            oDialog.setBusyIndicatorDelay(0);
            return oDialog;
          }.bind(this)
        );
      }

      this._settingsDialog.then(
        function (oDialog) {
          this.getSettings(oDialog);
          oDialog.open();
        }.bind(this)
      );
    },

    onChangeSettings: function () {
      const tableMotives = this.getModel("motives").getProperty("/");
      const settings = this.getView().getModel("settings").getProperty("/");

      if (settings.LateTasksPopup)
        if (!tableMotives.length || tableMotives.length === 0) {
          MessageBox.error("Nenhum motivo de atraso cadastrado");
          return;
        }


      this._settingsDialog.then(
        function (oDialog) {
          oDialog.setBusy(true);
        }
      );
      this.getView().getModel().update(`/v2_configurations(Profile='${settings.Profile}',Instance=${settings.Instance})`, settings, {
        success: (odata) => {
          this.onCloseSettingsDialog();
          MessageToast.show("Configurações atualizadas");
        }
      });

    },

    getSettings: function (dialog) {
      const contextObject = this.getView().getBindingContext().getObject();
      dialog.setBusy(true);
      this.getModel().read(`/v2_configurations(Profile='${contextObject.Profile}',Instance=${contextObject.Instance})`, {
        success: (odata) => {
          this.createModel(odata, "settings");
          dialog.setBusy(false);
        }
      })
    },

    onCloseSettingsDialog: function () {
      if (this._settingsDialog) {
        this._settingsDialog.then(function (oDialog) {
          oDialog.close();
          oDialog.destroy();
        })
      }
      this._settingsDialog = undefined;
    },

    multiInputEmailValidator: function (args) {
      const text = args.text;
      if (text.indexOf("@") !== -1)
        return new sap.m.Token({ key: text, text: text });
    },

    onPressOpenPlanHeader: function () {
      const oView = this.getView();

      if (!this._planHeader) {
        this._planHeader = Fragment.load({
          id: oView.getId(),
          name: "votorantim.corp.clocov2planmanagement.fragments.PlanHeader",
          controller: this,
        }).then(
          function (oDialog) {
            oDialog.setModel(oView.getModel());
            oView.addDependent(oDialog);
            oDialog.setBusyIndicatorDelay(0);
            return oDialog;
          }.bind(this)
        );
      }

      this._planHeader.then(
        function (oDialog) {
          oDialog.open();
        }.bind(this)
      );
    },

    onClosePlanHeaderDialog: function () {
      if (this._planHeader) {
        this._planHeader.then(function (oDialog) {
          oDialog.close();
          oDialog.destroy();
        })
      }
      this._planHeader = undefined;
    },

    newTaskBody: function (data, dataDep) {
      return {
        Profile: data.Profile,
        Instance: data.Instance,
        NodeID: data.NodeID,
        Item_prev: dataDep.NodeID,
        Resp: data.Resp,
        InicioPlanejadoDias: data.InicioPlanejadoDias,
        InicioPlanejadoHoras: data.InicioPlanejadoHoras,
        FimPlanejadoDias: data.FimPlanejadoDias,
        FimPlanejadoHoras: data.FimPlanejadoHoras,
        TipoTarefa: data.TipoTarefa,
        Transacao: data.Transacao,
        DescTarefa: data.Description || data.DescTarefa,
        DuracaoPlanejadoDias: data.DuracaoPlanejadoDias,
        DuracaoPlanejadoHoras: data.DuracaoPlanejadoHoras,
        CaminhoCritico: data.CaminhoCritico,
        Caminho: data.Caminho,
        NomePrograma: data.NomePrograma,
        VariantePrograma: data.VariantePrograma,
        RespExec: data.RespExec,
        Empresa: data.Empresa,
        InicioPlanAposDataBase: data.InicioPlanAposDataBase
      };
    },

    onPressAddMotives: function () {
      const oView = this.getView();

      if (!this._motivesDialog) {
        this._motivesDialog = Fragment.load({
          id: oView.getId(),
          name: "votorantim.corp.clocov2planmanagement.fragments.ConfigureLateTaskMotives",
          controller: this,
        }).then(
          function (oDialog) {
            // oDialog.setModel(oView.getModel());
            oView.addDependent(oDialog);
            oDialog.setBusyIndicatorDelay(0);

            this.getModel().read(`/v2_modelos(Profile='${this._profile}',Instance=${this._instance})/toMotivoAtraso`, {
              success: function (oData, oResponse) {
                this.getModel("motives").setProperty("/", oResponse.data.results);
              }.bind(this)
            });

            return oDialog;
          }.bind(this)
        );
      }

      this._motivesDialog.then(
        function (oDialog) {
          this.getSettings(oDialog);
          oDialog.open();
        }.bind(this)
      );
    },

    onCloseAddMotivesDialog: function () {
      this.getView().getModel("settings").setProperty("/LateTasksPopup", true);
      if (this._motivesDialog) {
        this._motivesDialog.then(function (oDialog) {
          oDialog.close();
          oDialog.destroy();
        })
      }
      this._motivesDialog = undefined;
    },

    onMotiveSelectChange: function () {
      let selectedItems = [];

      selectedItems = this.byId("idMotivesTable").getSelectedIndices();

      if (selectedItems.length > 0) this.byId("idRemoveMotiveButton").setEnabled(true);
      else this.byId("idRemoveMotiveButton").setEnabled(false);
    },

    onPressAddMotive: function () {
      const oParams = {
        useBatch: true,
        groupId: "updateMotives"
      };
      const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/", oParams);
      const requestParams = {};
      requestParams.groupId = oParams.groupId;
      oModel.setDeferredGroups([oParams.groupId]);

      const motive = this.byId("idInputMotive").getValue();

      if (motive.trim() === "") {
        MessageBox.error("Preencher o Motivo")
      }
      else {

        const newMotive = {
          Profile: this._profile,
          Instance: parseInt(this._instance),
          Seq: 0,
          Motivo: motive,
          Tipo: "ATRASO"
        }

        oModel.create("/" + `v2_motivo_atrasos`, newMotive, requestParams);

        oModel.submitChanges({
          success: function (oData, sResponse) {
            this.getView().setBusy(false);
            if (oData.__batchResponses[0].response) {
              const resp = JSON.parse(oData.__batchResponses[0].response.body);
              this.displayErrorMessage(resp.error.message.value);
            } else {
              MessageToast.show("Motivo adicionado com sucesso");
              this.byId("idInputMotive").setValue("");
              const tableMotives = this.getModel("motives").getProperty("/");
              tableMotives.unshift(newMotive);
              this.getModel("motives").setProperty("/", tableMotives);

            }
          }.bind(this),
          error: function (oError) {
            this.displayErrorMessage("Erro ao adicionar Motivo");
            this.getView().setBusy(false);
          }.bind(this),
        });
      }
    },

    onPressRemoveMotive: function () {

      const oParams = {
        useBatch: true,
        groupId: "deleteMotives"
      };
      const oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/", oParams);
      const requestParams = {};
      requestParams.groupId = oParams.groupId;
      oModel.setDeferredGroups([oParams.groupId]);

      const selectedItems = this.byId("idMotivesTable").getSelectedIndices();

      for (const index of selectedItems) {
        const object = this.byId("idMotivesTable").getContextByIndex(index).getObject();
        oModel.remove(`/v2_motivo_atrasos(Profile='${this._profile}',Instance=${this._instance},Seq=${object.Seq})`, requestParams);
      }
      oModel.submitChanges({
        success: function (oData, sResponse) {
          this.getView().setBusy(false);
          if (oData.__batchResponses[0].response) {
            const resp = JSON.parse(oData.__batchResponses[0].response.body);
            this.displayErrorMessage(resp.error.message.value);
          } else {
            MessageToast.show("Motivo removido com sucesso");
            const tableMotives = this.getModel("motives").getProperty("/");

            for (let index = selectedItems.length; index > 0; index--) {
              const element = selectedItems[index - 1];
              tableMotives.splice(element, 1);
            }

            this.getModel("motives").setProperty("/", tableMotives);
            this.byId("idMotivesTable").clearSelection();

          }
        }.bind(this),
        error: function (oError) {
          this.displayErrorMessage("Erro ao remover Motivo");
          this.getView().setBusy(false);
        }.bind(this),
      });

    }

  });
});
