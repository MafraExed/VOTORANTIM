"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sigc/lib/richTextEditor/editor', 'com/innova/sigc/model/constant', 'com/innova/sigc/service/http', 'com/innova/sigc/utils/isEmpty', 'sap/base/util/deepExtend', 'sap/m/MessageBox', 'sap/ui/core/Fragment'],
/**
 * @class
 * @name ProcessTypeTexts.js
 * @description - Handler of process type texts for the settings controller
 *
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
 * @param {typeof sap.ui.core.Fragment} Fragment
 * @param {object} constant
  *
 * @returns {object}
 *
 * @author Edwin Valencia <evalencia@innovainternacional.biz>
 * @version 1.0.0
 */
function (editor, constant, http, isEmpty, deepExtend, MessageBox, Fragment) {
  return {
    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */
    onAddNewProcessTypeTextRecord: function onAddNewProcessTypeTextRecord() {
      this.getView().getModel('Settings').setProperty('/IsCreateProcessTypeTask', true);
      this.bUpdateCategory = false;
      this.handleOpenProcessTypeTextDialog();
    },
    onProcessTextTypeDeletePress: function onProcessTextTypeDeletePress() {
      var _this$byId$getSelecte = this.byId('processTypeTextsTable').getSelectedIndices(),
          _this$byId$getSelecte2 = _slicedToArray(_this$byId$getSelecte, 1),
          index = _this$byId$getSelecte2[0];

      if (isEmpty(index)) {
        MessageBox.error(this.getResourceBundle().getText('Commons.0022'));
        return;
      }

      var context = this.byId('processTypeTextsTable').getContextByIndex(index);
      var oSelectedObject = context.getObject();

      this._openDeleteRecordDialog(oSelectedObject.id, constant.api.PROCESS_TEXT_TYPE, false, this.formProcessTextTypePayload(oSelectedObject));
    },
    onProcessTextTypeEditPress: function onProcessTextTypeEditPress() {
      var _this$byId$getSelecte3 = this.byId('processTypeTextsTable').getSelectedIndices(),
          _this$byId$getSelecte4 = _slicedToArray(_this$byId$getSelecte3, 1),
          index = _this$byId$getSelecte4[0];

      if (isEmpty(index)) {
        MessageBox.error(this.getResourceBundle().getText('Commons.0022'));
        return;
      }

      var context = this.byId('processTypeTextsTable').getContextByIndex(index);
      var oSelectedObject = context.getObject();
      this.getView().getModel('Settings').setProperty('/IsCreateProcessTypeTask', false);
      this.bUpdateCategory = true;
      this.getView().getModel('Settings').setProperty('/createprocesstypetext', oSelectedObject);
      this.handleOpenProcessTypeTextDialog(oSelectedObject);
    },
    handleOpenProcessTypeTextDialog: function handleOpenProcessTypeTextDialog(oSelectedProcessTypeText) {
      var _this = this;

      var that = this;
      this._oProcesssTypeTextDialog = Fragment.load({
        id: this.getView().getId(),
        name: 'com.innova.sigc.view.settings.fragment.CreateProcessTypeTexts',
        controller: this
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control; // connect dialog to the root view of this component (models, lifecycle)

        _this.getView().addDependent(oDialog);

        oDialog.addStyleClass(_this.getOwnerComponent().getContentDensityClass());
        oDialog.setModel(_this.getView().getModel('Settings'), 'Settings');

        if (!oSelectedProcessTypeText) {
          _this.getView().getModel('Settings').setProperty('/createprocesstypetext', {
            tipoDoc: '',
            textType: '',
            processType: {
              id: undefined
            },
            language: _this.getModel('main').getProperty('/currentLanguage'),
            content: ''
          });
        }

        oDialog.setModel(_this.getView().getModel('i18n'), 'i18n');
        return oDialog;
      });

      this._oProcesssTypeTextDialog.then(function (oDialog) {
        editor.removeEditorManager();
        oDialog.setBusy(true); // Initialize editor oferentes

        setTimeout(function () {
          _this._oTextTypeProcessEditor = editor.initializeQuillEditor.call(that, {
            container: _this.byId('editorTextTypeProcess').getDomRef(),
            placeholder: that.getResourceBundle().getText('0080'),
            setup: function setup(edtr) {
              edtr.on('init', function () {
                edtr.setContent(_this.getView().getModel('Settings').getProperty('/createprocesstypetext/content'));
                oDialog.setBusy(false);
              });
            }
          });

          _this._oTextTypeProcessEditor.render();

          oDialog.attachAfterClose(oDialog.destroy.bind(oDialog));
        }, 0);
        oDialog.open();
      });
    },
    onCreateProcessTypeTextPress: function onCreateProcessTypeTextPress() {
      var _this2 = this;

      var oSelectedRecord = deepExtend({}, this.getView().getModel('Settings').getProperty('/createprocesstypetext'));
      var oPayload = this.formProcessTextTypePayload(oSelectedRecord);

      if (this.bUpdateCategory) {
        this.handleSaveorUpdate(oPayload, 'PUT', "".concat(constant.api.PROCESS_TEXT_TYPE)).then(function () {
          MessageBox.success(_this2.getResourceBundle().getText('0232'));
        }).then(this.getProcessTypeTexts.bind(this)).catch(this.errorHandler.bind(this));
      } else {
        this.handleSaveorUpdate(oPayload, '', constant.api.PROCESS_TEXT_TYPE).then(function () {
          MessageBox.success(_this2.getResourceBundle().getText('0233'));
        }).then(this.getProcessTypeTexts.bind(this)).catch(this.errorHandler.bind(this));
      }

      this.handleCloseProcessTypeTextDialog();
    },
    formProcessTextTypePayload: function formProcessTextTypePayload(oRecord) {
      var _oRecord$processType;

      return _objectSpread({
        tipoDoc: oRecord.tipoDoc,
        textType: oRecord.textType,
        processTypeId: oRecord.processTypeId || ((_oRecord$processType = oRecord.processType) === null || _oRecord$processType === void 0 ? void 0 : _oRecord$processType.id),
        language: oRecord.language || this.getModel('main').getProperty('/currentLanguage')
      }, this._oTextTypeProcessEditor && {
        content: this._oTextTypeProcessEditor.getContent()
      });
    },
    handleCloseProcessTypeTextDialog: function handleCloseProcessTypeTextDialog() {
      this._oProcesssTypeTextDialog.then(function (oDialog) {
        oDialog.close();
      });
    },

    /* =========================================================== */

    /* finish: event handlers                                      */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */
    getProcessTypeTexts: function getProcessTypeTexts() {
      var sLanguage = this.getModel('main').getProperty('/currentLanguage');
      return http.get("".concat(constant.api.PROCESS_TEXT_TYPE, "/all?language=").concat(sLanguage)).then(this._handleResponseData.bind(this));
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  };
});