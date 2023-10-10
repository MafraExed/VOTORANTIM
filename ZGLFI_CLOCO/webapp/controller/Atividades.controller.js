sap.ui.define(["FechamentoContabil/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/core/util/Export","sap/ui/core/util/ExportTypeCSV","sap/ui/core/Fragment","sap/m/GroupHeaderListItem","sap/m/MessageBox","sap/ui/model/Filter","sap/ui/model/FilterOperator","../model/formatter"],function(e,t,s,i,a,o,n,r,l,d){"use strict";var g;var c;var p;var h;var u;return e.extend("FechamentoContabil.controller.Atividades",{onInit:function(){this.attachPatternMatched("Atividades");this.attachPatternMatched("AtividadesSelecionadas");this.attachPatternMatched("AtividadesAtrasadas");this.attachPatternMatched("AtividadesMobile");this.createModel({preSelectedTasks:false,taskDetails:{}},"preSelectedTasks");this.createModel({type:"email"},"shareTask");this.createModel({motivos:[],motivoSelecionado:""},"motivosAtraso");this.createModel({progress:0,atividadeAtrasada:false,selectedTaskStatus:"",levelsRejected:[],levelsApproved:[],popupTarefasAtrasadas:[]},"viewAtividades");this.getView().byId("containerKeys").attachBrowserEvent("click",this.onPressKeys,this);this.getUserInfo(e=>this._userInfo=e)},onSaveVariantFilter:function(e){const t=e.getParameter("name");const s=a.byId(this.getView().getId(),"filterbar_atividades");const i=s.getModel();const o=i.getData();var n=[new sap.ui.comp.variants.VariantItem({key:"item1",text:"Item 1"}),new sap.ui.comp.variants.VariantItem({key:"item2",text:"Item 2"})];e.getSource().addVariantItem(new sap.ui.comp.variants.VariantItem({key:"item1",text:"Item 1"}))},onSelectVariantFilter:function(e){const t=a.byId(this.getView().getId(),"filterbar_atividades");const s=t.getModel();const i=e.getParameter("key");const o=e.getSource().getVariant(i);if(o){const e=o.filterData;s.setData(e)}},formatter:d,expandDadosIniciaisAtividades:"ToPlanos,ToPlanoSelecionado,ToPeriodos,ToHierarquiaPastas,ToTarefas",onPressKeys:function(){this.openFilterAtividades()},onCompanyHelp:function(e){const t=a.byId(this.getView().getId(),"fCompany");const s={cols:[{label:"Empresa",template:"CompanyCode",width:"10rem"}]};this.createModel(s,"CompanyColumns");const i=this.getModel("CompanyColumns");this._oValueHelpDialogCompany=sap.ui.xmlfragment("FechamentoContabil.view.fragments.companyValueHelp",this);this.getView().addDependent(this._oValueHelpDialogCompany);this._oValueHelpDialogCompany.setBusy(true);this._oValueHelpDialogCompany.getTableAsync().then(function(e){e.setModel(this.getModel());e.setModel(i,"columns");const t=this.getKeyFilter();if(e.bindRows){e.bindAggregation("rows",{path:`/v2_empresas`,events:{dataReceived:function(){this._oValueHelpDialogCompany.setBusy(false)}.bind(this)},filters:t})}if(e.bindItems){e.bindAggregation("items",{path:`/v2_empresas`,filters:t},function(){return new ColumnListItem({cells:s.cols.map(function(e){return new sap.m.Label({text:"{"+e.template+"}"})})})})}this._oValueHelpDialogCompany.update()}.bind(this));this._oValueHelpDialogCompany.open()},checkSelectedPlan:function(e){if(this.getView().byId("idInputModelo").getItems().length>0){const e=this.getView().byId("idInputModelo").getSelectedKey();const t=this.getView().byId("idInputPeriodo").getSelectedKey().trim();a.byId(this.getView().getId(),"fProfile").setSelectedKey(e);const s=a.byId(this.getView().getId(),"fInstance");s.bindItems({path:`/v2_periodos(Profile='${e}',Instance=0)/toPeriodos`,events:{dataReceived:function(){s.setSelectedKey(t)}.bind(this)},template:new sap.ui.core.ListItem({text:{path:"Data_fixada",formatter:d.formatDate},key:"{Instance}",additionalText:"{Descricao}"})});s.setEnabled(true);a.byId(this.getView().getId(),"fCompany").setEnabled(true)}},onValueHelpCompanyOkPress:function(e){const t=a.byId(this.getView().getId(),"fCompany");const s=e.getParameter("tokens");t.removeAllTokens();t.setTokens(s);this._oValueHelpDialogCompany.close()},onValueHelpCompanyCancelPress:function(){this._oValueHelpDialogCompany.close()},onValueHelpCompanyAfterClose:function(){this._oValueHelpDialogCompany.destroy()},onFilterSelectProfile:function(){const e=a.byId(this.getView().getId(),"fProfile").getSelectedKey();const t=a.byId(this.getView().getId(),"fInstance");t.setValue("");const s=a.byId(this.getView().getId(),"fCompany");s.removeAllTokens();t.bindItems({path:`/v2_periodos(Profile='${e}',Instance=0)/toPeriodos`,template:new sap.ui.core.ListItem({text:{path:"Data_fixada",formatter:d.formatDate},key:"{Instance}",additionalText:"{Descricao}"})});t.setEnabled(true)},onFilterAtividades:function(){if(this.isMissingRequiredFilters()){n.error("Preencher todos os campos obrigatórios");return}const e=this.getAtividadesFilters();this.getSettings();this.getDadosECC("dadosIniciais",this.expandDadosIniciaisAtividades,null,null,e.aFilters);this.closeFilterAtividades()},isMissingRequiredFilters:function(){const e=["fProfile","fInstance"];for(const t of e){if(!a.byId(this.getView().getId(),t).getSelectedKey())return true}return false},getAtividadesFilters:function(){const e=new r([]);const t=a.byId(this.getView().getId(),"fProfile").getSelectedKey();const s=a.byId(this.getView().getId(),"fInstance").getSelectedKey();e.aFilters.push(this.createFilter("Profile",l.EQ,t));e.aFilters.push(this.createFilter("Instance",l.EQ,s));const i=a.byId(this.getView().getId(),"fCompany");const o=i.getTokens();if(o.length>0)for(const t of o){e.aFilters.push(this.createFilter("Company",l.EQ,t.getKey()))}i.setValue("");const n=a.byId(this.getView().getId(),"fResp").getValue();if(n)e.aFilters.push(this.createFilter("Resp",l.EQ,n));const d=a.byId(this.getView().getId(),"fRespExec").getValue();if(d)e.aFilters.push(this.createFilter("RespExec",l.EQ,d));const g=a.byId(this.getView().getId(),"fDepartamento").getValue();if(g)e.aFilters.push(this.createFilter("Departament",l.EQ,g));const c=a.byId(this.getView().getId(),"fCoe").getSelectedKey();if(c)if(c==="YES")e.aFilters.push(this.createFilter("Coe",l.EQ,true));else e.aFilters.push(this.createFilter("Coe",l.EQ,false));const p=a.byId(this.getView().getId(),"fDataPlanDe").getDateValue();const h=a.byId(this.getView().getId(),"fDataPlanAte").getDateValue();if(p||h)e.aFilters.push(this.createFilter("InicioPlan",l.BT,p,h));return e},addFilterFromTokens:function(e,t,s){const i=[];for(const a of s){i.push(this.createFilter(e,t,a.getKey()))}return i},createFilter:function(e,t,s,i){return{sPath:e,sOperator:t,oValue1:s,oValue2:i}},onFilterSelectPeriodo:function(){const e=a.byId(this.getView().getId(),"fCompany");const t=this.getKeyFilter();e.bindAggregation("suggestionItems",{path:`/v2_empresas`,filters:t,template:new sap.ui.core.Item({text:{path:"CompanyCode"},key:"{CompanyCode}"})});e.setEnabled(true)},getKeyFilter:function(){const e=a.byId(this.getView().getId(),"fProfile").getSelectedKey();const t=a.byId(this.getView().getId(),"fInstance").getSelectedKey();return new r({filters:[new r("Profile",l.EQ,e),new r("Instance",l.EQ,t)],and:true})},setDadosECCANTIGO:function(e,t){var s=this.getOwnerComponent().getModel();var i={};var a=this.getPlanoTarefaSelecionado(this);var o;var n=this;i.Profile=a[0];i.Instance=a[1];if(e==="setStatus"){i.Status=t.Status;o="/ETS_DADOS_ITEM(Profile='"+a[0].trim()+"',Instance='"+a[1].trim()+"',Item='"+t.Atividade.trim()+"')";i.Item=t.Atividade;i.Parametro=e;this.getView().setBusy(true)}s.update(o,i,{async:false,success:function(s,i){if(e==="setStatus"){n.updateStatus(t);n.getView().setBusy(false);sap.m.MessageToast.show("Status atualizado com sucesso")}},error:function(e){sap.m.MessageToast.show("ERRO");n.getView().setBusy(false)}})},onLinkEmMassaPress:function(){var e=this.getTableItemsAttachment();if(e.itens.length){this.loadItemsDialog(this,e,false,true)}},onLinkEmMassa:function(e){this._keysLinkEmMassa=e;this.openLinkListEmMassa()},onLinkCreateMultiple:function(e){try{var t=new URL(sap.ui.getCore().byId("inputUrlHyperlinkMultiple").getValue())}catch(e){n.error('A URL deve iniciar com "http://" ou "https://"');return}var s={Plano:this.getView().byId("idInputModelo").getSelectedItem().getText().trim(),Nome:sap.ui.getCore().byId("inputNomeHyperlinkMultiple").getValue(),Descricao:sap.ui.getCore().byId("inputDescHyperlinkMultiple").getValue(),Link:t.href};this.associaLinkEmMassa(s)},openLinkListEmMassa:function(e){if(!this._oDialogLinkListEmMassa){this._oDialogLinkListEmMassa=sap.ui.xmlfragment("FechamentoContabil.view.fragments.newHyperlinkMultiple",this);this.getView().addDependent(this._oDialogLinkListEmMassa);if(sap.ui.Device.system.phone){this._oDialogLinkListEmMassa.setContentWidth("100%")}}this._oDialogLinkListEmMassa.open()},onLinkEmMassaDialogClose:function(){if(this._oDialogLinkListEmMassa){this._oDialogLinkListEmMassa.close();this._oDialogLinkListEmMassa.destroy();this._oDialogLinkListEmMassa=undefined}},associaLinkEmMassa:function(e){let t;let s=0;this.getView().setBusy(true);const i={groupId:"updateLinkMass",defaultUpdateMethod:"PUT",useBatch:true};const a=new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/",i);a.setDeferredGroups([i.groupId]);t=this._keysLinkEmMassa.length;this.setProgress(0);this.displayDialogProgress();const o=n=>{let r=0;for(let l=n;l<this._keysLinkEmMassa.length;l++){const n=this._keysLinkEmMassa[l];const d={Plano:e.Plano,Tarefa:n.NoAtual,Nome:e.Nome,Descricao:e.Descricao,Link:e.Link};i.changeSetId=Math.floor(Math.random()*501)+Math.floor(Math.random()*501)+Math.floor(Math.random()*501);a.create(`/LinkTarefas`,d,i);r++;s++;if(r===this.massBatchSize||s===t){this.submitChangesSync(a,"updateLinkMass").then(()=>{this.setProgress(s/t*100);if(s!==t)o(s);else{this.closeDialogProgress();this.onLinkEmMassaDialogClose();this.getView().setBusy(false);sap.m.MessageToast.show("Link criado com sucesso para as atividades selecionadas")}});return}}};o(s)},onAnexoEmMassaPress:function(){var e=this.getTableItemsAttachment();if(e.itens.length){this.loadItemsDialog(this,e,true)}},openAnexoListEmMassa:function(e){if(!this._oDialogAnexoListEmMassa){this._oDialogAnexoListEmMassa=sap.ui.xmlfragment("FechamentoContabil.view.fragments.anexosEmMassa",this);this.getView().addDependent(this._oDialogAnexoListEmMassa);if(sap.ui.Device.system.phone){this._oDialogAnexoListEmMassa.setContentWidth("100%")}}this._oDialogAnexoListEmMassa.open()},getTableItemsAttachment:function(){var e=this;var t=this.getView().byId("idTableAtividades");var s=t.getBinding("rows").aIndices;var i=t.getBinding("rows").oList;var a=[];var o=[];let n=JSON.parse(JSON.stringify(i));s.forEach(function(t,s){var i=n[t];var r={NoAtual:i.NO_ATIVIDADE};i.DATA_INICIO_PLAN=e.getCellDate(i.DATA_INICIO_PLAN);i.HORA_INICIO_PLAN=e.getCellTime(i.HORA_INICIO_PLAN);i.DATA_FIM_PLAN=e.getCellDate(i.DATA_FIM_PLAN);i.HORA_FIM_PLAN=e.getCellTime(i.HORA_FIM_PLAN);i.DATA_INICIO=e.getCellDate(i.DATA_INICIO);i.HORA_INICIO=e.getCellTime(i.HORA_INICIO);i.DATA_FIM=e.getCellDate(i.DATA_FIM);i.HORA_FIM=e.getCellTime(i.HORA_FIM);a.push(i);o.push(r)});return{itens:a,keys:o}},onAnexoEmMassa:function(e){this._keysAnexoEmMassa=e;this.openAnexoListEmMassa()},onAnexarArquivoEmMassa:function(){var e=sap.ui.getCore().byId("fileUploaderAnexoEmMassa");if(e.getValue()===""){n.Error("Nenhum arquivo selecionado");return}const t=this.getView().getModel();const s=this.getView().byId("idInputModelo").getSelectedItem().getText();const i=this.getView().byId("idInputPeriodo").getSelectedItem().getKey();const a=`/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/ETS_MONITOR_GERAL(Modelo='${s.trim()}',Instance='${i.trim()}',Hierarquia='')/MonitorToFile`;e.removeAllHeaderParameters();const o=t.oHeaders;const r=o["x-csrf-token"];let l=new sap.ui.unified.FileUploaderParameter({name:"slug",value:e.getValue()});e.addHeaderParameter(l);l=new sap.ui.unified.FileUploaderParameter({name:"X-CSRF-Token",value:r});e.addHeaderParameter(l);e.setSendXHR(true);e.setUploadUrl(a);sap.ui.core.BusyIndicator.show();e.upload()},handleUploadCompleteAnexoEmMassa:function(e){const t=e.getParameter("responseRaw");const s=new DOMParser;const i=s.parseFromString(t,"text/xml");if(i.getElementsByTagName("error").length>0){sap.m.MessageBox.error(i.getElementsByTagName("message")[0].textContent);sap.ui.core.BusyIndicator.hide();return}let a=i.getElementsByTagName("id")[0].textContent.substring(i.getElementsByTagName("id")[0].textContent.indexOf("FileId='")+8);a=a.substring(0,a.indexOf("'"));this.associaArquivoEmMassa(a);var o=sap.ui.getCore().byId("fileUploaderAnexoEmMassa");o.setValue("");this.onAnexoEmMassaDialogClose()},associaArquivoEmMassa:function(e){let t;let s=0;const i=this.getView().byId("idInputModelo").getSelectedItem().getText();const a=this.getView().byId("idInputPeriodo").getSelectedItem().getKey();const o={groupId:"updateAnexoMass",defaultUpdateMethod:"PUT",useBatch:true};const n=new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/",o);n.setDeferredGroups([o.groupId]);t=this._keysAnexoEmMassa.length;this.setProgress(0);this.displayDialogProgress();const r=l=>{let d=0;for(let g=l;g<this._keysAnexoEmMassa.length;g++){const l=this._keysAnexoEmMassa[g];const c={Profile:i,Instance:a,Item:l.NoAtual,FileId:e};o.changeSetId=Math.floor(Math.random()*501)+Math.floor(Math.random()*501)+Math.floor(Math.random()*501);n.update(`/ETS_FILE(Profile='${i.trim()}',Instance='${a.trim()}',Item='${l.NoAtual}',FileId='${e}')`,c,o);d++;s++;if(d===this.massBatchSize||s===t){this.submitChangesSync(n,"updateAnexoMass").then(()=>{this.setProgress(s/t*100);if(s!==t)r(s);else{this.closeDialogProgress();this.onLinkEmMassaDialogClose();sap.ui.core.BusyIndicator.hide();this.getView().setBusy(false);sap.m.MessageToast.show("Arquivo anexado com sucesso")}});return}}};r(s);n.submitChanges({success:function(e,t){this.getView().setBusy(false);if(e.__batchResponses[0].response){const t=JSON.parse(e.__batchResponses[0].response.body);sap.m.MessageToast.show(t.error.message.value)}else{sap.m.MessageToast.show("Arquivo anexado com sucesso")}}.bind(this),error:function(e){sap.m.MessageToast.show("Erro ao anexar arquivo em massa");this.getView().setBusy(false)}.bind(this)})},openAnexoListEmMassa:function(e){if(!this._oDialogAnexoListEmMassa){this._oDialogAnexoListEmMassa=sap.ui.xmlfragment("FechamentoContabil.view.fragments.anexosEmMassa",this);this.getView().addDependent(this._oDialogAnexoListEmMassa);if(sap.ui.Device.system.phone){this._oDialogAnexoListEmMassa.setContentWidth("100%")}}this._oDialogAnexoListEmMassa.open()},onAnexoEmMassaDialogClose:function(){if(this._oDialogAnexoListEmMassa){this._oDialogAnexoListEmMassa.close();this._oDialogAnexoListEmMassa.destroy();this._oDialogAnexoListEmMassa=undefined}},respostaECCANTIGO:function(e,t,s){switch(t){case"dadosIniciais":e.inicializaMonitor(e,s);break;case"inicializaDadosMonitor":e.setModelTree(e,s.MonitorToHierarquia);e.setList(s.MonitorToHierarquia);e.getDadosECC("inicializaTree");e.checkFilters();e.setDadosECC("setPersistenciaSelecao");break;case"inicializaTree":e.setModelTree(e,s.MonitorToHierarquia);e.setPathHierarquia();e.getView().setBusy(false);e.setKey();break;case"atualizaDadosMonitor":e.setList(s.MonitorToHierarquia);e.setPathHierarquia();e.setKey();e.checkFilters();e.getView().setBusy(false);e.setDadosECC("setPersistenciaSelecao");break;case"fileNames":e.setFilenames(e,s.MonitorToFilenames);e.getView().setBusy(false);break}this.closePopups()},setList:function(e){var t=[];e.results.forEach(function(e){if(e.NO_ATIVIDADE!==""){t.push({NO:e.NO,MODELO:e.MODELO,INSTANCE:e.INSTANCE,HIERARQUIA:e.HIERARQUIA,DESC_NO:e.DESC_NO,NO_PAI:e.NO_PAI,NO_ATIVIDADE:e.NO_ATIVIDADE,nome:e.DESC_TAREFA,status:e.STATUS,critico:e.CRITICO,tipoTarefa:e.TPTAREFA,respExec:e.RESP_EXEC,dataInicioPlan:e.DATA_INICIO_PLAN,horaInicioPlan:e.HORA_INICIO_PLAN,dataFimPlan:e.DATA_FIM_PLAN,horaFimPlan:e.HORA_FIM_PLAN,duracaoPlan:e.DURACAO_PLAN,dataInicio:e.DATA_INICIO,horaInicio:e.HORA_INICIO,dataFim:e.DATA_FIM,horaFim:e.HORA_FIM,duracao:e.DURACAO,responsavel:e.RESP,anexo:e.CONTEM_ANEXO,ICON_STATUS:e.ICON_STATUS,COLOR_STATUS:e.COLOR_STATUS,atividadeAtrasada:e.ATIVIDADE_ATRASADA,path:e.PATH});h=e.USUARIO_ATUAL}});var s=new sap.ui.model.json.JSONModel(t);this.getView().setModel(s,"list")},onConfigHierarquia:function(e){var t=this.getView().byId("idMenuHierarquia");t.toggleStyleClass("menu__hierarquia__inativo")},checkFilters:function(){var e=this.getView().byId("ColAtividadeAtrasada");var t=this.getView().byId("idColRespExec");var s=this.getView().byId("idAtivdAtrasadas");var i=this.getView().byId("idMinhasAtvds");var a=this.getView().byId("idTableAtividades");var o=this.getView().byId("idColFimPlanH");var n=this.getView().byId("idColFimPlanD");var r=this.getView().byId("idColCritico");if(!a.getBinding("rows"))return;if(s.getPressed()){e.filter("X");a.sort(r,sap.ui.table.SortOrder.Descending,false);a.sort(n,sap.ui.table.SortOrder.Ascending,true);a.sort(o,sap.ui.table.SortOrder.Ascending,true)}else{e.filter("");a.getBinding("rows").sort(null);var l=a.getColumns();for(var d=0;d<l.length;d++){l[d].setSorted(false)}}if(i.getPressed()){t.filter(this.getView().getModel("Tarefas").oData[0].USUARIO_ATUAL)}else t.filter("")},onChangeDate:function(e){var t=e.getSource();t.setValue(t.getTooltip())},onExportarExcel:function(e){const t=this.getView().byId("idInputModelo").getSelectedItem().getText();const s=parseInt(this.getView().byId("idInputPeriodo").getSelectedKey().trim());let i;if(window.location.href.indexOf("fioridev")!==-1)i=`https://fioridev.votorantim.com.br/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/RP_ITEMSet?$filter=Profile eq '${t}' and Instance eq ${s}&$format=xlsx`;if(window.location.href.indexOf("brsaolsvfid01")!==-1)i=`http://brsaolsvfid01.votorantim.grupo:8000/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/RP_ITEMSet?$filter=Profile eq '${t}' and Instance eq ${s}&$format=xlsx`;if(window.location.href.indexOf("fiori.")!==-1)i=`https://fiori.votorantim.com.br/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/RP_ITEMSet?$filter=Profile eq '${t}' and Instance eq ${s}&$format=xlsx`;if(!i)i=`http://brsaolsvfid01.votorantim.grupo:8000/sap/opu/odata/sap/ZGWGLFI_CLOCO_SRV/RP_ITEMSet?$filter=Profile eq '${t}' and Instance eq ${s}&$format=xlsx&saml2=disabled`;window.open(i).focus()},openSendTask:function(e){this.onPressFechaPopupOptions();a.load({id:this.getView().getId(),name:"FechamentoContabil.view.fragments.sendTask",controller:this}).then(function(e){a.byId(this.getView().getId(),"sendTaskInputEmail").addValidator(this.multiInputEmailValidator);a.byId(this.getView().getId(),"sendTaskInputEmail").attachBrowserEvent("keydown",this.updateEmailSuggestions,this);this.getView().getModel("shareTask").setProperty("/text",`Olá,\n\nEstou compartilhando com você a atividade ${this._descAtividadeAtual}`);this.getView().getModel("shareTask").setProperty("/type","teams");this.getView().getModel("shareTask").setProperty("/subject","");this._oDialogSendTask=e;e.setBusy(true);e.setBusyIndicatorDelay(0);this.getView().addDependent(e);this.initRichTextEditor(false,e);e.open()}.bind(this))},onSendTaskDialogClose:function(){if(this._oDialogSendTask){this._oDialogSendTask.close();this._oDialogSendTask.destroy();this._oDialogSendTask=undefined}},initRichTextEditor:function(e,t){const s=this.getView().byId("idInputModelo").getSelectedItem().getText().trim();const i=this.getView().byId("idInputPeriodo").getSelectedKey();const o=`${window.location.href.substring(0,window.location.href.indexOf("/atv"))}/tasks/${s}/${i.trim()}/${this._noAtual}`;var n=this,r=`<div style="max-height: 390px; overflow-y: auto; width: fit-content;">\n        <table\n            style="margin-left: 5px; margin-top: -1px; border-collapse: collapse; background-color: #EEEEEE; position: relative;">\n            <thead style="background-color: #1C6EA4; color: white; text-align: left; position: sticky; top: -1px;">\n                <tr>\n                    <th style="border: 1px solid #ddd;padding-left: 10px;padding-right: 10px;">Tarefa</th>\n                    <th style="border: 1px solid #ddd;padding-left: 10px;padding-right: 10px;">Responsável pela Execução</th>\n                    <th style="border: 1px solid #ddd;padding-left: 10px;padding-right: 10px;text-align: center;">Empresa</th>\n                    <th style="border: 1px solid #ddd;padding-left: 10px;padding-right: 10px;">Status</th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr>\n                    <td style="border: 1px solid #ddd;padding-left: 10px;padding-right: 10px;"><a href="${o}">${this._descAtividadeAtual}</a></td>\n                    <td style="border: 1px solid #ddd;padding-left: 10px;padding-right: 10px;">${this._respExecAtual}</td>\n                    <td style="border: 1px solid #ddd;padding-left: 10px;padding-right: 10px;text-align: center;">${this._empresaAtual}</td>\n                    <td style="border: 1px solid #ddd;padding-left: 10px;padding-right: 10px;">${this._statusAtual}</td>\n                </tr>\n            </tbody>\n        </table>\n    </div>`;sap.ui.require(["sap/ui/richtexteditor/RichTextEditor","sap/ui/richtexteditor/library"],function(s,i){var o=i.EditorType;n.oRichTextEditor=new s("myRTE",{editorType:e?o.TinyMCE5:o.TinyMCE4,width:"100%",height:"100%",editable:false,customToolbar:false,showGroupFont:false,showGroupLink:false,showGroupInsert:false,showGroupClipboard:false,showGroupFontStyle:false,showGroupStructure:false,showGroupTextAlign:false,ready:function(){this.setValue(r);t.setBusy(false)}});a.byId(this.getView().getId(),"sendtaskRickTextContainer").addItem(n.oRichTextEditor)}.bind(this))},onPressRemoveFilters:function(){this.byId("btnShowOtherTasks").setVisible(false);this.openFilterAtividades()},onSendTaskDialog:function(){const e=this.getView().getModel("shareTask").getProperty("/");if(e.type==="teams"&&e.text.length>500){sap.m.MessageBox.error(`Permitido no máximo 500 caracteres para compartilhamento via Teams (quantidade de carateres - ${e.text.length})`);return}if(!this.getTokensEmailValues("sendTaskInputEmail")){sap.m.MessageBox.error('Campo "E-mails" é obrigatório');return}if(e.type!=="teams"){if(!e.subject||e.subject.trim()===""){sap.m.MessageBox.error('Campo "Assunto" é obrigatório');return}}const t={Type:e.type,Recipients:this.getTokensEmailValues("sendTaskInputEmail"),Subject:e.subject||"",Text:`${e.text}<br><br>${this.oRichTextEditor.getValue()}`};if(this.getView().getModel("shareTask").getProperty("/type")==="teams")t.Text=t.Text+"<p>Atenção! Mensagem automática. Favor não responder.</p>";this._oDialogSendTask.setBusy(true);this.getView().getModel().callFunction("/share_task",{method:"POST",urlParameters:t,success:function(e,t){this._oDialogSendTask.setBusy(false);this.onSendTaskDialogClose();sap.m.MessageBox.success("Tarefa enviada")}.bind(this),error:function(e){this._oDialogSendTask.setBusy(false);sap.m.MessageBox.error("Erro ao enviar tarefa")}.bind(this)})},getTokensEmailValues:function(e){let t;const s=this.getView().byId(e);const i=s.getTokens();for(const e of i){if(t)t+=";"+e.getText();else t=e.getText()}return t},onChangeShareText:function(e){const t=e.getSource();const s=e.getParameter("newValue");const i=s.replace(/\r\n/g,"\n").split("\n");if(i.length>8){t.setValue(t.getLastValue());return}t.setValue(s)},onPressApprovals:function(e){this.onPressFechaPopupOptions();this.getWorkflowData();let t=false;if(this._statusAtual==="Em Aprovação")t=true;this.getModel("viewAtividades").setProperty("/selectedTaskStatus",t);a.load({id:this.getView().getId(),name:"FechamentoContabil.view.fragments.Approvals",controller:this}).then(function(e){this._oDialogApprovals=e;this.getView().addDependent(this._oDialogApprovals);e.setBusy(true);e.setBusyIndicatorDelay(0);e.open()}.bind(this))},onApprovalskDialogClose:function(){if(this._oDialogApprovals){this._oDialogApprovals.close();this._oDialogApprovals.destroy();this._oDialogApprovals=undefined}},getWorkflowData:function(){const e=this.getView().byId("idInputModelo").getSelectedItem().getText().trim();const t=parseInt(this.getView().byId("idInputPeriodo").getSelectedKey());this.getModel().read(`/v2_workflow_status(Profile='${e}',Instance=${t},Item='${this._noAtual}',Level='',ApprovalDate='',ApprovalTime='')/toCurrentStatus`,{success:function(e,t){this.setlevelsRejectedApproved(t.data.results);this.createModel(t.data.results,"workflowStatus");this._oDialogApprovals.setBusy(false)}.bind(this)})},setlevelsRejectedApproved:function(e){const t=[];const s=[];for(const i of e){if(i.Status==="A")t.push(i.Level);if(i.Status==="R")s.push(i.Level)}this.getModel("viewAtividades").setProperty("/levelsApproved",t);this.getModel("viewAtividades").setProperty("/levelsRejected",s)},getGroupLevel:function(e){const t=this.getModel("viewAtividades").getProperty("/levelsApproved");const s=this.getModel("viewAtividades").getProperty("/levelsRejected");let i="Warning";let a="Pendente";if(t.indexOf(e.key)!==-1){i="Success";a="Aprovado"}if(s.indexOf(e.key)!==-1){i="Error";a="Rejeitado"}return new o({title:`Nível ${e.key}`,highlight:i,count:a,upperCase:false,selected:true})},checkLastStatusApproval:function(e,t){if(e==="R"){this.updateStatus({Status:e});return}if(e==="0"){const s=this.getModel("workflowStatus").getProperty("/");if(s[s.length-1].Level===t.Level)this.updateStatus({Status:e})}},approveRejectTask:function(e,t){const s=e.getSource().getBindingContext("workflowStatus").getObject();let i={};Object.assign(i,{Profile:s.Profile,Instance:this.getView().byId("idInputPeriodo").getSelectedKey().trim(),Item:s.Item,Level:s.Level,Status:"",Reason:s.Reason});const a=e=>{this._oDialogApprovals.setBusy(true);this.getView().getModel().callFunction("/approve_reject_task",{method:"POST",urlParameters:i,success:function(t,i){this._oDialogApprovals.setBusy(false);this.onApprovalskDialogClose();sap.m.MessageBox.success("Status alterado com sucesso");this.checkLastStatusApproval(e,s)}.bind(this),error:function(e){this._oDialogApprovals.setBusy(false);sap.m.MessageBox.error("Erro ao alterar status da tarefa")}.bind(this)})};if(t==="approve"){n.warning(`Tem certeza que deseja aprovar a tarefa "${this._descAtividadeAtual}"?`,{actions:[n.Action.OK,n.Action.CANCEL],emphasizedAction:n.Action.OK,onClose:function(e){if(e!==n.Action.OK)return;i.Status="A";a("0")}})}else{if(!this.oRejectDialog){this.oRejectDialog=new sap.m.Dialog({title:"Motivo da Rejeição",content:[new sap.m.Label({Text:"Motivo:",labelFor:"idInputReject"}),new sap.m.Input({id:"idInputReject",maxLength:128,value:"{workflowStatus>Reason}"})],beginButton:new sap.m.Button({type:"Emphasized",text:"Rejeitar",press:function(){const t=e.getSource().getBindingContext("workflowStatus").getObject();i.Status="R";i.Reason=t.Reason;a("R");this.oRejectDialog.close()}.bind(this)}),endButton:new sap.m.Button({text:"Cancelar",press:function(){this.oRejectDialog.close()}.bind(this)})}).addStyleClass("sapUiContentPadding");this.getView().addDependent(this.oRejectDialog)}this.oRejectDialog.setBindingContext(e.getSource().getBindingContext("workflowStatus"),"workflowStatus");this.oRejectDialog.open()}},onPressApprovalsHistory:function(){this.getWorkflowHistoryData();a.load({id:this.getView().getId(),name:"FechamentoContabil.view.fragments.ApprovalsHistory",controller:this}).then(function(e){this._oDialogApprovalsHistory=e;this.getView().addDependent(this._oDialogApprovalsHistory);e.setBusy(true);e.setBusyIndicatorDelay(0);e.open()}.bind(this))},onApprovalsHistorykDialogClose:function(){if(this._oDialogApprovalsHistory){this._oDialogApprovalsHistory.close();this._oDialogApprovalsHistory.destroy();this._oDialogApprovalsHistory=undefined}},getWorkflowHistoryData:function(){const e=[];const t=(e,t)=>new sap.ui.model.Filter(e,sap.ui.model.FilterOperator.EQ,t);e.push(t("Profile",this.getView().byId("idInputModelo").getSelectedItem().getText().trim()));e.push(t("Instance",parseInt(this.getView().byId("idInputPeriodo").getSelectedKey())));e.push(t("Item",this._noAtual));this.getModel().read(`/v2_workflow_status`,{filters:e,success:function(e,t){this.createModel(t.data.results,"workflowStatusHistory");this._oDialogApprovalsHistory.setBusy(false)}.bind(this)})},onShowDetailHistory:function(e){const t=e.getSource().getBindingContext("workflowStatusHistory");a.load({id:this.getView().getId(),name:"FechamentoContabil.view.fragments.ApprovalsHistoryDetail",controller:this}).then(function(e){e.setBindingContext(t,"workflowStatusHistory");this._oDialogApprovalsHistoryDetail=e;this.getView().addDependent(this._oDialogApprovalsHistoryDetail);e.open()}.bind(this))},onApprovalsHistoryDetailDialogClose:function(){if(this._oDialogApprovalsHistoryDetail){this._oDialogApprovalsHistoryDetail.close();this._oDialogApprovalsHistoryDetail.destroy();this._oDialogApprovalsHistoryDetail=undefined}},onPressTaskLogHistory:function(){this.getTaskLogHistoryData();a.load({id:this.getView().getId(),name:"FechamentoContabil.view.fragments.TaskLogHistory",controller:this}).then(function(e){this._oDialogTaskLogHistory=e;this.getView().addDependent(this._oDialogTaskLogHistory);e.setBusy(true);e.setBusyIndicatorDelay(0);e.open()}.bind(this))},onTaskLogHistorykDialogClose:function(){if(this._oDialogTaskLogHistory){this._oDialogTaskLogHistory.close();this._oDialogTaskLogHistory.destroy();this._oDialogTaskLogHistory=undefined}},getTaskLogHistoryData:function(){const e=[];const t=(e,t)=>new sap.ui.model.Filter(e,sap.ui.model.FilterOperator.EQ,t);e.push(t("Profile",this.getView().byId("idInputModelo").getSelectedItem().getText().trim()));e.push(t("Instance",parseInt(this.getView().byId("idInputPeriodo").getSelectedKey())));e.push(t("Item",this._noAtual));this.getModel().read(`/v2_historico_tarefas`,{filters:e,success:function(e,t){this.createModel(t.data.results,"taskLogHistory");this._oDialogTaskLogHistory.setBusy(false)}.bind(this)})},displayLongReason:function(e,t){if(!this._longReasonDialog){this._longReasonDialog=new sap.m.Dialog({title:"Justificativa",content:new sap.m.Text({text:t}),beginButton:new sap.m.Button({text:"Fechar",press:function(){this.onLongReasonDialogClose()}.bind(this)})}).addStyleClass("sapUiContentPadding");this.getView().addDependent(this._longReasonDialog)}this._longReasonDialog.open()},onLongReasonDialogClose:function(){if(this._longReasonDialog){this._longReasonDialog.close();this._longReasonDialog.destroy();this._longReasonDialog=undefined}},openLateTasksPopup:function(e){if(!this._oDialogLateTasksPopup){this._oDialogLateTasksPopup=sap.ui.xmlfragment("FechamentoContabil.view.fragments.LateTasks",this);this.getView().addDependent(this._oDialogLateTasksPopup);if(sap.ui.Device.system.phone){this._oDialogLateTasksPopup.setContentWidth("100%")}}this._oDialogLateTasksPopup.open()},onCloseDialogLateTasks:function(){if(this._oDialogLateTasksPopup){this._oDialogLateTasksPopup.close();this._oDialogLateTasksPopup.destroy();this._oDialogLateTasksPopup=undefined}}})});