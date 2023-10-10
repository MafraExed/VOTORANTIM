"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 *  SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/model/constant'], function (constant) {
  var _post;

  return {
    get: {},
    post: (_post = {}, _defineProperty(_post, "".concat(constant.GET_INITIALIZE), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SITRK_F_INITIALIZE'
    }), _defineProperty(_post, "".concat(constant.GET_PROCESS_SELECTED), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SITRK_F_BUSQUEDA_DOC'
    }), _defineProperty(_post, "".concat(constant.GET_ASSIGN_USER), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SITRK_F_PR_ASSIGN'
    }), _defineProperty(_post, "".concat(constant.GET_RETURN_SOL_PED), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SITRK_F_PR_RETURN'
    }), _defineProperty(_post, "".concat(constant.GET_SEARCH_HELP), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SITRK_F_SHELP'
    }), _defineProperty(_post, "".concat(constant.GET_LAYOUT), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SITRK_F_LAYOUT'
    }), _defineProperty(_post, "".concat(constant.GET_EMAIL_PROV), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SITRK_F_EMAIL_PROV'
    }), _defineProperty(_post, "".concat(constant.GET_REMINDER), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SITRK_F_GR_REMINDER'
    }), _defineProperty(_post, "".concat(constant.GET_VARIANT), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SITRK_F_VARIANT'
    }), _defineProperty(_post, "".concat(constant.GET_APPROVALS_SELECTED), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SITRK_F_APROB'
    }), _defineProperty(_post, "".concat(constant.GET_UPDATE_SOL_PED), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SITRK_MODIF_SOL'
    }), _defineProperty(_post, "".concat(constant.GET_UPDATE_PED), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SITRK_MODIF_PED'
    }), _defineProperty(_post, "".concat(constant.LIST_APPROVERS), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SITRK_F_US_APR'
    }), _defineProperty(_post, "".concat(constant.GET_CONF_DOCS), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SITRK_F_CONF_DOCS'
    }), _defineProperty(_post, "".concat(constant.GET_CONF_PRIORITY), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SITRK_F_CONF_COMP'
    }), _defineProperty(_post, "".concat(constant.GET_BUYERS), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SITRK_F_BUYERS'
    }), _defineProperty(_post, "".concat(constant.GET_ATTACHMENT), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SITRK_CONT_ADJUNTO'
    }), _defineProperty(_post, "".concat(constant.POST_UPLOAD_ATTACHED), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SITRK_F_CREA_ADJUNTOS'
    }), _defineProperty(_post, "".concat(constant.PARAMETERS_SETTINGS), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SITRK_F_CONF_PARAMS'
    }), _defineProperty(_post, "".concat(constant.SAVE_BIDDING_POSITION), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SITRK_F_LICITA'
    }), _defineProperty(_post, "".concat(constant.GET_PAYMENT_DETAIL), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SITRK_BUSQ_SOLPAGO'
    }), _post),
    put: {}
  };
});