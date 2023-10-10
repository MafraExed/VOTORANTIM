"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*!
 *  SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sigc/model/constant'], function (constant) {
  var _post;

  return {
    get: {},
    post: (_post = {}, _defineProperty(_post, "".concat(constant.GET_INITIALIZE), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SIGC_F_INITIALIZE'
    }), _defineProperty(_post, "".concat(constant.GET_SEARCH_HELP), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SIGC_F_SHELP'
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
    }), _defineProperty(_post, "".concat(constant.GET_VENDOR_HISTORY), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SIGC_F_V_BY_H'
    }), _defineProperty(_post, "".concat(constant.GET_IMPORT_SAP_USERS), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SIGC_F_IMPORT_USERS'
    }), _defineProperty(_post, "".concat(constant.GET_CREATE_ORDER), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SIGC_F_PO_CREATE'
    }), _defineProperty(_post, "".concat(constant.GET_CONVERT_TO_CURRENCY), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SIGC_F_CONVERT_TO_CURRENCY'
    }), _defineProperty(_post, "".concat(constant.GET_LONGTEXT_PEDTEXT), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SIGC_F_TEXT'
    }), _defineProperty(_post, "".concat(constant.GET_DELETE_ORDER), {
      Mandt: '',
      Name: 'IV_FUNCNAME',
      Value: 'ZFMM_SIGC_F_PO_DELETE'
    }), _post),
    put: {}
  };
});