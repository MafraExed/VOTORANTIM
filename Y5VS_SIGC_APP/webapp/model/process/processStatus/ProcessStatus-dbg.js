"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
// Provides enumeration com.innova.sigc.model.process.processStatus.ProcessStatus
sap.ui.define(
/**
 * Status.
 *
 * @enum {string}
 * @public
 * @alias com.innova.sigc.model.process.processStatus.ProcessStatus
 */
function () {
  return {
    ABIERTO_SIN_ENVIAR: {
      status: 'A',
      color: '',
      icon: 'sap-icon://begin',
      text: 'ABIERTO_SIN_ENVIAR'
    },
    ABIERTO_ENVIADO: {
      status: 'B',
      color: '',
      icon: 'sap-icon://email',
      text: 'ABIERTO_ENVIADO'
    },
    OFERTA_RECIBIDA: {
      status: 'C',
      color: '',
      icon: 'sap-icon://sales-document',
      text: 'OFERTA_RECIBIDA'
    },
    EVALUACION_TECNICA: {
      status: 'D',
      color: '',
      icon: 'sap-icon://commission-check',
      text: 'EVALUACION_TECNICA'
    },
    EVALUACION_COMERCIAL: {
      status: 'E',
      color: '',
      icon: 'sap-icon://compare',
      text: 'EVALUACION_COMERCIAL'
    },
    RONDA_NEGOCIACION: {
      status: 'F',
      color: '',
      icon: 'sap-icon://collections-insight',
      text: 'RONDA_NEGOCIACION'
    },
    OFERTA_RONDA_NEGOCIACION: {
      status: 'G',
      color: '',
      icon: 'sap-icon://sales-quote',
      text: 'OFERTA_RONDA_NEGOCIACION'
    },
    LICITACION_PARCIAL: {
      status: 'H',
      color: '',
      icon: 'sap-icon://favorite-list',
      text: 'LICITACION_PARCIAL'
    },
    LICITACION_ADJUDICADA: {
      status: 'I',
      color: '',
      icon: 'sap-icon://favorite',
      text: 'LICITACION_ADJUDICADA'
    },
    CANCELADO: {
      status: 'J',
      color: '',
      icon: 'sap-icon://decline',
      text: 'CANCELADO'
    },
    ORDEN_DE_COMPRA: {
      status: 'K',
      color: '',
      icon: 'sap-icon://customer-order-entry',
      text: 'ORDEN_DE_COMPRA'
    },
    CON_PREGUNTAS: {
      status: 'L',
      color: '',
      icon: 'sap-icon://sys-help',
      text: 'CON_PREGUNTAS'
    },
    RESPUESTAS_COMPLETADAS: {
      status: 'M',
      color: '',
      icon: 'sap-icon://sys-help-2',
      text: 'RESPUESTAS_COMPLETADAS'
    }
  };
},
/* bExport= */
true);