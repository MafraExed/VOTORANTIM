"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['./capitalize', './getCatalogTitle', './isKeyField'], function (capitalize, getCatalogTitle, isKeyField) {
  return {
    capitalize: capitalize,
    getCatalogTitle: getCatalogTitle,
    isKeyField: isKeyField
  };
});