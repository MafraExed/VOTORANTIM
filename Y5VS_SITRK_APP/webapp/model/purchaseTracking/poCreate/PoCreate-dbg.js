"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * PoCreate
 *
 * @namespace
 * @name com.innova.sigc.model.process.poCreate.PoCreate
 * @public
 */
// Proporciona la implementaciÃ³n del modelo Position
sap.ui.define(['sap/ui/base/Object', './Cabecera'], function (Object, Cabecera) {
  return (
    /**
     * @class
     * @name PoCreate - Create order
     * @description - ImplementaciÃ³n del modelo de Crear Orden de Pedido
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sigc.model.process.poCreate.PoCreate
     */
    Object.extend('com.innova.sigc.model.process.poCreate.PoCreate', {
      constructor: function constructor(data) {
        var _data$textoCab, _data$positions;

        this.IT_CABECERA = new Cabecera(data.header);
        this.IT_TEXTOCAB = (_data$textoCab = data.textoCab) !== null && _data$textoCab !== void 0 ? _data$textoCab : [];
        this.IT_POSICION = (_data$positions = data.positions) !== null && _data$positions !== void 0 ? _data$positions : [];
        this.IT_SERVICIO = null;
        this.IT_IMPUTACI = null;
        this.IT_TEXTOPOS = null;
      }
    })
  );
});