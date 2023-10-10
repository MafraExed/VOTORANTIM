/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ZFI_VCDC_CARGO_BONIFIC/ZFI_VCDC_CARGO_BONIFIC/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});