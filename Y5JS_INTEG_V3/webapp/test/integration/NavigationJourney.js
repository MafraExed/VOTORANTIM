sap.ui.define(["sap/ui/test/opaQunit","sap/ui/Device","./pages/Worklist","./pages/Browser","./pages/Object"],function(e,t){"use strict";QUnit.module("Navigation");e("Should see the objects list",function(e,t,o){e.iStartMyApp();o.onTheWorklistPage.iShouldSeeTheTable()});e("Object Page shows the correct object Details",function(e,t,o){t.onTheWorklistPage.iRememberTheItemAtPosition(1).and.iPressATableItemAtPosition(1);o.onTheObjectPage.iShouldSeeTheRememberedObject()});e("Should be on the table page again when browser back is pressed",function(e,t,o){t.onTheBrowser.iPressOnTheBackwardsButton();o.onTheWorklistPage.iShouldSeeTheTable();o.iTeardownMyApp()})});