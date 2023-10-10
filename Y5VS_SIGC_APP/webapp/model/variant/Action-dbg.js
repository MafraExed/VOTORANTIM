"use strict";

// Provides enumeration com.innova.sitrack.model.layout.Actions

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(function () {
  return (
    /**
     * Types of Low Items.
     *
     * @enum {string}
     * @public
     * @alias com.innova.sitrack.model.variant.Actions
     */
    {
      /**
       * Consultar variante disponibles
       * @public
       */
      READ: '1',

      /**
       * Obtener el detalle de una variante
       * @public
       */
      GET: '4',

      /**
       * Grabar variante
       * @public
       */
      POST: '2',

      /**
       * Asignar variante por defecto
       * @public
       */
      ASSING: '3',

      /**
       * Obtener variante por defecto
       * @public
       */
      DEFAULT: '5'
    }
  );
},
/* bExport= */
true);