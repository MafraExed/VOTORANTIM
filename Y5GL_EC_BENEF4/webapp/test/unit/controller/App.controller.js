sap.ui.define(["Y5GL_EC_BENEF4/Y5GL_EC_BENEF4/controller/App.controller","sap/m/SplitApp","sap/ui/core/Control","sap/ui/model/json/JSONModel","sap/ui/thirdparty/sinon","sap/ui/thirdparty/sinon-qunit"],function(t,e,n,i){"use strict";QUnit.module("AppController - Hide master");QUnit.test("Should hide the master of a SplitApp when selection in the list changes",function(o){var s,r=new n,a=new i,u=new n,l=new e,p=sinon.spy(l,"hideMaster");u.oListSelector={attachListSelectionChange:function(t,e){s=t.bind(e)}};u.getContentDensityClass=jQuery.noop;a.metadataLoaded=function(){return{then:jQuery.noop}};a.attachMetadataFailed=function(){jQuery.noop()};u.setModel(a);var d=new t;this.stub(d,"byId").withArgs("idAppControl").returns(l);this.stub(d,"getView").returns(r);this.stub(d,"getOwnerComponent").returns(u);d.onInit();o.ok(s,"Did register to the change event of the ListSelector");s();o.strictEqual(p.callCount,1,"Did hide the master")})});