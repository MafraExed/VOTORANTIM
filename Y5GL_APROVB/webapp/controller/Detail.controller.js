sap.ui.define(["Y5GL_APROVB/Y5GL_APROVB/controller/BaseController","sap/ui/model/json/JSONModel","sap/m/library"],function(e,t,o,i){"use strict";return e.extend("Y5GL_APROVB.Y5GL_APROVB.controller.Detail",{formatter:o,onInit:function(){var e=new t({busy:false,delay:0});this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched,this);this.setModel(e,"detailView");this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this))},onShareInJamPress:function(){var e=this.getModel("detailView"),t=sap.ui.getCore().createComponent({name:"sap.collaboration.components.fiori.sharing.dialog",settings:{object:{id:location.href,share:e.getProperty("/shareOnJamTitle")}}});t.open()},_onObjectMatched:function(e){var t=e.getParameter("arguments").objectId;this.getModel("appView").setProperty("/layout","TwoColumnsMidExpanded");this.getModel().metadataLoaded().then(function(){var e=this.getModel().createKey("ZET_GLHR_MEU_CADASTROSet",{Programm:t});this._bindView("/"+e)}.bind(this))},_bindView:function(e){var t=this.getView().getModel();t.setProperty("/busy",false);this.getView().bindElement({path:e,events:{change:this._onBindingChange.bind(this),dataRequested:function(){t.setProperty("/busy",true)},dataReceived:function(){t.setProperty("/busy",false)}}})},_onBindingChange:function(){var e=this.getView(),t=e.getElementBinding();if(!t.getBoundContext()){this.getRouter().getTargets().display("detailObjectNotFound");this.getOwnerComponent().oListSelector.clearMasterListSelection();return}var o=t.getPath(),i=this.getResourceBundle(),a=e.getModel().getObject(o),n=a.Programm,r=a.Programm,s=this.getModel("detailView");this.getOwnerComponent().oListSelector.selectAListItem(o);s.setProperty("/saveAsTileTitle",i.getText("shareSaveTileAppTitle",[r]));s.setProperty("/shareOnJamTitle",r);s.setProperty("/shareSendEmailSubject",i.getText("shareSendEmailObjectSubject",[n]));s.setProperty("/shareSendEmailMessage",i.getText("shareSendEmailObjectMessage",[r,n,location.href]))},_onMetadataLoaded:function(){var e=this.getView().getBusyIndicatorDelay(),t=this.getModel("detailView");t.setProperty("/delay",0);t.setProperty("/busy",true);t.setProperty("/delay",e)},onCloseDetailPress:function(){this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen",false);this.getOwnerComponent().oListSelector.clearMasterListSelection();this.getRouter().navTo("master")},toggleFullScreen:function(){var e=this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen",!e);if(!e){this.getModel("appView").setProperty("/previousLayout",this.getModel("appView").getProperty("/layout"));this.getModel("appView").setProperty("/layout","MidColumnFullScreen")}else{this.getModel("appView").setProperty("/layout",this.getModel("appView").getProperty("/previousLayout"))}}})});