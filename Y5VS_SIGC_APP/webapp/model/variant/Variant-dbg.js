"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * Variant
 *
 * @namespace
 * @name com.innova.sitrack.model.variant.Variant
 * @public
 */
// Proporciona la implementaciÃ³n del modelo Variant
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo Variant.
     *
     * Modelo de un request para las variantes
     *
     *
     * @class
     * @name - Variant
     * @description - ImplementaciÃ³n del modelo de Variant
     *
     *
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     * @public
     * @alias com.innova.sitrack.model.variant.Variant
     */
    Object.extend('com.innova.sitrack.model.variant.Variant', {
      constructor: function constructor(data) {
        this.IV_FUNCTION = data.function;
        this.IV_VARIANT = data.nameVariant;
        this.IV_ACCION = data.action;
        this.IV_POR_DEF = data.defaultVariant;
        this.IT_VARIANT = data.variants;
      }
    })
  );
});