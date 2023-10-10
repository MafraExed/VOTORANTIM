sap.ui.define(["Y5GL_REC_FERI/Y5GL_REC_FERI/model/grouper","sap/ui/model/resource/ResourceModel","jquery.sap.global"],function(e,r,t){"use strict";function o(){return new r({bundleUrl:[t.sap.getModulePath("Y5GL_REC_FERI.Y5GL_REC_FERI"),"i18n/i18n.properties"].join("/")})}QUnit.module("Sorter - Grouping functions",{beforeEach:function(){this._oResourceModel=o()},afterEach:function(){this._oResourceModel.destroy()}});function u(e){return{getProperty:function(){return e}}}QUnit.test("Should group a price lesser equal 20",function(r){var t=u(17.2),o;var s=e.groupUnitNumber(this._oResourceModel.getResourceBundle());o=s(t);r.strictEqual(o.key,"LE20","The key is as expected for a low value");r.strictEqual(o.text,this._oResourceModel.getResourceBundle().getText("masterGroup1Header1"),"The group header is as expected for a low value")});QUnit.test("Should group the price",function(r){var t=u(55.5),o;var s=e.groupUnitNumber(this._oResourceModel.getResourceBundle());o=s(t);r.strictEqual(o.key,"GT20","The key is as expected for a high value");r.strictEqual(o.text,this._oResourceModel.getResourceBundle().getText("masterGroup1Header2"),"The group header is as expected for a high value")})});