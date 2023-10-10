"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sitrack/model/variant/ItemVariant'], function (ItemVariant) {
  /**
   * @function
   * @name isSelectedAll
   * @description - Seleccionado todo
   *
   * @private
   * @param {object} checkboxGroup - Grupo de CheckBox
   * @returns {boolean}
   *
   * @author Edwin Valencia <evalencia@innovainternacional.biz>
   * @version 0.5.0
   */
  var isSelectedAll = function isSelectedAll(checkboxGroup) {
    return checkboxGroup.every(function (checkbox) {
      return checkbox.getSelected();
    });
  };
  /**
   * @function
   * @name buildData
   * @description - Obtener datos del grupo de CheckBox
   *
   * @private
   * @param {object} context
   * @param {object[]} context.checkboxGroup - Grupo de controles CheckBox
   * @param {string} context.name - Nombre del campo
   * @returns {object}
   *
   * @author Edwin Valencia <evalencia@innovainternacional.biz>
   * @version 0.5.0
   */


  var buildData = function buildData(_ref) {
    var checkboxGroup = _ref.checkboxGroup,
        name = _ref.name;
    var req = {};
    var selectedAll = isSelectedAll(checkboxGroup);

    if (selectedAll && name) {
      var _checkboxGroup = _slicedToArray(checkboxGroup, 1),
          checkbox = _checkboxGroup[0];

      if (checkbox.data('key')) {
        req["".concat(name)] = checkbox.data('key');
      } else {
        req["".concat(name)] = checkbox.getSelected() ? 'X' : '';
      }
    } else if (name) {
      var _checkboxGroup2 = _toArray(checkboxGroup),
          checkboxs = _checkboxGroup2.slice(1);

      checkboxs.forEach(function (checkbox) {
        var selected = checkbox.getSelected();

        if (selected) {
          var _ref2, _req$_ref;

          (_req$_ref = req[_ref2 = "".concat(name)]) !== null && _req$_ref !== void 0 ? _req$_ref : req[_ref2] = '';
          req["".concat(name)] = req["".concat(name)] + checkbox.data('key');
        }
      });
    }

    return req;
  };

  return {
    /**
     * @function
     * @name getVBoxData
     * @description - Obtener datos del control VBox
     *
     * @private
     * @param {object} context
     * @param {boolean} context.isVariant - Es variante
     * @param {object} context.field - Control VBox
     * @param {string} context.functionName - Nombre de la funciÃ³n para el backend
     * @param {string} context.group - Grupo al que pertenece el campo
     * @returns {object}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    getVBoxData: function getVBoxData(_ref3) {
      var isVariant = _ref3.isVariant,
          field = _ref3.field,
          functionName = _ref3.functionName,
          group = _ref3.group;
      var type = field.data('type');
      var name = field.data('name');
      var req = {};

      if (type === 'CheckBoxGroup') {
        var checkboxGroup = field.getItems();
        req = buildData({
          checkboxGroup: checkboxGroup,
          name: name
        });

        if (isVariant) {
          return _defineProperty({}, "".concat(name), [new ItemVariant({
            fieldname: name,
            function: functionName,
            group: group,
            low: req["".concat(name)],
            tabname: field.data('tabname')
          })]);
        }
      }

      if (type === 'CheckBox') {
        var _checkboxGroup3 = field.getItems();

        req = buildData({
          checkboxGroup: _checkboxGroup3,
          name: name
        });

        if (isVariant) {
          return _defineProperty({}, "".concat(name), [new ItemVariant({
            fieldname: name,
            function: functionName,
            group: group,
            low: req["".concat(name)],
            tabname: field.data('tabname')
          })]);
        }
      }

      return req;
    },

    /**
     * @function
     * @name setVBoxData
     * @description - Obtener datos del control VBox
     *
     * @private
     * @param {object} context
     * @param {object} context.data - Datos
     * @param {sap.m.VBox} context.field - Campo
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    setVBoxData: function setVBoxData(_ref6) {
      var data = _ref6.data,
          field = _ref6.field;
      var checkboxGroup = field.getItems();
      checkboxGroup.forEach(function (
      /** @type {sap.m.CheckBox} */
      checkbox) {
        checkbox.setSelected(false);
        var key = checkbox.data('key');

        if (data.LOW) {
          if (data.LOW.includes(key)) {
            var path = checkbox.getBindingPath('selected');
            var binding = checkbox.getBinding('selected');
            var model =
            /** @type {sap.ui.model.json.JSONModel} */
            binding.getModel();

            if (model) {
              model.setProperty(path, true);
            } else {
              checkbox.fireSelect({
                selected: true
              });
            }
          } else if (data.FIELDNAME.includes(checkbox.data('name'))) {
            checkbox.setSelected(true);
          }
        }
      });
    },

    /**
     * @function
     * @name cleanVBox
     * @description - Limpiar control
     *
     * @private
     * @param {object} context
     * @param {sap.m.VBox} context.field - Campo
     * @returns {void} - No retorna nada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    cleanVBox: function cleanVBox(_ref7) {
      var field = _ref7.field;
      var type = field.data('type');

      if (type === 'CheckBoxGroup') {
        var checkboxGroup = field.getItems();
        checkboxGroup.forEach(function (
        /** @type {sap.m.CheckBox} */
        checkbox) {
          var path = checkbox.getBindingPath('selected');
          var binding = checkbox.getBinding('selected');
          var model =
          /** @type {sap.ui.model.json.JSONModel} */
          binding.getModel();

          if (model) {
            model.setProperty(path, false);
          } else {
            checkbox.fireSelect({
              selected: false
            });
          }
        });
      }
    }
  };
});