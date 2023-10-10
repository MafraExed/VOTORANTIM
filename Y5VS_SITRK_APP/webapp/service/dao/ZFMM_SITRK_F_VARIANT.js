"use strict";
/*!
 *  SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["com/innova/vendor/lodash.get","com/innova/vendor/lodash.set"],function(n,e){return function(a){var t={};e(t,"variants",n(a,"ET_VARIANTS",[]));e(t,"variant",n(a,"ET_VARIANT",[]));e(t,"message",n(a,"EV_MESSAGE",""));e(t,"type",n(a,"EV_TYPE",""));return t}});