/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mypaystubs.Component");jQuery.sap.require("sap.ca.scfld.md.ComponentBase");jQuery.sap.require("hcm.mypaystubs.controls.PDFViewer");sap.ca.scfld.md.ComponentBase.extend("hcm.mypaystubs.Component",{metadata:sap.ca.scfld.md.ComponentBase.createMetaData("MD",{"manifest":"json","includes":["css/scfld.css"],"config":{"resourceBundle":"i18n/i18n.properties","titleResource":"DISPLAY_NAME"},masterPageRoutes:{"master":{"pattern":":scenarioId::?query:","view":"hcm.mypaystubs.view.S2"}},detailPageRoutes:(function(){if(!sap.ui.Device.system.phone){return{"detail":{"pattern":"detail/{contextPath}:?query:","view":"hcm.mypaystubs.view.S3"}};}else{return{"detail":{"pattern":"detail/{contextPath}:?query:","view":"hcm.mypaystubs.view.S3_Phone"}};}}())}),createContent:function(){var v={component:this};return sap.ui.view({viewName:"hcm.mypaystubs.Main",type:sap.ui.core.mvc.ViewType.XML,viewData:v});}});
