sap.ui.define(["Y5GL_BEM_ESTAR/Y5GL_BEM_ESTAR/controller/BaseController","sap/m/Dialog","sap/m/Button","sap/m/Text"],function(e,t,i,s){"use strict";var a;var r;var d;var l;var o;return e.extend("Y5GL_BEM_ESTAR.Y5GL_BEM_ESTAR.controller.Documentos_Detail",{onInit:function(){this.getRouter().getRoute("Documentos_Detail").attachPatternMatched(this._onObjectMatched,this);var e=jQuery.sap.getModulePath("Y5GL_BEM_ESTAR.Y5GL_BEM_ESTAR");var t=e+"/imagens/loading.gif";this.getView().byId("idimg").setSrc(t)},onVoltar:function(){this.getRouter().navTo("worklist")},onBackMaster:function(){this.getRouter().navTo("master")},formaMsg:function(e){if(e==="Em ResoluÃ§Ã£o"){return true}else{return false}},formatVisibleEdit:function(e){if(e==="Em ResoluÃ§Ã£o"||e==="X"){return false}else{return true}},FormatBV:function(e){if(e==="Em ResoluÃ§Ã£o"||e===""||e===null){return false}else{return true}},formatVisibleUpload:function(e){if(e==="Em ResoluÃ§Ã£o"||e===""){return true}else{return false}},_onObjectMatched:function(e){this.getView().getModel().refresh(true);var t=e.getParameter("arguments").Subty;d=e.getParameter("arguments").Tipo;var i=e.getParameter("arguments").Pernr;o=e.getParameter("arguments").Chamado;l=i;a=t;r=t;this.getModel("appView").setProperty("/layout","TwoColumnsMidExpanded");this.getModel().metadataLoaded().then(function(){var e=this.getModel().createKey("ZET_GLHR_MEUS_DOCUMENTOSSet",{IInfo:t,IPernr:i,ITipo:d,Chamado:o});this._bindView("/"+e)}.bind(this))},_bindView:function(e){var t=this;var i=this.getView().getModel();i.setProperty("/busy",false);this.getView().bindElement({path:e,events:{change:this._onBindingChange.bind(this),dataRequested:function(){t.loading(true)},dataReceived:function(){t.loading(false)}}})},_onBindingChange:function(){var e=this.getView(),t=e.getElementBinding();if(!t.getBoundContext()){this.getRouter().getTargets().display("detailObjectNotFound");return}a=r;a="_"+a;this.getView().byId(a).setVisible(true);if(d==="N"){this.getView().byId("UploadCollection").setUploadButtonInvisible(false);this.getView().byId("IdSalvarDetailDep").setVisible(true);this.getView().byId("IdEditDetailDep").setVisible(false);this.getView().byId("IdCancelDetailDep").setVisible(false)}else{this.getView().byId("UploadCollection").setUploadButtonInvisible(true)}},FormatEditable:function(e){return true},FormatVisibleForm:function(e){return false},onSave:function(){var e=this;var d=this.getView().getModel();var l;var o;var g;var n={};switch(a){case"_0001":n.CpfNr=this.getView().byId("idCpf").getValue();break;case"_0002":n.IdentNr=this.getView().byId("idIdentNr").getValue();n.Rgorg=this.getView().byId("idRgorg").getValue();n.DtEmis=this.getView().byId("idDtEmis").getValue();n.EsEmis=this.getView().byId("idEsEmis").getSelectedKey();break;case"_0003":n.CtpsNr=this.getView().byId("idCtpsNr").getValue();n.CtpsSerie=this.getView().byId("idCtpsSerie").getValue();n.DtEmis=this.getView().byId("idDtEmis_3").getValue();n.EsEmis=this.getView().byId("idEsEmis_3").getSelectedKey();break;case"_0004":n.CregNr=this.getView().byId("idCregNr").getValue();n.CregName=this.getView().byId("idCregName").getValue();n.CregInit=this.getView().byId("idCregInit").getValue();n.DtEmis=this.getView().byId("idDtEmis_0004").getValue();n.EsEmis=this.getView().byId("idEsEmis_4").getSelectedKey();n.Ocorg=this.getView().byId("idOcorg").getValue();n.Zvalidade=this.getView().byId("idZvalidade").getValue();n.ZorgEmis=this.getView().byId("idZorgEmis").getValue();break;case"_0005":n.ElecNr=this.getView().byId("idElecNr").getValue();n.ElecZone=this.getView().byId("idElecZone").getValue();n.ElecSect=this.getView().byId("idElecSect").getValue();n.DtEmis=this.getView().byId("idDtEmis_5").getValue();n.EsEmis=this.getView().byId("idEsEmis_5").getValue();break;case"_0006":n.PisNr=this.getView().byId("idPisNr").getValue();n.DtEmis=this.getView().byId("idDtEmis_6").getValue();break;case"_0007":n.MilNr=this.getView().byId("idMilNr").getValue();n.MilType=this.getView().byId("idMilType").getValue();n.MilCat=this.getView().byId("idMilCat").getValue();n.EsEmis=this.getView().byId("idDtEmis_7").getSelectedKey();break;case"_0008":n.IdforNr=this.getView().byId("idIdforNr").getValue();n.VisaType=this.getView().byId("idVisaType_8").getValue();n.DtArrv=this.getView().byId("idDtArrv").getValue();n.DtEmis=this.getView().byId("idDtEmis_8").getValue();n.Rneorg=this.getView().byId("idRneorg").getValue();break;case"_0009":n.VisaNr=this.getView().byId("idVisaNr").getValue();n.VisaType=this.getView().byId("idVisaType").getValue();n.DtEmis=this.getView().byId("idDtEmis_9").getValue();n.ForeignSit=this.getView().byId("idForeignSit").getSelectedKey();n.Zvalidade=this.getView().byId("idZvalidade_9").getSelectedKey();n.ZclasTrab=this.getView().byId("idZclasTrab").getSelectedKey();break;case"_0010":n.DriveNr=this.getView().byId("idDriveNr").getValue();n.Cnhorg=this.getView().byId("idCnhorg").getValue();n.DriveCat=this.getView().byId("idDriveCat").getSelectedKey();n.DtEmis=this.getView().byId("idDtEmis_10").getValue();n.EsEmis=this.getView().byId("idEsEmis_10").getSelectedKey();n.Zvalidade=this.getView().byId("idZvalidade_10").getValue();n.Zphab=this.getView().byId("idZphab").getValue();break;case"_0011":n.VisaType=this.getView().byId("idVisaType_11").getValue();n.DtArrv=this.getView().byId("idDtArrv_11").getValue();n.PasspNr=this.getView().byId("idPasspNr_11").getValue();n.DtEmis=this.getView().byId("idDtEmis_11").getValue();break;case"_0012":n.NitNr=this.getView().byId("idNitNr").getValue();n.DtEmis=this.getView().byId("idDtEmis_12").getValue();n.DocNr=this.getView().byId("idDocNr").getValue();n.ForeignSit=this.getView().byId("idForeignSit_12").getSelectedKey();break;case"_0014":n.Ricnr=this.getView().byId("idRicnr").getValue();n.Ricorg=this.getView().byId("idRicorg").getValue();n.DtEmis=this.getView().byId("idDtEmis_14").getValue();n.EsEmis=this.getView().byId("idEsEmis_14").getValue();break;case"_0015":n.Nhcnr=this.getView().byId("idNhcnr").getValue();break}var u="/ZET_GLHR_MEUS_DOCUMENTOSSet(IPernr='0',IInfo='"+r+"',ITipo='G')";var b=new t({title:"Confirmación",type:"Message",content:new s({text:"Após a confirmação não será possivel alterar o anexo até que o processo seja finalizado. Deseja seguir?"}),beginButton:new i({text:"Si",press:function(){d.update(u,n,{success:function(t,i){sap.m.MessageBox.success("Sua inclusão/alteração foi iniciada e seguirá para processamento. Aguarde retorno ou acompanhae pelo app.",{actions:["OK",sap.m.MessageBox.Action.CLOSE],onClose:function(t){e.getView().getModel().refresh(true)}})},error:function(t){l=t;l=l.responseText;o=JSON.parse(l);g=o.error.message.value;sap.m.MessageBox.error(g,{actions:["OK",sap.m.MessageBox.Action.CLOSE],onClose:function(t){e.getView().getModel().refresh(true)}});return}});b.close()}}),endButton:new i({text:"No",press:function(){b.close()}}),afterClose:function(){b.destroy()}});b.open()},onChange:function(e){var t=e.getSource();var i=this.getView().getModel();i.refreshSecurityToken();var s=i.oHeaders;var a=s["x-csrf-token"];var r=new sap.m.UploadCollectionParameter({name:"x-csrf-token",value:a});t.addHeaderParameter(r)},onBeforeUploadStarts:function(e){var t="0465";var i=r;var s="0";if(l!==""||i!==""||s!==""){var a=l+"$"+t+"$"+i+"$"+s+"$"+e.getParameter("fileName");var d=new sap.m.UploadCollectionParameter({name:"slug",value:a});e.getParameters().addHeaderParameter(d)}},onuploadComplete:function(e){var t="0465";var i=r;var s="C";if(l!==""||i!==""){var a=new sap.ui.model.Filter("Infty",sap.ui.model.FilterOperator.EQ,t);var d=new sap.ui.model.Filter("Subty",sap.ui.model.FilterOperator.EQ,i);var g=new sap.ui.model.Filter("Tipo",sap.ui.model.FilterOperator.EQ,s);var n=new sap.ui.model.Filter("chamado",sap.ui.model.FilterOperator.EQ,o);var u=this.getView().byId("UploadCollection");u.getBinding("items").filter([a,d,g,n])}},onmodelListContextChange:function(e){var t="0465";var i=r;var s="C";if(l!==""||i!==""){var a=new sap.ui.model.Filter("Pernr",sap.ui.model.FilterOperator.EQ,l);var d=new sap.ui.model.Filter("Infty",sap.ui.model.FilterOperator.EQ,t);var g=new sap.ui.model.Filter("Subty",sap.ui.model.FilterOperator.EQ,i);var n=new sap.ui.model.Filter("Tipo",sap.ui.model.FilterOperator.EQ,s);var u=new sap.ui.model.Filter("chamado",sap.ui.model.FilterOperator.EQ,o);var b=this.getView().byId("UploadCollection");b.getBinding("items").filter([a,d,g,n,u])}},onEdit:function(){switch(a){case"_0001":this.getView().byId("idCpf").setEditable(true);break;case"_0002":this.getView().byId("idIdentNr").setEditable(true);this.getView().byId("idRgorg").setEditable(true);this.getView().byId("idDtEmis").setEditable(true);this.getView().byId("idEsEmis").setEditable(true);break;case"_0003":this.getView().byId("idCtpsNr").setEditable(true);this.getView().byId("idCtpsSerie").setEditable(true);this.getView().byId("idDtEmis_3").setEditable(true);this.getView().byId("idEsEmis_3").setEditable(true);break;case"_0004":this.getView().byId("idCregNr").setEditable(true);this.getView().byId("idCregName").setEditable(true);this.getView().byId("idCregInit").setEditable(true);this.getView().byId("idDtEmis_0004").setEditable(true);this.getView().byId("idEsEmis_4").setEditable(true);this.getView().byId("idOcorg").setEditable(true);this.getView().byId("idZvalidade").setEditable(true);this.getView().byId("idZorgEmis").setEditable(true);break;case"_0005":this.getView().byId("idElecNr").setEditable(true);this.getView().byId("idElecZone").setEditable(true);this.getView().byId("idElecSect").setEditable(true);this.getView().byId("idDtEmis_5").setEditable(true);this.getView().byId("idEsEmis_5").setEditable(true);break;case"_0006":this.getView().byId("idPisNr").setEditable(true);this.getView().byId("idDtEmis_6").setEditable(true);break;case"_0007":this.getView().byId("idMilNr").setEditable(true);this.getView().byId("idMilType").setEditable(true);this.getView().byId("idMilCat").setEditable(true);this.getView().byId("idDtEmis_7").setEditable(true);break;case"_0008":this.getView().byId("idIdforNr").setEditable(true);this.getView().byId("idVisaType_8").setEditable(true);this.getView().byId("idDtArrv").setEditable(true);this.getView().byId("idDtEmis_8").setEditable(true);this.getView().byId("idRneorg").setEditable(true);break;case"_0009":this.getView().byId("idVisaNr").setEditable(true);this.getView().byId("idVisaType").setEditable(true);this.getView().byId("idDtEmis_9").setEditable(true);this.getView().byId("idForeignSit").setEditable(true);this.getView().byId("idZvalidade_9").setEditable(true);this.getView().byId("idZclasTrab").setEditable(true);break;case"_0010":this.getView().byId("idDriveNr").setEditable(true);this.getView().byId("idCnhorg").setEditable(true);this.getView().byId("idDriveCat").setEditable(true);this.getView().byId("idDtEmis_10").setEditable(true);this.getView().byId("idEsEmis_10").setEditable(true);this.getView().byId("idZvalidade_10").setEditable(true);this.getView().byId("idZphab").setEditable(true);break;case"_0011":this.getView().byId("idVisaType_11").setEditable(true);this.getView().byId("idDtArrv_11").setEditable(true);this.getView().byId("idPasspNr_11").setEditable(true);this.getView().byId("idDtEmis_11").setEditable(true);break;case"_0012":this.getView().byId("idNitNr").setEditable(true);this.getView().byId("idDtEmis_12").setEditable(true);this.getView().byId("idDocNr").setEditable(true);this.getView().byId("idForeignSit_12").setEditable(true);break;case"_0014":this.getView().byId("idRicnr").setEditable(true);this.getView().byId("idRicorg").setEditable(true);this.getView().byId("idDtEmis_14").setEditable(true);this.getView().byId("idEsEmis_14").setEditable(true);break;case"_0015":this.getView().byId("idNhcnr").setEditable(true);break}this.getView().byId("IdSalvarDetailDep").setVisible(true);this.getView().byId("IdCancelDetailDep").setVisible(true);this.getView().byId("IdEditDetailDep").setVisible(false);this.getView().byId("UploadCollection").setUploadButtonInvisible(false)},onCancel:function(){this.getView().getModel().refresh(true);this.getView().byId("IdCancelDetailDep").setVisible(false);this.onVoltar()},onDeleteSelectedItems:function(e){var a=this;var d="0465";var l=r;var o=this.getView().getModel();var g="0";var n="0";var u=d;var b="0";var V="0";var h="E";var l=l;var E=e.getParameters("listItem");var c=E.documentId;c=parseInt(c);var y=this.getView().byId("idTipo").getValue();if(y==="Em ResoluÃ§Ã£o"){sap.m.MessageBox.error("Não será possivel exclusão do anexo, quando o chamado ja existir.");return}var I=this.getView().byId("UploadCollection");var w="/ZET_GLRH_UPLOADSet(Ano='"+g+"',Favor='"+n+"',Infty='"+u+"',Mes='"+b+"',Pernr='"+V+"',Tipo='"+h+"',Subty='"+l+"',DocId="+c+",Objps='',Icnum='')";var m={};m.DocId=c;var p=new t({title:"Confirmação",type:"Message",content:new s({text:"Confirma a exclusão anexo?"}),beginButton:new i({text:"Sim",press:function(){o.update(w,m,{success:function(e,t){sap.m.MessageBox.success("Documentos excluido com sucesso.",{actions:["OK",sap.m.MessageBox.Action.CLOSE],onClose:function(e){I.getBinding("items").refresh(true)}})},error:function(e){var t=e;t=t.responseText;var i=JSON.parse(t);var s=i.error.message.value;sap.m.MessageBox.error(s,{actions:["OK",sap.m.MessageBox.Action.CLOSE],onClose:function(e){I.getBinding("items").refresh(true)}});return}});p.close()}}),endButton:new i({text:"Não",press:function(){p.close()}}),afterClose:function(){p.destroy()}});p.open()}})});