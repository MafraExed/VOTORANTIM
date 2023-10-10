sap.ui.define(["Y5GL_EC_RECESSO/Y5GL_EC_RECESSO/controller/BaseController","sap/ui/model/json/JSONModel","Y5GL_EC_RECESSO/Y5GL_EC_RECESSO/model/formatter","sap/ui/Device","sap/m/Dialog","sap/m/Button","sap/m/Text","sap/ui/core/Fragment"],function(e,t,a,i,o,s,n,r){"use strict";var d,u,l,g,c,V,f,I,m,h,v;return e.extend("Y5GL_EC_RECESSO.Y5GL_EC_RECESSO.controller.Detail",{formatter:a,onInit:function(){var e=new t({busy:false,delay:0});this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched,this);this.setModel(e,"detailView");this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));var a=jQuery.sap.getModulePath("Y5GL_EC_RECESSO.Y5GL_EC_RECESSO");var i=a+"/imagens/Transparente_CBA.gif";this.getView().byId("idimg").setSrc(i)},_onObjectMatched:function(e){this.getView().byId("idPage").scrollTo(0,0);this.getView().getModel().refresh(true);var t=e.getParameter("arguments").Pernr;a=e.getParameter("arguments").Index;v=e.getParameter("arguments").Tipo;h=e.getParameter("arguments").Endda;f=e.getParameter("arguments").Begda;this.getModel("appView").setProperty("/layout","TwoColumnsMidExpanded");this.getModel().metadataLoaded().then(function(){var e=this.getModel().createKey("ZET_GLHR_PROGRAMARSet",{Pernr:t,Index:a,Endda:h,Begda:f});if(!e){}this._bindView("/"+e)}.bind(this))},_bindView:function(e){var t=this;var a=this.getView().getModel();t.loading(false);this.getView().bindElement({path:e,events:{change:this._onBindingChange.bind(this),dataRequested:function(){t.loading(true)},dataReceived:function(){t.loading(false)}}})},_onBindingChange:function(){var e=this.getView(),t=e.getElementBinding();if(!t.getBoundContext()){this.getRouter().getTargets().display("detailObjectNotFound");this.getOwnerComponent().oListSelector.clearMasterListSelection();return}this.getView().byId("IdInicio1").setValueState("None");this.getView().byId("first_diasgozo").setValueState("None");this.getView().byId("IdFim1").setValueState("None");this.getView().byId("IdInicio2").setValueState("None");this.getView().byId("secon_diasgozo").setValueState("None");this.getView().byId("IdFim2").setValueState("None")},_onMetadataLoaded:function(){var e=this.getView().getBusyIndicatorDelay(),t=this.getModel("detailView");t.setProperty("/delay",0);t.setProperty("/busy",true);t.setProperty("/delay",e)},FormatValue:function(e){if(e==="0"){return""}else{return e}},FormatChecked:function(e){if(e==="X"){return true}else{return false}},FormatStatus:function(e){if(e==="Status: Disponível"){return"Success"}if(e==="Status: Em programação"){return"Warning"}if(e==="Status: Em aprovação"){return"Warning"}if(e==="Status: Disponível"){return"Success"}if(e==="Em programação"){return"Warning"}if(e==="Status: Homologado"){return"Success"}if(e==="Homologado"){return"Success"}if(e==="Status: Em Aberto"){return"Success"}if(e==="Em Aberto"){return"Success"}if(e==="Status: Aprovado"){return"Success"}if(e==="Aprovado"){return"Success"}if(e==="Status: Em aprovação"){return"Warning"}if(e==="Em aprovação"){return"Warning"}return"Error"},FormatEditable:function(e){if(e==="Em aprovação"||e==="Em aberto"){return true}else{return false}},FormatCancel:function(e){if(e==="Status: Disponível"){return false}else{return true}},FormatVisiblePDF:function(e){switch(e){case"Aprovado":return true;break;case"Homologado":return true;break;default:return false}},onDownload:function(e){var t=e.getParameter("id");var a=t.split("detail--");var i=a[1];this.ChamaDownload(i)},ChamaDownload:function(e){var t="0";var a="0";var i="0";var o="99.9999";var s="0";var n="H";var r="0";var d;switch(e){case"Download1":d=this.getView().byId("IdInicio1").getValue();break;case"Download2":d=this.getView().byId("IdInicio2").getValue();break;case"Download3":d=this.getView().byId("IdInicio3").getValue();break}while(d.indexOf("-")!==-1){d=d.replace("-","")}var u="/sap/opu/odata/sap/ZGWGLRH_MEU_CADASTRO_SRV/ZET_GLHR_UPFILESet('"+t+"$"+a+"$"+i+"$"+o+"$"+s+"$"+n+"$"+r+"$"+d+"')/$value";var l=document.createElement("a");l.href=u;l.target="_blank";l.style.display="none";document.body.appendChild(l);l.click();document.body.removeChild(l)},onCancel:function(e,t,a){var i=this;var r=this.getView().byId("IdIndex").getValue();var d=this.getView().byId("IdPernr").getValue();var u="/ZET_GLHR_ESS_FERIASSet(Index="+r+",Pernr='"+d+"',Acao='C')";var l={};var g=0;var c=this.getView().getModel();e=true;t=true;a=true;if(e===true){l.Inicio1=this.getView().byId("IdInicio1").getValue();l.DiasGozo1=this.getView().byId("first_diasgozo").getValue();l.Fim1=this.getView().byId("IdFim1").getValue();l.Acao1="X"}else{this.getView().byId("IdInicio1").setValueState("None");this.getView().byId("first_diasgozo").setValueState("None");this.getView().byId("IdFim1").setValueState("None")}if(t===true){l.Inicio2=this.getView().byId("IdInicio2").getValue();l.DiasGozo2=this.getView().byId("secon_diasgozo").getValue();l.Fim2=this.getView().byId("IdFim2").getValue();l.Acao2="X"}else{this.getView().byId("IdInicio2").setValueState("None");this.getView().byId("secon_diasgozo").setValueState("None");this.getView().byId("IdFim2").setValueState("None")}if(g===1){sap.m.MessageBox.error("Existem informações não preenchidas.",{actions:["OK",sap.m.MessageBox.Action.CLOSE],onClose:function(e){i._valueHelpDialog1.close()}});return}var V=new o({title:"Confirmação",type:"Message",content:new n({text:"Confirma cancelamento do recesso?"}),beginButton:new s({text:"Sim",press:function(){i.loading(true);c.update(u,l,{success:function(e,t){sap.m.MessageBox.success("Seu recesso foi cancelado com sucesso.",{actions:["OK",sap.m.MessageBox.Action.CLOSE],onClose:function(e){i.getView().getModel().refresh(true)}})},error:function(e){var t=e;t=t.responseText;var a=JSON.parse(t);var o=a.error.message.value;sap.m.MessageBox.error(o,{actions:["OK",sap.m.MessageBox.Action.CLOSE],onClose:function(e){i.loading(false)}});return}});V.close()}}),endButton:new s({text:"Não",press:function(){V.close()}}),afterClose:function(){V.destroy();i._valueHelpDialog1.close()}});V.open()},onSave:function(e,t,a){var i=this;var r=this.getView().byId("IdIndex").getValue();var d=this.getView().byId("IdPernr").getValue();var u="/ZET_GLHR_ESS_FERIASSet(Index="+r+",Pernr='"+d+"',Acao='E')";var l={};var f=0;var I=this.getView().getModel();e=true;t=true;a=true;if(e===true){l.Inicio1=this.getView().byId("IdInicio1").getValue();l.DiasGozo1=this.getView().byId("first_diasgozo").getValue();l.Fim1=this.getView().byId("IdFim1").getValue();if(g===true){l.Abono1="X";l.DiasAbono1="10"}else{l.Abono1=" "}if(c===true){l.SolParc131="X"}l.Acao1="X"}else{this.getView().byId("IdInicio1").setValueState("None");this.getView().byId("first_diasgozo").setValueState("None");this.getView().byId("IdFim1").setValueState("None")}if(t===true){l.Inicio2=this.getView().byId("IdInicio2").getValue();l.DiasGozo2=this.getView().byId("secon_diasgozo").getValue();l.Fim2=this.getView().byId("IdFim2").getValue();if(V===true){l.SolParc132="X"}l.Acao2="X"}else{this.getView().byId("IdInicio2").setValueState("None");this.getView().byId("secon_diasgozo").setValueState("None");this.getView().byId("IdFim2").setValueState("None")}if(f===1){sap.m.MessageBox.error("Existem informações não preenchidas.",{actions:["OK",sap.m.MessageBox.Action.CLOSE],onClose:function(e){i._valueHelpDialog1.close()}});return}var m=new o({title:"Confirmação",type:"Message",content:new n({text:"Deseja enviar a solicitação de recesso?"}),beginButton:new s({text:"Sim",press:function(){i.loading(true);I.update(u,l,{success:function(e,t){sap.m.MessageBox.success("Seu recesso foi programado com sucesso.",{actions:["OK",sap.m.MessageBox.Action.CLOSE],onClose:function(e){i.getView().getModel().refresh(true)}})},error:function(e){var t=e;t=t.responseText;var a=JSON.parse(t);var o=a.error.message.value;sap.m.MessageBox.error(o,{actions:["OK",sap.m.MessageBox.Action.CLOSE],onClose:function(e){i.loading(false)}});return}});m.close()}}),endButton:new s({text:"Não",press:function(){m.close()}}),afterClose:function(){m.destroy()}});m.open()},onVoltar:function(){this.getRouter().navTo("master")},validaData:function(){var e=this.getView().byId("IdInicio1").getValue();var t=this.getView().byId("first_diasgozo").getValue();if(e===""||t===""){this.getView().byId("IdFim1").setValue()}},somardatafirst:function(){var e=this;var t=this.getView().byId("IdInicio1").getValue();var a=this.getView().byId("first_diasgozo").getValue();var i;if(t===""){this.getView().byId("IdFim1").setValue("");return}if(a===""){a="0"}i=!isNaN(a);if(i===true){if(a>0){var o="";var s="/sap/opu/odata/sap/ZGWGLHR_FERIAS_ESS_SRV/ZET_GLHR_CALC_DAYS(V_DATA='"+t+"',V_DIAS='"+a+"')";var n=new sap.ui.model.json.JSONModel;var r={};r.vdata=this.getView().byId("IdInicio1").getValue();r.vdays=this.getView().byId("first_diasgozo").getValue();n.loadData(s,null,false,"GET",false,false,null);var d=n.oData.d.V_RESULTADO;var u=e.getView().byId("IdFim1");u.setValue(d)}}else{sap.m.MessageBox.error("O valor informado deverá ser um número.",{actions:["OK",sap.m.MessageBox.Action.CLOSE],onClose:function(t){e.getView().byId("first_diasgozo").setValue()}})}},somardatasecon:function(){var e=this;var t=this.getView().byId("IdInicio2").getValue();var a=this.getView().byId("secon_diasgozo").getValue();var i;if(t===""){this.getView().byId("IdFim1").setValue("");return}if(a===""){a="0"}i=!isNaN(a);if(i===true){if(a>0){var o="";var s="/sap/opu/odata/sap/ZGWGLHR_FERIAS_ESS_SRV/ZET_GLHR_CALC_DAYS(V_DATA='"+t+"',V_DIAS='"+a+"')";var n=new sap.ui.model.json.JSONModel;var r={};r.vdata2=this.getView().byId("IdInicio2").getValue();r.vdays2=this.getView().byId("secon_diasgozo").getValue();n.loadData(s,null,false,"GET",false,false,null);var d=n.oData.d.V_RESULTADO;var u=e.getView().byId("IdFim2");u.setValue(d)}}else{sap.m.MessageBox.error("O valor informado deverá ser um número.",{actions:["OK",sap.m.MessageBox.Action.CLOSE],onClose:function(t){e.getView().byId("secon_diasgozo").setValue()}})}},somardata:function(e,t){var a=this;var i=this.getOwnerComponent().getModel("ferias_ess");var o="VDATA eq '"+e+"' and VDIAS eq '"+t+"'";var s="/ZET_GLHR_CALC_DAYS";i.read(s,{urlParameters:{$filter:o},async:false,success:function(e,t){return e.results[0].RESULTADO},error:function(){sap.m.MessageToast.show("Recesso não encontrado!")}})},validasecon:function(e){var t=this.getView().byId("secon_diasgozo").getValue();var a=/^[0-9]+$/;if(t.match(a)){if(t.length>2){var i=t.slice(0,2);this.getView().byId("secon_diasgozo").setValue(i)}if(t.length<2){this.somardatasecon()}this.somardatasecon()}else{var o=t.slice(0,0);this.getView().byId("secon_diasgozo").setValue(o);this.somardatasecon()}}})});