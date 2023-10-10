sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel","../model/formatter","sap/m/library","sap/ui/core/Fragment"],function(e,t,o,l,i){"use strict";var n=l.URLHelper;return e.extend("votorantim.corp.clocov2planmanagement.controller.FolderDetail",{formatter:o,onInit:function(){this.createModel({cols:[]},"columnsSearchHelp")},onDataChanged:function(){if(!this._folderView)this._folderView=this.getRootView("votorantim.corp.clocov2planmanagement.view.Folder");if(!this._folderView.getModel("folderView").getProperty("/hasChanges")){this._folderView.byId("ObjectPageFolder").setShowFooter(true);this._folderView.getModel("folderView").setProperty("/hasChanges",true)}},showUserSearchHelp:function(e){const t=e.getSource();if(t.getId().indexOf("idResponsavel")!==-1){const e="/v2_help_user";const t=this.getView().getModel("i18n").getResourceBundle().getText("taskSelectUser");const o=["email","user","name"];const l=[{label:"Nome",template:"name",width:"35%"},{label:"E-mail",template:"email",width:"35%"},{label:"Usuário",template:"user",width:"30%"}];this.getView().getModel("columnsSearchHelp").setProperty("/cols",l);this.onValueHelpRequested(e,"columnsSearchHelp",t,o,this.onSHPressUserResp.bind(this),false);return}},onSHPressUserResp:function(e){if(!this._folderView)this._folderView=this.getRootView("votorantim.corp.clocov2planmanagement.view.Folder");const t=this._oValueHelpDialog.getTable();const o=t.getSelectedIndex();const l=t.getContextByIndex(o).getObject();const i=this._folderView.getBindingContext().getPath();this._folderView.getModel().setProperty(i+"/Responsavel",l.user);this.onDataChanged();this._oValueHelpDialog.close()},showCalendarSearchHelp:function(e){const t=e.getSource();if(t.getId().indexOf("btnCalendarFolder")!==-1){const e="/v2_help_calendariosfabrica";const t=this.getView().getModel("i18n").getResourceBundle().getText("folderFactoryCal");const o=["Texto","IDCalendFabrica"];const l=[{label:"ID",template:"IDCalendFabrica",width:"40%"},{label:"Calendário",template:"Texto",width:"60%"}];this.getView().getModel("columnsSearchHelp").setProperty("/cols",l);this.onValueHelpRequested(e,"columnsSearchHelp",t,o,this.onSHPressCalendarFolder.bind(this),false);return}},onSHPressCalendarFolder:function(e){if(!this._folderView)this._folderView=this.getRootView("votorantim.corp.clocov2planmanagement.view.Folder");const t=this._oValueHelpDialog.getTable();const o=t.getSelectedIndex();const l=t.getContextByIndex(o).getObject();const i=this._folderView.getBindingContext().getPath();this._folderView.getModel().setProperty(i+"/CalendarioFabrica",l.IDCalendFabrica);this.onDataChanged();this._oValueHelpDialog.close()}})});