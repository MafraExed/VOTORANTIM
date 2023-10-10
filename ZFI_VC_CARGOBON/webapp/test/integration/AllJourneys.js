sap.ui.define([
	"sap/ui/test/Opa5",
	"./arrangements/Startup",
	"./NavigationJourney"
], function (Opa5, Startup) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Startup(),
		viewNamespace: "ZFI_VCDC_CARGO_BONIFIC.ZFI_VCDC_CARGO_BONIFIC.view.",
		autoWait: true
	});
});