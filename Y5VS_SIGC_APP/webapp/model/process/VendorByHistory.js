"use strict";
/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["sap/ui/base/Object"],function(i){return i.extend("com.innova.sigc.model.process.VendorByHistory",{constructor:function i(t){var o,s;this.IV_EKORG=t.ekorg;this.IV_MATNR=t.matnr;this.IV_MATKL=t.matkl;this.IV_TXZ01=t.txz01;this.IV_FDESDE=t===null||t===void 0?void 0:(o=t.date)===null||o===void 0?void 0:o.split("_")[0];this.IV_FHASTA=t===null||t===void 0?void 0:(s=t.date)===null||s===void 0?void 0:s.split("_")[1]}})});