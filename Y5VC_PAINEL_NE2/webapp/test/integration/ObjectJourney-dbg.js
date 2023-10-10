sap.ui.define(["sap/ui/test/opaQunit","./pages/Worklist","./pages/Browser","./pages/Object","./pages/App"],function(e){"use strict";QUnit.module("Object");e("Should remember the first item",function(e,t,i){e.iStartMyFLPApp({intent:"Y5VC_PAINEL_NE2-display"});t.onTheWorklistPage.iRememberTheItemAtPosition(1);i.onTheWorklistPage.theTitleShouldDisplayTheTotalAmountOfItems();i.iLeaveMyFLPApp()});e("Should start the app with remembered item",function(e,t,i){e.iRestartTheAppWithTheRememberedItem({intent:"Y5VC_PAINEL_NE2-display",delay:1e3,autoWait:false});t.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();i.onTheObjectPage.iShouldSeeTheObjectViewsBusyIndicator().and.theObjectViewsBusyIndicatorDelayIsRestored().and.iShouldSeeTheRememberedObject()});e("Should open the share menu and display the share buttons",function(e,t,i){t.onTheObjectPage.iPressOnTheShareButton();i.onTheObjectPage.iShouldSeeTheShareEmailButton();i.iLeaveMyFLPApp()})});