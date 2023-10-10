//@ui5-bundle ec/log/integrations/ECLogIntegrations/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"ec/log/integrations/ECLogIntegrations/Component-dbg.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","ec/log/integrations/ECLogIntegrations/model/models"],function(e,t,i){"use strict";return e.extend("ec.log.integrations.ECLogIntegrations.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device")}})});
},
	"ec/log/integrations/ECLogIntegrations/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","ec/log/integrations/ECLogIntegrations/model/models"],function(e,t,i){"use strict";return e.extend("ec.log.integrations.ECLogIntegrations.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device")}})});
},
	"ec/log/integrations/ECLogIntegrations/controller/Main-dbg.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","ec/log/integrations/ECLogIntegrations/model/formatter"],function(e,t){"use strict";return e.extend("ec.log.integrations.ECLogIntegrations.controller.Main",{formatter:t,onInit:function(){var e=(new Date).toISOString().slice(0,10);this.getView().byId("inputDate").setValue(e);this.getDadosECC("buscaLogs")},buscaRegistros:function(){this.getDadosECC("buscaLogs")},getFilters:function(){var e;var t=this.getView().byId("inputDate").getValue();if(t){t=t.replace(/\//g,"-");e="Data ge datetime'"+t+"T00:00:00.0' and Data le datetime'"+t+"T23:59:59.9'"}var s=this.getView().byId("inputEmpresa").getValue();if(s){if(e){e=e+" and ";e=e+"CompanyCode eq '"+s+"'"}else e="CompanyCode eq '"+s+"'"}var o=this.getView().byId("inputProcesso").getSelectedKey();if(o){if(e){e=e+" and ";e=e+"Processo eq '"+o+"'"}else e="Processo eq '"+o+"'"}var a=this.getView().byId("inputID").getValue();if(a){if(e){e=e+" and ";e=e+"IdProcesso eq '"+a+"'"}else e="IdProcesso eq '"+a+"'"}return e},getDadosECC:function(e){var t=this.getOwnerComponent().getModel();var s;var o=this;var a;if(e==="buscaLogs"){a=this.getFilters();s="/logs"}if(!a){sap.m.MessageToast.show("Preencher pelo menos um campo de pesquisa");return}this.getView().byId("tableLogs").setBusy(true);t.removeData();t.read(s,{urlParameters:{$orderby:"Data desc",$filter:a},method:"GET",success:function(e){o.getView().byId("tableLogs").setBusy(false);var t;t=new sap.ui.model.json.JSONModel(e);o.getView().setModel(t,"logs")},error:function(){o.getView().byId("tableLogs").setBusy(false);sap.m.MessageToast.show("Erro na conexão com o ECC")}})}})});
},
	"ec/log/integrations/ECLogIntegrations/controller/Main.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","ec/log/integrations/ECLogIntegrations/model/formatter"],function(e,t){"use strict";return e.extend("ec.log.integrations.ECLogIntegrations.controller.Main",{formatter:t,onInit:function(){var e=(new Date).toISOString().slice(0,10);this.getView().byId("inputDate").setValue(e);this.getDadosECC("buscaLogs")},buscaRegistros:function(){this.getDadosECC("buscaLogs")},getFilters:function(){var e;var t=this.getView().byId("inputDate").getValue();if(t){t=t.replace(/\//g,"-");e="Data ge datetime'"+t+"T00:00:00.0' and Data le datetime'"+t+"T23:59:59.9'"}var s=this.getView().byId("inputEmpresa").getValue();if(s){if(e){e=e+" and ";e=e+"CompanyCode eq '"+s+"'"}else e="CompanyCode eq '"+s+"'"}var o=this.getView().byId("inputProcesso").getSelectedKey();if(o){if(e){e=e+" and ";e=e+"Processo eq '"+o+"'"}else e="Processo eq '"+o+"'"}var a=this.getView().byId("inputID").getValue();if(a){if(e){e=e+" and ";e=e+"IdProcesso eq '"+a+"'"}else e="IdProcesso eq '"+a+"'"}return e},getDadosECC:function(e){var t=this.getOwnerComponent().getModel();var s;var o=this;var a;if(e==="buscaLogs"){a=this.getFilters();s="/logs"}if(!a){sap.m.MessageToast.show("Preencher pelo menos um campo de pesquisa");return}this.getView().byId("tableLogs").setBusy(true);t.removeData();t.read(s,{urlParameters:{$orderby:"Data desc",$filter:a},method:"GET",success:function(e){o.getView().byId("tableLogs").setBusy(false);var t;t=new sap.ui.model.json.JSONModel(e);o.getView().setModel(t,"logs")},error:function(){o.getView().byId("tableLogs").setBusy(false);sap.m.MessageToast.show("Erro na conexão com o ECC")}})}})});
},
	"ec/log/integrations/ECLogIntegrations/i18n/i18n.properties":'title=Title\nappTitle=ECLogIntegrations\nappDescription=App Description',
	"ec/log/integrations/ECLogIntegrations/localService/mockserver.js":function(){sap.ui.define(["sap/ui/core/util/MockServer"],function(e){"use strict";var t,a="ec/log/integrations/ECLogIntegrations/",r=a+"localService/mockdata";return{init:function(){var n=jQuery.sap.getUriParameters(),o=jQuery.sap.getModulePath(r),s=jQuery.sap.getModulePath(a+"manifest",".json"),i="",u=n.get("errorType"),p=u==="badRequest"?400:500,c=jQuery.sap.syncGetJSON(s).data,l=c["sap.app"].dataSources,f=l.ZGWGLHR_TAB_LOG_EC_INTERFACES_SRV,g=jQuery.sap.getModulePath(a+f.settings.localUri.replace(".xml",""),".xml"),d=/.*\/$/.test(f.uri)?f.uri:f.uri+"/",y=f.settings.annotations;t=new e({rootUri:d});e.config({autoRespond:true,autoRespondAfter:n.get("serverDelay")||1e3});t.simulate(g,{sMockdataBaseUrl:o,bGenerateMissingMockData:true});var h=t.getRequests(),m=function(e,t,a){a.response=function(a){a.respond(e,{"Content-Type":"text/plain;charset=utf-8"},t)}};if(n.get("metadataError")){h.forEach(function(e){if(e.path.toString().indexOf("$metadata")>-1){m(500,"metadata Error",e)}})}if(u){h.forEach(function(e){if(e.path.toString().indexOf(i)>-1){m(p,u,e)}})}t.start();jQuery.sap.log.info("Running the app with mock data");if(y&&y.length>0){y.forEach(function(t){var r=l[t],n=r.uri,o=jQuery.sap.getModulePath(a+r.settings.localUri.replace(".xml",""),".xml");new e({rootUri:n,requests:[{method:"GET",path:new RegExp("([?#].*)?"),response:function(e){jQuery.sap.require("jquery.sap.xml");var t=jQuery.sap.sjax({url:o,dataType:"xml"}).data;e.respondXML(200,{},jQuery.sap.serializeXML(t));return true}}]}).start()})}},getMockServer:function(){return t}}});
},
	"ec/log/integrations/ECLogIntegrations/manifest.json":'{"_version":"1.12.0","sap.app":{"id":"ec.log.integrations.ECLogIntegrations","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"1.0.0"},"title":"{{appTitle}}","description":"{{appDescription}}","sourceTemplate":{"id":"servicecatalog.connectivityComponentForManifest","version":"0.0.0","toolsId":"67b527b4-b354-490e-b0e6-bccc70219b15"},"dataSources":{"ZGWGLHR_TAB_LOG_EC_INTERFACES_SRV":{"uri":"/sap/opu/odata/sap/ZGWGLHR_TAB_LOG_EC_INTERFACES_SRV/","type":"OData","settings":{"localUri":"localService/ZGWGLHR_TAB_LOG_EC_INTERFACES_SRV/metadata.xml"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":false,"rootView":{"viewName":"ec.log.integrations.ECLogIntegrations.view.Main","type":"XML","async":true,"id":"Main"},"dependencies":{"minUI5Version":"1.65.6","libs":{"sap.ui.layout":{},"sap.ui.core":{},"sap.m":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"ec.log.integrations.ECLogIntegrations.i18n.i18n"}},"":{"type":"sap.ui.model.odata.v2.ODataModel","settings":{"defaultOperationMode":"Server","defaultBindingMode":"OneWay","defaultCountMode":"Request"},"dataSource":"ZGWGLHR_TAB_LOG_EC_INTERFACES_SRV","preload":true}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"ec.log.integrations.ECLogIntegrations.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"RouteMain","pattern":"RouteMain","target":["TargetMain"]}],"targets":{"TargetMain":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Main","viewName":"Main"}}}},"sap.platform.hcp":{"uri":"webapp","_version":"1.1.0"},"sap.platform.abap":{"uri":"/sap/bc/ui5_ui5/sap/zecloginterface","_version":"1.1.0"}}',
	"ec/log/integrations/ECLogIntegrations/model/formatter-dbg.js":function(){sap.ui.define([],function(){"use strict";return{formatDate:function(t){var e=sap.ui.core.format.DateFormat.getDateInstance({format:"full, e.g. '{1} 'at' {0}'",pattern:"dd-MM-yyyy - HH:mm"});return e.format(t)},formatStatus:function(t){if(t==="OK")return"sap-icon://accept";else return"sap-icon://sys-cancel"},formatStatusColor:function(t){if(t==="OK")return"#1e9e40";else return"#d11d1d"}}});
},
	"ec/log/integrations/ECLogIntegrations/model/formatter.js":function(){sap.ui.define([],function(){"use strict";return{formatDate:function(t){var e=sap.ui.core.format.DateFormat.getDateInstance({format:"full, e.g. '{1} 'at' {0}'",pattern:"dd-MM-yyyy - HH:mm:ss"});return e.format(t)},formatStatus:function(t){if(t==="OK")return"sap-icon://accept";else return"sap-icon://sys-cancel"},formatStatusColor:function(t){if(t==="OK")return"#1e9e40";else return"#d11d1d"}}});
},
	"ec/log/integrations/ECLogIntegrations/model/models-dbg.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"ec/log/integrations/ECLogIntegrations/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"ec/log/integrations/ECLogIntegrations/utils/locate-reuse-libs.js":'(function(e){var t=function(e){var t=e;var n="";var r=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];function a(e,t){Object.keys(e).forEach(function(e){if(!r.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t}return new Promise(function(r,i){$.ajax(t).done(function(e){if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=a(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=a(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=a(e["sap.ui5"].componentUsages,n)}}r(n)}).fail(function(t){i(new Error("Could not fetch manifest at \'"+e))})})};e.registerComponentDependencyPaths=function(e){return t(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}})}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=document.getElementById("locate-reuse-libs");if(!currentScript){currentScript=document.currentScript}var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")});if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")})}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"ec/log/integrations/ECLogIntegrations/view/Main.view.xml":'<mvc:View controllerName="ec.log.integrations.ECLogIntegrations.controller.Main" xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n\txmlns:m="sap.m" xmlns="sap.ui.table" xmlns:core="sap.ui.core"><m:Shell id="shell"><m:App id="app"><m:pages><m:Page id="page" title="Log - Integrações RH SAP EC/ECC vs 1.1"><m:content><Table id="tableLogs" rows="{path: \'logs>/results\'}" selectionMode="None" visibleRowCount="7" visibleRowCountMode="Auto" alternateRowColors="true"><extension><m:HBox ><m:HBox wrap="Wrap" width="60rem"><m:ComboBox id="inputEmpresa" placeholder="Empresa"><core:Item key="VSA" text="VSA" /><core:Item key="CBA" text="CBA" /><core:Item key="JS" text="JS" /><core:Item key="VE" text="VE" /></m:ComboBox><m:ComboBox id="inputProcesso" placeholder="Processo"><core:Item key="ACESSORH_ENVIOCARGOS" text="AcessoRH - Envio de Cargos" /><core:Item key="ACESSORH_ENVIOPOSICOES" text="ACESSORH_ENVIOPOSICOES" /><core:Item key="ACESSORH_CADASTROSCONCLUIDOS" text="AcessoRH - Envio de Funcionário para o EC" /><core:Item key="ACESSORH_PH_CONCLUIDO" text="Candidato gravado na entidade PH do EC" /><core:Item key="FIM_CRIACAO_USUARIO" text="FIM - Atualização dos dados do Funcionário no EC" /><core:Item key="KENOBY_CRIA_USUARIOS" text="Kenoby - Criação de Usuário" /><core:Item key="KENOBY_ENVIA_CARGOS" text="Kenoby - Envio de Cargos" /><core:Item key="KENOBY_CANDIDATOSELECIONADO" text="Kenoby - Envio do Candidato para o MDF" /></m:ComboBox><m:Input id="inputID" placeholder="ID"/><m:DatePicker id="inputDate" displayFormat="short" class="sapUiSmallMarginBottom" placeholder="Data da Execução" valueFormat="yyyy-MM-dd"/><m:Button class="sapUiSmallMarginBegin" text="Buscar" press="buscaRegistros"/></m:HBox><m:HBox width="19rem" justifyContent="End"><m:Button icon="sap-icon://synchronize" press="buscaRegistros"/></m:HBox></m:HBox></extension><columns><Column width="4rem" hAlign="Center"><m:Label text="Status" /><template><core:Icon src="{ path: \'logs>MsgStatus\'   , formatter: \'.formatter.formatStatus\' }"\n\t\t\t\t\t\t\t\t\t\t           color="{ path: \'logs>MsgStatus\' , formatter: \'.formatter.formatStatusColor\' }"/></template></Column><Column width="5rem" hAlign="Center"><m:Label text="Empresa"/><template><m:Text text="{logs>CompanyCode}" wrapping="false"/></template></Column><Column width="11rem"><m:Label text="Processo"/><template><m:Label text="{logs>Processo}" tooltip="{logs>Processo}"/></template></Column><Column width="10rem" hAlign="Begin"><m:Label text="Cargo/Nome/ID"/><template><m:Label text="{logs>IdProcesso}"/></template></Column><Column width="36rem"><m:Label text="Mensagem"/><template><m:Label text="{logs>Msg}" tooltip="{logs>Msg}"/></template></Column><Column><m:Label text="Data"/><template><m:Label text="{ path: \'logs>Data\', formatter: \'.formatter.formatDate\'}" /></template></Column></columns></Table></m:content></m:Page></m:pages></m:App></m:Shell></mvc:View>'
}});