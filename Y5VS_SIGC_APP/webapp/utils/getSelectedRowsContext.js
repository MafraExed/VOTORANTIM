"use strict";
/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define([],function(){return function(e,t){var n=t.i18n;var r=e.getSelectedIndices();if(!r.length){return Promise.reject(new Error(n.getText("Commons.0030")))}return Promise.resolve(r.map(function(t){return{context:e.getContextByIndex(t),index:t,object:e.getContextByIndex(t).getObject()}}))}});