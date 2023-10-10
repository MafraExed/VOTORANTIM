"use strict";
/*!
 *  SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["com/innova/vendor/lodash.get","com/innova/vendor/lodash.set"],function(n,e){return function(o){var t={};e(t,"layouts",n(o,"ET_LAYOUTS",[]));e(t,"catalog",n(o,"ET_CATALOGO",[]));e(t,"message",n(o,"EV_MESSAGE",""));e(t,"type",n(o,"EV_TYPE",""));return t}});