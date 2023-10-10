/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"y5les_termo/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
