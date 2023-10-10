"use strict";
/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["sap/ui/base/Object","./Cabecera"],function(i,e){return i.extend("com.innova.sigc.model.process.poCreate.PoCreate",{constructor:function i(t){var s,n,o,u;this.IT_CABECERA=new e(t.header);this.IT_TEXTOCAB=(s=t.textoCab)!==null&&s!==void 0?s:[];this.IT_POSICION=(n=t.positions)!==null&&n!==void 0?n:[];this.IT_SERVICIO=(o=t.services)!==null&&o!==void 0?o:[];this.IT_IMPUTACI=(u=t.imputations)!==null&&u!==void 0?u:[];this.IT_TEXTOPOS=null}})});