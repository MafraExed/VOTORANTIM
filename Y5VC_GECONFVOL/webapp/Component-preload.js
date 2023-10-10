jQuery.sap.registerPreloadedModules({version:"2.0",name:"workspace/conferenciavolumes/zconferencia_volumes/Component-preload",modules:{"workspace/conferenciavolumes/zconferencia_volumes/Component.js":'sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","workspace/conferenciavolumes/zconferencia_volumes/model/models"],function(e,i,o){"use strict";return e.extend("workspace.conferenciavolumes.zconferencia_volumes.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments),this.getRouter().initialize(),this.setModel(o.createDeviceModel(),"device")}})});',"workspace/conferenciavolumes/zconferencia_volumes/controller/View1.controller.js":'sap.ui.define(["sap/ui/core/mvc/Controller","sap/ndc/BarcodeScanner","sap/ui/model/json/JSONModel","sap/m/MessageBox","sap/m/MessageToast"],function(e,t,s,a,n){"use strict";return e.extend("workspace.conferenciavolumes.zconferencia_volumes.controller.View1",{onInit:function(){this.oView=this.getView(),this.oView.setModel(new s({data:{}})),this._initialization()},onPressScan:function(e){var s=this;t.scan(function(e){jQuery.sap.log.info("OnScan primeiro callback"),s._onScan(e.text)},function(e){jQuery.sap.log.info("OnScan segundo callback")},function(e){jQuery.sap.log.info("OnScan terceiro callback")})},_onScan:function(e){let t=this.getView().getModel("i18n").getResourceBundle(),s=new this._decodeVolumeQrCode(e);null!==s&&s.chvnfe?this._checkLabelStatus(s):a.error(t.getText("error_invalid_label"),{title:t.getText("error_title"),styleClass:"sapUiSizeCompact"})},_decodeVolumeQrCode:function(e){let t={};return 184===e.length&&(t.chvnfe=e.substring(0,44),t.branch=e.substring(44,48),t.branchName=e.substring(48,78),t.vendor=e.substring(78,113),t.volume=e.substring(113,121),t.dummy=e.substring(121,171),t.categoriaEtq=e.substring(171,174),t.nretq=e.substring(174,184)),t},_handleReadLabel:function(e){let t=this.getView().getModel("i18n").getResourceBundle();0===this._NfHeaderRead.size?(this._NfHeaderRead.set(e.chvnfe,e.chvnfe),this._readNfheader(e),this._checkLabel(e)):void 0===this._NfHeaderRead.get(e.chvnfe)?n.show(t.getText("error_invalid_label_wrong_nfe")):this._checkLabel(e)},_checkLabel:function(e){let t=this.getView(),s=t.getModel("i18n").getResourceBundle();if(void 0===this._LabelsRead.get(e.nretq)){this._LabelsRead.set(e.nretq,e.nretq);let s=t.getModel("NFHEADER"),a=s.getData();a.checkedVolumes=this._LabelsRead.size,s.setData(a);let n=t.getModel("NFVOLUMELIST"),r=n.getData();r.push({nretq:e.nretq}),n.setData(r)}else n.show(s.getText("error_label_already_checked"))},_readNfheader:function(e){let t=this.getView(),s=t.getModel("i18n").getResourceBundle(),n=t.getModel("GE"),r=t.getModel("NFHEADER");t.setBusy(!0),n.read("/ZET_VCMM_NFHEADERSet(Chvnfe=\'"+e.chvnfe+"\')",{success:(e,s)=>{if(null!==e){let t=r.getData();t.nfenum=e.nfenum,t.serie=e.series,t.vendor=e.fornecedorNome,t.step=e.etapa,t.state=e.state,t.totVolumes=parseInt(e.vol,10),t.date=e.docDat,t.statusNfeDescr=e.statusNfeDescr,t.branch=e.branch,t.branchName=e.descricaoFilial,r.setData(t)}t.setBusy(!1)},error:function(e){t.setBusy(!1),a.error(s.getText("error_communication"),{title:s.getText("error_title"),styleClass:"sapUiSizeCompact"})}})},_initialization:function(){let e=new s({nfenum:"",serie:"",date:"",vendor:"",step:"",state:sap.ui.core.ValueState.None,branch:"",branchName:"",totVolumes:"0",checkedVolumes:"0",statusNfeDescr:""});this.getView().setModel(e,"NFHEADER");let t=new s([]);this.getView().setModel(t,"NFVOLUMELIST"),this._LabelsRead=new Map,this._NfHeaderRead=new Map},onPressCancel:function(e){this._initialization()},_checkLabelStatus:function(e){let t=this.getView(),s=t.getModel("GE"),n=this;var r=t.getModel("i18n").getResourceBundle();s.read("/ZET_VCMM_LABELSet(\'"+e.nretq+"\')",{success:(s,i)=>{if(s.__batchResponses){let e=s.__batchResponses[0].response.body,t=JSON.parse(e);a.error(t.error.message.value,{styleClass:"sapUiSizeCompact"})}else"AT"===s.status?this._handleReadLabel(e):"CA"===s.status?a.error(r.getText("label_cancelled"),{title:r.getText("error"),styleClass:"sapUiSizeCompact"}):a.error(r.getText("label_not_active"),{title:r.getText("error"),styleClass:"sapUiSizeCompact"});n._setBusy(t,!1)},error:function(e){a.error(r.getText("read_chave_error"),{title:r.getText("error"),styleClass:"sapUiSizeCompact"}),n._setBusy(t,!1)}})},_setBusy:function(e,t){e.byId("Chave_NfeInput").setBusy(t),e.byId("idPage").setBusy(t)}})});',"workspace/conferenciavolumes/zconferencia_volumes/model/models.js":'sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);return i.setDefaultBindingMode("OneWay"),i}}});',"workspace/conferenciavolumes/zconferencia_volumes/view/View1.view.xml":'<mvc:View controllerName="workspace.conferenciavolumes.zconferencia_volumes.controller.View1" xmlns:mvc="sap.ui.core.mvc"\n\txmlns:html="http://www.w3.org/1999/xhtml" displayBlock="true" xmlns="sap.m" xmlns:f="sap.ui.layout.form"><App id="idAppControl"><pages><Page title="{i18n>title}"><content><ObjectHeader responsive="true" title="NF-e: {NFHEADER>/nfenum} - {NFHEADER>/serie}"><statuses><ObjectStatus text="{NFHEADER>/step}" state="{NFHEADER>/state}"/><ObjectStatus text="{NFHEADER>/statusNfeDescr}" state="{NFHEADER>/state}"/></statuses><attributes><ObjectAttribute text="{NFHEADER>/branch} - {NFHEADER>/branchName}"/><ObjectAttribute text="{NFHEADER>/vendor}"/><ObjectAttribute title="{i18n>lbl_creationtDate}"\n\t\t\t\t\t\t\t\ttext="{ path: \'NFHEADER>/date\', type:\'sap.ui.model.type.Date\', formatOptions: {style: \'short\'}}"/></attributes></ObjectHeader><List headerText="{i18n>lbl_volumesChecked}: {NFHEADER>/checkedVolumes}/{NFHEADER>/totVolumes}" items="{ path: \'NFVOLUMELIST>/\' }"\n\t\t\t\t\tnoDataText="{i18n>txtNoLabelRead}"><StandardListItem title="{NFVOLUMELIST>nretq}" /></List></content><footer><Toolbar><Button icon="sap-icon://cancel" tooltip="tooltip" press="onPressCancel" type="Reject"/><ToolbarSpacer/><Button icon="sap-icon://bar-code" tooltip="tooltip" press="onPressScan" type="Emphasized"/></Toolbar></footer></Page></pages></App></mvc:View>',"workspace/conferenciavolumes/zconferencia_volumes/i18n/i18n_pt.properties":"\ntitle=Conferência de Volumes\nappTitle=Conferência de Volumes\nappDescription=Conferência de Volumes\n\n#Labels\ntitle=Conferência de Volumes\ntxtNoLabelRead=Nenhuma Etiqueta Lida\nlbl_creationtDate=Data de Emissão\nlbl_vendor=Fornecedor\nlbl_volumesChecked=Volumes Conferidos\n\n#Errors\nerror_invalid_label=Etiqueta inválida\nerror_title=Erro\nerror_invalid_label_wrong_nfe=Etiqueta inválida pertence a outra NF-e\nerror_label_already_checked=Etiqueta já foi conferida\nerror_communication=Erro de comunicação\nlabel_not_active=Etiqueta com status diferente de ativa\nlabel_cancelled=Etiqueta cancelada","workspace/conferenciavolumes/zconferencia_volumes/i18n/i18n.properties":"title=Title\nappTitle=Conferência de Volumes\nappDescription=App Description\nlabel_not_active=Wrong label status\nlabel_cancelled=Label Cancelled","workspace/conferenciavolumes/zconferencia_volumes/manifest.json":'{"_version":"1.8.0","sap.app":{"id":"workspace.conferenciavolumes.zconferencia_volumes","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"1.0.0"},"dataSources":{"GE":{"uri":"/sap/opu/odata/sap/ZGWVCMM_GESTAO_ESTOQUE_SRV/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}},"title":"{{appTitle}}","description":"{{appDescription}}","sourceTemplate":{"id":"ui5template.basicSAPUI5ApplicationProject","version":"1.38.11"}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true},"supportedThemes":["sap_hcb","sap_belize"]},"sap.ui5":{"rootView":{"viewName":"workspace.conferenciavolumes.zconferencia_volumes.view.View1","type":"XML"},"dependencies":{"minUI5Version":"1.30.0","libs":{"sap.ui.layout":{},"sap.ui.core":{},"sap.m":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"workspace.conferenciavolumes.zconferencia_volumes.i18n.i18n"}},"GE":{"dataSource":"GE","type":"sap.ui.model.odata.v2.ODataModel","settings":{"loadMetadataAsync":false,"json":true,"bJSON":true,"defaultBindingMode":"TwoWay","defaultCountMode":"Inline","useBatch":true,"refreshAfterChange":false,"disableHeadRequestForToken":true}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"workspace.conferenciavolumes.zconferencia_volumes.view","controlAggregation":"pages","controlId":"idAppControl","clearControlAggregation":false},"routes":[{"name":"RouteView1","pattern":"RouteView1","target":["TargetView1"]}],"targets":{"TargetView1":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewName":"View1"}}}},"sap.platform.abap":{"uri":"/sap/bc/ui5_ui5/sap/y5vc_geconfvol/","_version":"1.1.0"}}'}});