"use strict";

sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name getVisibleRowCount
     * @description - Get the number of visible rows in the table
     *
     * @public
     * @returns {number}
     *
     * @author Dev Dayal <UpWork>
     * @version 0.5.0
     */
    function (aList) {
      var nVisibleCount = 0;

      if (aList && aList.length <= 5) {
        nVisibleCount = aList.length;
      } else if (aList && aList.length > 5) {
        nVisibleCount = 5;
      } else {
        nVisibleCount = 0;
      }

      return nVisibleCount;
    }
  );
});