"use strict";
/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["sap/ui/base/Object","./Cabecera"],function(e,t){return e.extend("com.innova.sigc.model.process.poCreate.PoCreate",{constructor:function e(i){var n,s;this.IT_CABECERA=new t(i.header);this.IT_TEXTOCAB=(n=i.textoCab)!==null&&n!==void 0?n:[];this.IT_POSICION=(s=i.positions)!==null&&s!==void 0?s:[];this.IT_SERVICIO=null;this.IT_IMPUTACI=null;this.IT_TEXTOPOS=null}})});