sap.ui.jsview("pdfviewer2.viewer", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf pdfviewer2.viewer
	*/ 
	getControllerName : function() {
		return "pdfviewer2.viewer";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf pdfviewer2.viewer
	*/ 
	createContent : function(oController) {
		
		var aControls = [];
		
		var myPDFViewer = new PDFViewer("myPDF");
		
		aControls.push(myPDFViewer); 
			
		return aControls;		
		

	}

});