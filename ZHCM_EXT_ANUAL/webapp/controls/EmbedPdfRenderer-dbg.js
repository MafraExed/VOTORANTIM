/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mypaystubs.controls.EmbedPdfRenderer");

hcm.mypaystubs.controls.EmbedPdfRenderer = {
};


/**
 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
 *
 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
 */
hcm.mypaystubs.controls.EmbedPdfRenderer.render = function(oRenderManager, oControl){
    // convenience variable
    var rm = oRenderManager;

 // write the HTML into the render manager
    rm.write("<iframe ");
    rm.writeControlData(oControl);    
    rm.write("src='");  
    rm.write(oControl.getSrc());  
    rm.write("#view=fitH'");    
    rm.addClass("embedPdf"); 
    rm.writeClasses();    
    rm.addStyle("width", "99.6%"); // at 100% the scrollbar is clipped
    rm.addStyle("height", "76%");
    rm.writeStyles();
    rm.write("type='application/pdf'");
    rm.write(">");
    //rm.write("<param name=\"zoom\" value=\"85%\" />");
    //rm.write(oControl.getNoPluginMessage());
    rm.write("</iframe>");


};

