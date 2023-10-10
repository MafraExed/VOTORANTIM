jQuery.sap.registerPreloadedModules({
"name":"hcm/mypaystubs/Component-preload",
"version":"2.0",
"modules":{
  "hcm/mypaystubs/Component.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mypaystubs.Component");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

// Note 2361399:
// UI5 library "sap-viz-info.js" polyfills "define" (part of AMD loader). Due to the manifest migration,
// this polyfill now happens *before* PDF.js is initialized by "controls/PDFViewer". PDF.js detects
// the AMD functionality of the runtime and tries to use it for initialization, which does not work correctly.
// Therefore make sure, that PDF.js is loaded *before* "define" is overwritten during manifest loading.
jQuery.sap.require("hcm.mypaystubs.controls.PDFViewer");

sap.ca.scfld.md.ComponentBase.extend("hcm.mypaystubs.Component", {
    metadata : sap.ca.scfld.md.ComponentBase.createMetaData("MD", {
      "manifest": "json",
      "includes" : ["css/scfld.css"],
      "config" : {
        "resourceBundle" : "i18n/i18n.properties",
        "titleResource" : "DISPLAY_NAME"
    },

    masterPageRoutes: {
      "master": {
        "pattern": ":scenarioId::?query:",
        "view": "hcm.mypaystubs.view.S2"
      }
    },

    detailPageRoutes: (function() {
      if (!sap.ui.Device.system.phone) {
        return {
          "detail": {
            "pattern": "detail/{contextPath}:?query:",
            "view": "hcm.mypaystubs.view.S3"
          }
        };
      } else {
        return {
          "detail": {
            "pattern": "detail/{contextPath}:?query:",
            "view": "hcm.mypaystubs.view.S3_Phone"
          }
        };
      }
    }())
    // masterPageRoutes : {
    // // fill the routes to your master pages in here. The application will start with a navigation to route "master"
    // leading to master screen S2.
    // // If this is not desired please define your own route "master"
    // },
    // detailPageRoutes : {
    // //fill the routes to your detail pages in here. The application will navigate from the master page to route
    // //"detail" leading to detail screen S3.
    // If this is not desired please define your own route "detail"
    //    "toS5" : {
    //      "pattern" : "toS5",
    //      "view" : "S5",
    //    }
    //},
    //fullScreenPageRoutes : {
    //  // fill the routes to your full screen pages in here.
    //  "subDetail" : {
    //    "pattern" : "subDetail/{contextPath}",
    //    "view" : "S4",
    //  }
    //}
  }),

  /**
   * Initialize the application
   *
   * @returns {sap.ui.core.Control} the content
   */
  createContent : function() {

    var oViewData = {
      component : this
    };
    return sap.ui.view({
      viewName : "hcm.mypaystubs.Main",
      type : sap.ui.core.mvc.ViewType.XML,
      viewData : oViewData
    });
  }
});
},
  "hcm/mypaystubs/Configuration.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mypaystubs.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ca.scfld.md.ConfigurationBase.extend("hcm.mypaystubs.Configuration", {
  oServiceParams: {
    serviceList: [{
      name: "HCM_MY_PAYSTUBS_SRV",
      serviceUrl: hcm.mypaystubs.Component.getMetadata().getManifestEntry("sap.app").dataSources["HCM_MY_PAYSTUBS_SRV"].uri,
      isDefault: true,
      mockedDataSource: "/hcm.mypaystubs/model/metadata.xml",
      useBatch:true
    }]
  },

  getServiceParams : function() {
    return this.oServiceParams;
  },

  /**
   * @inherit
   */
  getServiceList : function() {
    return this.getServiceParams().serviceList;
  },

  getMasterKeyAttributes : function() {
    //return the key attribute of your master list item
    return ["Id"];
  }
});
},
  "hcm/mypaystubs/Main.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("hcm.mypaystubs.Main", {
  _tempVersion:null,
  onInit : function() {
        jQuery.sap.require("sap.ca.scfld.md.Startup");
        
        //workaround for PDF view in android devices
        if(sap.ui.Device.os.android && sap.ui.Device.os.version > 4.0){
          this._tempVersion = sap.ui.Device.os.version;
          sap.ui.Device.os.version = 4.0;
        }
    sap.ca.scfld.md.Startup.init('hcm.mypaystubs', this);
    jQuery.sap.require("sap.ca.ui.model.type.Date");
  },

  /**
   * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
   * 
   * @memberOf MainXML
   */
  onExit : function() {
    //exit cleanup code here
    if(this._tempVersion){
      sap.ui.Device.os.version = this._tempVersion;
    }
    try {
      jQuery.sap.require("hcm.mypaystubs.utils.ConcurrentEmployment");
      var oController = hcm.mypaystubs.utils.ConcurrentEmployment.getControllerInstance();
      oController.oCEDialog.Cancelled = true;
      oController.oCEDialog.close();
      oController.oApplication.pernr = "";
    } catch (e) {
      jQuery.sap.log.error("couldn't execute onExit", ["onExit failed in main controller"], ["hcm.mypaystubs.Main"]);
    }
  }

});
},
  "hcm/mypaystubs/Main.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core" xmlns="sap.m"\n\tcontrollerName="hcm.mypaystubs.Main" displayBlock="true"
 height="100+
%">\n\t<NavContainer id="fioriContent" showHeader="false">\n\t</NavContainer>\n</core:View>',
  "hcm/mypaystubs/controls/EmbedPdf.js":function(){/*
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
},
  "hcm/mypaystubs/controls/EmbedPdfRenderer.js":function(){/*
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

},
  "hcm/mypaystubs/controls/PDFViewer.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mypaystubs.controls.PDFViewer");
jQuery.sap.require("sap.ui.core.library");
jQuery.sap.require("sap.ui.core.RenderManager");
jQuery.sap.require("sap.ui.Device");
/*global PDFJS:true*/
/*global hcm:true*/

// Note 2265325: Configure PDF.js to use worker-thread and load cmaps, before it is loaded
// Note 2349275: iOS Safari sometimes has issues with worker thread in PDF.js (e.g. with Chinese PDFs), disable
// it in this case. Also configure correct path for cmaps on iOS.
PDFJS = {
  workerSrc: jQuery.sap.getModulePath("hcm.mypaystubs") + "/ext/pdfjs/pdf.worker.js",
  cMapUrl: jQuery.sap.getModulePath("hcm.mypaystubs") + "/ext/pdfjs/cmaps/",
  cMapPacked: true,
  disableWorker: (sap.ui.Device.os.ios ? true : false)
};
jQuery.sap.require("hcm.mypaystubs.ext.pdfjs.pdf");


sap.ui.core.Control.extend("hcm.mypaystubs.controls.PDFViewer", { metadata:{

    // ---- object ----
    properties:{
        "src":{type:"string", group:"Misc"},
        "errorMessage":{type:"string", group:"Misc"},
        "setPdfData":{type:"string", group:"Misc"}
    },
    events:{
        "begin":{},
        "complete":{}
    }
}});

hcm.mypaystubs.controls.PDFViewer.prototype.exit = function () {
    jQuery.sap.log.debug("exit "+this.getSrc());
    this.UnloadPdf();
    this.ClearPdfData();
};

hcm.mypaystubs.controls.PDFViewer.prototype.Show = function (loader) {

    // no need to test empty source
    var sourceURL = this.getSrc();
    if (!sourceURL) {
        return;
    }
    // no need to reload the pdf if we already have it
    if (!this._pdfData) {
        // load the pdf
        this.fireBegin();
        loader.LoadPdf(sourceURL, jQuery.proxy(this.setPdfData, this), jQuery.proxy(this.showErrorMessage, this));
    } else {
        // just render the pdf
        this.RenderPdf();
    }
};

hcm.mypaystubs.controls.PDFViewer.prototype.ClearPdfData = function() {
    this._pdfData = null;
  this._loadedURL = null;
};

hcm.mypaystubs.controls.PDFViewer.prototype.UnloadPdf = function () {

  //only load the PDF from backend if it was not loaded yet
    if (this._pdfData && this._loadedURL !== this.getSrc()) {  
        jQuery.sap.log.debug("UnloadPdf " + this.getSrc());
        this.ClearPdfData();

        $(this.getDomRef()).empty();
    }
};

hcm.mypaystubs.controls.PDFViewer.prototype.setPdfData = function (data) {

    this._pdfData = data;
  this._loadedURL = this.getSrc();
    this.RenderPdf();
};

hcm.mypaystubs.controls.PDFViewer.prototype.showErrorMessage = function (responseText) {

    // get response
    //var errorResponse = (responseText !== null) ? null : JSON.parse(responseText);
    // show error
//    hcm.mypaystubs.Service.showError(this.getErrorMessage(), errorResponse);TODO
};


hcm.mypaystubs.controls.PDFViewer.prototype.RenderPdf = function() {
//    jQuery.sap.measure.start(sap.hcm.payslip.utils.PerfUtils.getStartId(sap.hcm.payslip.utils.PerfUtils.RenderPdf));

    var id = this.getDomRef(), that = this, contextArray = [];
    jQuery.sap.log.debug("RenderPdf " + this.getSrc());

    if (id.childNodes && id.childNodes.length > 0) {
        // The control is already rendered
        setTimeout(function() {
            jQuery.sap.log.debug("The control is already rendered");
            that.fireComplete();
        }, 500);

        return;
    }

// Note 2265325: PDF.js initialization moved to top
      //  var appRootDir = jQuery.sap.getModulePath("hcm.mypaystubs"); // + "/ext/pdfjs/pdf.worker.js";//com.sap.kelley.getAppContainer().getDescriptor("Payslip").getPdfPath();
//    if (sap.ui.core.AppCacheBuster && !jQuery.sap.getUriParameters().get("local")) {
//        pdfPath = sap.ui.core.AppCacheBuster.convertURL(pdfPath);
//    }

    // Fetch the PDF document from the URL using promices
    PDFJS.getDocument(this._pdfData).then(function getPdfForm(pdf) {
        // Rendering all pages starting from first
        that._pdf = pdf;
        var viewer = id, pageNumber = 1;
        that.renderPage(viewer, pdf, pageNumber++, function pageRenderingComplete() {

            // check for last page
            if (pageNumber > pdf.numPages) {
                jQuery.sap.log.debug("renderPage complete");
                that.fireComplete();
//                jQuery.sap.measure.end(sap.hcm.payslip.utils.PerfUtils.getEndId(sap.hcm.payslip.utils.PerfUtils.RenderPdf));
                return; // All pages rendered
            }

            // continue rendering of the next page
            jQuery.sap.log.debug("render another page");
            that.renderPage(viewer, pdf, pageNumber++, pageRenderingComplete);

        }, contextArray);
    });
};


hcm.mypaystubs.controls.PDFViewer.prototype.renderPage = function(div, pdf, pageNumber, callback) {
    pdf.getPage(pageNumber).then(function(page) {
        jQuery.sap.log.debug("renderingPage "+pageNumber);
        var containerWidth, viewportWithoutZoom, viewportWidth, factor, scale, viewport;

        scale = 2;

        // check for valid page
        if (!div.offsetParent || !div.offsetParent.clientWidth)  {
            jQuery.sap.log.debug("invalid offsetParent");
            return;
        }

        containerWidth = div.offsetParent.clientWidth;
        viewportWithoutZoom = page.getViewport(1);
        viewportWidth = viewportWithoutZoom.width;
        factor = sap.ui.Device.system.phone ? 1 : containerWidth / viewportWidth;
        viewport = page.getViewport(scale * factor);

        var pageDisplayWidth = viewport.width;
        var pageDisplayHeight = viewport.height;

        var pageDivHolder = document.createElement('div');
        pageDivHolder.className = 'pdfpage';

        if (sap.ui.Device.system.phone) {
            pageDivHolder.style.width = pageDisplayWidth + 'px';
            pageDivHolder.style.height = pageDisplayHeight + 'px';

        } else {
            pageDivHolder.style.width = pageDisplayWidth / scale + 'px';
            pageDivHolder.style.height = pageDisplayHeight / scale + 'px';
        }

        div.appendChild(pageDivHolder);

        // Prepare canvas using PDF page dimensions
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        canvas.width = pageDisplayWidth;
        canvas.height = pageDisplayHeight;

        if (sap.ui.Device.system.phone) {
            canvas.style.width = pageDisplayWidth + 'px';
            canvas.style.height = pageDisplayHeight + 'px';

        } else {
            canvas.style.width = pageDisplayWidth / scale + 'px';
            canvas.style.height = pageDisplayHeight / scale + 'px';
        }

        // Render PDF page into canvas context
        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        page.render(renderContext).then(function() {
            pageDivHolder.appendChild(canvas);
            callback();
        });
    });
};
},
  "hcm/mypaystubs/controls/PDFViewerRenderer.js":function(){/*
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
},
  "hcm/mypaystubs/controls/ZoomableScrollContainer.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mypaystubs.controls.ZoomableScrollContainer");

sap.m.ScrollContainer.extend("hcm.mypaystubs.controls.ZoomableScrollContainer", { metadata:{

    // ---- object ----
    publicMethods:[
        // methods
    ],

    // ---- control specific ----
    library:"sap.m",
    properties:{
        "zoomable":{type:"boolean", group:"Misc", defaultValue:true},
        "initialScale":{type:"float", group:"Misc", defaultValue:1},
        "minScale":{type:"float", group:"Misc", defaultValue:1},
        "maxScale":{type:"float", group:"Misc", defaultValue:4}
    },
    events:{

    }
}});


hcm.mypaystubs.controls.ZoomableScrollContainer.prototype.init = function() {
    sap.m.ScrollContainer.prototype.init.apply(this);

};

hcm.mypaystubs.controls.ZoomableScrollContainer.prototype.onAfterRendering = function() {

    var fnCallback = this.getScrollDelegate().onAfterRendering;

    var fScale = this.getInitialScale();
    var fMin = this.getMinScale();
    var fMax = this.getMaxScale();
    var bZoomable = this.getZoomable();


    this.getScrollDelegate().onAfterRendering = function(){
        fnCallback.call(this);
        if(this._scroller){
          this._scroller.scale = fScale;
          if(this._scroller.options){
            this._scroller.options.zoom = bZoomable;
                this._scroller.options.zoomMin = fMin;
                this._scroller.options.zoomMax = fMax;
                this._scroller.options.onZoom = function(oEvent) {
                    // "this" is the scroller
                };
                this._scroller.options.onZoomStart = function(oEvent) {
                };
          }
          if(this._scroller.zoom){
               this._scroller.zoom(0, 0, fScale);
          }
        }
    };
};



//
hcm.mypaystubs.controls.ZoomableScrollContainer.prototype.resetContent = function() {
    this.$().append(this.getContent()[0].$());
    this.getScrollDelegate()._scroller.refresh();
};
},
  "hcm/mypaystubs/controls/ZoomableScrollContainerRenderer.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mypaystubs.controls.ZoomableScrollContainerRenderer");
jQuery.sap.require("sap.ui.core.Renderer");
jQuery.sap.require("sap.m.ScrollContainerRenderer");

/**
 * @class ZoomableScrollContainer renderer. 
 * @static
 */
hcm.mypaystubs.controls.ZoomableScrollContainerRenderer = sap.ui.core.Renderer.extend(sap.m.ScrollContainerRenderer);
},
  "hcm/mypaystubs/i18n/i18n.properties":'#Translatable strings for My Paystubs application\n# __ldi.translation.uuid=e3ea0520-5909-11e4-8ed6-0800200c9a66\n\n#XTIT: this is the title for the master section\nMASTER_TITLE=Paystubs ({0})\n\n#XTIT: this is
 the+
 title for the detail section\nDETAIL_TITLE=Paystub\n\n#XTIT: Application name\nDISPLAY_NAME=My Paystubs \n\n#XTIT: Title for payslip list\nDISPLAY_NAME_LIST=Paystubs ({0})\n\n#XTIT: Title for payslip details\nDISPLAY_NAME_DETAILS=Paystub\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=Open as PDF\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=Bonus Payment\n\n#XFLD: Reason for Offcycle Payment\nOFFCYCLE_REASON=Off-cycle reason\n\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=Correction Accounting\n\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=Manual Check\n\n#XFLD: Payment type\nPAYSLIP_REGULAR=Regular Payroll Run\n\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=Additional Payment\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=No Data Available\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=Take home pay in\n\n#XFLD: Employee ID\nEMPLOYEE_ID=Employee ID\n\n#XFLD: Employee Position\nEMPLOYEE_POSITION=Position\n\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=Deductions\n\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=Gross Pay\n\n#XFLD: Payslip payroll Period\nPAYROLL_PERIOD=Pay Period\n\n#XFLD: Payslip pay date\nPAY_DATE=Pay Date\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=Maximum Selection\n\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE=You may not select more than {0} paystubs\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=Could not obtain the list of paystubs\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=Could not obtain the PDF of the paystub\n\n#XTIT: Title for new PFD window {0}:End date of paystub\nPDF_WINDOW_TITLE=Paystub_{0}\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=You need to install a PDF reader in order to view paystubs\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=Loading\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Choose a Personnel Assignment\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Personnel Assignments\n\n#XBUT: Button to cancel\nCANCEL=Cancel\n\n#XBUT: Button for confirm\nOK=OK\n\n#YMSG: Message shown on empty detail page if no payslips are available\nNO_PAYSLIPS_AVAILABLE=No payslips to be displayed',
  "hcm/mypaystubs/i18n/i18n_ar.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=\\u0642\\u0633\\u0627\\u0626\\u0645 \\u0627\\u0644\\u0631\\u0627\\u062A\\u0628 ({0})\n\n#XTIT: this is the title for the detail
 section\nDETAIL_TIT+
LE=\\u0642\\u0633\\u064A\\u0645\\u0629 \\u0627\\u0644\\u0631\\u0627\\u062A\\u0628\n\n#XTIT: Application name\nDISPLAY_NAME=\\u0642\\u0633\\u0627\\u0626\\u0645 \\u0631\\u0627\\u062A\\u0628\\u064A\n\n#XTIT: Title for payslip list\nDISPLAY_NAME_LIST=\\u0642\\u0633\\u0627\\u0626\\u0645 \\u0627\\u0644\\u0631\\u0627\\u062A\\u0628 ({0})\n\n#XTIT: Title for payslip details\nDISPLAY_NAME_DETAILS=\\u0642\\u0633\\u064A\\u0645\\u0629 \\u0627\\u0644\\u0631\\u0627\\u062A\\u0628\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=\\u0641\\u062A\\u062D \\u0643\\u0645\\u0644\\u0641 PDF\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=\\u062F\\u0641\\u0639\\u0629 \\u0627\\u0644\\u0645\\u0643\\u0627\\u0641\\u0623\\u0629\n\n#XFLD: Reason for Offcycle Payment\nOFFCYCLE_REASON=\\u0633\\u0628\\u0628 \\u0627\\u0644\\u062F\\u0641\\u0639\\u0629 \\u063A\\u064A\\u0631 \\u0627\\u0644\\u062F\\u0648\\u0631\\u064A\\u0629\n\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=\\u0645\\u062D\\u0627\\u0633\\u0628\\u0629 \\u062A\\u0635\\u062D\\u064A\\u062D\\u064A\\u0629\n\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=\\u0634\\u064A\\u0643 \\u064A\\u062F\\u0648\\u064A\n\n#XFLD: Payment type\nPAYSLIP_REGULAR=\\u062A\\u0634\\u063A\\u064A\\u0644 \\u0643\\u0634\\u0641 \\u0631\\u0648\\u0627\\u062A\\u0628 \\u0639\\u0627\\u062F\\u064A\n\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=\\u062F\\u0641\\u0639\\u0629 \\u0625\\u0636\\u0627\\u0641\\u064A\\u0629\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=\\u0644\\u0627 \\u062A\\u062A\\u0648\\u0641\\u0631 \\u0628\\u064A\\u0627\\u0646\\u0627\\u062A\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=\\u0635\\u0627\\u0641\\u064A \\u0627\\u0644\\u0631\\u0627\\u062A\\u0628 \\u0641\\u064A\n\n#XFLD: Employee ID\nEMPLOYEE_ID=\\u0645\\u0639\\u0631\\u0641 \\u0627\\u0644\\u0645\\u0648\\u0638\\u0641\n\n#XFLD: Employee Position\nEMPLOYEE_POSITION=\\u0627\\u0644\\u0645\\u0646\\u0635\\u0628\n\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=\\u0627\\u0644\\u0627\\u0633\\u062A\\u0642\\u0637\\u0627\\u0639\\u0627\\u062A\n\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=\\u0627\\u0644\\u062F\\u064E\\u0641\\u0639\\u0629 \\u0627\\u0644\\u0625\\u062C\\u0645\\u0627\\u0644\\u064A\\u0629\n\n#XFLD: Payslip payroll Period\nPAYROLL_PERIOD=\\u0641\\u062A\\u0631\\u0629 \\u0643\\u0634\\u0641 \\u0627\\u0644\\u0631\\u0648\\u0627\\u062A\\u0628\n\n#XFLD: Payslip pay date\nPAY_DATE=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u062F\\u0641\\u0639\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=\\u0627\\u0644\\u062D\\u062F \\u0627\\u0644\\u0623\\u0642\\u0635\\u0649 \\u0644\\u0644\\u062A\\u062D\\u062F\\u064A\\u062F\n\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE=\\u0644\\u0627 \\u064A\\u0645\\u0643\\u0646\\u0643 \\u062A\\u062D\\u062F\\u064A\\u062F \\u0623\\u0643\\u062B\\u0631 \\u0645\\u0646 {0} \\u0645\\u0646 \\u0642\\u0633\\u0627\\u0626\\u0645 \\u0627\\u0644\\u0631\\u0627\\u062A\\u0628\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=\\u062A\\u0639\\u0630\\u0631 \\u0627\\u0644\\u062D\\u0635\\u0648\\u0644 \\u0639\\u0644\\u0649 \\u0642\\u0627\\u0626\\u0645\\u0629 \\u0628\\u0642\\u0633\\u0627\\u0626\\u0645 \\u0627\\u0644\\u0631\\u0648\\u0627\\u062A\\u0628\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=\\u062A\\u0639\\u0630\\u0631 \\u0627\\u0644\\u062D\\u0635\\u0648\\u0644 \\u0639\\u0644\\u0649 \\u0645\\u0644\\u0641 PDF \\u0644\\u0642\\u0633\\u064A\\u0645\\u0629 \\u0627\\u0644\\u0631\\u0627\\u062A\\u0628\n\n#XTIT: Title for new PFD window {0}:End date of paystub\nPDF_WINDOW_TITLE=\\u0642\\u0633\\u064A\\u0645\\u0629 \\u0627\\u0644\\u0631\\u0627\\u062A\\u0628 {0}\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=\\u064A\\u062C\\u0628 \\u0639\\u0644\\u064A\\u0643 \\u062A\\u062B\\u0628\\u064A\\u062A \\u0642\\u0627\\u0631\\u0626 \\u0645\\u0644\\u0641\\u0627\\u062A PDF \\u0644\\u0639\\u0631\\u0636 \\u0642\\u0633\\u0627\\u0626\\u0645 \\u0627\\u0644\\u0631\\u0648\\u0627\\u062A\\u0628\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=\\u062C\\u0627\\u0631\\u064D \\u0627\\u0644\\u062A\\u062D\\u0645\\u064A\\u0644...\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=\\u0627\\u062E\\u062A\\u0631 \\u062A\\u0639\\u064A\\u064A\\u0646 \\u0645\\u0648\\u0638\\u0641\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=\\u062A\\u0639\\u064A\\u064A\\u0646\\u0627\\u062A \\u0627\\u0644\\u0645\\u0648\\u0638\\u0641\\u064A\\u0646\n\n#XBUT: Button to cancel\nCANCEL=\\u0625\\u0644\\u063A\\u0627\\u0621\n\n#XBUT: Button for confirm\nOK=\\u0645\\u0648\\u0627\\u0641\\u0642\n\n#YMSG: Message shown on empty detail page if no payslips are available\nNO_PAYSLIPS_AVAILABLE=\\u0644\\u0627 \\u062A\\u0648\\u062C\\u062F \\u0642\\u0633\\u0627\\u0626\\u0645 \\u0631\\u0627\\u062A\\u0628 \\u0645\\u0637\\u0644\\u0648\\u0628 \\u0639\\u0631\\u0636\\u0647\\u0627.\n',
  "hcm/mypaystubs/i18n/i18n_bg.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=\\u0424\\u0438\\u0448 \\u0437\\u0430 \\u0437\\u0430\\u043F\\u043B\\u0430\\u0442\\u0430 ({0})\n\n#XTIT: this is the title for the detail
 section\nDE+
TAIL_TITLE=\\u0424\\u0438\\u0448 \\u0437\\u0430 \\u0437\\u0430\\u043F\\u043B\\u0430\\u0442\\u0430\n\n#XTIT: Application name\nDISPLAY_NAME=\\u041C\\u043E\\u0438\\u0442\\u0435 \\u0444\\u0438\\u0448\\u043E\\u0432\\u0435 \\u0437\\u0430 \\u0437\\u0430\\u043F\\u043B\\u0430\\u0442\\u0430\n\n#XTIT: Title for payslip list\nDISPLAY_NAME_LIST=\\u0424\\u0438\\u0448 \\u0437\\u0430 \\u0437\\u0430\\u043F\\u043B\\u0430\\u0442\\u0430 ({0})\n\n#XTIT: Title for payslip details\nDISPLAY_NAME_DETAILS=\\u0424\\u0438\\u0448 \\u0437\\u0430 \\u0437\\u0430\\u043F\\u043B\\u0430\\u0442\\u0430\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=\\u041E\\u0442\\u0432\\u0430\\u0440\\u044F\\u043D\\u0435 \\u043A\\u0430\\u0442\\u043E PDF\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=\\u0417\\u0430\\u043F\\u043B\\u0430\\u0449\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0431\\u043E\\u043D\\u0443\\u0441\n\n#XFLD: Reason for Offcycle Payment\nOFFCYCLE_REASON=\\u041F\\u0440\\u0438\\u0447\\u0438\\u043D\\u0430 \\u0437\\u0430 \\u0438\\u0437\\u0432\\u044A\\u043D\\u0440\\u0435\\u0434\\u043D\\u043E \\u043F\\u043B\\u0430\\u0449\\u0430\\u043D\\u0435\n\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=\\u0421\\u0447\\u0435\\u0442\\u043E\\u0432\\u043E\\u0434\\u0441\\u0442\\u0432\\u043E \\u043D\\u0430 \\u043A\\u043E\\u0440\\u0435\\u043A\\u0446\\u0438\\u0438\n\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=\\u0420\\u044A\\u0447\\u043D\\u0430 \\u043F\\u0440\\u043E\\u0432\\u0435\\u0440\\u043A\\u0430\n\n#XFLD: Payment type\nPAYSLIP_REGULAR=\\u0420\\u0435\\u0434\\u043E\\u0432\\u043D\\u043E \\u0438\\u0437\\u043F\\u044A\\u043B\\u043D\\u0435\\u043D\\u0438\\u0435 \\u043D\\u0430 \\u0432\\u0435\\u0434\\u043E\\u043C\\u043E\\u0441\\u0442 \\u0437\\u0430\\u043F\\u043B\\u0430\\u0442\\u0438\n\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=\\u0414\\u043E\\u043F\\u044A\\u043B\\u043D\\u0438\\u0442\\u0435\\u043B\\u043D\\u043E \\u043F\\u043B\\u0430\\u0449\\u0430\\u043D\\u0435\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=\\u041D\\u044F\\u043C\\u0430 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=\\u041D\\u0435\\u0442\\u043D\\u0430 \\u0437\\u0430\\u043F\\u043B\\u0430\\u0442\\u0430 \\u0432\n\n#XFLD: Employee ID\nEMPLOYEE_ID=\\u0418\\u0414 \\u043D\\u0430 \\u0441\\u043B\\u0443\\u0436\\u0438\\u0442\\u0435\\u043B\n\n#XFLD: Employee Position\nEMPLOYEE_POSITION=\\u041F\\u043E\\u0437\\u0438\\u0446\\u0438\\u044F\n\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=\\u0423\\u0434\\u0440\\u044A\\u0436\\u043A\\u0438\n\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=\\u0411\\u0440\\u0443\\u0442\\u043D\\u043E \\u043F\\u043B\\u0430\\u0449\\u0430\\u043D\\u0435\n\n#XFLD: Payslip payroll Period\nPAYROLL_PERIOD=\\u041F\\u0435\\u0440\\u0438\\u043E\\u0434 \\u043D\\u0430 \\u0432\\u0435\\u0434\\u043E\\u043C\\u043E\\u0441\\u0442 \\u0437\\u0430\\u043F\\u043B\\u0430\\u0442\\u0438\n\n#XFLD: Payslip pay date\nPAY_DATE=\\u0414\\u0430\\u0442\\u0430 \\u0437\\u0430 \\u043F\\u043B\\u0430\\u0449\\u0430\\u043D\\u0435\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=\\u041C\\u0430\\u043A\\u0441\\u0438\\u043C\\u0430\\u043B\\u0435\\u043D \\u0438\\u0437\\u0431\\u043E\\u0440\n\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE=\\u041D\\u0435 \\u043C\\u043E\\u0436\\u0435 \\u0434\\u0430 \\u0438\\u0437\\u0431\\u0435\\u0440\\u0435\\u0442\\u0435 \\u043F\\u043E\\u0432\\u0435\\u0447\\u0435 \\u043E\\u0442 {0} \\u0444\\u0438\\u0448\\u0430 \\u0437\\u0430 \\u0437\\u0430\\u043F\\u043B\\u0430\\u0442\\u0430\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=\\u041D\\u0435\\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E \\u043F\\u043E\\u043B\\u0443\\u0447\\u0430\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0441\\u043F\\u0438\\u0441\\u044A\\u043A\\u0430 \\u0441 \\u0444\\u0438\\u0448\\u043E\\u0432\\u0435\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=\\u041D\\u0435\\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E \\u043F\\u043E\\u043B\\u0443\\u0447\\u0430\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 PDF \\u0437\\u0430 \\u0444\\u0438\\u0448\\u043E\\u0432\\u0435\n\n#XTIT: Title for new PFD window {0}:End date of paystub\nPDF_WINDOW_TITLE=\\u0424\\u0438\\u0448 \\u0437\\u0430 \\u0437\\u0430\\u043F\\u043B\\u0430\\u0442\\u0430_{0}\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=\\u0422\\u0440\\u044F\\u0431\\u0432\\u0430 \\u0434\\u0430 \\u0438\\u043D\\u0441\\u0442\\u0430\\u043B\\u0438\\u0440\\u0430\\u0442\\u0435 \\u043F\\u0440\\u043E\\u0433\\u0440\\u0430\\u043C\\u0430 \\u0437\\u0430 \\u0447\\u0435\\u0442\\u0435\\u043D\\u0435 \\u043D\\u0430 PDF \\u0444\\u0430\\u0439\\u043B\\u043E\\u0432\\u0435, \\u0437\\u0430 \\u0434\\u0430 \\u043E\\u0442\\u0432\\u0430\\u0440\\u044F\\u0442\\u0435 \\u0444\\u0438\\u0448\\u043E\\u0432\\u0435\\u0442\\u0435\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=\\u0417\\u0430\\u0440\\u0435\\u0436\\u0434\\u0430\\u043D\\u0435...\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=\\u0418\\u0437\\u0431\\u0435\\u0440\\u0435\\u0442\\u0435 \\u043F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u044F\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u0435\\u0440\\u0441\\u043E\\u043D\\u0430\\u043B\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=\\u041F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u044F\\u0432\\u0430\\u043D\\u0438\\u044F \\u043D\\u0430 \\u043F\\u0435\\u0440\\u0441\\u043E\\u043D\\u0430\\u043B\n\n#XBUT: Button to cancel\nCANCEL=\\u041E\\u0442\\u043A\\u0430\\u0437\n\n#XBUT: Button for confirm\nOK=OK\n\n#YMSG: Message shown on empty detail page if no payslips are available\nNO_PAYSLIPS_AVAILABLE=\\u041D\\u044F\\u043C\\u0430 \\u0444\\u0438\\u0448\\u043E\\u0432\\u0435 \\u0437\\u0430 \\u0437\\u0430\\u043F\\u043B\\u0430\\u0442\\u0438 \\u0437\\u0430 \\u043F\\u043E\\u043A\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435.\n',
  "hcm/mypaystubs/i18n/i18n_cs.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=V\\u00FDplatn\\u00ED p\\u00E1sky ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=V\\u00FDplatn\\u00ED
 p\\u00E1ska\n\n#XTIT: +
Application name\nDISPLAY_NAME=Moje v\\u00FDplatn\\u00ED p\\u00E1sky\n\n#XTIT: Title for payslip list\nDISPLAY_NAME_LIST=V\\u00FDplatn\\u00ED p\\u00E1sky ({0})\n\n#XTIT: Title for payslip details\nDISPLAY_NAME_DETAILS=V\\u00FDplatn\\u00ED p\\u00E1ska\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=Otev\\u0159\\u00EDt jako PDF\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=Platba p\\u0159\\u00EDplatku\n\n#XFLD: Reason for Offcycle Payment\nOFFCYCLE_REASON=D\\u016Fvod platby \\u201Eoff-cycle\\u201C\n\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=Opravn\\u00E9 \\u00FA\\u010Dtov\\u00E1n\\u00ED\n\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=Manu\\u00E1ln\\u00ED kontrola\n\n#XFLD: Payment type\nPAYSLIP_REGULAR=Pravideln\\u00FD b\\u011Bh z\\u00FA\\u010Dtov\\u00E1n\\u00ED mezd a plat\\u016F\n\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=Dopl\\u0148kov\\u00E1 platba\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=Nejsou k dispozici \\u017E\\u00E1dn\\u00E1 data\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=Platba netto\n\n#XFLD: Employee ID\nEMPLOYEE_ID=ID zam\\u011Bstnance\n\n#XFLD: Employee Position\nEMPLOYEE_POSITION=Pozice\n\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=Sr\\u00E1\\u017Eky\n\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=Platba brutto\n\n#XFLD: Payslip payroll Period\nPAYROLL_PERIOD=Obdob\\u00ED z\\u00FA\\u010Dtov\\u00E1n\\u00ED\n\n#XFLD: Payslip pay date\nPAY_DATE=Datum platby\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=Maxim\\u00E1ln\\u00ED v\\u00FDb\\u011Br\n\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE=Nem\\u016F\\u017Eete vybrat v\\u00EDce ne\\u017E {0} v\\u00FDplatn\\u00EDch p\\u00E1sek\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=Nelze z\\u00EDskat seznam v\\u00FDplatn\\u00EDch p\\u00E1sek\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=Nelze z\\u00EDskat PDF s v\\u00FDplatn\\u00ED p\\u00E1skou\n\n#XTIT: Title for new PFD window {0}:End date of paystub\nPDF_WINDOW_TITLE=V\\u00FDplatn\\u00ED p\\u00E1ska_{0}\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=Chcete-li zobrazit v\\u00FDplatn\\u00ED p\\u00E1sky, mus\\u00EDte nainstalovat program pro \\u010Dten\\u00ED PDF\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=Zav\\u00E1d\\u00ED se...\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Zvolte pracovn\\u00ED smlouvu\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Pracovn\\u00ED smlouvy\n\n#XBUT: Button to cancel\nCANCEL=Zru\\u0161it\n\n#XBUT: Button for confirm\nOK=OK\n\n#YMSG: Message shown on empty detail page if no payslips are available\nNO_PAYSLIPS_AVAILABLE=Neexistuj\\u00ED \\u017E\\u00E1dn\\u00E9 v\\u00FDplatn\\u00ED p\\u00E1sky k zobrazen\\u00ED.\n',
  "hcm/mypaystubs/i18n/i18n_de.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Entgeltnachweise ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Entgeltnachweis\n\n#XTIT: Application
 name\nDISPLAY_NAME=Me+
ine Entgeltnachweise\n\n#XTIT: Title for payslip list\nDISPLAY_NAME_LIST=Entgeltnachweise ({0})\n\n#XTIT: Title for payslip details\nDISPLAY_NAME_DETAILS=Entgeltnachweis\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=Als PDF \\u00F6ffnen\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=Bonuszahlung\n\n#XFLD: Reason for Offcycle Payment\nOFFCYCLE_REASON=Grund f\\u00FCr Off-Cycle-Zahlung\n\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=Korrekturabrechnung\n\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=Scheck\n\n#XFLD: Payment type\nPAYSLIP_REGULAR=Regul\\u00E4re Abrechnung\n\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=Zusatzzahlung\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=Keine Daten vorhanden\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=Zahlbetrag in\n\n#XFLD: Employee ID\nEMPLOYEE_ID=Mitarbeiter-ID\n\n#XFLD: Employee Position\nEMPLOYEE_POSITION=Planstelle\n\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=Abz\\u00FCge\n\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=Bruttoentgelt\n\n#XFLD: Payslip payroll Period\nPAYROLL_PERIOD=Abrechnungsperiode\n\n#XFLD: Payslip pay date\nPAY_DATE=Zahldatum\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=Maximale Auswahl\n\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE=Sie k\\u00F6nnen maximal {0} Entgeltnachweise ausw\\u00E4hlen.\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=Die Entgeltnachweisliste kann nicht abgerufen werden.\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=Der Entgeltnachweis kann nicht als PDF-Datei abgerufen werden.\n\n#XTIT: Title for new PFD window {0}:End date of paystub\nPDF_WINDOW_TITLE=Entgeltnachweis_{0}\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=Installieren Sie einen PDF-Reader, um Entgeltnachweise anzuzeigen.\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=Laden ...\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=W\\u00E4hlen Sie einen Besch\\u00E4ftigungsvertrag\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Besch\\u00E4ftigungsvertr\\u00E4ge\n\n#XBUT: Button to cancel\nCANCEL=Abbrechen\n\n#XBUT: Button for confirm\nOK=OK\n\n#YMSG: Message shown on empty detail page if no payslips are available\nNO_PAYSLIPS_AVAILABLE=Es sind keine Entgeltnachweise verf\\u00FCgbar.\n',
  "hcm/mypaystubs/i18n/i18n_en.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Paystubs ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Paystub\n\n#XTIT: Application name\nDISPLAY_NAME=My
 Paystubs\n\n#XT+
IT: Title for payslip list\nDISPLAY_NAME_LIST=Paystubs ({0})\n\n#XTIT: Title for payslip details\nDISPLAY_NAME_DETAILS=Paystub\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=Open as PDF\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=Bonus Payment\n\n#XFLD: Reason for Offcycle Payment\nOFFCYCLE_REASON=Off-Cycle Payment Reason\n\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=Correction Accounting\n\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=Manual Check\n\n#XFLD: Payment type\nPAYSLIP_REGULAR=Regular Payroll Run\n\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=Additional Payment\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=No Data Available\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=Take Home Pay in\n\n#XFLD: Employee ID\nEMPLOYEE_ID=Employee ID\n\n#XFLD: Employee Position\nEMPLOYEE_POSITION=Position\n\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=Deductions\n\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=Gross Pay\n\n#XFLD: Payslip payroll Period\nPAYROLL_PERIOD=Payroll Period\n\n#XFLD: Payslip pay date\nPAY_DATE=Pay Date\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=Maximum Selection\n\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE=You may not select more than {0} paystubs\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=Could not obtain the list of paystubs\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=Could not obtain the paystub PDF\n\n#XTIT: Title for new PFD window {0}:End date of paystub\nPDF_WINDOW_TITLE=Paystub_{0}\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=You need to install a PDF reader to view paystubs\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=Loading...\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Choose a Personnel Assignment\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Personnel Assignments\n\n#XBUT: Button to cancel\nCANCEL=Cancel\n\n#XBUT: Button for confirm\nOK=OK\n\n#YMSG: Message shown on empty detail page if no payslips are available\nNO_PAYSLIPS_AVAILABLE=There are no payslips to be displayed.\n',
  "hcm/mypaystubs/i18n/i18n_en_US_sappsd.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=[[[\\u01A4\\u0105\\u0177\\u015F\\u0163\\u0171\\u0183\\u015F ({0})]]]\n\n#XTIT: this is the title for the detail
 section\nDETAIL_TITLE=[[[+
\\u01A4\\u0105\\u0177\\u015F\\u0163\\u0171\\u0183\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Application name\nDISPLAY_NAME=[[[\\u039C\\u0177 \\u01A4\\u0105\\u0177\\u015F\\u0163\\u0171\\u0183\\u015F \\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Title for payslip list\nDISPLAY_NAME_LIST=[[[\\u01A4\\u0105\\u0177\\u015F\\u0163\\u0171\\u0183\\u015F ({0})]]]\n\n#XTIT: Title for payslip details\nDISPLAY_NAME_DETAILS=[[[\\u01A4\\u0105\\u0177\\u015F\\u0163\\u0171\\u0183\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=[[[\\u014E\\u03C1\\u0113\\u014B \\u0105\\u015F \\u01A4\\u010E\\u0191\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=[[[\\u0181\\u014F\\u014B\\u0171\\u015F \\u01A4\\u0105\\u0177\\u0271\\u0113\\u014B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Reason for Offcycle Payment\nOFFCYCLE_REASON=[[[\\u014E\\u0192\\u0192-\\u010B\\u0177\\u010B\\u013A\\u0113 \\u0157\\u0113\\u0105\\u015F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=[[[\\u0108\\u014F\\u0157\\u0157\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B \\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163\\u012F\\u014B\\u011F\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=[[[\\u039C\\u0105\\u014B\\u0171\\u0105\\u013A \\u0108\\u0125\\u0113\\u010B\\u0137\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Payment type\nPAYSLIP_REGULAR=[[[\\u0158\\u0113\\u011F\\u0171\\u013A\\u0105\\u0157 \\u01A4\\u0105\\u0177\\u0157\\u014F\\u013A\\u013A \\u0158\\u0171\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=[[[\\u0100\\u018C\\u018C\\u012F\\u0163\\u012F\\u014F\\u014B\\u0105\\u013A \\u01A4\\u0105\\u0177\\u0271\\u0113\\u014B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=[[[\\u0143\\u014F \\u010E\\u0105\\u0163\\u0105 \\u0100\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=[[[\\u0162\\u0105\\u0137\\u0113 \\u0125\\u014F\\u0271\\u0113 \\u03C1\\u0105\\u0177 \\u012F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Employee ID\nEMPLOYEE_ID=[[[\\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113 \\u012C\\u010E\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Employee Position\nEMPLOYEE_POSITION=[[[\\u01A4\\u014F\\u015F\\u012F\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=[[[\\u010E\\u0113\\u018C\\u0171\\u010B\\u0163\\u012F\\u014F\\u014B\\u015F\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=[[[\\u0122\\u0157\\u014F\\u015F\\u015F \\u01A4\\u0105\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Payslip payroll Period\nPAYROLL_PERIOD=[[[\\u01A4\\u0105\\u0177 \\u01A4\\u0113\\u0157\\u012F\\u014F\\u018C\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Payslip pay date\nPAY_DATE=[[[\\u01A4\\u0105\\u0177 \\u010E\\u0105\\u0163\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=[[[\\u039C\\u0105\\u03C7\\u012F\\u0271\\u0171\\u0271 \\u015C\\u0113\\u013A\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE=[[[\\u0176\\u014F\\u0171 \\u0271\\u0105\\u0177 \\u014B\\u014F\\u0163 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0271\\u014F\\u0157\\u0113 \\u0163\\u0125\\u0105\\u014B {0} \\u03C1\\u0105\\u0177\\u015F\\u0163\\u0171\\u0183\\u015F]]]\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=[[[\\u0108\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u014F\\u0183\\u0163\\u0105\\u012F\\u014B \\u0163\\u0125\\u0113 \\u013A\\u012F\\u015F\\u0163 \\u014F\\u0192 \\u03C1\\u0105\\u0177\\u015F\\u0163\\u0171\\u0183\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=[[[\\u0108\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u014F\\u0183\\u0163\\u0105\\u012F\\u014B \\u0163\\u0125\\u0113 \\u01A4\\u010E\\u0191 \\u014F\\u0192 \\u0163\\u0125\\u0113 \\u03C1\\u0105\\u0177\\u015F\\u0163\\u0171\\u0183\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Title for new PFD window {0}:End date of paystub\nPDF_WINDOW_TITLE=[[[\\u01A4\\u0105\\u0177\\u015F\\u0163\\u0171\\u0183_{0}]]]\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=[[[\\u0176\\u014F\\u0171 \\u014B\\u0113\\u0113\\u018C \\u0163\\u014F \\u012F\\u014B\\u015F\\u0163\\u0105\\u013A\\u013A \\u0105 \\u01A4\\u010E\\u0191 \\u0157\\u0113\\u0105\\u018C\\u0113\\u0157 \\u012F\\u014B \\u014F\\u0157\\u018C\\u0113\\u0157 \\u0163\\u014F \\u028B\\u012F\\u0113\\u0175 \\u03C1\\u0105\\u0177\\u015F\\u0163\\u0171\\u0183\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=[[[\\u013B\\u014F\\u0105\\u018C\\u012F\\u014B\\u011F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=[[[\\u0108\\u0125\\u014F\\u014F\\u015F\\u0113 \\u0105 \\u01A4\\u0113\\u0157\\u015F\\u014F\\u014B\\u014B\\u0113\\u013A \\u0100\\u015F\\u015F\\u012F\\u011F\\u014B\\u0271\\u0113\\u014B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=[[[\\u01A4\\u0113\\u0157\\u015F\\u014F\\u014B\\u014B\\u0113\\u013A \\u0100\\u015F\\u015F\\u012F\\u011F\\u014B\\u0271\\u0113\\u014B\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XBUT: Button to cancel\nCANCEL=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XBUT: Button for confirm\nOK=[[[\\u014E\\u0136\\u2219\\u2219]]]\n\n#YMSG: Message shown on empty detail page if no payslips are available\nNO_PAYSLIPS_AVAILABLE=[[[\\u0143\\u014F \\u03C1\\u0105\\u0177\\u015F\\u013A\\u012F\\u03C1\\u015F \\u0163\\u014F \\u0183\\u0113 \\u018C\\u012F\\u015F\\u03C1\\u013A\\u0105\\u0177\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n',
  "hcm/mypaystubs/i18n/i18n_en_US_saptrc.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=4DY4g9ZK9vgw39r/Zhqg/Q_Paystubs ({0})\n\n#XTIT: this is the title for the detail
 section\nDETAIL_TITLE=YlQ69SV4HCRJNnol5ViLvw_Paystub\n\n+
#XTIT: Application name\nDISPLAY_NAME=U0e18Trb6HBoiRrqvSHByw_My Paystubs \n\n#XTIT: Title for payslip list\nDISPLAY_NAME_LIST=Ps1PkqK/Z795Ug24VrBfPg_Paystubs ({0})\n\n#XTIT: Title for payslip details\nDISPLAY_NAME_DETAILS=WvYKoBr0ajz1Lr2F4/F2nA_Paystub\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=iLNsDUIqZklPtgfWwYT34w_Open as PDF\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=tN8bCgg0EyMZJ1Hs/yzioQ_Bonus Payment\n\n#XFLD: Reason for Offcycle Payment\nOFFCYCLE_REASON=nE25PL+KPQ2gZlPW/a3ICg_Off-cycle reason\n\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=7scwULJ9HBZDZ2+Dlo2Siw_Correction Accounting\n\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=XQ0zEqFXi2DdT8z3Z9w3+w_Manual Check\n\n#XFLD: Payment type\nPAYSLIP_REGULAR=6n/qGOkfhz1R+WTfyOo1EA_Regular Payroll Run\n\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=a4f78f6Ip3n+chXaU4u+Hg_Additional Payment\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=aJtOtPBkjCa6Kf9KqMxl/w_No Data Available\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=VhkyJ19oeEgQ1qCExz23ew_Take home pay in\n\n#XFLD: Employee ID\nEMPLOYEE_ID=xztjSchSFBwMi/X842jy3w_Employee ID\n\n#XFLD: Employee Position\nEMPLOYEE_POSITION=eRCWbTzOy+y4VUqKet6HMQ_Position\n\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=XXsD8ixKSuzefWkx4H8I6Q_Deductions\n\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=vsOgougSG6fy3h+dumNGPw_Gross Pay\n\n#XFLD: Payslip payroll Period\nPAYROLL_PERIOD=m6HdvuBYgw8w4FyImOkWmA_Pay Period\n\n#XFLD: Payslip pay date\nPAY_DATE=4FQWW4OiIX8RWcFPeDhgBQ_Pay Date\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=EC22KRMWXmfrCe3MyByidQ_Maximum Selection\n\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE=x569SMldH6XfDmetdjpGnw_You may not select more than {0} paystubs\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=qoWUweW8f7aNEeBn0sYZog_Could not obtain the list of paystubs\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=G2rM1vO1FfCApleP6yxX+A_Could not obtain the PDF of the paystub\n\n#XTIT: Title for new PFD window {0}:End date of paystub\nPDF_WINDOW_TITLE=IvZ0dvgP8Lk/C7BUmL1d2w_Paystub_{0}\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=6AiR9uleEjXtB/LckD15LQ_You need to install a PDF reader in order to view paystubs\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=4Ek26ZTvfjhE8S6wrbsjMQ_Loading\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=4t1us6qthtmukQVZED/HCw_Choose a Personnel Assignment\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=xY6XKt2K7wicI9nHKgXSYw_Personnel Assignments\n\n#XBUT: Button to cancel\nCANCEL=n+u/IFzk0paJpfSFa0TeYw_Cancel\n\n#XBUT: Button for confirm\nOK=BTT+msDH4hRW5vC9nPmYrw_OK\n\n#YMSG: Message shown on empty detail page if no payslips are available\nNO_PAYSLIPS_AVAILABLE=PddqB79WwfPSTmHltfGZ1Q_No payslips to be displayed\n',
  "hcm/mypaystubs/i18n/i18n_es.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Recibos de n\\u00F3minas ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Recibo de n\\u00F3mina\n\n#XTIT: Application
 name\n+
DISPLAY_NAME=Mis recibos de n\\u00F3minas\n\n#XTIT: Title for payslip list\nDISPLAY_NAME_LIST=Recibos de n\\u00F3minas ({0})\n\n#XTIT: Title for payslip details\nDISPLAY_NAME_DETAILS=Recibo de n\\u00F3mina\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=Abrir como PDF\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=Pago de primas\n\n#XFLD: Reason for Offcycle Payment\nOFFCYCLE_REASON=Motivo de pago especial\n\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=Contabilidad de correcci\\u00F3n\n\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=Verificaci\\u00F3n manual\n\n#XFLD: Payment type\nPAYSLIP_REGULAR=C\\u00E1lculo de n\\u00F3mina ordinaria\n\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=Pago suplementario\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=No existen datos\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=Remuneraci\\u00F3n neta\n\n#XFLD: Employee ID\nEMPLOYEE_ID=ID de empleado\n\n#XFLD: Employee Position\nEMPLOYEE_POSITION=Posici\\u00F3n\n\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=Deducciones\n\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=Pago bruto\n\n#XFLD: Payslip payroll Period\nPAYROLL_PERIOD=Per\\u00EDodo de c\\u00E1lculo de n\\u00F3mina\n\n#XFLD: Payslip pay date\nPAY_DATE=Fecha de pago\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=Selecci\\u00F3n m\\u00E1xima\n\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE=No puede seleccionar m\\u00E1s de {0} recibos de n\\u00F3minas\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=No se ha podido obtener la lista de recibos de n\\u00F3minas\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=No pudo obtenerse el PDF de los recibos de n\\u00F3minas\n\n#XTIT: Title for new PFD window {0}:End date of paystub\nPDF_WINDOW_TITLE=Recibo de n\\u00F3minas_{0}\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=Necesita instalar un lector de PDF para visualizar recibos de n\\u00F3minas\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=Cargando...\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Seleccione un contrato de ocupaci\\u00F3n\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Contratos de ocupaci\\u00F3n\n\n#XBUT: Button to cancel\nCANCEL=Cancelar\n\n#XBUT: Button for confirm\nOK=OK\n\n#YMSG: Message shown on empty detail page if no payslips are available\nNO_PAYSLIPS_AVAILABLE=No hay ning\\u00FAn recibo de n\\u00F3mina para mostrar.\n',
  "hcm/mypaystubs/i18n/i18n_fr.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Bulletins de paie ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Bulletin de paie\n\n#XTIT: Application
 name\nDISPLAY_NAME=+
Mes bulletins de paie\n\n#XTIT: Title for payslip list\nDISPLAY_NAME_LIST=Bulletins de paie ({0})\n\n#XTIT: Title for payslip details\nDISPLAY_NAME_DETAILS=Bulletin de paie\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=Ouvrir en tant que PDF\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=Versement de la prime\n\n#XFLD: Reason for Offcycle Payment\nOFFCYCLE_REASON=Motif du paiement hors-cycle\n\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=Paie de correction\n\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=Ch\\u00E8que manuel\n\n#XFLD: Payment type\nPAYSLIP_REGULAR=Paie normale\n\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=Paiement compl\\u00E9mentaire\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=Aucune donn\\u00E9e disponible\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=Salaire net en\n\n#XFLD: Employee ID\nEMPLOYEE_ID=ID du salari\\u00E9\n\n#XFLD: Employee Position\nEMPLOYEE_POSITION=Position\n\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=D\\u00E9ductions\n\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=Salaire brut\n\n#XFLD: Payslip payroll Period\nPAYROLL_PERIOD=P\\u00E9riode de paie\n\n#XFLD: Payslip pay date\nPAY_DATE=Date du paiement\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=S\\u00E9lection maximale\n\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE=Ne s\\u00E9lectionnez pas plus de {0} bulletins de paie.\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=Impossible d\'acc\\u00E9der \\u00E0 la liste des bulletins de paie\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=Impossible d\'acc\\u00E9der au PDF du bulletin de paie\n\n#XTIT: Title for new PFD window {0}:End date of paystub\nPDF_WINDOW_TITLE=Bulletin de paie_{0}\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=Vous devez installer un programme de lecture de documents PDF pour afficher les bulletins de paie.\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=Chargement...\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=S\\u00E9lectionner un contrat de travail\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Contrats de travail\n\n#XBUT: Button to cancel\nCANCEL=Interrompre\n\n#XBUT: Button for confirm\nOK=OK\n\n#YMSG: Message shown on empty detail page if no payslips are available\nNO_PAYSLIPS_AVAILABLE=Aucune fiche de paie \\u00E0 afficher\n',
  "hcm/mypaystubs/i18n/i18n_hr.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Platni listi\\u0107i ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Platni listi\\u0107\n\n#XTIT: Application
 name\nDISPLAY+
_NAME=Moji platni listi\\u0107i\n\n#XTIT: Title for payslip list\nDISPLAY_NAME_LIST=Platni listi\\u0107i ({0})\n\n#XTIT: Title for payslip details\nDISPLAY_NAME_DETAILS=Platni listi\\u0107\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=Otvori kao PDF\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=Isplata bonusa\n\n#XFLD: Reason for Offcycle Payment\nOFFCYCLE_REASON=Razlog izvanrednog pla\\u0107anja\n\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=Ra\\u010Dunovodstvo ispravka\n\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=Ru\\u010Dna provjera\n\n#XFLD: Payment type\nPAYSLIP_REGULAR=Redovno izvo\\u0111enje obra\\u010Duna pla\\u0107a\n\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=Doplata\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=Podaci nisu raspolo\\u017Eivi\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=Neto pla\\u0107a u\n\n#XFLD: Employee ID\nEMPLOYEE_ID=ID zaposlenika\n\n#XFLD: Employee Position\nEMPLOYEE_POSITION=Pozicija\n\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=Odbici\n\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=Bruto pla\\u0107a\n\n#XFLD: Payslip payroll Period\nPAYROLL_PERIOD=Razdoblje obra\\u010Duna pla\\u0107a\n\n#XFLD: Payslip pay date\nPAY_DATE=Datum pla\\u0107anja\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=Maksimalni odabir\n\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE=Ne mo\\u017Eete odabrati vi\\u0161e od {0} platnih listi\\u0107a\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=Nije bilo mogu\\u0107e dobiti listu platnih listi\\u0107a\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=Nije bilo mogu\\u0107e dobiti PDF platnog listi\\u0107a\n\n#XTIT: Title for new PFD window {0}:End date of paystub\nPDF_WINDOW_TITLE=Platni listi\\u0107_{0}\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=Morate instalirati PDF \\u010Dita\\u010D za prikaz platnih listi\\u0107a\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=U\\u010Ditavanje...\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Izaberite ugovor o radu\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Ugovori o radu\n\n#XBUT: Button to cancel\nCANCEL=Otka\\u017Ei\n\n#XBUT: Button for confirm\nOK=OK\n\n#YMSG: Message shown on empty detail page if no payslips are available\nNO_PAYSLIPS_AVAILABLE=Nema ispisa pla\\u0107e za prikaz.\n',
  "hcm/mypaystubs/i18n/i18n_hu.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=J\\u00F6vedelemigazol\\u00E1sok ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=J\\u00F6vedelemigazol\\u00E1s\n\n#XTIT:
 Appl+
ication name\nDISPLAY_NAME=Saj\\u00E1t j\\u00F6vedelemigazol\\u00E1sok\n\n#XTIT: Title for payslip list\nDISPLAY_NAME_LIST=J\\u00F6vedelemigazol\\u00E1sok ({0})\n\n#XTIT: Title for payslip details\nDISPLAY_NAME_DETAILS=J\\u00F6vedelemigazol\\u00E1s\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=Megnyit\\u00E1s PDF-k\\u00E9nt\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=B\\u00F3nuszfizet\\u00E9s\n\n#XFLD: Reason for Offcycle Payment\nOFFCYCLE_REASON=Peri\\u00F3duson k\\u00EDv\\u00FCli fizet\\u00E9si ok\n\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=Korrekt\\u00FAraelsz\\u00E1mol\\u00E1s\n\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=K\\u00E9zi ellen\\u0151rz\\u00E9s\n\n#XFLD: Payment type\nPAYSLIP_REGULAR=Rendes b\\u00E9rsz\\u00E1mfejt\\u00E9s\n\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=Kieg\\u00E9sz\\u00EDt\\u0151 kifizet\\u00E9s\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=Nem \\u00E1ll rendelkez\\u00E9sre adat\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=Nett\\u00F3 fizet\\u00E9s\n\n#XFLD: Employee ID\nEMPLOYEE_ID=Dolgoz\\u00F3azonos\\u00EDt\\u00F3\n\n#XFLD: Employee Position\nEMPLOYEE_POSITION=Poz\\u00EDci\\u00F3\n\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=Levon\\u00E1sok\n\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=Brutt\\u00F3 fizet\\u00E9s\n\n#XFLD: Payslip payroll Period\nPAYROLL_PERIOD=B\\u00E9rsz\\u00E1mfejt\\u00E9si peri\\u00F3dus\n\n#XFLD: Payslip pay date\nPAY_DATE=Fizet\\u00E9si d\\u00E1tum\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=Maxim\\u00E1lis kiv\\u00E1laszt\\u00E1s\n\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE=Nem v\\u00E1laszthat ki t\\u00F6bb mint {0} j\\u00F6vedelemigazol\\u00E1st\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=Nem siker\\u00FClt lek\\u00E9rni a j\\u00F6vedelemigazol\\u00E1sok list\\u00E1j\\u00E1t\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=Nem siker\\u00FClt lek\\u00E9rni a j\\u00F6vedelemigazol\\u00E1s PDF-et\n\n#XTIT: Title for new PFD window {0}:End date of paystub\nPDF_WINDOW_TITLE=J\\u00F6vedelemigazol\\u00E1s_{0}\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=A j\\u00F6vedelemigazol\\u00E1sok megtekint\\u00E9s\\u00E9hez telep\\u00EDtenie kell egy PDF-olvas\\u00F3t\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=Bet\\u00F6lt\\u00E9s...\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Foglalkoztat\\u00E1si szerz\\u0151d\\u00E9s v\\u00E1laszt\\u00E1sa\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Foglalkoztat\\u00E1si szerz\\u0151d\\u00E9sek\n\n#XBUT: Button to cancel\nCANCEL=M\\u00E9gse\n\n#XBUT: Button for confirm\nOK=OK\n\n#YMSG: Message shown on empty detail page if no payslips are available\nNO_PAYSLIPS_AVAILABLE=Nincsenek megjelen\\u00EDtend\\u0151 b\\u00E9rszelv\\u00E9nyek.\n',
  "hcm/mypaystubs/i18n/i18n_it.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Buste paga ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Busta paga\n\n#XTIT: Application name\nDISPLAY_NAME=Le mie
 buste +
paga\n\n#XTIT: Title for payslip list\nDISPLAY_NAME_LIST=Buste paga ({0})\n\n#XTIT: Title for payslip details\nDISPLAY_NAME_DETAILS=Busta paga\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=Apri come PDF\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=Pagamento bonus\n\n#XFLD: Reason for Offcycle Payment\nOFFCYCLE_REASON=Motivo di pagamento off-cycle\n\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=Contabilit\\u00E0 di rettifica\n\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=Controllo manuale\n\n#XFLD: Payment type\nPAYSLIP_REGULAR=Esecuzione regolare del calcolo della retribuzione\n\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=Pagamento integrativo\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=Nessun dato disponibile\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=Retribuzione netta in\n\n#XFLD: Employee ID\nEMPLOYEE_ID=ID dipendente\n\n#XFLD: Employee Position\nEMPLOYEE_POSITION=Posizione\n\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=Trattenute\n\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=Retribuzione lorda\n\n#XFLD: Payslip payroll Period\nPAYROLL_PERIOD=Periodo calc. retr.\n\n#XFLD: Payslip pay date\nPAY_DATE=Giorno di paga\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=Selezione massima\n\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE=Non \\u00E8 consentito selezionare pi\\u00F9 di {0} buste paga\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=Impossibile ottenere la lista di buste paga\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=Impossibile ottenere il PDF della busta paga\n\n#XTIT: Title for new PFD window {0}:End date of paystub\nPDF_WINDOW_TITLE=Busta paga_{0}\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=\\u00C8 necessario installare un lettore PDF per visualizzare le buste paga\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=In caricamento...\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Seleziona un contratto d\'impiego\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Contratti d\'impiego\n\n#XBUT: Button to cancel\nCANCEL=Annulla\n\n#XBUT: Button for confirm\nOK=OK\n\n#YMSG: Message shown on empty detail page if no payslips are available\nNO_PAYSLIPS_AVAILABLE=Nessuna busta paga da visualizzare.\n',
  "hcm/mypaystubs/i18n/i18n_iw.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=\\u05EA\\u05DC\\u05D5\\u05E9\\u05D9 \\u05E9\\u05DB\\u05E8 ({0})\n\n#XTIT: this is the title for the detail
 section\nDETAIL_TITLE=\\u05EA\\u05DC\\u0+
5D5\\u05E9 \\u05E9\\u05DB\\u05E8\n\n#XTIT: Application name\nDISPLAY_NAME=\\u05EA\\u05DC\\u05D5\\u05E9\\u05D9 \\u05D4\\u05E9\\u05DB\\u05E8 \\u05E9\\u05DC\\u05D9\n\n#XTIT: Title for payslip list\nDISPLAY_NAME_LIST=\\u05EA\\u05DC\\u05D5\\u05E9\\u05D9 \\u05E9\\u05DB\\u05E8 ({0})\n\n#XTIT: Title for payslip details\nDISPLAY_NAME_DETAILS=\\u05EA\\u05DC\\u05D5\\u05E9 \\u05E9\\u05DB\\u05E8\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=\\u05E4\\u05EA\\u05D7 \\u05DB-PDF\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=\\u05EA\\u05E9\\u05DC\\u05D5\\u05DD \\u05D1\\u05D5\\u05E0\\u05D5\\u05E1\n\n#XFLD: Reason for Offcycle Payment\nOFFCYCLE_REASON=\\u05E1\\u05D9\\u05D1\\u05D4 \\u05DC\\u05EA\\u05E9\\u05DC\\u05D5\\u05DD \\u05DE\\u05D7\\u05D5\\u05E5 \\u05DC\\u05DE\\u05D7\\u05D6\\u05D5\\u05E8\n\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=\\u05D7\\u05E9\\u05D1\\u05D5\\u05E0\\u05D0\\u05D5\\u05EA \\u05EA\\u05D9\\u05E7\\u05D5\\u05DF\n\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=\\u05D1\\u05D3\\u05D9\\u05E7\\u05D4 \\u05D9\\u05D3\\u05E0\\u05D9\\u05EA\n\n#XFLD: Payment type\nPAYSLIP_REGULAR=\\u05D4\\u05E4\\u05E2\\u05DC\\u05EA \\u05DE\\u05E9\\u05DB\\u05D5\\u05E8\\u05EA \\u05E8\\u05D2\\u05D9\\u05DC\\u05D4\n\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=\\u05EA\\u05E9\\u05DC\\u05D5\\u05DD \\u05E0\\u05D5\\u05E1\\u05E3\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=\\u05D0\\u05D9\\u05DF \\u05E0\\u05EA\\u05D5\\u05E0\\u05D9\\u05DD \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=\\u05E9\\u05DB\\u05E8 \\u05E0\\u05D8\\u05D5 \\u05D1-\n\n#XFLD: Employee ID\nEMPLOYEE_ID=\\u05D6\\u05D9\\u05D4\\u05D5\\u05D9 \\u05E2\\u05D5\\u05D1\\u05D3\n\n#XFLD: Employee Position\nEMPLOYEE_POSITION=\\u05DE\\u05D9\\u05E7\\u05D5\\u05DD\n\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=\\u05E0\\u05D9\\u05DB\\u05D5\\u05D9\\u05D9\\u05DD\n\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=\\u05E9\\u05DB\\u05E8 \\u05D1\\u05E8\\u05D5\\u05D8\\u05D5\n\n#XFLD: Payslip payroll Period\nPAYROLL_PERIOD=\\u05EA\\u05E7\\u05D5\\u05E4\\u05EA \\u05DE\\u05E9\\u05DB\\u05D5\\u05E8\\u05EA\n\n#XFLD: Payslip pay date\nPAY_DATE=\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05EA\\u05E9\\u05DC\\u05D5\\u05DD\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=\\u05D1\\u05D7\\u05D9\\u05E8\\u05D4 \\u05DE\\u05E7\\u05E1\\u05D9\\u05DE\\u05DC\\u05D9\\u05EA\n\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE=\\u05D0\\u05D9\\u05DF \\u05D1\\u05D0\\u05E4\\u05E9\\u05E8\\u05D5\\u05EA\\u05DA \\u05DC\\u05D1\\u05D7\\u05D5\\u05E8 \\u05D9\\u05D5\\u05EA\\u05E8 \\u05DE-{0} \\u05EA\\u05DC\\u05D5\\u05E9\\u05D9 \\u05E9\\u05DB\\u05E8\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=\\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05D4\\u05D9\\u05D4 \\u05DC\\u05D4\\u05E9\\u05D9\\u05D2 \\u05D0\\u05EA \\u05E8\\u05E9\\u05D9\\u05DE\\u05EA \\u05EA\\u05DC\\u05D5\\u05E9\\u05D9 \\u05D4\\u05E9\\u05DB\\u05E8\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=\\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05D4\\u05D9\\u05D4 \\u05DC\\u05D4\\u05E9\\u05D9\\u05D2 \\u05D0\\u05EA \\u05D4-PDF \\u05E9\\u05DC \\u05EA\\u05DC\\u05D5\\u05E9 \\u05D4\\u05E9\\u05DB\\u05E8\n\n#XTIT: Title for new PFD window {0}:End date of paystub\nPDF_WINDOW_TITLE=\\u05EA\\u05DC\\u05D5\\u05E9 \\u05E9\\u05DB\\u05E8_{0}\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=\\u05E2\\u05DC\\u05D9\\u05DA \\u05DC\\u05D4\\u05EA\\u05E7\\u05D9\\u05DF \\u05E7\\u05D5\\u05E8\\u05D0 PDF \\u05DB\\u05D3\\u05D9 \\u05DC\\u05D4\\u05E6\\u05D9\\u05D2 \\u05EA\\u05DC\\u05D5\\u05E9\\u05D9 \\u05E9\\u05DB\\u05E8\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=\\u05D8\\u05D5\\u05E2\\u05DF...\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=\\u05D1\\u05D7\\u05E8 \\u05D4\\u05E7\\u05E6\\u05D0\\u05EA \\u05E2\\u05D5\\u05D1\\u05D3\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=\\u05D4\\u05E7\\u05E6\\u05D0\\u05D5\\u05EA \\u05E2\\u05D5\\u05D1\\u05D3\\u05D9\\u05DD\n\n#XBUT: Button to cancel\nCANCEL=\\u05D1\\u05D8\\u05DC\n\n#XBUT: Button for confirm\nOK=OK\n\n#YMSG: Message shown on empty detail page if no payslips are available\nNO_PAYSLIPS_AVAILABLE=\\u05D0\\u05D9\\u05DF \\u05EA\\u05DC\\u05D5\\u05E9\\u05D9 \\u05DE\\u05E9\\u05DB\\u05D5\\u05E8\\u05EA \\u05DC\\u05D4\\u05E6\\u05D2\\u05D4.\n',
  "hcm/mypaystubs/i18n/i18n_ja.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=\\u7D66\\u4E0E\\u660E\\u7D30 ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=\\u7D66\\u4E0E\\u660E\\u7D30\n\n#XTIT:
 Applicat+
ion name\nDISPLAY_NAME=\\u7D66\\u4E0E\\u660E\\u7D30\n\n#XTIT: Title for payslip list\nDISPLAY_NAME_LIST=\\u7D66\\u4E0E\\u660E\\u7D30 ({0})\n\n#XTIT: Title for payslip details\nDISPLAY_NAME_DETAILS=\\u7D66\\u4E0E\\u660E\\u7D30\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=PDF \\u3067\\u958B\\u304F\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=\\u30DC\\u30FC\\u30CA\\u30B9\\u652F\\u7D66\n\n#XFLD: Reason for Offcycle Payment\nOFFCYCLE_REASON=\\u7279\\u5225\\u652F\\u7D66\\u7406\\u7531\n\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=\\u4FEE\\u6B63\\u8A08\\u7B97\n\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=\\u30DE\\u30CB\\u30E5\\u30A2\\u30EB\\u5C0F\\u5207\\u624B\n\n#XFLD: Payment type\nPAYSLIP_REGULAR=\\u6708\\u4F8B\\u7D66\\u4E0E\\u8A08\\u7B97\\u5B9F\\u884C\n\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=\\u4E00\\u6642\\u652F\\u7D66\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=\\u5229\\u7528\\u53EF\\u80FD\\u30C7\\u30FC\\u30BF\\u306A\\u3057\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=\\u30CD\\u30C3\\u30C8\\u652F\\u7D66\\u984D\n\n#XFLD: Employee ID\nEMPLOYEE_ID=\\u5F93\\u696D\\u54E1 ID\n\n#XFLD: Employee Position\nEMPLOYEE_POSITION=\\u30DD\\u30B8\\u30B7\\u30E7\\u30F3\n\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=\\u63A7\\u9664\n\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=\\u30B0\\u30ED\\u30B9\\u652F\\u7D66\\u984D\n\n#XFLD: Payslip payroll Period\nPAYROLL_PERIOD=\\u7D66\\u4E0E\\u8A08\\u7B97\\u671F\\u9593\n\n#XFLD: Payslip pay date\nPAY_DATE=\\u652F\\u6255\\u65E5\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=\\u6700\\u5927\\u9078\\u629E\n\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE=\\u9078\\u629E\\u3067\\u304D\\u308B\\u7D66\\u4E0E\\u660E\\u7D30\\u306F\\u6700\\u5927 {0} \\u4EF6\\u3067\\u3059\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=\\u7D66\\u4E0E\\u660E\\u7D30\\u306E\\u4E00\\u89A7\\u3092\\u53D6\\u5F97\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=\\u7D66\\u4E0E\\u660E\\u7D30 PDF \\u3092\\u53D6\\u5F97\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\n\n#XTIT: Title for new PFD window {0}:End date of paystub\nPDF_WINDOW_TITLE=\\u7D66\\u4E0E\\u660E\\u7D30_{0}\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=\\u7D66\\u4E0E\\u660E\\u7D30\\u3092\\u8868\\u793A\\u3059\\u308B\\u306B\\u306F PDF \\u30EA\\u30FC\\u30C0\\u3092\\u30A4\\u30F3\\u30B9\\u30C8\\u30FC\\u30EB\\u3059\\u308B\\u5FC5\\u8981\\u304C\\u3042\\u308A\\u307E\\u3059\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=\\u30ED\\u30FC\\u30C9\\u4E2D...\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=\\u5F93\\u696D\\u54E1\\u5272\\u5F53\\u306E\\u9078\\u629E\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=\\u5F93\\u696D\\u54E1\\u5272\\u5F53\n\n#XBUT: Button to cancel\nCANCEL=\\u4E2D\\u6B62\n\n#XBUT: Button for confirm\nOK=OK\n\n#YMSG: Message shown on empty detail page if no payslips are available\nNO_PAYSLIPS_AVAILABLE=\\u8868\\u793A\\u3059\\u308B\\u7D66\\u4E0E\\u660E\\u7D30\\u304C\\u3042\\u308A\\u307E\\u305B\\u3093\\u3002\n',
  "hcm/mypaystubs/i18n/i18n_no.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=L\\u00F8nnsslipper ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=L\\u00F8nnsslipp\n\n#XTIT: Application
 name\nDISPLAY_NAME+
=Mine l\\u00F8nnsslipper\n\n#XTIT: Title for payslip list\nDISPLAY_NAME_LIST=L\\u00F8nnsslipper ({0})\n\n#XTIT: Title for payslip details\nDISPLAY_NAME_DETAILS=L\\u00F8nnsslipp\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=\\u00C5pne som PDF\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=Bonusutbetaling\n\n#XFLD: Reason for Offcycle Payment\nOFFCYCLE_REASON=\\u00C5rsak til ekstraordin\\u00E6r utbetaling\n\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=Korrigeringsavregning\n\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=Manuell kontroll\n\n#XFLD: Payment type\nPAYSLIP_REGULAR=Ordin\\u00E6r l\\u00F8nnsavregning\n\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=Tilleggsbetaling\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=Ingen tilgjengelige data\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=Nettol\\u00F8nn i\n\n#XFLD: Employee ID\nEMPLOYEE_ID=Medarbeider-ID\n\n#XFLD: Employee Position\nEMPLOYEE_POSITION=Stilling\n\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=Fradrag\n\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=Bruttol\\u00F8nn\n\n#XFLD: Payslip payroll Period\nPAYROLL_PERIOD=L\\u00F8nnsavregningsperiode\n\n#XFLD: Payslip pay date\nPAY_DATE=Betalingsdato\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=Maks. utvalg\n\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE=Du kan ikke velge mer enn {0} l\\u00F8nnsslipper\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=Kan ikke hente liste over l\\u00F8nnsslipper\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=Kan ikke hente l\\u00F8nnsslipp som PDF-fil\n\n#XTIT: Title for new PFD window {0}:End date of paystub\nPDF_WINDOW_TITLE=L\\u00F8nnsslipp_{0}\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=Du m\\u00E5 installere en PDF-leser for \\u00E5 vise l\\u00F8nnsslipper\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=Laster ...\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Velg en ansettelseskontrakt\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Ansettelseskontrakter\n\n#XBUT: Button to cancel\nCANCEL=Avbryt\n\n#XBUT: Button for confirm\nOK=OK\n\n#YMSG: Message shown on empty detail page if no payslips are available\nNO_PAYSLIPS_AVAILABLE=Det er ingen l\\u00F8nningsslipper som kan vises\n',
  "hcm/mypaystubs/i18n/i18n_pl.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Zestawienia wynagrodzenia ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Zestawienie wynagrodzenia\n\n#XTIT: Application
 na+
me\nDISPLAY_NAME=Moje zestawienia wynagrodzenia\n\n#XTIT: Title for payslip list\nDISPLAY_NAME_LIST=Zestawienia wynagrodzenia ({0})\n\n#XTIT: Title for payslip details\nDISPLAY_NAME_DETAILS=Zestawienie wynagrodzenia\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=Otw\\u00F3rz jako PDF\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=P\\u0142atno\\u015B\\u0107 dodatkowa\n\n#XFLD: Reason for Offcycle Payment\nOFFCYCLE_REASON=Przyczyna p\\u0142atno\\u015Bci z dodatkowej listy p\\u0142ac\n\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=Rozliczenie korekty\n\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=R\\u0119czny czek\n\n#XFLD: Payment type\nPAYSLIP_REGULAR=Regularny przebieg rozliczania listy p\\u0142ac\n\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=Dodatkowa p\\u0142atno\\u015B\\u0107\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=Brak danych\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=Wynagrodzenie netto w\n\n#XFLD: Employee ID\nEMPLOYEE_ID=ID pracownika\n\n#XFLD: Employee Position\nEMPLOYEE_POSITION=Pozycja\n\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=Potr\\u0105cenia\n\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=Wynagrodzenie brutto\n\n#XFLD: Payslip payroll Period\nPAYROLL_PERIOD=Okres rozliczenia\n\n#XFLD: Payslip pay date\nPAY_DATE=Data wyp\\u0142aty\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=Maksymalny wyb\\u00F3r\n\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE=Nie mo\\u017Cesz wybra\\u0107 wi\\u0119cej ni\\u017C {0} zest. wynagrodzenia\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=Nie mo\\u017Cna by\\u0142o uzyska\\u0107 listy zestawie\\u0144 wynagrodze\\u0144\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=Nie mo\\u017Cna by\\u0142o uzyska\\u0107 pliku PDF zestawienia wynagrodzenia\n\n#XTIT: Title for new PFD window {0}:End date of paystub\nPDF_WINDOW_TITLE=Zestawienie wynagrodzenia_{0}\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=Aby przegl\\u0105da\\u0107 zestawienia wynagrodze\\u0144, musisz zainstalowa\\u0107 aplikacj\\u0119 PDF reader\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=Wczytywanie...\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Wybierz umow\\u0119 o prac\\u0119\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Umowy o prac\\u0119\n\n#XBUT: Button to cancel\nCANCEL=Anuluj\n\n#XBUT: Button for confirm\nOK=OK\n\n#YMSG: Message shown on empty detail page if no payslips are available\nNO_PAYSLIPS_AVAILABLE=Brak pask\\u00F3w p\\u0142acowych do wy\\u015Bwietlenia.\n',
  "hcm/mypaystubs/i18n/i18n_pt.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Comprovantes de remunera\\u00E7\\u00E3o ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Comprovante de
 remunera\\u00E7\\u00E+
3o\n\n#XTIT: Application name\nDISPLAY_NAME=Meus comprovantes de remunera\\u00E7\\u00E3o\n\n#XTIT: Title for payslip list\nDISPLAY_NAME_LIST=Comprovantes de remunera\\u00E7\\u00E3o ({0})\n\n#XTIT: Title for payslip details\nDISPLAY_NAME_DETAILS=Comprovante de remunera\\u00E7\\u00E3o\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=Abrir como PDF\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=Pagamento de b\\u00F4nus\n\n#XFLD: Reason for Offcycle Payment\nOFFCYCLE_REASON=Motivo do pgamento off-cycle\n\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=Liquida\\u00E7\\u00E3o da corre\\u00E7\\u00E3o\n\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=Cheque\n\n#XFLD: Payment type\nPAYSLIP_REGULAR=C\\u00E1lculo regular da folha de pagamento\n\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=Pagamento adicional\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=Dados n\\u00E3o dispon\\u00EDveis\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=Sal\\u00E1rio l\\u00EDquido\n\n#XFLD: Employee ID\nEMPLOYEE_ID=ID do funcion\\u00E1rio\n\n#XFLD: Employee Position\nEMPLOYEE_POSITION=Posi\\u00E7\\u00E3o\n\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=Dedu\\u00E7\\u00F5es\n\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=Pagamento bruto\n\n#XFLD: Payslip payroll Period\nPAYROLL_PERIOD=Per\\u00EDodo processado na folha de pagamento\n\n#XFLD: Payslip pay date\nPAY_DATE=Data de pagamento\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=Sele\\u00E7\\u00E3o m\\u00E1xima\n\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE=Voc\\u00EA n\\u00E3o pode selecionar mais de {0} comprovantes de remunera\\u00E7\\u00E3o\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=N\\u00E3o foi poss\\u00EDvel obter lista de comprovantes de remunera\\u00E7\\u00E3o\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=N\\u00E3o foi poss\\u00EDvel obter o PDF do comprovante de remunera\\u00E7\\u00E3o\n\n#XTIT: Title for new PFD window {0}:End date of paystub\nPDF_WINDOW_TITLE=Comprovante de remunera\\u00E7\\u00E3o_{0}\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=Voc\\u00EA deve instalar um leitor de PDF para exibir comprovantes de remunera\\u00E7\\u00E3o\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=Carregando...\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Selecionar um contrato de emprego\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Contratos de emprego\n\n#XBUT: Button to cancel\nCANCEL=Anular\n\n#XBUT: Button for confirm\nOK=OK\n\n#YMSG: Message shown on empty detail page if no payslips are available\nNO_PAYSLIPS_AVAILABLE=N\\u00E3o existem comprovantes de remunera\\u00E7\\u00E3o a exibir.\n',
  "hcm/mypaystubs/i18n/i18n_ro.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Justificative de remunera\\u0163ie ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Justificativ
 remunera\\u0163ie\n\n#XTIT: +
Application name\nDISPLAY_NAME=Justificativele mele de remunera\\u0163ie\n\n#XTIT: Title for payslip list\nDISPLAY_NAME_LIST=Justificative de remunera\\u0163ie ({0})\n\n#XTIT: Title for payslip details\nDISPLAY_NAME_DETAILS=Justificativ remunera\\u0163ie\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=Deschidere ca PDF\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=Plat\\u0103 prim\\u0103\n\n#XFLD: Reason for Offcycle Payment\nOFFCYCLE_REASON=Motiv plat\\u0103 \\u00EEn afara ciclului\n\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=Contabilitate corec\\u0163ie\n\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=Verificare manual\\u0103\n\n#XFLD: Payment type\nPAYSLIP_REGULAR=Execu\\u0163ie calcul salarial regulat\n\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=Plat\\u0103 suplimentar\\u0103\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=F\\u0103r\\u0103 date disponibile\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=Remunera\\u0163ie net\\u0103\n\n#XFLD: Employee ID\nEMPLOYEE_ID=ID angajat\n\n#XFLD: Employee Position\nEMPLOYEE_POSITION=Pozi\\u0163ie\n\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=Deduceri\n\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=Remunera\\u0163ie brut\\u0103\n\n#XFLD: Payslip payroll Period\nPAYROLL_PERIOD=Perioad\\u0103 calcul salarial\n\n#XFLD: Payslip pay date\nPAY_DATE=Dat\\u0103 salariu\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=Selec\\u0163ie maxim\\u0103\n\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE=Nu pute\\u0163i selecta mai mult de {0} justificative de remunera\\u0163ie\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=Imposibil de ob\\u0163inut lista de justificative de remunera\\u0163ie\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=Imposibil de ob\\u0163inut PDF justificativ de remunera\\u0163ie\n\n#XTIT: Title for new PFD window {0}:End date of paystub\nPDF_WINDOW_TITLE=Justificativ_remunera\\u0163ie_{0}\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=Trebuie s\\u0103 instala\\u0163i un cititor PDF pt.a afi\\u015Fa justificative remunera\\u0163ie\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=\\u00CEnc\\u0103rcare ...\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Alege\\u0163i un contract de munc\\u0103\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Contracte de munc\\u0103\n\n#XBUT: Button to cancel\nCANCEL=Anulare\n\n#XBUT: Button for confirm\nOK=OK\n\n#YMSG: Message shown on empty detail page if no payslips are available\nNO_PAYSLIPS_AVAILABLE=Nu exist\\u0103 justificative de remunera\\u0163ie de afi\\u015Fat.\n',
  "hcm/mypaystubs/i18n/i18n_ru.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=\\u0412\\u0435\\u0434\\u043E\\u043C\\u043E\\u0441\\u0442\\u0438 ({0})\n\n#XTIT: this is the title for the detail
 section\nDETAIL_TITLE=\\u0412\\u04+
35\\u0434\\u043E\\u043C\\u043E\\u0441\\u0442\\u044C\n\n#XTIT: Application name\nDISPLAY_NAME=\\u041C\\u043E\\u0438 \\u0432\\u0435\\u0434\\u043E\\u043C\\u043E\\u0441\\u0442\\u0438\n\n#XTIT: Title for payslip list\nDISPLAY_NAME_LIST=\\u0412\\u0435\\u0434\\u043E\\u043C\\u043E\\u0441\\u0442\\u0438 ({0})\n\n#XTIT: Title for payslip details\nDISPLAY_NAME_DETAILS=\\u0412\\u0435\\u0434\\u043E\\u043C\\u043E\\u0441\\u0442\\u044C\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=\\u041E\\u0442\\u043A\\u0440\\u044B\\u0442\\u044C \\u043A\\u0430\\u043A PDF\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=\\u0411\\u043E\\u043D\\u0443\\u0441\n\n#XFLD: Reason for Offcycle Payment\nOFFCYCLE_REASON=\\u041F\\u0440\\u0438\\u0447\\u0438\\u043D\\u0430 \\u0432\\u043D\\u0435\\u0446\\u0438\\u043A\\u043B\\u0438\\u0447\\u0435\\u0441\\u043A\\u043E\\u0439 \\u0432\\u044B\\u043F\\u043B\\u0430\\u0442\\u044B\n\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=\\u041A\\u043E\\u0440\\u0440\\u0435\\u043A\\u0442\\u0438\\u0440\\u043E\\u0432\\u043E\\u0447\\u043D\\u044B\\u0439 \\u0440\\u0430\\u0441\\u0447\\u0435\\u0442\n\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=\\u0420\\u0443\\u0447\\u043D\\u0430\\u044F \\u043F\\u0440\\u043E\\u0432\\u0435\\u0440\\u043A\\u0430\n\n#XFLD: Payment type\nPAYSLIP_REGULAR=\\u0420\\u0435\\u0433\\u0443\\u043B\\u044F\\u0440\\u043D\\u044B\\u0439 \\u0440\\u0430\\u0441\\u0447\\u0435\\u0442\n\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=\\u0414\\u043E\\u043F\\u043E\\u043B\\u043D\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u0430\\u044F \\u0432\\u044B\\u043F\\u043B\\u0430\\u0442\\u0430\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=\\u041D\\u0435\\u0442 \\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\\u0445 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0445\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=\\u041E\\u043F\\u043B\\u0430\\u0442\\u0430 \\u043D\\u0435\\u0442\\u0442\\u043E \\u0432\n\n#XFLD: Employee ID\nEMPLOYEE_ID=\\u0418\\u0434. \\u0441\\u043E\\u0442\\u0440\\u0443\\u0434\\u043D\\u0438\\u043A\\u0430\n\n#XFLD: Employee Position\nEMPLOYEE_POSITION=\\u0428\\u0442\\u0430\\u0442\\u043D\\u0430\\u044F \\u0434\\u043E\\u043B\\u0436\\u043D\\u043E\\u0441\\u0442\\u044C\n\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=\\u0412\\u044B\\u0447\\u0435\\u0442\\u044B\n\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=\\u041F\\u043B\\u0430\\u0442\\u0435\\u0436 \\u0431\\u0440\\u0443\\u0442\\u0442\\u043E\n\n#XFLD: Payslip payroll Period\nPAYROLL_PERIOD=\\u0420\\u0430\\u0441\\u0447\\u0435\\u0442\\u043D\\u044B\\u0439 \\u043F\\u0435\\u0440\\u0438\\u043E\\u0434\n\n#XFLD: Payslip pay date\nPAY_DATE=\\u0414\\u0430\\u0442\\u0430 \\u0432\\u044B\\u043F\\u043B\\u0430\\u0442\\u044B\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=\\u041C\\u0430\\u043A\\u0441\\u0438\\u043C\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0432\\u044B\\u0431\\u043E\\u0440\n\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE=\\u0412\\u044B\\u0431\\u043E\\u0440 \\u0431\\u043E\\u043B\\u0435\\u0435 {0} \\u0432\\u0435\\u0434\\u043E\\u043C\\u043E\\u0441\\u0442\\u0435\\u0439 \\u043D\\u0435\\u0434\\u043E\\u043F\\u0443\\u0441\\u0442\\u0438\\u043C\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u043F\\u043E\\u043B\\u0443\\u0447\\u0438\\u0442\\u044C \\u0441\\u043F\\u0438\\u0441\\u043E\\u043A \\u0432\\u0435\\u0434\\u043E\\u043C\\u043E\\u0441\\u0442\\u0435\\u0439\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u043F\\u043E\\u043B\\u0443\\u0447\\u0438\\u0442\\u044C \\u0432\\u0435\\u0434\\u043E\\u043C\\u043E\\u0441\\u0442\\u044C \\u0432 PDF\n\n#XTIT: Title for new PFD window {0}:End date of paystub\nPDF_WINDOW_TITLE=Paystub_{0}\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=\\u0414\\u043B\\u044F \\u043F\\u0440\\u043E\\u0441\\u043C\\u043E\\u0442\\u0440\\u0430 \\u0432\\u0435\\u0434\\u043E\\u043C\\u043E\\u0441\\u0442\\u0435\\u0439 \\u043D\\u0435\\u043E\\u0431\\u0445\\u043E\\u0434\\u0438\\u043C\\u043E \\u0443\\u0441\\u0442\\u0430\\u043D\\u043E\\u0432\\u0438\\u0442\\u044C \\u043F\\u0440\\u043E\\u0433\\u0440\\u0430\\u043C\\u043C\\u0443 \\u0434\\u043B\\u044F \\u0447\\u0442\\u0435\\u043D\\u0438\\u044F PDF\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=\\u0417\\u0430\\u0433\\u0440\\u0443\\u0437\\u043A\\u0430...\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=\\u0412\\u044B\\u0431\\u0440\\u0430\\u0442\\u044C \\u0442\\u0440\\u0443\\u0434\\u043E\\u0432\\u043E\\u0439 \\u0434\\u043E\\u0433\\u043E\\u0432\\u043E\\u0440\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=\\u0422\\u0440\\u0443\\u0434\\u043E\\u0432\\u044B\\u0435 \\u0434\\u043E\\u0433\\u043E\\u0432\\u043E\\u0440\\u044B\n\n#XBUT: Button to cancel\nCANCEL=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\n\n#XBUT: Button for confirm\nOK=\\u041E\\u041A\n\n#YMSG: Message shown on empty detail page if no payslips are available\nNO_PAYSLIPS_AVAILABLE=\\u041D\\u0435\\u0442 \\u0440\\u0430\\u0441\\u0447\\u0435\\u0442\\u043D\\u044B\\u0445 \\u043B\\u0438\\u0441\\u0442\\u043A\\u043E\\u0432 \\u0434\\u043B\\u044F \\u043F\\u0440\\u043E\\u0441\\u043C\\u043E\\u0442\\u0440\\u0430\n',
  "hcm/mypaystubs/i18n/i18n_sh.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Obra\\u010Dunski listovi ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Obra\\u010Dunski list\n\n#XTIT: Application
 name\nD+
ISPLAY_NAME=Moji obra\\u010Dunski listovi\n\n#XTIT: Title for payslip list\nDISPLAY_NAME_LIST=Obra\\u010Dunski listovi ({0})\n\n#XTIT: Title for payslip details\nDISPLAY_NAME_DETAILS=Obra\\u010Dunski list\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=Otvori kao PDF\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=Isplata bonusa\n\n#XFLD: Reason for Offcycle Payment\nOFFCYCLE_REASON=Razlog vanrednog pla\\u0107anja\n\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=Ra\\u010Dunovodstvo ispravke\n\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=Ru\\u010Dna provera\n\n#XFLD: Payment type\nPAYSLIP_REGULAR=Redovno izvo\\u0111enje obra\\u010Duna plata\n\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=Dodatno pla\\u0107anje\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=Podaci nisu dostupni\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=Neto plata u\n\n#XFLD: Employee ID\nEMPLOYEE_ID=ID zaposlenog\n\n#XFLD: Employee Position\nEMPLOYEE_POSITION=Radno mesto\n\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=Odbici\n\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=Bruto plata\n\n#XFLD: Payslip payroll Period\nPAYROLL_PERIOD=Period obra\\u010Duna plata\n\n#XFLD: Payslip pay date\nPAY_DATE=Datum plate\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=Maksimalni odabir\n\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE=Ne mo\\u017Eete odabrati vi\\u0161e od {0} obra\\u010Dunskih listova\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=Nije mogu\\u0107e pozvati listu obra\\u010Dunskih listova\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=Nije mogu\\u0107e pozvati PDF obra\\u010Dunskog lista\n\n#XTIT: Title for new PFD window {0}:End date of paystub\nPDF_WINDOW_TITLE=Obra\\u010Dunski listov_{0}\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=Za prikaz obra\\u010Dunskih listova potrebno je da instalirate PDF \\u010Dita\\u010D\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=U\\u010Ditavanje...\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Izaberite ugovor o radu\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Ugovori o radu\n\n#XBUT: Button to cancel\nCANCEL=Odustani\n\n#XBUT: Button for confirm\nOK=OK\n\n#YMSG: Message shown on empty detail page if no payslips are available\nNO_PAYSLIPS_AVAILABLE=Nema platnih listi\\u0107a za prikaz.\n',
  "hcm/mypaystubs/i18n/i18n_sk.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Doklady o odmene ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Doklad o odmene\n\n#XTIT: Application
 name\nDISPLAY_NAME=Mo+
je doklady o odmene\n\n#XTIT: Title for payslip list\nDISPLAY_NAME_LIST=Doklady o odmene ({0})\n\n#XTIT: Title for payslip details\nDISPLAY_NAME_DETAILS=Doklad o odmene\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=Otvori\\u0165 ako PDF\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=Bonusov\\u00E1 platba\n\n#XFLD: Reason for Offcycle Payment\nOFFCYCLE_REASON=D\\u00F4vod platby off-cycle\n\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=Opravn\\u00E9 \\u00FA\\u010Dtovanie\n\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=Manu\\u00E1lny \\u0161ek\n\n#XFLD: Payment type\nPAYSLIP_REGULAR=Pravideln\\u00FD chod z\\u00FA\\u010Dtovania miezd a platov\n\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=Doplnkov\\u00E1 platba\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=D\\u00E1ta nie s\\u00FA k dispoz\\u00EDcii\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=Odmena netto v\n\n#XFLD: Employee ID\nEMPLOYEE_ID=ID zamestnanca\n\n#XFLD: Employee Position\nEMPLOYEE_POSITION=Poz\\u00EDcia\n\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=Zr\\u00E1\\u017Eky\n\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=Odmena brutto\n\n#XFLD: Payslip payroll Period\nPAYROLL_PERIOD=Obdobie z\\u00FA\\u010Dtovania\n\n#XFLD: Payslip pay date\nPAY_DATE=D\\u00E1tum platby\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=Maxim\\u00E1lny v\\u00FDber\n\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE=Nem\\u00F4\\u017Eete vybra\\u0165 viac ako {0} dokladov o odmene\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=Nebolo mo\\u017En\\u00E9 z\\u00EDska\\u0165 zoznam dokladov o odmene\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=Nebolo mo\\u017En\\u00E9 z\\u00EDska\\u0165 PDF dokladu o odmene\n\n#XTIT: Title for new PFD window {0}:End date of paystub\nPDF_WINDOW_TITLE=Doklad o odmene_{0}\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=Ak chcete zobrazi\\u0165 doklady o odmene, mus\\u00EDte nain\\u0161talova\\u0165 program na \\u010D\\u00EDtanie PDF\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=Na\\u010D\\u00EDtava sa...\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Vyberte pracovn\\u00FA zmluvu\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Pracovn\\u00E9 zmluvy\n\n#XBUT: Button to cancel\nCANCEL=Zru\\u0161i\\u0165\n\n#XBUT: Button for confirm\nOK=OK\n\n#YMSG: Message shown on empty detail page if no payslips are available\nNO_PAYSLIPS_AVAILABLE=Neexistuj\\u00FA doklady o odmene na zobrazenie.\n',
  "hcm/mypaystubs/i18n/i18n_sl.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=Pla\\u010Dilne liste ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Pla\\u010Dilni list\n\n#XTIT: Application
 name\nDISPLAY+
_NAME=Moji pla\\u010Dilni listi\n\n#XTIT: Title for payslip list\nDISPLAY_NAME_LIST=Pla\\u010Dilne liste ({0})\n\n#XTIT: Title for payslip details\nDISPLAY_NAME_DETAILS=Pla\\u010Dilni list\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=Odpri kot PDF\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=Pla\\u010Dilo dodatka\n\n#XFLD: Reason for Offcycle Payment\nOFFCYCLE_REASON=Razlog za Off-Cycle pla\\u010Dilo\n\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=Ra\\u010Dunovodstvo popravkov\n\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=Ro\\u010Dna kontrola\n\n#XFLD: Payment type\nPAYSLIP_REGULAR=Redni obra\\u010Dun\n\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=Dodatno pla\\u010Dilo\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=Podatki niso na voljo\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=Neto prejemki v\n\n#XFLD: Employee ID\nEMPLOYEE_ID=ID zaposlenega\n\n#XFLD: Employee Position\nEMPLOYEE_POSITION=Polo\\u017Eaj\n\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=Odbitki\n\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=Bruto prejemki\n\n#XFLD: Payslip payroll Period\nPAYROLL_PERIOD=Obra\\u010Dunsko obdobje\n\n#XFLD: Payslip pay date\nPAY_DATE=Datum pla\\u010Dila\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=Maksimalna izbira\n\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE=Ne smete izbrati ve\\u010D kot {0} pla\\u010Dilnih list\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=Ni bilo mogo\\u010De pridobiti seznama pla\\u010Dilnih listov\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=Ni bilo mogo\\u010De pridobiti PDF-ja pla\\u010Dilnih listov\n\n#XTIT: Title for new PFD window {0}:End date of paystub\nPDF_WINDOW_TITLE=Pla\\u010Dilna lista {0}\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=Namestiti morate bralnik PDF za ogled pla\\u010Dilnih listov\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=Nalaganje ...\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Izberite pogodbo o delu\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Pogodbe o delu\n\n#XBUT: Button to cancel\nCANCEL=Prekinitev\n\n#XBUT: Button for confirm\nOK=OK\n\n#YMSG: Message shown on empty detail page if no payslips are available\nNO_PAYSLIPS_AVAILABLE=Ni pla\\u010Dilnih listov za prikaz.\n',
  "hcm/mypaystubs/i18n/i18n_tr.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=\\u00DCcret pusulalar\\u0131 ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=\\u00DCcret pusulas\\u0131\n\n#XTIT:
 Applicatio+
n name\nDISPLAY_NAME=\\u00DCcret pusulalar\\u0131m\n\n#XTIT: Title for payslip list\nDISPLAY_NAME_LIST=\\u00DCcret pusulalar\\u0131 ({0})\n\n#XTIT: Title for payslip details\nDISPLAY_NAME_DETAILS=\\u00DCcret pusulas\\u0131\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=PDF olarak a\\u00E7\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=Prim \\u00F6demesi\n\n#XFLD: Reason for Offcycle Payment\nOFFCYCLE_REASON=\\u0130stisnai \\u00F6deme nedeni\n\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=D\\u00FCzeltme muhasebesi\n\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=Man\\u00FCel kontrol\n\n#XFLD: Payment type\nPAYSLIP_REGULAR=D\\u00FCzenli bordro \\u00E7al\\u0131\\u015Ft\\u0131rmas\\u0131\n\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=Ek \\u00F6deme\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=Veri mevcut de\\u011Fil\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=Net maa\\u015F\\:\n\n#XFLD: Employee ID\nEMPLOYEE_ID=\\u00C7al\\u0131\\u015Fan tan\\u0131t\\u0131c\\u0131s\\u0131\n\n#XFLD: Employee Position\nEMPLOYEE_POSITION=Pozisyon\n\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=Kesintiler\n\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=Br\\u00FCt \\u00F6deme\n\n#XFLD: Payslip payroll Period\nPAYROLL_PERIOD=Bordro d\\u00F6nemi\n\n#XFLD: Payslip pay date\nPAY_DATE=\\u00D6deme tarihi\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=Azami se\\u00E7im\n\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE={0} \\u00FCcret pusulas\\u0131ndan fazlas\\u0131n\\u0131 se\\u00E7emezsiniz\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=\\u00DCcret pusulalar\\u0131 listesi al\\u0131namad\\u0131\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=\\u00DCcret pusulus\\u0131 PDF\'i al\\u0131namad\\u0131\n\n#XTIT: Title for new PFD window {0}:End date of paystub\nPDF_WINDOW_TITLE=\\u00DCcret pusulas\\u0131_{0}\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=\\u00DCcret pusulalar\\u0131n\\u0131 g\\u00F6r\\u00FCnt\\u00FClemek i\\u00E7in PDF Reader kurman\\u0131z gerekli\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=Y\\u00FCkleniyor...\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Personel tayini se\\u00E7\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Personel tayinleri\n\n#XBUT: Button to cancel\nCANCEL=\\u0130ptal et\n\n#XBUT: Button for confirm\nOK=Tamam\n\n#YMSG: Message shown on empty detail page if no payslips are available\nNO_PAYSLIPS_AVAILABLE=G\\u00F6r\\u00FCnt\\u00FClenecek \\u00FCcret pusulas\\u0131 yok.\n',
  "hcm/mypaystubs/i18n/i18n_zh_CN.properties":'\n#XTIT: this is the title for the master section\nMASTER_TITLE=\\u5DE5\\u8D44\\u5355 ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=\\u5DE5\\u8D44\\u5355\n\n#XTIT: Application
 name\nD+
ISPLAY_NAME=\\u6211\\u7684\\u5DE5\\u8D44\\u5355\n\n#XTIT: Title for payslip list\nDISPLAY_NAME_LIST=\\u5DE5\\u8D44\\u5355 ({0})\n\n#XTIT: Title for payslip details\nDISPLAY_NAME_DETAILS=\\u5DE5\\u8D44\\u5355\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=\\u4EE5 PDF \\u683C\\u5F0F\\u6253\\u5F00\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=\\u5956\\u91D1\\u652F\\u4ED8\n\n#XFLD: Reason for Offcycle Payment\nOFFCYCLE_REASON=\\u975E\\u5468\\u671F\\u4ED8\\u6B3E\\u7684\\u539F\\u56E0\n\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=\\u4FEE\\u6B63\\u4F1A\\u8BA1\\u6838\\u7B97\n\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=\\u624B\\u5199\\u652F\\u7968\n\n#XFLD: Payment type\nPAYSLIP_REGULAR=\\u5E38\\u89C4\\u5DE5\\u8D44\\u6838\\u7B97\\u8FD0\\u884C\n\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=\\u5176\\u4ED6\\u652F\\u4ED8\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=\\u6CA1\\u6709\\u53EF\\u7528\\u6570\\u636E\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=\\u5B9E\\u5F97\\u5DE5\\u8D44\n\n#XFLD: Employee ID\nEMPLOYEE_ID=\\u5458\\u5DE5\\u6807\\u8BC6\n\n#XFLD: Employee Position\nEMPLOYEE_POSITION=\\u804C\\u4F4D\n\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=\\u6263\\u51CF\n\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=\\u603B\\u5DE5\\u8D44\n\n#XFLD: Payslip payroll Period\nPAYROLL_PERIOD=\\u5DE5\\u8D44\\u6838\\u7B97\\u671F\\u95F4\n\n#XFLD: Payslip pay date\nPAY_DATE=\\u652F\\u4ED8\\u65E5\\u671F\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=\\u6700\\u5927\\u9009\\u62E9\n\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE=\\u6700\\u591A\\u53EA\\u80FD\\u9009\\u62E9 {0} \\u4E2A\\u5DE5\\u8D44\\u5355\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=\\u65E0\\u6CD5\\u83B7\\u53D6\\u5DE5\\u8D44\\u5355\\u5217\\u8868\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=\\u65E0\\u6CD5\\u83B7\\u53D6 PDF \\u683C\\u5F0F\\u7684\\u5DE5\\u8D44\\u5355\n\n#XTIT: Title for new PFD window {0}:End date of paystub\nPDF_WINDOW_TITLE=\\u5DE5\\u8D44\\u5355_{0}\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=\\u5FC5\\u987B\\u5B89\\u88C5 PDF \\u9605\\u8BFB\\u5668\\u624D\\u80FD\\u67E5\\u770B\\u5DE5\\u8D44\\u5355\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=\\u6B63\\u5728\\u52A0\\u8F7D...\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=\\u9009\\u62E9\\u4EBA\\u4E8B\\u5206\\u914D\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=\\u4EBA\\u4E8B\\u5206\\u914D\n\n#XBUT: Button to cancel\nCANCEL=\\u53D6\\u6D88\n\n#XBUT: Button for confirm\nOK=\\u786E\\u5B9A\n\n#YMSG: Message shown on empty detail page if no payslips are available\nNO_PAYSLIPS_AVAILABLE=\\u6CA1\\u6709\\u53EF\\u663E\\u793A\\u7684\\u5DE5\\u8D44\\u5355\\u3002\n',
  "hcm/mypaystubs/utils/ConcurrentEmployment.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mypaystubs.utils.ConcurrentEmployment");
jQuery.sap.require("hcm.mypaystubs.utils.DataManager");
/*global hcm:true */
hcm.mypaystubs.utils.ConcurrentEmployment = {
  getCEEnablement: function(self, successHandler) {
    this.initialize(self, successHandler);
    var oModel = new sap.ui.model.json.JSONModel();
    hcm.mypaystubs.utils.DataManager.getPersonellAssignments(self, function(data) {
      if (data.length > 1) {
        oModel.setData(data);
        self.oCEForm.setModel(oModel);
        self.oCEDialog.open();
      }
      else{
          self.oApplication.pernr = data[0].Pernr;
          successHandler();
      }
    });
  },
  initialize: function(self, successHandler) {
      this.setControllerInstance(self);
    var itemTemplate = new sap.m.RadioButton({
      text: "{AssignmentText}",
      customData: new sap.ui.core.CustomData({
        "key": "Pernr",
        "value": "{Pernr}"
      })
    });
    self.oCESelect = new sap.m.RadioButtonGroup().bindAggregation("buttons", "/", itemTemplate);
    self.oCEForm = new sap.ui.layout.form.Form({
//      maxContainerCols: 2,
//      class: "sapUiLargeMarginTopBottom",
      layout: new sap.ui.layout.form.ResponsiveGridLayout({
        labelSpanL: 12,
        // emptySpanL: 3,
        labelSpanM: 12,
        // emptySpanM: 2,
        labelSpanS: 12,
        columnsL: 2,
        columnsM: 2
      }),
      formContainers: new sap.ui.layout.form.FormContainer({
        formElements: [
                                       new sap.ui.layout.form.FormElement({
                                label: new sap.m.Label({
                                  text: self.oBundle.getText("PERSONAL_ASSIGN")
                                }),
                                fields: self.oCESelect
                              })
                               ]
      })
    });

    self.oCEDialog = new sap.m.Dialog({
      title:self.oBundle.getText("PERSONAL_ASSIGN_TITLE"),
//      class: "sapUiContentPadding sapUiLargeMarginTopBottom",
      content: self.oCEForm,
      buttons: [
          new sap.m.Button({
          text: self.oBundle.getText("OK"),
          press: function() {
            self.oCEDialog.close();
            self.oApplication.pernr = self.oCESelect.getSelectedButton().data().Pernr;
            successHandler();
          }
        }),
          new sap.m.Button({
          text: self.oBundle.getText("CANCEL"),
          press: function() {
            self.oCEDialog.close();
            self.oCEDialog.Cancelled = true;  
                        /* eslint-disable sap-browser-api-warning */          
                                window.history.go(-1);    
                        /* eslint-enable sap-browser-api-warning */        
              //}
          }
        })
      ]
    });
    self.oCEDialog.attachAfterClose(function(){
        if(!self.oApplication.pernr && self.oCEDialog.Cancelled !== true){
            self.oCEDialog.open();
        }
    });
  },

  setControllerInstance: function(me){
      this.me = me;    
  },

  getControllerInstance: function(){
      return this.me;  
  }
};
},
  "hcm/mypaystubs/utils/DataManager.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mypaystubs.utils.DataManager");
/*global hcm:true */
hcm.mypaystubs.utils.DataManager = (function() {
  var _modelBase = null;
  //var _resourceBundle = null;
  var _cachedModelObj = {};
  _cachedModelObj.exist = true;

  return {
    init: function(oDataModel, oresourceBundle) {
      _modelBase = oDataModel;
      //_resourceBundle = oresourceBundle;
    },

    getBaseODataModel: function() {
      return _modelBase;
    },

    setCachedModelObjProp: function(propName, propObj) {
      _cachedModelObj[propName] = propObj;
    },

    getCachedModelObjProp: function(propName) {
      return _cachedModelObj[propName];
    },

    getPersonellAssignments: function(appController, fSuccess) {
      var self = this;
      var oSuccessFn = function(oData) {
        fSuccess(oData.results);
      };
      var oErrorHandler = function(response) {
        self.parseErrorMessages(response);
      };

    // Start
      //_modelBase.read("/ConcurrentEmploymentSet", null, [], true, oSuccessFn, oErrorHandler);

      var url = window.location.hash;
      var appName = "RemunerationStatement";

      if(url.indexOf(appName) != "-1"){
        _modelBase.read("/ConcurrentEmploymentSet", null, [], true, oSuccessFn, oErrorHandler);
      }
      else{
        _modelBase.read("/ZConcurrentEmploymentSet", null, [], true, oSuccessFn, oErrorHandler);
      }
    // End

    },
    getPaystubs: function(appController, fSuccess) {
      var self = this;
      var oUrlParams = [];
      var oPernr = appController.oApplication.pernr;
            oUrlParams.push("$filter=PersonnelAssignment eq '" + oPernr + "'");
      var oSuccessFn = function(oData) {
        fSuccess(oData.results);
      };
      var oErrorHandler = function(response) {
        self.errorDialog(self.parseErrorMessages(response));
      };
      _modelBase.read("/Paystubs", null, oUrlParams, true, oSuccessFn, oErrorHandler);
    },
    parseErrorMessages: function(objResponse) {
      if (objResponse.response && objResponse.response.body) {
        var dynamicSort = function(property) {
          var sortOrder = 1;
          if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
          }
          return function(a, b) {
            var result;
            if (a[property] < b[property]) {
              result = -1;
            } else if (a[property] > b[property]) {
              result = 1;
            } else {
              result = 0;
            }
            return result * sortOrder;
          };
        };
        try {
          var oResponse = JSON.parse(objResponse.response.body);
          if (oResponse.error && oResponse.error.message && oResponse.error.message.value) {
            var result = [];
            result.push(oResponse.error.message.value);
            if (oResponse.error.innererror && oResponse.error.innererror.errordetails && oResponse.error.innererror.errordetails instanceof Array) {
              oResponse.error.innererror.errordetails.sort(dynamicSort("severity"));
              for (var i = 0; i < oResponse.error.innererror.errordetails.length; i++) {
                if (oResponse.error.innererror.errordetails[i].message) {
                  var message = oResponse.error.innererror.errordetails[i].message;
                  /*if (oResponse.error.innererror.errordetails[i].code) {
                    message += " [" + oResponse.error.innererror.errordetails[i].code + "]";
                  }*/
                  if (oResponse.error.innererror.errordetails[i].severity) {
                    message += " (" + oResponse.error.innererror.errordetails[i].severity + ")";
                  }
                  result.push(message);
                }
              }
            }
            return result;
          }
        } catch (e) {
          jQuery.sap.log.warning("couldn't parse error message", ["parseErrorMessages"], ["DataManger"]);
        }
      }
    },
    errorDialog : function(messages) {

      var _errorTxt = "";
      var _firstMsgTxtLine = "";
      var _detailmsg = "";
      var oSettings = "";

      if (typeof messages === "string") {
        oSettings = {
          message : messages,
          type : sap.ca.ui.message.Type.ERROR
        };
      } else if (messages instanceof Array) {

        for ( var i = 0; i < messages.length; i++) {
          _errorTxt = "";
          if (typeof messages[i] === "string") {
            _errorTxt = messages[i];
          } else if (typeof messages[i] === "object") {
            _errorTxt = messages[i].value;
          }
          _errorTxt.trim();
          if( _errorTxt !== ""){
              if (i === 0) {
                _firstMsgTxtLine = _errorTxt;
              } else {
                _detailmsg = _detailmsg + _errorTxt + "\n";
              }
          }
        }

        if (_detailmsg === "") { // do not show any details if none are there
          oSettings = {
            message : _firstMsgTxtLine,
            type : sap.ca.ui.message.Type.ERROR
          };
        } else {
          oSettings = {
            message : _firstMsgTxtLine,
            details : _detailmsg,
            type : sap.ca.ui.message.Type.ERROR
          };
        }

      }
      sap.ca.ui.message.showMessageBox(oSettings);
    }
  };
}());
},
  "hcm/mypaystubs/utils/Formatter.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mypaystubs.utils.Formatter");
jQuery.sap.require("sap.ui.core.format.NumberFormat");
/*global hcm:true */
hcm.mypaystubs.utils.Formatter = (function() {
  "use strict";
  return {
  // Formatter for concatenating string in the View
  stringFormatter: function() {
    var str = "";
    if (arguments[1]) {
      for (var i = 0; i < arguments.length; i++) {
        str = str + " " + arguments[i];
      }
    }
    return str;
  },
  //Number Formatter for amount
  amountFormatter: function(amount) {
    try {
      if (!isNaN(parseFloat(amount)) && isFinite(amount)) {
        var amountFormat = sap.ui.core.format.NumberFormat.getInstance();
        return amountFormat.format(amount);
      }
    } catch (e) {
      jQuery.sap.log.warning(amount + " couldn't be formatted to Number", "Payslip");
    }
    return amount;
  },
  //formatter for deductions and grosspay string 
  numberFormatter: function() {
    if (arguments.length > 1) {
      arguments[1] = hcm.mypaystubs.utils.Formatter.amountFormatter(arguments[1]);
    }
    var str = arguments[0] + ":";
    for (var i = 1; i < arguments.length; i++) {
      str = str + " " + arguments[i];
    }
    return str;
  },
  //formatter for employeeID
  idFormatter: function() {
    var id = "";
    if (!arguments[1]) {
      id = arguments[0] + ": " + arguments[2];
    } else {
      id = arguments[0] + ": " + arguments[1];
    }
    return id;
  },
  positionFormatter: function() {
    var position = "";
    if (arguments[1]) {
      position = arguments[0] + ": " + arguments[1];
    }
    return position;
  },
  monthFormatterMaster: function() {
    //ARGUMENTS[0] = PayrollType (String)
    //ARGUMENTS[1] = Period (String)
    //ARGUMENTS[2] = BonusDate (DateTime)
    return hcm.mypaystubs.utils.Formatter.monthFormatter(arguments[0],arguments[1],arguments[2],"medium");
  },
  monthFormatterDetail: function() {
    //ARGUMENTS[0] = PayrollType (String)
    //ARGUMENTS[1] = Period (String)
    //ARGUMENTS[2] = BonusDate (DateTime)
    //ARGUMENTS[3] = Reason (String)
    return hcm.mypaystubs.utils.Formatter.monthFormatter(arguments[0],arguments[1],arguments[2],"long",arguments[3]);
  },
  monthFormatterDetailPhone: function() { 
    //ARGUMENTS[0] = PayrollType (String)
    //ARGUMENTS[1] = Period (String)
    //ARGUMENTS[2] = BonusDate (DateTime)
    //ARGUMENTS[3] = Reason (String)
    return hcm.mypaystubs.utils.Formatter.monthFormatter(arguments[0],arguments[1],arguments[2],"medium",arguments[3]);
  },
  //formatter for object header title (MM/JJJJ)
  monthFormatter: function(payrollType,period,bonusDate,style,reason) {
    switch(payrollType) {
      case "A": //offcycle run
      case "C":   //check
        if (bonusDate) {
          var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
            style: style,
            UTC: true
          });
          var dateFormatted = dateFormat.format(bonusDate);
          if (reason) {
            return reason + " - " + dateFormatted.toString();
          }
          return dateFormatted.toString();
        }
        break;
      default:  //standard payroll run
        try {

          if (!isNaN(parseFloat(period)) && isFinite(period)) {
            var formatyear = period.substring(0, 4);
            var formatmonth = period.substring(4, 6);

            var url = window.location.hash;
            var appName = "RemunerationStatement";

            if(url.indexOf(appName) == "-1"){
              return formatyear;
            }

            if (reason) {
              return reason + " - " + formatmonth + "/" + formatyear;
            } else {
              return formatmonth + "/" + formatyear;
            }
          }
        } catch (e) {
          jQuery.sap.log.warning(period + " couldn't be formatted to month year", "month in S3 Controller", "Payslip");
        }
    }
  }
  };
}());
},
  "hcm/mypaystubs/utils/PdfLoader.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mypaystubs.utils.PdfLoader");
/*global hcm:true XMLHttpRequest*/
hcm.mypaystubs.utils.PdfLoader = function() {
  this.sUrl = null;
  this.sState = "idle";
  this.oRequester = null;
  this.fOnSuccess = null;
  this.fOnFailure = null;
};

hcm.mypaystubs.utils.PdfLoader.prototype.LoadPdf = function(url, onSuccess, onFailure) {

  jQuery.sap.log.debug("PdfLoader::LoadPdf " + url);

    // cancel previous request
    if (this.oRequester) {
      jQuery.sap.log.debug("PdfLoader::abort " + this.sUrl);
      this.oRequester.abort();
    }

    this.sUrl = url;
    this.fOnSuccess = onSuccess;
    this.fOnFailure = onFailure;

    // new request
    this.LoadPdfData(jQuery.proxy(this.onComplete, this));
};

hcm.mypaystubs.utils.PdfLoader.prototype.LoadPdfData = function(onComplete) {

  //    jQuery.sap.measure.start(hcm.emp.payslip.utils.PerfUtils.getStartId(hcm.emp.payslip.utils.PerfUtils.LoadPdfData)); TODO: uncomment later
  jQuery.sap.log.debug("PdfLoader::LoadPdfData " + this.sUrl);
  this.sState = "loading";

  this.oRequester = new XMLHttpRequest();
  this.oRequester.open("GET", this.sUrl, true);
  this.oRequester.setRequestHeader("Accept-Language", sap.ui.getCore().getConfiguration().getLanguage());
  this.oRequester.responseType = "arraybuffer";
  this.oRequester.onload = function() {
    onComplete();
  };

  this.oRequester.send();
};

hcm.mypaystubs.utils.PdfLoader.prototype.onComplete = function() {

  jQuery.sap.log.debug("PdfLoader::onComplete " + this.sUrl);
  this.sState = "loaded";

  try {
    if (this.oRequester.status === 200 || this.oRequester.status === 0) {
      var pdfData = this.oRequester.response;
      //            jQuery.sap.measure.end(hcm.emp.payslip.utils.PerfUtils.getEndId(hcm.emp.payslip.utils.PerfUtils.LoadPdfData)); TODO
      if (this.fOnSuccess) {
        this.fOnSuccess(pdfData);
      }
    } else {
      if (this.fOnFailure) {
        this.fOnFailure(this.oRequester.responseText);
      }
    }
  } catch (error) {
    if (this.fOnFailure) {
      this.fOnFailure(null);
    }
  }

  this.oRequester = null;
};
},
  "hcm/mypaystubs/utils/PerfUtils.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mypaystubs.utils.PerfUtils");
//hcm.emp.payslip.utils.PerfUtils.getMeasurements();
/*global hcm:true*/
hcm.mypaystubs.utils.PerfUtils = {

    MASTER_INIT : "hcm.mypaystubs.utils.MASTER_INIT",
    DETAIL_INIT : "hcm.mypaystubs.utils.DETAIL_INIT",
    PaystubLoading : "hcm.mypaystubs.utils.PaystubLoading",
    afterZoomableScrollContainerRendering : "hcm.mypaystubs.utils.afterZoomableScrollContainerRendering",
    onGetListSuccess : "hcm.mypaystubs.utils.onGetListSuccess",
    onListSelect : "hcm.mypaystubs.utils.onListSelect",
    RenderPdf : "hcm.mypaystubs.utils.RenderPdf",
    getPdfUrl: "hcm.mypaystubs.utils.getPdfUrl",
    lazyRoundNumber : "hcm.mypaystubs.utils.lazyRoundNumber",
    updateModel : "hcm.mypaystubs.utils.updateModel",
    LoadPdfData : "hcm.mypaystubs.utils.LoadPdfData",
    getDocument : "hcm.mypaystubs.utils.getDocument",
    showBusyCursor : "hcm.mypaystubs.utils.showBusyCursor",
    hideBusyCursor : "hcm.mypaystubs.utils.hideBusyCursor",
    openApplication : "hcm.mypaystubs.utils.openApplication",
    MasterView : "hcm.mypaystubs.utils.MasterView",
    DetailView : "hcm.mypaystubs.utils.DetailView",

    _mCounter:{},
    getMeasurements : function(){
        var aMeasures = jQuery.sap.measure.getAllMeasurements();
        var aOutputs = [];
        for( var i in aMeasures){
            var oMeasure = aMeasures[i];
            var oOutput = {
                "id" : oMeasure.id,
                "info" : (oMeasure.info ? oMeasure.info : ''),
                "start" : oMeasure.start.toString(),
                "end" : oMeasure.end.toString(),
                "time"  : oMeasure.time,
                "duration" : oMeasure.duration
            };
            aOutputs.push(oOutput);
        }
        var sOutput = JSON.stringify(aOutputs);
        return sOutput;
    },
    getStartId:function(id){
        if(hcm.mypaystubs.utils.PerfUtils._mCounter[id]==undefined){
            hcm.mypaystubs.utils.PerfUtils._mCounter[id]=-1;
        }
        hcm.mypaystubs.utils.PerfUtils._mCounter[id]++;
        return id +" ("+hcm.mypaystubs.utils.PerfUtils._mCounter[id]+")";
    },
    getEndId:function(id){
        if(hcm.mypaystubs.utils.PerfUtils._mCounter[id]==undefined){
            hcm.mypaystubs.utils.PerfUtils._mCounter[id]=0;
        }
        return id +" ("+hcm.mypaystubs.utils.PerfUtils._mCounter[id]+")";
    }
};
},
  "hcm/mypaystubs/view/S2.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
jQuery.sap.require("hcm.mypaystubs.utils.ConcurrentEmployment");
jQuery.sap.require("hcm.mypaystubs.utils.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
jQuery.sap.require("sap.ca.ui.model.type.Date");
jQuery.sap.require("hcm.mypaystubs.utils.DataManager");
sap.ca.scfld.md.controller.ScfldMasterController.extend("hcm.mypaystubs.view.S2", {
  extHookChangeFooterButtons: null,
  /*global hcm:true window setTimeout */
  onInit: function() {
    // execute the onInit for the base class ScfldMasterController
    sap.ca.scfld.md.controller.ScfldMasterController.prototype.onInit.call(this);
    this.oApplication = this.oApplicationFacade.oApplicationImplementation;
    this.oBundle = this.oApplicationFacade.getResourceBundle();
    this.oDataModel = this.oApplicationFacade.getODataModel();
    this._page = this.getView().byId("PAYSLIP_MASTER_PAGE");
    this.delayDataLoad = false;
    this._oRouterArgs = null;

    hcm.mypaystubs.utils.DataManager.init(this.oDataModel, this.oBundle);
    this.oRouter.getRoute("master").attachMatched(this._onRouteMatched, this); 

    var self = this;

    var m = new sap.ui.core.routing.HashChanger();
    var hash = m.getHash();
    var pernr = hash.match(/PersonnelAssignment='(\d{1,8})'/);
    if (pernr) {
      this.oApplication.pernr = pernr[1];
    }

    //if the hash contains a search query parameter ("?search=") 
    //then we delay the list loading until the 'master'-route was hit
    if (hash.indexOf("?search=") !== -1) {
      this.delayDataLoad = true;
    }

    if (!this.oApplication.pernr) {
      hcm.mypaystubs.utils.ConcurrentEmployment.getCEEnablement(this, function() {
        self._initialize();
      });
    } else if (!this.delayDataLoad) {
      self._initialize();
    }
  },

  onDataLoaded: function() {
    var items = this.getList().getItems();
    if (items.length === 0) {     //MELN2238741
      this.showEmptyView("DETAIL_TITLE", sap.ui.getCore().getConfiguration().getLanguage(), this.oBundle.getText("NO_PAYSLIPS_AVAILABLE"));
    } 
  },
  _initialize: function(searchPattern) {
    //fill the data in the UI
    var oList = this.getList();
    var oPernr = this.oApplication.pernr;
    var oTemplate = oList.getItems()[0].clone();
    var aFilters = this._getFilters(oPernr, searchPattern);
    oList.bindItems("/Paystubs", oTemplate, null, aFilters);
    //fill search hash value into search field
    if (searchPattern !== undefined) {
      this._oControlStore.oMasterSearchField.setValue(searchPattern);
    }
    this.registerMasterListBind();
    this.refreshHeaderFooterForEditToggle();
  },

  _getFilters: function (oPernr, searchPattern) {
    var aFilters = [];

    var oFilterPernr = new sap.ui.model.Filter("PersonnelAssignment", sap.ui.model.FilterOperator.EQ, oPernr);
    aFilters.push(oFilterPernr);

    if (searchPattern !== undefined) {
      var oFilterReason = new sap.ui.model.Filter("Reason", sap.ui.model.FilterOperator.Contains, searchPattern);
      var oFilterPeriod = new sap.ui.model.Filter("Period", sap.ui.model.FilterOperator.Contains, searchPattern);
      var oFilterCurrency = new sap.ui.model.Filter("Currency", sap.ui.model.FilterOperator.Contains, searchPattern);

      var dateFormat = sap.ui.core.format.DateFormat.getDateInstance();
      var dateFormatted = dateFormat.parse(searchPattern, true, true);
      if (dateFormatted) {
        var oFilterPaydate = new sap.ui.model.Filter("PayDate", sap.ui.model.FilterOperator.EQ, dateFormatted);
        aFilters.push(oFilterPaydate);
      }
      aFilters.push(oFilterReason);
      aFilters.push(oFilterPeriod);
      aFilters.push(oFilterCurrency);
    }
    return aFilters;
  },

  _onRouteMatched : function (oEvent) {
    // save the current query state
    this._oRouterArgs = oEvent.getParameter("arguments");
    this._oRouterArgs.query = this._oRouterArgs["?query"] || null;
    delete this._oRouterArgs["?query"];
    // load the list
    if (this.delayDataLoad) {
      this.delayDataLoad = false;
      this._initialize(decodeURIComponent(this._oRouterArgs.query.search));
    }
  },

  //"MELN2270488: enable backend search   
  isBackendSearch: function() {
    return true;
  },

  //apply filter patterns for the relevant fields and trigger backend ODATA request
  applyBackendSearchPattern: function(sFilterPattern, oBinding) {
    var aFilters = this._getFilters(this.oApplication.pernr, sFilterPattern);
    oBinding.filter(aFilters,sap.ui.model.FilterType.Application);

    // update the hash with the current search term
    if (sFilterPattern) {
      this._oRouterArgs.query = {search: encodeURIComponent(sFilterPattern)};
    } else {
      this._oRouterArgs.query = null;
    }
    this._bListLoaded = false;
    this.oRouter.navTo("master",this._oRouterArgs, true /*no history*/);
  },

  getHeaderFooterOptions: function() {
    var objHdrFtr = {
      sI18NMasterTitle: "DISPLAY_NAME_LIST"
    };
    /**
     * @ControllerHook Modify the footer buttons
     * This hook method can be used to add and change buttons for the master view header/footer
     * @callback hcm.mypaystubs.view.S2~extHookChangeFooterButtons
     * @param {object} Header Footer Object
     * @return {object} Header Footer Object
     */

    if (this.extHookChangeFooterButtons) {
      objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
    }
    return objHdrFtr;
  },

  setListItem: function(oItem) {
    var query = this._oRouterArgs.query;
    this.oRouter.navTo("detail", {
      from: oItem.getTitle(),
      contextPath: oItem.getBindingContext().sPath.substr(1),
      query: query
    }, !sap.ui.Device.system.phone);
    this.refreshHeaderFooterForEditToggle();
  }
});
},
  "hcm/mypaystubs/view/S2.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View \n\txmlns:core="sap.ui.core"\n\txmlns="sap.m" \n\tcontrollerName="hcm.mypaystubs.view.S2">\n\t<Page
 id="PAY+
SLIP_MASTER_PAGE" title="{i18n>DISPLAY_NAME_LIST}"> \n\t\t<core:ExtensionPoint name="extS2Header"></core:ExtensionPoint>\n\t\t<content>\n\t\t\t<List id="list" \n\t\t\t\tthreshold="15" \n\t\t\t\tgrowingThreshold="15" \n\t\t\t\tgrowing="true" \n\t\t\t\tnoDataText="{i18n>NO_PAYSLIP}" \n\t\t\t\tmode="{device>/listMode}" \n\t\t\t\tselect="_handleSelect">\n\t\t\t\t<ObjectListItem title="{parts: [{path: \'PayrollType\'},{path: \'Period\'},{path: \'BonusDate\'}], formatter:\'hcm.mypaystubs.utils.Formatter.monthFormatterMaster\'}" \n\t\t\t\t\t\t\t\tshowMarkers="false" \n\t\t\t\t\t\t\t\tmarkFlagged="false" \n\t\t\t\t\t\t\t\tmarkFavorite="false" \n\t\t\t\t\t\t\t\tintro="{PayrollDescription}" \n\t\t\t\t\t\t\t\tnumberUnit="{Currency}" \n\t\t\t\t\t\t\t\tnumber="{ path:\'Amount\', formatter:\'hcm.mypaystubs.utils.Formatter.amountFormatter\' }" \n\t\t\t\t\t\t\t\tcounter="0" \n\t\t\t\t\t\t\t\tpress="_handleItemPress" \n\t\t\t\t\t\t\t\ttype="{device>/listItemType}" >\n\t\t\t\t\t<attributes>\n\t\t\t\t\t\t<ObjectAttribute id="PAYROLL_TYPE_TEXT" text="{path: \'Reason\'}" />\n\t\t\t\t\t\t<ObjectAttribute id="PAYROLL_PERIOD" text="{path:\'StartDate\', type:\'sap.ui.model.type.Date\', formatOptions: { style:\'medium\', UTC: true}} - \n\t\t\t\t\t\t                                           {path:\'EndDate\',   type:\'sap.ui.model.type.Date\', formatOptions: { style:\'medium\', UTC: true}}"\n\t\t\t\t\t\t                                     visible="{= ${PayrollType}  === \'A\' || ${PayrollType}  === \'C\' ? false : true }" />\n\t              \t\t<!-- extension added to add fields in list item -->\t\n\t                \t<core:ExtensionPoint name="extS2ListItem"></core:ExtensionPoint>\n\t            \t</attributes>\n\t            </ObjectListItem>\n\t\t\t</List>\n\t\t</content>\n\t</Page>\n</core:View>',
  "hcm/mypaystubs/view/S3.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("hcm.mypaystubs.utils.PdfLoader");
jQuery.sap.require("hcm.mypaystubs.utils.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
/*global hcm:true window setTimeout */
sap.ca.scfld.md.controller.BaseDetailController.extend("hcm.mypaystubs.view.S3", {

  //  Controller Hook method definitions
  //  This hook method can be used to add and change buttons for the detail view footer
  //  It is called when the decision options for the detail item are fetched successfully

  extHookChangeFooterButtons: null,
  onInit: function() {
    //execute the onInit for the base class BaseDetailController
    sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
    this.resourceBundle = this.oApplicationFacade.getResourceBundle();

    this.oRouter.attachRouteMatched(this.handleRouteMatched, this);

    // pdf loader
    this.oPfdLoader = new hcm.mypaystubs.utils.PdfLoader();

    // model bound to selection
    this.jsonModel = new sap.ui.model.json.JSONModel();
    this.getView().setModel(this.jsonModel, "NewModel");

    this._zoomableScrollContainer = this.getView().byId("PAYSLIP_PDF_VIEWER_CONTAINER");
    this._busy = this.getView().byId("PAYSLIP_BUSY_CURSOR_CONTAINER");

    // add delegates
    this._zoomableScrollContainer.addEventDelegate({
      onAfterRendering: jQuery.proxy(this.afterZoomableScrollContainerRendering, this)
    }, this);

    this._pdfViewer = this._zoomableScrollContainer.getContent()[0];

  },


  //----------------------------------------------------------------------------------------------------------------------------------------------------------    
  /**
   * Handler for ZoomScrollContainer Rendering
   */
  afterZoomableScrollContainerRendering: function() {
    this._zoomableScrollContainer.getDomRef().style.marginLeft = "2.5%";
    this._pdfViewer.UnloadPdf();
    this._pdfViewer.Show(this.oPfdLoader);
  },
  //----------------------------------------------------------------------------------------------------------------------------------------------------------    
  showBusyCursor: function() {
    setTimeout(jQuery.proxy(function() {
      if (this._busy !== null) {
        this._busy.setVisible(true);
      }
    }, this), 0);

  },
  //----------------------------------------------------------------------------------------------------------------------------------------------------------    
  hideBusyCursor: function() {
    setTimeout(jQuery.proxy(function() {
      if (this._busy !== null) {
        this._busy.setVisible(false);
      }
    }, this), 0);
  },

  //----------------------------------------------------------------------------------------------------------------------------------------------------------    
  handleRouteMatched: function(oEvent) {
    var view = this.getView();
    var itemModel = null;

    if (oEvent.getParameter("name") === "detail") {
      var context = new sap.ui.model.Context(this.oApplicationFacade.getODataModel(), '/' + oEvent.getParameter("arguments").contextPath);
      view.setBindingContext(context);

      var pdfProp = this.getPdfUrl(context);

      itemModel = {};
      itemModel.initialScale = sap.ui.Device.system.phone ? 1 / 4 : 1;
      itemModel.minScale = sap.ui.Device.system.phone ? 1 / 4 : 1;
      itemModel.maxScale = sap.ui.Device.system.phone ? 2 : 3;

      itemModel.EndDate = pdfProp.EndDate;
      itemModel.SEQUENCENUMBER = pdfProp.SEQUENCENUMBER;
      itemModel.PDFPayslipUrl = pdfProp.PDFPayslipUrl;
      this.jsonModel.setData(itemModel);

      this._zoomableScrollContainer.invalidate();

      this.oApplicationImplementation.defineDetailHeaderFooter(this);
    }
  },
  //----------------------------------------------------------------------------------------------------------------------------------------------------------    

  getPdfUrl: function(context) {

    var pdfProp = {};
    if (context.getProperty("")) {
      pdfProp.SEQUENCENUMBER = context.getProperty("").SEQUENCENUMBER;
      pdfProp.EndDate = context.getProperty("").EndDate;
    }
    //when direct # url is used to load S3
    pdfProp.PDFPayslipUrl = (context.getModel().sServiceUrl + context.sPath).replace("Paystubs", "PDFPaystubs") + "/$value";

    if (jQuery.sap.getUriParameters().get("local")) {
      var a = window.location.href.indexOf("index.html");
      var c = null;
      if (a > -1) {
        c = window.location.href.substring(0, a);
      } else {
        var origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        c = origin + window.location.pathname;
      }
      var e = pdfProp.PDFPayslipUrl.indexOf("http://") > -1 ? pdfProp.PDFPayslipUrl.replace("http://", "proxy/http/") : pdfProp.PDFPayslipUrl
        .replace("https://", "proxy/https/");
      pdfProp.PDFPayslipUrl = c + e;
    }
    return pdfProp;
  },
  //----------------------------------------------------------------------------------------------------------------------------------------------------------    
  onOpenPDFClicked: function(evt) {

    // open in new window
    jQuery.sap.log.info("open pdf pressed");
    var endDate = new Date(Date.parse(this.jsonModel.getProperty("/EndDate")));
    var month = ("0" + (endDate.getMonth() + 1)).slice(-2);
    var day = ("0" + endDate.getDate()).slice(-2);
    var year = endDate.getFullYear();
    var dateString = month + '.' + day + '.' + year;

    var newWindow = window.open(this.jsonModel.getProperty("/PDFPayslipUrl"), "_blank");

    // set title window
    newWindow.onload = jQuery.proxy(function() {
      newWindow.document.title = this.resourceBundle.getText('PDF_WINDOW_TITLE', [dateString]);
    }, this);
  },

  /**
   * @public [getHeaderFooterOptions Define header & footer options]
   */
  //----------------------------------------------------------------------------------------------------------------------------------------------------------
  getHeaderFooterOptions: function() {
    var that = this;
    var objHdrFtr = {
      buttonList: [{
        sId: "PAYSLIP_DETAIL_BTN_OPEN_PDF",
        sI18nBtnTxt: "OPEN_AS_PDF",
        bEnabled: true,
        onBtnPressed: function(evt) {
          that.onOpenPDFClicked(evt);
        }
      }],
      oAddBookmarkSettings: {
        title: that.resourceBundle.getText("DISPLAY_NAME_DETAILS"),
        icon: "sap-icon://travel-expense-report" // //Fiori2/F0395
      }
    };
    var m = new sap.ui.core.routing.HashChanger();
    var oUrl = m.getHash();
    if (oUrl.indexOf("Shell-runStandaloneApp") >= 0) {
      objHdrFtr.bSuppressBookmarkButton = true;
    }
    /**
     * @ControllerHook Modify the footer buttons
     * This hook method can be used to add and change buttons for the detail view footer
     * It is called when the decision options for the detail item are fetched successfully
     * @callback hcm.emp.payslip.view.S3~extHookChangeFooterButtons
     * @param {object} objHdrFtr-Header Footer Object
     * @return {object} objHdrFtr-Header Footer Object
     */

    if (this.extHookChangeFooterButtons) {
      objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
    }
    return objHdrFtr;
  }
});
},
  "hcm/mypaystubs/view/S3.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View \n\tcontrollerName="hcm.mypaystubs.view.S3" \n\txmlns:core="sap.ui.core"
 \n\txmlns:ctrl="hcm.mypaystubs.con+
trols"\n\txmlns:form="sap.ui.layout.form" \n\txmlns:l="sap.ui.layout" \n\txmlns:me="sap.me" \n\txmlns="sap.m">\n\t<Page class="sapUiFioriObjectPage" enableScrolling="false" id="PAGE_DETAILS" title="{i18n>DISPLAY_NAME_DETAILS}">\n\t\t<content>\n\t\t\t<ObjectHeader \n\t\t\t    number="{path:\'Amount\', formatter:\'hcm.mypaystubs.utils.Formatter.amountFormatter\'}"\n\t\t\t\tnumberUnit="{parts: [{path: \'i18n>TAKE_HOME_PAY\'},{path: \'Currency\'}], formatter:\'hcm.mypaystubs.utils.Formatter.stringFormatter\'}"\n\t\t\t\ttitle="{parts: [{path: \'PayrollType\'},{path: \'Period\'},{path: \'BonusDate\'},{path: \'Reason\'}], formatter:\'hcm.mypaystubs.utils.Formatter.monthFormatterDetail\'}">\n\t\t\t\t<attributes>\n\t\t\t\t\t<ObjectAttribute id="PAYROLL_PERIOD"\n\t\t\t\t\t\ttext="{path:\'i18n>PAYROLL_PERIOD\'}: {path:\'StartDate\', type:\'sap.ui.model.type.Date\', formatOptions: { style:\'long\', UTC: true}} - \n\t\t\t\t\t\t                                    {path:\'EndDate\',   type:\'sap.ui.model.type.Date\', formatOptions: { style:\'long\', UTC: true}}"\n\t\t\t\t\t\tvisible="{= ${PayrollType}  === \'A\' || ${PayrollType}  === \'C\' ? false : true }" />\n\t\t\t\t\t<ObjectAttribute id="OFFCYCLE_REASON"\n\t\t\t\t\t\ttext="{parts: [{path: \'i18n>OFFCYCLE_REASON\'},{path: \'GroupName\'}], formatter:\'hcm.mypaystubs.utils.Formatter.positionFormatter\'}"\n\t\t\t\t\t\tvisible="{= ${PayrollType}  === \'A\' || ${PayrollType}  === \'C\' ? true : false }" />\n\t\t\t\t\t<ObjectAttribute id="PAY_DATE"\n\t\t\t\t\t\ttext="{path:\'i18n>PAY_DATE\'}: {path:\'PayDate\', type:\'sap.ui.model.type.Date\', formatOptions: { style:\'long\', UTC: true}}" />\t\n\t\t\t\t</attributes>\n\t\t\t\t<statuses>\n\t\t\t\t\t<ObjectStatus id="MPS_DEDUCTIONS" state="Error"\n\t\t\t\t\t\ttext="{parts: [{path: \'i18n>PAYSLIP_DEDUCTIONS\'},{path: \'Deduction\'},{path: \'Currency\'}], formatter:\'hcm.mypaystubs.utils.Formatter.numberFormatter\'}"/>\n\t\t\t\t\t<ObjectStatus id="MPS_GROSSPAY" state="Success"\n\t\t\t\t\t\ttext="{parts: [{path: \'i18n>PAYSLIP_GROSSPAY\'},{path: \'GrossPay\'},{path: \'Currency\'}], formatter:\'hcm.mypaystubs.utils.Formatter.numberFormatter\'}"/>\n\t\t\t\t</statuses>\n\t\t\t\t<!-- extension point for additional fields in header -->\n\t\t\t\t<core:ExtensionPoint name="extS3Header"></core:ExtensionPoint>\n\t\t\t</ObjectHeader>\n\t\t\t<VBox alignItems="Center" id="PAYSLIP_BUSY_CURSOR_CONTAINER" visible="false" width="100%">\n\t\t\t\t<BusyIndicator class="payslipBusyCursor" id="PAYSLIP_BUSY_CURSOR" size="40px"></BusyIndicator>\n\t\t\t</VBox>\n\t\t\t<ctrl:ZoomableScrollContainer class="payslipPdf sapThemePageBG sapUiMediumMarginBeginEnd" id="PAYSLIP_PDF_VIEWER_CONTAINER" initialScale="{NewModel>/initialScale}" maxScale="{NewModel>/maxScale}" minScale="{NewModel>/minScale}" vertical="true">\n\t\t\t\t<ctrl:PDFViewer begin="showBusyCursor" complete="hideBusyCursor" errorMessage="{i18n>PDF_SERVICE_ERR_MESSAGE}" id="PDF_VIEWER_CTRL"\n\t\t\t\t\tsrc="{NewModel>/PDFPayslipUrl}">\n\t\t\t\t</ctrl:PDFViewer>\n\t\t\t</ctrl:ZoomableScrollContainer>\n\t\t</content>\n\t\t<footer id="MPS_DETAIL_FOOTER">\n\t\t\t<Bar id="MPS_DETAIL_FOOTER_BAR" translucent="true"/>\n\t\t</footer>\n\t</Page>\n</core:View>',
  "hcm/mypaystubs/view/S3_Phone.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("hcm.mypaystubs.utils.PdfLoader");
jQuery.sap.require("hcm.mypaystubs.utils.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
/*global hcm:true window setTimeout */
sap.ca.scfld.md.controller.BaseDetailController.extend("hcm.mypaystubs.view.S3_Phone", {

//  Controller Hook method definitions
//  This hook method can be used to add and change buttons for the detail view footer
//  It is called when the decision options for the detail item are fetched successfully

  extHookChangeFooterButtons: null,
    onInit: function() {
        //execute the onInit for the base class BaseDetailController
        sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);    
        this.resourceBundle = this.oApplicationFacade.getResourceBundle();
        
    this.oRouter.attachRouteMatched(this.handleRouteMatched, this); 

      // pdf loader
      this.oPfdLoader = new hcm.mypaystubs.utils.PdfLoader();
      
      // model bound to selection
      this.jsonModel = new sap.ui.model.json.JSONModel();
      this.getView().setModel(this.jsonModel, "NewModel");
      
      this._zoomableScrollContainer = this.getView().byId("PAYSLIP_PDF_VIEWER_CONTAINER");
      this._busy = this.getView().byId("PAYSLIP_BUSY_CURSOR_CONTAINER");

      // add delegates
      this._zoomableScrollContainer.addEventDelegate({
      onAfterRendering: jQuery.proxy(this.afterZoomableScrollContainerRendering, this)
      }, this);

      this._pdfViewer = this._zoomableScrollContainer.getContent()[0];

    },
    
//----------------------------------------------------------------------------------------------------------------------------------------------------------    
    /**
     * Handler for ZoomScrollContainer Rendering
     */
   afterZoomableScrollContainerRendering : function() {
        this._zoomableScrollContainer.getDomRef().style.marginLeft = "2.5%";
        this._pdfViewer.UnloadPdf();
        this._pdfViewer.ClearPdfData();
        this._pdfViewer.Show(this.oPfdLoader);
    },
//----------------------------------------------------------------------------------------------------------------------------------------------------------    
    showBusyCursor: function(){
      setTimeout(jQuery.proxy(function() {
            if (this._busy!==null)
            {    this._busy.setVisible(true);
            }
        }, this), 0);

    },
//----------------------------------------------------------------------------------------------------------------------------------------------------------    
    hideBusyCursor: function(){
       setTimeout(jQuery.proxy(function() {
              if (this._busy!==null)
              {    this._busy.setVisible(false);
              }
          }, this), 0);
    },

//----------------------------------------------------------------------------------------------------------------------------------------------------------    
    handleRouteMatched :function(oEvent){
        var view = this.getView();
        var itemModel = null;

    if (oEvent.getParameter("name") === "detail") {
      var context = new sap.ui.model.Context(this.oApplicationFacade.getODataModel(), '/' + oEvent.getParameter("arguments").contextPath);
      view.setBindingContext(context);

      var pdfProp = this.getPdfUrl(context);

      itemModel = {};
      itemModel.initialScale = sap.ui.Device.system.phone ? 1/4 : 1;
          itemModel.minScale = sap.ui.Device.system.phone ? 1/4 : 1;
          itemModel.maxScale = sap.ui.Device.system.phone ? 2 : 3;

          itemModel.EndDate = pdfProp.EndDate;
          itemModel.SEQUENCENUMBER= pdfProp.SEQUENCENUMBER;
          itemModel.PDFPayslipUrl= pdfProp.PDFPayslipUrl;         
          this.jsonModel.setData(itemModel);

      this._zoomableScrollContainer.invalidate();       

      this.oApplicationImplementation.defineDetailHeaderFooter(this);
    }
    },
//----------------------------------------------------------------------------------------------------------------------------------------------------------    
     
    getPdfUrl : function(context) {
        
        var pdfProp = {};
        if(context.getProperty("")){
          pdfProp.SEQUENCENUMBER = context.getProperty("").SEQUENCENUMBER;
          pdfProp.EndDate = context.getProperty("").EndDate;
        }
        //when direct # url is used to load S3
        pdfProp.PDFPayslipUrl = (context.getModel().sServiceUrl + context.sPath).replace("Paystubs", "PDFPaystubs") + "/$value";        

        if (jQuery.sap.getUriParameters().get("local")) {
            var a = window.location.href.indexOf("index.html");
            var c = null;
            if (a > -1) {
                c = window.location.href.substring(0, a);
            } else {
              var origin = window.location.protocol + "//" 
              + window.location.hostname + (window.location.port ? ':'
              + window.location.port : '');
                c = origin + window.location.pathname;
            }
            var e = pdfProp.PDFPayslipUrl.indexOf("http://") > -1 ? pdfProp.PDFPayslipUrl.replace("http://", "proxy/http/") : pdfProp.PDFPayslipUrl.replace("https://", "proxy/https/");
            pdfProp.PDFPayslipUrl = c + e;
        }
        
        return pdfProp;
       
    },
//----------------------------------------------------------------------------------------------------------------------------------------------------------    
    onOpenPDFClicked : function (evt) {

        // open in new window
        jQuery.sap.log.info("open pdf pressed");
        var endDate = new Date(Date.parse(this.jsonModel.oData.EndDate));
        var month = ("0" + (endDate.getMonth()+1)).slice(-2);
        var day =  ("0" + endDate.getDate()).slice(-2);
        var year = endDate.getFullYear();
        var dateString = month + '.' + day + '.' + year;
//
        var newWindow = window.open(this.jsonModel.oData.PDFPayslipUrl , "_blank");
//
//        // set title window
        newWindow.onload = jQuery.proxy(function() {
            newWindow.document.title = this.resourceBundle.getText('PDF_WINDOW_TITLE', [dateString]);
        }, this);
    },
    
//  navToEmpty : function()
 {&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbs+
p;                                         
//
 this.oRouter.navTo("noData");&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp+
;                               
//  },

    /**
     * @public [getHeaderFooterOptions Define header & footer options]
     */
//----------------------------------------------------------------------------------------------------------------------------------------------------------
    getHeaderFooterOptions: function() {
      var that = this;

      var objHdrFtr = {

              buttonList : [{
                sId : "PAYSLIP_DETAIL_BTN_OPEN_PDF",
            sI18nBtnTxt : "OPEN_AS_PDF",
            bEnabled : true,
            onBtnPressed : function(evt) {
              that.onOpenPDFClicked(evt);
                    }
          }],

              oAddBookmarkSettings : {
                title : that.resourceBundle.getText("DISPLAY_NAME_DETAILS"),  
                icon: "sap-icon://travel-expense-report"// //Fiori2/F0395
                }

            };
            var m = new sap.ui.core.routing.HashChanger();
            var oUrl = m.getHash();
            if(oUrl.indexOf("Shell-runStandaloneApp") >= 0){
            objHdrFtr.bSuppressBookmarkButton  = true;
            }
      /**
         * @ControllerHook Modify the footer buttons
         * This hook method can be used to add and change buttons for the detail view footer
         * It is called when the decision options for the detail item are fetched successfully
         * @callback hcm.emp.payslip.view.S3_Phone~extHookChangeFooterButtons
         * @param {object} objHdrFtr-Header Footer Object
         * @return {object} objHdrFtr-Header Footer Object
         */

      if (this.extHookChangeFooterButtons) {
        objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
      }
       return objHdrFtr;
    }

});
},
  "hcm/mypaystubs/view/S3_Phone.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View \t \n\txmlns="sap.m" \n\tcontrollerName="hcm.mypaystubs.view.S3_Phone"\n\txmlns:me="sap.me"
 \n\txmlns+
:core="sap.ui.core"\n\txmlns:ctrl="hcm.mypaystubs.controls"\n\txmlns:form="sap.ui.layout.form"\n\txmlns:l="sap.ui.layout">\n\t\t<Page class="sapUiFioriObjectPage" title="{i18n>DISPLAY_NAME_DETAILS}" enableScrolling="false" id="PAGE_DETAILS_PHONE">\n\t\t<content>\n\t\t\t<ObjectHeader \n\t\t\t\tresponsive="true"\n\t\t\t\ttitle="{parts: [{path: \'PayrollType\'},{path: \'Period\'},{path: \'BonusDate\'},{path: \'Reason\'}], formatter:\'hcm.mypaystubs.utils.Formatter.monthFormatterDetailPhone\'}"\n\t\t\t\tnumber="{path:\'Amount\', formatter:\'hcm.mypaystubs.utils.Formatter.amountFormatter\'}" \n\t\t\t\tnumberUnit="{Currency}">\n\t\t\t\t<attributes>\n\t\t\t\t\t<ObjectAttribute id="PAY_DATE"          \n\t\t\t\t\t\ttext="{path:\'i18n>PAY_DATE\'}: {path:\'PayDate\', type:\'sap.ui.model.type.Date\', formatOptions: { style:\'long\', UTC: true}}" />\t\n\t\t\t\t\t<ObjectAttribute id="OFFCYCLE_REASON"\n\t\t\t\t\t\ttext="{parts: [{path: \'i18n>OFFCYCLE_REASON\'},{path: \'GroupName\'}], formatter:\'hcm.mypaystubs.utils.Formatter.positionFormatter\'}"\n\t\t\t\t\t\tvisible="{= ${PayrollType}  === \'A\' || ${PayrollType}  === \'C\' ? true : false }" />\t\n\t\t\t\t</attributes>\n\t\t\t\t<statuses>\n\t\t\t   \t\t<ObjectStatus id="MPS_DEDUCTIONS" \n\t\t\t   \t\t\ttext="{parts: [{path: \'i18n>PAYSLIP_DEDUCTIONS\'},{path: \'Deduction\'},{path: \'Currency\'}], formatter:\'hcm.mypaystubs.utils.Formatter.numberFormatter\'}" state="Error" />\n\t\t\t   \t\t<ObjectStatus id="MPS_GROSSPAY" \n\t\t\t   \t\t\ttext="{parts: [{path: \'i18n>PAYSLIP_GROSSPAY\'},{path: \'GrossPay\'},{path: \'Currency\'}], formatter:\'hcm.mypaystubs.utils.Formatter.numberFormatter\'}" state="Success" />\t   \t\t\t   \t\t\n        \t\t</statuses>\n        \t\t <!-- extension point for additional fields in header -->\n                <core:ExtensionPoint name="extS3PhoneHeader"></core:ExtensionPoint>\n\t\t   \t</ObjectHeader>\n\t\t\t<VBox id="PAYSLIP_BUSY_CURSOR_CONTAINER" visible="false" width="100%" alignItems="Center">\n\t\t\t \t<BusyIndicator id="PAYSLIP_BUSY_CURSOR" size="40px" class="payslipBusyCursor"></BusyIndicator>\n\t\t\t</VBox>\n\t\t\t<ctrl:ZoomableScrollContainer id="PAYSLIP_PDF_VIEWER_CONTAINER" \n\t\t\t   height = "95%" width = "95%" vertical = "true" class="payslipPdf"\n\t\t\t   initialScale= "{NewModel>/initialScale}" minScale="{NewModel>/minScale}" maxScale="{NewModel>/maxScale}">\t\n\t\t\t   \n\t\t\t   <ctrl:PDFViewer id="PDF_VIEWER_CTRL"  errorMessage="{i18n>PDF_SERVICE_ERR_MESSAGE}"\n\t\t\t\t\tbegin="showBusyCursor"  complete="hideBusyCursor" src="{NewModel>/PDFPayslipUrl}">\n\t\t\t\t</ctrl:PDFViewer>\t   \t\t\t   \n\t\t\t</ctrl:ZoomableScrollContainer>\n\t\t</content>\t\t\n\t\t<footer id="MPS_DETAIL_FOOTER">\n\t\t\t<Bar id="MPS_DETAIL_FOOTER_BAR" translucent="true"/>\n\t\t</footer>\n\t</Page>\n\t\n\t</core:View>'
}});