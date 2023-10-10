"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
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
     * @version 1.0.0
     */
    buildStateOne: function buildStateOne(_ref) {
      var icon = _ref.icon,
          color = _ref.color;
      var obj = {
        '00': {
          ICON: 'sap-icon://unlocked',
          COLOR: WHITE,
          CLASS: ''
        },
        11: {
          ICON: 'sap-icon://unlocked',
          COLOR: GRAY,
          CLASS: ''
        },
        32: {
          ICON: 'sap-icon://unlocked',
          COLOR: BLUE,
          CLASS: ''
        },
        43: {
          ICON: 'sap-icon://decline',
          COLOR: BLACK,
          CLASS: ''
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
     * @version 1.0.0
     */
    buildStateTwo: function buildStateTwo(_ref2) {
      var icon = _ref2.icon,
          color = _ref2.color;
      var defaultState = {
        ICON: 'sap-icon://cart',
        COLOR: WHITE,
        CLASS: ''
      };
      var obj = {
        10: {
          ICON: 'sap-icon://cart',
          COLOR: GRAY,
          CLASS: ''
        },
        22: {
          ICON: 'sap-icon://cart-5',
          COLOR: BLUE,
          CLASS: ''
        },
        32: {
          ICON: 'sap-icon://cart-full',
          COLOR: BLUE,
          CLASS: ''
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
     * @version 1.0.0
     */
    buildStateThree: function buildStateThree(_ref3) {
      var icon = _ref3.icon,
          color = _ref3.color;
      var obj = {
        '00': {
          ICON: 'sap-icon://flag',
          COLOR: WHITE,
          CLASS: ''
        },
        11: {
          ICON: 'sap-icon://flag',
          COLOR: GRAY,
          CLASS: ''
        },
        32: {
          ICON: 'sap-icon://flag',
          COLOR: BLUE,
          CLASS: ''
        },
        43: {
          ICON: 'sap-icon://decline',
          COLOR: BLACK,
          CLASS: ''
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
     * @version 1.0.0
     */
    buildStateFour: function buildStateFour(_ref4) {
      var icon = _ref4.icon,
          color = _ref4.color;
      var obj = {
        '00': {
          ICON: 'sap-icon://innova/41',
          COLOR: WHITE,
          CLASS: ''
        },
        11: {
          ICON: 'sap-icon://innova/41',
          COLOR: GRAY,
          CLASS: 'custom-icon'
        },
        14: {
          ICON: 'sap-icon://innova/41',
          COLOR: RED,
          CLASS: 'custom-icon'
        },
        24: {
          ICON: 'sap-icon://innova/42',
          COLOR: RED,
          CLASS: 'custom-icon'
        },
        25: {
          ICON: 'sap-icon://innova/42',
          COLOR: GREEN,
          CLASS: 'custom-icon'
        },
        34: {
          ICON: 'sap-icon://innova/43',
          COLOR: RED,
          CLASS: 'custom-icon'
        },
        35: {
          ICON: 'sap-icon://innova/43',
          COLOR: GREEN,
          CLASS: 'custom-icon'
        },
        54: {
          ICON: 'sap-icon://innova/45',
          COLOR: RED,
          CLASS: 'custom-icon'
        },
        55: {
          ICON: 'sap-icon://innova/45',
          COLOR: GREEN,
          CLASS: 'custom-icon'
        },
        63: {
          ICON: 'sap-icon://innova/46',
          COLOR: BLACK,
          CLASS: 'custom-icon'
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
     * @version 1.0.0
     */
    buildStateFive: function buildStateFive(_ref5) {
      var icon = _ref5.icon,
          color = _ref5.color;
      var obj = {
        '00': {
          ICON: 'sap-icon://innova/51',
          COLOR: WHITE,
          CLASS: ''
        },
        11: {
          ICON: 'sap-icon://innova/51',
          COLOR: GRAY,
          CLASS: ''
        },
        22: {
          ICON: 'sap-icon://innova/52',
          COLOR: BLUE,
          CLASS: ''
        },
        32: {
          ICON: 'sap-icon://innova/51',
          COLOR: BLUE,
          CLASS: ''
        }
      };
      return obj["".concat(icon).concat(color)];
    }
  };
});