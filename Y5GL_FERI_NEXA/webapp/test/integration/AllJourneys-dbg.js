// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 ZET_GLHR_PERIODOS in the list

sap.ui.define([
	"sap/ui/test/Opa5",
	"./arrangements/Startup",
	"./arrangements/FLP",
	"./MasterJourney",
	"./NavigationJourney",
	"./NotFoundJourney",
	"./FLPIntegrationJourney"
], function (Opa5, Startup, FLP) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new FLP(),
		assertions: new FLP(),
		viewNamespace: "Y5GL_FERI_NEXA.Y5GL_FERI_NEXA.view.",
		autoWait: true
	});
});
