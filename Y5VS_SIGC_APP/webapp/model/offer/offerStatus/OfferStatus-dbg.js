"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
// Provides enumeration com.innova.sigc.model.offer.OfferStatus
sap.ui.define(
/**
 * Status.
 *
 * @enum {string}
 * @public
 * @alias com.innova.sigc.model.offer.OfferStatus
 */
function () {
  return {
    GANADOR: {
      status: 'A',
      color: '#00FF00',
      icon: 'sap-icon://accept',
      text: 'GANADOR'
    },
    GANADOR_PARCIAL: {
      status: 'B',
      color: '#00C400',
      icon: 'sap-icon://accept',
      text: 'GANADOR_PARCIAL'
    },
    RECHAZADO_POSICION_EVALUADOR: {
      status: 'C',
      color: '#C40000',
      icon: 'sap-icon://decline',
      text: 'RECHAZADO_POSICION_EVALUADOR',
      type: {
        T: {
          color: '#EF8600',
          text: 'RECHAZADO_POSICION_EVALUADOR_T'
        },
        C: {
          color: '#C40000',
          text: 'RECHAZADO_POSICION_EVALUADOR_C'
        }
      }
    },
    RECHAZO_POSICION_PROVEEDOR: {
      status: 'D',
      color: '#72248E',
      icon: 'sap-icon://employee-rejections',
      text: 'RECHAZO_POSICION_PROVEEDOR'
    },
    GANADOR_TOTAL: {
      status: 'E',
      color: '#00FF00',
      icon: 'sap-icon://competitor',
      text: 'GANADOR_TOTAL'
    },
    RECHAZO_TOTAL_EVALUADOR: {
      status: 'F',
      color: '#C40000',
      icon: 'sap-icon://decline',
      text: 'RECHAZO_TOTAL_EVALUADOR',
      type: {
        T: {
          color: '#EF8600',
          text: 'RECHAZO_TOTAL_EVALUADOR_T'
        },
        C: {
          color: '#C40000',
          text: 'RECHAZO_TOTAL_EVALUADOR_C'
        }
      }
    },
    RECHAZO_TOTAL_PROVEEDOR: {
      status: 'G',
      color: '#72248E',
      icon: 'sap-icon://decline',
      text: 'RECHAZO_TOTAL_PROVEEDOR'
    },
    RECHAZADO_FECHA_LIMITE: {
      status: 'H',
      color: '#bb0000',
      icon: 'sap-icon://thumb-down',
      text: 'RECHAZADO_FECHA_LIMITE'
    }
  };
},
/* bExport= */
true);