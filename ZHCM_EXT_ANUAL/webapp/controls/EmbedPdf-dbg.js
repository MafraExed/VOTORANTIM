/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mypaystubs.controls.EmbedPdf");
jQuery.sap.require("sap.ui.core.library");
jQuery.sap.require("sap.ui.core.RenderManager");

sap.ui.core.Control.extend("hcm.mypaystubs.controls.EmbedPdf", { metadata:{

    // ---- object ----
    properties:{
        "src":{type:"string", group:"Misc"},
        "noPluginMessage":{type:"string", group:"Misc"}
    }
}});

hcm.mypaystubs.controls.EmbedPdf.prototype.exit = function () {
    if (sap.ui.Device.browser.msie) {
        $('.embedPdf').remove();
    }
};

hcm.mypaystubs.controls.EmbedPdf.prototype.init = function () {
    if (sap.ui.Device.browser.msie) {
        $('.embedPdf').remove();
    }
};