/*
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
		//		"toS5" : {
		//			"pattern" : "toS5",
		//			"view" : "S5",
		//		}
		//},
		//fullScreenPageRoutes : {
		//	// fill the routes to your full screen pages in here.
		//	"subDetail" : {
		//		"pattern" : "subDetail/{contextPath}",
		//		"view" : "S4",
		//	}
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