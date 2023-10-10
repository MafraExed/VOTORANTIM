/* global QUnit*/

sap.ui.define([
	"sap/ui/test/Opa5",
	"workspace/zmonitor_picking/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"workspace/zmonitor_picking/test/integration/pages/Monitor",
	"workspace/zmonitor_picking/test/integration/navigationJourney"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "workspace.zmonitor_picking.view.",
		autoWait: true
	});
});