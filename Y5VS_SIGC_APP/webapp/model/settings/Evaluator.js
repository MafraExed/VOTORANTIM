"use strict";
/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["sap/ui/base/Object"],function(e){return e.extend("com.innova.sigc.model.settings.Evaluator",{constructor:function e(t){this.firstname=t.firstname;this.lastname=t.lastname;if(t.email){this.email=t.email}this.bname=t.bname;this.roles=t.roles}})});