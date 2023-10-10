/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"Y5GL_REL_FERI2/Y5GL_REL_FERI2/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"Y5GL_REL_FERI2/Y5GL_REL_FERI2/test/integration/pages/Worklist",
	"Y5GL_REL_FERI2/Y5GL_REL_FERI2/test/integration/pages/Object",
	"Y5GL_REL_FERI2/Y5GL_REL_FERI2/test/integration/pages/NotFound",
	"Y5GL_REL_FERI2/Y5GL_REL_FERI2/test/integration/pages/Browser",
	"Y5GL_REL_FERI2/Y5GL_REL_FERI2/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "Y5GL_REL_FERI2.Y5GL_REL_FERI2.view."
	});

	sap.ui.require([
		"Y5GL_REL_FERI2/Y5GL_REL_FERI2/test/integration/WorklistJourney",
		"Y5GL_REL_FERI2/Y5GL_REL_FERI2/test/integration/ObjectJourney",
		"Y5GL_REL_FERI2/Y5GL_REL_FERI2/test/integration/NavigationJourney",
		"Y5GL_REL_FERI2/Y5GL_REL_FERI2/test/integration/NotFoundJourney",
		"Y5GL_REL_FERI2/Y5GL_REL_FERI2/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});