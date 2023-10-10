sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageBox","sap/m/MessageToast"],function(e,r,o){"use strict";return e.extend("ZFI_VCDC_CARGO_BONIFIC.ZFI_VCDC_CARGO_BONIFIC.controller.View1",{onInit:function(){var e=jQuery.sap.getUriParameters().get("processo");var r=this.getView().getModel();var o={};var s="/ZET_CARREGAMENTOSet(Confirma='C',Processo='"+e+"')";var t="";this.getView().byId("tProcess").setText(e);o.Processo=e;o.Confirma="C";var a=this;r.update(s,o,{success:function(e,r){a.getView().byId("button0").setVisible(true);a.getView().byId("button1").setVisible(true)},error:function(e){var r=e.responseText;var o=JSON.parse(r);t=o.error.message.value;sap.m.MessageBox.error(t,{actions:["OK"],onClose:function(e){a.getView().byId("button0").setVisible(false);a.getView().byId("button1").setVisible(false)}});return}})},onAprov:function(){var e=jQuery.sap.getUriParameters().get("processo");var o=this.getView().getModel();var s={};var t="/ZET_CARREGAMENTOSet(Confirma='Y',Processo='"+e+"')";s.Processo=e;s.Confirma="Y";o.update(t,s,{success:function(e,o){r.success("Pedido liberado para carregamento")},error:function(o){r.error("Erro ao aprovar portaria "+e+"")}})},onReprov:function(){var e=jQuery.sap.getUriParameters().get("processo");var o=this.getView().getModel();var s={};var t="/ZET_CARREGAMENTOSet(Confirma='N',Processo='"+e+"')";s.Processo=e;s.Confirma="N";o.update(t,s,{success:function(e,o){r.success("Pedido reprovado para carregamento")},error:function(o){r.error("Erro ao aprovar portaria "+e+"")}})}})});