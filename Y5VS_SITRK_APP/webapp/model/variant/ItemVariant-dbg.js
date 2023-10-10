"use strict";

var _excluded = ["sign", "option"];

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * ItemVariant
 *
 * @namespace
 * @name com.innova.sitrack.model.variant.ItemVariant
 * @public
 */
// Proporciona la implementaciÃ³n del modelo ItemVariant
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo ItemVariant.
     *
     * Modelo de un item request para la variante
     *
     *
     * @class
     * @name - ItemVariant
     * @description - ImplementaciÃ³n del modelo de ItemVariant
     *
     *
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sitrack.model.variant.ItemVariant
     */
    Object.extend('com.innova.sitrack.model.variant.ItemVariant', {
      constructor: function constructor(_ref) {
        var _ref$sign = _ref.sign,
            sign = _ref$sign === void 0 ? 'I' : _ref$sign,
            _ref$option = _ref.option,
            option = _ref$option === void 0 ? 'EQ' : _ref$option,
            data = _objectWithoutProperties(_ref, _excluded);

        this.FUNCTION = data.function;
        this.ZVARIANT = data.nameVariant;
        this.GRUPO = data.group;
        this.TABNAME = data.tabname;
        this.FIELDNAME = data.fieldname;
        this.ZSIGN = sign;
        this.ZOPTION = option;
        this.LOW = data.low;
        this.HIGH = data.high;
      }
    })
  );
});