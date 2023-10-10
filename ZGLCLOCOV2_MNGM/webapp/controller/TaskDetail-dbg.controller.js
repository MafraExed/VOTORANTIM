sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/m/library", "sap/ui/core/Fragment"], function (BaseController, JSONModel, formatter, mobileLibrary, Fragment) {
  "use strict";

  // shortcut for sap.m.URLHelper
  var URLHelper = mobileLibrary.URLHelper;

  return BaseController.extend("votorantim.corp.clocov2planmanagement.controller.TaskDetail", {
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
    },

    showCompanySearchHelp: function (oEvent) {
      const source = oEvent.getSource();

      if (source.getId().indexOf("idCompanyTask") !== -1) {
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
        this.onValueHelpRequested(dataPath, "columnsSearchHelp", title, fieldsSearch, this.onSHPressCompanyTask.bind(this), false);
        return;
      }
    },

    onSHPressCompanyTask: function (oEvent) {
      if (!this._taskView) this._taskView = this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      const contextPath = this._taskView.getBindingContext().getPath();
      this._taskView.getModel().setProperty(contextPath + "/Empresa", object.BUKRS);
      this.onDataChanged();
      this._oValueHelpDialog.close();
    },

    showVarSearchHelp: function (oEvent) {
      if (!this._taskView) this._taskView = this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");
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
      if (source.getId().indexOf("varTaskDetail") !== -1) {
        const contextPath = this._taskView.getBindingContext().getPath();
        const program = this._taskView.getModel().getProperty(contextPath + "/NomePrograma");
        const dataPath = `/v2_help_programas(Programa='${program}')/to_variantes`;
        this.onValueHelpRequested(dataPath, "columnsSearchHelp", title, fieldsSearch, this.onSHPressVarTaskDetail.bind(this), false);
      }
    },

    onSHPressVarTaskDetail: function (oEvent) {
      if (!this._taskView) this._taskView = this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      const contextPath = this._taskView.getBindingContext().getPath();
      this._taskView.getModel().setProperty(contextPath + "/VariantePrograma",object.Nome_variante);
      this.onDataChanged();
      this._oValueHelpDialog.close();
    },

    onDataChanged: function () {
      if (!this._taskView) this._taskView = this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");
      if (!this._taskView.getModel("taskView").getProperty("/hasChanges")) {
        this._taskView.byId("ObjectPageTask").setShowFooter(true);
        this._taskView.getModel("taskView").setProperty("/hasChanges", true);
      }
    },

    showUserSearchHelp: function (oEvent) {
      const source = oEvent.getSource();

      if (source.getId().indexOf("idBtnRespExec") !== -1) {
        if (!this._taskView) this._taskView = this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");
        const dataPath = "/v2_help_user";
        const title = this.getView().getModel("i18n").getResourceBundle().getText("taskSelectUser");
        const fieldsSearch = ["email", "user", "name"];
        this.onValueHelpRequested(dataPath, "columnsSearchUsers", title, fieldsSearch, this.onSHPressUserRespExec.bind(this), false);
        return;
      }

      if (source.getId().indexOf("idBtnResp") !== -1) {
        if (!this._taskView) this._taskView = this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");
        const dataPath = "/v2_help_user";
        const title = this.getView().getModel("i18n").getResourceBundle().getText("taskSelectUser");
        const fieldsSearch = ["email", "user", "name"];
        this.onValueHelpRequested(dataPath, "columnsSearchUsers", title, fieldsSearch, this.onSHPressUserResp.bind(this), false);
        return;
      }
    },

    onSHPressUserResp: function (oEvent) {
      if (!this._taskView) this._taskView = this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      const contextPath = this._taskView.getBindingContext().getPath();
      this._taskView.getModel().setProperty(contextPath + "/Resp", object.user);
      this.onDataChanged();
      this._oValueHelpDialog.close();
    },

    onSHPressUserRespExec: function (oEvent) {
      if (!this._taskView) this._taskView = this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      const contextPath = this._taskView.getBindingContext().getPath();
      this._taskView.getModel().setProperty(contextPath + "/RespExec", object.user);
      this.onDataChanged();
      this.updateRespAlertFields(object);
      this._oValueHelpDialog.close();
    },

    updateRespAlertFields: function(object) {
      const alertData = this.getView().getModel("alertEmails").getProperty("/");

      const removeResp = (token) => {
        return token.key !== "resp"
      }

      alertData.lembreteEmails = alertData.lembreteEmails.filter(removeResp);
      alertData.AtividadeNaoInicEmails = alertData.AtividadeNaoInicEmails.filter(removeResp);
      alertData.AtividadeNaoEncEmails = alertData.AtividadeNaoEncEmails.filter(removeResp);
      alertData.AtividadeDispEmails = alertData.AtividadeDispEmails.filter(removeResp);
      alertData.AtividadeRepEmails = alertData.AtividadeRepEmails.filter(removeResp);

      if (object.email){
        const tokenUserResp = { key: "resp", text: object.email, editable: false };
        alertData.lembreteEmails.unshift(tokenUserResp);
        alertData.AtividadeNaoInicEmails.unshift(tokenUserResp);
        alertData.AtividadeNaoEncEmails.unshift(tokenUserResp);
        alertData.AtividadeDispEmails.unshift(tokenUserResp);
        alertData.AtividadeRepEmails.unshift(tokenUserResp);
      }
      this.getView().getModel("alertEmails").setProperty("/",alertData);
    },
    
    onSHPressTcodeTaskDetail: function (oEvent) {
      if (!this._taskView) this._taskView = this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      const contextPath = this._taskView.getBindingContext().getPath();
      this._taskView.getModel().setProperty(contextPath + "/Transacao", object.Transacao);
      this.onDataChanged();
      this._oValueHelpDialog.close();
    },

    onSHPressJobTaskDetail: function (oEvent) {
      if (!this._taskView) this._taskView = this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");
      const table = this._oValueHelpDialog.getTable();
      const selectedIndex = table.getSelectedIndex();
      const object = table.getContextByIndex(selectedIndex).getObject();
      const contextPath = this._taskView.getBindingContext().getPath();
      this._taskView.getModel().setProperty(contextPath + "/NomePrograma", object.Programa);
      this.onDataChanged();
      this._oValueHelpDialog.close();
    },

  });
});
