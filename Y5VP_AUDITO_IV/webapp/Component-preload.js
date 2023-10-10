jQuery.sap.registerPreloadedModules({version:"2.0",name:"portal/y5vp_audito_iv/Component-preload",modules:{"portal/y5vp_audito_iv/Component.js":'sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","portal/y5vp_audito_iv/model/models"],function(e,t,i){"use strict";return e.extend("portal.y5vp_audito_iv.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments),this.getRouter().initialize(),this.setModel(i.createDeviceModel(),"device")}})});',"portal/y5vp_audito_iv/controller/Default.controller.js":'sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("portal.y5vp_audito_iv.controller.Default",{onBeforeRebindTable:function(e){for(var t=e.getParameter("bindingParams"),r=this.getView().byId("smartFilterBar"),i=r.getControlByKey("MyOwnFilterField"),l=i.getSelectedKeys(),a=0;a<l.length;a++){var o=new sap.ui.model.Filter("Status",sap.ui.model.FilterOperator.EQ,l[a]);t.filters.push(o)}var n=r.getControlByKey("FilterRela"),s=n.getSelectedKey(),u=new sap.ui.model.Filter("Tipoinv",sap.ui.model.FilterOperator.EQ,s);t.filters.push(u)}})});',"portal/y5vp_audito_iv/model/models.js":'sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);return i.setDefaultBindingMode("OneWay"),i}}});',"portal/y5vp_audito_iv/view/Default.view.xml":'<mvc:View controllerName="portal.y5vp_audito_iv.controller.Default" xmlns:html="http://www.w3.org/1999/xhtml" xmlns:mvc="sap.ui.core.mvc"\n\tdisplayBlock="true" xmlns="sap.m" xmlns:smartFilterBar="sap.ui.comp.smartfilterbar" xmlns:smartTable="sap.ui.comp.smarttable" height="100%"\n\txmlns:core="sap.ui.core"><App id="idAppControl"><pages><Page title="{i18n>title}"><content><VBox fitContainer="true"><smartFilterBar:SmartFilterBar id="smartFilterBar" entitySet="AuditoriaSet" persistencyKey="SmartFilter_Explored"\n\t\t\t\t\t\t\tbeforeVariantFetch="onBeforeVariantFetch"><smartFilterBar:controlConfiguration><smartFilterBar:ControlConfiguration key="Werks" visibleInAdvancedArea="true" preventInitialDataFetchInValueHelpDialog="false"\n\t\t\t\t\t\t\t\t\tmandatory="mandatory"><smartFilterBar:defaultFilterValues><smartFilterBar:SelectOption low="3001" high="3999" operator="BT"></smartFilterBar:SelectOption></smartFilterBar:defaultFilterValues></smartFilterBar:ControlConfiguration><smartFilterBar:ControlConfiguration key="Gjahr" visibleInAdvancedArea="true" preventInitialDataFetchInValueHelpDialog="false"\n\t\t\t\t\t\t\t\t\tmandatory="mandatory"><smartFilterBar:defaultFilterValues><smartFilterBar:SelectOption low="2018"></smartFilterBar:SelectOption></smartFilterBar:defaultFilterValues></smartFilterBar:ControlConfiguration><smartFilterBar:ControlConfiguration key="Bldat" controlType="date" visibleInAdvancedArea="true" mandatory="mandatory" label="Data do documento"></smartFilterBar:ControlConfiguration><smartFilterBar:ControlConfiguration key="ReleaseDate" controlType="date" visibleInAdvancedArea="true"></smartFilterBar:ControlConfiguration><smartFilterBar:ControlConfiguration groupId="_BASIC" index="1" key="MyOwnFilterField" visibleInAdvancedArea="true" label="Status"\n\t\t\t\t\t\t\t\t\twidth="250px"><smartFilterBar:customControl><MultiComboBox id="idSticky" selectedKeys="L,P,I,R,N"><items><core:Item text="Liberado" key="L"/><core:Item text="Pendentes" key="P"/><core:Item text="Interrompido" key="I"/><core:Item text="Rejeitado" key="R"/><core:Item text="Não disponíveis no portal" key="N"/></items></MultiComboBox></smartFilterBar:customControl></smartFilterBar:ControlConfiguration><smartFilterBar:ControlConfiguration groupId="_BASIC1" index="0" key="FilterRela" visibleInAdvancedArea="true" label="Tipo.Rel"><smartFilterBar:customControl><Select id="IdTipoRel"><core:Item key="IM" text="Inventário IM"/><core:Item key="WM" text="Inventário WM"/></Select></smartFilterBar:customControl></smartFilterBar:ControlConfiguration></smartFilterBar:controlConfiguration><smartFilterBar:layoutData><FlexItemData shrinkFactor="0"/></smartFilterBar:layoutData></smartFilterBar:SmartFilterBar><smartTable:SmartTable id="oSmartTable" entitySet="AuditoriaSet" smartFilterId="smartFilterBar" tableType="Table" useExportToExcel="true"\n\t\t\t\t\t\t\tbeforeExport="onBeforeExport" useVariantManagement="true" useTablePersonalisation="true" header="Line Items" showRowCount="true"\n\t\t\t\t\t\t\tpersistencyKey="SmartTableAnalytical_Explored" beforeRebindTable="onBeforeRebindTable" initiallyVisibleFields="Werks,Name1"\n\t\t\t\t\t\t\tenableAutoBinding="false" demandPopin="true" class="sapUiResponsiveContentPadding"><smartTable:layoutData><FlexItemData growFactor="1" baseSize="0%"/></smartTable:layoutData></smartTable:SmartTable></VBox></content></Page></pages></App></mvc:View>',"portal/y5vp_audito_iv/i18n/i18n_pt.properties":"title=Relatório auditoria - Documentos de Inventário\nappTitle=Relatório auditoria IV\nappDescription=Relatório auditoria - Documentos de Inventário","portal/y5vp_audito_iv/i18n/i18n.properties":"title=Relatório auditoria - Documentos de Inventário\nappTitle=Relatório auditoria - Documentos de Inventário\nappDescription=Relatório auditoria - Documentos de Inventário","portal/y5vp_audito_iv/manifest.json":'{"_version":"1.8.0","sap.app":{"id":"portal.y5vp_audito_iv","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"1.0.0"},"title":"{{appTitle}}","description":"{{appDescription}}","sourceTemplate":{"id":"servicecatalog.connectivityComponentForManifest","version":"0.0.0"},"dataSources":{"ZGWFBGL_AUDITORIA_MM_IV_SRV":{"uri":"/sap/opu/odata/sap/ZGWFBGL_AUDITORIA_MM_IV_SRV/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true},"supportedThemes":["sap_hcb","sap_belize"]},"sap.ui5":{"rootView":{"viewName":"portal.y5vp_audito_iv.view.Default","type":"XML"},"dependencies":{"minUI5Version":"1.30.0","libs":{"sap.ui.layout":{},"sap.ui.core":{},"sap.m":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"portal.y5vp_audito_iv.i18n.i18n"}},"":{"uri":"/sap/opu/odata/sap/ZGWFBGL_AUDITORIA_MM_IV_SRV/","type":"sap.ui.model.odata.v2.ODataModel","settings":{"defaultBindingMode":"TwoWay","defaultCountMode":"Inline","refreshAfterChange":false},"dataSource":"ZGWFBGL_AUDITORIA_MM_IV_SRV","preload":true}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"portal.y5vp_audito_iv.view","controlAggregation":"pages","controlId":"idAppControl","clearControlAggregation":false},"routes":[{"name":"RouteDefault","pattern":"RouteDefault","target":["TargetDefault"]}],"targets":{"TargetDefault":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewName":"Default"}}}},"sap.platform.abap":{"uri":"/sap/bc/ui5_ui5/sap/y5vp_audito_iv/","_version":"1.1.0"}}'}});