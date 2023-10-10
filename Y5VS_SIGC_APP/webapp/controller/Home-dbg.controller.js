"use strict";

sap.ui.define(['./BaseController'], function (BaseController) {
  return (
    /**
     * @class
     * @name BaseController.js
     * @extends sap.ui.core.mvc.Controller
     * @description - Controlador del Home
     *
     * @constructor
     * @public
     * @alias com.innova.sigc.controller.BaseController
     *
     * @param {String} sId - id for the new control, generated automatically if no id is given
     * @param {Object} mSettings - initial settings for the new control
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    BaseController.extend('com.innova.sigc.controller.Home', {
      /**
       * @function
       * @name onInit
       * @description - Se ejecuta cuando se renderiza por primera vez la vista.
       *
       * @private
       * @returns {void} - Noting to return.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      onInit: function onInit() {
        this._oRouter = this.getRouter();
      },

      /**
       * @function
       * @name onBiddingProcess
       * @description - Hanlder tile bidding process.
       *
       * @public
       * @returns {void} - Noting to return.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      onBiddingProcess: function onBiddingProcess() {
        this._oRouter.navTo('biddingProcess');
      },

      /**
       * @function
       * @name onSettingsPress
       * @description - Hanlder tile settings.
       *
       * @public
       * @returns {void} - Noting to return.
       *
       * @author Dev Dayal
       * @version 1.0.0
       */
      onSettingsPress: function onSettingsPress() {
        this._oRouter.navTo('settings');
      }
    })
  );
});