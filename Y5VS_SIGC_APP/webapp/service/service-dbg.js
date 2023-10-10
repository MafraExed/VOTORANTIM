"use strict";

/*!
 *  SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['./dao/ZFMM_SIGC_F_CONVERT_TO_CURRENCY', './dao/ZFMM_SIGC_F_IMPORT_USERS', './dao/ZFMM_SIGC_F_INITIALIZE', './dao/ZFMM_SIGC_F_PO_CREATE', './dao/ZFMM_SIGC_F_SHELP', './dao/ZFMM_SITRK_F_BUYERS', './dao/ZFMM_SITRK_F_CONF_DOCS', './dao/ZFMM_SITRK_F_CONF_COMP', './dao/ZFMM_SIGC_F_V_BY_H', './dao/ZFMM_SIGC_F_TEXT', './dao/ZFMM_SIGC_F_PO_DELETE'], function (ZFMM_SIGC_F_CONVERT_TO_CURRENCY, ZFMM_SIGC_F_IMPORT_USERS, ZFMM_SIGC_F_INITIALIZE, ZFMM_SIGC_F_PO_CREATE, ZFMM_SIGC_F_SHELP, ZFMM_SITRK_F_BUYERS, ZFMM_SITRK_F_CONF_DOCS, ZFMM_SITRK_F_CONF_COMP, ZFMM_SIGC_F_V_BY_H, ZFMM_SIGC_F_TEXT, ZFMM_SIGC_F_PO_DELETE) {
  return {
    /**
     * @function
     * @name ZFMM_SIGC_F_INITIALIZEService
     * @description - Ejecuta funciÃ³n initialize de la aplicaciÃ³n
     *
     * @public
     * @param {object} _ - Request
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    ZFMM_SIGC_F_INITIALIZEService: function ZFMM_SIGC_F_INITIALIZEService(_, res) {
      return ZFMM_SIGC_F_INITIALIZE(res);
    },

    /* =========================================================== */

    /* begin: Importar usuarios desde SAP                          */

    /* =========================================================== */

    /**
     * @function
     * @name ZFMM_SIGC_F_IMPORT_USERSService
     * @description - Ejecuta funciÃ³n initialize de la aplicaciÃ³n
     *
     * @public
     * @param {object} _ - Request
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    ZFMM_SIGC_F_IMPORT_USERSService: function ZFMM_SIGC_F_IMPORT_USERSService(_, res) {
      return ZFMM_SIGC_F_IMPORT_USERS(res);
    },

    /* =========================================================== */

    /* finish: Importar usuarios desde SAP                         */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: Ayudas de busqueda                                   */

    /* =========================================================== */

    /**
     * @function
     * @name ZFMM_SIGC_F_SHELPService
     * @description - Ejecuta funciÃ³n ayuda de busqueda
     *
     * @public
     * @param {object} req - Request
     * @param {object} res - RespuestÃ¡ del servicio
     * @param {object} options - Opciones para contruir la data
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    ZFMM_SIGC_F_SHELPService: function ZFMM_SIGC_F_SHELPService(req, res, options) {
      return ZFMM_SIGC_F_SHELP(req, res, options);
    },

    /* =========================================================== */

    /* finish: Ayudas de busqueda                                  */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: Settings                                             */

    /* =========================================================== */

    /**
     * @function
     * @name ZFMM_SITRK_F_CONF_DOCSService
     * @description - Conf docs
     *
     * @public
     * @param {object} _ - Request
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Dev Dayal <UpWork>
     * @version 1.0.0
     */
    ZFMM_SITRK_F_CONF_DOCSService: function ZFMM_SITRK_F_CONF_DOCSService(_, res) {
      return ZFMM_SITRK_F_CONF_DOCS(res);
    },

    /**
     * @function
     * @name ZSITRK_F_CONF_COMPService
     * @description - Conf comp
     *
     * @public
     * @param {object} _ - Request
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Dev Dayal <UpWork>
     * @version 1.0.0
     */
    ZFMM_SITRK_F_CONF_COMPService: function ZFMM_SITRK_F_CONF_COMPService(_, res) {
      return ZFMM_SITRK_F_CONF_COMP(res);
    },

    /**
     * @function
     * @name ZFMM_SITRK_F_BUYERSService
     * @description - Search buyers
     *
     * @public
     * @param {object} _ - Request
     * @param {object} res - Service response
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    ZFMM_SITRK_F_BUYERSService: function ZFMM_SITRK_F_BUYERSService(_, res) {
      return ZFMM_SITRK_F_BUYERS(res);
    },

    /**
     * @function
     * @name ZFMM_SIGC_F_V_BY_HService
     * @description - Search buyers
     *
     * @public
     * @param {object} _ - Request
     * @param {object} res - Service response
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    ZFMM_SIGC_F_V_BY_HService: function ZFMM_SIGC_F_V_BY_HService(_, res) {
      return ZFMM_SIGC_F_V_BY_H(res);
    },

    /* =========================================================== */

    /* finish: Settings                                            */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: CreatePO                                             */

    /* =========================================================== */

    /**
     * @function
     * @name ZFMM_SIGC_F_PO_CREATEService
     * @description - Create PO
     *
     * @public
     * @param {object} _ - Request
     * @param {object} res - Service response
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    ZFMM_SIGC_F_PO_CREATEService: function ZFMM_SIGC_F_PO_CREATEService(_, res) {
      return ZFMM_SIGC_F_PO_CREATE(res);
    },

    /**
     * @function
     * @name ZFMM_SIGC_F_PO_DELETEService
     * @description - Delete PO
     *
     * @public
     * @param {object} _ - Request
     * @param {object} res - Service response
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    ZFMM_SIGC_F_PO_DELETEService: function ZFMM_SIGC_F_PO_DELETEService(_, res) {
      return ZFMM_SIGC_F_PO_DELETE(res);
    },

    /* =========================================================== */

    /* finish: CreatePO                                            */

    /* =========================================================== */

    /* =========================================================== */

    /* begin:  Convert to currency                                             */

    /* =========================================================== */

    /**
     * @function
     * @name ZFMM_SIGC_F_CONVERT_TO_CURRENCYService
     * @description -  Convert to currency
     *
     * @public
     * @param {object} _ - Request
     * @param {object} res - Service response
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    ZFMM_SIGC_F_CONVERT_TO_CURRENCYService: function ZFMM_SIGC_F_CONVERT_TO_CURRENCYService(_, res) {
      return ZFMM_SIGC_F_CONVERT_TO_CURRENCY(res);
    },

    /* =========================================================== */

    /* finish:  Convert to currency                                */

    /* =========================================================== */

    /* =========================================================== */

    /* begin:  Texto Largo y Texto Pedido de Compras               */

    /* =========================================================== */

    /**
     * @function
     * @name ZFMM_SIGC_F_TEXTService
     * @description -  Get long text and pedText
     *
     * @public
     * @param {object} _ - Request
     * @param {object} res - Service response
     * @returns {object}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    ZFMM_SIGC_F_TEXTService: function ZFMM_SIGC_F_TEXTService(_, res) {
      return ZFMM_SIGC_F_TEXT(res);
    }
    /* =========================================================== */

    /* finish:  Texto Largo y Texto Pedido de Compras              */

    /* =========================================================== */

  };
});