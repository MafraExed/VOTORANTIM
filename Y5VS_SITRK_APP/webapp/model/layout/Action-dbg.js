"use strict";

// Provides enumeration com.innova.sitrack.model.layout.Actions

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(function () {
  return (
    /**
     * Types of Low Items.
     *
     * @enum {string}
     * @public
     * @alias com.innova.sitrack.model.layout.Actions
     */
    {
      /**
       * Consultar layout disponibles
       * @public
       */
      READ: '1',

      /**
       * Obtener el detalle de un layout
       * @public
       */
      GET: '2',

      /**
       * Grabar layout
       * @public
       */
      POST: '3',

      /**
       * Asignar layout por defecto
       * @public
       */
      ASSING: '4',

      /**
       * Obtener layout por defecto
       * @public
       */
      DEFAULT: '5'
    }
  );
},
/* bExport= */
true);