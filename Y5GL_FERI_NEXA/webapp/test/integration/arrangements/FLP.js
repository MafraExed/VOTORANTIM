sap.ui.define(["sap/ui/test/Opa5","sap/ui/core/routing/HashChanger","sap/ui/dom/includeStylesheet","sap/ui/model/odata/v2/ODataModel","sap/ui/fl/FakeLrepConnectorLocalStorage","../../../localService/mockserver","Y5GL_FERI_NEXA/Y5GL_FERI_NEXA/test/flpSandbox"],function(e,t,a,i,n,s,o){"use strict";function r(){a(sap.ui.require.toUrl("sap/ui/test/OpaCss.css"))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",r):r();return e.extend("Y5GL_FERI_NEXA.Y5GL_FERI_NEXA.test.integration.arrangements.FLP",{iStartMyFLPApp:function(e){var a=e||{};a.autoWait=typeof a.autoWait!=="undefined"?a.autoWait:true;a.delay=a.delay||1;this._clearSharedData();var i=[s.init(a),o.init()];this.iWaitForPromise(Promise.all(i));n.enableFakeConnector();this.waitFor({autoWait:a.autoWait,success:function(){(new t).setHash(a.intent+(a.hash?"&/"+a.hash:""))}})},iLeaveMyFLPApp:function(){return this.waitFor({success:function(){(new t).setHash("Shell-home")}})},_clearSharedData:function(){i.mSharedData={server:{},service:{},meta:{}}}})});