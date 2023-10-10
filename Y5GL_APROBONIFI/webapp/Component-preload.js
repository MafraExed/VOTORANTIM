//@ui5-bundle ZFI_VCDC_CARGO_BONIFIC/ZFI_VCDC_CARGO_BONIFIC/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"ZFI_VCDC_CARGO_BONIFIC/ZFI_VCDC_CARGO_BONIFIC/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","ZFI_VCDC_CARGO_BONIFIC/ZFI_VCDC_CARGO_BONIFIC/model/models"],function(e,t,i){"use strict";return e.extend("ZFI_VCDC_CARGO_BONIFIC.ZFI_VCDC_CARGO_BONIFIC.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device")}})});
},
	"ZFI_VCDC_CARGO_BONIFIC/ZFI_VCDC_CARGO_BONIFIC/controller/View1.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageBox","sap/m/MessageToast"],function(e,r,o){"use strict";return e.extend("ZFI_VCDC_CARGO_BONIFIC.ZFI_VCDC_CARGO_BONIFIC.controller.View1",{onInit:function(){var e=jQuery.sap.getUriParameters().get("processo");var r=this.getView().getModel();var o={};var s="/ZET_CARREGAMENTOSet(Confirma='C',Processo='"+e+"')";var t="";this.getView().byId("tProcess").setText(e);o.Processo=e;o.Confirma="C";var a=this;r.update(s,o,{success:function(e,r){a.getView().byId("button0").setVisible(true);a.getView().byId("button1").setVisible(true)},error:function(e){var r=e.responseText;var o=JSON.parse(r);t=o.error.message.value;sap.m.MessageBox.error(t,{actions:["OK"],onClose:function(e){a.getView().byId("button0").setVisible(false);a.getView().byId("button1").setVisible(false)}});return}})},onAprov:function(){var e=jQuery.sap.getUriParameters().get("processo");var o=this.getView().getModel();var s={};var t="/ZET_CARREGAMENTOSet(Confirma='Y',Processo='"+e+"')";s.Processo=e;s.Confirma="Y";o.update(t,s,{success:function(e,o){r.success("Pedido liberado para carregamento")},error:function(o){r.error("Erro ao aprovar portaria "+e+"")}})},onReprov:function(){var e=jQuery.sap.getUriParameters().get("processo");var o=this.getView().getModel();var s={};var t="/ZET_CARREGAMENTOSet(Confirma='N',Processo='"+e+"')";s.Processo=e;s.Confirma="N";o.update(t,s,{success:function(e,o){r.success("Pedido reprovado para carregamento")},error:function(o){r.error("Erro ao aprovar portaria "+e+"")}})}})});
},
	"ZFI_VCDC_CARGO_BONIFIC/ZFI_VCDC_CARGO_BONIFIC/i18n/i18n.properties":'title=Autoriza\\u00e7\\u00e3o de Carregamento\nappTitle=Autoriza\\u00e7\\u00e3o de Carregamento de Bonifica\\u00e7\\u00e3o\nappDescription=Autoriza\\u00e7\\u00e3o de Carregamento de Bonifica\\u00e7\\u00e3o',
	"ZFI_VCDC_CARGO_BONIFIC/ZFI_VCDC_CARGO_BONIFIC/localService/metadata.xml":'<edmx:Edmx xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx"\n\txmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns:sap="http://www.sap.com/Protocols/SAPData" Version="1.0"><edmx:DataServices m:DataServiceVersion="2.0"><Schema xmlns="http://schemas.microsoft.com/ado/2008/09/edm" Namespace="ZGWVCSD_CARREGAMENTO_SRV" xml:lang="pt" sap:schema-version="1"><EntityType Name="ZET_CARREGAMENTO" sap:content-version="1"><Key><PropertyRef Name="Confirma"/><PropertyRef Name="Processo"/></Key><Property Name="Confirma" Type="Edm.String" Nullable="false" MaxLength="1" sap:unicode="false" sap:label="Código de um caractere"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Processo" Type="Edm.String" Nullable="false" MaxLength="14" sap:unicode="false" sap:label="Nº processo"\n\t\t\t\t\tsap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/></EntityType><EntityContainer Name="ZGWVCSD_CARREGAMENTO_SRV_Entities" m:IsDefaultEntityContainer="true" sap:supported-formats="atom json xlsx"><EntitySet Name="ZET_CARREGAMENTOSet" EntityType="ZGWVCSD_CARREGAMENTO_SRV.ZET_CARREGAMENTO" sap:creatable="false" sap:updatable="false"\n\t\t\t\tsap:deletable="false" sap:pageable="false" sap:content-version="1"/></EntityContainer><atom:link xmlns:atom="http://www.w3.org/2005/Atom" rel="self" href="./sap/ZGWVCSD_CARREGAMENTO_SRV/$metadata"/><atom:link xmlns:atom="http://www.w3.org/2005/Atom" rel="latest-version" href="./sap/ZGWVCSD_CARREGAMENTO_SRV/$metadata"/></Schema></edmx:DataServices></edmx:Edmx>',
	"ZFI_VCDC_CARGO_BONIFIC/ZFI_VCDC_CARGO_BONIFIC/manifest.json":'{"_version":"1.12.0","sap.app":{"id":"ZFI_VCDC_CARGO_BONIFIC.ZFI_VCDC_CARGO_BONIFIC","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"1.0.0"},"title":"{{appTitle}}","description":"{{appDescription}}","sourceTemplate":{"id":"servicecatalog.connectivityComponentForManifest","version":"0.0.0"},"dataSources":{"ZGWVCSD_CARREGAMENTO_SRV":{"uri":"/sap/opu/odata/sap/ZGWVCSD_CARREGAMENTO_SRV/","type":"OData","settings":{"localUri":"localService/metadata.xml"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":false,"rootView":{"viewName":"ZFI_VCDC_CARGO_BONIFIC.ZFI_VCDC_CARGO_BONIFIC.view.View1","type":"XML","async":true,"id":"View1"},"dependencies":{"minUI5Version":"1.65.6","libs":{"sap.ui.layout":{},"sap.ui.core":{},"sap.m":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"ZFI_VCDC_CARGO_BONIFIC.ZFI_VCDC_CARGO_BONIFIC.i18n.i18n"}},"":{"type":"sap.ui.model.odata.v2.ODataModel","settings":{"defaultOperationMode":"Server","defaultBindingMode":"OneWay","defaultCountMode":"Request"},"dataSource":"ZGWVCSD_CARREGAMENTO_SRV","preload":true}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"ZFI_VCDC_CARGO_BONIFIC.ZFI_VCDC_CARGO_BONIFIC.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"TargetView1","pattern":"RouteView1","target":["TargetView1"]}],"targets":{"TargetView1":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"View1","viewName":"View1"}}}},"sap.platform.abap":{"uri":"/sap/bc/ui5_ui5/sap/y5gl_aprobonifi/webapp","_version":"1.1.0"}}',
	"ZFI_VCDC_CARGO_BONIFIC/ZFI_VCDC_CARGO_BONIFIC/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"ZFI_VCDC_CARGO_BONIFIC/ZFI_VCDC_CARGO_BONIFIC/serviceBinding.js":'function initModel(){var a="/sap/opu/odata/sap/ZGWVCSD_CARREGAMENTO_SRV/";var e=new sap.ui.model.odata.ODataModel(a,true);sap.ui.getCore().setModel(e)}',
	"ZFI_VCDC_CARGO_BONIFIC/ZFI_VCDC_CARGO_BONIFIC/view/View1.view.xml":'<mvc:View controllerName="ZFI_VCDC_CARGO_BONIFIC.ZFI_VCDC_CARGO_BONIFIC.controller.View1" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"\n\txmlns:l="sap.ui.layout" displayBlock="true"><Shell id="shell"><App id="app"><pages><Page id="page" title="Liberação de Carregamento Bonificação"><content><l:VerticalLayout><Text text=" " width="1rem"/><l:HorizontalLayout><Text text=" " width="1rem"/><Label id="lbl01" text="Controle de Portaria:" design="Bold"/><Text text=" " width="1rem"/><Text id="tProcess"/></l:HorizontalLayout><Text text=" " width="1rem"/><Text text=" " width="1rem"/><l:HorizontalLayout><Text text=" " width="2rem"/><Button xmlns="sap.m" text="Aprovar" id="button1" press="onAprov" icon="sap-icon://accept" type="Accept" visible="false"/><Text text=" " width="4rem"/><Button xmlns="sap.m" text="Reprovar" id="button0" press="onReprov" icon="sap-icon://decline" type="Reject" visible="false"/></l:HorizontalLayout></l:VerticalLayout></content></Page></pages></App></Shell></mvc:View>'
}});
