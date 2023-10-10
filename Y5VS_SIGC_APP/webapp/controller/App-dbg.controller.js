"use strict";

sap.ui.define(['./BaseController', 'com/innova/sigc/utils/isEmpty', 'sap/ui/model/json/JSONModel'], function (BaseController, isEmpty, JSONModel) {
  return BaseController.extend('com.innova.sigc.controller.App', {
    /**
     * @function
     * @name onInit
     * @description - Se ejecuta cuando se inicia la aplicaciÃ³n
     *
     * @private
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onInit: function onInit() {
      this.setModel(new JSONModel({
        busy: false,
        delay: 0
      }), 'appView');
      this.getRouter().attachRouteMatched(this._onObjectMatched, this);
    },

    /**
     * @function
     * @name _onObjectMatched
     * @description - Handler for route matched
     *
     * @private
     * @param {sap.ui.base.Event} oEvent - An Event object consisting of an id, a source and a map of parameters.
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _onObjectMatched: function _onObjectMatched(oEvent) {
      var sRouteName = oEvent.getParameter('name');

      if (sRouteName === 'manageBiddingProcess') {
        var mainModel = this.getModel('main');
        var mail = mainModel.getProperty('/sysParams/SMTP_ADDR');

        if (isEmpty(mail)) {
          this.getRouter().navTo('biddingProcess', {}, true);
        }
      }
    },

    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */

    /**
     * @function
     * @name onHomePress
     * @description - Handler for the home button press
     *
     * @public
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onHomePress: function onHomePress() {
      this.getRouter().navTo('home', {}, true);
    },

    /**
     * @function
     * @name onUserNamePress
     * @description - Handler for the user name press event
     *
     * @public
     * @param {sap.ui.base.Event} oEvent - Event object
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onUserNamePress: function onUserNamePress(oEvent) {
      if (!this._oUserNamePopover) {
        this._oUserNamePopover = new sap.m.Popover({
          contentWidth: '300px',
          showHeader: true,
          placement: sap.m.PlacementType.Bottom,
          title: '{i18n>0137}',
          content: [new sap.m.VBox({
            items: [new sap.m.ObjectAttribute({
              title: '{i18n>0161}',
              text: '{main>/sysParams/UNAME}'
            }), new sap.m.ObjectAttribute({
              title: '{i18n>0098}',
              text: '{main>/sysParams/FULLNAME}'
            }), new sap.m.ObjectAttribute({
              title: '{i18n>0193}'
            }).bindProperty('text', {
              path: 'main>/sysParams/SMTP_ADDR'
            })]
          }).addStyleClass('sapUiSmallMargin')]
        }).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');
        this.getView().addDependent(this._oUserNamePopover);
      }

      this._oUserNamePopover.openBy(oEvent.getSource(), true);
    },

    /**
     * @function
     * @name onInfoPress
     * @description - Handler for the info button press event
     *
     * @public
     * @param {sap.ui.base.Event} oEvent - Event object
     * @returns {void} - Noting to return.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    onInfoPress: function onInfoPress(oEvent) {
      var abc = '{{app.AppVersion}}';

      if (!this._oInfoAppPopover) {
        this._oInfoAppPopover = new sap.m.Popover({
          contentWidth: '300px',
          showHeader: true,
          placement: sap.m.PlacementType.Bottom,
          title: '{i18n>0410}',
          content: [new sap.m.VBox({
            items: [new sap.m.ObjectAttribute({
              title: '{i18n>0411}',
              text: '{main>/sysParams/VERSION}'
            }), new sap.m.ObjectAttribute({
              title: '{i18n>0433}',
              text: abc
            }), new sap.m.ObjectAttribute({
              title: 'SAPUI5',
              // @ts-ignore
              text: sap.ui.version
            })]
          }).addStyleClass('sapUiSmallMargin')]
        }).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');
        this.getView().addDependent(this._oInfoAppPopover);
      }

      this._oInfoAppPopover.openBy(oEvent.getSource(), true);
    }
    /* =========================================================== */

    /* finish: event handlers                                      */

    /* =========================================================== */

  });
});