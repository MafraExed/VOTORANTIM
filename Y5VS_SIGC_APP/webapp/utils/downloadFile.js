"use strict";
/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["com/innova/vendor/file-saver"],function(e){return function(n){var i=n.blob,r=n.filename,o=r===void 0?"":r;return e.saveAs(i,o)}});