sap.ui.define(["sap/ui/test/opaQunit","./pages/Object","./pages/Worklist"],function(e){"use strict";QUnit.module("FLP Integration");e("Should open the share menu and display the share buttons on the worklist page",function(e,t,n){e.iStartMyFLPApp({intent:"integracaoUnico-display"});t.onTheWorklistPage.iPressOnTheShareButton();n.onTheWorklistPage.iShouldSeeTheShareTileButton()});e("Should open the share menu and display the share buttons",function(e,t,n){t.onTheWorklistPage.iRememberTableItemAtPosition(1).and.iPressTableItemAtPosition(1);t.onTheObjectPage.iPressOnTheShareButton();n.onTheObjectPage.and.iShouldSeeTheShareTileButton().and.theShareTileButtonShouldContainTheRememberedObjectName();n.iLeaveMyFLPApp()})});