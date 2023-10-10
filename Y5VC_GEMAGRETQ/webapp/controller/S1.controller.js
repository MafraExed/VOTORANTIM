sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageBox","sap/ndc/BarcodeScanner","sap/m/MessageToast","../util/formatter"],function(e,t,r,a,s){"use strict";const o="1";const n="2";return e.extend("Workspace.zagrupador.controller.S1",{myFormatter:s,_onAttachRequest:function(){sap.ui.core.BusyIndicator.show()},_onAttachRequestCompleted:function(){sap.ui.core.BusyIndicator.hide()},onInit:function(){var e=sap.ui.core.UIComponent.getRouterFor(this);e.getRoute("S1").attachMatched(this.onRouterMatched,this);var t=this.getView().byId("tableAgrupador");t.attachEventOnce("updateStarted",this._onAttachRequest);t.attachEventOnce("updateFinished",this._onAttachRequestCompleted,this)},onRouterMatched:function(e){var r=this.getView().getModel("i18n").getResourceBundle();var a;var s;var o=this;a=e.getParameter("arguments");s=this.getView();var n=a.agrupador;s.bindElement({path:"/ZET_VCMM_AGRUPSet('"+n+"')",parameters:{expand:"ZAT_VCMM_AGRUP_HEADER_TO_AGRUP_ITM"},model:"GE",events:{change:function(e){if(!s.getBindingContext("GE")){t.error(r.getText("NotFound"),{title:r.getText("Error"),styleClass:"sapUiSizeCompact",onClose:function(e){o.onNavBack(null)}})}},dataRequested:function(e){sap.ui.core.BusyIndicator.show()},dataReceived:function(e){sap.ui.core.BusyIndicator.hide()}}})},onNavBack:function(e){this._goNavBack("S1")},_goNavBack:function(e){var t=sap.ui.core.UIComponent.getRouterFor(this);t.navTo(e,null,true)},onPressScan:function(e){var t=this;r.scan(function(e){t.handleScan(e.text)},function(e){a.show(e)})},handleScan:function(e){this.onScanInputSubmit(e)},onScanInputSubmit:function(e){var r=this.getView().getModel("i18n").getResourceBundle();var a=e;var s={};switch(a.length){case 0:return;case 44:s.chvnfe=a;s.nretq="";this._processarInput(s,o);break;case 184:s.chvnfe=a.substring(0,44);s.branch=a.substring(44,48);s.branchName=a.substring(48,78);s.vendor=a.substring(78,113);s.volume=a.substring(113,121);s.dummy=a.substring(121,171);s.categoriaEtq=a.substring(171,174);s.nretq=a.substring(174,184);this._processarInput(s,n);break;default:t.error(r.getText("errorNrEtqNotFound"),{title:r.getText("Error"),styleClass:"sapUiSizeCompact"})}},_processarInput:function(e,r){var s=this.getView().getModel("i18n").getResourceBundle();var o=this.getView().getModel("GE");var n=this.getView().byId("tableAgrupador");var i=new sap.ui.model.odata.v2.ODataModel(o.sServiceUrl,{defaultCountMode:"Inline",defaultOperationMode:"Server"});var c=this;var u=this.getModelLoc();i.attachRequestSent(this._onAttachRequest);i.attachRequestCompleted(this._onAttachRequestCompleted);i.callFunction("/addVolLidoAgrupador",{method:"POST",urlParameters:{Nretq:e.nretq,Agrupador:u.Agrupador},success:function(e,t){if(e.Nretq){var r=c.myFormatter.shiftLeadingZeros(e.Nretq);a.show(s.getText("addVolSuccess",[r]))}n.getBinding("items").refresh()},error:function(e){c._onAttachRequestCompleted();var r=e.responseText;if(r!==undefined){var a="";try{var o=JSON.parse(r);var n=o.error.innererror.errordetails;if(n.length>1){a=n[0].message}else{a=o.error.message.value}}catch(e){a=r}t.error(a,{title:s.getText("Error"),styleClass:"sapUiSizeCompact"})}else{t.error(s.getText("ErrorRecordedData"),{styleClass:"sapUiSizeCompact"})}}})},handleCancelar:function(e){var r=this.getView();var s=r.getModel("i18n").getResourceBundle();var o=this;var n=!!this.getView().$().closest(".sapUiSizeCompact").length;t.warning(s.getText("PopResetTitle"),{actions:[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.NO],styleClass:n?"sapUiSizeCompact":"",onClose:function(e){if(e==="YES"){o._processarReset()}else{a.show(s.getText("message_canceled_by_user"));o.getView().setBusy(false)}}})},getModelLoc:function(){var e=this.getView().getBindingContext("GE").getPath();var t=this.getView().getModel("GE").getProperty(e);return t},_processarReset:function(){var e=this.getView().getModel("i18n").getResourceBundle();var r=this.getView().getModel("GE");var s=this.getView().byId("tableAgrupador");var o=s.getSelectedItems();if(o.length<1){t.error(e.getText("NotSelectedVol"),{title:e.getText("Error"),styleClass:"sapUiSizeCompact",onClose:function(e){}})}else{var n="";for(var i=0;i<o.length;i++){if(i===0){n=o[i].getBindingContext("GE").getProperty("Nretq")}else{n=n+"-"+o[i].getBindingContext("GE").getProperty("Nretq")}}var c=new sap.ui.model.odata.v2.ODataModel(r.sServiceUrl,{defaultCountMode:"Inline",defaultOperationMode:"Server"});var u=this;var l=this.getModelLoc();c.attachRequestSent(this._onAttachRequest);c.attachRequestCompleted(this._onAttachRequestCompleted);c.callFunction("/cancelVolLidoAgrupador",{method:"POST",urlParameters:{Agrupador:l.Agrupador,NretqList:n},success:function(t,r){var o=u.myFormatter.shiftLeadingZeros(t.vNretqOut);a.show(e.getText("resetVolSuccess",[o]));s.getBinding("items").refresh()},error:function(r){u._onAttachRequestCompleted();var a=r.responseText;if(a!==undefined){var s="";try{var o=JSON.parse(a);var n=o.error.innererror.errordetails;if(n.length>1){s=n[0].message}else{s=o.error.message.value}}catch(e){s=a}t.error(s,{title:e.getText("Error"),styleClass:"sapUiSizeCompact"})}else{t.error(e.getText("ErrorReset"),{styleClass:"sapUiSizeCompact"})}}})}},handleSalvar:function(e){var r=this.getView();var s=r.getModel("i18n").getResourceBundle();var o=this;var n=!!this.getView().$().closest(".sapUiSizeCompact").length;t.warning(s.getText("PopFinalizarText"),{actions:[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.NO],styleClass:n?"sapUiSizeCompact":"",onClose:function(e){if(e==="YES"){o._processarFinalizar()}else{a.show(s.getText("message_canceled_by_user"));o.getView().setBusy(false)}}})},_processarFinalizar:function(){var e=this.getView().getModel("i18n").getResourceBundle();var r=this.getView().getModel("GE");var s=new sap.ui.model.odata.v2.ODataModel(r.sServiceUrl,{defaultCountMode:"Inline",defaultOperationMode:"Server"});var o=this;var n=this.getModelLoc();s.attachRequestSent(this._onAttachRequest);s.attachRequestCompleted(this._onAttachRequestCompleted);s.callFunction("/finalizarAgrupador",{method:"POST",urlParameters:{Agrupador:n.Agrupador},success:function(t,r){var s=o.myFormatter.shiftLeadingZeros(t.Agrupador);a.show(e.getText("PopFinalizarConfirm",[s]));o._PDF(o,t.Agrupador);var n=sap.ui.core.UIComponent.getRouterFor(o);n.navTo("S0",{atualizarLista:true},false)},error:function(r){o._onAttachRequestCompleted();var a=r.responseText;if(a!==undefined){var s="";try{var n=JSON.parse(a);var i=n.error.innererror.errordetails;if(i.length>1){s=i[0].message}else{s=n.error.message.value}}catch(e){s=a}t.error(s,{title:e.getText("Error"),styleClass:"sapUiSizeCompact"})}else{t.error(e.getText("ErrorReset"),{styleClass:"sapUiSizeCompact"})}}})},_PDF:function(e,t){jQuery.sap.log.info("OnPDF print");var r=e.getView().getModel("GE").sServiceUrl+"/ZET_VCMM_FILESet(fileName='"+oData.Agrupador+"',fileCategory='AGR',fileDescription='PE')/$value";parent.window.open(r,"_blank")}})});