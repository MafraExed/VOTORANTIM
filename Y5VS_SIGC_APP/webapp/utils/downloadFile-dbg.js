"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/vendor/file-saver'], function (fileSaver) {
  return (
    /**
     * @function
     * @name downloadFile
     * @description - Build a URL by appending params to the end
     *
     * @private
     * @param {object} params - The params to be appended
     * @returns {promise} The formatted url
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0 - se crea la funciÃ³n.
     */
    function (_ref) {
      var blob = _ref.blob,
          _ref$filename = _ref.filename,
          filename = _ref$filename === void 0 ? '' : _ref$filename;
      return fileSaver.saveAs(blob, filename);
    }
  );
});