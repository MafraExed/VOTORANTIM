/* global QUnit*/

sap.ui.define([
	"sap/ui/test/Opa5",
	"workspace/zmonitor_entprog/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"workspace/zmonitor_entprog/test/integration/pages/EntregaProgramada",
	"workspace/zmonitor_entprog/test/integration/navigationJourney"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "workspace.zmonitor_entprog.view.",
		autoWait: true
	});
});