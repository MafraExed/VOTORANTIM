"use strict";
/*!
 *  SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["com/innova/vendor/lodash.set","com/innova/util/keyBy"],function(n,t){return function(e){var i={};var o=e.ET_FCAT_ITEMS,r=e.ET_ITEMS;n(i,"result",e);n(i,"items",r);n(i,"catalog",t(o,"FIELDNAME"));return i}});