"use strict";
/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["sap/ui/base/Object"],function(s){return s.extend("com.innova.sigc.model.process.Position",{constructor:function s(t){this.adStreet=t.adStreet;this.afnam=t.afnam;this.banfn=t.banfn;this.best=t.best;this.grun=t.grun;this.bnfpo=t.bnfpo;this.eeind=t.eeind;this.ernam=t.ernam;this.maktx=t.maktx;this.matkl=t.matkl;this.matklDesc=t.matklDesc;this.matnr=t.matnr;this.meins=t.meins;this.menge=parseFloat(t.menge);this.posProc=t.posProc;this.processId=t.processId;this.werks=t.werks}})});