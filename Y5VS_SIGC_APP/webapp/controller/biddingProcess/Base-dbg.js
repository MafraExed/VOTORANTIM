"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['../BaseController', 'com/innova/sigc/lib/searchHelp/externalSearchHelp', 'com/innova/sigc/lib/searchHelp/searchHelp', 'com/innova/sigc/model/constant', 'com/innova/sigc/service/http'],
/**
 * Module dependencies
 *
 */
function (BaseController, externalSearchHelp, searchHelp, constant, http) {
  return (
    /**
     * @class
     * @name SelectionCriteria.controller.js
     * @description - Controller for Selection Criteria
     *
     * @constructor
     * @public
     * @alias com.innova.sigc.controller.biddingProcess
     *
     * @param {String} sId - id for the new control, generated automatically if no id is given
     * @param {Object} mSettings - initial settings for the new control
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    BaseController.extend('com.innova.sigc.controller.biddingProcess.Base', {
      externalSearchHelp: externalSearchHelp,
      searchHelp: searchHelp,

      /* =========================================================== */

      /* begin: lifecycle methods                                    */

      /* =========================================================== */

      /* =========================================================== */

      /* finish: lifecycle methods                                   */

      /* =========================================================== */

      /* =========================================================== */

      /* begin: event handlers                                       */

      /* =========================================================== */

      /**
       * @function
       * @name onLoadItems
       * @description - Load items for Tipo Proc or CatProc
       *
       * @public
       * @param {sap.m.ComboBox | sap.m.MultiComboBox} oSource - Control that fired the event
       * @returns {void} - Noting to return.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      onLoadItems: function onLoadItems(oSource) {
        var name = oSource.getName();
        name = name.charAt(0).toUpperCase() + name.slice(1);
        Promise.resolve(oSource.setBusy(true)).then(this["_loadItems".concat(name)].bind(this)).catch(this.errorHandler.bind(this)).finally(oSource.setBusy.bind(oSource, false));
      },

      /* =========================================================== */

      /* finish: event handlers                                       */

      /* =========================================================== */

      /* =========================================================== */

      /* begin: internal methods                                     *
        /* =========================================================== */

      /**
       * @function
       * @name _loadItemsTipoProc
       * @description - Load items for Tipo Proc
       *
       * @private
       * @returns {Promise} - Returns a promise.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      _loadItemsTipoProc: function _loadItemsTipoProc() {
        var _this = this;

        if (this._oFormModel.getProperty('/valueHelp/tipoProc').length === 0) {
          return http.get("".concat(constant.api.PROCESS_TYPE_PATH, "?language=").concat(this.getModel('main').getProperty('/currentLanguage'))).then(function (_ref) {
            var data = _ref.data;

            _this._oFormModel.setProperty('/valueHelp/tipoProc', data);
          });
        }

        return Promise.resolve();
      },

      /**
       * @function
       * @name _loadItemsCatProc
       * @description - Load items for CatProc
       *
       * @private
       * @returns {Promise} - Returns a promise.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 1.0.0
       */
      _loadItemsCatProc: function _loadItemsCatProc() {
        var _this2 = this;

        if (this._oFormModel.getProperty('/valueHelp/catProc').length === 0) {
          return http.get("".concat(constant.api.PROCESS_CATEGORY_PATH, "?language=").concat(this.getModel('main').getProperty('/currentLanguage'))).then(function (_ref2) {
            var data = _ref2.data;

            _this2._oFormModel.setProperty('/valueHelp/catProc', data);
          });
        }

        return Promise.resolve();
      }
      /* =========================================================== */

      /* finish: internal methods                                    *
        /* =========================================================== */

    })
  );
});