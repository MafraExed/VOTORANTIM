/*
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