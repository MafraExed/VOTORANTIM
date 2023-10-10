"use strict";
/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["sap/ui/base/Object"],function(t){return t.extend("com.innova.sitrack.model.layout.ItemLayout",{constructor:function t(i){this.FUNCTION=i.function;this.LAYOUT=i.nameLayout;this.FIELDNAME=i.FIELDNAME;this.ZORDER=i.COL_POS;this.OUTPUTLEN=parseInt(i.OUTPUTLEN,10);this.HREF_HNDL=i.columnHeight}})});