/* global QUnit*/

sap.ui.define([
	"sap/ui/test/Opa5",
	"Workspace/zconferencia_etiquetas/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"Workspace/zconferencia_etiquetas/test/integration/pages/S0",
	"Workspace/zconferencia_etiquetas/test/integration/navigationJourney"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "Workspace.zconferencia_etiquetas.view.",
		autoWait: true
	});
});