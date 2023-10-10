"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * Process
 *
 * @namespace
 * @name com.innova.sigc.model.process.Process
 * @public
 */
// Proporciona la implementaciÃ³n del modelo Process
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo
     *
     * Modelo de un request crear o actualizar un proceso de licitaciÃ³n.
     *
     *
     * @class
     * @name Process - BiddingProcess
     * @description - ImplementaciÃ³n del modelo de Process
     *
     *
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     * @public
     * @alias com.innova.sigc.model.process.Process
     */
    Object.extend('com.innova.sigc.model.process.Process', {
      constructor: function constructor(data) {
        this.tipoDoc = data.tipoDoc;
        this.titProc = data.titProc;
        this.bukrs = data.bukrs;
        this.ekorg = data.ekorg;
        this.ernam = data.ernam;
        this.ernamDesc = data.ernamDesc;
        this.adSmtpadr = data.adSmtpadr;
        this.ekgrp = data.ekgrp;
        this.limOferta = data.limOferta;
        this.contProv = data.contProv;
        this.condNegoc = data.condNegoc;
        this.dzterm = data.dzterm;
        this.dztermDesc = data.dztermDesc;
        this.oferParc = data.oferParc;
        this.estaLic = data.estaLic;
        this.valRfi = data.valRfi;
        this.numRfi = data.numRfi;
        this.pregResp = data.pregResp;
        this.limPreg = data.limPreg;
        this.respTecnico = data.respTecnico;
        this.respJuridico = data.respJuridico;
        this.waers = data.waers;
        this.infoOferentes = data.infoOferentes;
        this.infoInterno = data.infoInterno;
        this.fechaCrea = data.fechaCrea;
        this.limRecep = data.limRecep;
        this.estaRfi = data.estaRfi;
        this.solicitante = data.solicitante;
        this.conversionCurrency = data.conversionCurrency;
        this.conversionDate = data.conversionDate;
        this.templateInvitation = data.templateInvitation;
        /* Relations */

        this.catProc = data.catProc;
        this.tipoProc = data.tipoProc;
      }
    })
  );
});