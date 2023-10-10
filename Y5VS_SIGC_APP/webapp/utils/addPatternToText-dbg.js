"use strict";

sap.ui.define([], function () {
  return (
    /**
     * @function
     * @name addPatternToText
     * @description - Retorna el texto mÃ¡s el patrÃ³n (*) al principio y/o final
     *  si el tamaÃ±o del mismo lo permite.
     *
     * @public
     * @param {string} text Texto a cocatenar con *.
     * @param {int} maxLength Maximo tamaÃ±o del texto que puede tener.
     * @returns {string} texto concatenado.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    function (text, maxLength) {
      if (text.length < maxLength && text.length + 2 <= maxLength) {
        return ['*', text, '*'].join('');
      }

      if (text.length < maxLength && text.length + 1 === maxLength) {
        return [text, '*'].join('');
      }

      return text;
    }
  );
});