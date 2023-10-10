"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * Evaluator
 *
 * @namespace
 * @name com.innova.sigc.model.settings.Evaluator
 * @public
 */
// Proporciona la implementaciÃ³n del modelo Position
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un evaluador.
     *
     * Modelo de un request crear o actualizar un evaluador
     *
     *
     * @class
     * @name Evaluator
     * @description - ImplementaciÃ³n del modelo de evaluador
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     * @public
     * @alias com.innova.sigc.model.settings.Evaluator
     */
    Object.extend('com.innova.sigc.model.settings.Evaluator', {
      constructor: function constructor(data) {
        this.firstname = data.firstname;
        this.lastname = data.lastname;

        if (data.email) {
          this.email = data.email;
        }

        this.bname = data.bname;
        this.roles = data.roles;
      }
    })
  );
});