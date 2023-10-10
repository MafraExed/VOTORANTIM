"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-disable no-param-reassign */

/* eslint-disable no-plusplus */

/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/model/formatter', 'com/innova/util/index', 'com/innova/vendor/moment', 'com/innova/vendor/xlsx', 'sap/m/MessageBox', 'sap/ui/core/Fragment', 'sap/ui/core/util/Export', 'sap/ui/core/util/ExportColumn', 'sap/ui/core/util/ExportTypeCSV', 'sap/ui/model/Filter', 'sap/ui/model/json/JSONModel', 'sap/ui/model/Sorter', 'sap/ui/core/format/DateFormat'], function (_formatter, utils, moment, XLSX, MessageBox, Fragment, Export, ExportTypeCSV, ExportColumn, Filter, JSONModel, Sorter, DateFormat) {
  var excel = {
    /**
     * @function
     * @name exportDataInXlsx
     * @description - Se encarga de exportar datos a un Excel.
     *
     * @public
     * @param {object} context - Objeto contexto
     * @param {object} context.catalog - Catalogo de la tabla
     * @param {object} context.data - Datos de la tabla
     * @returns {Promise} - Resultado de exportar datos
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    exportDataInXlsx: function exportDataInXlsx(_ref) {
      var _this = this;

      var catalog = _ref.catalog,
          data = _ref.data;
      return new Promise(function (release) {
        var oCatalog = JSON.parse(JSON.stringify(catalog));
        var oData = JSON.parse(JSON.stringify(data));

        _this.formatRowsDates(oData);

        var context = oCatalog.reduce(excel.reduceCatalog, {
          oRowHeader: {},
          aColInfo: [],
          header: [],
          oRowData: {},
          oDataType: {}
        }); // Agregar mÃ¡s columnas ocultas

        for (var i = 0; i < 16; i++) {
          var columnHiddenExtra = {
            hidden: true,
            width: 0,
            wpx: 0,
            wch: 0
          };
          context.aColInfo.push(columnHiddenExtra);
        }

        var oRowData = _this.getDataFormats(oData);

        oRowData.unshift(context.oRowHeader);
        var ws = XLSX.utils.json_to_sheet(oRowData, {
          header: context.header,
          skipHeader: false
        });
        ws['!cols'] = context.aColInfo;
        ws['!rows'] = [{
          hidden: true,
          width: 0,
          wpx: 0,
          wch: 0
        }];
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, "export_".concat(moment().format(moment.HTML5_FMT.DATETIME_LOCAL).toString(), ".xlsx"), {
          Props: {
            Author: 'Innova - SIPRE'
          }
        });
        release();
      });
    },

    /**
     * @function
     * @name exportDataInXlsx
     * @description - Se encarga de exportar datos a un Excel.
     *
     * @public
     * @param {object} context - Objeto contexto
     * @param {object} context.catalog - Catalogo de la tabla
     * @param {object} context.data - Datos de la tabla
     * @returns {Promise} - Resultado de exportar datos
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    formatRowsDates: function formatRowsDates(oData) {
      var oDateFormat = DateFormat.getDateInstance({
        source: {
          pattern: 'timestamp'
        },
        pattern: 'dd/MM/yyyy'
      });
      oData.forEach(function (rowData) {
        var aKeys = Object.keys(rowData);
        aKeys.forEach(function (key) {
          if (key.indexOf('PR_BADAT') > -1 || key.indexOf('PR_LFDAT') > -1 || key.indexOf('POI_EINDT') > -1) {
            rowData[key] = rowData[key] ? oDateFormat.format(new Date(rowData[key].slice(0, 19))) : rowData[key];
          }
        });
      });
      return oData;
    },

    /**
     * @function
     * @name getDataFormats
     * @description - Se encarga de exportar datos a un Excel.
     *
     * @public
     * @param {object} oData - Objeto de datos
     * @returns {object} oData - Objeto de datos con formatos correctos
     *
     * @author Juan Orjuela <jorjuela@innovainternacional.biz>
     * @version 0.5.0
     */
    getDataFormats: function getDataFormats(oData) {
      oData.forEach(function (rowData) {
        var aKeys = Object.keys(rowData);
        aKeys.forEach(function (key) {
          if (key.indexOf('FIX_VAL') > -1 || key.indexOf('TOTAL') > -1) {
            if (key.indexOf('COLOR') === -1) {
              rowData[key] = parseFloat(rowData[key]);
            }
          }
        });
      });
      return oData;
    },

    /**
     * @function
     * @name floatNumberFormatExcel
     * @description - Convierte un String a un numero float con formato especifico.
     *
     * @public
     * @param {string} amount - Cadena a formatear
     * @returns {string} - Cadena formateada.
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    floatNumberFormatExcel: function floatNumberFormatExcel(amount) {
      return !amount || amount.length === 0 ? amount : _formatter.getNumberFormat().format(amount);
    },

    /**
     * @function
     * @name exportDataInCsv
     * @description - Se encarga de exportar datos a un archivo CSV.
     *
     * @public
     * @param {object} context - Objeto contexto
     * @param {object} context.catalog - Catalogo de la tabla
     * @param {object} context.data - Datos de la tabla
     * @param {object} context.text - Textos de la cobertura
     * @returns {Promise} - Resultado de exportar datos
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    exportDataInCsv: function exportDataInCsv(_ref2) {
      var catalog = _ref2.catalog,
          data = _ref2.data,
          text = _ref2.text;
      var oExport = new Export({
        // Type that will be used to generate the content. Own ExportType's can be created to support other formats
        exportType: new ExportTypeCSV({
          separatorChar: ';',
          charset: 'utf-8'
        }),
        // Pass in the model created above
        models: new JSONModel({
          catalog: catalog,
          node: data
        })
      });
      oExport.bindRows({
        path: '/node'
      });
      oExport.bindColumns({
        path: '/catalog',
        sorter: new Sorter('ColPos'),
        filters: [new Filter({
          path: 'TECH',
          operator: 'NE',
          value1: 'X'
        }), new Filter({
          path: 'NO_OUT',
          operator: 'NE',
          value1: 'X'
        })],
        factory: function factory(_, oContext) {
          var ctx = oContext.getObject();
          var __period = ctx.__period,
              sFieldName = ctx.Fieldname;

          if (!__period) {
            return new ExportColumn({
              name: ctx.Reptext,
              template: {
                content: {
                  parts: [sFieldName],
                  formatter: function formatter(value) {
                    return value;
                  }
                }
              }
            });
          }

          return new ExportColumn({
            name: ctx.Reptext,
            template: {
              content: {
                parts: ["".concat(sFieldName, "Cober"), "".concat(sFieldName, "Sinstk"), "".concat(sFieldName, "Stksob"), "".concat(sFieldName, "Iconname"), "".concat(sFieldName, "Cobres")],
                formatter: function formatter(cober, sinstk, stksob, iconname, cobres) {
                  if (sinstk === 'X') {
                    return text.sK013;
                  }

                  if (stksob === 'X') {
                    return text.sK014;
                  }

                  switch (iconname) {
                    case 'ICON_SUP_PUNTO_PED':
                      return text.sK062;

                    case 'ICON_INF_PUNTO_PED':
                      return text.sK063;

                    case 'ICON_CERO_STK_DISP':
                      return text.sK064;

                    case 'ICON_DISP_SUP_SMAX':
                      return text.sK065;

                    default:
                      if (cober) {
                        return _formatter.floatNumberFormat(cober);
                      }

                      if (cobres === 'X') {
                        return '*';
                      }

                      return '';
                  }
                }
              }
            }
          });
        }
      }); // download exported file

      return oExport.saveFile().catch(function (oError) {
        return MessageBox.error("Error when downloading data. Browser might not be supported!\n\n".concat(oError));
      }).then(function () {
        return oExport.destroy();
      });
    },

    /**
     * @function
     * @name showImportDialog
     * @description - Muestra el dialogo de importaciÃ³n de excel
     *
     * @public
     * @param {string} name - Nombre del fragmento
     * @returns {void} - No retorna nada
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 0.5.0
     */
    showImportDialog: function showImportDialog() {
      var _this2 = this;

      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'com.innova.sipre.view.shared.dialog.FileUploaderDialog';

      if (!this._oFileUploaderDialog) {
        Fragment.load({
          id: this.getView().getId(),
          name: name,
          controller: this
        }).then(function (oDialog) {
          // connect dialog to the root view of this component (models, lifecycle)
          _this2.getView().addDependent(oDialog);

          var fileUploader = _this2.byId('fileUploader');

          fileUploader.attachTypeMissmatch(excel._typeMissmatch);
          oDialog.addStyleClass(_this2.getOwnerComponent().getContentDensityClass());
          oDialog.getBeginButton().attachPress(excel.handleUploadFile.bind(_this2, fileUploader));
          oDialog.getEndButton().attachPress(oDialog.close.bind(oDialog));
          _this2._oFileUploaderDialog = oDialog;
          oDialog.open();
        }).catch(this.errorHandler.bind(this));
      } else {
        this.byId('fileUploader').setValue();

        this._oFileUploaderDialog.open();
      }
    }
  };
  /**
   * @function
   * @name _typeMissmatch
   * @description - Maneja el cargar un archivo erroneo.
   *
   * @private
   * @param {sap.ui.base.Event} oEvent - An Event object consisting of an id, a source and a map of parameters.
   * @returns {void} - No retorna nada.
   *
   * @author Edwin Valencia <evalencia@innovainternacional.biz>
   * @version 0.5.0
   */

  Object.defineProperty(excel, '_typeMissmatch', {
    value: function value(oEvent) {
      var sSupportedFileTypes = oEvent.getSource().getFileType().map(function (value) {
        return "*.".concat(value);
      }).join(', ');
      utils.showMessageToast("The file type *.".concat(oEvent.getParameter('fileType'), " is not supported. Choose one of the following types: ").concat(sSupportedFileTypes));
    }
  });
  /**
   * @function
   * @name handleUploadFile
   * @description - Maneja la carga del archivo de excel
   *
   * @private
   * @returns {void} - No retorna nada.
   *
   * @author Edwin Valencia <evalencia@innovainternacional.biz>
   * @version 0.5.0
   */

  Object.defineProperty(excel, 'handleUploadFile', {
    value: function value(oFileUploader) {
      var _this3 = this;

      var $domRef = oFileUploader.getFocusDomRef();
      var oFile = $domRef.files[0];

      if (!oFileUploader.getValue()) {
        throw new Error(this.getMessageTextPool('058'));
      }

      var reader = new FileReader(); // Closure to capture the file information.

      reader.onload = function (e) {
        return Promise.resolve(_this3._oFileUploaderDialog.setBusy.bind(_this3._oFileUploaderDialog, true)).then(excel.readFileXLSX.bind(excel, e.target.result)).then(_this3._processExcelData.bind(_this3)).catch(_this3.errorHandler.bind(_this3)).then(oFileUploader.clear.bind(oFileUploader)).then(oFileUploader.setValue.bind(oFileUploader)).then(_this3._oFileUploaderDialog.setBusy.bind(_this3._oFileUploaderDialog, false)).then(_this3._oFileUploaderDialog.close.bind(_this3._oFileUploaderDialog));
      };

      reader.readAsArrayBuffer(oFile);
    }
  });
  /**
   * @function
   * @name readFileXLSX
   * @description - Se encarga de leer el archivo excel para procesar los datos.
   *
   * @private
   * @param {File} oFile - Archivo que se cargo.
   * @returns {array} - Arreglo con la informaciÃ³n transformada.
   *
   * @author Edwin Valencia <evalencia@innovainternacional.biz>
   * @version 0.5.0
   */

  Object.defineProperty(excel, 'readFileXLSX', {
    value: function value(file) {
      return new Promise(function (release) {
        var wb = XLSX.read(file, {
          type: 'buffer',
          cellDates: true,
          cellNF: false,
          cellText: true
        });
        var array = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
          raw: true,
          dateNF: 'YYYY-MM-DD'
        });
        array.shift();
        array = array.map(function (_i) {
          return _objectSpread(_objectSpread({}, _i), {}, {
            modify: 'X '
          });
        });
        release(array);
      });
    }
  });

  var isVisible = function isVisible(_ref3) {
    var NO_OUT = _ref3.NO_OUT,
        TECH = _ref3.TECH;
    return NO_OUT !== 'X' && TECH !== 'X';
  };

  Object.defineProperty(excel, 'reduceCatalog', {
    value: function value(prev, curr) {
      var sFieldname = curr.FIELDNAME;
      var text = curr.REPTEXT || curr.SCRTEXT_L || '';
      Object.assign(prev.oRowHeader, _defineProperty({}, sFieldname, "".concat(text, " (").concat(sFieldname, ")")));
      Object.assign(prev.oRowData, _defineProperty({}, sFieldname, ''));
      prev.header.push(sFieldname);
      var colInfo = {
        hidden: true,
        width: 0,
        wpx: 0,
        wch: 0
      };

      if (isVisible(curr)) {
        colInfo = {
          wch: (text.length || 20) + 1
        };
      }

      prev.aColInfo.push(colInfo);
      Object.assign(prev.oDataType, _defineProperty({}, sFieldname, curr.INTTYPE));
      return prev;
    }
  });
  Object.defineProperty(excel, 'sortCatalog', {
    value: function sortCatalog(catalog) {
      return catalog.sort(function (a, b) {
        if ((a.TECH !== 'X' || a.NO_OUT !== 'X') && (b.TECH === 'X' || b.NO_OUT === 'X')) {
          return -1;
        }

        if ((a.TECH === 'X' || a.NO_OUT === 'X') && (b.TECH !== 'X' || b.NO_OUT !== 'X')) {
          return 1;
        } // a must be equal to b


        return 0;
      });
    }
  });
  return excel;
});