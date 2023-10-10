/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"Y5VC_PAINEL_NE2/Y5VC_PAINEL_NE2/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});