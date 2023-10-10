"use strict";
/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["sap/ui/base/Object"],function(i){return i.extend("com.innova.sigc.model.process.EvaluationCriteria",{constructor:function i(o){this.tipo=o.tipo;this.criterio=o.criterio;this.valoracion=o.valoracion;this.pesoValor=o.pesoValor;this.user=o.user;this.indCabPos=o.indCabPos;this.entradaProveedor=o.entradaProveedor;this.processId=o.processId}})});