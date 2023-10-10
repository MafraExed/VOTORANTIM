"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
// Provides enumeration com.innova.sipp.model.process.roundsProcessStatus.RoundsProcessStatus
sap.ui.define(
/**
 * Status.
 *
 * @enum {string}
 * @public
 * @alias com.innova.sigc.model.process.roundsProcessStatus.RoundsProcessStatus
 */
function () {
  return {
    ABIERTO: {
      status: 'A',
      color: '',
      icon: '',
      text: 'ABIERTO'
    },
    COMPLETADO: {
      status: 'B',
      color: '',
      icon: '',
      text: 'COMPLETADO'
    },
    FINALIZADO: {
      status: 'C',
      color: '',
      icon: '',
      text: 'FINALIZADO'
    }
  };
},
/* bExport= */
true);