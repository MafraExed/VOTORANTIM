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
sap.ui.define(['com/innova/sigc/lib/formUtils/formUtils', 'com/innova/sigc/model/constant', 'com/innova/sigc/model/process/EntProvEvaluationCriteria', 'com/innova/sigc/model/process/EvaluationCriteria', 'com/innova/sigc/model/process/LevelEvaluationCriteria', 'com/innova/sigc/model/process/TypesEvaluationCriteria', 'com/innova/sigc/model/process/ValoracionEvaluationCriteria', 'com/innova/sigc/service/http', 'com/innova/sigc/utils/checkIfNumberBetween', 'com/innova/sigc/utils/getSelectedRowsContext', 'com/innova/sigc/utils/isEmpty', 'com/innova/sigc/utils/showToast', 'com/innova/sigc/utils/sumPropPesoValor', 'com/innova/vendor/lodash.filter', 'sap/ui/core/Fragment'],
/**
 * @class
 * @name Criteria.js
 * @description - Handler of the attachments for the process controller
 *JSONModel
 * @param {typeof sap.ui.core.Fragment} Fragment
 *
 * @returns {object}
 *
 * @author Edwin Valencia <evalencia@innovainternacional.biz>
 * @version 1.0.0
 */
function (formUtils, constant, EntProvEvaluationCriteria, EvaluationCriteria, LevelEvaluationCriteria, TypesEvaluationCriteria, ValoracionEvaluationCriteria, http, checkIfNumberBetween, getSelectedRowsContext, isEmpty, showToast, sumPropPesoValor, filter, Fragment) {
  return {
    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */

    /**
     * @function
     * @name onShowNewEvaluationCriteriaDialog
     * @description - Show new evaluation criteria dialog.
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onShowNewEvaluationCriteriaDialog: function onShowNewEvaluationCriteriaDialog(type) {
      var _this = this;

      this._validateTechnicalEvaluator({
        type: type
      }).then(this._getEvaluationCriteriaDialog.bind(this, {
        type: type
      })).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control;
        var oButton =
        /** @type {sap.m.Button} */
        oDialog.getBeginButton();

        var text = _this.getResourceBundle().getText('Commons.0005');

        oButton.setText(text);
        oButton.setTooltip(text);
        oButton.attachPress(_this._createEvaluationCriteria.bind(_this, {
          type: type
        }));
        _this._oNewEvaluationCriteriaDialog = oDialog;

        _this._oNewEvaluationCriteriaDialog.unbindElement();

        _this._oNewEvaluationCriteriaDialog.open();
      }).catch(this.errorHandler.bind(this));
    },

    /**
     * @function
     * @name onEditEvaluationCriteria
     * @description - Edit evaluation criteria.
     *
     * @public
     * @param {sap.ui.table.Row} oRow - Row selected
     * @param {string} type - Type of evaluation criteria
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onEditEvaluationCriteria: function onEditEvaluationCriteria(oRow, type) {
      var _this2 = this;

      var context = oRow.getBindingContext('processModel');
      var path = context.getPath();

      this._getEvaluationCriteriaDialog({
        type: type
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control;
        var oButton =
        /** @type {sap.m.Button} */
        oDialog.getBeginButton();

        var text = _this2.getResourceBundle().getText('Commons.0017');

        oButton.setText(text);
        oButton.setTooltip(text);
        oButton.attachPress(_this2._updateEvaluationCriteria.bind(_this2, {
          path: path,
          type: type
        }));
        _this2._oNewEvaluationCriteriaDialog = oDialog;

        _this2._oNewEvaluationCriteriaDialog.unbindElement();

        _this2._oNewEvaluationCriteriaDialog.bindElement({
          path: path,
          model: 'processModel'
        });

        _this2._oNewEvaluationCriteriaDialog.open();
      });
    },

    /**
     * @function
     * @name onDeleteEvaluationCriteria
     * @description - Delete evaluation criteria.
     *
     * @public
     * @param {sap.m.Button} button - Button selected
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onDeleteEvaluationCriteria: function onDeleteEvaluationCriteria(button) {
      var _this3 = this;

      Promise.resolve(this._oPage.setBusy(true)).then(this._getSelectedIndices.bind(this, button.getParent().getParent())).then(function (contexts) {
        _this3._deleteEvaluationCriteriaIds = contexts.map(function (context) {
          return context.getProperty('id');
        });
        return http.delete("".concat(constant.api.EVALUATION_CRITERIA_PATH), _this3._deleteEvaluationCriteriaIds);
      }).then(function () {
        _this3._deleteBindingRows({
          path: '/evaluationCriteria',
          ids: _this3._deleteEvaluationCriteriaIds
        });

        _this3._sumOfEvaluationCriteria(_this3._oFormModel.getProperty("/evaluationCriteria"));
      }).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /**
     * @function
     * @name onCreateEvaluationCriteriaForPrice
     * @description - Create evaluation criteria for price.
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onCreateEvaluationCriteriaForPrice: function onCreateEvaluationCriteriaForPrice() {
      var _this4 = this;

      var pesoValorInput =
      /** @type {sap.m.Input} */
      this.byId('pesoValorPrice');
      var pesoValor = pesoValorInput.getValue();
      Promise.resolve(this._oPage.setBusy(true)).then(function () {
        pesoValorInput.setValueState(sap.ui.core.ValueState.None);

        if (isEmpty(pesoValor)) {
          pesoValorInput.setValueState(sap.ui.core.ValueState.Error);
          throw new Error(_this4.getResourceBundle().getText('Commons.0027'));
        }
      }).then(function () {
        return new EvaluationCriteria({
          tipo: TypesEvaluationCriteria.C,
          criterio: constant.CRITERIA_PRICE_KEY,
          valoracion: ValoracionEvaluationCriteria.Y.key,
          pesoValor: pesoValor,
          user:
          /** @type {sap.m.Input} */
          _this4.byId('userPrice').getValue(),
          indCabPos: LevelEvaluationCriteria.P.key,
          entradaProveedor: EntProvEvaluationCriteria.B.key,
          processId: _this4._numProc
        });
      }).then(this._createOrUpdateEvaluationCriteriaForPrice.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /**
     * @function
     * @name onPesoValorChange
     * @description - Peso/valor change.
     *
     * @public
     * @param {sap.m.Input} input - Input selected
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onPesoValorChange: function onPesoValorChange(input) {
      try {
        var _this$_oNewEvaluation;

        var button =
        /** @type {sap.m.Button} */
        (_this$_oNewEvaluation = this._oNewEvaluationCriteriaDialog) === null || _this$_oNewEvaluation === void 0 ? void 0 : _this$_oNewEvaluation.getBeginButton();
        input.setValueState(sap.ui.core.ValueState.None);
        button.setEnabled(true);

        this._checkInputValuePesoValor({
          input: input,
          button: button
        });

        var sum = this._sumOfEvaluationCriteriaByType({
          input: input,
          button: button,
          type: this._oNewEvaluationCriteriaDialog.data('type')
        });

        this._isGreaterThan100({
          input: input,
          button: button,
          sum: sum
        });
      } catch (error) {
        this.errorHandler(error);
      }
    },

    /**
     * @function
     * @name onPesoChange
     * @description - Peso change.
     *
     * @public
     * @param {sap.m.Input} input - Input selected
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onPesoChange: function onPesoChange(input) {
      try {
        var button =
        /** @type {sap.m.Button} */
        this.byId('priceButton');
        input.setValueState(sap.ui.core.ValueState.None);
        button.setEnabled(true);

        this._checkInputValuePesoValor({
          input: input,
          button: button
        });

        var value = input.getValue();

        var commercialEvaluation = this._oFormModel.getProperty('/evaluationCriteria').filter(function (_ref) {
          var tipo = _ref.tipo,
              criterio = _ref.criterio;
          return tipo === LevelEvaluationCriteria.C.key && criterio !== constant.CRITERIA_PRICE_KEY;
        });

        var sum = commercialEvaluation === null || commercialEvaluation === void 0 ? void 0 : commercialEvaluation.reduce(sumPropPesoValor, parseFloat(value));

        this._isGreaterThan100({
          input: input,
          button: button,
          sum: sum
        });
      } catch (error) {
        this.errorHandler(error);
      }
    },

    /**
     * @function
     * @name onSendTechnicalInvitation
     * @description - Send technical invitation.
     *
     * @public
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onSendTechnicalInvitation: function onSendTechnicalInvitation() {
      this._oPage.setBusy(true);

      var oTable = this.byId('technicalCriteriaTable');
      getSelectedRowsContext(oTable, {
        i18n: this._i18n
      }).then(this._buildReqTechnicalInvitations.bind(this)).then(http.post.bind(http, "".concat(constant.api.PROCESS_PATH, "/").concat(this._numProc, "/technical-invitation"))).then(showToast.bind(showToast, this._i18n.getText('Commons.0021'))).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /**
     * @function
     * @name onValoracionChange
     * @description - Handle change of valoracion.
     *
     * @public
     * @param {sap.m.ComboBox} source - ComboBox selected
     * @returns {void}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onValoracionChange: function onValoracionChange(source) {
      var selectedKey = source.getSelectedKey();
      var oEntradaProveedorComboBox = this.byId('entradaProveedorComboBox');
      var oBinding = oEntradaProveedorComboBox.getBinding('items');

      if (selectedKey === ValoracionEvaluationCriteria.Y.key || selectedKey === ValoracionEvaluationCriteria.Z.key) {
        oBinding.filter([new sap.ui.model.Filter({
          path: 'key',
          operator: sap.ui.model.FilterOperator.EQ,
          value1: 'B'
        }, false), new sap.ui.model.Filter({
          path: 'key',
          operator: sap.ui.model.FilterOperator.EQ,
          value1: 'D'
        }, false)]);
      } else {
        oBinding.filter([]);
      }

      oEntradaProveedorComboBox.setEditable(!isEmpty(selectedKey));
      oEntradaProveedorComboBox.setSelectedKey();
    },

    /**
     * @function
     * @name onValoracionChange
     * @description - Handle change of valoracion.
     *
     * @public
     * @param oEvent
     * @returns {void}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    onChangeEvaluationRadioButton: function onChangeEvaluationRadioButton(oEvent) {
      var oSource = oEvent.getSource();
      Promise.resolve(this._oPage.setBusy(true)).then(http.update.bind(http, "".concat(constant.api.PROCESS_PATH, "/").concat(this._numProc), {
        evaluationMethod: oSource.getSelectedIndex()
      })).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /* =========================================================== */

    /* finish: event handlers                                      */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */

    /**
     * @function
     * @name _sumOfEvaluationCriteria
     * @description - Add evaluation criteria
     *
     * @private
     * @param {object[]} evaluationCriteria
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _sumOfEvaluationCriteria: function _sumOfEvaluationCriteria() {
      var evaluationCriteria = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var commercialEvaluation = filter(evaluationCriteria, {
        tipo: TypesEvaluationCriteria.C
      });
      var technicalEvaluation = filter(evaluationCriteria, {
        tipo: TypesEvaluationCriteria.T
      });
      var sumCommercialEval = commercialEvaluation === null || commercialEvaluation === void 0 ? void 0 : commercialEvaluation.reduce(sumPropPesoValor, 0);
      var sumTechEval = technicalEvaluation === null || technicalEvaluation === void 0 ? void 0 : technicalEvaluation.reduce(sumPropPesoValor, 0);

      this._oFormModel.setProperty('/sumTechEval', sumTechEval);

      this._oFormModel.setProperty('/sumCommercialEval', sumCommercialEval);

      return {
        sumCommercialEval: sumCommercialEval,
        sumTechEval: sumTechEval
      };
    },

    /**
     * @function
     * @name _buildEvaluationCriteria
     * @description - Build evaluation criteria
     *
     * @private
     * @param {object[]} evaluationCriteria
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildEvaluationCriteria: function _buildEvaluationCriteria() {
      var evaluationCriteria = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var index = evaluationCriteria.findIndex(function (criteria) {
        return criteria.criterio === constant.CRITERIA_PRICE_KEY && criteria.tipo === TypesEvaluationCriteria.C;
      });

      if (index !== -1) {
        var _price$pesoValor, _price$user;

        var price = evaluationCriteria[index];
        var priceButtonText = price ? this.getResourceBundle().getText('Commons.0017') : this.getResourceBundle().getText('Commons.0005');
        var pesoValor = (_price$pesoValor = price === null || price === void 0 ? void 0 : price.pesoValor) !== null && _price$pesoValor !== void 0 ? _price$pesoValor : '';
        var user = (_price$user = price === null || price === void 0 ? void 0 : price.user) !== null && _price$user !== void 0 ? _price$user : '';
        var input = this.byId('pesoValorPrice');
        input.setValue(pesoValor);
        input.setValueState(sap.ui.core.ValueState.None);
        this.byId('userPrice').setValue(user);
        var button = this.byId('priceButton');
        button.setText(priceButtonText);
        button.setTooltip(priceButtonText);
      }
    },

    /**
     * @function
     * @name _createEvaluationCriteria
     * @description - Create evaluation criteria.
     *
     * @private
     * @param {object} context
     * @param {string} context.type - Type of evaluation criteria
     * @returns {void} - Nothing to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _createEvaluationCriteria: function _createEvaluationCriteria(_ref2) {
      var _this5 = this;

      var type = _ref2.type;
      var form = this.byId('evaluationCriteriaForm');
      Promise.resolve(this._oNewEvaluationCriteriaDialog.setBusy(true)).then(this._isValidForm.bind(this, form)).then(formUtils.getFormData.bind(formUtils, form)).then(function (data) {
        return new EvaluationCriteria(_objectSpread(_objectSpread({}, data), {}, {
          tipo: TypesEvaluationCriteria[type],
          user: type === 'T' ? _this5._oFormModel.getProperty('/respTecnico') : '',
          processId: _this5._numProc
        }));
      }).then(http.post.bind(http, constant.api.EVALUATION_CRITERIA_PATH)).then(this._addEvaluationCriteriaModel.bind(this)).then(this._oNewEvaluationCriteriaDialog.close.bind(this._oNewEvaluationCriteriaDialog)).catch(this.errorHandler.bind(this)).finally(this._oNewEvaluationCriteriaDialog.setBusy.bind(this._oNewEvaluationCriteriaDialog, false));
    },

    /**
     * @function
     * @name _addEvaluationCriteriaModel
     * @description - Add evaluation criteria model.
     *
     * @private
     * @param {object} context
     * @param {object} context.data - Data to add
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _addEvaluationCriteriaModel: function _addEvaluationCriteriaModel(_ref3) {
      var data = _ref3.data;

      this._oFormModel.setProperty('/evaluationCriteria', [].concat(_toConsumableArray(this._oFormModel.getProperty('/evaluationCriteria')), [data]));

      this._sumOfEvaluationCriteria(this._oFormModel.getProperty("/evaluationCriteria"));

      showToast(this.getResourceBundle().getText('Commons.0021'));
    },

    /**
     * @function
     * @name _updateEvaluationCriteria
     * @description - Update evaluation criteria.
     *
     * @private
     * @param {object} context
     * @param {string} context.path - path of the binding
     * @param {string} context.type - Type of evaluation criteria
     * @returns {void} - Nothing to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _updateEvaluationCriteria: function _updateEvaluationCriteria(_ref4) {
      var path = _ref4.path,
          type = _ref4.type;
      var form = this.byId('evaluationCriteriaForm');

      var id = this._oFormModel.getProperty("".concat(path, "/id"));

      Promise.resolve(this._oNewEvaluationCriteriaDialog.setBusy(true)).then(this._isValidForm.bind(this, form)).then(formUtils.getFormData.bind(formUtils, form)).then(function (data) {
        return new EvaluationCriteria(_objectSpread({
          tipo: TypesEvaluationCriteria[type]
        }, data));
      }).then(http.update.bind(http, "".concat(constant.api.EVALUATION_CRITERIA_PATH, "/").concat(id))).then(this._updateEvaluationCriteriaModel.bind(this, path)).then(this._oNewEvaluationCriteriaDialog.close.bind(this._oNewEvaluationCriteriaDialog)).catch(this.errorHandler.bind(this)).finally(this._oNewEvaluationCriteriaDialog.setBusy.bind(this._oNewEvaluationCriteriaDialog, false));
    },

    /**
     * @function
     * @name _updateEvaluationCriteriaModel
     * @description - Update evaluation criteria model.
     *
     * @private
     * @param {string} path - path of the binding
     * @param {object} context
     * @param {string} context.data - Type of evaluation criteria
     * @returns {void} - Nothing to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _updateEvaluationCriteriaModel: function _updateEvaluationCriteriaModel(path, _ref5) {
      var _this$_oNewEvaluation2;

      var data = _ref5.data;

      this._oFormModel.setProperty("".concat(path), data);

      this._sumOfEvaluationCriteria(this._oFormModel.getProperty("/evaluationCriteria"));

      showToast(this.getResourceBundle().getText('Commons.0021'));
      (_this$_oNewEvaluation2 = this._oNewEvaluationCriteriaDialog) === null || _this$_oNewEvaluation2 === void 0 ? void 0 : _this$_oNewEvaluation2.close();
    },

    /**
     * @function
     * @name _getEvaluationCriteriaDialog
     * @description - Get evaluation criteria dialog.
     *
     * @private
     * @param {object} context
     * @param {string} context.type - Type of evaluation criteria
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _getEvaluationCriteriaDialog: function _getEvaluationCriteriaDialog(_ref6) {
      var _this6 = this;

      var type = _ref6.type;
      var view = this.getView();
      return Fragment.load({
        id: view.getId(),
        name: "com.innova.sigc.view.biddingProcess.dialog.criteria.NewEvaluationCriteria".concat(type),
        controller: this
      }).then(function (control) {
        var oDialog =
        /** @type {sap.m.Dialog} */
        control; // connect dialog to the root view of this component (models, lifecycle)

        view.addDependent(oDialog);
        oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
        oDialog.attachAfterClose(function () {
          _this6._oNewEvaluationCriteriaDialog = undefined;
          oDialog.destroy();
        });
        oDialog.data('type', type);
        return oDialog;
      });
    },

    /**
     * @function
     * @name _checkInputValuePesoValor
     * @description - Check input value peso/valor.
     *
     * @private
     * @param {object} context
     * @param {sap.m.Input} context.input - Input to check
     * @param {sap.m.Button} context.button - Button to enable/disable
     * @returns {void} - Nothing to return
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _checkInputValuePesoValor: function _checkInputValuePesoValor(_ref7) {
      var input = _ref7.input,
          button = _ref7.button;
      var value = input.getValue();
      var isBetween = checkIfNumberBetween(value, 0, 100);

      if (!isBetween) {
        button === null || button === void 0 ? void 0 : button.setEnabled(false);
        input.setValue(undefined);
        input.setValueState(sap.ui.core.ValueState.Error);
        throw new Error(this.getResourceBundle().getText('0092'));
      }
    },

    /**
     * @function
     * @name _sumOfEvaluationCriteriaByType
     * @description - Check sum of evaluation criteria.
     *
     * @private
     * @param {object} context
     * @param {sap.m.Input} context.input - Input to check
     * @param {string} context.type - Type of evaluation criteria
     * @returns {number}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _sumOfEvaluationCriteriaByType: function _sumOfEvaluationCriteriaByType(_ref8) {
      var _commercialEvaluation;

      var input = _ref8.input,
          type = _ref8.type;
      var value = input.getValue();
      var commercialEvaluation = filter(this._oFormModel.getProperty('/evaluationCriteria'), {
        tipo: TypesEvaluationCriteria["".concat(type)]
      });

      if (input.getBindingContext('processModel')) {
        commercialEvaluation = commercialEvaluation.filter(function (_ref9) {
          var id = _ref9.id;
          return id !== input.getBindingContext('processModel').getProperty('id');
        });
      }

      return (_commercialEvaluation = commercialEvaluation) === null || _commercialEvaluation === void 0 ? void 0 : _commercialEvaluation.reduce(sumPropPesoValor, parseFloat(value));
    },

    /**
     * @function
     * @name _isGreaterThan100
     * @description - Sum is greater than 100.
     *
     * @private
     * @param {object} context
     * @param {number} context.sum - Sum of evaluation criteria
     * @param {sap.m.Button} context.button - Button to enable/disable
     * @param {sap.m.Input} context.input - Input to check
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _isGreaterThan100: function _isGreaterThan100(_ref10) {
      var sum = _ref10.sum,
          button = _ref10.button,
          input = _ref10.input;

      if (sum > 100) {
        button.setEnabled(false);
        input.setValue(undefined);
        input.setValueState(sap.ui.core.ValueState.Error);
        throw new Error(this.getResourceBundle().getText('0093'));
      }
    },

    /**
     * @function
     * @name _createOrUpdateEvaluationCriteriaForPrice
     * @description - Create or update evaluation criteria for price.
     *
     * @private
     * @param {object} data - Data to create or update
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _createOrUpdateEvaluationCriteriaForPrice: function _createOrUpdateEvaluationCriteriaForPrice(data) {
      var evaluationCriteria = this._oFormModel.getProperty('/evaluationCriteria');

      var priceIndex = evaluationCriteria.findIndex(function (el) {
        return el.criterio === constant.CRITERIA_PRICE_KEY && el.tipo === TypesEvaluationCriteria.C;
      });

      if (priceIndex !== -1) {
        var id = evaluationCriteria[priceIndex].id;
        return http.update("".concat(constant.api.EVALUATION_CRITERIA_PATH, "/").concat(id), data).then(this._updateEvaluationCriteriaModel.bind(this, "/evaluationCriteria/".concat(priceIndex)));
      }

      var priceButton = this.byId('priceButton');
      return http.post(constant.api.EVALUATION_CRITERIA_PATH, data).then(this._addEvaluationCriteriaModel.bind(this)).then(priceButton.setText.bind(priceButton, this.getResourceBundle().getText('Commons.0017')));
    },

    /**
     * @function
     * @name _loadItemsUser
     * @description - Load items for technical evaluator.
     *
     * @private
     * @returns {Promise} - Returns a promise.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _loadItemsUser: function _loadItemsUser() {
      var _this7 = this;

      return http.get(constant.api.EVALUATORS_PATH).then(function (_ref11) {
        var data = _ref11.data;

        _this7._oFormModel.setProperty('/valueHelp/respTecnico', data.filter(function (_ref12) {
          var role = _ref12.role,
              status = _ref12.status;
          return role.includes('TECHNICAL_EVALUATOR') && status === 'Verified';
        }));
      });
    },

    /**
     * @function
     * @name _buildReqTechnicalInvitations
     * @description - Build request for technical invitations.
     *
     * @private
     * @param {object[]} selectedRowsContext - Selected rows context
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildReqTechnicalInvitations: function _buildReqTechnicalInvitations(selectedRowsContext) {
      var users = selectedRowsContext.filter(function (_ref13) {
        var object = _ref13.object;
        return !isEmpty(object.user);
      }).map(function (_ref14) {
        var object = _ref14.object;
        return object.user;
      });

      if (isEmpty(users)) {
        throw new Error(this._i18n.getText('Commons.0037'));
      }

      return {
        users_id: users
      };
    },

    /**
     * @function
     * @name _validateTechnicalEvaluator
     * @description - Build request for technical invitations.
     *
     * @private
     * @param {object} context
     * @param {string} context.type - Type of evaluation criteria
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _validateTechnicalEvaluator: function _validateTechnicalEvaluator(_ref15) {
      var type = _ref15.type;

      if (type === 'T' && isEmpty(this._oFormModel.getProperty('/respTecnico'))) {
        return Promise.reject(new Error(this._i18n.getText('0373')));
      }

      return Promise.resolve();
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  };
});