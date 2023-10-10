sap.ui.require.preload({"workspace/ztotemlistapicking/Component.js":'sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","workspace/ztotemlistapicking/model/models"],function(e,t,i){"use strict";return e.extend("workspace.ztotemlistapicking.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments),this.getRouter().initialize(),this.setModel(i.createDeviceModel(),"device")}})});',"workspace/ztotemlistapicking/controller/ListaPicking.controller.js":'sap.ui.define(["sap/m/Button","sap/m/Dialog","sap/m/Label","sap/m/MessageToast","sap/m/Text","sap/m/TextArea","sap/m/MessageBox","sap/ui/model/json/JSONModel","sap/ui/model/resource/ResourceModel","sap/ui/model/Filter","sap/ui/core/mvc/Controller","sap/m/Token","sap/m/MessagePopover"],function(e,t,s,r,a,i,o,l,n,g,p,d,u){"use strict";return p.extend("workspace.ztotemlistapicking.controller.ListaPicking",{onInit:function(){let e=this.getView(),t=new l({});e.setModel(t,"PKGLST");var s=this.getView().byId("idMultiInputLabelNumber");s.setWidth("500px");s.addValidator(function(e){var t=e.text;return new d({key:t,text:t})});var r=new sap.ui.model.json.JSONModel({bHideColumn:!0});this.getView().setModel(r,"viewProperties");let a=this.getView().getModel("GE"),i=new sap.m.MessagePopoverItem({type:"{type}",title:"{title}",description:"{description}",subtitle:"{subtitle}",counter:"{counter}"}),n=new u({items:{path:"/",template:i}}),g=this;g._MessagePopover=n,a.attachRequestCompleted(function(e){e.getParameters().response&&e.getParameters().response.headers&&e.getParameters().response.headers["sap-message"]&&g._handleResponseMessage(e,g)}),a.attachRequestFailed(function(t){if(!t.getParameters().success){let s=t.getParameters().response;if(s){let t=JSON.parse(s.responseText);t.error.innererror?(o.error(t.error.innererror.errordetails[0].message,{styleClass:"sapUiSizeCompact"}),e.getModel("GE").resetChanges()):o.error(t.error.message.value,{styleClass:"sapUiSizeCompact"})}}},this)},_handleResponseMessage:function(e,t){let s=new l,a=[],i=JSON.parse(e.getParameters().response.headers["sap-message"]),o={};i.severity=i.severity.charAt(0).toUpperCase()+i.severity.slice(1),o.type=i.severity,o.title=i.message,o.description=i.message,o.subtitle=i.code,o.counter=1,a.push(o);for(let e of i.details)o={},e.severity=e.severity.charAt(0).toUpperCase()+e.severity.slice(1),o.type=e.severity,o.title=e.message,o.description=e.message,o.subtitle=e.code,o.counter=1,a.push(o);s.setData(a),t._MessagePopover.setModel(s);var n=new l;if(n.setData({messagesLength:a.length+""}),t.getView().setModel(n),a.length>0){let e=t.getView().getModel("i18n").getResourceBundle();r.show(e.getText("check_messages"))}},handlePopoverPress:function(e){this._MessagePopover.toggle(e.getSource())},_onSearch:function(e){let t=this.byId("idSelCatPkg"),s=this.byId("idMultiInputLabelNumber"),r=this.getView().getModel("i18n").getResourceBundle(),a=[];if(!t.getSelectedItem())return t.setValueState("Error"),void t.setValueStateText(r.getText("input_required"));if(t.setValueState("None"),0===s.getTokens().length)return s.setValueState("Error"),void s.setValueStateText(r.getText("input_required"));s.setValueState("None"),a.push(new sap.ui.model.Filter("Catpkg",sap.ui.model.FilterOperator.EQ,t.getSelectedItem().getKey()));for(let e of s.getTokens())""!==e.getKey()&&a.push(new sap.ui.model.Filter("Docpkg",sap.ui.model.FilterOperator.EQ,e.getKey()));this.byId("idTablePicking").getBinding("items").filter(a);let i=this.getView().getModel("viewProperties");"01"===t.getSelectedItem().getKey()?i.setProperty("/bHideColumn",!1):i.setProperty("/bHideColumn",!0)},handleSalvar:function(e){var t=this.getView(),s=t.getModel("i18n").getResourceBundle(),r=t.getModel("GE"),a=t.byId("idTablePicking"),i=(a.getItems(),!1),l=!1;let n=a.getSelectedContexts();for(let e of n){let t=e.getProperty("QtdPicking"),s=e.getProperty("QtdOriginal");e.getProperty("Editavel")?(l=!0,parseFloat(t)>parseFloat(s)&&(i=!0)):(l=!0,"1")}if(!l)return void o.error(s.getText("errorNoneRegisterSelected"),{title:s.getText("error"),styleClass:"sapUiSizeCompact"});if(i)return void o.error(s.getText("errorQtdePickingInvalid"),{title:s.getText("error"),styleClass:"sapUiSizeCompact"});a.setBusy(!0);var g={success:(e,t)=>{if(e){if(e.__batchResponses[0]){let t=e.__batchResponses[0],r="";for(let e of t.__changeResponses)e.data&&(r=e.data.Idpkg);r&&o.success(s.getText("PickingListCreated")+" "+r,{styleClass:"sapUiSizeCompact"})}else o.success(s.getText("RecordedData"),{styleClass:"sapUiSizeCompact"});this._limparTela()}a.setBusy(!1)},error:(e,t)=>{o.error(s.getText("ErrorRecordedData"),{styleClass:"sapUiSizeCompact"}),a.setBusy(!1)}};let p=[];for(let e of n){let t=r.createEntry("ZET_VCMM_PICKINGSet");r.setProperty(t.getPath()+"/Docpkg",e.getProperty("Docpkg").substring(12,2)),r.setProperty(t.getPath()+"/Itmpkg",e.getProperty("Itmpkg")),r.setProperty(t.getPath()+"/Catpkg",e.getProperty("Catpkg")),r.setProperty(t.getPath()+"/Werks",e.getProperty("Werks")),r.setProperty(t.getPath()+"/Matnr",e.getProperty("Matnr")),r.setProperty(t.getPath()+"/Menge",e.getProperty("QtdPicking")),r.setProperty(t.getPath()+"/Meins",e.getProperty("Meins")),r.setProperty(t.getPath()+"/Aufnr",e.getProperty("Aufnr")),p.push(e.getPath())}p.length>0&&r.resetChanges(p),r.submitChanges(g)},handleCancelar:function(e){this._limparTela()},_limparTela:function(){let e=this.byId("idMultiInputLabelNumber"),t=this.byId("idTablePicking");e.removeAllTokens(),t.getBinding("items").filter([])},_onReset:function(){this._limparTela()}})});',"workspace/ztotemlistapicking/model/models.js":'sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);return i.setDefaultBindingMode("OneWay"),i}}});',"workspace/ztotemlistapicking/serviceBinding.js":'function initModel(){var a=new sap.ui.model.odata.ODataModel("/SSO_IDP_GW_FI1/sap/opu/odata/sap/ZGWVCMM_GESTAO_ESTOQUE_SRV/",!0);sap.ui.getCore().setModel(a)}',"workspace/ztotemlistapicking/view/ListaPicking.view.xml":'<mvc:View controllerName="workspace.ztotemlistapicking.controller.ListaPicking" xmlns:html="http://www.w3.org/1999/xhtml"\n\tdisplayBlock="true" xmlns:mvc="sap.ui.core.mvc" xmlns:core="sap.ui.core" xmlns:layout="sap.ui.layout" xmlns="sap.m" xmlns:f="sap.f"\n\txmlns:fb="sap.ui.comp.filterbar" xmlns:vm="sap.ui.comp.variants"><Shell id="shell"><App id="app"><pages><f:DynamicPage id="dynamicPageId" headerExpanded="true" class="sapUiSizeCozi" showFooter="true"><f:title><f:DynamicPageTitle><f:heading><Title text="{i18n>TitlePage}"/></f:heading></f:DynamicPageTitle></f:title><f:header><f:DynamicPageHeader pinnable="true"><f:content><fb:FilterBar id="filterbar" reset="onReset" search="_onSearch" useToolbar="false" showGoOnFB="true"><fb:filterGroupItems ><fb:FilterGroupItem label="{i18n>TooltipSelect}" name="ipCatPkg" groupName="gpFilter01" visibleInFilterBar="true"><fb:control><Select id="idSelCatPkg" forceSelection="false" items="{ path: \'GE>/ZET_VCMM_CATPKG_IHSet\', sorter: { path: \'Description\' } }"><core:Item key="{GE>Catpkg}" text="{GE>Description}"/></Select></fb:control></fb:FilterGroupItem><fb:FilterGroupItem label="{i18n>SearchDocumento}" name="MiDocPkg" groupName="gpFilter01" visibleInFilterBar="true"><fb:control><MultiInput id="idMultiInputLabelNumber" showValueHelp="false" enableMultiLineMode="true" required="true" type="Number"></MultiInput></fb:control></fb:FilterGroupItem></fb:filterGroupItems></fb:FilterBar></f:content></f:DynamicPageHeader></f:header><f:content><Table noDataText="{i18n>data_not_found}" id="idTablePicking" showNoData="true" fixedLayout="false" mode="MultiSelect"\n\t\t\t\t\t\t\titems="{ path: \'GE>/ZET_VCMM_LISTA_PICKINGSet\'}" growing="true" growingThreshold="100" growingScrollToLoad="true" busyIndicatorDelay="0"><items ><ColumnListItem type="Active" id="tableitem2" selected="{GE>IndSelecao}"><cells><Text text="{path: \'GE>Docpkg\', type : \'sap.ui.model.odata.type.String\', constraints: { isDigitSequence : true, maxLength : 10 }}"\n\t\t\t\t\t\t\t\t\t\t\tid="text9" width="auto"/><Text text="{path: \'GE>Itmpkg\', type : \'sap.ui.model.odata.type.String\', constraints: { isDigitSequence : true, maxLength : 6 }}"\n\t\t\t\t\t\t\t\t\t\t\tid="text10" width="auto"/><Text text="{GE>Aufnr}" id="idTxtAufnr" width="auto"/><Text text="{GE>Werks}" id="text11" width="auto"/><ObjectIdentifier title="{GE>Maktx}" text="{GE>Matnr}"/><Input value="{GE>QtdPicking}" type="Number" id="QtdePicking" width="100px" editable="{Editavel}"/><Text text="{GE>QtdOriginal}" id="text14" width="auto"/><Text text="{GE>MeinsExt}" id="text15" width="auto"/><Text text="{GE>QtdDisponivel}" id="text16" width="auto"/><Text text="{ path: \'GE>Bdter\' , type:\'sap.ui.model.type.Date\', formatOptions: {style: \'short\'}}" id="idTxtBdter" width="auto"/></cells></ColumnListItem></items><columns><Column id="column7"><Label text="{i18n>ColDocumento}" id="label7" width="auto"/></Column><Column id="column8"><Label text="{i18n>ColItem}" id="label8" width="auto"/></Column><Column id="idColAufnr" demandPopin="true" minScreenWidth="Large" popinDisplay="Inline" visible="{viewProperties>/bHideColumn}"><Label text="{i18n>ColAufnr}" id="idLblAufnr" width="auto"/></Column><Column id="column9" demandPopin="true" minScreenWidth="Large" popinDisplay="Inline"><Label text="{i18n>ColCentro}" id="label9" width="auto"/></Column><Column id="column10" demandPopin="true" minScreenWidth="Large" popinDisplay="Inline"><Label text="{i18n>ColMaterial}" id="label10" width="auto"/></Column><Column id="column11" demandPopin="true" minScreenWidth="Large" popinDisplay="Inline"><Label text="{i18n>ColQtdePicking}" id="label11" width="auto"/></Column><Column id="column12" demandPopin="true" minScreenWidth="Large" popinDisplay="Inline"><Label text="{i18n>ColQtdeDocumento}" id="label12" width="auto"/></Column><Column id="column13" demandPopin="true" minScreenWidth="Large"  popinDisplay="Inline"><Label text="{i18n>ColUnidadeMedida}" id="label13" width="auto"/></Column><Column id="column15" demandPopin="true" minScreenWidth="Large"  popinDisplay="Inline"><Label text="{i18n>ColQtdDispo}" id="label15" width="auto"/></Column><Column id="idColBdter" demandPopin="true" minScreenWidth="Large" popinDisplay="Inline" visible="{viewProperties>/bHideColumn}"><Label text="{i18n>ColBdter}" id="idLblBdter" width="auto"/></Column></columns></Table></f:content><f:footer><OverflowToolbar><Button type="Emphasized" text="{/messagesLength}" press="handlePopoverPress" icon="sap-icon://message-popup"/><ToolbarSpacer/><Button type="Accept" text="{i18n>BtnSalvar}" press="handleSalvar"/></OverflowToolbar></f:footer></f:DynamicPage></pages></App></Shell></mvc:View>',"workspace/ztotemlistapicking/i18n/i18n_en.properties":"title=Picking List\r\nappTitle=Picking List\r\nappDescription=Picking List\r\n\r\nTitlePage=Inventory Management - Picking List\r\n\r\nTooltipSelect=Select a document type\r\nTxtSelectNone=Select a document type\r\nTxtSelectRemessa=Delivery\r\nTxtSelectReserva=Reservation\r\nSearchDocumento=Search by document\r\nColSelecao=Selection\r\nColDocumento=Document\r\nColItem=Item\r\nColCentro=Werks\r\nColMaterial=Material\r\nColQtdePicking=Quantity picking\r\nColQtdeDocumento=Quantity document\r\nColUnidadeMedida=Unit of Measure\r\nColQtdDispo=Stock\r\nBtnCancelar=Cancel\r\nBtnSalvar=Save\r\n\r\nerrorNoneRegisterSelected=Select at least one record\r\nerror=Error\r\nerrorQtdePickingInvalid=Picking quantity can not be greater than the document, check for errors\r\nRecordedData=Information updated successfully\r\nErrorRecordedData=Error updating info\r\nerrorNoneRegisterFound=No records found in the search\r\nerrorSearchDocument=Error in the search by document","workspace/ztotemlistapicking/i18n/i18n_pt_BR.properties":"title=Lista Picking\r\nappTitle=Lista Picking\r\nappDescription=Lista Picking\r\n\r\nTitlePage=Lista Picking\r\n\r\nTooltipSelect=Selecionar um tipo de documento\r\nTxtSelectNone=Selecionar um tipo de documento\r\nTxtSelectRemessa=Remessa\r\nTxtSelectReserva=Reserva\r\nSearchDocumento=Procurar por documento\r\nColSelecao=Seleção\r\nColDocumento=Documento\r\nColItem=Item\r\nColCentro=Centro\r\nColMaterial=Material\r\nColQtdePicking=Qtde picking\r\nColQtdeDocumento=Qtde documento\r\nColUnidadeMedida=Unidade medida\r\nBtnCancelar=Cancelar\r\nBtnSalvar=Salvar\r\n\r\nerrorNoneRegisterSelected=Selecionar ao menos um registro\r\nerror=Erro\r\nerrorQtdePickingInvalid=Quantidade picking não pode ser maior que a do documento, verificar erros\r\nRecordedData=Informações atualizadas com sucesso\r\nErrorRecordedData=Erro ao atualizar informações\r\nerrorNoneRegisterFound=Nenhum registro encontrado na consulta\r\nerrorSearchDocument=Erro na consulta por documento\r\ninput_required=Campo obrigatório\r\ndata_not_found=Dados não encontrados\r\nColBdter=Data Necessidade\r\nColAufnr=Ordem\r\nPickingListCreated=Lista Picking Criada:","workspace/ztotemlistapicking/i18n/i18n_pt.properties":"title=Lista Picking\r\nappTitle=Lista Picking\r\nappDescription=Lista Picking\r\n\r\nTitlePage=Lista Picking\r\n\r\nTooltipSelect=Selecionar um tipo de documento\r\nTxtSelectNone=Selecionar um tipo de documento\r\nTxtSelectRemessa=Remessa\r\nTxtSelectReserva=Reserva\r\nSearchDocumento=Procurar por documento\r\nColSelecao=Seleção\r\nColDocumento=Documento\r\nColItem=Item\r\nColCentro=Centro\r\nColMaterial=Material\r\nColQtdePicking=Qtd.Pic.\r\nColQtdeDocumento=Qtd.Doc.\r\nColUnidadeMedida=U.M.\r\nColQtdDispo=Estoque\r\nBtnCancelar=Cancelar\r\nBtnSalvar=Salvar\r\n\r\nerrorNoneRegisterSelected=Selecionar ao menos um registro\r\nerror=Erro\r\nerrorQtdePickingInvalid=Quantidade picking não pode ser maior que a do documento, verificar erros\r\nRecordedData=Informações atualizadas com sucesso\r\nErrorRecordedData=Erro ao atualizar informações\r\nerrorNoneRegisterFound=Nenhum registro encontrado na consulta\r\nerrorSearchDocument=Erro na consulta por documento\r\ninput_required=Campo obrigatório\r\ndata_not_found=Dados não encontrados\r\nColBdter=Data Necessidade\r\nColAufnr=Ordem\r\nPickingListCreated=Lista Picking Criada: \r\ncheck_messages=Verificar Mensagens","workspace/ztotemlistapicking/i18n/i18n.properties":"title=Title\nappTitle=ztotemlistapicking\nappDescription=App Description","workspace/ztotemlistapicking/manifest.json":'{"_version":"1.12.0","sap.app":{"id":"workspace.ztotemlistapicking","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"1.0.0"},"title":"{{appTitle}}","description":"{{appDescription}}","sourceTemplate":{"id":"servicecatalog.connectivityComponentForManifest","version":"0.0.0"},"dataSources":{"ZGWVCMM_GESTAO_ESTOQUE_SRV":{"uri":"/sap/opu/odata/sap/ZGWVCMM_GESTAO_ESTOQUE_SRV/","type":"OData","settings":{"localUri":"localService/metadata.xml"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":false,"rootView":{"viewName":"workspace.ztotemlistapicking.view.ListaPicking","type":"XML","async":true,"id":"ListaPicking"},"dependencies":{"minUI5Version":"1.50.0","libs":{"sap.m":{},"sap.ui.core":{},"sap.ui.layout":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"workspace.ztotemlistapicking.i18n.i18n"}},"GE":{"type":"sap.ui.model.odata.v2.ODataModel","settings":{"loadMetadataAsync":false,"json":true,"bJSON":true,"defaultBindingMode":"TwoWay","defaultCountMode":"Inline","useBatch":true,"refreshAfterChange":false,"disableHeadRequestForToken":true},"dataSource":"ZGWVCMM_GESTAO_ESTOQUE_SRV"}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"workspace.ztotemlistapicking.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"RouteListaPicking","pattern":"RouteListaPicking","target":["TargetListaPicking"]}],"targets":{"TargetListaPicking":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"ListaPicking","viewName":"ListaPicking"}}}},"sap.platform.abap":{"uri":"/sap/bc/ui5_ui5/sap/y5vc_lstpicking/","_version":"1.1.0"}}'},"workspace/ztotemlistapicking/Component-preload");