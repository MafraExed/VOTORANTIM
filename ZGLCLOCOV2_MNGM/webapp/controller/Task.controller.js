sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel","../model/formatter","sap/m/library","sap/ui/core/Fragment","sap/m/Link","sap/m/MessageToast","sap/m/Token","sap/m/MessageBox"],function(e,t,s,i,a,o,n,r,g){"use strict";return e.extend("votorantim.corp.clocov2planmanagement.controller.Task",{formatter:s,onInit:function(){this.createModel({hasChanges:false,dependentDialog:{display:"tree"},suggestMassChanges:false},"taskView");this.createModel({lembreteEmails:[],AtividadeNaoInicEmails:[],AtividadeNaoEncEmails:[],AtividadeDispEmails:[],AtividadeRepEmails:[],AtividadeFinEmails:[]},"alertEmails");this.createModel({data:[]},"tarefas_pred");this.createModel({data:[]},"tarefas_suc");this.createModel({cols:[]},"columnsSearchHelp");this.createModel({},"notificacao");this.createModel({},"suggestMassDep");this.getRouter().getRoute("task").attachPatternMatched(this._onObjectMatched,this);this.getRouter().getRoute("taskTable").attachPatternMatched(this._onObjectMatched,this)},mountBreadcumb:function(){const e=this.getView("task").getBindingContext().getProperty("Caminho");const t=e.split("/");const s=this.byId("idBreadcumb");s.destroyLinks();for(const e of t){const t=new o({text:e,enabled:false});s.addLink(t)}},getTaskDetailViewId:function(){const e=this.byId("ObjectPageTask").getSections();const t=e[0].getSubSections();const s=t[0].getBlocks();return s[0].getSelectedView()},getTaskAlertViewId:function(){const e=this.byId("ObjectPageTask").getSections();const t=e[3].getSubSections();const s=t[0].getBlocks();return s[0].getSelectedView()},getTaskWorkflowViewId:function(){const e=this.byId("ObjectPageTask").getSections();const t=e[4].getSubSections();const s=t[0].getBlocks();return s[0].getSelectedView()},validateWorkflowFields:function(){const e=this.getTaskWorkflowViewId();const t=sap.ui.getCore().byId(e).byId("gridList");const s=sap.ui.getCore().byId(e).byId("idSwitchApproval");if(s.getState())if(t.getAggregation("items").length===0){g.error("É necessário selecionar ao menos um aprovador");return true}return false},validateAlertFields:function(){const e=this.getTaskAlertViewId();const t=this.getView().getModel().getProperty(this.getView().getBindingContext().getPath()+"/to_notificacao");const s=sap.ui.getCore().byId(e).byId("idMultiEmailLembrete");const i=sap.ui.getCore().byId(e).byId("idMultiEmailatividadeNaoInic");const a=sap.ui.getCore().byId(e).byId("idMultiEmailAtividadeNaoEnc");const o=sap.ui.getCore().byId(e).byId("idMultiEmailAtividadeDisp");const n=sap.ui.getCore().byId(e).byId("idMultiEmailAtividadeReoroc");const r=sap.ui.getCore().byId(e).byId("idMultiEmailAtividadeFin");let l;if(t.Lembrete){s.setValueState("None");for(const e of s.getTokens()){if(!l)l=e.getKey();else l=l+";"+e.getKey()}this.getView().getModel().setProperty(this.getView().getBindingContext().getPath()+"/to_notificacao/LembreteEmails",l);l=null}if(t.AtividadeNaoIniciada){i.setValueState("None");for(const e of i.getTokens()){if(!l)l=e.getKey();else l=l+";"+e.getKey()}this.getView().getModel().setProperty(this.getView().getBindingContext().getPath()+"/to_notificacao/AtividadeNaoInicEmails",l);l=null}if(t.AtividadeNaoEncerrada){a.setValueState("None");for(const e of a.getTokens()){if(!l)l=e.getKey();else l=l+";"+e.getKey()}this.getView().getModel().setProperty(this.getView().getBindingContext().getPath()+"/to_notificacao/AtividadeNaoEncEmails",l);l=null}if(t.AtividadeDisponivel){o.setValueState("None");const e=o.getTokens();if(e.length===0){o.setValueState("Error");g.error("É necessário incluir ao menos um e-mail para o Alerta de Tarefa Disponível");return true}for(const t of e){if(!l)l=t.getKey();else l=l+";"+t.getKey()}this.getView().getModel().setProperty(this.getView().getBindingContext().getPath()+"/to_notificacao/AtividadeDispEmails",l);l=null}if(t.AtividadeReprocessada){n.setValueState("None");const e=n.getTokens();if(e.length===0){n.setValueState("Error");g.error("É necessário incluir ao menos um e-mail para o Alerta de Tarefa Reprocessada");return true}for(const t of e){if(!l)l=t.getKey();else l=l+";"+t.getKey()}this.getView().getModel().setProperty(this.getView().getBindingContext().getPath()+"/to_notificacao/AtividadeRepEmails",l);l=null}if(t.AtividadeFinalizada){r.setValueState("None");const e=r.getTokens();if(e.length===0){r.setValueState("Error");g.error("É necessário incluir ao menos um e-mail para o Alerta de Tarefa Finalizada");return true}for(const t of e){if(!l)l=t.getKey();else l=l+";"+t.getKey()}this.getView().getModel().setProperty(this.getView().getBindingContext().getPath()+"/to_notificacao/AtividadeFinEmails",l);l=null}const d=this.getView().getBindingContext().getObject();this.getView().getModel().setProperty(this.getView().getBindingContext().getPath()+"/to_notificacao/Profile",d.Profile);this.getView().getModel().setProperty(this.getView().getBindingContext().getPath()+"/to_notificacao/Instance",d.Instance);this.getView().getModel().setProperty(this.getView().getBindingContext().getPath()+"/to_notificacao/Item",d.NodeID);return false},onPressSaveTask:function(e,t){if(t){this._suggestChangeMassDep.then(function(e){e.setBusy(true);e.setBusyIndicatorDelay(0)})}const s=["idCompanyTask","taskDetailDesc","idBtnRespExec","taskDetailPlanDias","taskDetailPlanHoras","taskDetailPlanDuracHoras"];const i=this.getTaskDetailViewId();if(sap.ui.getCore().byId(i).byId("taskDetailType").getSelectedKey()==="0"){s.push("jobTaskDetail");s.push("varTaskDetail");sap.ui.getCore().byId(i).byId("tcodeTaskDetail").setValue("")}if(sap.ui.getCore().byId(i).byId("taskDetailType").getSelectedKey()==="2"){s.push("tcodeTaskDetail");sap.ui.getCore().byId(i).byId("jobTaskDetail").setValue("");sap.ui.getCore().byId(i).byId("varTaskDetail").setValue("")}if(sap.ui.getCore().byId(i).byId("taskDetailType").getSelectedKey()==="3"){sap.ui.getCore().byId(i).byId("tcodeTaskDetail").setValue("");sap.ui.getCore().byId(i).byId("jobTaskDetail").setValue("");sap.ui.getCore().byId(i).byId("varTaskDetail").setValue("")}if(this.validateInputFields(s,sap.ui.getCore().byId(i)))return;if(this.validateWorkflowFields())return;if(this.validateAlertFields())return;this.validateInputSAP(["idCompanyTask#companies","idBtnRespExec#user","idBtnResp#user","jobTaskDetail#program","tcodeTaskDetail#tcode","varTaskDetail#variant"],sap.ui.getCore().byId(i),"jobTaskDetail").then(e=>{if(e)return;this.getView().setBusy(true);this.getModel().submitChanges({success:function(e){this.getView().setBusy(false);n.show(this.getView().getModel("i18n").getResourceBundle().getText("appDataSaved"));this.byId("ObjectPageTask").setShowFooter(false);this.getView().getModel("taskView").setProperty("/hasChanges",false);this.getView().getModel("taskView").setProperty("/suggestMassChanges",false);if(this._getRouteName()==="taskTable")this.updateDetailView("table");else this.updateDetailView("tree");if(t){this.applySuggestMassDep();this.getView().getModel().refresh(true,true)}}.bind(this)})})},updateDetailView:function(e){const t=this.getView().getBindingContext().getObject();const s=this.getView().getModel(e).getProperty("/selectedTask");for(const e in t){if(s.hasOwnProperty(e)){s[e]=t[e]}}s.Description=t.DescTarefa;s.User_respons=t.Resp;s.User_respons_exec=t.RespExec;s.Kind=t.TipoTarefa;s.Programa=t.NomePrograma;s.Variante=t.VariantePrograma;this.getView().getModel(e).setProperty("/selectedTask",s)},datachanged:function(){if(!this.getView().getModel("taskView").getProperty("/hasChanges")){this.byId("ObjectPageTask").setShowFooter(true);this.getView().getModel("taskView").setProperty("/hasChanges",true)}},_onObjectMatched:function(e){this.getView().byId("ObjectPageTask").setSelectedSection(null);this.getModel("appView").setProperty("/layout","TwoColumnsBeginExpanded");let t=e.getParameter("arguments");let s=`/v2_tarefas(Profile='${t.profile}',Instance=${t.instance},NodeID='${t.item}')`;this._profile=t.profile;this._instance=t.instance;this._item=t.item;this._route=e.getSource().getPattern();this._bindView(s)},_bindView:function(e){this.getView().bindElement({path:e,parameters:{expand:"to_tarefas_pred,to_tarefas_suc,to_notificacao,toDependentes"},events:{change:this._onBindingChange.bind(this),dataRequested:function(){this.getView().setBusy(true)}.bind(this),dataReceived:function(e){if(!e.getParameter("data").Profile)this.goToDetail()}.bind(this)}})},goToDetail:function(){let e;if(this._route.indexOf("tree")!==-1)e="detail";else e="detailTable";this.getRouter().navTo(e,{profile:this._profile,instance:this._instance},true)},_onBindingChange:function(){var e=this.getView(),t=e.getElementBinding();if(!t.getBoundContext()){this.goToDetail();return}this.getTarefasPred();this.getTarefasSuc();this.mountBreadcumb();this.getView().setBusy(false)},getEmailTokens:function(e){},getTarefasPred:function(){const e=this.getView("task").getBindingContext().getProperty("to_tarefas_pred");const t=this.getView().getModel("tarefas_pred").getProperty("/data");t.splice(0,t.length);for(const s of e){const e=this.getView().getModel().getProperty("/"+s);t.push(e)}this.getView().getModel("tarefas_pred").refresh()},getTarefasSuc:function(){const e=this.getView("task").getBindingContext().getProperty("to_tarefas_suc");const t=this.getView().getModel("tarefas_suc").getProperty("/data");t.splice(0,t.length);for(const s of e){const e=this.getView().getModel().getProperty("/"+s);t.push(e)}this.getView().getModel("tarefas_suc").refresh()},onCloseDetailPress:function(){this.getModel("appView").setProperty("/actionButtonsInfo/endColumn/fullScreen",false);this.getModel("appView").setProperty("/layout","OneColumn");this.getRouter().navTo("object",{objectId:"01"})},onPressSuggestMassChanges:function(){const e=this.getView().getBindingContext().getObject();if(e.Empresa===""){g.error("Campo Empresa é obrigatório");return}sap.ui.core.BusyIndicator.show();const t=(e,t)=>{const s=e.indexOf(t)+t.length+2;const i=s+12;return e.substring(s,i)};const s=this.getView().getModel().mDeferredRequests;const i=s.changeDep?.changes.undefined;if(!i)return;const o={useBatch:true,defaultUpdateMethod:"GET",groupId:"getSuggestMassDep"};const n=new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/",o);const r={};r.groupId=o.groupId;r.urlParameters={$expand:"toSugestaoMassaDep"};n.setDeferredGroups([o.groupId]);for(const e of i){let s;let i;if(e.request.method==="DELETE"){s=t(e.request.requestUri,"NodeID");i=t(e.request.requestUri,"Item_prev")}else{s=e.request.data.NodeID;i=e.request.data.Item_prev}n.read("/"+`v2_sugestao_massa_deps(Profile='${this._profile}',Instance=${this._instance},Empresa='',NodeID='${s}',Item_prev='${i}',Method='${e.request.method}')`,r)}n.submitChanges({groupId:r.groupId,success:function(e){const t=[];const s=[];for(const s of e.__batchResponses){t.push(...s.data.toSugestaoMassaDep.results)}for(const e of t){const t=s.map(e=>e.Empresa).indexOf(e.Empresa);if(t!==-1){if(s[t].Status===false){if(e.Profile!=="")s[t].Status=true}}else{let t={Empresa:e.Empresa,Apply:false};if(e.Profile!=="")t.Status=true;else t.Status=false;s.push(t)}}s.sort((e,t)=>e.Empresa-t.Empresa);const i=`<h5>Abaixo você encontra a lista de empresas e o status que indica a possibilidade de replicar as mesmas alterações de Dependências que acabou de realizar.</h5>`;this.getView().getModel("suggestMassDep").setProperty("/",{title:i,changes:t,compatibleCompanies:[...s],selectAll:false,hasSelectedItems:false});if(!this._suggestChangeMassDep){this._suggestChangeMassDep=a.load({id:this.getView().getId(),name:"votorantim.corp.clocov2planmanagement.fragments.DependentMassSuggestions",controller:this}).then(function(e){this.getView().addDependent(e);if(s.length===0)this.byId("buttonApplySuggestMass").setEnabled(false);return e}.bind(this))}sap.ui.core.BusyIndicator.hide();this._suggestChangeMassDep.then(function(e){e.open()}.bind(this))}.bind(this)})},closeSuggestMassDep:function(){if(this._suggestChangeMassDep){this._suggestChangeMassDep.then(function(e){e.close();e.close();e.destroy()});this._suggestChangeMassDep=undefined}},slectAllSuggest:function(){const e=this.getView().getModel("suggestMassDep").getProperty("/selectAll");const t=this.getView().getModel("suggestMassDep").getProperty("/compatibleCompanies");if(e){for(const e of t){if(e.Status)e.Apply=true}}else{for(const e of t){if(e.main)continue;e.Apply=false}}this.getView().getModel("suggestMassDep").setProperty("/compatibleCompanies",t);this.onSelectSuggestChange()},applySuggestMassDep:function(){this.closeSuggestMassDep();const e=this.getView().getModel("suggestMassDep").getProperty("/");const t={useBatch:true,defaultUpdateMethod:"PUT",groupId:"changeDepSuggestMass"};const s=new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/",t);const i={};i.groupId=t.groupId;s.setDeferredGroups([t.groupId]);const a=e.compatibleCompanies.filter(e=>e.Apply&&!e.main);const o=e.changes.filter(e=>a.map(e=>e.Empresa).indexOf(e.Empresa)!==-1&&e.NodeID!=="");let r;let g=0;r=o.length;this.setProgress(0);this.displayDialogProgress();const l=e=>{let t=0;for(let a=e;a<o.length;a++){const e=o[a];if(e.Method==="POST"){const t=this.newTaskBody(e,{NodeID:e.Item_prev});s.createEntry("/v2_dependentes",{properties:t,groupId:i.groupId})}if(e.Method==="DELETE"){const t=`/v2_dependentes(Profile='${e.Profile}',Instance=${e.Instance},NodeID='${e.NodeID}',Item_prev='${e.Item_prev}')`;s.remove(t,{groupId:i.groupId})}t++;g++;if(t===this.massBatchSize||g===r){this.submitChangesSync(s,"changeDepSuggestMass").then(()=>{this.setProgress(g/r*100);if(g!==r)l(g);else{n.show(this.getView().getModel("i18n").getResourceBundle().getText("appDataSaved"));this.closeDialogProgress()}});return}}};l(g)},onSelectSuggestChange:function(){const e=this.getView().getModel("suggestMassDep").getProperty("/");const t=e.compatibleCompanies.filter(e=>e.Apply&&!e.main);let s=false;if(t.length>0)s=true;this.getView().getModel("suggestMassDep").setProperty("/hasSelectedItems",s)},toggleFullScreen:function(){var e=this.getModel("appView").getProperty("/actionButtonsInfo/endColumn/fullScreen");this.getModel("appView").setProperty("/actionButtonsInfo/endColumn/fullScreen",!e);if(!e){this.getModel("appView").setProperty("/previousLayout",this.getModel("appView").getProperty("/layout"));this.getModel("appView").setProperty("/layout","MidColumnFullScreen")}else{this.getModel("appView").setProperty("/layout",this.getModel("appView").getProperty("/previousLayout"))}}})});