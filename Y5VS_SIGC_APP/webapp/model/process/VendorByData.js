"use strict";
/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["sap/ui/base/Object"],function(t){return t.extend("com.innova.sigc.model.process.VendorByData",{constructor:function t(s){this.country=s.countries;this.city1=s.city1;this.categoryId=s.catProc;this.lifnr=s.vendors;this.stcd1=s.stcd1;this.name1=s.names;this.sort1=s.sort1;this.stcdt=s.typeId}})});