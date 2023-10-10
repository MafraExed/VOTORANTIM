/*
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