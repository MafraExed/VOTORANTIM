/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 ZET_GLHR_MEU_CADASTROSet in the list

sap.ui.require([
	"sap/ui/test/Opa5",
	"Y5GL_APROVB/Y5GL_APROVB/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"Y5GL_APROVB/Y5GL_APROVB/test/integration/pages/App",
	"Y5GL_APROVB/Y5GL_APROVB/test/integration/pages/Browser",
	"Y5GL_APROVB/Y5GL_APROVB/test/integration/pages/Master",
	"Y5GL_APROVB/Y5GL_APROVB/test/integration/pages/Detail",
	"Y5GL_APROVB/Y5GL_APROVB/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "Y5GL_APROVB.Y5GL_APROVB.view."
	});

	sap.ui.require([
		"Y5GL_APROVB/Y5GL_APROVB/test/integration/MasterJourney",
		"Y5GL_APROVB/Y5GL_APROVB/test/integration/NavigationJourney",
		"Y5GL_APROVB/Y5GL_APROVB/test/integration/NotFoundJourney",
		"Y5GL_APROVB/Y5GL_APROVB/test/integration/BusyJourney",
		"Y5GL_APROVB/Y5GL_APROVB/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});