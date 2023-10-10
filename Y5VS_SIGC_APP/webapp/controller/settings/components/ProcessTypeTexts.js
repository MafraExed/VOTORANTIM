"use strict";function ownKeys(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,o)}return r}function _objectSpread(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?ownKeys(Object(r),!0).forEach(function(t){_defineProperty(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}function _defineProperty(e,t,r){if(t in e){Object.defineProperty(e,t,{value:r,enumerable:true,configurable:true,writable:true})}else{e[t]=r}return e}function _slicedToArray(e,t){return _arrayWithHoles(e)||_iterableToArrayLimit(e,t)||_unsupportedIterableToArray(e,t)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,t){if(!e)return;if(typeof e==="string")return _arrayLikeToArray(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);if(r==="Object"&&e.constructor)r=e.constructor.name;if(r==="Map"||r==="Set")return Array.from(e);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return _arrayLikeToArray(e,t)}function _arrayLikeToArray(e,t){if(t==null||t>e.length)t=e.length;for(var r=0,o=new Array(t);r<t;r++){o[r]=e[r]}return o}function _iterableToArrayLimit(e,t){var r=e==null?null:typeof Symbol!=="undefined"&&e[Symbol.iterator]||e["@@iterator"];if(r==null)return;var o=[];var n=true;var s=false;var i,a;try{for(r=r.call(e);!(n=(i=r.next()).done);n=true){o.push(i.value);if(t&&o.length===t)break}}catch(e){s=true;a=e}finally{try{if(!n&&r["return"]!=null)r["return"]()}finally{if(s)throw a}}return o}function _arrayWithHoles(e){if(Array.isArray(e))return e}
/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["com/innova/sigc/lib/richTextEditor/editor","com/innova/sigc/model/constant","com/innova/sigc/service/http","com/innova/sigc/utils/isEmpty","sap/base/util/deepExtend","sap/m/MessageBox","sap/ui/core/Fragment"],function(e,t,r,o,n,s,i){return{onAddNewProcessTypeTextRecord:function e(){this.getView().getModel("Settings").setProperty("/IsCreateProcessTypeTask",true);this.bUpdateCategory=false;this.handleOpenProcessTypeTextDialog()},onProcessTextTypeDeletePress:function e(){var r=this.byId("processTypeTextsTable").getSelectedIndices(),n=_slicedToArray(r,1),i=n[0];if(o(i)){s.error(this.getResourceBundle().getText("Commons.0022"));return}var a=this.byId("processTypeTextsTable").getContextByIndex(i);var c=a.getObject();this._openDeleteRecordDialog(c.id,t.api.PROCESS_TEXT_TYPE,false,this.formProcessTextTypePayload(c))},onProcessTextTypeEditPress:function e(){var t=this.byId("processTypeTextsTable").getSelectedIndices(),r=_slicedToArray(t,1),n=r[0];if(o(n)){s.error(this.getResourceBundle().getText("Commons.0022"));return}var i=this.byId("processTypeTextsTable").getContextByIndex(n);var a=i.getObject();this.getView().getModel("Settings").setProperty("/IsCreateProcessTypeTask",false);this.bUpdateCategory=true;this.getView().getModel("Settings").setProperty("/createprocesstypetext",a);this.handleOpenProcessTypeTextDialog(a)},handleOpenProcessTypeTextDialog:function t(r){var o=this;var n=this;this._oProcesssTypeTextDialog=i.load({id:this.getView().getId(),name:"com.innova.sigc.view.settings.fragment.CreateProcessTypeTexts",controller:this}).then(function(e){var t=e;o.getView().addDependent(t);t.addStyleClass(o.getOwnerComponent().getContentDensityClass());t.setModel(o.getView().getModel("Settings"),"Settings");if(!r){o.getView().getModel("Settings").setProperty("/createprocesstypetext",{tipoDoc:"",textType:"",processType:{id:undefined},language:o.getModel("main").getProperty("/currentLanguage"),content:""})}t.setModel(o.getView().getModel("i18n"),"i18n");return t});this._oProcesssTypeTextDialog.then(function(t){e.removeEditorManager();t.setBusy(true);setTimeout(function(){o._oTextTypeProcessEditor=e.initializeQuillEditor.call(n,{container:o.byId("editorTextTypeProcess").getDomRef(),placeholder:n.getResourceBundle().getText("0080"),setup:function e(r){r.on("init",function(){r.setContent(o.getView().getModel("Settings").getProperty("/createprocesstypetext/content"));t.setBusy(false)})}});o._oTextTypeProcessEditor.render();t.attachAfterClose(t.destroy.bind(t))},0);t.open()})},onCreateProcessTypeTextPress:function e(){var r=this;var o=n({},this.getView().getModel("Settings").getProperty("/createprocesstypetext"));var i=this.formProcessTextTypePayload(o);if(this.bUpdateCategory){this.handleSaveorUpdate(i,"PUT","".concat(t.api.PROCESS_TEXT_TYPE)).then(function(){s.success(r.getResourceBundle().getText("0232"))}).then(this.getProcessTypeTexts.bind(this)).catch(this.errorHandler.bind(this))}else{this.handleSaveorUpdate(i,"",t.api.PROCESS_TEXT_TYPE).then(function(){s.success(r.getResourceBundle().getText("0233"))}).then(this.getProcessTypeTexts.bind(this)).catch(this.errorHandler.bind(this))}this.handleCloseProcessTypeTextDialog()},formProcessTextTypePayload:function e(t){var r;return _objectSpread({tipoDoc:t.tipoDoc,textType:t.textType,processTypeId:t.processTypeId||((r=t.processType)===null||r===void 0?void 0:r.id),language:t.language||this.getModel("main").getProperty("/currentLanguage")},this._oTextTypeProcessEditor&&{content:this._oTextTypeProcessEditor.getContent()})},handleCloseProcessTypeTextDialog:function e(){this._oProcesssTypeTextDialog.then(function(e){e.close()})},getProcessTypeTexts:function e(){var o=this.getModel("main").getProperty("/currentLanguage");return r.get("".concat(t.api.PROCESS_TEXT_TYPE,"/all?language=").concat(o)).then(this._handleResponseData.bind(this))}}});