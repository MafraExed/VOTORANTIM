sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel","../model/formatter","sap/m/library","sap/ui/core/Fragment"],function(e,t,s,i,a){"use strict";var o=i.URLHelper;return e.extend("votorantim.corp.clocov2planmanagement.controller.TaskDetail",{formatter:s,onInit:function(){this.createModel({cols:[{label:"Nome",template:"name",width:"40%"},{label:"E-mail",template:"email",width:"40%"},{label:"Usuário SAP",template:"user",width:"20%"}]},"columnsSearchUsers")},showCompanySearchHelp:function(e){const t=e.getSource();if(t.getId().indexOf("idCompanyTask")!==-1){const e="/v2_help_companies";const t=this.getView().getModel("i18n").getResourceBundle().getText("folderCompanyCode");const s=["BUKRS","Desc"];const i=[{label:"Empresa",template:"BUKRS",width:"40%"},{label:"Descrição",template:"Desc",width:"60%"}];this.getView().getModel("columnsSearchHelp").setProperty("/cols",i);this.onValueHelpRequested(e,"columnsSearchHelp",t,s,this.onSHPressCompanyTask.bind(this),false);return}},onSHPressCompanyTask:function(e){if(!this._taskView)this._taskView=this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");const t=this._oValueHelpDialog.getTable();const s=t.getSelectedIndex();const i=t.getContextByIndex(s).getObject();const a=this._taskView.getBindingContext().getPath();this._taskView.getModel().setProperty(a+"/Empresa",i.BUKRS);this.onDataChanged();this._oValueHelpDialog.close()},showVarSearchHelp:function(e){if(!this._taskView)this._taskView=this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");const t=e.getSource();const s="Variante";const i=["Nome_variante"];const a=[{label:"Variante",template:"Nome_variante",width:"50%"},{label:"Descrição",template:"Descricao_variante",width:"50%"}];this.getView().getModel("columnsSearchHelp").setProperty("/cols",a);if(t.getId().indexOf("varTaskDetail")!==-1){const e=this._taskView.getBindingContext().getPath();const t=this._taskView.getModel().getProperty(e+"/NomePrograma");const a=`/v2_help_programas(Programa='${t}')/to_variantes`;this.onValueHelpRequested(a,"columnsSearchHelp",s,i,this.onSHPressVarTaskDetail.bind(this),false)}},onSHPressVarTaskDetail:function(e){if(!this._taskView)this._taskView=this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");const t=this._oValueHelpDialog.getTable();const s=t.getSelectedIndex();const i=t.getContextByIndex(s).getObject();const a=this._taskView.getBindingContext().getPath();this._taskView.getModel().setProperty(a+"/VariantePrograma",i.Nome_variante);this.onDataChanged();this._oValueHelpDialog.close()},onDataChanged:function(){if(!this._taskView)this._taskView=this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");if(!this._taskView.getModel("taskView").getProperty("/hasChanges")){this._taskView.byId("ObjectPageTask").setShowFooter(true);this._taskView.getModel("taskView").setProperty("/hasChanges",true)}},showUserSearchHelp:function(e){const t=e.getSource();if(t.getId().indexOf("idBtnRespExec")!==-1){if(!this._taskView)this._taskView=this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");const e="/v2_help_user";const t=this.getView().getModel("i18n").getResourceBundle().getText("taskSelectUser");const s=["email","user","name"];this.onValueHelpRequested(e,"columnsSearchUsers",t,s,this.onSHPressUserRespExec.bind(this),false);return}if(t.getId().indexOf("idBtnResp")!==-1){if(!this._taskView)this._taskView=this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");const e="/v2_help_user";const t=this.getView().getModel("i18n").getResourceBundle().getText("taskSelectUser");const s=["email","user","name"];this.onValueHelpRequested(e,"columnsSearchUsers",t,s,this.onSHPressUserResp.bind(this),false);return}},onSHPressUserResp:function(e){if(!this._taskView)this._taskView=this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");const t=this._oValueHelpDialog.getTable();const s=t.getSelectedIndex();const i=t.getContextByIndex(s).getObject();const a=this._taskView.getBindingContext().getPath();this._taskView.getModel().setProperty(a+"/Resp",i.user);this.onDataChanged();this._oValueHelpDialog.close()},onSHPressUserRespExec:function(e){if(!this._taskView)this._taskView=this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");const t=this._oValueHelpDialog.getTable();const s=t.getSelectedIndex();const i=t.getContextByIndex(s).getObject();const a=this._taskView.getBindingContext().getPath();this._taskView.getModel().setProperty(a+"/RespExec",i.user);this.onDataChanged();this.updateRespAlertFields(i);this._oValueHelpDialog.close()},updateRespAlertFields:function(e){const t=this.getView().getModel("alertEmails").getProperty("/");const s=e=>e.key!=="resp";t.lembreteEmails=t.lembreteEmails.filter(s);t.AtividadeNaoInicEmails=t.AtividadeNaoInicEmails.filter(s);t.AtividadeNaoEncEmails=t.AtividadeNaoEncEmails.filter(s);t.AtividadeDispEmails=t.AtividadeDispEmails.filter(s);t.AtividadeRepEmails=t.AtividadeRepEmails.filter(s);if(e.email){const s={key:"resp",text:e.email,editable:false};t.lembreteEmails.unshift(s);t.AtividadeNaoInicEmails.unshift(s);t.AtividadeNaoEncEmails.unshift(s);t.AtividadeDispEmails.unshift(s);t.AtividadeRepEmails.unshift(s)}this.getView().getModel("alertEmails").setProperty("/",t)},onSHPressTcodeTaskDetail:function(e){if(!this._taskView)this._taskView=this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");const t=this._oValueHelpDialog.getTable();const s=t.getSelectedIndex();const i=t.getContextByIndex(s).getObject();const a=this._taskView.getBindingContext().getPath();this._taskView.getModel().setProperty(a+"/Transacao",i.Transacao);this.onDataChanged();this._oValueHelpDialog.close()},onSHPressJobTaskDetail:function(e){if(!this._taskView)this._taskView=this.getRootView("votorantim.corp.clocov2planmanagement.view.Task");const t=this._oValueHelpDialog.getTable();const s=t.getSelectedIndex();const i=t.getContextByIndex(s).getObject();const a=this._taskView.getBindingContext().getPath();this._taskView.getModel().setProperty(a+"/NomePrograma",i.Programa);this.onDataChanged();this._oValueHelpDialog.close()}})});