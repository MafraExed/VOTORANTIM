"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * EvaluationCriteria
 *
 * @namespace
 * @name com.innova.sigc.model.process.EvaluationCriteria
 * @public
 */
// Proporciona la implementaciÃ³n del modelo EvaluationCriteria
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo EvaluationCriteria.
     *
     * Modelo de un request crear o actualizar un criterio de evaluaciÃ³n.
     *
     *
     * @class
     * @name - process
     * @description - ImplementaciÃ³n del modelo de EvaluationCriteria
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     * @public
     * @alias com.innova.sigc.model.process.EvaluationCriteria
     */
    Object.extend('com.innova.sigc.model.process.EvaluationCriteria', {
      constructor: function constructor(data) {
        this.tipo = data.tipo;
        this.criterio = data.criterio;
        this.valoracion = data.valoracion;
        this.pesoValor = data.pesoValor;
        this.user = data.user;
        this.indCabPos = data.indCabPos;
        this.entradaProveedor = data.entradaProveedor;
        this.processId = data.processId;
      }
    })
  );
});