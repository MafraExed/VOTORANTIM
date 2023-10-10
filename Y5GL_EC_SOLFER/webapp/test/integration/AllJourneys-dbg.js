/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 ZET_AVISOFERSet in the list

sap.ui.require([
	"sap/ui/test/Opa5",
	"Y5GL_EC_SOLFER/Y5GL_EC_SOLFER/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"Y5GL_EC_SOLFER/Y5GL_EC_SOLFER/test/integration/pages/App",
	"Y5GL_EC_SOLFER/Y5GL_EC_SOLFER/test/integration/pages/Browser",
	"Y5GL_EC_SOLFER/Y5GL_EC_SOLFER/test/integration/pages/Master",
	"Y5GL_EC_SOLFER/Y5GL_EC_SOLFER/test/integration/pages/Detail",
	"Y5GL_EC_SOLFER/Y5GL_EC_SOLFER/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "Y5GL_EC_SOLFER.Y5GL_EC_SOLFER.view."
	});

	sap.ui.require([
		"Y5GL_EC_SOLFER/Y5GL_EC_SOLFER/test/integration/MasterJourney",
		"Y5GL_EC_SOLFER/Y5GL_EC_SOLFER/test/integration/NavigationJourney",
		"Y5GL_EC_SOLFER/Y5GL_EC_SOLFER/test/integration/NotFoundJourney",
		"Y5GL_EC_SOLFER/Y5GL_EC_SOLFER/test/integration/BusyJourney"
	], function () {
		QUnit.start();
	});
});