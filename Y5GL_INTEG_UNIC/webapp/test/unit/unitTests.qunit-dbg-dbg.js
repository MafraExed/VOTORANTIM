/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"votorantim/Y5GL_INTEGRACAO_UNICO/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});