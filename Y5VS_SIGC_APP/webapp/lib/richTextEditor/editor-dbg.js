"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  return {
    /**
     * @function
     * @name initializeQuillEditor
     * @description - Se ejecuta despuÃ©s de que se renderizo la vista.
     *
     * @public
     * @param {object} context - Vista que se esta renderizando.
     * @param {HTMLDivElement} context.container - Vista que se esta renderizando.
     * @param {string} context.placeholder - Vista que se esta renderizando.
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    // @ts-ignore
    initializeQuillEditor: function initializeQuillEditor(_ref) {
      var container = _ref.container,
          placeholder = _ref.placeholder,
          setup = _ref.setup;
      // @ts-ignore
      return new tinymce.Editor("".concat(container.id), {
        plugins: ['advlist autolink lists link image charmap print preview anchor', 'searchreplace visualblocks code fullscreen', 'insertdatetime media table paste code help wordcount'],
        toolbar: 'undo redo | formatselect | ' + 'bold italic backcolor | alignleft aligncenter ' + 'alignright alignjustify | bullist numlist outdent indent | ' + 'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        placeholder: placeholder,
        setup: setup
      }, // @ts-ignore
      tinymce.EditorManager);
    },

    /**
     * @function
     * @name removeEditorManager
     * @description - Remove all tinymce instances.
     *
     * @public
     * @returns {void} Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    removeEditorManager: function removeEditorManager() {
      // @ts-ignore
      tinymce.EditorManager.remove();
    }
  };
});