"use strict";

/*!
 *  SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['./dao/ZFMM_SITRK_F_BUSQUEDA_DOC', './dao/ZFMM_SITRK_F_EMAIL_PROV', './dao/ZFMM_SITRK_F_GR_REMINDER', './dao/ZFMM_SITRK_F_INITIALIZE', './dao/ZFMM_SITRK_F_LAYOUT', './dao/ZFMM_SITRK_F_PR_ASSIGN', './dao/ZFMM_SITRK_F_PR_RETURN', './dao/ZFMM_SITRK_F_SHELP', './dao/ZFMM_SITRK_F_VARIANT', './dao/ZFMM_SITRK_F_APROB', './dao/ZFMM_SITRK_MODIF_PED', './dao/ZFMM_SITRK_MODIF_SOL', './dao/ZFMM_SITRK_F_US_APR', './dao/ZFMM_SITRK_F_BUYERS', './dao/ZFMM_SITRK_F_CONF_DOCS', './dao/ZFMM_SITRK_F_CONF_COMP', './dao/ZFMM_SITRK_CONT_ADJUNTO', './dao/ZFMM_SITRK_F_CREA_ADJUNTOS', './dao/ZFMM_SITRK_F_CONF_PARAMS', './dao/ZFMM_SITRK_F_LICITA', './dao/ZFMM_SITRK_BUSQ_SOLPAGO'], function (ZFMM_SITRK_F_BUSQUEDA_DOC, ZFMM_SITRK_F_EMAIL_PROV, ZFMM_SITRK_F_GR_REMINDER, ZFMM_SITRK_F_INITIALIZE, ZFMM_SITRK_F_LAYOUT, ZFMM_SITRK_F_PR_ASSIGN, ZFMM_SITRK_F_PR_RETURN, ZFMM_SITRK_F_SHELP, ZFMM_SITRK_F_VARIANT, ZFMM_SITRK_F_APROB, ZFMM_SITRK_MODIF_PED, ZFMM_SITRK_MODIF_SOL, ZFMM_SITRK_F_US_APR, ZFMM_SITRK_F_BUYERS, ZFMM_SITRK_F_CONF_DOCS, ZFMM_SITRK_F_CONF_COMP, ZFMM_SITRK_CONT_ADJUNTO, ZFMM_SITRK_F_CREA_ADJUNTOS, ZFMM_SITRK_F_CONF_PARAMS, ZFMM_SITRK_F_LICITA, ZFMM_SITRK_BUSQ_SOLPAGO) {
  return {
    /**
     * @function
     * @name ZFMM_SITRK_F_BUSQUEDA_DOCService
     * @description - Ejecuta funciÃ³n buscar documentos de compras
     *
     * @public
     * @param {object} req - Request
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    ZFMM_SITRK_F_BUSQUEDA_DOCService: function ZFMM_SITRK_F_BUSQUEDA_DOCService(_, res) {
      return ZFMM_SITRK_F_BUSQUEDA_DOC(res);
    },

    /**
     * @function
     * @name ZFMM_SITRK_F_INITIALIZEService
     * @description - Ejecuta funciÃ³n initialize de la aplicaciÃ³n
     *
     * @public
     * @param {object} req - Request
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    ZFMM_SITRK_F_INITIALIZEService: function ZFMM_SITRK_F_INITIALIZEService(_, res) {
      return ZFMM_SITRK_F_INITIALIZE(res);
    },

    /**
     * @function
     * @name ZFMM_SITRK_F_PR_ASSIGNService
     * @description - Ejecuta funciÃ³n asignar comprador a la solicitud de pedido
     *
     * @public
     * @param {object} req - Request
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    ZFMM_SITRK_F_PR_ASSIGNService: function ZFMM_SITRK_F_PR_ASSIGNService(_, res) {
      return ZFMM_SITRK_F_PR_ASSIGN(res);
    },

    /**
     * @function
     * @name ZFMM_SITRK_F_PR_RETURNService
     * @description - Ejecuta funciÃ³n devolver la solicitud de pedido
     *
     * @public
     * @param {object} req - Request
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    ZFMM_SITRK_F_PR_RETURNService: function ZFMM_SITRK_F_PR_RETURNService(_, res) {
      return ZFMM_SITRK_F_PR_RETURN(res);
    },

    /**
     * @function
     * @name ZFMM_SITRK_CONT_ADJUNTOService
     * @description - Ejecuta funciÃ³n devolver contenido de losadjuntos
     *
     * @public
     * @param {object} req - Request
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    ZFMM_SITRK_CONT_ADJUNTOService: function ZFMM_SITRK_CONT_ADJUNTOService(_, res) {
      return ZFMM_SITRK_CONT_ADJUNTO(res);
    },

    /* =========================================================== */

    /* begin: Ayudas de busqueda                                   */

    /* =========================================================== */

    /**
     * @function
     * @name ZFMM_SITRK_F_SHELPService
     * @description - Ejecuta funciÃ³n ayuda de busqueda
     *
     * @public
     * @param {object} req - Request
     * @param {object} res - RespuestÃ¡ del servicio
     * @param {object} options - Opciones para contruir la data
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    ZFMM_SITRK_F_SHELPService: function ZFMM_SITRK_F_SHELPService(req, res, options) {
      return ZFMM_SITRK_F_SHELP(req, res, options);
    },

    /* =========================================================== */

    /* finish: Ayudas de busqueda                                  */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: Layout / Disposicion                                 */

    /* =========================================================== */

    /**
     * @function
     * @name ZFMM_SITRK_F_LAYOUTService
     * @description - Ejecuta funciÃ³n ayuda de busqueda
     *
     * @public
     * @param {object} req - Request
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    ZFMM_SITRK_F_LAYOUTService: function ZFMM_SITRK_F_LAYOUTService(_, res) {
      return ZFMM_SITRK_F_LAYOUT(res);
    },

    /* =========================================================== */

    /* finish: Layout / Disposicion                                */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: Recordatorio                                         */

    /* =========================================================== */

    /**
     * @function
     * @name ZFMM_SITRK_F_EMAIL_PROVService
     * @description - Ejecuta funciÃ³n obtener correos de proveedores
     *
     * @public
     * @param {object} req - Request
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    ZFMM_SITRK_F_EMAIL_PROVService: function ZFMM_SITRK_F_EMAIL_PROVService(_, res) {
      return ZFMM_SITRK_F_EMAIL_PROV(res);
    },

    /**
     * @function
     * @name ZFMM_SITRK_F_GR_REMINDERService
     * @description - Ejecuta funciÃ³n recordatorio
     *
     * @public
     * @param {object} req - Request
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    ZFMM_SITRK_F_GR_REMINDERService: function ZFMM_SITRK_F_GR_REMINDERService(_, res) {
      return ZFMM_SITRK_F_GR_REMINDER(res);
    },

    /* =========================================================== */

    /* finish: Recordatorio                                        */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: Variant                                              */

    /* =========================================================== */

    /**
     * @function
     * @name ZFMM_SITRK_F_VARIANTService
     * @description - Ejecuta funciÃ³n ayuda de busqueda
     *
     * @public
     * @param {object} req - Request
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    ZFMM_SITRK_F_VARIANTService: function ZFMM_SITRK_F_VARIANTService(_, res) {
      return ZFMM_SITRK_F_VARIANT(res);
    },

    /* =========================================================== */

    /* finish: Variante                                            */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: Actualizar documentos                                */

    /* =========================================================== */

    /**
     * @function
     * @name ZFMM_SITRK_MODIF_PEDService
     * @description - Actualizar pedidos
     *
     * @public
     * @param {object} req - Request
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    ZFMM_SITRK_MODIF_PEDService: function ZFMM_SITRK_MODIF_PEDService(_, res) {
      return ZFMM_SITRK_MODIF_PED(res);
    },

    /**
     * @function
     * @name ZFMM_SITRK_MODIF_SOLService
     * @description - Actualizar solicitudes de pedido
     *
     * @public
     * @param {object} req - Request
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    ZFMM_SITRK_MODIF_SOLService: function ZFMM_SITRK_MODIF_SOLService(_, res) {
      return ZFMM_SITRK_MODIF_SOL(res);
    },

    /* =========================================================== */

    /* finish: Actualizar documentos                               */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: Aprovadores                                          */

    /* =========================================================== */

    /**
     * @function
     * @name ZFMM_SITRK_F_APROBService
     * @description - Ejecuta funciÃ³n buscar aprobadores
     *
     * @public
     * @param {object} req - Request
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    ZFMM_SITRK_F_APROBService: function ZFMM_SITRK_F_APROBService(_, res) {
      return ZFMM_SITRK_F_APROB(res);
    },

    /**
     * @function
     * @name ZFMM_SITRK_F_US_APRService
     * @description - Ejecuta funciÃ³n buscar aprobadores
     *
     * @public
     * @param {object} req - Request
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    ZFMM_SITRK_F_US_APRService: function ZFMM_SITRK_F_US_APRService(_, res) {
      return ZFMM_SITRK_F_US_APR(res);
    },

    /* =========================================================== */

    /* finish: Aprovadores                                         */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: Asignar Compradores                                  */

    /* =========================================================== */

    /**
     * @function
     * @name ZFMM_SITRK_F_BUYERSService
     * @description - Search buyers
     *
     * @public
     * @param {object} res - Service response
     * @returns {object}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    ZFMM_SITRK_F_BUYERSService: function ZFMM_SITRK_F_BUYERSService(_, res) {
      return ZFMM_SITRK_F_BUYERS(res);
    },

    /**
     * @function
     * @name ZFMM_SITRK_F_CONF_DOCSService
     * @description - Conf docs
     *
     * @public
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    ZFMM_SITRK_F_CONF_DOCSService: function ZFMM_SITRK_F_CONF_DOCSService(_, res) {
      return ZFMM_SITRK_F_CONF_DOCS(res);
    },

    /**
     * @function
     * @name ZFMM_SITRK_F_CONF_COMPService
     * @description - Conf comp
     *
     * @public
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    ZFMM_SITRK_F_CONF_COMPService: function ZFMM_SITRK_F_CONF_COMPService(_, res) {
      return ZFMM_SITRK_F_CONF_COMP(res);
    },

    /**
     * @function
     * @name ZFMM_SITRK_F_CREA_ADJUNTOSService
     * @description - Ejecuta funciÃ³n cargar adjuntos
     *
     * @public
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    ZFMM_SITRK_F_CREA_ADJUNTOSService: function ZFMM_SITRK_F_CREA_ADJUNTOSService(_, res) {
      return ZFMM_SITRK_F_CREA_ADJUNTOS(res);
    },

    /**
     * @function
     * @name ZSITRK_F_CONF_PARAMSService
     * @description - Ejecuta funciÃ³n cargar adjuntos
     *
     * @public
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    ZFMM_SITRK_F_CONF_PARAMSService: function ZFMM_SITRK_F_CONF_PARAMSService(_, res) {
      return ZFMM_SITRK_F_CONF_PARAMS(res);
    },

    /**
     * @function
     * @name ZFMM_SITRK_F_LICITAService
     * @description - Ejecuta funciÃ³n cargar adjuntos
     *
     * @public
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    ZFMM_SITRK_F_LICITAService: function ZFMM_SITRK_F_LICITAService(_, res) {
      return ZFMM_SITRK_F_LICITA(res);
    },

    /**
     * @function
     * @name ZFMM_SITRK_BUSQ_SOLPAGOService
     * @description - Ejecuta funciÃ³n cargar adjuntos
     *
     * @public
     * @param {object} res - RespuestÃ¡ del servicio
     * @returns {object}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    ZFMM_SITRK_BUSQ_SOLPAGOService: function ZFMM_SITRK_BUSQ_SOLPAGOService(_, res) {
      return ZFMM_SITRK_BUSQ_SOLPAGO(res);
    }
    /* =========================================================== */

    /* finish: Asignar Compradores                                 */

    /* =========================================================== */

  };
});