"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(function () {
  return (
    /**
     * Types of Document.
     *
     * @enum {string}
     * @public
     * @alias com.innova.sigc.model.process.TypesDocEnum
     */
    {
      /**
       * Consultar layout disponibles
       * @public
       */
      PRESELECCION: 1,

      /**
       * Obtener el detalle de un layout
       * @public
       */
      LIC_COT: 2
    }
  );
},
/* bExport= */
true);