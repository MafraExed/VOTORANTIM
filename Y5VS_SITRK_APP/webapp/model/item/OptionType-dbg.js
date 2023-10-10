"use strict";

// Provides enumeration com.innova.sitrack.model.item.OptionType

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
     * @alias com.innova.sitrack.model.item.OptionType
     */
    {
      /**
       * Items Equals
       * @public
       */
      EQ: 'EQ',

      /**
       * Items Contains
       * @public
       */
      CP: 'CP',

      /**
       * Items Between
       * @public
       */
      BT: 'BT',

      /**
       * Items Mayor a
       * @public
       */
      GT: 'GT',

      /**
       * Items Mayor o Igual a
       * @public
       */
      GE: 'GE',

      /**
       * Items Menor a
       * @public
       */
      LT: 'LT',

      /**
       * Items Menor o Igual a
       * @public
       */
      LE: 'LE'
    }
  );
},
/* bExport= */
true);