"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sigc/model/variant/ItemVariant', 'sap/ui/core/ListItem'], function (ItemVariant, ListItem) {
  return (
    /**
     * @function
     * @name getInputData
     * @description - Obtiene el valor del control Input
     *
     * @public
     * @param {object} context
     * @param {boolean} context.isVariant - Es variante
     * @param {object} context.field - Control VBox
     * @param {string} context.functionName - Nombre de la funciÃ³n para el backend
     * @param {string} context.group - Grupo al que pertenece el campo
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    {
      getInputData: function getInputData(_ref) {
        var isVariant = _ref.isVariant,
            field = _ref.field,
            functionName = _ref.functionName,
            group = _ref.group;
        var name = field.getName();
        var value = field.getSelectedKey() || field.getValue() || null;
        var description = field.getDescription();

        if (isVariant) {
          return _defineProperty({}, name, new ItemVariant({
            fieldname: name,
            function: functionName,
            group: group,
            low: value,
            tabname: field.data('tabname')
          }));
        }

        return _objectSpread(_defineProperty({}, name, value), description && _defineProperty({}, "".concat(name, "Desc"), description));
      },

      /**
       * @function
       * @name setInputData
       * @description - Obtener datos del control
       *
       * @private
       * @param {object} context
       * @param {sap.m.Input} context.field - Campo
       * @param {string|object} context.data - Datos
       * @returns {void} - Noting to return.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      setInputData: function setInputData(_ref4) {
        var field = _ref4.field,
            data = _ref4.data;
        var name = field.getName();
        var value = data[name];
        var description = data["".concat(name, "Desc")];
        field.setValueState(sap.ui.core.ValueState.None);

        if (field.getShowSuggestion()) {
          field.setSelectedKey(value);
          field.destroySuggestionItems();
          field.fireSuggest({
            suggestValue: value
          });
        } else if (field.getValueHelpOnly()) {
          field.destroySuggestionItems().addSuggestionItem(new ListItem({
            key: value,
            text: value
          }));
          field.setSelectedKey(value);
          field.setDescription(description);
          field.fireChangeEvent(value);
        } else {
          field.setValue(value);
          field.setDescription(description);
        }
      },

      /**
       * @function
       * @name cleanMultiInput
       * @description - Limpiar control
       *
       * @private
       * @param {object} context
       * @param {sap.m.Input} context.field - Campo
       * @returns {void} - Noting to return.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      cleanInput: function cleanInput(_ref5) {
        var field = _ref5.field;
        field.destroySuggestionItems();
        field.setSelectedKey(undefined);
        field.setValue(undefined);
        field.setDescription();
      },

      /**
       * @function
       * @name isInputValid
       * @description - Valida si el valor del control es valido
       *
       * @public
       * @param {object} context
       * @param {sap.m.Input} context.field - Campo
       * @returns {boolean}
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      isInputValid: function isInputValid(_ref6) {
        var field = _ref6.field;

        if (field.getShowSuggestion() || field.getValueHelpOnly()) {
          return !!field.getSelectedKey();
        }

        return !!field.getValue();
      }
    }
  );
});