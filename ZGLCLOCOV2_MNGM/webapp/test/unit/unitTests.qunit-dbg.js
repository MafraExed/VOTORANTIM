/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"votorantimcorp/cloco-v2-plan_management/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
