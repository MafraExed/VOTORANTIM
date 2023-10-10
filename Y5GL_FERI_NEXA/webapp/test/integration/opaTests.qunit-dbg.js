/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"Y5GL_FERI_NEXA/Y5GL_FERI_NEXA/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
