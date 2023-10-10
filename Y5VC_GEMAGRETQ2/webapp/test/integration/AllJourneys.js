/* global QUnit*/

sap.ui.define([
	"sap/ui/test/Opa5",
	"Workspace/zagrupador_v2/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"Workspace/zagrupador_v2/test/integration/pages/S0",
	"Workspace/zagrupador_v2/test/integration/navigationJourney"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "Workspace.zagrupador_v2.view.",
		autoWait: true
	});
});