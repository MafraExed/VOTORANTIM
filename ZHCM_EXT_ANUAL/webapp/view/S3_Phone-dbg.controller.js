/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("hcm.mypaystubs.utils.PdfLoader");
jQuery.sap.require("hcm.mypaystubs.utils.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
/*global hcm:true window setTimeout */
sap.ca.scfld.md.controller.BaseDetailController.extend("hcm.mypaystubs.view.S3_Phone", {
	
//	Controller Hook method definitions	
//	This hook method can be used to add and change buttons for the detail view footer
//	It is called when the decision options for the detail item are fetched successfully
	
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
    
//	navToEmpty : function() {                                                                               
//		this.oRouter.navTo("noData");                                                                    
//	},
	
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