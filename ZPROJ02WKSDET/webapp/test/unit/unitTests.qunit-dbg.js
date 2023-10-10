/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"votorantim/project02wksdetail/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});