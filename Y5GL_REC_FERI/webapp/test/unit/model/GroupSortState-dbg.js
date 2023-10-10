/*global QUnit*/

sap.ui.define([
	"Y5GL_REC_FERI/Y5GL_REC_FERI/model/GroupSortState",
	"sap/ui/model/json/JSONModel"
], function (GroupSortState, JSONModel) {
	"use strict";

	QUnit.module("GroupSortState - grouping and sorting", {
		beforeEach: function () {
			this.oModel = new JSONModel({});
			// System under test
			this.oGroupSortState = new GroupSortState(this.oModel, function() {});
		}
	});

	QUnit.test("Should always return a sorter when sorting", function (assert) {
		// Act + Assert
		assert.strictEqual(this.oGroupSortState.sort("Index").length, 1, "The sorting by Index returned a sorter");
		assert.strictEqual(this.oGroupSortState.sort("Nome").length, 1, "The sorting by Nome returned a sorter");
	});

	QUnit.test("Should return a grouper when grouping", function (assert) {
		// Act + Assert
		assert.strictEqual(this.oGroupSortState.group("Index").length, 1, "The group by Index returned a sorter");
		assert.strictEqual(this.oGroupSortState.group("None").length, 0, "The sorting by None returned no sorter");
	});


	QUnit.test("Should set the sorting to Index if the user groupes by Index", function (assert) {
		// Act + Assert
		this.oGroupSortState.group("Index");
		assert.strictEqual(this.oModel.getProperty("/sortBy"), "Index", "The sorting is the same as the grouping");
	});

	QUnit.test("Should set the grouping to None if the user sorts by Nome and there was a grouping before", function (assert) {
		// Arrange
		this.oModel.setProperty("/groupBy", "Index");

		this.oGroupSortState.sort("Nome");

		// Assert
		assert.strictEqual(this.oModel.getProperty("/groupBy"), "None", "The grouping got reset");
	});
});