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
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sigc/lib/formUtils/formUtils', 'com/innova/sigc/model/constant', 'com/innova/sigc/model/process/Position', 'com/innova/sigc/service/http', 'com/innova/sigc/service/petitions', 'com/innova/sigc/utils/callPromisesInSequence', 'com/innova/sigc/utils/isEmpty', 'com/innova/sigc/utils/showToast', 'sap/ui/core/Fragment'],
/**
 * @class
 * @name Positions.js
 * @description - Handler of the positions for the process controller
 *
 * @param {object} constant
 * @param {object} http
 * @param {typeof sap.ui.core.Fragment} Fragment
 *
 * @returns {object}
 *
 * @author Edwin Valencia <evalencia@innovainternacional.biz>
 * @version 1.0.0
 */
function (formUtils, constant, Position, http, petitions, callPromisesInSequence, isEmpty, showToast, Fragment) {
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
     * @version 1.0.0
     */
    onShowNewPositionDialog: function onShowNewPositionDialog() {
      var _this = this;

      this._getPositionDialog().then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control;
        var oButton =
        /** @type {sap.m.Button} */
        oDialog.getBeginButton();

        var text = _this.getResourceBundle().getText('Commons.0005');

        oButton.setText(text);
        oButton.setTooltip(text);
        oButton.attachPress(_this.onNewPosition.bind(_this));
        _this._oNewPositionDialog = oDialog;

        _this._oNewPositionDialog.unbindElement();

        _this._oNewPositionDialog.open();
      }).catch(this.errorHandler.bind(this));
    },

    /**
     * @function
     * @name onShowEditPositionDialog
     * @description - Show edit position dialog.
     *
     * @public
     * @param {sap.ui.table.Row} oRow - Row selected
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onShowEditPositionDialog: function onShowEditPositionDialog(oRow) {
      var _this2 = this;

      var context = oRow.getBindingContext('processModel');
      var path = context.getPath();

      this._getPositionDialog().then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control;
        var oButton =
        /** @type {sap.m.Button} */
        oDialog.getBeginButton();

        var text = _this2.getResourceBundle().getText('Commons.0017');

        oButton.setText(text);
        oButton.setTooltip(text);
        oButton.attachPress(_this2.onUpdatePosition.bind(_this2, {
          path: path
        }));
        _this2._oNewPositionDialog = oDialog;

        _this2._oNewPositionDialog.unbindElement();

        _this2._oNewPositionDialog.bindElement({
          path: path,
          model: 'processModel'
        });

        _this2._oNewPositionDialog.open();

        _this2._oNewPositionDialog.open();
      }).catch(this.errorHandler.bind(this));
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
     * @version 1.0.0
     */
    onNewPosition: function onNewPosition() {
      var _this3 = this;

      var form = this.byId('newPositionForm');
      Promise.resolve(this._oNewPositionDialog.setBusy(true)).then(this._isValidForm.bind(this, form)).then(formUtils.getFormData.bind(formUtils, form)).then(function (data) {
        return new Position(_objectSpread(_objectSpread({}, data), {}, {
          posProc: _this3._generatePositionId(),
          processId: _this3._numProc
        }));
      }).then(http.post.bind(http, constant.api.PROCESS_POSITION_PATH)).then(function (_ref) {
        var data = _ref.data;

        _this3._oFormModel.setProperty('/positions', [].concat(_toConsumableArray(_this3._oFormModel.getProperty('/positions')), [data]));

        showToast(_this3._i18n.getText('Commons.0021'));
      }).then(this._oNewPositionDialog.close.bind(this._oNewPositionDialog)).catch(this.errorHandler.bind(this)).finally(this._oNewPositionDialog.setBusy.bind(this._oNewPositionDialog, false));
    },

    /**
     * @function
     * @name onUpdatePosition
     * @description - Update position.
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onUpdatePosition: function onUpdatePosition(_ref2) {
      var _this4 = this;

      var path = _ref2.path;
      var form = this.byId('newPositionForm');

      var id = this._oFormModel.getProperty("".concat(path, "/id"));

      Promise.resolve(this._oNewPositionDialog.setBusy(true)).then(this._isValidForm.bind(this, form)).then(formUtils.getFormData.bind(formUtils, form)).then(function (data) {
        return new Position(_objectSpread({}, data));
      }).then(http.update.bind(http, "".concat(constant.api.PROCESS_POSITION_PATH, "/").concat(id))).then(function (_ref3) {
        var data = _ref3.data;

        _this4._oFormModel.setProperty("".concat(path), data);

        showToast(_this4.getResourceBundle().getText('Commons.0021'));
      }).then(this._oNewPositionDialog.close.bind(this._oNewPositionDialog)).catch(this.errorHandler.bind(this)).finally(this._oNewPositionDialog.setBusy.bind(this._oNewPositionDialog, false));
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
     * @version 1.0.0
     */
    onDeletePosition: function onDeletePosition() {
      var _this5 = this;

      var table = this.byId('positionTable');
      Promise.resolve(this._oPage.setBusy(true)).then(this._getSelectedIndices.bind(this, table)).then(function (contexts) {
        _this5._deletePositionIds = contexts.map(function (context) {
          return context.getProperty('id');
        });
        return http.delete("".concat(constant.api.PROCESS_POSITION_PATH), _this5._deletePositionIds);
      }).then(function () {
        _this5._deleteBindingRows({
          path: '/positions',
          ids: _this5._deletePositionIds
        });

        table.clearSelection();
      }).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /**
     * @function
     * @name onChangeMatnr
     * @description - Handle change matnr.
     *
     * @public
     * @returns {Promise<void>}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    onChangeMatnr: function onChangeMatnr(oSource) {
      oSource.setValueState(sap.ui.core.ValueState.None);
      var oMaktx = this.byId('maktxPosition');
      oMaktx.setValue();
      var oMeins = this.byId('meinsPosition');
      oMeins.setValue();
      var oMatkl = this.byId('matklPosition');
      oMatkl.setValue();
      var oGrun = this.byId('grunPosition');
      oGrun.setValue();
      var oBest = this.byId('bestPosition');
      oBest.setValue();
      var oWerks = this.byId('werksPosition');
      oWerks.setValue();

      if (this._oSearchHelpContext) {
        // Texto breve del material
        oMaktx.setValue(this._oSearchHelpContext.FTEXT); // Centro

        var werks = this._oSearchHelpContext.FCODE2;
        oWerks.setValue(werks);
        oWerks.destroySuggestionItems().addSuggestionItem(new sap.ui.core.ListItem({
          key: werks,
          text: werks
        }));
        oWerks.setSelectedKey(werks); // UMB Position

        oMeins.setValue(this._oSearchHelpContext.FCODE5);
        oMeins.destroySuggestionItems().addSuggestionItem(new sap.ui.core.ListItem({
          key: this._oSearchHelpContext.FCODE5,
          text: this._oSearchHelpContext.FCODE5
        }));
        oMeins.setSelectedKey(this._oSearchHelpContext.FCODE5); // Grupo de artÃ­culos

        oMatkl.setValue(this._oSearchHelpContext.FCODE4);
        oMatkl.destroySuggestionItems().addSuggestionItem(new sap.ui.core.ListItem({
          key: this._oSearchHelpContext.FCODE4,
          text: this._oSearchHelpContext.FCODE4
        }));
        oMatkl.setSelectedKey(this._oSearchHelpContext.FCODE4);
        this._oSearchHelpContext = null;
        return petitions.post(constant.GET_LONGTEXT_PEDTEXT, {
          IP_MATNR: oSource.getValue().toUpperCase()
        }).then(function (_ref4) {
          var data = _ref4.data;
          var ET_TEXTO_LARGO = data.ET_TEXTO_LARGO,
              ET_TEXTO_PEDIDO = data.ET_TEXTO_PEDIDO;

          var oTextoLargo = formUtils._concatTextArray(ET_TEXTO_LARGO);

          var oTextoPedido = formUtils._concatTextArray(ET_TEXTO_PEDIDO);

          oGrun.setValue(oTextoLargo);
          oBest.setValue(oTextoPedido);
          oWerks.fireChangeEvent(werks);
        });
      }

      return Promise.resolve();
    },

    /**
     * @function
     * @name onChangeWerks
     * @description - Handle change werks.
     *
     * @public
     * @param {sap.m.Input} oSource - Werks input.
     * @returns {void}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    onChangeWerks: function onChangeWerks(oSource) {
      oSource.setValueState(sap.ui.core.ValueState.None);
      var oAdStreet = this.byId('adStreetPosition');
      oAdStreet.setValue().setDescription();

      if (this._oSearchHelpContext) {
        // Texto breve del material
        oAdStreet.setValue(this._oSearchHelpContext.FCODE2);
      }
    },

    /**
     * @function
     * @name onCopyPositions
     * @description - Show copy position dialog.
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onCopyPositions: function onCopyPositions() {
      var _this6 = this;

      try {
        var table = this.byId('positionTable');
        Promise.resolve(this._oPage.setBusy(true)).then(this._getSelectedIndices.bind(this, table)).then(this._buildRequestsToCopyPositions.bind(this)).then(callPromisesInSequence).then(function (res) {
          _this6._oFormModel.setProperty('/positions', _this6._oFormModel.getProperty('/positions').concat(res.map(function (d) {
            return d.data;
          })));

          showToast(_this6._i18n.getText('Commons.0021'));
          table.clearSelection();
        }).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
      } catch (error) {
        this.errorHandler(error);
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
     * @name _getPositionDialog
     * @description - Get position dialog.
     *
     * @private
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _getPositionDialog: function _getPositionDialog() {
      var oView = this.getView();
      return Fragment.load({
        id: oView.getId(),
        name: 'com.innova.sigc.view.biddingProcess.dialog.position.NewPosition',
        controller: this
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control; // connect dialog to the root view of this component (models, lifecycle)

        oView.addDependent(oDialog);
        oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
        oDialog.attachAfterClose(oDialog.destroy.bind(oDialog));
        return oDialog;
      });
    },

    /**
     * @function
     * @name _generatePositionId
     * @description - Generate position id.
     *
     * @private
     * @returns {number}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _generatePositionId: function _generatePositionId() {
      var ids = this._oFormModel.getProperty('/positions').map(function (_ref5) {
        var posProc = _ref5.posProc;
        return posProc;
      });

      return isEmpty(ids) ? 1 : Math.max.apply(Math, _toConsumableArray(ids)) + 1;
    },

    /**
     * @function
     * @name _buildRequestsToCopyPositions
     * @description - Build requests to copy positions.
     *
     * @private
     * @param {object[]} contexts - Positions contexts.
     * @returns {object[]}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildRequestsToCopyPositions: function _buildRequestsToCopyPositions(contexts) {
      var _this7 = this;

      var nextId = this._generatePositionId();

      return contexts.map(function (context) {
        var position = new Position(_objectSpread(_objectSpread({}, context.getObject()), {}, {
          posProc: nextId,
          processId: _this7._numProc
        }));
        nextId += 1;
        return position;
      }).map(function (position) {
        return http.post.bind(http, constant.api.PROCESS_POSITION_PATH, position);
      });
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  };
});