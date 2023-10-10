jQuery.sap.registerPreloadedModules({version:"2.0",name:"Charm/Component-preload",modules:{"Charm/Component.js":'sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","Charm/model/models"],function(e,i,t){"use strict";return e.extend("Charm.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);var i=this.getRouter();i&&(sap.ui.Device.system.phone,i.initialize()),this.setModel(t.createDeviceModel(),"device")}})});',"Charm/controller/App.controller.js":'sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("Charm.controller.App",{})});',"Charm/controller/Detalhe.controller.js":'sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";var t;return e.extend("Charm.controller.Detalhe",{onInit:function(){sap.ui.core.UIComponent.getRouterFor(this).getRoute("Detalhe").attachPatternMatched(this._onObjectMatched,this)},_onObjectMatched:function(e){var o=this;["idPanelDadosGerais","idPanelTexto","idPanelTransportes","idPanelAnexos"].forEach(function(e){o.getView().byId(e).setExpanded(!1)}),t=e.getParameter("arguments").mudanca,this.getDadosECC("buscaMudanca")},addBrowserEvents:function(){var e=this,t=this.getView().byId("idLabelAcao");t.attachBrowserEvent("click",function(){e.onBtnAcao()}),t=this.getView().byId("idHboxAcoes"),t.attachBrowserEvent("click",function(){e.onBtnAcao()})},getDadosECC:function(e){var o,a,s=this.getOwnerComponent().getModel(),n=null,i=this;"buscaMudanca"===e&&(o="/ETS_DadosGerais(Mudanca=\'"+t+"\',Request=\'\',DataCriacao=\'\')",n="dadosGeraisToRequest,dadosGeraisToTexto,dadosGeraisToRequest,dadosGeraisToAnexos"),"buscaAcoes"===e&&(o="/ETS_DadosGerais(Mudanca=\'"+t+"\',Request=\'\',DataCriacao=\'\')",n="dadosGeraisToAcoes"),s.removeData(),i.setLoading(!0),s.read(o,{urlParameters:{$expand:n},method:"GET",success:function(t){if("buscaMudanca"===e&&(a=new sap.ui.model.json.JSONModel(t),i.getView().setModel(a,"dadosGerais"),i.setText(t.dadosGeraisToTexto)),"buscaAcoes"===e)if(a=new sap.ui.model.json.JSONModel(t),i.getView().setModel(a,"Acoes"),t.dadosGeraisToAcoes.results.length>0){var o=document.querySelector(".popover__black"),s=document.querySelector(".popover__status");o.classList.remove("popup__disable"),s.classList.remove("popup__disable")}else i.showPopup("Nenhuma ação disponível para essa mudança");i.setLoading(!1)},error:function(){sap.m.MessageToast.show("Erro na conexão com o ECC"),i.setLoading(!1)}})},showPopup:function(e){var t,o=this;t=new sap.m.Dialog({showHeader:!1,content:new sap.m.Text({text:e}).addStyleClass("dialog__text"),beginButton:new sap.m.Button({text:"Fechar",press:function(){t.close()}.bind(o)})}),o.getView().addDependent(t),t.open()},setDadosECC:function(e,o){var a,s=this.getOwnerComponent().getModel(),n={},i=this;"setAcao"===e&&(n.Mudanca=t,n.Type=o,a="/ETS_Acoes(Mudanca=\'"+t+"\')"),i.setLoading(!0),s.update(a,n,{async:!1,success:function(e,t){if(i.setLoading(!1),t.headers.msg)i.showPopup(decodeURIComponent(t.headers.msg));else{sap.ui.core.UIComponent.getRouterFor(i).navTo("Resultado")}},error:function(e){i.setLoading(!1),sap.m.MessageToast.show("Erro na resposta do CHARM")}})},setLoading:function(e){var t=this.getView().byId("loading"),o=this.getView().byId("loadingBlack");e?(t.removeStyleClass("popup__disable"),o.removeStyleClass("popup__disable")):(t.addStyleClass("popup__disable"),o.addStyleClass("popup__disable"))},setText:function(e){var t,o="";e.results.forEach(function(e){"T"===e.Format&&(e.Line="<H4> <strong>"+e.Line+"</strong> </H4>"),o=o+e.Line+"<br/>"}),t=this.getView().byId("idText"),t.setHtmlText(o)},onBtnAcao:function(){this.getDadosECC("buscaAcoes")},onAcaoSelected:function(e){var t,o=this,a=e.getSource();t=new sap.m.Dialog({showHeader:!1,content:new sap.m.Text({text:"Deseja realmente alterar o status da mudança?"}).addStyleClass("dialog__text"),beginButton:new sap.m.Button({text:"Sim",type:"Accept",press:function(){t.close(),o.closeStatusPopover(),o.setDadosECC("setAcao",a.getParent().getItems()[2].getText())}.bind(o)}),endButton:new sap.m.Button({text:"Cancelar",type:"Reject",press:function(){t.close(),o.closeStatusPopover()}.bind(o)})}),o.getView().addDependent(t),t.open()},onExibeTodosObjetos:function(){sap.ui.core.UIComponent.getRouterFor(this).navTo("Request",{mudanca:t,request:"*",sistema:"*"})},closeStatusPopover:function(){document.querySelector(".popover__black").classList.add("popup__disable"),document.querySelector(".popover__status").classList.add("popup__disable")},onBack:function(){sap.ui.core.UIComponent.getRouterFor(this).navTo("Main")},handleRequestSelected:function(e){sap.ui.core.UIComponent.getRouterFor(this).navTo("Request",{mudanca:t,request:e.getSource().getContent()[0].getItems()[0].getItems()[0].getItems()[1].getText(),sistema:e.getSource().getContent()[0].getItems()[2].getText()})},onAfterRendering:function(){this.addBrowserEvents();var e,t=this,o=document.querySelectorAll(".sapMPanelHdr"),a=0,s="";o.forEach(function(o){o.addEventListener("click",function(o){for(e=o.target.parentNode;a<10;){if(e=e.parentNode,-1!==e.id.indexOf("idPanelDadosGerais")){s="idPanelDadosGerais";break}if(-1!==e.id.indexOf("idPanelTexto")){s="idPanelTexto";break}if(-1!==e.id.indexOf("idPanelTransportes")){s="idPanelTransportes";break}if(-1!==e.id.indexOf("idPanelAnexos")){s="idPanelAnexos";break}a+=1}var n=t.getView().byId(s);n.getExpanded()?n.setExpanded(!1):n.setExpanded(!0)})})}})});',"Charm/controller/Main.controller.js":'sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";var t=!0;return e.extend("Charm.controller.Main",{onInit:function(){sap.ui.core.UIComponent.getRouterFor(this).getRoute("Main").attachPatternMatched(this._onObjectMatched,this)},_onObjectMatched:function(e){var a=this;if(t)this.getDadosECC("Pesquisas"),t=!1;else{this.resetFields();a.getView().byId("dynamicPageId").setHeaderExpanded(!0),a.getView().byId("listNfe").setVisible(!1)}},resetFields:function(){var e,t=this;["inpMudc","inpReq","inpCriadoEm","inpCriadoAte"].forEach(function(a){e=t.getView().byId(a),e.setValue("")}),e=t.getView().byId("listNfe"),e.destroyItems()},getDadosECC:function(e,t){var a,s=this.getOwnerComponent().getModel(),i=null,o=[],n=this;"buscaMudanca"===e&&(o=this.getKey(),a="/ETS_DadosGerais(Mudanca=\'"+o[0].trim()+"\',Request=\'"+o[1].trim()+"\',DataCriacao=\'"+o[2].trim()+"\')",i="dadosGerais",this.setLoading(!0)),"Pesquisas"===e&&(o=this.getKey(),a="/ETS_PesquisaAvancada"),"executaPesquisa"===e&&(o=this.getKey(),a="/ETS_PesquisaAvancada(Guid=\'"+t+"\')",i="pesquisaToDadosGerais",this.setLoading(!0)),s.removeData(),null!==i?s.read(a,{urlParameters:{$expand:i},method:"GET",success:function(t){var a;if("buscaMudanca"===e)if(a=new sap.ui.model.json.JSONModel(t.dadosGerais),n.getView().setModel(a,"dadosGerais"),t.dadosGerais.results.length>0){var s=n.getView().byId("dynamicPageId");s.setHeaderExpanded(!1),n.getView().byId("listNfe").setVisible(!0)}else{sap.m.MessageToast.show("Nenhuma mudança encontrada");var s=n.getView().byId("dynamicPageId");s.setHeaderExpanded(!0),n.getView().byId("listNfe").setVisible(!1)}else if(a=new sap.ui.model.json.JSONModel(t.pesquisaToDadosGerais),n.getView().setModel(a,"dadosGerais"),t.pesquisaToDadosGerais.results.length>0){var s=n.getView().byId("dynamicPageId");s.setHeaderExpanded(!1),n.getView().byId("listNfe").setVisible(!0)}else{sap.m.MessageToast.show("Nenhuma mudança encontrada");var s=n.getView().byId("dynamicPageId");s.setHeaderExpanded(!0),n.getView().byId("listNfe").setVisible(!1)}n.setLoading(!1)},error:function(){sap.m.MessageToast.show("Erro na conexão com o ECC"),n.setLoading(!1)}}):s.read(a,{method:"GET",success:function(e){var t=new sap.ui.model.json.JSONModel(e.results);n.getView().setModel(t,"Pesquisas")},error:function(){sap.m.MessageToast.show("Erro na conexão com o ECC")}})},setLoading:function(e){var t=this.getView().byId("loading"),a=this.getView().byId("loadingBlack");e?(t.removeStyleClass("popup__disable"),a.removeStyleClass("popup__disable")):(t.addStyleClass("popup__disable"),a.addStyleClass("popup__disable"))},getKey:function(){var e,t,a,s,i,o,n=[],d=this.getView().byId("inpMudc").getValue(),r=this.getView().byId("inpReq").getValue();return n.push(d),n.push(r),o=this.getView().byId("inpCriadoEm"),null!==o.getDateValue()?(a=o.getDateValue().getDate(),a<10&&(a="0"+a),s=o.getDateValue().getMonth()+1,s<10&&(s="0"+s),i=o.getDateValue().getFullYear(),e=i.toString()+s.toString()+a.toString()):e=null,o=this.getView().byId("inpCriadoAte"),null!==o.getDateValue()?(a=o.getDateValue().getDate(),a<10&&(a="0"+a),s=o.getDateValue().getMonth()+1,s<10&&(s="0"+s),i=o.getDateValue().getFullYear(),t=i.toString()+s.toString()+a.toString()):t=null,n.push(e+">"+t),n},onSelectPesquisa:function(e){this.getDadosECC("executaPesquisa",e.getParameters().selectedItem.getKey()),e.getSource().setSelectedItem(null)},searchNF:function(){this.getDadosECC("buscaMudanca")},onClickItem:function(e){var t=e.getSource();sap.ui.core.UIComponent.getRouterFor(this).navTo("Detalhe",{mudanca:t.getContent()[0].getItems()[0].getItems()[0].getItems()[0].getText()})},addBrowserEvents:function(){var e,t=this,a=["inpMudc","inpReq","inpCriadoEm","inpCriadoAte"];this.getView().byId("idLabelBusca").attachBrowserEvent("click",function(){t.searchNF(t)}),this.getView().byId("idHboxBusca").attachBrowserEvent("click",function(){t.searchNF(t)}),a.forEach(function(a){t.getView().byId(a).attachBrowserEvent("focusin",function(){e=document.querySelector("footer"),e.classList.add("popup__disable")}),t.getView().byId(a).attachBrowserEvent("focusout",function(){e=document.querySelector("footer"),e.classList.remove("popup__disable")})})},onAfterRendering:function(){this.addBrowserEvents(),this.getView().byId("inpMudc").focus()}})});',"Charm/controller/MainDesk.controller.js":'sap.ui.define(["sap/ui/core/mvc/Controller"],function(n){"use strict";return n.extend("Charm.controller.MainDesk",{onInit:function(){}})});',"Charm/controller/Requests.controller.js":'sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";var t,s,a;return e.extend("Charm.controller.Requests",{onInit:function(){sap.ui.core.UIComponent.getRouterFor(this).getRoute("Request").attachPatternMatched(this._onObjectMatched,this)},_onObjectMatched:function(e){t=e.getParameter("arguments").mudanca,s=e.getParameter("arguments").request,a=e.getParameter("arguments").sistema,this.getDadosECC("buscaObjetosRequest")},onBack:function(){sap.ui.core.UIComponent.getRouterFor(this).navTo("Detalhe",{mudanca:t})},getDadosECC:function(e){var o,n=this.getOwnerComponent().getModel("Request"),u=null,r=this;"buscaObjetosRequest"===e&&(o="/ETS_RequestObjects(Request=\'"+s+"\',Sistema=\'"+a+"\',Mudanca=\'"+t+"\')",u="objetosRequest"),n.removeData(),r.setLoading(!0),n.read(o,{urlParameters:{$expand:u},method:"GET",success:function(e){var s=new sap.ui.model.json.JSONModel(e);"*"===e.Request&&(e.Request="Objetos - Mudança "+t),r.getView().setModel(s,"objetosRequest"),r.setLoading(!1)},error:function(){sap.m.MessageToast.show("Erro na conexão com o ECC"),r.setLoading(!1)}})},setLoading:function(e){var t=this.getView().byId("loading"),s=this.getView().byId("loadingBlack");e?(t.removeStyleClass("popup__disable"),s.removeStyleClass("popup__disable")):(t.addStyleClass("popup__disable"),s.addStyleClass("popup__disable"))}})});',"Charm/controller/Resultado.controller.js":'sap.ui.define(["sap/ui/core/mvc/Controller"],function(n){"use strict";return n.extend("Charm.controller.Resultado",{onInit:function(){},handleBack:function(){sap.ui.core.UIComponent.getRouterFor(this).navTo("Main")}})});',"Charm/model/models.js":'sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);return i.setDefaultBindingMode("OneWay"),i}}});',"Charm/serviceBinding.js":'function initModel(){var a=new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZGWGLBC_CHARM_UTILS_SRV/",!0);sap.ui.getCore().setModel(a)}',"Charm/sw.js":'console.log("Hello from sw.js"),importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js"),workbox?console.log("Yay! Workbox is loaded 🎉"):console.log("Boo! Workbox didn\'t load 😬"),workbox.routing.registerRoute(new RegExp("(index.html|.*.js|.*.png|.*.jpg|.*.gif|.*.css)"),workbox.strategies.cacheFirst()),workbox.routing.registerRoute(/(.*\\.css|.*\\.properties|.*\\.woff2)/,workbox.strategies.staleWhileRevalidate({cacheName:"charm-cache4"}));',"Charm/view/App.view.xml":'<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" controllerName="Charm.controller.App"\n\txmlns:html="http://www.w3.org/1999/xhtml"><App id="app" /></mvc:View>',"Charm/view/Detalhe.view.xml":'<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" controllerName="Charm.controller.Detalhe"\n\txmlns:html="http://www.w3.org/1999/xhtml" id="Detalhe"><App><pages><Page title="{dadosGerais>/TipoMudanca} {dadosGerais>/Mudanca}" showNavButton="true" backgroundDesign="Solid" navButtonPress="onBack"><headerContent></headerContent><subHeader><Toolbar><content><HBox width="100%" justifyContent="Center"><Label text="{dadosGerais>/Status}" class="detalhe__header__desc__status sapUiTinyMarginEnd"/></HBox></content></Toolbar></subHeader><content><HBox class="detalhe__header" justifyContent="Center"><Label text="{dadosGerais>/Descricao}"   class="detalhe__header__desc"/></HBox><Panel id="idPanelDadosGerais" expandable="true" expanded="false" headerText="Dados Gerais" width="auto" class="sapUiResponsiveMargin"><content><VBox><HBox><Label text="Solicitante:" class="detalhe__item__titulo sapUiTinyMarginEnd sapUiTinyMarginBottom"/><Label text="{dadosGerais>/CriadoPor}" class="detalhe__item__valor"/></HBox><HBox><Label text="Ciclo:" class="detalhe__item__titulo sapUiTinyMarginEnd sapUiTinyMarginBottom"/><Label text="{dadosGerais>/Ciclo}" class="detalhe__item__valor"/></HBox><HBox><Label text="Tipo doc. Origem:" class="detalhe__item__titulo sapUiTinyMarginEnd sapUiTinyMarginBottom"/><Label text="{dadosGerais>/TipoDocOrigem}" class="detalhe__item__valor"/></HBox><HBox><Label text="Documento Origem:" class="detalhe__item__titulo sapUiTinyMarginEnd sapUiSmallMarginBottom"/><Label text="{dadosGerais>/DocumentoOrigem}" class="detalhe__item__valor"/></HBox><HBox><Label text="Categoria:" class="detalhe__item__titulo sapUiTinyMarginEnd sapUiSmallMarginBottom"/><Label text="{dadosGerais>/Categ1} > {dadosGerais>/Categ2} > {dadosGerais>/Categ3}" class="detalhe__item__valor"/></HBox></VBox></content></Panel><Panel id="idPanelTexto" expandable="true" expanded="false" headerText="Texto" width="auto" class="sapUiResponsiveMargin"><content><FormattedText id="idText" htmlText="{/HTML}" /></content></Panel><Panel id="idPanelTransportes" expandable="true" expanded="false" headerText="Gestão de Transportes" width="auto" class="sapUiResponsiveMargin"><infoToolbar><Toolbar><content><Button text="Exibir todos os objetos" type="Emphasized" press="onExibeTodosObjetos"/></content></Toolbar></infoToolbar><content><List items="{path: \'dadosGerais>/dadosGeraisToRequest/results/\'}"  mode="None"  showSeparators="None" class="item__list"><CustomListItem  type="Active" press="handleRequestSelected" ><VBox width="100%" justifyContent="Center" alignContent="Center" alignItems="Center" class="detalhe__transportes sapUiSmallMargingBottom" ><HBox width="100%"><HBox width="30%" justifyContent="Start" alignContent="Center" alignItems="Center"><core:Icon src="{= ${dadosGerais>Liberado} === \'@DF@\' ? \'sap-icon://arrow-down\' : \'sap-icon://warning2\' }" color="{= ${dadosGerais>Liberado} === \'@DF@\' ? \'green\' : \'orange\' }" alt="request" class="sapUiTinyMarginEnd"/><Label text="{dadosGerais>Request}" class="detalhe__request__titulo "/></HBox><HBox width="70%" justifyContent="End"><Label text="{dadosGerais>Tipo}" class="detalhe__request__tipo"/></HBox></HBox><HBox width="100%" justifyContent="Start"><Label text="{dadosGerais>Desc}" class="detalhe__item__valor"/></HBox ><Label text="{dadosGerais>System}" visible="false"/></VBox></CustomListItem></List></content></Panel><Panel id="idPanelAnexos" expandable="true" expanded="false" headerText="Anexos" width="auto" class="sapUiResponsiveMargin"><content><List items="{path: \'dadosGerais>/dadosGeraisToAnexos/results/\'}"  mode="None" class="item__list"><CustomListItem  type="Active"><VBox width="100%" justifyContent="Center" alignContent="Center" alignItems="Center" ><HBox width="100%" justifyContent="Start" class="sapUiTinyMarginTopBottom"><core:Icon src="sap-icon://documents" size="25px" color="#265e96" class="sapUiSmallMarginEnd" alt="anexo"/><Label text="{dadosGerais>Desc}" class="detalhe__item__valor"/></HBox></VBox></CustomListItem></List></content></Panel></content></Page></pages></App><html:div id="idBotaoAcoes" class="botao__acoes" ><HBox id="idHboxAcoes" width="100%" height="100%" justifyContent="Center" alignContent="Center" alignItems="Center" ><Label id="idLabelAcao" text="Ações" class="botao__acoes__label"/></HBox></html:div><html:div class="popover__black popup__disable"/><html:div class="popover__status popup__disable"><HBox class="sapUiMediumMarginTopBottom" justifyContent="Center"><core:Icon src="sap-icon://sys-cancel" color="red" size="65px" press="closeStatusPopover" class="popover__status__items__canc" alt="icon"/></HBox><List width="100%" items="{path: \'Acoes>/dadosGeraisToAcoes/results/\'}"  mode="None"  showSeparators="None" backgroundDesign="Transparent" class="List__Acoes"><CustomListItem  type="Inactive" ><VBox width="100%" justifyContent="Center" alignContent="Center" alignItems="Center" ><HBox width="90%" class="popover__status__items sapUiMediumMarginBottom" justifyContent="Center"><Label  text=""   wrapping="true"/><Button text="{Acoes>Acao}" press="onAcaoSelected" class="sapUiResponsiveMargin"/><Label  text="{Acoes>Type}" visible="false"/></HBox></VBox></CustomListItem></List></html:div><VBox id="loadingBlack" class="loadingBlack popup__disable"/><VBox id="loading" class="loading popup__disable"><HBox width="100%" height="100%" justifyContent="Center"  alignItems="Center" class="loading__icon"><html:img src="./images/voto_load_white.gif" width="150px" /></HBox></VBox></mvc:View>',"Charm/view/Main.view.xml":'<mvc:View xmlns:core="sap.ui.core" controllerName="Charm.controller.Main" xmlns:html="http://www.w3.org/1999/xhtml"\n\txmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" xmlns:l="sap.ui.layout" xmlns:f="sap.f" height="100%"><f:DynamicPage id="dynamicPageId" ><f:title ><f:DynamicPageTitle ><f:content  ><HBox width="100%" justifyContent="Center"><Label text="Gestão de Mudanças" class="header__title"/></HBox></f:content></f:DynamicPageTitle ></f:title ><f:header><f:DynamicPageHeader pinnable="true" backgroundDesign="Transparent" ><f:content><FlexBox  alignItems="Center" justifyContent="Center" alignContent="Center"><items><Panel backgroundDesign="Transparent" class="sapUiNoContentPadding" ><content><VBox height="100%" width="100%" justifyContent="Center" alignContent="Center" alignItems="Center" ><Label text="Mudança" labelFor="inpMudc" width="100%" textAlign="Left" class="header__label"/><Input id="inpMudc" maxLength="10" width="100%" class="sapUiSmallMarginBottom" type="Number" submit="searchNF" /><Label text="Request" labelFor="inpReq" width="100%" textAlign="Left" class="header__label"/><Input id="inpReq" maxLength="10" width="100%" class="sapUiSmallMarginBottom" submit="searchNF"/><HBox><VBox alignItems="Center" class="sapUiTinyMarginEnd sapUiSmallMarginBottom"><Label text="Criado Em" labelFor="inpCriadoEm" width="100%" textAlign="Left" class="header__label"/><DatePicker id="inpCriadoEm" change="handleChange" placeholder=" " valueFormat="yyyyMMdd" displayFormat="short"/></VBox><VBox alignItems="Center"><Label text="até" labelFor="inpCriadoEmc" width="100%" textAlign="Left" class="header__label"/><DatePicker id="inpCriadoAte" change="handleChange" placeholder=" " valueFormat="yyyyMMdd" displayFormat="short"/></VBox></HBox><Label text="Pesquisas Gravadas" labelFor="inpPesq" width="100%" textAlign="Left" class="header__label"/><Select id="idSelectPesquisa"\n\t\t\t\t\t\t\t\t\t\t\tforceSelection="false" change="onSelectPesquisa" \n\t\t\t\t\t\t\t\t\t\t\titems="{\n\t\t\t\t\t\t\t\t\t\t\t\tpath: \'Pesquisas>/\',\n\t\t\t\t\t\t\t\t\t\t\t\tsorter: { path: \'Pesquisa\' }\n\t\t\t\t\t\t\t\t\t\t\t}"><core:Item key="{Pesquisas>Guid}" text="{Pesquisas>Pesquisa}" /></Select><HBox width="100%" alignContent="Center" alignItems="Center" justifyContent="Center"><HBox id="idHboxBusca" width="40%" justifyContent="Center" alignContent="Center" alignItems="Center" class="header__buscar__border sapUiMediumMarginTopBottom"><Label id="idLabelBusca" text="Buscar" class="header__buscar" /></HBox></HBox></VBox></content></Panel></items></FlexBox></f:content></f:DynamicPageHeader></f:header><f:content><List items="{path: \'dadosGerais>/results/\'}" backgroundDesign="Transparent" mode="None" id="listNfe"  selectionChange="onSelectNfe" showSeparators="None" class="item__list" visible="false"><CustomListItem type="Active" press="onClickItem" class="sapUiTinyMarginTopBottom"><VBox class="item sapUiSmallMarginTopBottom" ><HBox  alignContent="Center" alignItems="Center" class="item__header"><HBox width="40%" justifyContent="Start" alignContent="Center" alignItems="Center" ><Label text="{dadosGerais>Mudanca}" class="item__label__mudanca"/><Image src="./images/separator.jpg" width="1px" height="25px" class="sapUiSmallMarginBegin"/></HBox><HBox width="60%" justifyContent="Center" alignContent="Center" alignItems="Center" ><Label text="{dadosGerais>TipoMudanca}" class="item__label__tipomudanca" /></HBox></HBox><VBox class="item__body"><HBox width="100%" justifyContent="Center"><Label text="{dadosGerais>Descricao}" textAlign="Center" class="item__label__descmudanca" /></HBox><HBox><VBox width="50%" justifyContent="Center"  ><HBox><Label text="Ciclo:" class="item__label__titulos sapUiTinyMarginEnd"/><Label text="{dadosGerais>Ciclo}" class="item__label__valores"/></HBox><Label text="{dadosGerais>Categoria}" class="item__label__valores"/></VBox><VBox width="50%" justifyContent="Center"  ><HBox><Label text="{dadosGerais>TipoDocOrigem}:" class="sapUiTinyMarginEnd item__label__titulos"/><Label text="{dadosGerais>DocumentoOrigem}:" class="item__label__valores"/></HBox><HBox><Label text="Criado:" class="item__label__titulos sapUiTinyMarginEnd"/><Label text="{dadosGerais>DataCriacao}" class="item__label__valores"/></HBox></VBox></HBox></VBox><HBox justifyContent="Center" class="item__footer" width="100%"><Label text="{dadosGerais>Status}" class="item__label__status" /></HBox></VBox></CustomListItem></List></f:content></f:DynamicPage><VBox id="loadingBlack" class="loadingBlack popup__disable"/><VBox id="loading" class="loading popup__disable"><HBox width="100%" height="100%" justifyContent="Center"  alignItems="Center" class="loading__icon"><html:img src="./images/voto_load_white.gif" width="150px" /></HBox></VBox><html:footer ><HBox width="100%" height="100%" justifyContent="Center"  alignItems="Center"><html:img src="./images/votorantim_new_logo_white.png" width="300px" class="footer_img" /></HBox></html:footer></mvc:View>',"Charm/view/MainDesk.view.xml":'<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" controllerName="Charm.controller.MainDesk"\n\txmlns:html="http://www.w3.org/1999/xhtml"><App><pages><Page showHeader="false" ><content><HBox width="100%" height="100%" justifyContent="Center" alignContent="Center" alignItems="Center"><Label text="App disponível apenas na versão mobile" class="mainDesk__warning"/></HBox></content></Page></pages></App></mvc:View>',"Charm/view/Requests.view.xml":'<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" controllerName="Charm.controller.Requests"\n\txmlns:html="http://www.w3.org/1999/xhtml"><App><pages><Page title="{objetosRequest>/Request}" showNavButton="true" navButtonPress="onBack"><content><Table id="idProductsTable"\n\t\t\t\t\t\tinset="false"\n\t\t\t\t\t\titems="{\n\t\t\t\t\t\t\tpath: \'objetosRequest>/objetosRequest/results/\',\n\t\t\t\t\t\t\tsorter: {\n\t\t\t\t\t\t\t\tpath: \'Tipo\',\n\t\t\t\t\t\t\t\tgroup: true\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}"><columns><Column\n\t\t\t\t\t\t\t\twidth="80%"><Text text="Objeto" class="request__coluna__label" /></Column><Column width="20%"><Text text="Tipo" class="request__coluna__label"/></Column></columns><items><ColumnListItem><cells><Label text="{objetosRequest>Objeto}" class="request__cell__label"/><Label text="{objetosRequest>Tipo}" class="request__cell__label"/></cells></ColumnListItem></items></Table></content></Page></pages></App><html:loadingBlack class="popup__disable"/><VBox id="loadingBlack" class="loadingBlack popup__disable"/><VBox id="loading" class="loading popup__disable"><HBox width="100%" height="100%" justifyContent="Center"  alignItems="Center" class="loading__icon"><html:img src="./images/voto_load_white.gif" width="150px" /></HBox></VBox></mvc:View>',"Charm/view/Resultado.view.xml":'<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" controllerName="Charm.controller.Resultado"\n\txmlns:html="http://www.w3.org/1999/xhtml"><VBox justifyContent="SpaceBetween" width="100%" height="100%" backgroundDesign="Solid"><VBox alignContent="Center" alignItems="Center" width="100%" class="sapUiMediumMarginTop"><core:Icon src="sap-icon://accept" color="green" size="5.6em" alt="icon"/><Text text="Status alterado com sucesso" wrapping="true" class="resultado__label__sucesso"  textAlign="Center"/></VBox><HBox alignContent="Center" alignItems="Center" justifyContent="Center" class="sapUiMediumMarginBottom" ><core:Icon src="sap-icon://home" color="blue" size="3.2em" alt="icon" press="handleBack"/></HBox></VBox></mvc:View>',"Charm/i18n/i18n.properties":"title=Title\nappTitle = App Title\nappDescription=App Description","Charm/manifest.json":'{"name":"Fiori Progressive Web App","short_name":"FIORI - PWA","description":"Progressive Web App that lists games submitted to the A-Frame category in the js13kGames 2017 competition.","icons":[{"src":"images/icons/icon-192x192.png","type":"image/png","sizes":"192x192"},{"src":"images/icons/icon-512x512.png","type":"image/png","sizes":"512x512"}],"start_url":"index.html","display":"standalone","background_color":"#3367D6","theme_color":"#3367D6","_version":"1.1.0","sap.app":{"_version":"1.1.0","id":"Charm","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"1.0.0"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","ach":"ach","sourceTemplate":{"id":"servicecatalog.connectivityComponentForManifest","version":"0.0.0"},"dataSources":{"ZGWGLBC_GESTAO_MUD_MOBILE_SRV_01":{"uri":"/sap/opu/odata/sap/ZGWGLBC_GESTAO_MUD_MOBILE_SRV_01/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/ZGWGLBC_GESTAO_MUD_MOBILE_SRV_01/metadata.xml"}},"ZGWGLBC_CHARM_UTILS_SRV":{"uri":"/sap/opu/odata/sap/ZGWGLBC_CHARM_UTILS_SRV/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/ZGWGLBC_CHARM_UTILS_SRV/metadata.xml"}}}},"sap.ui":{"_version":"1.1.0","technology":"UI5","deviceTypes":{"desktop":true,"tablet":true,"phone":true},"supportedThemes":["sap_hcb","sap_bluecrystal"]},"sap.ui5":{"_version":"1.1.0","rootView":{"viewName":"Charm.view.App","type":"XML"},"dependencies":{"minUI5Version":"1.30.0","libs":{"sap.ui.core":{"minVersion":"1.38.1"},"sap.m":{"minVersion":"1.38.1"},"sap.f":{"minVersion":"1.38.1"}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"Charm.i18n.i18n"}},"":{"type":"sap.ui.model.odata.v2.ODataModel","settings":{"defaultOperationMode":"Server","defaultBindingMode":"OneWay","defaultCountMode":"Request"},"dataSource":"ZGWGLBC_GESTAO_MUD_MOBILE_SRV_01","preload":true},"Request":{"type":"sap.ui.model.odata.v2.ODataModel","settings":{"defaultOperationMode":"Server","defaultBindingMode":"OneWay","defaultCountMode":"Request"},"dataSource":"ZGWGLBC_CHARM_UTILS_SRV","preload":true}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"Charm.view","controlAggregation":"pages","controlId":"app"},"routes":[{"name":"Main","pattern":"","target":["TargetMain"],"greedy":false},{"name":"Detalhe","pattern":"det/{mudanca}","target":["TargetDetalhe"],"greedy":false},{"name":"Request","pattern":"{mudanca}sist/{sistema}/req/{request}","target":["TargetRequest"],"greedy":false},{"name":"Resultado","pattern":"res","target":["Resultado"],"greedy":false},{"name":"MainDesk","pattern":"res","target":["Resultado"],"greedy":false}],"targets":{"TargetMain":{"viewType":"XML","transition":"slide","viewName":"Main","async":true,"viewPath":"Charm.view"},"App":{"viewType":"XML","viewName":"App"},"TargetDetalhe":{"viewType":"XML","viewName":"Detalhe"},"TargetRequest":{"viewType":"XML","viewName":"Requests"},"Resultado":{"transition":"show","viewType":"XML","viewName":"Resultado"},"MainDesk":{"viewType":"XML","viewName":"MainDesk"}}}},"sap.platform.hcp":{"uri":"","_version":"1.1.0"},"sap.platform.abap":{"uri":"/sap/bc/ui5_ui5/sap/zglbc_gmud/","_version":"1.1.0"}}'}});