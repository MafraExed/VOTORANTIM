"use strict";var _excluded=["offers"];function _objectWithoutProperties(e,t){if(e==null)return{};var r=_objectWithoutPropertiesLoose(e,t);var o,a;if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++){o=i[a];if(t.indexOf(o)>=0)continue;if(!Object.prototype.propertyIsEnumerable.call(e,o))continue;r[o]=e[o]}}return r}function _objectWithoutPropertiesLoose(e,t){if(e==null)return{};var r={};var o=Object.keys(e);var a,i;for(i=0;i<o.length;i++){a=o[i];if(t.indexOf(a)>=0)continue;r[a]=e[a]}return r}function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,t){if(!e)return;if(typeof e==="string")return _arrayLikeToArray(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);if(r==="Object"&&e.constructor)r=e.constructor.name;if(r==="Map"||r==="Set")return Array.from(e);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return _arrayLikeToArray(e,t)}function _iterableToArray(e){if(typeof Symbol!=="undefined"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _arrayLikeToArray(e,t){if(t==null||t>e.length)t=e.length;for(var r=0,o=new Array(t);r<t;r++){o[r]=e[r]}return o}function ownKeys(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,o)}return r}function _objectSpread(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?ownKeys(Object(r),!0).forEach(function(t){_defineProperty(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}function _defineProperty(e,t,r){if(t in e){Object.defineProperty(e,t,{value:r,enumerable:true,configurable:true,writable:true})}else{e[t]=r}return e}
/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["../BaseController","./components/General","./components/Positions","com/innova/sitrack/formatter/date","com/innova/sitrack/formatter/formatUUID","com/innova/sitrack/formatter/getEmailString","com/innova/sitrack/formatter/getObjTextProp","com/innova/sitrack/lib/formUtils/formUtils","com/innova/sitrack/model/constant","com/innova/sitrack/model/purchaseTracking/processStatus/useProcessStatus","com/innova/sitrack/model/purchaseTracking/TypesDocEnum","com/innova/sitrack/utils/isEmpty","com/innova/sitrack/utils/showToast","com/innova/service/petitions","com/innova/service/http","com/innova/sitrack/model/formatter","sap/m/MessageBox","sap/ui/core/ListItem","sap/ui/model/json/JSONModel","com/innova/sitrack/formatter/dataArray","com/innova/sitrack/utils/wrapText"],function(e,t,r,o,a,i,n,s,c,l,u,h,d,f,m,_,p,b,v,g,y){var P="general";return e.extend("com.innova.sitrack.controller.purchaseTracking.Manage",_objectSpread(_objectSpread(_objectSpread({formatter:{getObjTextProp:n,getEmailString:i,date:o,dataArray:g}},t),r),{},{formatterGlobal:_,onInit:function e(){this._oReq={};this._oPage=this.byId("page");this._oGeneralForm=this.byId("generalDataForm");this._i18n=this.getResourceBundle();this._oIconTabBar=this.byId("iconTabBar");this._numProc=null;this._currentTab=P;this._previousTab=P;this._oFormModel=new v({attachments:[],enableTabs:false,evaluationCriteria:[],positions:[],sumCommercialEval:0,sumTechEval:0,tipoDoc:u.LIC_COT,valueHelp:{catProc:[],tipoProc:[],respJuridico:[],respTecnico:[]},vendors:[]});this._oFormModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);this.setModel(this._oFormModel,"processModel");this._oStatusModel=new v({});this.setModel(this._oStatusModel,"status");this._oRouter=this.getRouter();this._oGeneralForm.getFormContainers().forEach(function(e){s.cleanFields({formElements:e.getFormElements()})});this._oRouter.getRoute("purchaseTrackingManage").attachMatched(this._onRouteMatched,this)},_minFechaEntrega:function e(){return new Date},_onRouteMatched:function e(t){this.byId("limOferta").setMinDate(new Date);this._oStoreModel=this.getModel("store");if(this._oStoreModel.getData().processData){var r=t.getParameter("arguments"),o=r.query;this._numProc=o;Promise.resolve(this._oPage.setBusy(true)).then(this._resetForm.bind(this)).then(this._fetchAPI.bind(this,this._numProc)).then(m.get.bind(m,"".concat(c.api.CUSTOM_TEMPLATE,"/offer_vendor_invitation"))).then(this._renderEditors.bind(this)).then(this._fetchSelectedData.bind(this,this._oStoreModel.getData().processData)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage,false))}else{this.getModel("appView").setProperty("/resetProcessForm",true);this._oRouter.navTo("purchaseTracking")}},_loadItemsCatProc:function e(){var t=this;if(this._oFormModel.getProperty("/valueHelp/catProc").length===0){return m.get("".concat(c.api.PROCESS_CATEGORY_PATH,"?language=ES")).then(function(e){var r=e.data;t._oFormModel.setProperty("/valueHelp/catProc",r)})}return Promise.resolve()},_loadItemsRespJuridico:function e(){var t=this;return m.get(c.api.EVALUATORS_PATH).then(function(e){var r=e.data;t._oFormModel.setProperty("/valueHelp/respJuridico",r.filter(function(e){var t=e.role,r=e.status;return t.includes("LEGAL_EVALUATOR")&&r==="Verified"}))})},_loadItemsRespTecnico:function e(){var t=this;return m.get(c.api.EVALUATORS_PATH).then(function(e){var r=e.data;t._oFormModel.setProperty("/valueHelp/respTecnico",r.filter(function(e){var t=e.role,r=e.status;return t.includes("TECHNICAL_EVALUATOR")&&r==="Verified"}))})},_fetchSelectedData:function e(t){var r=this;var o=this.getModel("main").getData(),a=o.sysParams,i=o.bukrs,n=o.ekgrp,s=o.ekorg;var c=a.UNAME;var l=[{control:this.byId("oIBukrsInput"),value:i},{control:this.byId("oIEkorgInput"),value:s},{control:this.byId("oIEkgrpInput"),value:n},{control:this.byId("processCurrency"),value:t.POH_WAERS},{control:this.byId("oIErnamInput"),value:c},{control:this.byId("dztermInput"),value:t.POH_ZTERM}];l.forEach(function(e){if(e.value){var t=e.control;var o=r.searchHelp._getValue(e.value);t.setValue(o);t.destroySuggestionItems().addSuggestionItem(new b({key:o,text:o}));t.setSelectedKey(o);t.fireChangeEvent(o)}})},_deleteBindingRowsPositions:function e(t){var r=t.path,o=t.ids;this._oStoreModel.setProperty("".concat(r),_toConsumableArray(this._oStoreModel.getProperty("".concat(r)).filter(function(e){var t=e.BANFN;return!o.includes(t)})));d(this.getMessageTextPool("K352"))},_resetForm:function e(){this._currentTab=P;this._previousTab=P;this._oFormModel.setData({attachments:[],enableTabs:false,evaluationCriteria:[],positions:[],sumCommercialEval:0,sumTechEval:0,tipoDoc:u.LIC_COT,valueHelp:{catProc:[],tipoProc:[],respJuridico:[],respTecnico:[]},vendors:[]});this.byId("processCurrency").setEnabled(true);this.byId("offerPartialSwitch").setEnabled(true);this.onLoadItems(this.byId("tipoProcComboBox"));this.onLoadItems(this.byId("catProcMultiComboBox"));this.onLoadItems(this.byId("respJuridicoComboBox"));this.onLoadItems(this.byId("respTecnicoComboBox"));this._oIconTabBar.setSelectedKey(P);this._oGeneralForm.getFormContainers().forEach(function(e){s.cleanFields({formElements:e.getFormElements()})});this.byId("positionTable").clearSelection()},_fetchAPI:function e(t){if(!h(t)){return m.get("".concat(c.api.PROCESS_PATH,"/").concat(t)).then(this._handleResponse.bind(this))}return Promise.resolve(this._prueba())},_prueba:function e(){this._oGeneralForm.getFormContainers().forEach(function(e){s.setDataInFields({formElements:e.getFormElements(),data:{ekorg:1}})})},_fetchOffers:function e(){var t=this;return m.get("".concat(c.api.PROCESS_PATH,"/").concat(this._numProc,"/").concat(c.api.OFFERS_PATH)).then(function(e){var r=e.data;t._oFormModel.setProperty("/offers",r)})},_handleResponse:function e(t){var r=t.data;var o=r.offers,i=o===void 0?[]:o,n=_objectWithoutProperties(r,_excluded);this._oGeneralForm.getFormContainers().forEach(function(e){s.setDataInFields({formElements:e.getFormElements(),data:_objectSpread(_objectSpread({},r),{},{numProc:a(r.numProc)})})});this._validateProcessCurrency({offers:i});this._validatePartialOffers({offers:i});this._sumOfEvaluationCriteria(n.evaluationCriteria);this._buildEvaluationCriteria(n.evaluationCriteria);this._validateProcessStatus(n.status);this._oFormModel.setData(_objectSpread(_objectSpread({},n),{},{enableTabs:true}),true)},_validateProcessStatus:function e(t){this._oStatusModel.setData({disableCriteria:!l.inEvaluation(t)})},_callTabsStrategy:function e(){var t={general:this._renderEditorsWithData,questions:this._fetchQuestions,qualification:this._fetchQualifications,technicalQualification:this._fetchTechnicalQualifications,commercialQualification:this._fetchCommercialQualifications,qualificationSummary:this._fetchQualificationSummary,vendor:this._fetchOffers};var r=t[this._currentTab];if(r){for(var o=arguments.length,a=new Array(o),i=0;i<o;i++){a[i]=arguments[i]}return r===null||r===void 0?void 0:r.call.apply(r,[this].concat(a))}return Promise.resolve()},_getSelectedIndices:function e(t){var r=t.getSelectedIndices();if(h(r)){return Promise.reject(new Error("__Seleccione por lo menos un registro."))}return Promise.resolve(r.map(function(e){return t.getContextByIndex(e)}))},_getSelectedItems:function e(t){var r=t.getSelectedItems();if(h(r)){throw new Error("__Seleccione por lo menos un registro.")}return r},_deleteBindingRows:function e(t){var r=t.path,o=t.ids;this._oFormModel.setProperty("".concat(r),_toConsumableArray(this._oFormModel.getProperty("".concat(r)).filter(function(e){var t=e.id;return!o.includes(t)})));d("__Se han procesado los datos correctamente.")},_isValidForm:function e(t){var r=s.validateForm({formContainers:t.getFormContainers()});if(!r){throw new Error("Formulario no valido")}return Promise.resolve()},_saveOrUpdateProcess:function e(t){if(this._numProc){return m.update("".concat(c.api.PROCESS_PATH,"/").concat(this._numProc),t)}return m.post(c.api.NEW_PROCESS_PATH,t)},_buildObjectText:function e(){var t=arguments.length>0&&arguments[0]!==undefined?arguments[0]:"";return y(t).map(function(e){return{TDFORMAT:"/",TDLINE:e}})},onSelectItemTabBar:function e(t){var r=t.key;var o=this.byId("oIEmailManage").getValue();if(r==="position"&&h(o)){d(this.getMessageTextPool("K367"));this.byId("iconTabBar").setSelectedKey("general");this._renderEditorsWithData();this.byId("oIEmailManage").setValueState(sap.ui.core.ValueState.Error)}else{this._currentTab=r;if(this._previousTab!==r){this._previousTab=this._currentTab;Promise.resolve(this._oPage.setBusy(true)).then(this._callTabsStrategy.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage,false))}}},onSave:function e(){var t=this;var r=this.byId("oIEmailManage").getValue();if(h(r)){d(this.getMessageTextPool("K367"));this.byId("oIEmailManage").setValueState(sap.ui.core.ValueState.Error)}else{p.confirm(this.getMessageTextPool("K330"),{actions:[p.Action.OK,p.Action.CANCEL],emphasizedAction:this.getMessageTextPool("K318"),onClose:function e(r){if(r==="OK"){Promise.resolve(t._oPage.setBusy(true)).then(t._isValidForm.bind(t,t._oGeneralForm)).then(t._buildProcessObjToSave.bind(t)).then(t._saveOrUpdateProcess.bind(t)).then(t._handleResponseToSap.bind(t)).then(f.post.bind(f,"".concat(c.SAVE_BIDDING_POSITION))).then(t._oNavToPosition.bind(t)).catch(t.errorHandler.bind(t)).finally(t._oPage.setBusy.bind(t._oPage,false))}}})}},onNavBackProcess:function e(){var t=this;p.alert(this.getMessageTextPool("K325"),{actions:[p.Action.OK,p.Action.CANCEL],emphasizedAction:p.Action.OK,onClose:function e(r){if(r===p.Action.OK){t.onNavBackTable()}}})},_loadItemsTipoProc:function e(){var t=this;if(this._oFormModel.getProperty("/valueHelp/tipoProc").length===0){return m.get("".concat(c.api.PROCESS_TYPE_PATH,"?language=ES")).then(function(e){var r=e.data;t._oFormModel.setProperty("/valueHelp/tipoProc",r)})}return Promise.resolve()},onChangePositionValue:function e(t){var r=t.getSource();var o=r.getValue();var a=r.getName();if(a==="MAT_TEXT_COMPR"||a==="MAT_TEXT_LARGO"){o=this._buildObjectText(o)}var i=r.getBindingContext("store");var n=i.getPath();var s=i.getModel();s.setProperty("".concat(n,"/").concat(a),o);s.updateBindings(true);s.refresh()},onLoadItems:function e(t){var r=t.getName();r=r.charAt(0).toUpperCase()+r.slice(1);Promise.resolve(t.setBusy(true)).then(this["_loadItems".concat(r)].bind(this)).catch(this.errorHandler.bind(this)).finally(t.setBusy.bind(t,false))}}))});