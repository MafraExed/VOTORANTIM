"use strict";
/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["sap/ui/base/Object"],function(_){return _.extend("com.innova.sitrack.model.purchaseTracking.payment.DetailPayment",{constructor:function _(D){this.IT_DOCKEYS=D.IT_DOCKEYS||[];this.IR_SDP_PAYSTATUS=D.IV_SDP_PAYSTATUS||null;this.IR_SDP_PAYNUM=D.IV_SDP_PAYNUM||null;this.IR_SDP_PAYDATE=D.IV_SDP_PAYDATE||null;this.IR_SDP_BLDAT=D.IV_SDP_BLDAT||null;this.IR_SDP_EKGRP=D.IV_SDP_EKGRP||null;this.IR_SDP_DELIVDATE=D.IV_SDP_DELIVDATE||null}})});