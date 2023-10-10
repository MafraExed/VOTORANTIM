"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sigc/model/constant', 'com/innova/sigc/service/http', 'com/innova/sigc/lib/formUtils/formUtils', 'sap/ui/core/Fragment', 'sap/ui/model/json/JSONModel', 'sap/ui/model/Filter', 'sap/ui/model/FilterOperator'],
/**
 * Module dependencies
 *
 * @param {typeof sap.ui.core.Fragment} Fragment
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
 */
function (constant, http, formUtils, Fragment, JSONModel, Filter, FilterOperator) {
  var fetch = {
    tipoProc: function tipoProc() {
      return http.get("".concat(constant.api.PROCESS_TYPE_PATH)).then(function (_ref) {
        var data = _ref.data;
        return data;
      });
    },
    catProc: function catProc() {
      return http.get("".concat(constant.api.PROCESS_CATEGORY_PATH)).then(function (_ref2) {
        var data = _ref2.data;
        return data;
      }).then(function (data) {
        return data.map(function (item) {
          var _item$catDescription$;

          return {
            id: item.id,
            description: item === null || item === void 0 ? void 0 : (_item$catDescription$ = item.catDescription[0]) === null || _item$catDescription$ === void 0 ? void 0 : _item$catDescription$.description
          };
        });
      });
    },
    vendors: function vendors() {
      return http.get("".concat(constant.api.VENDORS_PATH)).then(function (_ref3) {
        var data = _ref3.data;
        return data;
      }).then(function (data) {
        return data.map(function (item) {
          return {
            id: item.lifnr,
            description: item.lifnr
          };
        });
      });
    }
  };
  var selectValues = {
    MultiInput: function MultiInput(data, _ref4) {
      var control = _ref4.control,
          key = _ref4.key;
      return data.map(function (item) {
        return _objectSpread(_objectSpread({}, item), {}, {
          selected: control.getTokens().some(function (token) {
            return token.getKey() === item[key];
          })
        });
      });
    },
    Input: function Input(data, _ref5) {
      var control = _ref5.control,
          key = _ref5.key;
      data.map(function (item) {
        return _objectSpread(_objectSpread({}, item), {}, {
          selected: item[key] === control.getValue()
        });
      });
    }
  };
  var valueHelpEx = {
    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */

    /**
     * @function
     * @name onValueHelpRequest
     * @description - Se encarga de realizar la busqueda de su respectiva ayuda
     *
     * @public
     * @param {sap.ui.base.Event} oEvent An Event object consisting of an id, a source and a map of parameters.
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onValueHelpRequest: function onValueHelpRequest(oEvent) {
      var oSource =
      /** @type {sap.m.Input| sap.m.MultiInput} */
      oEvent.getSource();
      var sName = oSource.getName();
      this._oControlSHelp = oSource;
      Promise.resolve(oSource.setBusy(true)).then(fetch["".concat(sName)].bind(this)).then(valueHelpEx._configDialogProps.bind(this)).then(valueHelpEx._showDialog.bind(this)).catch(this.errorHandler.bind(this)).finally(oSource.setBusy.bind(oSource, false));
    },

    /**
     * @function
     * @name onConfirmSelectedOption
     * @description - Confirmar la selecciÃ³n de la tabla
     *
     * @public
     * @returns {void} - No retona nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onConfirmSelectedOption: function onConfirmSelectedOption(oEvent) {
      try {
        // const dynamicSHTable = this.byId('externalSelectDialog')
        var arraySelected = oEvent.getParameter('selectedContexts');
        var aSelectedItems = [];
        arraySelected.forEach(function (element) {
          aSelectedItems.push(element.getObject());
        });
        formUtils.setMultiInputDataVendor({
          field: this._oControlSHelp,
          data: aSelectedItems
        });
      } catch (error) {
        this.errorHandler(error);
      }
    },

    /* =========================================================== */

    /* finish: event handlers                                      */

    /* =========================================================== */
    _selectValues: function _selectValues(_ref6) {
      var data = _ref6.data,
          control = _ref6.control;
      var typeOf = control.getMetadata().getName();
      return selectValues["".concat(typeOf.split('.').pop())](data, {
        control: control,
        key: 'description'
      });
    },
    _configDialogProps: function _configDialogProps(data) {
      /*  // toggle compact style
      syncStyleClass('sapUiSizeCompact', this.getView(), oDialog) */
      return new JSONModel({
        data: valueHelpEx._selectValues({
          data: data,
          control: this._oControlSHelp
        }),
        props: {
          multiSelect: !!this._oControlSHelp.data('multi') // Multi-select if required

        }
      });
    },
    _showDialog: function _showDialog(oModel) {
      var _this = this;

      if (!this._oValueHelpExDialog) {
        this._oValueHelpExDialog = Fragment.load({
          id: this.getView().getId(),
          name: 'com.innova.sigc.view.searchHelp.ExternalSearchHelpDialog',
          controller: this
        }).then(function (control) {
          var oDialog =
          /** @type {sap.m.Dialog} */
          control; // connect dialog to the root view of this component (models, lifecycle)

          _this.getView().addDependent(oDialog);

          oDialog.addStyleClass(_this.getOwnerComponent().getContentDensityClass());
          return oDialog;
        });
      }

      this._oValueHelpExDialog.then(function (oDialog) {
        oDialog.setModel(oModel); // clear the old search filter

        oDialog.getBinding('items').filter([]);
        oDialog.open();
      });
    },

    /**
     * @function
     * @name onSearch
     * @description - se encarga del filtro la lista del dialogo.
     *
     * @public
     * @returns {void} - No retona nada.
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    onSearch: function onSearch(oEvent) {
      var oSource = oEvent.getSource();
      var sQuery = oEvent.getParameter('value');
      var aFilter = [];

      if (sQuery && sQuery.length > 0) {
        aFilter.push(new Filter('description', "".concat(FilterOperator.Contains.toString()), sQuery));
      }

      var oBinding = oSource.getBinding('items');

      if (aFilter.length !== 0) {
        oBinding.filter(new Filter(aFilter, false));
      } else {
        oBinding.filter([]);
      }
    }
  };
  return valueHelpEx;
});