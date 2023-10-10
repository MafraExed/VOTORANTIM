//@ui5-bundle Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/model/models","Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/controller/ListSelector","Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/controller/ErrorHandler"],function(t,e,s,i,o){"use strict";return t.extend("Y5GL_DHO_FORM3.Y5GL_DHO_FORM3.Component",{metadata:{manifest:"json"},init:function(){this.oListSelector=new i;this._oErrorHandler=new o(this);this.setModel(s.createDeviceModel(),"device");t.prototype.init.apply(this,arguments);this.getRouter().initialize()},destroy:function(){this.oListSelector.destroy();this._oErrorHandler.destroy();t.prototype.destroy.apply(this,arguments)},getContentDensityClass:function(){if(this._sContentDensityClass===undefined){if(jQuery(document.body).hasClass("sapUiSizeCozy")||jQuery(document.body).hasClass("sapUiSizeCompact")){this._sContentDensityClass=""}else if(!e.support.touch){this._sContentDensityClass="sapUiSizeCompact"}else{this._sContentDensityClass="sapUiSizeCozy"}}return this._sContentDensityClass}})});
},
	"Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/controller/App.controller.js":function(){sap.ui.define(["Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/controller/BaseController","sap/ui/model/json/JSONModel"],function(e,t){"use strict";return e.extend("Y5GL_DHO_FORM3.Y5GL_DHO_FORM3.controller.App",{onInit:function(){var e,n,o=this.getOwnerComponent().oListSelector,s=this.getView().getBusyIndicatorDelay();e=new t({busy:true,delay:0});this.setModel(e,"appView");n=function(){e.setProperty("/busy",false);e.setProperty("/delay",s)};this.getOwnerComponent().getModel().metadataLoaded().then(n);this.getOwnerComponent().getModel().attachMetadataFailed(n);o.attachListSelectionChange(function(){this.byId("idAppControl").hideMaster()},this);this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass())}})});
},
	"Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"],function(e,t){"use strict";return e.extend("Y5GL_DHO_FORM3.Y5GL_DHO_FORM3.controller.BaseController",{getRouter:function(){return this.getOwnerComponent().getRouter()},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()},onNavBack:function(){var e=t.getInstance().getPreviousHash();if(e!==undefined){history.go(-1)}else{this.getRouter().navTo("master",{},true)}}})});
},
	"Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/controller/Detail.controller.js":function(){sap.ui.define(["Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/controller/BaseController","sap/ui/model/json/JSONModel","Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/model/formatter","sap/ui/Device"],function(e,t,i,a){"use strict";var n="";return e.extend("Y5GL_DHO_FORM3.Y5GL_DHO_FORM3.controller.Detail",{formatter:i,onInit:function(){var e=new t({busy:false,delay:0});this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched,this);this.setModel(e,"detailView");this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this))},_onMetadataLoaded:function(){var e=this.getView().getBusyIndicatorDelay(),t=this.getModel("detailView");t.setProperty("/delay",0);t.setProperty("/busy",true);t.setProperty("/delay",e)},_onObjectMatched:function(e){var t=e.getParameter("arguments").Infty;var i=e.getParameter("arguments").Subty;n=i;var a=this.getView().byId("list");var r=new sap.ui.model.Filter("Infty",sap.ui.model.FilterOperator.EQ,t);var o=new sap.ui.model.Filter("Subty",sap.ui.model.FilterOperator.EQ,i);a.getBinding("items").filter([r,o])},formatIconList:function(e){var t=jQuery.sap.getModulePath("Y5GL_DHO_FORM3.Y5GL_DHO_FORM3");var i=t+"/Icone/";var a;if(e==="EMP CONSIGNADO"){a=i+"EMPRESTIMO.png";return a}if(e==="ESTAC MOVBUS"){a=i+"ESTACIONAMENTO.png";return a}if(e==="LABORAL"){a=i+"PPRRV.png";return a}if(e==="PASAJE"){a=i+"TRANSPORTE.png";return a}if(e==="REEMBOLSO CURSOS"){a=i+"FORMACAO.png";return a}if(e==="REEMBOLSO EXPATRIADO"){a=i+"ADIANTAMENTO_15.png";return a}if(e==="REEMBOLSO IDIOMA"){a=i+"FORMACAO.png";return a}if(e==="SEGURO DE VIDA"){a=i+"SEGURO_VIDA.png";return a}if(e==="PLANO MEDICO"){a=i+"PLANO_MEDICO.png";return a}return" "},onSelectionChange:function(e){this._showDetail(e.getParameter("listItem")||e.getSource())},_showDetail:function(e){var t=!a.system.phone;var i=e.getBindingContext().getProperty("Infty");var n=e.getBindingContext().getProperty("Subty");this.getRouter().navTo("Detalhe",{Infty:i,Subty:n},t)},formatName:function(e){var t;if(e==="EMP_CONSIGNADO"){t="PRESTAMO"}if(e==="REEMBOLSO MEDICAM"){t="REEMBOLSO MEDICAMENTO"}if(e==="STAC MOVBUS"){t="ESTACIONAMIENTO MOVILIDAD BUS"}if(e==="LABORAL"){t="Reembolso Laboral / Convenio Colectivo"}if(e==="PASAJE"){t="Pasaje Universitario / Asignacion Escolar / Aguinaldo Navideño"}if(e==="PLANO MEDICO"){t="Plan de Salud"}if(e==="SEGURO DE VIDA"){t="Essalud Vida\t"}if(e==="ADELANTO"){t="Adelanto de Gratificación a Solicitud"}if(e==="ADELANTO_SUELDOS"){t="Adelanto de Sueldos"}if(e==="ASIGNACION"){t="Asignación por Fallecimiento"}if(e==="PASAJE_UNIVERSITARIO"){t="Pasaje Universitario"}if(e==="ASIGNACION_ESCOLAR"){t="Asignación Escolar"}if(e==="AGUINALDO_NAVIDENO"){t="Aguinaldo Navideño"}if(!t){t=e}return t}})});
},
	"Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/controller/Detalhe.controller.js":function(){sap.ui.define(["Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/controller/BaseController","sap/ui/model/Filter"],function(e,t){"use strict";return e.extend("Y5GL_DHO_FORM3.Y5GL_DHO_FORM3.controller.Detalhe",{onInit:function(){this.getRouter().getRoute("Detalhe").attachPatternMatched(this._onObjectMatched,this)},_onObjectMatched:function(e){this.getView().getModel().refresh(true);var t=e.getParameter("arguments").Infty;var r=e.getParameter("arguments").Subty;this.getModel("appView").setProperty("/layout","TwoColumnsMidExpanded");this.getModel().metadataLoaded().then(function(){var e=this.getModel().createKey("ZET_GLHR_FORMULARIOS_SUBTIPOSSet",{Infty:t,Subty:r});this._bindView("/"+e)}.bind(this))},_bindView:function(e){this.getView().bindElement({path:e,events:{change:this._onBindingChange.bind(this),dataRequested:function(){},dataReceived:function(){}}})},_onBindingChange:function(){var e=this.getView(),t=e.getElementBinding();if(!t.getBoundContext()){this.getRouter().getTargets().display("detailObjectNotFound");this.getOwnerComponent().oListSelector.clearMasterListSelection();return}},onmodelListContextChange:function(e){var t=this.getView().byId("ComboBukrs").getSelectedKey();var r=this.getView().byId("Infotipo").getValue();var a=this.getView().byId("Subtipo").getValue();var i=this.getView().byId("ComboArea").getSelectedKey();if(r!==""||a!==""){var o=new sap.ui.model.Filter("Bukrs",sap.ui.model.FilterOperator.EQ,t);var n=new sap.ui.model.Filter("Subty",sap.ui.model.FilterOperator.EQ,a);var s=new sap.ui.model.Filter("Infty",sap.ui.model.FilterOperator.EQ,r);var l=new sap.ui.model.Filter("Area",sap.ui.model.FilterOperator.EQ,i);var d=this.getView().byId("UploadCollection");d.getBinding("items").filter([o,s,n,l])}},onBeforeUploadStarts:function(e){var t=this.getView().byId("ComboBukrs").getSelectedKey();var r=this.getView().byId("Infotipo").getValue();var a=this.getView().byId("Subtipo").getValue();var i=this.getView().byId("ComboArea").getSelectedKey();if(r!==""&&a!==""){var o=t+"$"+r+"$"+a+"$"+i+"$"+e.getParameter("fileName");var n=new sap.m.UploadCollectionParameter({name:"slug",value:encodeURIComponent(o)});e.getParameters().addHeaderParameter(n)}else{sap.m.MessageBox.error("No se pudo cargar el archivo.")}},onuploadComplete:function(e){var t=this.getView().byId("ComboBukrs").getSelectedKey();var r=this.getView().byId("Infotipo").getValue();var a=this.getView().byId("Subtipo").getValue();var i=this.getView().byId("ComboArea").getSelectedKey();if(r!==""&&a!==""){var o=new sap.ui.model.Filter("Bukrs",sap.ui.model.FilterOperator.EQ,t);var n=new sap.ui.model.Filter("Infty",sap.ui.model.FilterOperator.EQ,r);var s=new sap.ui.model.Filter("Subty",sap.ui.model.FilterOperator.EQ,a);var l=new sap.ui.model.Filter("Area",sap.ui.model.FilterOperator.EQ,i);var d=this.getView().byId("UploadCollection");d.getBinding("items").filter([o,n,s,l])}sap.m.MessageBox.success("Su formulario se ha adjuntado correctamente.")},onChange:function(e){var t=this.getView().byId("ComboBukrs").getSelectedKey();if(t===""){sap.m.MessageBox.error("Informar a la empresa antes de cargar el archivo.");return}var r=this.getView().byId("ComboArea").getSelectedKey();if(r===""){sap.m.MessageBox.error("Informar al área de RH antes de cargar el archivo.");return}var a=e.getSource();var i=this.getView().getModel();i.refreshSecurityToken();var o=i.oHeaders;var n=o["x-csrf-token"];var s=new sap.m.UploadCollectionParameter({name:"x-csrf-token",value:n});a.addHeaderParameter(s)},onChangeBukrs:function(){var e=this.getView().byId("ComboBukrs").getSelectedKey();if(e!==""){this.getView().byId("ComboArea").setEditable(true)}var t=this.getView().byId("ComboArea").getBinding("items");var r=new sap.ui.model.Filter("Bukrs",sap.ui.model.FilterOperator.EQ,e);t.filter([r])},onchangeArea:function(){var e=this.getView().byId("ComboArea").getSelectedKey();var t=this.getView().byId("ComboBukrs").getSelectedKey();var r=this.getView().byId("Infotipo").getValue();var a=this.getView().byId("Subtipo").getValue();if(e!==""){var i=this.getView().byId("UploadCollection").getBinding("items");var o=new sap.ui.model.Filter("Bukrs",sap.ui.model.FilterOperator.EQ,t);var n=new sap.ui.model.Filter("Area",sap.ui.model.FilterOperator.EQ,e);var s=new sap.ui.model.Filter("Infty",sap.ui.model.FilterOperator.EQ,r);var l=new sap.ui.model.Filter("Subty",sap.ui.model.FilterOperator.EQ,a);i.filter([o,n,s,l])}},onDeleteSelectedItems:function(e){var t=this.getView().byId("UploadCollection");var r=this.getView().getModel();var a=this.getView().byId("ComboArea").getSelectedKey();var i=this.getView().byId("ComboBukrs").getSelectedKey();var o=this.getView().byId("Infotipo").getValue();var n=this.getView().byId("Subtipo").getValue();var s=e.getParameters().item.getProperty("documentId");var l={};var d;d="/ZET_GLHR_DHO_UPLOADSet(Area='"+a+"',Bukrs='"+i+"',Infty='"+o+"',Subty='"+n+"',DocId="+s+")";l.Autor="D";r.update(d,l,{success:function(e,r){sap.m.MessageBox.success("Archivo eliminado correctamente.",{actions:["OK"],onClose:function(e){t.getBinding("items").refresh(true)}})},error:function(e){}})},FormatFalse:function(){return false}})});
},
	"Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/controller/ErrorHandler.js":function(){sap.ui.define(["sap/ui/base/Object","sap/m/MessageBox"],function(e,s){"use strict";return e.extend("Y5GL_DHO_FORM3.Y5GL_DHO_FORM3.controller.ErrorHandler",{constructor:function(e){this._oResourceBundle=e.getModel("i18n").getResourceBundle();this._oComponent=e;this._oModel=e.getModel();this._bMessageOpen=false;this._sErrorText=this._oResourceBundle.getText("errorText");this._oModel.attachMetadataFailed(function(e){var s=e.getParameters();this._showServiceError(s.response)},this);this._oModel.attachRequestFailed(function(e){var s=e.getParameters();if(s.response.statusCode!=="404"||s.response.statusCode===404&&s.response.responseText.indexOf("Cannot POST")===0){this._showServiceError(s.response)}},this)},_showServiceError:function(e){if(this._bMessageOpen){return}this._bMessageOpen=true;s.error(this._sErrorText,{id:"serviceErrorMessageBox",details:e,styleClass:this._oComponent.getContentDensityClass(),actions:[s.Action.CLOSE],onClose:function(){this._bMessageOpen=false}.bind(this)})}})});
},
	"Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/controller/ListSelector.js":function(){sap.ui.define(["sap/ui/base/Object","sap/m/GroupHeaderListItem"],function(t,e){"use strict";return t.extend("Y5GL_DHO_FORM3.Y5GL_DHO_FORM3.controller.ListSelector",{constructor:function(){this._oWhenListHasBeenSet=new Promise(function(t){this._fnResolveListHasBeenSet=t}.bind(this));this.oWhenListLoadingIsDone=new Promise(function(t,e){this._oWhenListHasBeenSet.then(function(i){i.getBinding("items").attachEventOnce("dataReceived",function(n){if(!n.getParameter("data")){e({list:i,error:true})}var s=this.getFirstListItem();if(s){t({list:i,firstListitem:s})}else{e({list:i,error:false})}}.bind(this))}.bind(this))}.bind(this))},setBoundMasterList:function(t){this._oList=t;this._fnResolveListHasBeenSet(t)},getFirstListItem:function(){var t=this._oList.getItems();for(var i=0;i<t.length;i++){if(!(t[i]instanceof e)){return t[i]}}return null},selectAListItem:function(t){this.oWhenListLoadingIsDone.then(function(){var e=this._oList,i;if(e.getMode()==="None"){return}i=e.getSelectedItem();if(i&&i.getBindingContext().getPath()===t){return}e.getItems().some(function(i){if(i.getBindingContext()&&i.getBindingContext().getPath()===t){e.setSelectedItem(i);return true}})}.bind(this),function(){jQuery.sap.log.warning("Could not select the list item with the path"+t+" because the list encountered an error or had no items")})},attachListSelectionChange:function(t,e){this._oWhenListHasBeenSet.then(function(){this._oList.attachSelectionChange(t,e)}.bind(this));return this},detachListSelectionChange:function(t,e){this._oWhenListHasBeenSet.then(function(){this._oList.detachSelectionChange(t,e)}.bind(this));return this},clearMasterListSelection:function(){this._oWhenListHasBeenSet.then(function(){this._oList.removeSelections(true)}.bind(this))}})});
},
	"Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/controller/Master.controller.js":function(){sap.ui.define(["Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/GroupHeaderListItem","sap/ui/Device","Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/model/formatter"],function(t,e,i,r,n,o,a){"use strict";return t.extend("Y5GL_DHO_FORM3.Y5GL_DHO_FORM3.controller.Master",{formatter:a,onInit:function(){var t=this.byId("list"),e=this._createViewModel(),i=t.getBusyIndicatorDelay();this._oList=t;this._oListFilterState={aFilter:[],aSearch:[]};this.setModel(e,"masterView");t.attachEventOnce("updateFinished",function(){e.setProperty("/delay",i)});this.getView().addEventDelegate({onBeforeFirstShow:function(){this.getOwnerComponent().oListSelector.setBoundMasterList(t)}.bind(this)});this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched,this);this.getRouter().attachBypassed(this.onBypassed,this)},onSearch:function(t){if(t.getParameters().refreshButtonPressed){this.onRefresh();return}var e=t.getParameter("query");if(e){this._oListFilterState.aSearch=[new i("DescInfotipo",r.Contains,e)]}else{this._oListFilterState.aSearch=[]}this._applyFilterSearch()},onRefresh:function(){this._oList.getBinding("items").refresh()},onSelectionChange:function(t){this._showDetail(t.getParameter("listItem")||t.getSource())},onBypassed:function(){this._oList.removeSelections(true)},createGroupHeader:function(t){return new n({title:t.text,upperCase:false})},onNavBack:function(){history.go(-1)},_createViewModel:function(){return new e({isFilterBarVisible:false,filterBarLabel:"",delay:0,title:this.getResourceBundle().getText("masterTitleCount",[0]),noDataText:this.getResourceBundle().getText("masterListNoDataText"),sortBy:"DescInfotipo",groupBy:"None"})},_onMasterMatched:function(){this.getOwnerComponent().oListSelector.oWhenListLoadingIsDone.then(function(t){if(t.list.getMode()==="None"){return}var e=t.firstListitem.getBindingContext().getProperty("Infty");var i=t.firstListitem.getBindingContext().getProperty("Subty");this.getRouter().navTo("object",{Infty:e,Subty:i},true)}.bind(this),function(t){if(t.error){return}this.getRouter().getTargets().display("detailNoObjectsAvailable")}.bind(this))},_showDetail:function(t){var e=!o.system.phone;var i=t.getBindingContext().getProperty("Infty");var r=t.getBindingContext().getProperty("Subty");this.getRouter().navTo("object",{Infty:i,Subty:r},e)},_updateListItemCount:function(t){var e;if(this._oList.getBinding("items").isLengthFinal()){e=this.getResourceBundle().getText("masterTitleCount",[t]);this.getModel("masterView").setProperty("/title",e)}},_applyFilterSearch:function(){var t=this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),e=this.getModel("masterView");this._oList.getBinding("items").filter(t,"Application");if(t.length!==0){e.setProperty("/noDataText",this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"))}else if(this._oListFilterState.aSearch.length>0){e.setProperty("/noDataText",this.getResourceBundle().getText("masterListNoDataText"))}},_applyGroupSort:function(t){this._oList.getBinding("items").sort(t)},_updateFilterBar:function(t){var e=this.getModel("masterView");e.setProperty("/isFilterBarVisible",this._oListFilterState.aFilter.length>0);e.setProperty("/filterBarLabel",this.getResourceBundle().getText("masterFilterBarText",[t]))},formatIconList:function(t){var e=jQuery.sap.getModulePath("Y5GL_DHO_FORM3.Y5GL_DHO_FORM3");var i=e+"/Icone/";var r;if(t==="EMP CONSIGNADO"){r=i+"EMPRESTIMO.png";return r}if(t==="ADELANTO"||t==="ADELANTO SUELDOS"||t==="ASIGNACION"||t==="AGUINALDO NAVIDENO"){r=i+"PPRRV.png";return r}if(t==="ESTAC MOVBUS"){r=i+"ESTACIONAMENTO.png";return r}if(t==="LABORAL"){r=i+"PPRRV.png";return r}if(t==="PASAJE"){r=i+"TRANSPORTE.png";return r}if(t==="REEMBOLSO CURSOS"||t==="ASIGNACION ESCOLAR"||t==="PASAJE UNIVERSITARIO"){r=i+"FORMACAO.png";return r}if(t==="REEMBOLSO EXPATRIADO"){r=i+"ADIANTAMENTO_15.png";return r}if(t==="REEMBOLSO IDIOMA"){r=i+"FORMACAO.png";return r}if(t==="SEGURO DE VIDA"){r=i+"SEGURO_VIDA.png";return r}if(t==="PLANO MEDICO"){r=i+"PLANO_MEDICO.png";return r}return" "},formatName:function(t){var e;if(t==="EMP CONSIGNADO"){e="PRESTAMO"}if(t==="REEMBOLSO MEDICAM"){e="REEMBOLSO MEDICAMENTO"}if(t==="ESTAC MOVBUS"){e="ESTACIONAMIENTO MOVILIDAD BUS"}if(t==="LABORAL"){e="Reembolso Laboral / Convenio Colectivo"}if(t==="PASAJE"){e="Pasaje Universitario / Asignacion Escolar / Aguinaldo Navideño"}if(t==="PLANO MEDICO"){e="Plan de Salud"}if(t==="SEGURO DE VIDA"){e="Essalud Vida\t"}if(t==="ADELANTO"){e="Adelanto de Gratificación a Solicitud"}if(t==="ADELANTO SUELDOS"){e="Adelanto de Sueldos"}if(t==="ASIGNACION"){e="Asignación por Fallecimiento"}if(t==="PASAJE UNIVERSITARIO"){e="Pasaje Universitario"}if(t==="ASIGNACION ESCOLAR"){e="Asignación Escolar"}if(t==="AGUINALDO NAVIDENO"){e="Aguinaldo Navideño"}if(!e){e=t}return e}})});
},
	"Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/i18n/i18n.properties":'# This is the resource bundle for FORMULARIOS\n\n#XTIT: Application name\nappTitle=FORMULARIOS\n\n#YDES: Application description\nappDescription=FORMULARIOS\n\n#~~~ Master View ~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTIT: Master view title with placeholder for the number of items\nmasterTitleCount=<ZET_GLHR_FORMULARIOS_BENEFICIOSSet> ({0})\n\n#XTOL: Tooltip for the search field\nmasterSearchTooltip=Enter an <ZET_GLHR_FORMULARIOS_BENEFICIOSSet> name or a part of it.\n\n#XBLI: text for a list with no data\nmasterListNoDataText=No <ZET_GLHR_FORMULARIOS_BENEFICIOSSetPlural> are currently available\n\n#XBLI: text for a list with no data with filter or search\nmasterListNoDataWithFilterOrSearchText=No matching <ZET_GLHR_FORMULARIOS_BENEFICIOSSetPlural> found\n\n\n#~~~ Detail View ~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTIT: Detail view title\ndetailTitle=<ZET_GLHR_FORMULARIOS_BENEFICIOSSet>\n\n#XTOL: Icon Tab Bar Info\ndetailIconTabBarInfo=Info\n\n#XTOL: Icon Tab Bar Attachments\ndetailIconTabBarAttachments=Attachments\n\n#XTIT: Send E-Mail subject\nshareSendEmailObjectSubject=<Email subject including object identifier PLEASE REPLACE ACCORDING TO YOUR USE CASE> {0}\n\n#YMSG: Send E-Mail message\nshareSendEmailObjectMessage=<Email body PLEASE REPLACE ACCORDING TO YOUR USE CASE> {0} (id: {1})\\r\\n{2}\n\n#~~~ Not Found View ~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTIT: Not found view title\nnotFoundTitle=Not Found\n\n#YMSG: The ZET_GLHR_FORMULARIOS_BENEFICIOSSet not found text is displayed when there is no ZET_GLHR_FORMULARIOS_BENEFICIOSSet with this id\nnoObjectFoundText=This <ZET_GLHR_FORMULARIOS_BENEFICIOSSet> is not available\n\n#YMSG: The ZET_GLHR_FORMULARIOS_BENEFICIOSSet not available text is displayed when there is no data when starting the app\nnoObjectsAvailableText=No <ZET_GLHR_FORMULARIOS_BENEFICIOSSetPlural> are currently available\n\n#YMSG: The not found text is displayed when there was an error loading the resource (404 error)\nnotFoundText=The requested resource was not found\n\n#~~~ Not Available View ~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTIT: Master view title\nnotAvailableViewTitle=<ZET_GLHR_FORMULARIOS_BENEFICIOSSet>\n\n#~~~ Error Handling ~~~~~~~~~~~~~~~~~~~~~~~\n\n#YMSG: Error dialog description\nerrorText=Sorry, a technical error occurred! Please try again later.',
	"Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/localService/mockserver.js":function(){sap.ui.define(["sap/ui/core/util/MockServer"],function(e){"use strict";var t,a="Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/",r=a+"localService/mockdata";return{init:function(){var n=jQuery.sap.getUriParameters(),i=jQuery.sap.getModulePath(r),o=jQuery.sap.getModulePath(a+"manifest",".json"),s="ZET_GLHR_FORMULARIOS_BENEFICIOSSet",u=n.get("errorType"),c=u==="badRequest"?400:500,p=jQuery.sap.syncGetJSON(o).data,f=p["sap.app"].dataSources.mainService,d=jQuery.sap.getModulePath(a+f.settings.localUri.replace(".xml",""),".xml"),g=/.*\/$/.test(f.uri)?f.uri:f.uri+"/";t=new e({rootUri:g});e.config({autoRespond:true,autoRespondAfter:n.get("serverDelay")||1e3});t.simulate(d,{sMockdataBaseUrl:i,bGenerateMissingMockData:true});var l=t.getRequests(),m=function(e,t,a){a.response=function(a){a.respond(e,{"Content-Type":"text/plain;charset=utf-8"},t)}};if(n.get("metadataError")){l.forEach(function(e){if(e.path.toString().indexOf("$metadata")>-1){m(500,"metadata Error",e)}})}if(u){l.forEach(function(e){if(e.path.toString().indexOf(s)>-1){m(c,u,e)}})}t.setRequests(l);t.start();jQuery.sap.log.info("Running the app with mock data")},getMockServer:function(){return t}}});
},
	"Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/manifest.json":'{"_version":"1.9.0","sap.app":{"id":"Y5GL_DHO_FORM3.Y5GL_DHO_FORM3","type":"application","i18n":"i18n/i18n.properties","title":"{{appTitle}}","description":"{{appDescription}}","applicationVersion":{"version":"1.0.0"},"dataSources":{"mainService":{"uri":"/sap/opu/odata/sap/ZGWGLRH_DHO_FORMULARIOS_SRV/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}},"sourceTemplate":{"id":"sap.ui.ui5-template-plugin.2masterdetail","version":"1.52.7"}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://detail-view","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"rootView":{"viewName":"Y5GL_DHO_FORM3.Y5GL_DHO_FORM3.view.App","type":"XML","async":true,"id":"app"},"dependencies":{"minUI5Version":"1.42.0","libs":{"sap.collaboration":{"minVersion":""},"sap.f":{"minVersion":""},"sap.m":{},"sap.ui.core":{},"sap.ushell":{"minVersion":""}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"Y5GL_DHO_FORM3.Y5GL_DHO_FORM3.i18n.i18n"}},"":{"dataSource":"mainService","preload":true}},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","viewPath":"Y5GL_DHO_FORM3.Y5GL_DHO_FORM3.view","controlId":"idAppControl","controlAggregation":"detailPages","bypassed":{"target":["master","notFound"]},"async":true},"routes":[{"pattern":"","name":"master","target":["object","master"]},{"pattern":"ZET_GLHR_FORMULARIOS_BENEFICIOSSet/{Infty}/{Subty}/","name":"object","target":["master","object"]},{"name":"Detalhe","pattern":"Detalhe/{Infty}/{Subty}/","titleTarget":"","greedy":false,"target":["master","Detalhe"]}],"targets":{"master":{"viewName":"Master","viewLevel":1,"viewId":"master","controlAggregation":"masterPages"},"object":{"viewName":"Detail","viewId":"detail","viewLevel":2},"detailObjectNotFound":{"viewName":"DetailObjectNotFound","viewId":"detailObjectNotFound"},"detailNoObjectsAvailable":{"viewName":"DetailNoObjectsAvailable","viewId":"detailNoObjectsAvailable"},"notFound":{"viewName":"NotFound","viewId":"notFound"},"Detalhe":{"viewType":"XML","viewName":"Detalhe","viewId":"Subtipo","viewLevel":3}}}},"sap.platform.abap":{"uri":"/sap/bc/ui5_ui5/sap/y5gl_dho_form3","_version":"1.1.0"}}',
	"Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/model/formatter.js":function(){sap.ui.define([],function(){"use strict";return{currencyValue:function(e){if(!e){return""}return parseFloat(e).toFixed(2)}}});
},
	"Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/view/App.view.xml":'<mvc:View\r\n\tcontrollerName="Y5GL_DHO_FORM3.Y5GL_DHO_FORM3.controller.App"\r\n\txmlns:mvc="sap.ui.core.mvc"\r\n\tdisplayBlock="true"\r\n\tbusy="{appView>/busy}"\r\n\tbusyIndicatorDelay="{appView>/delay}"\r\n\txmlns="sap.m"><SplitApp id="idAppControl" /></mvc:View>',
	"Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/view/Detail.view.xml":'<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"\r\n\tcontrollerName="Y5GL_DHO_FORM3.Y5GL_DHO_FORM3.controller.Detail" xmlns:html="http://www.w3.org/1999/xhtml"><App id="idappbeneficios"><pages><Page id="idPageMaster"><customHeader><Bar id="idBarMaster"><contentMiddle><Title text="DHO Formulários" titleStyle="H3" id="idTitleDependentes"/></contentMiddle></Bar></customHeader><content><List id="list" width="auto" class="sapFDynamicPageAlignContent" items="{ path: \'/ZET_GLHR_FORMULARIOS_SUBTIPOSSet\'}"\r\n\t\t\t\t\t\tbusyIndicatorDelay="{masterView>/delay}" noDataText="{masterView>/noDataText}"\r\n\t\t\t\t\t\tmode="{= ${device>/system/phone} ? \'None\' : \'SingleSelectMaster\'}" growing="true" growingScrollToLoad="true"\r\n\t\t\t\t\t\tupdateFinished=".onUpdateFinished" selectionChange=".onSelectionChange" itemPress=".onSelectionChange"><items><ObjectListItem type="Navigation" press=".onSelectionChange" title="{path: \'DescSubtipo\', formatter:\'.formatName\'}" icon="{path: \'DescSubtipo\', formatter:\'.formatIconList\'}"\r\n\t\t\t\t\t\t\t\thighlight="Information" id="idObjectListItem"></ObjectListItem></items></List><Button text="Voltar" width="100%" id="__button0" type="Back" press="voltarsuccesss" visible="false" iconFirst="true"/></content></Page></pages></App></mvc:View>',
	"Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/view/DetailNoObjectsAvailable.view.xml":'<mvc:View\r\n\tcontrollerName="Y5GL_DHO_FORM3.Y5GL_DHO_FORM3.controller.BaseController"\r\n\txmlns:mvc="sap.ui.core.mvc"\r\n\txmlns="sap.m"><MessagePage\r\n\t\tid="page"\r\n\t\ttitle="{i18n>notAvailableViewTitle}"\r\n\t\ttext="{i18n>noObjectsAvailableText}"\r\n\t\ticon="{sap-icon://product}"\r\n\t\tdescription=""\r\n\t\tshowNavButton="{device>/system/phone}"\r\n\t\tnavButtonPress="onNavBack"></MessagePage></mvc:View>',
	"Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/view/DetailObjectNotFound.view.xml":'<mvc:View\r\n\tcontrollerName="Y5GL_DHO_FORM3.Y5GL_DHO_FORM3.controller.BaseController"\r\n\txmlns:mvc="sap.ui.core.mvc"\r\n\txmlns="sap.m"><MessagePage\r\n\t\tid="page"\r\n\t\ttitle="{i18n>detailTitle}"\r\n\t\ttext="{i18n>noObjectFoundText}"\r\n\t\ticon="{sap-icon://product}"\r\n\t\tdescription=""\r\n\t\tshowNavButton="{device>/system/phone}"\r\n\t\tnavButtonPress="onNavBack"></MessagePage></mvc:View>',
	"Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/view/Detalhe.view.xml":'<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" xmlns:f="sap.ui.layout.form"\r\n\tcontrollerName="Y5GL_DHO_FORM3.Y5GL_DHO_FORM3.controller.Detalhe" xmlns:html="http://www.w3.org/1999/xhtml"><App id="app"><pages><Page id="IdPageDetailDep" floatingFooter="true"><customHeader><Bar id="idBarMaster"><contentMiddle><Title text="DHO Formularios" titleStyle="H3" id="idTitleDependentes"/></contentMiddle></Bar></customHeader><content><f:Form id="FormChange480_12120" editable="true"><f:layout><f:ResponsiveGridLayout id="idResp" labelSpanXL="4" labelSpanL="4" labelSpanM="12" labelSpanS="12" adjustLabelSpan="false" emptySpanXL="0"\r\n\t\t\t\t\t\t\t\temptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="2" columnsM="1" singleContainerFullSize="false"/></f:layout><f:formContainers><f:FormContainer id="Container"><f:formElements><f:FormElement id="idEmpresa" label="Empresa"><f:fields><ComboBox id="ComboBukrs" selectedKey="{Bukrs}" required="true" placeholder="Informar a la empresa antes de adjuntar el formulario"\r\n\t\t\t\t\t\t\t\t\t\t\t\titems="{path: \'/ZET_GLHR_BUKRSSet\'}" editable="true" change="onChangeBukrs"><core:Item key="{Bukrs}" text="{Bukrs} - {Butxt}" id="idItemComboBukrs"/></ComboBox></f:fields></f:FormElement><f:FormElement id="idArea" label="División de personal"><f:fields><ComboBox id="ComboArea" selectedKey="{Persa}" required="true" placeholder="Informar al área de RH antes de adjuntar el formulario"\r\n\t\t\t\t\t\t\t\t\t\t\t\titems="{path: \'/ZET_GLHR_AREASet\'}" editable="{path:\'Bukrs\', formatter:\'.FormatFalse\'}" change="onchangeArea"><core:Item key="{Persa}" text="{Persa} - {Name1}" id="idItemComboArea"/></ComboBox></f:fields></f:FormElement><f:FormElement id="idElemento" label="Infotipo" visible="false"><f:fields><Input value="{Infty}" id="Infotipo" editable="true"/></f:fields></f:FormElement><f:FormElement label="Subtipo" id="idGrau" visible="false"><f:fields><Input value="{Subty}" id="Subtipo" editable="false"/></f:fields></f:FormElement><f:FormElement id="IdonAddDoc" label="Para agregar/cambiar archivos adjuntos, seleccione el botón ( + )"><f:fields><UploadCollection id="UploadCollection" multiple="false" change="onChange" fileDeleted="onDeleteSelectedItems"\r\n\t\t\t\t\t\t\t\t\t\t\t\tbeforeUploadStarts="onBeforeUploadStarts" uploadComplete="onuploadComplete"\r\n\t\t\t\t\t\t\t\t\t\t\t\titems="{ path: \'/ZET_GLHR_DHO_UPLOADSet\', templateShareable: true }" modelContextChange="onmodelListContextChange" mode="SingleSelectMaster"\r\n\t\t\t\t\t\t\t\t\t\t\t\tuploadButtonInvisible="false" uploadUrl="/sap/opu/odata/sap/ZGWGLRH_DHO_FORMULARIOS_SRV/ZET_GLHR_DHO_UPFILESet"\r\n\t\t\t\t\t\t\t\t\t\t\t\tnoDataDescription="Para agregar/cambiar archivos adjuntos, seleccione el botón ( + )" noDataText="Esperando nuevas cargas"\r\n\t\t\t\t\t\t\t\t\t\t\t\tnumberOfAttachmentsText="Anexos"><toolbar><OverflowToolbar id="myId" visible="true"><Title id="attachmentTitle"/><ToolbarSpacer id="idToolbarSpacer"/><SearchField width="10rem" search="onSearch" enabled="false" visible="false" id="idSearchField"/><Button id="deleteSelectedButton" text="Delete" press="onDeleteSelectedItems" enabled="false" visible="false" type="Transparent"/><ToggleButton id="selectAllButton" text="Select all" press="onSelectAllPress" enabled="false" visible="false" type="Transparent"/><UploadCollectionToolbarPlaceholder id="IdUploadCollectionToolbar"/></OverflowToolbar></toolbar><items><UploadCollectionItem documentId="{DocId}" fileName="{Filename}" mimeType="{Mimetype}"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\turl="/sap/opu/odata/sap/ZGWGLRH_DHO_FORMULARIOS_SRV/ZET_GLHR_DHO_UPFILESet(\'{Infty}${Subty}${DocId}${Bukrs}${Area}\')/$value"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tenableEdit="false" visibleEdit="false" deletePress="onFileDelete" selected="true"/></items></UploadCollection></f:fields></f:FormElement></f:formElements></f:FormContainer></f:formContainers></f:Form></content></Page></pages></App></mvc:View>',
	"Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/view/Master.view.xml":'<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"\r\n\tcontrollerName="Y5GL_DHO_FORM3.Y5GL_DHO_FORM3.controller.Master" xmlns:html="http://www.w3.org/1999/xhtml"><App id="idappbeneficios"><pages><Page id="idPageMaster"><customHeader><Bar id="idBarMaster"><contentMiddle><core:Icon src="sap-icon://home" id="icon"/><Link text="Página de inicio" href="#Shell-home" id="Pagina"/></contentMiddle></Bar></customHeader><content><List id="list" width="auto" class="sapFDynamicPageAlignContent" items="{ path: \'/ZET_GLHR_FORMULARIOS_BENEFICIOSSet\'}"\r\n\t\t\t\t\t\tbusyIndicatorDelay="{masterView>/delay}" noDataText="{masterView>/noDataText}"\r\n\t\t\t\t\t\tmode="{= ${device>/system/phone} ? \'None\' : \'SingleSelectMaster\'}" growing="true" growingScrollToLoad="true"\r\n\t\t\t\t\t\tupdateFinished=".onUpdateFinished" selectionChange=".onSelectionChange" itemPress=".onSelectionChange"><items><ObjectListItem type="Navigation" press=".onSelectionChange" title="{path: \'Beneficio\', formatter:\'.formatName\'}" icon="{path: \'Beneficio\', formatter:\'.formatIconList\'}"\r\n\t\t\t\t\t\t\t\thighlight="Information" id="idObjectListItem"></ObjectListItem></items></List><Button text="Voltar" width="100%" id="__button0" type="Back" press="voltarsuccesss" visible="false" iconFirst="true"/></content></Page></pages></App></mvc:View>',
	"Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/view/NotFound.view.xml":'<mvc:View\r\n\tcontrollerName="Y5GL_DHO_FORM3.Y5GL_DHO_FORM3.controller.BaseController"\r\n\txmlns:mvc="sap.ui.core.mvc"\r\n\txmlns="sap.m"><MessagePage\r\n\t\tid="page"\r\n\t\ttitle="{i18n>notFoundTitle}"\r\n\t\ttext="{i18n>notFoundText}"\r\n\t\ticon="{sap-icon://document}"\r\n\t\tdescription=""\r\n\t\tshowNavButton="{device>/system/phone}"\r\n\t\tnavButtonPress="onNavBack"></MessagePage></mvc:View>',
	"Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/view/ViewSettingsDialog.fragment.xml":'<core:FragmentDefinition\r\n\txmlns="sap.m"\r\n\txmlns:core="sap.ui.core"><ViewSettingsDialog\r\n\t\tid="viewSettingsDialog"\r\n\t\tconfirm="onConfirmViewSettingsDialog"\r\n\t\tresetFilters="onViewSettingsDialogResetFilters"><filterItems><ViewSettingsFilterItem\r\n\t\t\t\tid="filterItems"\r\n\t\t\t\ttext="{i18n>masterFilterName}"\r\n\t\t\t\tkey="Price"\r\n\t\t\t\tmultiSelect="false"><items><ViewSettingsItem\r\n\t\t\t\t\t\ttext="{i18n>masterFilter1}"\r\n\t\t\t\t\t\tkey="Filter1"\r\n\t\t\t\t\t\tid="viewFilter1"/><ViewSettingsItem\r\n\t\t\t\t\t\ttext="{i18n>masterFilter2}"\r\n\t\t\t\t\t\tkey="Filter2"\r\n\t\t\t\t\t\tid="viewFilter2"/></items></ViewSettingsFilterItem></filterItems></ViewSettingsDialog></core:FragmentDefinition>'
}});
