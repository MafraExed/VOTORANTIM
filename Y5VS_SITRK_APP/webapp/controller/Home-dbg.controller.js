"use strict";

sap.ui.define(['./BaseController', 'sap/ui/core/Fragment', 'sap/ui/Device'], function (BaseController, Fragment, Device) {
  return (
    /**
     * @class
     * @name BaseController.js
     * @extends sap.ui.core.mvc.Controller
     * @description - Controlador del Home
     *
     * @constructor
     * @public
     * @alias com.innova.sitrack.controller.BaseController
     *
     * @param {String} sId - id for the new control, generated automatically if no id is given
     * @param {Object} mSettings - initial settings for the new control
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    BaseController.extend('com.innova.sitrack.controller.Home', {
      /**
       * @function
       * @name onInit
       * @description - Se ejecuta cuando se renderiza por primera vez la vista.
       *
       * @private
       * @returns {void} - No retorna nada.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      onInit: function onInit() {
        this._oRouter = this.getRouter();
      },

      /**
       * @function
       * @name onPurchaseTrackingHandler
       * @description - Se ejecuta cuando se presiona sobre el Tile de Tracking de Compras.
       *
       * @private
       * @returns {void} - No retorna nada.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      onPurchaseTrackingHandler: function onPurchaseTrackingHandler() {
        this.getModel('appView').setProperty('/resetProcessForm', true);

        this._oRouter.navTo('purchaseTracking');
      },

      /**
       * @function
       * @name onSettingsPress
       * @description - Hanlder tile settings.
       *
       * @public
       * @returns {void} - Noting to return.
       *
       * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
       * @version 0.5.0
       */
      onSettingsPress: function onSettingsPress() {
        this._oRouter.navTo('settings');
      },

      /**
       * @function
       * @name onButtonAboutPress
       * @description - Encargado de motrar el dialogo de acerca de.
       *
       * @public
       * @returns {void} - No retorn nada.
       *
       * @author Edwin Valencia <evalencia@innovainternacional.biz>
       * @version 0.5.0
       */
      onButtonAboutPress: function onButtonAboutPress() {
        var _this = this;

        // load asynchronous XML fragment
        if (!this._oAboutDialog) {
          Fragment.load({
            id: this.getView().getId(),
            name: 'com.innova.sitrack.view.About',
            controller: this
          }).then(function (oDialog) {
            // connect dialog to the root view of this component (models, lifecycle)
            _this.getView().addDependent(oDialog);

            oDialog.addStyleClass(_this.getOwnerComponent().getContentDensityClass());
            oDialog.getEndButton().attachPress(function attachPress() {
              this.getParent().close();
            });
            oDialog.setStretch(Device.support.touch);
            oDialog.open();
            _this._oAboutDialog = oDialog;
          });
        } else {
          this._oAboutDialog.open();
        }
      }
    })
  );
});