sap.ui.define(["Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/controller/BaseController","sap/ui/model/json/JSONModel","Y5GL_DHO_FORM3/Y5GL_DHO_FORM3/model/formatter","sap/ui/Device"],function(e,t,i,a){"use strict";var n="";return e.extend("Y5GL_DHO_FORM3.Y5GL_DHO_FORM3.controller.Detail",{formatter:i,onInit:function(){var e=new t({busy:false,delay:0});this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched,this);this.setModel(e,"detailView");this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this))},_onMetadataLoaded:function(){var e=this.getView().getBusyIndicatorDelay(),t=this.getModel("detailView");t.setProperty("/delay",0);t.setProperty("/busy",true);t.setProperty("/delay",e)},_onObjectMatched:function(e){var t=e.getParameter("arguments").Infty;var i=e.getParameter("arguments").Subty;n=i;var a=this.getView().byId("list");var r=new sap.ui.model.Filter("Infty",sap.ui.model.FilterOperator.EQ,t);var o=new sap.ui.model.Filter("Subty",sap.ui.model.FilterOperator.EQ,i);a.getBinding("items").filter([r,o])},formatIconList:function(e){var t=jQuery.sap.getModulePath("Y5GL_DHO_FORM3.Y5GL_DHO_FORM3");var i=t+"/Icone/";var a;if(e==="EMP CONSIGNADO"){a=i+"EMPRESTIMO.png";return a}if(e==="ESTAC MOVBUS"){a=i+"ESTACIONAMENTO.png";return a}if(e==="LABORAL"){a=i+"PPRRV.png";return a}if(e==="PASAJE"){a=i+"TRANSPORTE.png";return a}if(e==="REEMBOLSO CURSOS"){a=i+"FORMACAO.png";return a}if(e==="REEMBOLSO EXPATRIADO"){a=i+"ADIANTAMENTO_15.png";return a}if(e==="REEMBOLSO IDIOMA"){a=i+"FORMACAO.png";return a}if(e==="SEGURO DE VIDA"){a=i+"SEGURO_VIDA.png";return a}if(e==="PLANO MEDICO"){a=i+"PLANO_MEDICO.png";return a}return" "},onSelectionChange:function(e){this._showDetail(e.getParameter("listItem")||e.getSource())},_showDetail:function(e){var t=!a.system.phone;var i=e.getBindingContext().getProperty("Infty");var n=e.getBindingContext().getProperty("Subty");this.getRouter().navTo("Detalhe",{Infty:i,Subty:n},t)},formatName:function(e){var t;if(e==="EMP_CONSIGNADO"){t="PRESTAMO"}if(e==="REEMBOLSO MEDICAM"){t="REEMBOLSO MEDICAMENTO"}if(e==="STAC MOVBUS"){t="ESTACIONAMIENTO MOVILIDAD BUS"}if(e==="LABORAL"){t="Reembolso Laboral / Convenio Colectivo"}if(e==="PASAJE"){t="Pasaje Universitario / Asignacion Escolar / Aguinaldo Navideño"}if(e==="PLANO MEDICO"){t="Plan de Salud"}if(e==="SEGURO DE VIDA"){t="Essalud Vida\t"}if(e==="ADELANTO"){t="Adelanto de Gratificación a Solicitud"}if(e==="ADELANTO_SUELDOS"){t="Adelanto de Sueldos"}if(e==="ASIGNACION"){t="Asignación por Fallecimiento"}if(e==="PASAJE_UNIVERSITARIO"){t="Pasaje Universitario"}if(e==="ASIGNACION_ESCOLAR"){t="Asignación Escolar"}if(e==="AGUINALDO_NAVIDENO"){t="Aguinaldo Navideño"}if(!t){t=e}return t}})});