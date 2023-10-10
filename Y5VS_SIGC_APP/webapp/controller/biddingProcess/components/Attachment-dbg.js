"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sigc/factory/attachment/attachment', 'com/innova/sigc/model/constant', 'com/innova/sigc/service/http', 'com/innova/sigc/utils/downloadFile'],
/**
 * @class
 * @name Attachment.js
 * @description - Handler of the attachments for the process controller
 *
 * @param {object} attachmentFactory - Attachment factory
 * @param {object} constant
 * @param {object} http
 * @param {object} downloadFile
 *
 * @returns {object}
 *
 * @author Edwin Valencia <evalencia@innovainternacional.biz>
 * @version 1.0.0
 */
function (attachmentFactory, constant, http, downloadFile) {
  return {
    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */

    /**
     * @function
     * @name onBeforeItemAdded
     * @description - Before item added to the list
     *
     * @public
     * @param {sap.ui.base.Event} event - An Event object consisting of an id, a source and a map of parameters.
     * @param {sap.m.upload.UploadSetItem} item - Item selected
     * @param {string} isPrivate - Item selected
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onBeforeItemAdded: function onBeforeItemAdded(event, item) {
      var _this = this;

      var isPrivate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      event.preventDefault();
      var source =
      /** @type {sap.m.upload.UploadSet} */
      event.getSource();
      var type = source.data('type');
      var formdata = new FormData();
      formdata.append('private', isPrivate);
      formdata.append('processId', this._numProc);
      formdata.append('files', item.getFileObject(), item.getFileName());
      formdata.append('type', type);
      Promise.resolve(this._oPage.setBusy(true)).then(http.post.bind(http, "".concat(constant.api.ATTACHMENTS_PATH), formdata)).then(function (_ref) {
        var data = _ref.data;

        _this._oFormModel.setProperty('/attachments', [].concat(_toConsumableArray(_this._oFormModel.getProperty('/attachments')), _toConsumableArray(data)));
      }).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /**
     * @function
     * @name onDownloadAttachment
     * @description - Download the attachment.
     *
     * @public
     * @param {sap.ui.base.Event} oEvent - An Event object consisting of an id, a source and a map of parameters.
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onDownloadAttachment: function onDownloadAttachment(oEvent) {
      oEvent.preventDefault();
      var item = oEvent.getParameter('item');
      var context = item.getBindingContext('processModel');
      var id = context.getProperty('id');
      Promise.resolve(this._oPage.setBusy(true)).then(this._fecthAttachments.bind(this, {
        context: context,
        id: id
      })).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /**
     * @function
     * @name onRemoveAttachment
     * @description - Remove the attachment.
     *
     * @public
     * @param {sap.ui.base.Event} oEvent - An Event object consisting of an id, a source and a map of parameters.
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onRemoveAttachment: function onRemoveAttachment(oEvent) {
      var _this2 = this;

      oEvent.preventDefault();
      var id =
      /** @type {sap.m.upload.UploadSetItem} */
      oEvent.getSource().getBindingContext('processModel').getProperty('id');
      Promise.resolve(this._oPage.setBusy(true)).then(http.delete.bind(http, "".concat(constant.api.ATTACHMENTS_PATH, "/").concat(id), {})).then(function () {
        _this2._deleteBindingRows({
          path: '/attachments',
          ids: [id]
        });
      }).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /* =========================================================== */

    /* finish: event handlers                                      */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */

    /**
     * @function
     * @name _resetAttachments
     * @description - Reset the attachments.
     *
     * @private
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _resetAttachments: function _resetAttachments() {
      this.byId('UploadSet1').unbindAggregation('items').bindAggregation('items', {
        path: 'processModel>/attachments',
        filters: [new sap.ui.model.Filter({
          path: 'private',
          operator: sap.ui.model.FilterOperator.NE,
          value1: 'X'
        }), new sap.ui.model.Filter({
          path: 'type',
          operator: sap.ui.model.FilterOperator.EQ,
          value1: 'ANEXO'
        })],
        templateShareable: false,
        factory: attachmentFactory.sharedUse.bind(this)
      });
      this.byId('UploadSet2').unbindAggregation('items').bindAggregation('items', {
        path: 'processModel>/attachments',
        filters: [new sap.ui.model.Filter({
          path: 'private',
          operator: sap.ui.model.FilterOperator.EQ,
          value1: 'X'
        }), new sap.ui.model.Filter({
          path: 'type',
          operator: sap.ui.model.FilterOperator.EQ,
          value1: 'ANEXO'
        })],
        templateShareable: false,
        factory: attachmentFactory.internalUse.bind(this)
      });
      this.byId('UploadSet3').unbindAggregation('items').bindAggregation('items', {
        path: 'processModel>/attachments',
        filters: [new sap.ui.model.Filter({
          path: 'type',
          operator: sap.ui.model.FilterOperator.EQ,
          value1: 'ADENDO'
        })],
        templateShareable: false,
        factory: attachmentFactory.internalUse.bind(this)
      });
    },

    /**
     * @function
     * @name _fecthAttachments
     * @description - Fetch the attachments.
     *
     * @private
     * @returns {Promise<void>}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _fecthAttachments: function _fecthAttachments(_ref2) {
      var context = _ref2.context,
          id = _ref2.id;
      return http.downloadAttachment({
        url: "".concat(constant.api.ATTACHMENTS_PATH, "/").concat(id)
      }).then(function (_ref3) {
        var data = _ref3.data;
        downloadFile({
          blob: data,
          filename: context.getProperty('originalname')
        });
      });
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  };
});