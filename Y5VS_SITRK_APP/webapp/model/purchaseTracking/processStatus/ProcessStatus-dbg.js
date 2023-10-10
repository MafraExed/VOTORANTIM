"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
// Provides enumeration com.innova.sipp.model.process.processStatus.ProcessStatus
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
      icon: '',
      text: 'ABIERTO_SIN_ENVIAR'
    },
    ABIERTO_ENVIADO: {
      status: 'B',
      color: '',
      icon: '',
      text: 'ABIERTO_ENVIADO'
    },
    OFERTA_RECIBIDA: {
      status: 'C',
      color: '',
      icon: '',
      text: 'OFERTA_RECIBIDA'
    },
    EVALUACION_TECNICA: {
      status: 'D',
      color: '',
      icon: '',
      text: 'OFERTA_RECIBIDA'
    },
    EVALUACION_COMERCIAL: {
      status: 'E',
      color: '',
      icon: '',
      text: 'EVALUACION_COMERCIAL'
    },
    RONDA_NEGOCIACION: {
      status: 'F',
      color: '',
      icon: '',
      text: 'RONDA_NEGOCIACION'
    },
    OFERTA_RONDA_NEGOCIACION: {
      status: 'G',
      color: '',
      icon: '',
      text: 'OFERTA_RONDA_NEGOCIACION'
    },
    LICITACION_PARCIAL: {
      status: 'H',
      color: '',
      icon: '',
      text: 'LICITACION_PARCIAL'
    },
    LICITACION_ADJUDICADA: {
      status: 'I',
      color: '',
      icon: '',
      text: 'LICITACION_ADJUDICADA'
    },
    CANCELADO: {
      status: 'J',
      color: '',
      icon: '',
      text: 'LICITACION_ADJUDICADA'
    },
    ORDEN_DE_COMPRA: {
      status: 'K',
      color: '',
      icon: '',
      text: 'ORDEN_DE_COMPRA'
    },
    CON_PREGUNTAS: {
      status: 'L',
      color: '',
      icon: '',
      text: 'CON_PREGUNTAS'
    },
    RESPUESTAS_COMPLETADAS: {
      status: 'M',
      color: '',
      icon: '',
      text: 'RESPUESTAS_COMPLETADAS'
    }
  };
},
/* bExport= */
true);