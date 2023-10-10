/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mypaystubs.controls.PDFViewerRenderer");

hcm.mypaystubs.controls.PDFViewerRenderer = {
};


/**
 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
 *
 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
 */
hcm.mypaystubs.controls.PDFViewerRenderer.render = function(oRenderManager, oControl){
    // convenience variable
    var rm = oRenderManager;

    // write the HTML into the render manager
    rm.write("<div tabindex=0");
    rm.writeControlData(oControl);
    rm.addStyle("width", "100%");
    rm.addStyle("height", "100%");
    rm.writeStyles();
    rm.write(">");
    rm.write("</div>");
};