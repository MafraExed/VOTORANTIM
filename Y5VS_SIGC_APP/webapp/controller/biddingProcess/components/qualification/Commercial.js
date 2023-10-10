"use strict";function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArray(e){if(typeof Symbol!=="undefined"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _slicedToArray(e,t){return _arrayWithHoles(e)||_iterableToArrayLimit(e,t)||_unsupportedIterableToArray(e,t)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,t){if(!e)return;if(typeof e==="string")return _arrayLikeToArray(e,t);var i=Object.prototype.toString.call(e).slice(8,-1);if(i==="Object"&&e.constructor)i=e.constructor.name;if(i==="Map"||i==="Set")return Array.from(e);if(i==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i))return _arrayLikeToArray(e,t)}function _arrayLikeToArray(e,t){if(t==null||t>e.length)t=e.length;for(var i=0,o=new Array(t);i<t;i++){o[i]=e[i]}return o}function _iterableToArrayLimit(e,t){var i=e==null?null:typeof Symbol!=="undefined"&&e[Symbol.iterator]||e["@@iterator"];if(i==null)return;var o=[];var r=true;var n=false;var a,s;try{for(i=i.call(e);!(r=(a=i.next()).done);r=true){o.push(a.value);if(t&&o.length===t)break}}catch(e){n=true;s=e}finally{try{if(!r&&i["return"]!=null)i["return"]()}finally{if(n)throw s}}return o}function _arrayWithHoles(e){if(Array.isArray(e))return e}function ownKeys(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),i.push.apply(i,o)}return i}function _objectSpread(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?ownKeys(Object(i),!0).forEach(function(t){_defineProperty(e,t,i[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):ownKeys(Object(i)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))})}return e}function _defineProperty(e,t,i){if(t in e){Object.defineProperty(e,t,{value:i,enumerable:true,configurable:true,writable:true})}else{e[t]=i}return e}
/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define(["com/innova/sigc/factory/commercialQualification/roundHistory","com/innova/sigc/factory/commercialQualification/qualification","com/innova/sigc/lib/richTextEditor/editor","com/innova/sigc/model/constant","com/innova/sigc/model/process/roundsProcessStatus/RoundsProcessStatus","com/innova/sigc/model/process/EntProvEvaluationCriteria","com/innova/sigc/model/process/LevelEvaluationCriteria","com/innova/sigc/model/process/TypesEvaluationCriteria","com/innova/sigc/model/offer/offerStatus/useOfferStatus","com/innova/sigc/service/http","com/innova/sigc/utils/keyBy","com/innova/sigc/utils/parseUniversalDate","com/innova/sigc/utils/isEmpty","com/innova/sigc/utils/isStatusTypeC","com/innova/sigc/utils/isStatusTypeT","com/innova/sigc/utils/showToast","com/innova/vendor/lodash.filter","com/innova/vendor/lodash.find","com/innova/vendor/lodash.get","sap/ui/core/Fragment","sap/ui/core/ValueState","sap/ui/model/json/JSONModel","sap/ui/model/Sorter"],function(e,t,i,o,r,n,a,s,c,d,u,l,f,v,h,m,p,g,_,b,P,y,I){return{onSaveQualificationByHeader:function e(t){Promise.resolve(this._oPage.setBusy(true)).then(this._getItemsUpdatedQualification.bind(this,t)).then(this._buildQualificationRequest.bind(this)).then(d.update.bind(d,o.api.HEADER_CRITERIA)).then(this._updateStateQualification.bind(this)).then(this._fetchAPI.bind(this,this._numProc)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage,false))},onSaveQualificationByPos:function e(t){Promise.resolve(this._oPage.setBusy(true)).then(this._getItemsUpdatedQualification.bind(this,t)).then(this._buildQualificationRequestByPosition.bind(this)).then(this._updateStateQualification.bind(this)).then(this._fetchAPI.bind(this,this._numProc)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage,false))},onQualificationInputChange:function e(t,i){var o,r;var n=t.options;var a=i.getSource();a.setValueState(P.None);var s=a.getValue();if(!f(s)&&!/^[0-9]\d?$|^100$/.test("".concat(s))){s=null;a.setValue(null);a.setValueState(P.Error)}var c=a.getParent().getParent();var d=c.getBindingContext().getObject();d.isUpdated=true;var u=d===null||d===void 0?void 0:(o=d.qualifications)===null||o===void 0?void 0:o.get(n.vendorId);d===null||d===void 0?void 0:(r=d.qualifications)===null||r===void 0?void 0:r.set(n.vendorId,_objectSpread(_objectSpread({},u),{},{value:s,updated:true}))},onCommercialPositionSelectionChange:function e(t){var i=t.getParameter("listItem");var o=t.getParameter("selected");var r=i.getBindingContext();var n=r.getModel();var a=r.getProperty("posProc");var s=n.getProperty("/rows");var c=s.map(function(e){var t=_objectSpread({},e);t.selected=o?t.posProc===a:false;return t});n.setProperty("/rows",c)},onReactivatePositionDialog:function e(t){var i=this;Promise.resolve(this._oPage.setBusy(true)).then(this._getItemsSelectedQualification.bind(this,t)).then(function(e){var t=i._validateOffersOrPosToRejectOrReactivate({selectedItems:e,fnSome:i._isPosOfferRejectedByCommercialEvaluator});if(!t.length){return Promise.reject(new Error(i._i18n.getText("0268")))}return t}).then(this._openReactivatePositionDialog.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage,false))},onReactivatePosition:function e(){var t=this;Promise.resolve(this._oRejectPositionDialog.setBusy(true)).then(this._getSelectedItems.bind(this,this.byId("reactivatePositionTable"))).then(this._buildRequestToRejectOrReactivatePosition.bind(this,undefined)).then(d.post.bind(d,o.api.POSITION_OFFERS_REACTIVATE_PATH)).then(this._fetchCommercialQualifications.bind(this)).then(function(){m(t._i18n.getText("Commons.0021"));t._oRejectPositionDialog.close()}).catch(this.errorHandler.bind(this)).finally(this._oRejectPositionDialog.setBusy.bind(this._oRejectPositionDialog,false))},onRejectPositionDialog:function e(t){var i=this;Promise.resolve(this._oPage.setBusy(true)).then(this._getItemsSelectedQualification.bind(this,t)).then(function(e){var t=i._validateOffersOrPosToRejectOrReactivate({selectedItems:e,fnSome:i._canRejectPositionOffer});if(!t.length){return Promise.reject(new Error(i._i18n.getText("0269")))}return t}).then(this._openRejectPositionDialog.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage,false))},onRejectPosition:function e(){var t=this;Promise.resolve(this._oRejectPositionDialog.setBusy(true)).then(this._getSelectedItems.bind(this,this.byId("rejectPositionTable"))).then(this._buildRequestToRejectOrReactivatePosition.bind(this,this._oRejectPositionEditor.getContent())).then(d.post.bind(d,o.api.POSITION_OFFERS_REJECT_PATH)).then(this._fetchCommercialQualifications.bind(this)).then(function(){m(t._i18n.getText("Commons.0021"));t._oRejectPositionDialog.close()}).catch(this.errorHandler.bind(this)).finally(this._oRejectPositionDialog.setBusy.bind(this._oRejectPositionDialog,false))},onRejectOffersDialog:function e(t){var i=this;Promise.resolve(this._oPage.setBusy(true)).then(this._getItemsSelectedQualification.bind(this,t)).then(function(e){var t=i._validateOffersOrPosToRejectOrReactivate({selectedItems:e,fnSome:i._canRejectOffer});if(!t.length){return Promise.reject(new Error(i._i18n.getText("0274")))}return t}).then(this._openRejectOffersDialog.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage,false))},onRejectOffers:function e(){var t=this;Promise.resolve(this._oRejectOfferDialog.setBusy(true)).then(this._getSelectedItems.bind(this,this.byId("rejectOffersTable"))).then(this._buildRequestToRejectOrReactivateOffers.bind(this,undefined)).then(d.post.bind(d,o.api.OFFERS_REJECT_PATH)).then(this._fetchCommercialQualifications.bind(this,this._numProc)).then(function(){m(t._i18n.getText("Commons.0021"));t._oRejectOfferDialog.close()}).catch(this.errorHandler.bind(this)).finally(this._oRejectOfferDialog.setBusy.bind(this._oRejectOfferDialog,false))},onReactivateOffersDialog:function e(t){var i=this;Promise.resolve(this._oPage.setBusy(true)).then(this._getItemsSelectedQualification.bind(this,t)).then(function(e){var t=i._validateOffersOrPosToRejectOrReactivate({selectedItems:e,fnSome:i._isOfferRejectedByCommercialEvaluator});if(!t.length){return Promise.reject(new Error(i._i18n.getText("0273")))}return t}).then(this._openReactivateOffersDialog.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage,false))},onReactivateOffers:function e(){var t=this;Promise.resolve(this._oReactivateOffersDialog.setBusy(true)).then(this._getSelectedItems.bind(this,this.byId("reactivateOffersTable"))).then(this._buildRequestToRejectOrReactivateOffers.bind(this,undefined)).then(d.post.bind(d,o.api.OFFERS_REACTIVATE_PATH)).then(this._fetchCommercialQualifications.bind(this)).then(function(){m(t._i18n.getText("Commons.0021"));t._oReactivateOffersDialog.close()}).catch(this.errorHandler.bind(this)).finally(this._oReactivateOffersDialog.setBusy.bind(this._oReactivateOffersDialog,false))},onCommentPositionDialog:function e(t){Promise.resolve(this._oPage.setBusy(true)).then(this._getItemsSelectedQualification.bind(this,t)).then(this._openCommentPositionDialogDialog.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage,false))},onCommentPosition:function e(){var t=this;Promise.resolve(this._oCommentPositionDialog.setBusy(true)).then(this._getSelectedItems.bind(this,this.byId("commentPositionTable"))).then(this._buildRequestToRejectOrReactivatePosition.bind(this,this._oCommentPositionEditor.getContent())).then(d.post.bind(d,o.api.POSITION_OFFERS_COMMENT_PATH)).then(this._fetchCommercialQualifications.bind(this)).then(function(){m(t._i18n.getText("Commons.0021"));t._oCommentPositionDialog.close()}).catch(this.errorHandler.bind(this)).finally(this._oCommentPositionDialog.setBusy.bind(this._oCommentPositionDialog,false))},onSaveConversionDate:function e(){var t=this;var i=this.byId("conversionDateDP").getDateValue();var r=i.toISOString();var n=this._oFormModel.getProperty("/conversionDate");if(r!==n){Promise.resolve(this._oPage.setBusy(true)).then(d.update.bind(d,"".concat(o.api.PROCESS_PATH,"/").concat(this._numProc),{conversionDate:r})).then(this._callTabsStrategy.bind(this)).then(function(){m(t._i18n.getText("Commons.0021"))}).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage,false))}},onRoundHistoryButtonPress:function t(){var i=this;var o=this._oFormModel.getProperty("/positions");var r=[{label:this._i18n.getText("0083"),name:"posProc",template:"PosProc"},{label:this._i18n.getText("0039"),name:"matnr",template:"Matnr"}];var n=o.map(function(e){return{posId:e.id,posProc:e.posProc,matnr:e.matnr,maktx:e.maktx}});this._buildRoundHistory({columns:r,rows:n});var a=this.getView();b.load({id:a.getId(),name:"com.innova.sigc.view.biddingProcess.dialog.qualification.RoundHistory",controller:this}).then(function(t){var o=t;a.addDependent(o);o.getEndButton().attachPress(o.close.bind(o));o.attachAfterClose(o.destroy.bind(o));var s=i.byId("roundHistoryTable");s.unbindColumns().unbindRows().bindColumns({path:"/columns",factory:e.createColumns.bind(i)}).bindRows({path:"/rows",parameters:{arrayNames:["roundHistory"],numberOfExpandedLevels:"/numberOfExpandedLevels",rootLevel:1}}).setModel(new y({columns:r,rows:n}));o.open()})},_fetchCommercialQualifications:function e(){var t=this;return d.get("".concat(o.api.PROCESS_PATH,"/").concat(this._numProc,"/").concat(o.api.OFFERS_PATH)).then(function(e){var i=e.data;t._oConversionCurrency=null;var o=t._oFormModel.getData();var r=o.conversionCurrency;var n=Promise.resolve({data:i});if(!f(r)){n=t._fetchCommercialQualificationsWithConversionCurrency({conversionCurrency:r,conversionDate:o.conversionDate,offers:i})}return n}).then(this._handleResCommercialQualifications.bind(this))},_fetchCommercialQualificationsWithConversionCurrency:function e(t){var i=this;var r=t.conversionCurrency,n=t.conversionDate,a=t.offers;return this._fetchWithConversionCurrency({conversionCurrency:r,offers:a,conversionDate:n}).then(d.post.bind(d,"".concat(o.api.PROCESS_PATH,"/").concat(this._numProc,"/comercial-calification"))).then(function(e){var t=u(e.data,"angnr");var o=u(i._oConversionCurrency.rates,"currency");return{data:a.map(function(e){var r;return _objectSpread(_objectSpread({},e),{},{pricesPerRound:(r=t[e.angnr])===null||r===void 0?void 0:r.pricesPerRound.map(function(e){return _objectSpread(_objectSpread({},e),{},{bbwert:parseFloat("".concat(e.bbwert*o[e.waers].value)).toFixed(2),waers:i._oConversionCurrency.currencyBase})})})})}})},_handleResCommercialQualifications:function e(t){var i=t.data;var o=this._oFormModel.getData();this._oFormModel.setProperty("/offers",i);this.byId("conversionDateOT").setVisible(!f(o.conversionCurrency));this.byId("conversionDateDP").setDateValue(o.conversionDate?l(o.conversionDate):new Date);this._buildCommercialQualifications(_objectSpread(_objectSpread({},o),{},{offers:i}))},_buildCommercialQualifications:function e(t){var i=p(_(t,"offers",[]),{estaOfer:true});var o=_(t,"status","");var r=_(t,"positions",[]);var n=_(t,"roundsProcess",[]);var a=_(t,"evaluationCriteria",[]);var c=p(a,{tipo:s.C});var d=this._getDefaultQualificationColumns(),u=_slicedToArray(d,2),l=u[0],f=u[1];this._buildCommercialQualificationsByHeader({evaluationCriteria:c,headerColumn:l,offers:i,processStatus:o});this._buildCommercialQualificationsByPos({evaluationCriteria:c,offers:i,positionColumn:f,processPositions:r,processStatus:o,roundProcess:n})},_buildCommercialQualificationsByHeader:function e(i){var o=this;var r=i.evaluationCriteria,n=i.headerColumn,s=i.offers,c=i.processStatus;var d=JSON.parse(JSON.stringify(n));var u=p(r,{indCabPos:a.C.key});var l=this._mappedOffers({offers:s,rows:u.map(this._mapEvaluationCriteria)});s.forEach(function(e){var t=_(e,"headerCriteria",[]);var i=_(e,"vendor.idProv","");var r={offerId:e.angnr,vendorId:i,label:_(e,"vendor.name1",""),name:i,template:"Custom",processStatus:c};t.forEach(function(t){var r=g(l,{criteriaId:t.evaluationCriteriaId});if(r){o._addPositionCriteriaToRow({criteria:t,offerId:e.angnr,row:r,vendorId:i})}});d.push(r)});var f=this.byId("commercialQualificationTableByHeader");var v=this.byId("commercialQualificationPanel");v.setHeaderText("".concat(this.getResourceBundle().getText("0082")," (").concat(l.length,")"));f.bindItems({path:"/rows",sorter:new I("posId"),factory:t.createItems.bind(this)}).setModel(new y({rows:l,columns:d}))},_buildCommercialQualificationsByPos:function e(i){var n=this;var s=i.evaluationCriteria,c=i.offers,d=i.positionColumn,u=i.processPositions,l=i.processStatus,f=i.roundProcess;var v=JSON.parse(JSON.stringify(d));var h=p(s,{indCabPos:a.P.key});var m=g(h,{criterio:o.CRITERIA_PRICE_KEY});var b=this._mappedOffers({offers:c,rows:this._mergeEvaluationCriteriaWithProcessPositions({evaluationCriteria:h,processPositions:u}),isPosition:true});var P=g(f,{estatusRonda:r.ABIERTO.status});c.forEach(function(e){var t=_(e,"positions",[]);var i=_(e,"positionCriteria",[]);var o=_(e,"vendor.idProv","");var r=_(e,"pricesPerRound",[]);var a={offerId:e.angnr,vendorId:o,label:_(e,"vendor.name1",""),name:o,template:"Custom",processStatus:l};t.forEach(function(t){var i=p(b,{posId:t.positionId});i.forEach(function(i){var r,n,a;var s=i;s["cantOfer_".concat(o)]=t.cantOfer;s["cantAsig_".concat(o)]=t.cantAsig;s["diasEntrega_".concat(o)]=t.diasEntrega;s["diasGarantia_".concat(o)]=t.diasGarantia;(r=s.status)!==null&&r!==void 0?r:s.status=new Map;s.status.set(o,{status:t.status,statusType:e.statusEvaluatorType||t.statusEvaluatorType});var c=(n=s.offers)===null||n===void 0?void 0:n.get(o);(a=s.offers)===null||a===void 0?void 0:a.set(o,_objectSpread(_objectSpread({},c),{},{status:t.status,statusType:t.statusEvaluatorType}))})});i.forEach(function(t){var i=g(b,{posId:t.positionId,criteriaId:t.evaluationCriteriaId});n._addPositionCriteriaToRow({row:i,criteria:t,vendorId:o,offerId:e.angnr})});n._addPriceCriteriaToRow({criteriaId:m===null||m===void 0?void 0:m.id,vendorId:o,roundId:P===null||P===void 0?void 0:P.roundId,rows:b,pricesPerRound:r});v.push(a)});var R=this.byId("commercialQualificationTableByPosition");R.bindItems({path:"/rows",sorter:new I("posId"),factory:t.createItems.bind(this)}).setModel(new y({rows:b,columns:v}))},_mergeEvaluationCriteriaWithProcessPositions:function e(t){var i=t.evaluationCriteria,o=t.processPositions;var r=[];i.map(this._mapEvaluationCriteria).forEach(function(e){o.forEach(function(t){r.push(_objectSpread(_objectSpread({},e),{},{posId:t.id,posProc:t.posProc,matnr:t.matnr,maktx:t.maktx}))})});return r},_mappedOffers:function e(t){var i=this;var o=t.offers,r=t.rows,n=t.isPosition;var a=o.reduce(function(e,t){var i=_slicedToArray(e,2),o=i[0],r=i[1];var n=_(t,"vendor.idProv","");var a=_(t,"vendor.name1","");var s=_(t,"angnr","");var c=_(t,"status","");r.set(n,{status:c,statusType:t.statusEvaluatorType});o.set(n,{offerId:s,vendorName:a,status:c,statusType:t.statusEvaluatorType});return[o,r]},[new Map,new Map]);return r.map(function(e){return _objectSpread(_objectSpread({},e),{},{qualifications:new Map(JSON.parse(JSON.stringify(_toConsumableArray(i._mappedQualification({row:e,offers:o,isPosition:n}))))),commentsByPosition:new Map(JSON.parse(JSON.stringify(_toConsumableArray(i._mappedComments({row:e,offers:o}))))),offers:new Map(JSON.parse(JSON.stringify(_toConsumableArray(a[0])))),status:new Map(JSON.parse(JSON.stringify(_toConsumableArray(a[1]))))})})},_mappedQualification:function e(t){var i=t.offers,o=t.row,r=t.isPosition;var n=o;var a=_objectSpread({evaluationCriteriaId:n.criteriaId},r?{positionId:n.posId}:{});return i.reduce(function(e,t){var i=_(t,"angnr","");var o=_(t,"vendor.idProv","");e.set(o,_objectSpread(_objectSpread({},a),{},{offerId:i,value:null}));return e},new Map)},_mappedComments:function e(t){var i=t.offers,o=t.row;var r=o;var n=r.posId;return i.reduce(function(e,t){var i=_(t,"angnr","");var o=_(t,"vendor.idProv","");var r=_(t,"positions",[]);var a=g(r,{positionId:n});var s=_(a,"comments",[]);e.set(o,{comments:s,offerId:i});return e},new Map)},_addPositionCriteriaToRow:function e(t){var i=t.criteria,o=t.offerId,r=t.row,a=t.vendorId;if(r){var s;var c=r;var d=_(n,"".concat(r.entradaProveedor,".prop"),"");c[a]=i[d];(s=c.qualifications)!==null&&s!==void 0?s:c.qualifications=new Map;c.qualifications.set(a,{posId:i.id,valuePerVendor:i[d],offerId:o,value:i.calificacion})}},_addPriceCriteriaToRow:function e(t){var i=t.rows,o=t.pricesPerRound,r=t.vendorId,n=t.criteriaId,a=t.roundId;o.filter(function(e){return a===e.roundId}).forEach(function(e){var t=g(i,{posId:e.positionId,criteriaId:n});if(t){var o;t.isPrice=true;t[r]={bbwert:e.bbwert,waers:e.waers};(o=t.qualifications)!==null&&o!==void 0?o:t.qualifications=new Map;t.qualifications.set(r,{isPrice:true,valuePerVendor:e.bbwert,waers:e.waers,value:e.calificacion,offerId:e.offerId,positionId:e.positionId,roundId:e.roundId})}})},_buildQualificationRequest:function e(t){var i=this;var o=[];var r=(new Date).toISOString();t.forEach(function(e){var t;var n=e.getBindingContext().getObject();n===null||n===void 0?void 0:(t=n.qualifications)===null||t===void 0?void 0:t.forEach(function(e){if(e.updated){o.push(_objectSpread(_objectSpread({},i._setQualificationKeys(e)),{},{calificacion:e.value,fechaCal:r}))}})});return o},_setQualificationKeys:function e(t){if(t.isPrice){return{offerId:t.offerId,positionId:t.positionId,roundId:t.roundId}}if(!f(t.posId)){return{id:t.posId}}return{offerId:t.offerId,positionId:t.positionId,evaluationCriteriaId:t.evaluationCriteriaId}},_buildQualificationRequestByPosition:function e(t){var i=t.filter(function(e){return!e.getBindingContext().getProperty("isPrice")});var r=t.filter(function(e){return e.getBindingContext().getProperty("isPrice")});var n=this._buildQualificationRequest(i);var a=this._buildQualificationRequest(r);return Promise.allSettled([n.length?d.update(o.api.POSITION_CRITERIA,n):Promise.resolve(),a.length?d.update("".concat(o.api.PRICES_PER_ROUND),a):Promise.resolve()])},_updateStateQualification:function e(){m(this.getResourceBundle().getText("Commons.0021"));this._oQualificationItems.filter(function(e){return e.getBindingContext().getProperty("isUpdated")}).forEach(function(e){var t;var i=e.getBindingContext().getObject();delete i.isUpdated;i===null||i===void 0?void 0:(t=i.qualifications)===null||t===void 0?void 0:t.entries(function(e){var t=_slicedToArray(e,2),o=t[0],r=t[1];var n=_objectSpread({},r);delete n.updated;i.qualifications.set(o,n)})})},_buildRoundHistory:function e(t){var i=t.columns,o=t.rows;var r=this._oFormModel.getProperty("/roundsProcess");var n=this._oFormModel.getProperty("/offers");var a=this._i18n.getText("0311");n.forEach(function(e){var t=_(e,"pricesPerRound",[]);var n=_(e,"vendor",{}),s=n.name1,c=n.idProv;i.push({label:s,name:"round",template:"Round",vendorId:c});t===null||t===void 0?void 0:t.forEach(function(e){var t;var i=g(o,{posId:_(e,"positionId","")});var n=g(r,{roundId:_(e,"roundId","")});var s=n.roundId;(t=i.roundHistory)!==null&&t!==void 0?t:i.roundHistory=[];var d=g(i.roundHistory,{roundId:s});if(!d){d=_defineProperty({roundId:s,posProc:"".concat(a," ").concat(n.round)},c,{bbwert:e.bbwert,waers:_(e,"waers","")});i.roundHistory.push(d)}else{d[c]={bbwert:e.bbwert,waers:_(e,"waers","")}}})})},_buildRequestToRejectOrReactivatePosition:function e(t,i){return i.map(function(e){return{offerId:e.getBindingContext().getProperty("offerId"),processPositionId:e.getBindingContext().getProperty("positionId"),message:t}})},_buildRequestToRejectOrReactivateOffers:function e(t,i){return i.map(function(e){return{angnr:e.getBindingContext().getProperty("offerId")}})},_validateOffersOrPosToRejectOrReactivate:function e(t){var i=t.selectedItems,o=t.fnSome;return i.filter(function(e){var t=[];var i=e.getBindingContext();var r=i.getProperty("offers");r===null||r===void 0?void 0:r.forEach(function(e){var i=e.status,o=e.statusType;t.push({status:i,statusType:o})});return t.some(o)})},_isOfferRejectedByCommercialEvaluator:function e(t){var i=t.status,o=t.statusType;return c.isOfferRejectedByEvaluator(i)&&v({statusType:o})},_canRejectOffer:function e(t){var i=t.status,o=t.statusType;return!c.isOfferRejected(i)&&!c.isTotalWinningOffer(i)&&!h({statusType:o})},_openRejectOffersDialog:function e(t){var o=this;var r=this.getView();b.load({id:r.getId(),name:"com.innova.sigc.view.biddingProcess.dialog.qualification.RejectOffers",controller:this}).then(function(e){var n=e;r.addDependent(n);n.getEndButton().attachPress(n.close.bind(n));o._oRejectOfferDialog=n;var a=t.map(function(e){return e.getBindingContext().getObject()});var s=[];var c=_(a,"[0].offers",new Map);c.forEach(function(e,t){var i=e.offerId,r=e.vendorName,n=e.status,a=e.statusType;if(o._canRejectOffer({status:n,statusType:a})){s.push({vendorId:t,offerId:i,vendorName:r,status:n})}});o._oRejectOfferDialog.setModel(new y({offers:s}));i.removeEditorManager();setTimeout(function(){o._oRejectOfferEditor=i.initializeQuillEditor.call(o,{container:o.byId("editorRejectOffers").getDomRef(),placeholder:o._i18n.getText("0111")});o._oRejectOfferEditor.render()});n.attachAfterClose(n.destroy.bind(n));n.open()})},_openReactivateOffersDialog:function e(t){var i=this;var o=this.getView();b.load({id:o.getId(),name:"com.innova.sigc.view.biddingProcess.dialog.qualification.ReactivateOffers",controller:this}).then(function(e){var r=e;o.addDependent(r);r.getEndButton().attachPress(r.close.bind(r));i._oReactivateOffersDialog=r;var n=t.map(function(e){return e.getBindingContext().getObject()});var a=[];var s=_(n,"[0].offers",new Map);s.forEach(function(e,t){var o=e.offerId,r=e.vendorName,n=e.status,s=e.statusType;if(i._isOfferRejectedByCommercialEvaluator({status:n,statusType:s})){a.push({vendorId:t,offerId:o,vendorName:r,status:n})}});i._oReactivateOffersDialog.setModel(new y({offers:a}));r.attachAfterClose(r.destroy.bind(r));r.open()})},_isPosOfferRejectedByCommercialEvaluator:function e(t){var i=t.status,o=t.statusType;return c.isPositionRejectedByEvaluator(i)&&v({statusType:o})},_canRejectPositionOffer:function e(t){var i=t.status,o=t.statusType;return!c.isPositionRejected(i)&&!c.isPositionWinning(i)&&!h({statusType:o})},_openRejectPositionDialog:function e(t){var o=this;var r=this.getView();b.load({id:r.getId(),name:"com.innova.sigc.view.biddingProcess.dialog.qualification.RejectPosition",controller:this}).then(function(e){var n=e;r.addDependent(n);n.getEndButton().attachPress(n.close.bind(n));o._oRejectPositionDialog=n;var a=t.map(function(e){return e.getBindingContext().getObject()});var s=_(a,"[0].posProc",0);var c=_(a,"[0].posId",0);var d=_(a,"[0].matnr",0);var u=_(a,"[0].maktx",0);var l=[];var f=_(a,"[0].offers",new Map);f.forEach(function(e,t){var i=e.offerId,r=e.vendorName,n=e.status,a=e.statusType;if(o._canRejectPositionOffer({status:n,statusType:a})){l.push({positionId:c,vendorId:t,offerId:i,vendorName:r,status:n})}});o._oRejectPositionDialog.setModel(new y({positionNumber:s,positionId:c,positionMatnr:d,positionMaktx:u,offers:l}));i.removeEditorManager();setTimeout(function(){o._oRejectPositionEditor=i.initializeQuillEditor.call(o,{container:o.byId("editorRejectPosition").getDomRef(),placeholder:o._i18n.getText("0111")});o._oRejectPositionEditor.render()});n.attachAfterClose(n.destroy.bind(n));n.open()})},_openReactivatePositionDialog:function e(t){var i=this;var o=this.getView();b.load({id:o.getId(),name:"com.innova.sigc.view.biddingProcess.dialog.qualification.ReactivatePosition",controller:this}).then(function(e){var r=e;o.addDependent(r);r.getEndButton().attachPress(r.close.bind(r));i._oRejectPositionDialog=r;var n=t.map(function(e){return e.getBindingContext().getObject()});var a=_(n,"[0].posProc",0);var s=_(n,"[0].posId",0);var c=_(n,"[0].matnr",0);var d=_(n,"[0].maktx",0);var u=[];var l=_(n,"[0].offers",new Map);l.forEach(function(e,t){var o=e.offerId,r=e.vendorName,n=e.status,a=e.statusType;if(i._isPosOfferRejectedByCommercialEvaluator({status:n,statusType:a})){u.push({positionId:s,vendorId:t,offerId:o,vendorName:r,status:n})}});i._oRejectPositionDialog.setModel(new y({positionNumber:a,positionId:s,positionMatnr:c,positionMaktx:d,offers:u}));r.attachAfterClose(r.destroy.bind(r));r.open()})},_openCommentPositionDialogDialog:function e(t){var o=this;var r=this.getView();b.load({id:r.getId(),name:"com.innova.sigc.view.biddingProcess.dialog.qualification.CommentPosition",controller:this}).then(function(e){var n=e;r.addDependent(n);n.getEndButton().attachPress(n.close.bind(n));o._oCommentPositionDialog=n;var a=t.map(function(e){return e.getBindingContext().getObject()});var s=_(a,"[0].posProc",0);var c=_(a,"[0].posId",0);var d=_(a,"[0].matnr",0);var u=_(a,"[0].maktx",0);var l=[];var f=_(a,"[0].offers",new Map);f.forEach(function(e,t){var i=e.offerId,o=e.vendorName,r=e.status;l.push({positionId:c,vendorId:t,offerId:i,vendorName:o,status:r})});o._oCommentPositionDialog.setModel(new y({positionNumber:s,positionId:c,positionMatnr:d,positionMaktx:u,offers:l}));i.removeEditorManager();setTimeout(function(){o._oCommentPositionEditor=i.initializeQuillEditor.call(o,{container:o.byId("editorCommentPosition").getDomRef(),placeholder:o._i18n.getText("0111")});o._oCommentPositionEditor.render()});n.attachAfterClose(n.destroy.bind(n));n.open()})}}});