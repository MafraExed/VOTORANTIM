"use strict";

sap.ui.define(['sap/ui/core/mvc/Controller'],
/**
 * Module dependencies
 *
 * @param {typeof sap.ui.core.mvc.Controller} Controller
 */
function (Controller) {
  return (
    /**
     * @class
     * @name BaseController.js
     * @extends sap.ui.core.mvc.Controller
     * @description - Controlador de base de la aplicaciÃ³n
     *
     * @constructor
     * @public
     * @namespace com.innova.sigc.controller.BaseController
     *
     * @param {String} sId - id for the new control, generated automatically if no id is given
     * @param {Object} mSettings - initial settings for the new control
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    Controller.extend('com.innova.sili.controller.BaseController', {
      /* =========================================================== */

      /* begin: Utility functions of controller                      */

      /* =========================================================== */

      /**
       * @function
       * @name getRouter
       * @description - Convenience method for accessing the router in every controller of the application.
       *
       * @public
       * @returns {sap.ui.core.routing.Router} - the router for this component
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      getRouter: function getRouter() {
        return (
          /** @type {any} */
          this.getOwnerComponent().getRouter()
        );
      },

      /**
       * @function
       * @name getModel
       * @description - Convenience method for getting the view model by name in every controller of the application.
       *
       * @public
       * @param {string} sName - the model name
       * @returns {sap.ui.model.Model} the model instance
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      getModel: function getModel(sName) {
        return this.getView().getModel(sName);
      },

      /**
       * @function
       * @name setModel
       * @description - Convenience method for setting the view model in every controller of the application.
       *
       * @public
       * @param {sap.ui.model.Model} oModel - the model instance
       * @param {string} sName - the model name
       * @returns {sap.ui.core.mvc.View} - the view instance
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      setModel: function setModel(oModel, sName) {
        return this.getView().setModel(oModel, sName);
      },

      /**
       * @function
       * @name getResourceBundle
       * @description - Convenience method for getting the resource bundle.
       *
       * @public
       * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      getResourceBundle: function getResourceBundle() {
        return (
          /** @type {*} component.js */
          this.getOwnerComponent().getModel('i18n').getResourceBundle()
        );
      },

      /**
       * @function
       * @name errorHandler
       * @description - Funcion que mustra informaciÃ³n de errores al usuario.
       *
       * @public
       * @param {Object}  oError - Objeto del Error
       * @returns {void} - Noting to return.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      errorHandler: function errorHandler(oError) {
        this.getOwnerComponent().errorHandler(oError, this);
      },

      /* =========================================================== */

      /* finish: Utility functions of controller                     */

      /* =========================================================== */

      /* =========================================================== */

      /* begin: event handlers                                       */

      /* =========================================================== */

      /**
       * @function
       * @name hideLoader
       * @description - Se encarga de ocultar el loader del index.html.
       *
       * @public
       * @param {int} iDelay - Delay para ocultar el loader.
       * @returns {void} - Noting to return.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      hideLoader: function hideLoader(iDelay) {
        this.getOwnerComponent().hideLoader(iDelay);
      },

      /**
       * @function
       * @name showLoader
       * @description - Se encarga de mostrar el loader del index.html.
       *
       * @public
       * @returns {void} - Noting to return.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      showLoader: function showLoader() {
        this.getOwnerComponent().showLoader();
      },

      /**
       * @function
       * @name onNavBack()
       * @description - Event handler for navigating back.
       *  It there is a history entry we go one step back in the browser history
       *  If not, it will replace the current entry of the browser history with the master route.
       * @public
       * @returns {void} - No retorna nada
       *
       * @author Edwin Valencia <evalecia@innovainternacional.biz>
       * @version 1.0.0
       */
      onNavBack: function onNavBack(route) {
        var replace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        if (typeof route === 'string') {
          this.getRouter().navTo(route, {}, {}, replace);
        } else {
          this.getOwnerComponent().onNavBack();
        }
      },

      /**
       * @function
       * @name getMessageTextPool
       * @description - Retorna un mensaje del modelos de los tÃ­tulos globales de la aplicacion.
       *
       * @public
       * @param {string} sKey String con el nombre de la propiedad a buscar.
       * @returns {string} con el texto encontrado, o error sino se encuentra.
       *
       * @author Edwin Valencia <evalecia@innovainternacional.biz>
       * @version 1.0.0
       */
      getMessageTextPool: function getMessageTextPool(sKey) {
        return (
          /** @type {any} */
          this.getOwnerComponent().getMessageTextPool(sKey)
        );
      }
      /* =========================================================== */

      /* finish: event handlers                                      */

      /* =========================================================== */

    })
  );
});