sap.ui.define(["FechamentoContabil/controller/BaseController","sap/ui/model/json/JSONModel"],function(e,t){"use strict";var i;var a=true;return e.extend("FechamentoContabil.controller.Monitor",{onInit:function(){this.attachPatternMatched("monitor");this.createModel([],"topAtividadesAtrasadas")},addBrowserEvents:function(){if(!sap.ui.Device.system.phone){this.byId("card_graficoAvanco").attachBrowserEvent("click",this.onPressGraficos,this);this.byId("card_graficoConcPlan").attachBrowserEvent("click",this.onPressGraficos,this);this.byId("card_graficoTOP5").attachBrowserEvent("click",this.onPressAtividades,this)}},atualizaPagina:function(){var e=this;setTimeout(function(){if(a){e.getDadosECC("atualizaDadosMonitor",true);sap.m.MessageToast.show("Dados atualizados")}e.atualizaPagina()},6e4)},onConfigHierarquiaFluxo:function(e){var t=this.getView().byId("idMenuHierarquiaFluxoGeral");t.toggleStyleClass("menu__hierarquia__inativo")},setTOP5:function(e){this.getModel("topAtividadesAtrasadas").setProperty("/",e.results)},onPressAtividades:function(e){if(sap.ui.Device.system.phone){return}if(e._setPersistencia){e._setPersistencia=false}a=false;var t=sap.ui.core.UIComponent.getRouterFor(this);t.navTo("AtividadesAtrasadas",{profile:this.getView().byId("idInputModelo").getSelectedItem().getText(),instance:this.getView().byId("idInputPeriodo").getSelectedItem().getKey()})},setFluxoProcesso:function(e,t){var i="Representa percentualmente quanto das tarefas já foram concluídas até o momento atual";var a=e.getView().byId("idCarousel");var o=0;var s=t.length;var n=new sap.m.HBox;var r=0;n.setJustifyContent(sap.m.FlexJustifyContent.SpaceAround);n.setAlignContent(sap.m.FlexJustifyContent.SpaceBetween);n.setWidth("100%");a.removeAllPages();t.forEach(function(t){var l=new sap.m.VBox;o++;l.setAlignItems(sap.m.FlexAlignItems.Center);var u=new sap.m.Label;u.setText(t.Texto);u.setTooltip(i);u.setWidth("10em");u.setWrapping(true);u.setTextAlign(sap.ui.core.TextAlign.Center);u.addStyleClass("carousel__label sapUiSmallMarginTop");var d=new sap.ui.core.HTML;d.setContent(e.insereGrafico(parseFloat(t.Valor)));l.addItem(d);l.addItem(u);n.addItem(l);if(sap.ui.Device.system.phone)r=1;else r=4;if(o===r||o===s){var c=new sap.m.VBox;c.setJustifyContent(sap.m.FlexJustifyContent.Center);c.setAlignContent(sap.m.FlexJustifyContent.Center);c.setAlignItems(sap.m.FlexJustifyContent.Center);c.setWidth("100%");c.addItem(n);c.setBackgroundDesign("Solid");a.addPage(c);n=new sap.m.HBox;n.setJustifyContent(sap.m.FlexJustifyContent.SpaceAround);n.setAlignContent(sap.m.FlexJustifyContent.SpaceAround);n.setWidth("100%");s=s-o;o=0}})},insereGrafico:function(e){var t='<div class="chart tarefas sapUiSmallMarginTop">';t+='<div class="radio_chart tarefas p'+e+'"></div>';t+='<div class="cap"></div>';t+='<div class="value">'+e+"%</div></div>";return t},onConfigHierarquia:function(e){var t=this.getView().byId("idMenuHierarquia");t.toggleStyleClass("menu__hierarquia__inativo")},onConfigHierarquiaMobile:function(e){var t=this.getView().byId("idMenuHierarquia");t.toggleStyleClass("menu__hierarquia__inativo__mobile")},onConfigHierarquiaFluxoMobile:function(e){var t=this.getView().byId("idMenuHierarquiaFluxoGeral");t.toggleStyleClass("menu__hierarquia__inativo__mobile")},togglePlayFluxo:function(e){var t=this.getView().byId("idIconPlayFluxo");var i=this;var a;if(e===null){if(this.playFluxo){a=this.getView().byId("idCarousel");a.next();setTimeout(function(){i.togglePlayFluxo(null)},5e3)}return}if(t.getSrc().indexOf("initiative")!==-1){t.setSrc("sap-icon://stop");this.playFluxo=true;setTimeout(function(){a=i.getView().byId("idCarousel");a.next();i.togglePlayFluxo(null)},3e3)}else{t.setSrc("sap-icon://initiative");this.playFluxo=false}},onPressGraficos:function(e,t){if(sap.ui.Device.system.phone){var i=sap.ui.core.UIComponent.getRouterFor(this);i.navTo("AtividadesMobile")}else{a=false;var i=sap.ui.core.UIComponent.getRouterFor(this);i.navTo("Atividades")}},incluirVideo:function(e,t){var i=new sap.ui.core.HTML;var a=$.sap.getModulePath("FechamentoContabil","/Videos/");var t;switch(t){case"1":t="AcessoDesktop.mp4";break;case"2":break}i.setContent("<video width='640' height='360' controls> <source src="+a+t+" type='video/mp4'> </video>");e.removeAllItems();e.addItem(i)},incluiEventoLabels:function(){var e=this;var t=document.querySelectorAll(".popup__video__label");t.forEach(function(t){t.addEventListener("click",e.onClickLabelVideo)})},onClickLabelVideo:function(e){var t=this.getView().byId("hboxVideos");this.incluirVideo(t,e.target.textContent)},onAfterRendering:function(){}})});