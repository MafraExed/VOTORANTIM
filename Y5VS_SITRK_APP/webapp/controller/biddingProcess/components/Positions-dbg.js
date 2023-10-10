"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sitrack/lib/formUtils/formUtils', 'com/innova/sitrack/model/constant', 'com/innova/sitrack/model/purchaseTracking/Position', 'com/innova/sitrack/utils/isEmpty', 'com/innova/sitrack/utils/showToast', 'com/innova/service/http', 'sap/ui/core/Fragment'],
/**
 * @class
 * @name Positions.js
 * @description - Handler of the positions for the process controller
 *
 * @param {object} constant
 * @param {typeof sap.ui.core.Fragment} Fragment
 *
 * @returns {object}
 *
 * @author Edwin Valencia <evalencia@innovainternacional.biz>
 * @version 0.5.0
 */
function (formUtils, constant, Position, isEmpty, showToast, http, Fragment) {
  return {
    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */

    /**
     * @function
     * @name onShowNewPositionDialog
     * @description - Show new position dialog.
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    onShowNewPositionDialog: function onShowNewPositionDialog() {
      var _this = this;

      var oView = this.getView();
      Fragment.load({
        id: oView.getId(),
        name: 'com.innova.sitrack.view.purchaseTracking.dialog.position.NewPosition',
        controller: this
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control; // connect dialog to the root view of this component (models, lifecycle)

        oView.addDependent(oDialog);
        oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
        oDialog.attachAfterClose(oDialog.destroy.bind(oDialog));
        _this._oNewPositionDialog = oDialog;
        oDialog.open();
      });
    },

    /**
     * @function
     * @name onNewPosition
     * @description - Create new position.
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    onNewPosition: function onNewPosition() {
      var _this2 = this;

      var form = this.byId('newPositionForm');
      Promise.resolve(this._oNewPositionDialog.setBusy(true)).then(this._isValidForm.bind(this, form)).then(formUtils.getFormData.bind(formUtils, form)).then(function (data) {
        return new Position(_objectSpread(_objectSpread({}, data), {}, {
          posProc: _this2._generatePositionId(),
          processId: _this2._numProc
        }));
      }).then(http.post.bind(http, constant.api.PROCESS_POSITION_PATH)).then(function (_ref) {
        var data = _ref.data;

        _this2._oFormModel.setProperty('/positions', [].concat(_toConsumableArray(_this2._oFormModel.getProperty('/positions')), [data]));

        showToast('__Se han procesado los datos correctamente.');

        _this2._oNewPositionDialog.close();
      }).catch(this.errorHandler.bind(this)).finally(this._oNewPositionDialog.setBusy.bind(this._oNewPositionDialog, false));
    },

    /**
     * @function
     * @name onDeletePosition
     * @description - Delete position.
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    onDeletePosition: function onDeletePosition() {
      var _this3 = this;

      Promise.resolve(this._oPage.setBusy(true)).then(this._getSelectedIndices.bind(this, this.byId('positionTable'))).then(function (contexts) {
        _this3._deletePositionIds = contexts.map(function (context) {
          return context.getProperty('BANFN');
        });

        _this3._deleteBindingRowsPositions({
          path: '/processSelected',
          ids: _this3._deletePositionIds
        });

        _this3.byId('positionTable').clearSelection();
      }).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /**
     * @function
     * @name onChangeMatnr
     * @description - Se ejecuta para obtener el objeto del input y setearlo al input de texto.
     *
     * @public
     * @returns {void}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    onChangeMatnr: function onChangeMatnr(oEvent) {
      var oSource = oEvent.getSource();
      oSource.setDescription();
      var oMaktx = this.byId('maktxPosition');
      oMaktx.setDescription();

      if (this._oSearchHelpContext) {
        // Texto breve del material
        oMaktx.setValue(this._oSearchHelpContext.FTEXT); // UMB Position

        var oMeins = this.byId('meinsPosition');
        oMeins.setValue(this._oSearchHelpContext.FCODE5);
        oMeins.setValue(this._oSearchHelpContext.FCODE5);
        oMeins.destroySuggestionItems().addSuggestionItem(new sap.ui.core.ListItem({
          key: this._oSearchHelpContext.FCODE5,
          text: this._oSearchHelpContext.FCODE5
        }));
        oMeins.setSelectedKey(this._oSearchHelpContext.FCODE5); // Grupo de artÃ­culos

        var oMatkl = this.byId('matklPosition');
        oMatkl.setValue(this._oSearchHelpContext.FCODE4);
        oMatkl.destroySuggestionItems().addSuggestionItem(new sap.ui.core.ListItem({
          key: this._oSearchHelpContext.FCODE4,
          text: this._oSearchHelpContext.FCODE4
        }));
        oMatkl.setSelectedKey(this._oSearchHelpContext.FCODE4);
        this._oSearchHelpContext = null;
      }
    },

    /* =========================================================== */

    /* finish: event handlers                                      */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */

    /**
     * @function
     * @name _generatePositionId
     * @description - Generate position id.
     *
     * @private
     * @returns {number}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    _generatePositionId: function _generatePositionId() {
      var ids = this._oFormModel.getProperty('/positions').map(function (_ref2) {
        var posProc = _ref2.posProc;
        return posProc;
      });

      return isEmpty(ids) ? 1 : Math.max.apply(Math, _toConsumableArray(ids)) + 1;
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  };
});