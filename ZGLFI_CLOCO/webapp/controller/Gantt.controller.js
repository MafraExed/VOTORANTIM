sap.ui.define(["FechamentoContabil/controller/BaseController","sap/ui/model/json/JSONModel","sap/m/MessageToast"],function(e,t,a){"use strict";var i;var n;var r;var o;var A;var I;return e.extend("FechamentoContabil.controller.Gantt",{onInit:function(){this.attachPatternMatched("ganttView")},incluirItem:function(e,t,a,i){var n=new sap.ui.core.Item;n.setKey(t);n.setText(a);if(i)e.insertItem(n,0);else e.addItem(n)},onConfigHierarquia:function(e){var t=this.getView().byId("idMenuHierarquia");t.toggleStyleClass("menu__hierarquia__inativo")},updateGantt:function(e,t){e.inicializaGantt(t.ToHierarquiaGantt)},expandTree:function(e){var t=this.getView().byId("ganttView");t.expandToLevel(9)},inicializaGantt:function(e,a){var i=e["results"];var n;var r=this.getView().byId("ganttView");n=this.montaHierarquiaGantt(i);var o={root:{id:"root",level:"root",results:n}};var A=new t;var I=JSON.stringify(o);A.setJSON(I);var s=this.getView().byId("ganttView").getModel("gantt");if(s!==undefined){s.oData.root=A.oData.root;s.refresh(true)}else{r.bindAggregation("rows",{path:"gantt>/root",parameters:{arrayNames:["results"]}});r.expandToLevel(3);r.setFixedColumnCount(1);this.getView().byId("ganttView").setModel(A,"gantt");return A}},inicializaTree:function(e,a){var i=a["results"];var n;n=e.montaHierarquiaGantt(i);var r=new t;var o=JSON.stringify(n);r.setJSON(o);e.getView().setModel(r,"tree");var A=this.byId("TreeTableBasic");A.expandToLevel(3)},montaHierarquiaGantt:function(e){var t=[];var a=[];var i=function(e){var t={id:e.NO,level:"1",plan:{startTime:e.DATA_INICIO_PLAN+e.HORA_INICIO_PLAN,endTime:e.DATA_FIM_PLAN+e.HORA_FIM_PLAN},totalPlan:{startTime:"",endTime:""},NO:e.NO,MODELO:e.MODELO,INSTANCE:e.INSTANCE,HIERARQUIA:e.HIERARQUIA,DESC_NO:e.DESC_NO,NO_PAI:e.NO_PAI,NO_ATIVIDADE:e.NO_ATIVIDADE,STATUS:e.STATUS,RESP:e.RESP,RESP_EXEC:e.RESP_EXEC,DATA_INICIO_PLAN:e.DATA_INICIO_PLAN,HORA_INICIO_PLAN:e.HORA_INICIO_PLAN,DATA_FIM_PLAN:e.DATA_FIM_PLAN,HORA_FIM_PLAN:e.HORA_FIM_PLAN,DURACAO_PLAN:e.DURACAO_PLAN,DURACAO:e.DURACAO,DATA_INICIO:e.DATA_INICIO,HORA_INICIO:e.HORA_INICIO,DATA_FIM:e.DATA_FIM,HORA_FIM:e.HORA_FIM,TPTAREFA:e.TPTAREFA,DESC_TAREFA:e.DESC_TAREFA,CONTEM_ANEXO:e.CONTEM_ANEXO,CRITICO:e.CRITICO,ICON_STATUS:e.ICON_STATUS,COLOR_STATUS:e.COLOR_STATUS,EMPRESA:e.EMPRESA,results:[]};return t};var n=function(e,t,r,o){for(var A=0;A<t.length;A++){if(e.NO===t[A].NO_PAI){if(e.NO!=="000000000000"||t[A].NO!=="000000000000"){var I=i(t[A]);a.push(t[A].NO);r.results.push(I);if(t[A].DATA_INICIO_PLAN!=="")if(o["minPlan"]>t[A].DATA_INICIO_PLAN+t[A].HORA_INICIO_PLAN)o["minPlan"]=t[A].DATA_INICIO_PLAN+t[A].HORA_INICIO_PLAN;if(o["maxPlan"]<t[A].DATA_FIM_PLAN+t[A].HORA_FIM_PLAN)o["maxPlan"]=t[A].DATA_FIM_PLAN+t[A].HORA_FIM_PLAN;o=n(t[A],t,I,o)}}}if(o["maxPlan"]!==""&&r.NO_ATIVIDADE===""){r.totalPlan.startTime=o["minPlan"];r.totalPlan.endTime=o["maxPlan"];o["minPlan"]="99999999999999";o["maxPlan"]=""}else{delete r.totalPlan}return o};for(var r=0;r<e.length;r++){if(a.indexOf(e[r].NO)===-1){var o=[];o["minPlan"]="99999999999999";o["maxPlan"]="";var A=i(e[r]);n(e[r],e,A,o);t.push(A)}}return t},onPressAtividades:function(){var e=sap.ui.core.UIComponent.getRouterFor(this);e.navTo("Atividades")},addBrowserEvents:function(){var e=["idOk","idAviso","idProc","idErro"];var t;var a;var i=this;e.forEach(function(e){a=i.byId(e);a.attachBrowserEvent("mouseover",function(){var t=i.getView().byId("idTextStatus");if(e==="idOk"){t.setText("Concluído sem erros");t.getDomRef().style.color="#46af4f"}if(e==="idProc"){t.setText("Em processamento");t.getDomRef().style.color="#bfbfbf"}if(e==="idAviso"){t.setText("Concluído com avisos");t.getDomRef().style.color="#d2e23f"}if(e==="idErro"){t.setText("Concluído com erros");t.getDomRef().style.color="#e2753f"}});a.attachBrowserEvent("mouseout",function(){var e=i.getView().byId("idTextStatus");e.setText("")})})}})});