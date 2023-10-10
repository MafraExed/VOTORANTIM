"use strict";function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,t){if(!e)return;if(typeof e==="string")return _arrayLikeToArray(e,t);var o=Object.prototype.toString.call(e).slice(8,-1);if(o==="Object"&&e.constructor)o=e.constructor.name;if(o==="Map"||o==="Set")return Array.from(e);if(o==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o))return _arrayLikeToArray(e,t)}function _iterableToArray(e){if(typeof Symbol!=="undefined"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _arrayLikeToArray(e,t){if(t==null||t>e.length)t=e.length;for(var o=0,i=new Array(t);o<t;o++){i[o]=e[o]}return i}function ownKeys(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),o.push.apply(o,i)}return o}function _objectSpread(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?ownKeys(Object(o),!0).forEach(function(t){_defineProperty(e,t,o[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):ownKeys(Object(o)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))})}return e}function _defineProperty(e,t,o){if(t in e){Object.defineProperty(e,t,{value:o,enumerable:true,configurable:true,writable:true})}else{e[t]=o}return e}
/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["com/innova/sigc/lib/formUtils/formUtils","com/innova/sigc/model/constant","com/innova/sigc/model/process/Position","com/innova/sigc/service/http","com/innova/sigc/service/petitions","com/innova/sigc/utils/callPromisesInSequence","com/innova/sigc/utils/isEmpty","com/innova/sigc/utils/showToast","sap/ui/core/Fragment"],function(e,t,o,i,n,r,s,a,c){return{onShowNewPositionDialog:function e(){var t=this;this._getPositionDialog().then(function(e){var o=e;var i=o.getBeginButton();var n=t.getResourceBundle().getText("Commons.0005");i.setText(n);i.setTooltip(n);i.attachPress(t.onNewPosition.bind(t));t._oNewPositionDialog=o;t._oNewPositionDialog.unbindElement();t._oNewPositionDialog.open()}).catch(this.errorHandler.bind(this))},onShowEditPositionDialog:function e(t){var o=this;var i=t.getBindingContext("processModel");var n=i.getPath();this._getPositionDialog().then(function(e){var t=e;var i=t.getBeginButton();var r=o.getResourceBundle().getText("Commons.0017");i.setText(r);i.setTooltip(r);i.attachPress(o.onUpdatePosition.bind(o,{path:n}));o._oNewPositionDialog=t;o._oNewPositionDialog.unbindElement();o._oNewPositionDialog.bindElement({path:n,model:"processModel"});o._oNewPositionDialog.open();o._oNewPositionDialog.open()}).catch(this.errorHandler.bind(this))},onNewPosition:function n(){var r=this;var s=this.byId("newPositionForm");Promise.resolve(this._oNewPositionDialog.setBusy(true)).then(this._isValidForm.bind(this,s)).then(e.getFormData.bind(e,s)).then(function(e){return new o(_objectSpread(_objectSpread({},e),{},{posProc:r._generatePositionId(),processId:r._numProc}))}).then(i.post.bind(i,t.api.PROCESS_POSITION_PATH)).then(function(e){var t=e.data;r._oFormModel.setProperty("/positions",[].concat(_toConsumableArray(r._oFormModel.getProperty("/positions")),[t]));a(r._i18n.getText("Commons.0021"))}).then(this._oNewPositionDialog.close.bind(this._oNewPositionDialog)).catch(this.errorHandler.bind(this)).finally(this._oNewPositionDialog.setBusy.bind(this._oNewPositionDialog,false))},onUpdatePosition:function n(r){var s=this;var c=r.path;var l=this.byId("newPositionForm");var u=this._oFormModel.getProperty("".concat(c,"/id"));Promise.resolve(this._oNewPositionDialog.setBusy(true)).then(this._isValidForm.bind(this,l)).then(e.getFormData.bind(e,l)).then(function(e){return new o(_objectSpread({},e))}).then(i.update.bind(i,"".concat(t.api.PROCESS_POSITION_PATH,"/").concat(u))).then(function(e){var t=e.data;s._oFormModel.setProperty("".concat(c),t);a(s.getResourceBundle().getText("Commons.0021"))}).then(this._oNewPositionDialog.close.bind(this._oNewPositionDialog)).catch(this.errorHandler.bind(this)).finally(this._oNewPositionDialog.setBusy.bind(this._oNewPositionDialog,false))},onDeletePosition:function e(){var o=this;var n=this.byId("positionTable");Promise.resolve(this._oPage.setBusy(true)).then(this._getSelectedIndices.bind(this,n)).then(function(e){o._deletePositionIds=e.map(function(e){return e.getProperty("id")});return i.delete("".concat(t.api.PROCESS_POSITION_PATH),o._deletePositionIds)}).then(function(){o._deleteBindingRows({path:"/positions",ids:o._deletePositionIds});n.clearSelection()}).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage,false))},onChangeMatnr:function o(i){i.setValueState(sap.ui.core.ValueState.None);var r=this.byId("maktxPosition");r.setValue();var s=this.byId("meinsPosition");s.setValue();var a=this.byId("matklPosition");a.setValue();var c=this.byId("grunPosition");c.setValue();var l=this.byId("bestPosition");l.setValue();var u=this.byId("werksPosition");u.setValue();if(this._oSearchHelpContext){r.setValue(this._oSearchHelpContext.FTEXT);var h=this._oSearchHelpContext.FCODE2;u.setValue(h);u.destroySuggestionItems().addSuggestionItem(new sap.ui.core.ListItem({key:h,text:h}));u.setSelectedKey(h);s.setValue(this._oSearchHelpContext.FCODE5);s.destroySuggestionItems().addSuggestionItem(new sap.ui.core.ListItem({key:this._oSearchHelpContext.FCODE5,text:this._oSearchHelpContext.FCODE5}));s.setSelectedKey(this._oSearchHelpContext.FCODE5);a.setValue(this._oSearchHelpContext.FCODE4);a.destroySuggestionItems().addSuggestionItem(new sap.ui.core.ListItem({key:this._oSearchHelpContext.FCODE4,text:this._oSearchHelpContext.FCODE4}));a.setSelectedKey(this._oSearchHelpContext.FCODE4);this._oSearchHelpContext=null;return n.post(t.GET_LONGTEXT_PEDTEXT,{IP_MATNR:i.getValue().toUpperCase()}).then(function(t){var o=t.data;var i=o.ET_TEXTO_LARGO,n=o.ET_TEXTO_PEDIDO;var r=e._concatTextArray(i);var s=e._concatTextArray(n);c.setValue(r);l.setValue(s);u.fireChangeEvent(h)})}return Promise.resolve()},onChangeWerks:function e(t){t.setValueState(sap.ui.core.ValueState.None);var o=this.byId("adStreetPosition");o.setValue().setDescription();if(this._oSearchHelpContext){o.setValue(this._oSearchHelpContext.FCODE2)}},onCopyPositions:function e(){var t=this;try{var o=this.byId("positionTable");Promise.resolve(this._oPage.setBusy(true)).then(this._getSelectedIndices.bind(this,o)).then(this._buildRequestsToCopyPositions.bind(this)).then(r).then(function(e){t._oFormModel.setProperty("/positions",t._oFormModel.getProperty("/positions").concat(e.map(function(e){return e.data})));a(t._i18n.getText("Commons.0021"));o.clearSelection()}).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage,false))}catch(e){this.errorHandler(e)}},_getPositionDialog:function e(){var t=this.getView();return c.load({id:t.getId(),name:"com.innova.sigc.view.biddingProcess.dialog.position.NewPosition",controller:this}).then(function(e){var o=e;t.addDependent(o);o.getEndButton().attachPress(o.close.bind(o));o.attachAfterClose(o.destroy.bind(o));return o})},_generatePositionId:function e(){var t=this._oFormModel.getProperty("/positions").map(function(e){var t=e.posProc;return t});return s(t)?1:Math.max.apply(Math,_toConsumableArray(t))+1},_buildRequestsToCopyPositions:function e(n){var r=this;var s=this._generatePositionId();return n.map(function(e){var t=new o(_objectSpread(_objectSpread({},e.getObject()),{},{posProc:s,processId:r._numProc}));s+=1;return t}).map(function(e){return i.post.bind(i,t.api.PROCESS_POSITION_PATH,e)})}}});