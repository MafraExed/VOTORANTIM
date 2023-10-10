/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"Y5GL_BEM_ESTAR/Y5GL_BEM_ESTAR/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"Y5GL_BEM_ESTAR/Y5GL_BEM_ESTAR/test/integration/pages/Worklist",
	"Y5GL_BEM_ESTAR/Y5GL_BEM_ESTAR/test/integration/pages/Object",
	"Y5GL_BEM_ESTAR/Y5GL_BEM_ESTAR/test/integration/pages/NotFound",
	"Y5GL_BEM_ESTAR/Y5GL_BEM_ESTAR/test/integration/pages/Browser",
	"Y5GL_BEM_ESTAR/Y5GL_BEM_ESTAR/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "Y5GL_BEM_ESTAR.Y5GL_BEM_ESTAR.view."
	});

	sap.ui.require([
		"Y5GL_BEM_ESTAR/Y5GL_BEM_ESTAR/test/integration/WorklistJourney",
		"Y5GL_BEM_ESTAR/Y5GL_BEM_ESTAR/test/integration/ObjectJourney",
		"Y5GL_BEM_ESTAR/Y5GL_BEM_ESTAR/test/integration/NavigationJourney",
		"Y5GL_BEM_ESTAR/Y5GL_BEM_ESTAR/test/integration/NotFoundJourney",
		"Y5GL_BEM_ESTAR/Y5GL_BEM_ESTAR/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});