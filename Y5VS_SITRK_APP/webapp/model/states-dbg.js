"use strict";

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define([], function () {
  var WHITE = '#F3F4F6';
  var GRAY = '#A5A5A5';
  var BLUE = '#0C8BF7';
  var BLACK = '#1F2937';
  var RED = '#F74B4D';
  var GREEN = '#61BE19';
  return {
    /**
     * @function
     * @name buildStateOne
     * @description - Construir estado uno
     *
     * @public
     * @param {object} context
     * @param {string} context.icon - Icono
     * @param {string} context.color - Color
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    buildStateOne: function buildStateOne(_ref) {
      var icon = _ref.icon,
          color = _ref.color;
      var obj = {
        '00': {
          ICON: 'sap-icon://unlocked',
          COLOR: WHITE,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K132}'
        },
        11: {
          ICON: 'sap-icon://unlocked',
          COLOR: GRAY,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K133}'
        },
        32: {
          ICON: 'sap-icon://unlocked',
          COLOR: BLUE,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K134}'
        },
        43: {
          ICON: 'sap-icon://decline',
          COLOR: BLACK,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K135}'
        }
      };
      return obj["".concat(icon).concat(color)];
    },

    /**
     * @function
     * @name buildStateTwo
     * @description - Construir estado dos
     *
     * @public
     * @param {object} context
     * @param {string} context.icon - Icono
     * @param {string} context.color - Color
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    buildStateTwo: function buildStateTwo(_ref2) {
      var icon = _ref2.icon,
          color = _ref2.color;
      var defaultState = {
        ICON: 'sap-icon://cart',
        COLOR: WHITE,
        CLASS: '',
        TOOLTIP: '{main>/textPool/K136}'
      };
      var obj = {
        10: {
          ICON: 'sap-icon://cart',
          COLOR: GRAY,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K136}'
        },
        22: {
          ICON: 'sap-icon://cart-5',
          COLOR: BLUE,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K137}'
        },
        32: {
          ICON: 'sap-icon://cart-full',
          COLOR: BLUE,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K138}'
        }
      };
      return obj["".concat(icon).concat(color)] || defaultState;
    },

    /**
     * @function
     * @name buildStateThree
     * @description - Construir estado tres
     *
     * @public
     * @param {object} context
     * @param {string} context.icon - Icono
     * @param {string} context.color - Color
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    buildStateThree: function buildStateThree(_ref3) {
      var icon = _ref3.icon,
          color = _ref3.color;
      var obj = {
        '00': {
          ICON: 'sap-icon://flag',
          COLOR: WHITE,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K139}'
        },
        11: {
          ICON: 'sap-icon://flag',
          COLOR: GRAY,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K140}'
        },
        32: {
          ICON: 'sap-icon://flag',
          COLOR: BLUE,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K141}'
        },
        43: {
          ICON: 'sap-icon://decline',
          COLOR: BLACK,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K142}'
        }
      };
      return obj["".concat(icon).concat(color)];
    },

    /**
     * @function
     * @name buildStateFour
     * @description - Construir estado cuatro
     *
     * @public
     * @param {object} context
     * @param {string} context.icon - Icono
     * @param {string} context.color - Color
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    buildStateFour: function buildStateFour(_ref4) {
      var icon = _ref4.icon,
          color = _ref4.color;
      var obj = {
        '00': {
          ICON: 'sap-icon://innova/41',
          COLOR: WHITE,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K143}'
        },
        11: {
          ICON: 'sap-icon://innova/41',
          COLOR: GRAY,
          CLASS: 'custom-icon',
          TOOLTIP: '{main>/textPool/K144}'
        },
        14: {
          ICON: 'sap-icon://innova/41',
          COLOR: RED,
          CLASS: 'custom-icon',
          TOOLTIP: '{main>/textPool/K145}'
        },
        24: {
          ICON: 'sap-icon://innova/42',
          COLOR: RED,
          CLASS: 'custom-icon',
          TOOLTIP: '{main>/textPool/K148}'
        },
        25: {
          ICON: 'sap-icon://innova/42',
          COLOR: GREEN,
          CLASS: 'custom-icon',
          TOOLTIP: '{main>/textPool/K147}'
        },
        34: {
          ICON: 'sap-icon://innova/43',
          COLOR: RED,
          CLASS: 'custom-icon',
          TOOLTIP: '{main>/textPool/K152}'
        },
        35: {
          ICON: 'sap-icon://innova/43',
          COLOR: GREEN,
          CLASS: 'custom-icon',
          TOOLTIP: '{main>/textPool/K151}'
        },
        54: {
          ICON: 'sap-icon://innova/45',
          COLOR: RED,
          CLASS: 'custom-icon',
          TOOLTIP: '{main>/textPool/K149}'
        },
        55: {
          ICON: 'sap-icon://innova/45',
          COLOR: GREEN,
          CLASS: 'custom-icon',
          TOOLTIP: '{main>/textPool/K150}'
        },
        63: {
          ICON: 'sap-icon://innova/46',
          COLOR: BLACK,
          CLASS: 'custom-icon',
          TOOLTIP: '{main>/textPool/K146}'
        }
      };
      return obj["".concat(icon).concat(color)];
    },

    /**
     * @function
     * @name buildStateFive
     * @description - Construir estado cinco
     *
     * @public
     * @param {object} context
     * @param {string} context.icon - Icono
     * @param {string} context.color - Color
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    buildStateFive: function buildStateFive(_ref5) {
      var icon = _ref5.icon,
          color = _ref5.color;
      var obj = {
        '00': {
          ICON: 'sap-icon://innova/51',
          COLOR: WHITE,
          CLASS: '',
          TOOLTIP: ''
        },
        11: {
          ICON: 'sap-icon://innova/51',
          COLOR: GRAY,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K153}'
        },
        22: {
          ICON: 'sap-icon://innova/52',
          COLOR: BLUE,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K154}'
        },
        32: {
          ICON: 'sap-icon://innova/51',
          COLOR: BLUE,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K155}'
        }
      };
      return obj["".concat(icon).concat(color)];
    },

    /**
     * @function
     * @name buildStateSix
     * @description - Construir estado cinco
     *
     * @public
     * @param {object} context
     * @param {string} context.icon - Icono
     * @param {string} context.color - Color
     * @returns {object}
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    buildStateSix: function buildStateSix(_ref6) {
      var icon = _ref6.icon,
          color = _ref6.color;
      var obj = {
        11: {
          ICON: 'sap-icon://batch-payments',
          COLOR: WHITE,
          CLASS: '',
          TOOLTIP: '____No hay solicitudes de pago registradas'
        },
        22: {
          ICON: 'sap-icon://batch-payments',
          COLOR: BLUE,
          CLASS: '',
          TOOLTIP: '____Hay solicitudes de pago por montos parciales'
        },
        35: {
          ICON: 'sap-icon://batch-payments',
          COLOR: GREEN,
          CLASS: '',
          TOOLTIP: '____Hay solicitudes de pago para todas las facturas'
        }
      };
      return obj["".concat(icon).concat(color)]; // return {
      //   ICON: 'sap-icon://batch-payments',
      //   COLOR: WHITE,
      //   CLASS: '',
      //   TOOLTIP: '____No hay solicitudes de pago registradas',
      // }
    },

    /**
     * @function
     * @name buildStateSeven
     * @description - Construir estado cinco
     *
     * @public
     * @param {object} context
     * @param {string} context.icon - Icono
     * @param {string} context.color - Color
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    buildStateSeven: function buildStateSeven(_ref7) {
      var icon = _ref7.icon;
      var obj = {
        '': {
          ICON: 'sap-icon://begin',
          COLOR: WHITE,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K346}'
        },
        A: {
          ICON: 'sap-icon://begin',
          COLOR: BLUE,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K334}'
        },
        B: {
          ICON: 'sap-icon://begin',
          COLOR: BLUE,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K334}'
        },
        C: {
          ICON: 'sap-icon://sales-document',
          COLOR: BLUE,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K335}'
        },
        D: {
          ICON: 'sap-icon://compare',
          COLOR: BLUE,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K336}'
        },
        E: {
          ICON: 'sap-icon://compare',
          COLOR: BLUE,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K336}'
        },
        F: {
          ICON: 'sap-icon://collections-insight',
          COLOR: BLUE,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K337}'
        },
        G: {
          ICON: 'sap-icon://sales-quote',
          COLOR: BLUE,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K338}'
        },
        H: {
          ICON: 'sap-icon://favorite-list',
          COLOR: BLUE,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K339}'
        },
        I: {
          ICON: 'sap-icon://favorite',
          COLOR: BLUE,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K340}'
        },
        J: {
          ICON: 'sap-icon://decline',
          COLOR: BLUE,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K341}'
        },
        K: {
          ICON: 'sap-icon://customer-order-entry',
          COLOR: BLUE,
          CLASS: '',
          TOOLTIP: '{main>/textPool/K027}'
        }
      };
      return obj["".concat(icon)];
    }
  };
});