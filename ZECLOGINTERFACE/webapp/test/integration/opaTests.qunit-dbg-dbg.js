/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ec/log/integrations/ECLogIntegrations/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});