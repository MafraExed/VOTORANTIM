"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['./lib/comboBox', './lib/dateRangeSelection', './lib/datePicker', './lib/input', './lib/multiComboBox', './lib/multiInput', './lib/stepInput', './lib/switch', './lib/vBox', './lib/textArea', 'com/innova/sigc/model/item/FormItem', 'com/innova/sigc/model/item/OptionType', 'com/innova/sigc/utils/isFloatNumber'], function (comboBox, dateRangeSelection, datePicker, input, multiComboBox, multiInput, stepInput, vSwitch, vBox, textArea, FormItem, OptionType, isFloatNumber) {
  var formUtils = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, comboBox), dateRangeSelection), datePicker), input), multiComboBox), multiInput), stepInput), vSwitch), vBox), textArea), {}, {
    /* =========================================================== */

    /* begin: handler methods                                      */

    /* =========================================================== */

    /**
     * @function
     * @name onLiveChangeTypeNumberP
     * @description - Valida los campos de tipo P.
     *
     * @public
     * @param {sap.ui.base.Event} oEvent An Event object consisting of an id, a source and a map of parameters
     * @returns {void} - No retona nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onLiveChangeTypeNumberP: function onLiveChangeTypeNumberP(oEvent) {
      var oInput =
      /** @type {sap.m.Input} */
      oEvent.getSource();
      var sValue = oEvent.getParameter('value');
      var bValidate = isFloatNumber(sValue);

      if (!bValidate) {
        oInput.setValue('').fireChange({
          value: ''
        });
      }
    },

    /* =========================================================== */

    /* finish: handler methods                                     */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: utils methods                                        */

    /* =========================================================== */

    /**
     * @function
     * @name validateForm
     * @description - Obtener datos de los campos
     *
     * @public
     * @param {object} context
     * @param {object[]} context.formContainers - FormContainers del formulario
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    validateForm: function validateForm(_ref) {
      var formContainers = _ref.formContainers;
      var bValid = true;
      formContainers.map(formUtils._mapFields).filter(formUtils._isRequiredField).forEach(function (field) {
        var _formUtils$strategy;

        var name = formUtils._getNameControl(field);

        var strategy = "is".concat(name, "Valid");
        var isValid = (_formUtils$strategy = formUtils[strategy]) === null || _formUtils$strategy === void 0 ? void 0 : _formUtils$strategy.call(formUtils, {
          field: field
        });

        if (!isValid) {
          field.setValueState('Error');
          bValid = false;
        } else {
          field.setValueState('None');
        }
      });
      return bValid;
    },

    /**
     * @function
     * @name getDataFromFields
     * @description - Obtener datos de los campos
     *
     * @public
     * @param {object} context
     * @param {object[]} context.formElements - FormElements del contenedor de formulario
     * @param {string} context.functionName - Nombre de la funciÃ³n para el backend
     * @param {string} context.group - Grupo al que pertenece el campo
     * @param {boolean} context.isVariant - Es variante
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    getDataFromFields: function getDataFromFields(_ref2) {
      var formElements = _ref2.formElements,
          functionName = _ref2.functionName,
          group = _ref2.group,
          isVariant = _ref2.isVariant;
      return formElements.reduce(function (accumulator, element) {
        var acc = JSON.parse(JSON.stringify(accumulator));

        var _element$getFields = element.getFields(),
            _element$getFields2 = _slicedToArray(_element$getFields, 1),
            field = _element$getFields2[0];

        var name = formUtils._getNameControl(field);

        var strategy = "get".concat(name, "Data");

        if (formUtils["".concat(strategy)]) {
          acc = _objectSpread(_objectSpread({}, acc), formUtils["".concat(strategy)]({
            field: field,
            functionName: functionName,
            group: group,
            isVariant: isVariant
          }));
        }

        return acc;
      }, {});
    },

    /**
     * @function
     * @name getFormData
     * @description - Get form data.
     *
     * @public
     * @param {sap.ui.layout.form.Form} form - Form to get data
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    getFormData: function getFormData(form) {
      return form.getFormContainers().reduce(function (acc, container) {
        var result = formUtils.getDataFromFields({
          formElements: container.getFormElements()
        });
        return _objectSpread(_objectSpread({}, acc), result);
      }, {});
    },

    /**
     * @function
     * @name getDataFromFormContainer
     * @description - Get data from form container.
     *
     * @public
     * @param {sap.ui.layout.form.FormContainer} formContainer - FormContainer to get data
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    getDataFromFormContainer: function getDataFromFormContainer(formContainer) {
      return formUtils.getDataFromFields({
        formElements: formContainer.getFormElements()
      });
    },

    /**
     * @function
     * @name setDataInFields
     * @description - Establecer los datos de los campos
     *
     * @public
     * @param {object} context
     * @param {object[]} context.formElements - FormElements del contenedor de formulario
     * @param {object} context.data - Datos
     * @returns {void} - No retorna nada
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    setDataInFields: function setDataInFields(_ref3) {
      var formElements = _ref3.formElements,
          data = _ref3.data;
      formElements.forEach(function (element) {
        var _element$getFields3 = element.getFields(),
            _element$getFields4 = _slicedToArray(_element$getFields3, 1),
            field = _element$getFields4[0];

        var name = formUtils._getNameField(field);

        if (name in data || name === data.FIELDNAME) {
          var nameField = formUtils._getNameControl(field);

          var strategy = "set".concat(nameField, "Data");

          if (formUtils["".concat(strategy)]) {
            formUtils["".concat(strategy)]({
              data: data,
              field: field
            });
          }
        }
      });
    },

    /**
     * @function
     * @name cleanFields
     * @description - Limpiar campos
     *
     * @public
     * @param {object} context
     * @param {object[]} context.formElements - FormElements del contenedor de formulario
     * @returns {void} - No retorna nada
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    cleanFields: function cleanFields(_ref4) {
      var formElements = _ref4.formElements;
      formElements.forEach(function (element) {
        var _element$getFields5 = element.getFields(),
            _element$getFields6 = _slicedToArray(_element$getFields5, 1),
            field = _element$getFields6[0];

        var className = field.getMetadata().getElementName();
        var name = className.split('.').pop();
        var strategy = "clean".concat(name);

        if (formUtils["".concat(strategy)]) {
          formUtils["".concat(strategy)]({
            field: field
          });
        }
      });
    },

    /**
     * @function
     * @name getMultiInputDataVendor
     * @description - Get data from multi input vendor.
     *
     * @public
     * @param {Object[]} aTokens - Tokens
     * @returns {Object[]}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    getMultiInputDataVendor: function getMultiInputDataVendor() {
      var aTokens = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return aTokens.map(function (oToken) {
        return new FormItem({
          option: OptionType.EQ,
          low: oToken
        });
      });
    },

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */

    /**
     * @function
     * @name _getNameField
     * @description - Obtener nombre del campo
     *
     * @private
     * @param {object} field - Campo
     * @returns {string}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _getNameField: function _getNameField(field) {
      return field.getName && field.getName() || field.data('name');
    },

    /**
     * @function
     * @name _isRequiredField
     * @description - Is required field
     *
     * @private
     * @param {object} field - field
     * @returns {boolean}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _isRequiredField: function _isRequiredField(field) {
      return field.getRequired && field.getRequired();
    },

    /**
     * @function
     * @name _mapFields
     * @description - Mapear campos
     *
     * @private
     * @param {sap.ui.layout.form.FormContainer} container - Container
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _mapFields: function _mapFields(container) {
      var _container$getFormEle = container.getFormElements(),
          _container$getFormEle2 = _slicedToArray(_container$getFormEle, 1),
          element = _container$getFormEle2[0];

      var _element$getFields7 = element.getFields(),
          _element$getFields8 = _slicedToArray(_element$getFields7, 1),
          field = _element$getFields8[0];

      return field;
    },

    /**
     * @function
     * @name _getNameControl
     * @description - Obtener nombre del Control
     *
     * @private
     * @param {object} control - Control
     * @returns {string}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _getNameControl: function _getNameControl(control) {
      var className = control.getMetadata().getElementName();
      return className.split('.').pop();
    },

    /**
     * @function
     * @name _concatTextArray
     * @description - Concatena los textos que vengan en las tablas como tdline
     *
     * @private
     * @returns {String} - String concatenado
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    _concatTextArray: function _concatTextArray(array) {
      var text = '';
      array.forEach(function (element) {
        text = "".concat(text).concat(element.TDLINE, "\n");
      });
      return text;
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  });

  return formUtils;
});