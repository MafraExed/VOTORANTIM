sap.ui.require.preload({"com/sap/votorantimZHCM_Demonstrativo/Component.js":'sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","com/sap/votorantimZHCM_Demonstrativo/model/models"],function(e,t,o){"use strict";return e.extend("com.sap.votorantimZHCM_Demonstrativo.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments),this.setModel(o.createDeviceModel(),"device")}})});',"com/sap/votorantimZHCM_Demonstrativo/controller/Demonstrativo.controller.js":'sap.ui.define(["sap/ui/core/mvc/Controller"],function(o){"use strict";return o.extend("com.sap.votorantimZHCM_Demonstrativo.controller.Demonstrativo",{})});',"com/sap/votorantimZHCM_Demonstrativo/controller/pdf.controller.js":'sap.ui.define(["sap/ui/core/mvc/Controller"],function(o){"use strict";return o.extend("com.sap.votorantimZHCM_Demonstrativo.controller.pdf",{})});',"com/sap/votorantimZHCM_Demonstrativo/controller/View1.controller.js":'sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("com.sap.votorantimZHCM_Demonstrativo.controller.View1",{onInit:function(){var e=new sap.m.BusyDialog({text:"Carregando..."});e.open();for(var t=[],o=2e3;o<2019;)t.push({name:o,value:o}),o++;var s=new sap.ui.model.json.JSONModel(t);this.getView().setModel(s,"Zcombo"),e.close()},pdfviewer:function(){var e=this.getView().byId("v_recibo"),t=this.getView().byId("v_mes"),o=this.getView().byId("v_ano"),s=new sap.m.BusyDialog({text:"Processando"});if(s.open(),""===e.getSelectedKey())return s.close(),void sap.m.MessageToast.show("Selecione um Recibo!");if(""===t.getValue())return s.close(),void sap.m.MessageToast.show("Selecione um Mês!");if(""===o.getValue())return s.close(),void sap.m.MessageToast.show("Selecione um Ano!");var i=this.getView().byId("v_mes").getValue(),a=this.getView().byId("v_ano").getValue();localStorage.setItem("mes",JSON.stringify(i)),localStorage.setItem("ano",JSON.stringify(a));var r=this,n="/ZET_VCRH_PERIODOS";this.getOwnerComponent().getModel("ferias").read(n,{success:function(e,t){localStorage.setItem("nome",JSON.stringify(e.results));var o="Formulario.html",i=$(window).width()-20;if(i>"800"){i="100%",s.close();var a=r.byId("visualizador").$()[0];a.setAttribute("width",i+"px"),a.setAttribute("src","/view/Formulario3.html"),a.setAttribute("width",i+"px")}else s.close(),window.location.href=o}})},check_recibo:function(){},voltarsucces:function(){window.location.href="https://pmsalesdemo8.successfactors.com/sf/home?bplte_company=BRAZIL18#Shell-home"}})});',"com/sap/votorantimZHCM_Demonstrativo/Gruntfile.js":'module.exports=function(s){"use strict";s.loadNpmTasks("@sap/grunt-sapui5-bestpractice-build"),s.registerTask("default",["clean","lint","build"])};',"com/sap/votorantimZHCM_Demonstrativo/model/models.js":'sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);return i.setDefaultBindingMode("OneWay"),i}}});',"com/sap/votorantimZHCM_Demonstrativo/view/Demonstrativo.view.xml":'<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" xmlns:html="http://www.w3.org/1999/xhtml" controllerName="com.sap.votorantimZHCM_Demonstrativo.controller.Demonstrativo"><App><pages><Page title="Demonstrativo de Pagamento" icon="sap-icon://accelerated"><content><Image width="140px" height="140px" id="__image0" src="246.png"/></content></Page></pages></App></mvc:View>',"com/sap/votorantimZHCM_Demonstrativo/view/pdf.view.xml":'<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"\r\n\tcontrollerName="com.sap.votorantimZHCM_Demonstrativo.controller.View1" xmlns:html="http://www.w3.org/1999/xhtml"><App><pages><Page title="Title"><content></content></Page></pages></App></mvc:View>',"com/sap/votorantimZHCM_Demonstrativo/view/View1.view.xml":'<mvc:View xmlns:html="http://www.w3.org/1999/xhtml" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" controllerName="com.sap.votorantimZHCM_Demonstrativo.controller.View1" displayBlock="true"><App><pages><Page title="Recibos de Pagamento"><customHeader><Bar><contentMiddle><Button press="voltarsucces" text="Voltar página Inicial" type="Back" /></contentMiddle></Bar></customHeader><content><sap.ui.layout.form:SimpleForm xmlns:sap.ui.layout.form="sap.ui.layout.form" editable="true" layout="ResponsiveGridLayout" id="__form0"><sap.ui.layout.form:content><ComboBox xmlns:sap.ui.core="sap.ui.core" selectedItem="Element sap.ui.core.ListItem#__item0" id="v_recibo" required="true" textAlign="Center" fieldGroupIds="1" textDirection="LTR" placeholder="Selecione o recibo" valueStateText="Inicial" valueState="None"><items><sap.ui.core:ListItem text="Adiantamento Quinzenal" key="004"/><sap.ui.core:ListItem text="Pagamento Mensal" key="001"/><sap.ui.core:ListItem text="13° Salário - Adiantamento" key="002"/><sap.ui.core:ListItem text="13° Salário - Pagamento" key="003"/><sap.ui.core:ListItem text="Recibo de Férias" key="005"/><sap.ui.core:ListItem text="PPR - Adiantamento" key="006"/><sap.ui.core:ListItem text="PPR - Pagamento" key="007"/><sap.ui.core:ListItem text="PRV - Adiantamento" key="008"/><sap.ui.core:ListItem text="PRV - Pagamento" key="009"/><sap.ui.core:ListItem text="Informe de Rendimentos" key="010"/></items></ComboBox><ComboBox xmlns:sap.ui.core="sap.ui.core" selectedItem="Element sap.ui.core.ListItem#__item10" id="v_mes" placeholder="Mês"><items><sap.ui.core:ListItem text="Janeiro" key="01"/><sap.ui.core:ListItem text="Fevereiro" key="02"/><sap.ui.core:ListItem text="Março" key="03"/><sap.ui.core:ListItem text="Abril" key="04"/><sap.ui.core:ListItem text="Maio" key="05"/><sap.ui.core:ListItem text="Junho" key="/06"/><sap.ui.core:ListItem text="Julho" key="07"/><sap.ui.core:ListItem text="Agosto" key="08"/><sap.ui.core:ListItem text="Setembro" key="09"/><sap.ui.core:ListItem text="Outubro" key="10"/><sap.ui.core:ListItem text="Novembro" key="11"/></items></ComboBox><ComboBox xmlns:sap.ui.core="sap.ui.core" id="v_ano" selectedItem="2018" value="2018" items="{Zcombo>/}" selectedKey="2018"><items><sap.ui.core:ListItem text="{Zcombo>name}" key="{Zcombo>name}"/></items></ComboBox><Button text="Visualizar" width="100%" id="__button0" activeIcon="sap-icon://pdf-reader" icon="sap-icon://pdf-reader" fieldGroupIds="1" press="pdfviewer"/></sap.ui.layout.form:content></sap.ui.layout.form:SimpleForm><html:iframe id="visualizador" src="" height="100%" width="100%" border="0px" visible="false"></html:iframe></content></Page></pages></App></mvc:View>'},"com/sap/votorantimZHCM_Demonstrativo/Component-preload");