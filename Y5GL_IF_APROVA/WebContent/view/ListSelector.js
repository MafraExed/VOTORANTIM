sap.ui.define([
	"sap/ui/base/Object",
	"sap/m/GroupHeaderListItem"
], function (BaseObject, GroupHeaderListItem) {
	"use strict";
	return BaseObject.extend("vsa.y5gl_if_portal.view.ListSelector", {

		/**
		 * Provides a convenience API for selecting list items. All the functions will wait until the initial load of the a List passed to the instance by the setBoundMasterList
		 * function.
		 * @class
		 * @public
		 * @alias vsa.y5gl_fi_portal.controller.ListSelector
		 */

		constructor: function () {
			this._oWhenListHasBeenSet = new Promise(function (fnResolveListHasBeenSet) {
				this._fnResolveListHasBeenSet = fnResolveListHasBeenSet;
			}.bind(this));
			// This promise needs to be created in the constructor, since it is allowed to
			// invoke selectItem functions before calling setBoundMasterList
			this.oWhenListLoadingIsDone = new Promise(function (fnResolve, fnReject) {
				// Used to wait until the setBound masterList function is invoked
				this._oWhenListHasBeenSet
					.then(function (oList) {
						oList.getBinding("items").attachEventOnce("dataReceived",
							function (oData) {
								if (!oData.getParameter("data")) {
									fnReject({
										list: oList,
										error: true
									});
								}
								var oFirstListItem = this.getFirstListItem();
								if (oFirstListItem) {
									// Have to make sure that first list Item is selected
									// and a select event is triggered. Like that, the corresponding
									// detail page is loaded automatically
									fnResolve({
										list: oList,
										firstListitem: oFirstListItem
									});
								} else {
									// No items in the list
									fnReject({
										list: oList,
										error: false
									});
								}
							}.bind(this)
						);
					}.bind(this));
			}.bind(this));
		},

		/**
		 * A bound list should be passed in here. Should be done, before the list has received its initial data from the server.
		 * May only be invoked once per ListSelector instance.
		 * @param {sap.m.List} oList The list all the select functions will be invoked on.
		 * @public
		 */
		setBoundMasterList: function (oList) {
			this._oList = oList;
			this._fnResolveListHasBeenSet(oList);
		},

		/**
		 * Finds the first list item
		 * @return {sap.m.ListItem|null} The first item that is not a group header
		 * @public
		 */
		getFirstListItem: function () {
			var aItems = this._oList.getItems();

			for (var i = 0; i < aItems.length; i++) {
				if (!(aItems[i] instanceof GroupHeaderListItem)) {
					return aItems[i];
				}
			}
			return null;
		},

		/**
		 * Tries to select and scroll to a list item with a matching binding context. If there are no items matching the binding context or the ListMode is none,
		 * no selection/scrolling will happen
		 * @param {string} sBindingPath the binding path matching the binding path of a list item
		 * @public
		 */
		selectAListItem: function (sBindingPath) {

			this.oWhenListLoadingIsDone.then(
				function () {
					var oList = this._oList,
						oSelectedItem;

					if (oList.getMode() === "None") {
						return;
					}

					oSelectedItem = oList.getSelectedItem();

					// skip update if the current selection is already matching the object path
					if (oSelectedItem && oSelectedItem.getBindingContext().getPath() === sBindingPath) {
						return;
					}

					oList.getItems().some(function (oItem) {
						if (oItem.getBindingContext() && oItem.getBindingContext().getPath() === sBindingPath) {
							oList.setSelectedItem(oItem);
							return true;
						}
					});
				}.bind(this),
				function () {
					jQuery.sap.log.warning("Could not select the list item with the path" + sBindingPath +
						" because the list encountered an error or had no items");
				}
			);
		},

		/* =========================================================== */
		/* Convenience Functions for List Selection Change Event       */
		/* =========================================================== */

		/**
		 * Attaches a listener and listener function to the ListSelector's bound master list. By using
		 * a promise, the listener is added, even if the list is not available when 'attachListSelectionChange'
		 * is called.
		 * @param {function} fnFunction the function to be executed when the list fires a selection change event
		 * @param {function} oListener the listener object
		 * @return {vsa.y5gl_fi_portal.model.ListSelector} the list selector object for method chaining
		 * @public
		 */
		attachListSelectionChange: function (fnFunction, oListener) {
			this._oWhenListHasBeenSet.then(function () {
				this._oList.attachSelectionChange(fnFunction, oListener);
			}.bind(this));
			return this;
		},

		/**
		 * Detaches a listener and listener function from the ListSelector's bound master list. By using
		 * a promise, the listener is removed, even if the list is not available when 'detachListSelectionChange'
		 * is called.
		 * @param {function} fnFunction the function to be executed when the list fires a selection change event
		 * @param {function} oListener the listener object
		 * @return {vsa.y5gl_fi_portal.model.ListSelector} the list selector object for method chaining
		 * @public
		 */
		detachListSelectionChange: function (fnFunction, oListener) {
			this._oWhenListHasBeenSet.then(function () {
				this._oList.detachSelectionChange(fnFunction, oListener);
			}.bind(this));
			return this;
		},

		/**
		 * Removes all selections from master list.
		 * Does not trigger 'selectionChange' event on master list, though.
		 * @public
		 */
		clearMasterListSelection: function () {
			//use promise to make sure that 'this._oList' is available
			this._oWhenListHasBeenSet.then(function () {
				this._oList.removeSelections(true);
			}.bind(this));
		},

		refreshBindings: function () {
			this._oWhenListHasBeenSet.then(function () {
				debugger;
				this._oList.getBinding("items").refresh();
			}.bind(this));
		}

	});

});