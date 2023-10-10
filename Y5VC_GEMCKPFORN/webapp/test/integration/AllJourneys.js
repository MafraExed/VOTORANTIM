/* global QUnit*/

sap.ui.define([
	"sap/ui/test/Opa5",
	"Workspace/zcockpit_fornecedor/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"Workspace/zcockpit_fornecedor/test/integration/pages/S0",
	"Workspace/zcockpit_fornecedor/test/integration/navigationJourney"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "Workspace.zcockpit_fornecedor.view.",
		autoWait: true
	});
});