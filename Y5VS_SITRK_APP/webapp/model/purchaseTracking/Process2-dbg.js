"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 * SiTrack - Seguimiento de compras
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
sap.ui.define(['sap/ui/base/Object', 'com/innova/sitrack/model/purchaseTracking/bidding/BiddingPosition'], function (Object, BiddingPosition) {
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
     * @version 0.5.0
     * @public
     * @alias com.innova.sigc.model.process.Process
     */
    Object.extend('com.innova.sigc.model.process.Process', {
      constructor: function constructor(data) {
        this.tipoDoc = data.tipoDoc.toString();
        this.titProc = data.titProc;
        this.bukrs = data.bukrs;
        this.ekorg = data.ekorg;
        this.ernam = data.ernam;
        this.ernamDesc = data.ernamDesc; // this.ernamDesc = 'Lady Malaver'

        this.adSmtpadr = data.adSmtpadr;
        this.ekgrp = data.ekgrp;
        this.limOferta = data.limOferta || null;
        this.contProv = data.contProv;
        this.condNegoc = data.condNegoc;
        this.dzterm = data.dzterm;
        this.oferParc = data.oferParc;
        this.estaLic = data.estaLic || null;
        this.valRfi = data.valRfi;
        this.numRfi = data.numRfi || null;
        this.pregResp = data.pregResp;
        this.limPreg = data.limPreg || null;
        this.respTecnico = data.respTecnico;
        this.respJuridico = data.respJuridico;
        this.waers = data.waers;
        this.infoOferentes = data.infoOferentes;
        this.infoInterno = data.infoInterno;
        this.fechaCrea = data.fechaCrea || null;
        this.limRecep = data.limRecep || null;
        this.estaRfi = data.estaRfi || null;
        this.solicitante = data.solicitante;
        this.conversionCurrency = data.conversionCurrency;
        this.templateInvitation = data.templateInvitation;
        /* Relations */

        this.catProc = data.catProc;
        this.tipoProc = Number(data.tipoProc);
        this.processPosition = data.positions.map(function (element, index) {
          return new BiddingPosition(_objectSpread(_objectSpread({}, element), {}, {
            posProc: index + 1
          }));
        });
      }
    })
  );
});