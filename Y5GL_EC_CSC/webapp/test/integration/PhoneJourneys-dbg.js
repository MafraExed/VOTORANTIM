/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"Y5GL_EC_CSC/Y5GL_EC_CSC/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"Y5GL_EC_CSC/Y5GL_EC_CSC/test/integration/pages/App",
	"Y5GL_EC_CSC/Y5GL_EC_CSC/test/integration/pages/Browser",
	"Y5GL_EC_CSC/Y5GL_EC_CSC/test/integration/pages/Master",
	"Y5GL_EC_CSC/Y5GL_EC_CSC/test/integration/pages/Detail",
	"Y5GL_EC_CSC/Y5GL_EC_CSC/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "Y5GL_EC_CSC.Y5GL_EC_CSC.view."
	});

	sap.ui.require([
		"Y5GL_EC_CSC/Y5GL_EC_CSC/test/integration/NavigationJourneyPhone",
		"Y5GL_EC_CSC/Y5GL_EC_CSC/test/integration/NotFoundJourneyPhone",
		"Y5GL_EC_CSC/Y5GL_EC_CSC/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});