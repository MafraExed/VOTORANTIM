sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/m/Dialog","sap/m/Button","sap/m/Text"],function(e,t,a,o,s){"use strict";return e.extend("Y5GL_APROVB.Y5GL_APROVB.controller.ENDERECO",{onInit:function(){},onChangeCEP:function(){var e=this.getView().byId("IdCEP").getValue();var t="https://viacep.com.br/ws/"+e+"/json/?callback=callback_name";var a;var o=this;$.ajax({url:t,dataType:"jsonp",success:function(e){a=e;o.BuscaEndereco(a)},error:function(){}})},BuscaEndereco:function(e){var t=e.logradouro;var a=e.bairro;var o=e.localidade;var s=e.uf;var r=e.ibge;var i=e.cep;this.getView().byId("IdRua").setValue(t);this.getView().byId("IdBairro").setValue(a);this.getView().byId("IdCidade").setValue(o);this.getView().byId("IdUF").setValue(s);this.getView().byId("IdCodMunicipio").setValue(r);this.getView().byId("IdCEP").setValue(i)},onSave:function(){var e=this.getView().byId("IdTipoEnd").getSelectedKey();var t=this.getView().byId("IdCEP").getValue();var r=this.getView().byId("IdRua").getValue();var i=this.getView().byId("IdNumero").getValue();var n=this.getView().byId("IdComplemento").getValue();var d=this.getView().byId("IdBairro").getValue();var u=this.getView().byId("IdCidade").getValue();var c=this.getView().byId("IdUF").getValue();var g=this.getView().byId("IdCodMunicipio").getValue();var l;var I;var V=this.getView().getModel();var p;var b={};var v;var m;b.Subty=e;if(b.Subty===""){this.getView().byId("IdTipoEnd").setValueState("Error");sap.m.MessageBox.error("Informe o tipo de endereço");return}else{this.getView().byId("IdTipoEnd").setValueState("Success")}b.Cep=t;if(b.Cep===""){this.getView().byId("IdCEP").setValueState("Error");sap.m.MessageBox.error("Informe o CEP");return}else{this.getView().byId("IdCEP").setValueState("Success")}b.Rua=r;b.Numero=i;if(b.Numero===""){this.getView().byId("IdNumero").setValueState("Error");sap.m.MessageBox.error("Informe o numero do endereço");return}else{this.getView().byId("IdNumero").setValueState("Success")}b.Complemento=n;b.Bairro=d;b.Cidade=u;b.Uf=c;b.Ibge=g;p="/ZET_GLHR_CAD_ENDERECOSet(ITipo='G',Pernr='0',Subty='"+e+"')";l=new a({title:"Confirmação",type:"Message",content:new s({text:"Confirma a gravação de endereço?"}),beginButton:new o({text:"Sim",press:function(){V.update(p,b,{success:function(e,t){sap.m.MessageBox.success("Dados gravados.",{actions:["OK",sap.m.MessageBox.Action.CLOSE],onClose:function(e){}})},error:function(e){I=e;I=I.responseText;v=JSON.parse(I);m=v.error.message.value;sap.m.MessageBox.error(m,{actions:["OK",sap.m.MessageBox.Action.CLOSE],onClose:function(e){}});return}});l.close()}}),endButton:new o({text:"Não",press:function(){l.close()}}),afterClose:function(){l.destroy()}});l.open()}})});