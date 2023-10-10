"use strict";

// @ts-nocheck

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
// Provides enumeration com.innova.sigc.model.Constant
sap.ui.define(
/**
 * Constantes.
 *
 * @enum {string}
 * @public
 * @alias com.innova.sigc.model.Constant
 */
function () {
  return {
    /**
     * Obtener initialize
     * @public
     */
    // GET_INITIALIZE: 'FioriSet', // Para Innova
    GET_INITIALIZE: 'ET_VSMM_FIORISet',
    // Para Acerias
    GET_CONF_DOCS: 'ZSITRK_F_CONF_DOCS',
    GET_CONF_PRIORITY: 'ZSITRK_F_CONF_COMP',

    /**
     * Obtener compradores
     * @public
     */
    GET_BUYERS: 'ZSITRK_F_BUYERS',

    /**
     * Obtener Proveedor
     * @public
     */
    GET_VENDOR_HISTORY: 'ZSIGC_F_V_BY_H',

    /**
     * Import sap users
     * @public
     */
    GET_IMPORT_SAP_USERS: 'ZSIGC_F_IMPORT_USERS',

    /**
     * Create order
     * @public
     */
    GET_CREATE_ORDER: 'ZSIGC_F_PO_CREATE',

    /**
     * Convert to currency
     * @public
     */
    GET_CONVERT_TO_CURRENCY: 'ZSIGC_F_CONVERT_TO_CURRENCY',

    /**
     * Convert to currency
     * @public
     */
    GET_LONGTEXT_PEDTEXT: 'ZSIGC_F_TEXT',

    /**
     * Delete order
     * @public
     */
    GET_DELETE_ORDER: 'ZSIGC_F_PO_DELETE',

    /**
     * Endpoints API
     * @public
     */
    api: {
      ANSWER_QUESTION_PATH: 'process-qa-an',
      ATTACHMENTS_PATH: 'attachments',
      CAT_DESC: 'cat_des',
      CHANGE_QUESTION_TYPE_PATH: 'change-type',
      CUSTOM_TEMPLATE: 'custom-template',
      DESCRIPTION_PROCESS_TYPE: 'description-process-type',
      EMAILS_PATH: 'emails',
      EVALUATION_CRITERIA_PATH: 'evaluation-criteria',
      EVALUATORS_CHANGE_STATUS_PATH: 'user/change-state',
      EVALUATORS_PATH: 'user/evaluators',
      EVALUATORS_RESEND_INVITATION_MAIL_PATH: 'user/mail/registration/evaluator/resend',
      EVALUATORS_SAP_PATH: 'user/evaluators/sap',
      GET_COUNTRIES_HELP: 'countries-descriptions',
      GET_REGIONS_HELP: 'region',
      GET_TYPEID_HELP: 'tax-id-types-descriptions',
      GET_VENDOR_DATA_PATH: 'vendors/category',
      GLOBAL_CALIFICATION: 'global-calification',
      HEADER_CRITERIA: 'header-criteria',
      OFFER_DELETE_PATH: 'offers/many',
      OFFERS_PATH: 'offers',
      POSITION_CRITERIA: 'position-criteria',
      POSITION_OFFERS_CANT_ASIGN_PATH: 'position-offers/cant-asig',
      POSITION_OFFERS_COMMENT_PATH: 'position-offers/comments',
      POSITION_OFFERS_REACTIVATE_PATH: 'position-offers/reactivate',
      POSITION_OFFERS_REJECT_PATH: 'position-offers/reject',
      PRICES_PER_ROUND: 'prices-per-round',
      PROCESS_CATEGORY_PATH: 'process-category',
      PROCESS_FILTER_PATH: "process/filter",
      PROCESS_PATH: 'process',
      PROCESS_POSITION_PATH: 'process-position',
      PROCESS_TEXT_TYPE: 'text-type-process',
      PROCESS_TYPE_PATH: 'process-type',
      PURCHASE_ORDER: 'new-purchase-order',
      DELETE_PURCHASE_ORDER: 'remove-purchase-order',
      VENDOR_ID_PATH: 'vendors/search',
      VENDOR_INVITATION_PATH: 'offers/vendor/invitation',
      VENDOR_PATH: 'vendors/all',
      VENDORS_PATH: 'vendors',
      OFFERS_REJECT_PATH: 'offers/reject',
      OFFERS_REACTIVATE_PATH: 'offers/reactivate',
      OFFERS_RESET_PATH: 'offers/reset'
    },

    /**
     * Obtener llave para criterio precio
     * @public
     */
    CRITERIA_PRICE_KEY: 'Const.0001'
  };
},
/* bExport= */
true);