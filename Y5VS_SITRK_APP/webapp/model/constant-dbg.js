"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
// Provides enumeration com.innova.sitrack.model.Constant
sap.ui.define(
/**
 * Constantes.
 *
 * @enum {string}
 * @public
 * @alias com.innova.sitrack.model.Constant
 */
function () {
  return {
    /**
     * Obtener initialize
     * @public
     */
    GET_INITIALIZE: 'ET_VSMM_FIORISet',

    /**
     * Obtener procesos seleccionados
     * @public
     */
    GET_PROCESS_SELECTED: 'process-selected',

    /**
     * Asignar usuario solicitud de pedido
     * @public
     */
    GET_ASSIGN_USER: 'assign-user',

    /**
     * Devolver solicitud de pedido
     * @public
     */
    GET_RETURN_SOL_PED: 'return-sol-ped',

    /**
     * Devolver solicitud de pedido
     * @public
     */
    GET_SEARCH_HELP: 'search-help',

    /**
     * Guardar layout
     * @public
     */
    GET_LAYOUT: 'layout',

    /**
     * Guardar layout
     * @public
     */
    GET_EMAIL_PROV: 'email-prov',

    /**
     * Guardar layout
     * @public
     */
    GET_REMINDER: 'reminder',

    /**
     * Obtener variante
     * @public
     */
    GET_VARIANT: 'variant',

    /**
     * Actualizar SolPed
     * @public
     */
    GET_UPDATE_SOL_PED: 'update-solped',

    /**
     * Actualizar Ped
     * @public
     */
    GET_UPDATE_PED: 'update-ped',

    /**
     * Nombre funciÃ³n para proceso de tracking
     * @public
     */
    FUNC_PROCESS: 'MONITOR',

    /**
     * PaginaciÃ³n tracking de compras
     * @public
     */
    PURCHASE_TRACKING_PER_PAGE: 20,

    /**
     * Obtener aprobacioness de procesos seleccionados
     * @public
     */
    GET_APPROVALS_SELECTED: 'approvals',

    /**
     * Obtener aprobacioness de procesos seleccionados
     * @public
     */
    LIST_APPROVERS: 'list-approvals',

    /**
     * Obtener tablas de configuraciÃ³n
     * @public
     */
    PROCESS_TYPE_PATH: 'process-type',
    GET_CONF_DOCS: 'ZSITRK_F_CONF_DOCS',
    GET_CONF_PRIORITY: 'ZSITRK_F_CONF_COMP',
    GET_BUYERS: 'ZSITRK_F_BUYERS',

    /**
     * Obtener contenido de adjuntos
     * @public
     */
    GET_ATTACHMENT: 'get-attachment',

    /**
     * Cargar contenido de adjuntos
     * @public
     */
    POST_UPLOAD_ATTACHED: 'post-upload-attached',

    /**
     * Cargar contenido de adjuntos
     * @public
     */
    PARAMETERS_SETTINGS: 'parameter_settings',
    SAVE_BIDDING_POSITION: 'save-bidding-position',
    GET_PAYMENT_DETAIL: 'payment-detail',
    api: {
      ANSWER_QUESTION_PATH: 'process-qa-an',
      ATTACHMENTS_PATH: 'attachments',
      CAT_DESC: 'cat_des',
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
      NEW_PROCESS_PATH: 'process/sap',
      OFFER_DELETE_PATH: 'offers/many',
      OFFERS_PATH: 'offers',
      POSITION_CRITERIA: 'position-criteria',
      POSITION_OFFERS_CANT_ASIGN_PATH: 'position-offers/cant-asig',
      POSITION_OFFERS_COMMENT_PATH: 'position-offers/comments',
      POSITION_OFFERS_REACTIVATE_PATH: 'position-offers/reactivate',
      POSITION_OFFERS_REJECT_PATH: 'position-offers/reject',
      POSITION_BIDDING_PATH: 'process-position',
      PRICES_PER_ROUND: 'prices-per-round',
      PROCESS_CATEGORY_PATH: 'process-category',
      PROCESS_FILTER_PATH: "process/filter",
      PROCESS_PATH: 'process',
      PROCESS_POSITION_PATH: 'process-position',
      PROCESS_TEXT_TYPE: 'text-type-process',
      PROCESS_TYPE_PATH: 'process-type',
      VENDOR_ID_PATH: 'vendors/search',
      VENDOR_INVITATION_PATH: 'offers/vendor/invitation',
      VENDOR_PATH: 'vendors/all',
      VENDORS_PATH: 'vendors',
      OFFERS_REJECT_PATH: 'offers/reject',
      OFFERS_REACTIVATE_PATH: 'offers/reactivate'
    }
  };
},
/* bExport= */
true);