"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['../BaseController', 'com/innova/util/isEmpty', 'com/innova/factory/payment/payment'],
/**
 * Module dependencies
 *
 */
function (BaseController, isEmpty, payment)
/**
 * @class
 * @name Manage.controller.js
 * @description - Controller for Manage
 *
 * @constructor
 * @public
 * @alias com.innova.sitrack.controller.purchaseTracking
 *
 * @param {String} sId - id for the new control, generated automatically if no id is given
 * @param {Object} mSettings - initial settings for the new control
 * @returns {void} - Noting to return.
 *
 * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
 * @version 0.5.0
 */
{
  BaseController.extend('com.innova.sitrack.controller.paymentProcess.DetailPayment', {
    /* =========================================================== */

    /* begin: lifecycle methods                                    */

    /* =========================================================== */
    payment: payment,

    /**
     * @function
     * @name onInit
     * @description - Se ejecuta despuÃ©s de que se renderizo la vista.
     *
     * @private
     * @returns {void} - Noting to return.
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    onInit: function onInit() {
      this._oPage = this.byId('page');
      this._oRouter = this.getRouter();

      this._oRouter.getRoute('purchaseTrackingPaymentDetail').attachMatched(this._onRouteMatched, this);
    },

    /* =========================================================== */

    /* finish: lifecycle methods                                   */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */

    /**
     * @function
     * @name _onRouteMatched
     * @description - Se ejecuta cuando se navega a la vista.
     *
     * @private
     * @returns {void} - Noting to return.
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 0.5.0
     */
    _onRouteMatched: function _onRouteMatched() {
      this._oPaymentModel = this.getModel('payment');

      var _this$_oPaymentModel$ = this._oPaymentModel.getData(),
          items = _this$_oPaymentModel$.items;

      if (isEmpty(items)) {
        this.getModel('appView').setProperty('/resetProcessForm', true);
        this.getRouter().navTo('purchaseTracking', {}, true);
      }
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */

    /* =========================================================== */

    /* finish: event handlers                                       */

    /* =========================================================== */

  });
});