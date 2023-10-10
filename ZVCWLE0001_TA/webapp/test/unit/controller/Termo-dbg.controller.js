/*global QUnit*/

sap.ui.define([
	"y5les_termo/controller/Termo.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Termo Controller");

	QUnit.test("I should test the Termo controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
