/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"ZCBLE_PR_REM_SAIDA/ZCBLE_PR_REM_SAIDA/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"ZCBLE_PR_REM_SAIDA/ZCBLE_PR_REM_SAIDA/test/integration/pages/Worklist",
	"ZCBLE_PR_REM_SAIDA/ZCBLE_PR_REM_SAIDA/test/integration/pages/Object",
	"ZCBLE_PR_REM_SAIDA/ZCBLE_PR_REM_SAIDA/test/integration/pages/NotFound",
	"ZCBLE_PR_REM_SAIDA/ZCBLE_PR_REM_SAIDA/test/integration/pages/Browser",
	"ZCBLE_PR_REM_SAIDA/ZCBLE_PR_REM_SAIDA/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "ZCBLE_PR_REM_SAIDA.ZCBLE_PR_REM_SAIDA.view."
	});

	sap.ui.require([
		"ZCBLE_PR_REM_SAIDA/ZCBLE_PR_REM_SAIDA/test/integration/WorklistJourney",
		"ZCBLE_PR_REM_SAIDA/ZCBLE_PR_REM_SAIDA/test/integration/ObjectJourney",
		"ZCBLE_PR_REM_SAIDA/ZCBLE_PR_REM_SAIDA/test/integration/NavigationJourney",
		"ZCBLE_PR_REM_SAIDA/ZCBLE_PR_REM_SAIDA/test/integration/NotFoundJourney",
		"ZCBLE_PR_REM_SAIDA/ZCBLE_PR_REM_SAIDA/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});