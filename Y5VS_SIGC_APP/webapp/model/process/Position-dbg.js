"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * Position
 *
 * @namespace
 * @name com.innova.sigc.model.process.Position
 * @public
 */
// Proporciona la implementaciÃ³n del modelo Position
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo Position.
     *
     * Modelo de un request crear o actualizar una PosiciÃ³n de licitaciÃ³n.
     *
     *
     * @class
     * @name - process
     * @description - ImplementaciÃ³n del modelo de Position
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     * @public
     * @alias com.innova.sigc.model.process.Position
     */
    Object.extend('com.innova.sigc.model.process.Position', {
      constructor: function constructor(data) {
        this.adStreet = data.adStreet;
        this.afnam = data.afnam;
        this.banfn = data.banfn;
        this.best = data.best;
        this.grun = data.grun;
        this.bnfpo = data.bnfpo;
        this.eeind = data.eeind;
        this.ernam = data.ernam;
        this.maktx = data.maktx;
        this.matkl = data.matkl;
        this.matklDesc = data.matklDesc;
        this.matnr = data.matnr;
        this.meins = data.meins;
        this.menge = parseFloat(data.menge);
        this.posProc = data.posProc;
        this.processId = data.processId;
        this.werks = data.werks;
      }
    })
  );
});