"use strict";var _excluded=["RETMES"],_excluded2=["MSGTEXT"];function ownKeys(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)}return r}function _objectSpread(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?ownKeys(Object(r),!0).forEach(function(t){_defineProperty(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}function _defineProperty(e,t,r){if(t in e){Object.defineProperty(e,t,{value:r,enumerable:true,configurable:true,writable:true})}else{e[t]=r}return e}function _objectWithoutProperties(e,t){if(e==null)return{};var r=_objectWithoutPropertiesLoose(e,t);var n,o;if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++){n=i[o];if(t.indexOf(n)>=0)continue;if(!Object.prototype.propertyIsEnumerable.call(e,n))continue;r[n]=e[n]}}return r}function _objectWithoutPropertiesLoose(e,t){if(e==null)return{};var r={};var n=Object.keys(e);var o,i;for(i=0;i<n.length;i++){o=n[i];if(t.indexOf(o)>=0)continue;r[o]=e[o]}return r}
/*!
 * SiTrack - Seguimiento de compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */sap.ui.define([],function(){return function(){var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:[];return e.map(function(e){var t=e.RETMES,r=_objectWithoutProperties(e,_excluded);return _objectSpread(_objectSpread({},r),{},{RETMES:{item:t.map(function(e){var t=e.MSGTEXT,r=_objectWithoutProperties(e,_excluded2);return _objectSpread(_objectSpread({},r),{},{MSGTEXT:{item:t||[]}})})||[]}})})}});