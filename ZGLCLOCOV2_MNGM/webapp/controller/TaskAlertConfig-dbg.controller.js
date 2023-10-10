sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/m/library", "sap/ui/core/Fragment", "sap/m/Token", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/m/MessageToast", "sap/m/MessageBox"], function (BaseController, JSONModel, formatter, mobileLibrary, Fragment, Token, Filter, FilterOperator, MessageToast, MessageBox) {
  "use strict";

  // shortcut for sap.m.URLHelper
  var URLHelper = mobileLibrary.URLHelper;

  return BaseController.extend("votorantim.corp.clocov2planmanagement.controller.TaskAlertConfig", {
    formatter: formatter,

    onInit: function () {

      this.getView().attachModelContextChange(null, this.onContextChange, this);

      const multiInputs = ["idMultiEmailLembrete", "idMultiEmailatividadeNaoInic", "idMultiEmailAtividadeNaoEnc", "idMultiEmailAtividadeDisp", "idMultiEmailAtividadeReoroc", "idMultiEmailAtividadeFin"]
      for (const multiInput of multiInputs) {
        this.getView().byId(multiInput).addValidator(this.multiInputEmailValidator);
      }

      // this.getView().byId("idMultiEmailLembrete").attachBrowserEvent("keydown", this.updateEmailSuggestions, this);
      // this.getView().byId("idMultiEmailatividadeNaoInic").attachBrowserEvent("keydown", this.updateEmailSuggestions, this);
      // this.getView().byId("idMultiEmailAtividadeNaoEnc").attachBrowserEvent("keydown", this.updateEmailSuggestions, this);
      // this.getView().byId("idMultiEmailAtividadeDisp").attachBrowserEvent("keydown", this.updateEmailSuggestions, this);
      // this.getView().byId("idMultiEmailAtividadeReoroc").attachBrowserEvent("keydown", this.updateEmailSuggestions, this);
      // this.getView().byId("idMultiEmailAtividadeFin").attachBrowserEvent("keydown", this.updateEmailSuggestions, this);

      this._updateEmailSuggestion = 3;
      this._updatingSuggestion = false;

    },

    onContextChange: function (oEvent) {
      if (!this.getView().getModel()) return;
      if (!this.getView().getBindingContext()) return;
      const context = this.getView().getBindingContext().getObject();
      // if (this._lastItem === context.NodeID) return;
      this._lastItem = context.NodeID;
      this.updateAlertFields(context);
    },

    onExit: function () {
      // this.getView().byId("idMultiEmailLembrete").detachBrowserEvent("keydown", this.updateEmailSuggestions, this);
      // this.getView().byId("idMultiEmailatividadeNaoInic").detachBrowserEvent("keydown", this.updateEmailSuggestions, this);
      // this.getView().byId("idMultiEmailAtividadeNaoEnc").detachBrowserEvent("keydown", this.updateEmailSuggestions, this);
      // this.getView().byId("idMultiEmailAtividadeDisp").detachBrowserEvent("keydown", this.updateEmailSuggestions, this);
      // this.getView().byId("idMultiEmailAtividadeReoroc").detachBrowserEvent("keydown", this.updateEmailSuggestions, this);
      // this.getView().byId("idMultiEmailAtividadeFin").detachBrowserEvent("keydown", this.updateEmailSuggestions, this);
      this.getView().detachModelContextChange(this.onContextChange, this);
    },

    _onObjectMatched: function (oEvent) {
      let oArgs = oEvent.getParameter("arguments");

      this._profile = oArgs.profile;
      this._instance = oArgs.instance;
      this._item = oArgs.item;
    },

    getEmailTokens: function (emails) {
      const tokens = [];
      if (emails === "") return tokens;
      const emailList = emails.split(";");
      for (const email of emailList) {
        const tokenEmail = { key: email, text: email, editable: true };
        tokens.push(tokenEmail);
      }
      return tokens;
    },

    updateAlertFields: function (context) {

      let tokenUserResp;
      const tokenEmailSucessores = [];
      const notificacoesData = this.getView().getModel().getProperty(`/v2_notificacoes(Profile='${context.Profile}',Instance=${context.Instance},Item='${context.NodeID}')`);

      if (notificacoesData.EmailResp)
        tokenUserResp = { key: "resp", text: notificacoesData.EmailResp, editable: false };

      if (notificacoesData.EmailSucessores) {
        const emailSucessores = notificacoesData.EmailSucessores.split(',');
        for (const emailSucessor of emailSucessores) {
          tokenEmailSucessores.push({ key: "emailsucessor", text: emailSucessor, editable: false })
        }
      }

      notificacoesData.LembreteEmails = this.cleanVar(notificacoesData.LembreteEmails);
      notificacoesData.AtividadeNaoInicEmails = this.cleanVar(notificacoesData.AtividadeNaoInicEmails);
      notificacoesData.AtividadeNaoEncEmails = this.cleanVar(notificacoesData.AtividadeNaoEncEmails);
      notificacoesData.AtividadeDispEmails = this.cleanVar(notificacoesData.AtividadeDispEmails);
      notificacoesData.AtividadeRepEmails = this.cleanVar(notificacoesData.AtividadeRepEmails);
      notificacoesData.AtividadeFinEmails = this.cleanVar(notificacoesData.AtividadeFinEmails);

      if (notificacoesData.LembreteEmails) {
        const tokensLembrete = this.getEmailTokens(notificacoesData.LembreteEmails);
        if (tokenUserResp) tokensLembrete.unshift(tokenUserResp);
        this.getView().getModel("alertEmails").setProperty("/lembreteEmails", tokensLembrete);
      }
      else {
        if (tokenUserResp)
          this.getView().getModel("alertEmails").setProperty("/lembreteEmails", [tokenUserResp]);
      }

      if (notificacoesData.AtividadeNaoInicEmails) {
        const tokensAtivNaoInic = this.getEmailTokens(notificacoesData.AtividadeNaoInicEmails);
        if (tokenUserResp) tokensAtivNaoInic.unshift(tokenUserResp);
        this.getView().getModel("alertEmails").setProperty("/AtividadeNaoInicEmails", tokensAtivNaoInic);
      }
      else {
        if (tokenUserResp)
          this.getView().getModel("alertEmails").setProperty("/AtividadeNaoInicEmails", [tokenUserResp]);
      }

      if (notificacoesData.AtividadeNaoEncEmails) {
        const tokensAtivNaoEnc = this.getEmailTokens(notificacoesData.AtividadeNaoEncEmails);
        if (tokenUserResp) tokensAtivNaoEnc.unshift(tokenUserResp);
        this.getView().getModel("alertEmails").setProperty("/AtividadeNaoEncEmails", tokensAtivNaoEnc);
      }
      else {
        if (tokenUserResp)
          this.getView().getModel("alertEmails").setProperty("/AtividadeNaoEncEmails", [tokenUserResp]);
      }

      if (notificacoesData.AtividadeDispEmails) {
        const tokensAtivDisp = this.getEmailTokens(notificacoesData.AtividadeDispEmails);
        if (tokenUserResp) tokensAtivDisp.unshift(tokenUserResp);
        this.getView().getModel("alertEmails").setProperty("/AtividadeDispEmails", tokensAtivDisp);
      }
      else {
        if (tokenUserResp)
          this.getView().getModel("alertEmails").setProperty("/AtividadeDispEmails", [tokenUserResp]);
      }

      if (notificacoesData.AtividadeRepEmails) {
        const tokensLReproc = this.getEmailTokens(notificacoesData.AtividadeRepEmails);
        if (tokenUserResp) tokensLReproc.unshift(tokenUserResp);
        this.getView().getModel("alertEmails").setProperty("/AtividadeRepEmails", tokensLReproc);
      }
      else {
        if (tokenUserResp)
          this.getView().getModel("alertEmails").setProperty("/AtividadeRepEmails", [tokenUserResp]);
      }

      if (notificacoesData.AtividadeFinEmails) {
        const tokensLFin = this.getEmailTokens(notificacoesData.AtividadeFinEmails);
        this.getView().getModel("alertEmails").setProperty("/AtividadeFinEmails", tokensLFin);
      }

    },

    cleanVar: function (data) {
      if (data === "resp")
        return ""
      if (data.indexOf("resp;") !== -1)
        return data.replaceAll("resp;", "")
      return data;
    },

    onDataChanged: function () {
      if (!this._taskView) this._taskView = this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");
      if (!this._taskView.getModel("taskView").getProperty("/hasChanges")) {
        this._taskView.byId("ObjectPageTask").setShowFooter(true);
        this._taskView.getModel("taskView").setProperty("/hasChanges", true);
      }
    },

  });
});
