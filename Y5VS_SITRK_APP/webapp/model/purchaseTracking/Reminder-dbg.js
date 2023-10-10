"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */

/**
 * ItemReminder
 *
 * @namespace
 * @name com.innova.sitrack.model.purchaseTracking.ItemReminder
 * @public
 */
// Proporciona la implementaciÃ³n del modelo ItemReminder
sap.ui.define(['sap/ui/base/Object'], function (Object) {
  return (
    /**
     * Constructor para un nuevo ItemReminder.
     *
     * Modelo de un request para recordatorio
     *
     * @class
     * @name - ItemReminder
     * @description - ImplementaciÃ³n del modelo de ItemReminder
     *
     *
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     * @public
     * @alias com.innova.sitrack.model.purchaseTracking.ItemReminder
     */
    Object.extend('com.innova.sitrack.model.purchaseTracking.ItemReminder', {
      constructor: function constructor(data) {
        this.IT_PED = data.IT_PED || [];
      }
    })
  );
});