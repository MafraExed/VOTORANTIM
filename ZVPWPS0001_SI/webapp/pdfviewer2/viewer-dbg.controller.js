sap.ui.controller("pdfviewer2.viewer", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf pdfviewer2.viewer
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf pdfviewer2.viewer
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf pdfviewer2.viewer
*/
	onAfterRendering: function() {

		var objPDF = sap.ui.getCore().byId("myPDF");

		//Set the PDF Viewer Control with the content via a URL
//		objPDF.setPDFurl("http://www.adobe.com/content/dam/Adobe/en/company/pdfs/fast-facts.pdf");
		
//		//Set the PDF with a base64 PDF Code Version
//		//1 - Load the PDF from the base64 file
		var sPDFBase64 = loadPDF();
//		//2 - Set the PDF Viewer Control with the content via the base64 String
		objPDF.setPDFBase64(sPDFBase64);

	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf pdfviewer2.viewer
*/
//	onExit: function() {
//
//	}

});