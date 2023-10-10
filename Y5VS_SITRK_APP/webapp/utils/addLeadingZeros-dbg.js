"use strict";

sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name addLeadingZeros
     * @description - Add leading zeros to a number
     * @public
     * @param {number} num - Number to add leading zeros
     * @param {int} maxLength - Max length of the number
     * @returns {string} - Number with leading zeros
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    function (num, maxLength) {
      return String(num).padStart(maxLength, '0');
    }
  );
});