"use strict";
/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define([],function(){return function(){var n=arguments.length>0&&arguments[0]!==undefined?arguments[0]:[];return n.filter(function(n){return n.TECH!=="X"&&n.NO_OUT!=="X"}).sort(function(n,t){return n.COL_POS-t.COL_POS})}});