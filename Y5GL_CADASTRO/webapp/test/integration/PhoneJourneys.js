/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"Y5GL_CADASTRO/Y5GL_CADASTRO/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"Y5GL_CADASTRO/Y5GL_CADASTRO/test/integration/pages/App",
	"Y5GL_CADASTRO/Y5GL_CADASTRO/test/integration/pages/Browser",
	"Y5GL_CADASTRO/Y5GL_CADASTRO/test/integration/pages/Master",
	"Y5GL_CADASTRO/Y5GL_CADASTRO/test/integration/pages/Detail",
	"Y5GL_CADASTRO/Y5GL_CADASTRO/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "Y5GL_CADASTRO.Y5GL_CADASTRO.view."
	});

	sap.ui.require([
		"Y5GL_CADASTRO/Y5GL_CADASTRO/test/integration/NavigationJourneyPhone",
		"Y5GL_CADASTRO/Y5GL_CADASTRO/test/integration/NotFoundJourneyPhone",
		"Y5GL_CADASTRO/Y5GL_CADASTRO/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});