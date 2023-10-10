/*global QUnit*/

sap.ui.define([
	"cba/hr/sdvCalibracaoSF/controller/CalibrationSessions.controller"
], function (Controller) {
	"use strict";

	QUnit.module("CalibrationSessions Controller");

	QUnit.test("I should test the CalibrationSessions controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});