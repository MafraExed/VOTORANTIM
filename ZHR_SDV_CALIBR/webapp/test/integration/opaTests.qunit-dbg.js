/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"cba/hr/sdvCalibracaoSF/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});