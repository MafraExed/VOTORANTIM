"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sitrack/model/item/FormItem', 'com/innova/sitrack/model/item/OptionType', 'com/innova/sitrack/model/variant/ItemVariant', 'com/innova/sitrack/utils/addPatternToText', 'sap/m/Token', 'sap/ui/core/ValueState', 'com/innova/util/isEmpty'], function (FormItem, OptionType, ItemVariant, addPatternToText, Token, ValueState, isEmpty) {
  /**
   * @function
   * @name validateTokenExists
   * @description - Valida si ya existe la propiedad .
   *
   * @public
   * @param {object[]} aToken - Arreglo de los tokens que se encuentran en el MultiIpunt
   * @param {string} sData - Data a validar
   * @returns {boolean} - si existe retorna true.
   *
   * @author Edwin Valencia <evalencia@innovainternacional.biz>
   * @version 0.5.0
   */
  var validateTokenExists = function validateTokenExists(aToken, sData) {
    var iTokenLength = aToken.length;

    if (iTokenLength > 0) {
      /*  aToken.some((token) => token.getKey() === sData) */
      for (var i = 0; i < iTokenLength; i += 1) {
        var oToken = aToken[i];

        if (oToken.getKey() === sData) {
          return true;
        }
      }
    }

    return false;
  };
  /**
   * @function
   * @name validatorMultiInput
   * @description - Retorna un Closure de JS para ser agregado a un MultiInput.
   *  Agrega el validador del MultiInput de la vista.
   *
   * @public
   * @param {string} sLowerCase - parametro que indica si el texto debe ser MayÃºscula o no.
   * @returns {function} - Closure con el validador del MultiInput.
   *
   * @author Edwin Valencia <evalencia@innovainternacional.biz>
   * @version 0.5.0
   */


  var validatorMultiInput = function validatorMultiInput(sLowerCase) {
    return (// closure de JavaScript
      function (args) {
        var text = args.text;

        if (sLowerCase !== 'X') {
          text = text.toUpperCase();
        }

        return new Token({
          key: text,
          text: text
        });
      }
    );
  };
  /**
   * @function
   * @name validatorEmailMultiInput
   * @description - Validar las entradas de correo
   *
   * @public
   * @param {object} args - Argumento de entrada
   * @returns {sap.m.Token|undefined}
   *
   * @author Edwin Valencia <evalencia@innovainternacional.biz>
   * @version 0.5.0
   */


  var validatorEmailMultiInput = function validatorEmailMultiInput(args) {
    var text = args.text;

    if (/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(text)) {
      return new Token({
        key: text,
        text: text
      });
    }

    return undefined;
  };
  /**
   * @function
   * @name emailTokenUpdate
   * @description - Maneja la actualizaciÃ³n de los token de correo
   *
   * @public
   * @param {sap.ui.base.Event} oEvent An Event object consisting of an id, a source and a map of parameters.
   * @returns {void}
   *
   * @author Edwin Valencia <evalencia@innovainternacional.biz>
   * @version 0.5.0
   */


  var emailTokenUpdate = function emailTokenUpdate(oEvent) {
    var oSource =
    /** @type {sap.m.MultiInput}  */
    oEvent.getSource();
    var oContext =
    /** @type {sap.ui.model.Context}  */
    oSource.getBindingContext();
    var sPath = oContext.getPath();
    var oModel =
    /** @type {sap.ui.model.json.JSONModel} */
    oContext.getModel();
    var aEmail = oContext.getProperty('E_MAILS');

    if (isEmpty(aEmail)) {
      aEmail = [];
    }

    var sType = oEvent.getParameter('type');
    var aAddedTokens = oEvent.getParameter('addedTokens');
    var aRemovedTokens = oEvent.getParameter('removedTokens'); // add new context to the data of the model, when new token is being added

    if (sType === 'added') {
      aAddedTokens.forEach(function (oToken) {
        aEmail.push({
          EMAIL: oToken.getKey()
        });
      });
    } else if (sType === 'removed') {
      // remove contexts from the data of the model, when tokens are being removed
      aRemovedTokens.forEach(function (oToken) {
        aEmail = aEmail.filter(function (context) {
          return context.EMAIL !== oToken.getKey();
        });
      });
    }

    oModel.setProperty("".concat(sPath, "/E_MAILS"), aEmail);
  };
  /**
   * @function
   * @name mapTokensRequest
   * @description - Mapear tokens para la peticiÃ³n
   *
   * @public
   * @param {object} context
   * @param {string} context.fieldname - Metadata de los controles necesarios.
   * @param {string} context.functionName - Nombre de la funciÃ³n para el backend
   * @param {string} context.group - Grupo al que pertenece el campo
   * @param {boolean} context.isVariant - Es variante.
   * @param {number} context.maxLength - Metadata de los controles necesarios.
   * @param {string} context.option - Metadata de los controles necesarios.
   * @param {string} context.tabname - Metadata de los controles necesarios.
   * @param {sap.m.Token} context.token - Metadata de los controles necesarios.
   * @returns {object}
   *
   * @author Edwin Valencia <evalencia@innovainternacional.biz>
   * @version 0.5.0
   */


  var mapTokensRequest = function mapTokensRequest(_ref) {
    var fieldname = _ref.fieldname,
        functionName = _ref.functionName,
        group = _ref.group,
        isVariant = _ref.isVariant,
        maxLength = _ref.maxLength,
        option = _ref.option,
        tabname = _ref.tabname,
        token = _ref.token;
    var low = option === OptionType.CP ? addPatternToText(token.getText(), maxLength) : token.getText();
    return !isVariant ? new FormItem({
      fieldname: fieldname,
      low: low,
      option: option,
      tabname: tabname
    }) : new ItemVariant({
      fieldname: fieldname,
      function: functionName,
      group: group,
      low: low,
      option: option,
      tabname: tabname
    });
  };
  /**
   * @function
   * @name multiInputTokenFormat
   * @description - Retorna un objeto[] con los valores que deben enviar al servicio,
   *  con la data que viene en el MultiInput.
   *
   * @public
   * @param {object} context
   * @param {string} context.fieldname - Metadata de los controles necesarios.
   * @param {string} context.functionName - Nombre de la funciÃ³n para el backend
   * @param {string} context.group - Grupo al que pertenece el campo
   * @param {boolean} context.isVariant - Es variante.
   * @param {boolean} context.lowercase - Metadata de los controles necesarios.
   * @param {number} context.maxLength - Metadata de los controles necesarios.
   * @param {string} context.tabname - Metadata de los controles necesarios.
   * @param {sap.m.Token[]} context.tokens - Metadata de los controles necesarios.
   * @returns {Object[FormItem]}
   *
   * @author Edwin Valencia <evalencia@innovainternacional.biz>
   * @version 0.5.0
   */


  var multiInputTokenFormat = function multiInputTokenFormat(_ref2) {
    var fieldname = _ref2.fieldname,
        functionName = _ref2.functionName,
        group = _ref2.group,
        isVariant = _ref2.isVariant,
        lowercase = _ref2.lowercase,
        maxLength = _ref2.maxLength,
        tabname = _ref2.tabname,
        tokens = _ref2.tokens;
    var option = lowercase ? OptionType.EQ : OptionType.CP;
    return tokens.map(function (token) {
      return mapTokensRequest({
        fieldname: fieldname,
        functionName: functionName,
        group: group,
        isVariant: isVariant,
        maxLength: maxLength,
        option: option,
        tabname: tabname,
        token: token
      });
    });
  };
  /**
   * @function
   * @name isMultiInputValid
   * @description - Valida si el valor del control es valido
   *
   * @public
   * @param {object} context
   * @param {sap.m.MultiInput} context.field - Campo
   * @returns {boolean}
   *
   * @author Edwin Valencia <evalencia@innovainternacional.biz>
   * @version 0.5.0
   */


  var isMultiInputValid = function isMultiInputValid(_ref3) {
    var field = _ref3.field;
    return field.getTokens().length > 0;
  };

  return {
    isMultiInputValid: isMultiInputValid,

    /** .
     * @function
     * @name addTokensToMultiInput
     * @description - Valida si ya existe la propiedad .
     *
     * @public
     * @param {object[]} array - InformaciÃ³n que debe agregarse al MultiInput
     * @param {string} sKey - Attributo del objeto
     * @param {sap.m.MultiInput} oElement - MultiInput al cual se agregara la data
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    addTokensToMultiInput: function addTokensToMultiInput(array, sKey, oElement) {
      array.forEach(function (element) {
        var sData = element[sKey] || element.getObject()[sKey];
        sData = sData.replace(/\*/g, '');

        if (!validateTokenExists(oElement.getTokens(), sData)) {
          oElement.addToken(new Token({
            key: sData,
            text: sData
          }));
        }
      });
    },

    /**
     * @function
     * @name addValidatorToMultiInputs
     * @description - Agregar validador a MultiInputs de la vista
     *
     * @public
     * @param {object} oContext - Objecto contexto
     * @param {object[]} oContext.fields - Vista
     * @returns {void} - No retorna nada
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    addValidatorAllMultiInputs: function addValidatorAllMultiInputs(_ref4) {
      var fields = _ref4.fields;
      fields.filter(function (oControl) {
        return oControl.isA('sap.m.MultiInput');
      }).forEach(function (oMultiInput) {
        oMultiInput.removeAllValidators();
        oMultiInput.addValidator(validatorMultiInput(oMultiInput.data('lowercase')));
      });
    },

    /**
     * @function
     * @name addValidatorEmailMultiInputs
     * @description - Agregar validador a MultiInputs de correos
     *
     * @public
     * @param {object} oContext - Objecto contexto
     * @param {object[]} oContext.fields - Controles de la vista
     * @returns {void} - No retorna nada
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    addValidatorEmailMultiInputs: function addValidatorEmailMultiInputs(_ref5) {
      var fields = _ref5.fields;
      fields.filter(function (oControl) {
        return oControl.isA('sap.m.MultiInput');
      }).forEach(function (oMultiInput) {
        oMultiInput.removeAllValidators();
        oMultiInput.addValidator(validatorEmailMultiInput);
        oMultiInput.attachTokenUpdate(emailTokenUpdate);
      });
    },

    /**
     * @function
     * @name getMultiInputData
     * @description - Obtener datos del control VBox
     *
     * @private
     * @param {object} context
     * @param {sap.m.MultiInput} context.field - Campo
     * @param {string} context.functionName - Nombre de la funciÃ³n para el backend
     * @param {string} context.group - Grupo al que pertenece el campo
     * @param {boolean} context.isVariant - Es variante
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    getMultiInputData: function getMultiInputData(_ref6) {
      var field = _ref6.field,
          isVariant = _ref6.isVariant,
          functionName = _ref6.functionName,
          group = _ref6.group;
      var aItem = [];
      var tokens = field.getTokens();

      if (tokens && tokens.length > 0) {
        field.setValueState(ValueState.None);
        aItem = multiInputTokenFormat({
          fieldname: field.getName(),
          functionName: functionName,
          group: group,
          isVariant: isVariant,
          lowercase: field.data('lowercase') !== 'X',
          maxLength: field.getMaxLength(),
          tabname: field.data('tabname'),
          tokens: tokens
        });
      }

      return _objectSpread({}, aItem.length && _defineProperty({}, field.getName(), aItem));
    },

    /**
     * @function
     * @name getMultiInputData
     * @description - Obtener datos del control
     *
     * @private
     * @param {object} context
     * @param {sap.m.MultiInput} context.field - Campo
     * @param {object} context.data - Datos
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    setMultiInputData: function setMultiInputData(_ref8) {
      var field = _ref8.field,
          data = _ref8.data;
      field.addToken(new Token({
        key: data.LOW,
        text: data.LOW
      }));
    },

    /**
     * @function
     * @name cleanMultiInput
     * @description - Limpiar control
     *
     * @private
     * @param {object} context
     * @param {sap.m.MultiInput} context.field - Campo
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    cleanMultiInput: function cleanMultiInput(_ref9) {
      var field = _ref9.field;
      field.removeAllTokens();
      field.fireTokenUpdate({
        type: 'removed'
      });
    }
  };
});