sap.ui.define(["sap/ui/test/opaQunit"],function(e){"use strict";module("FLP Integration");e("Should open the share menu and display the share buttons on the worklist page",function(e,t,n){e.iStartMyApp();t.onTheWorklistPage.iWaitUntilTheTableIsLoaded().and.iPressOnTheShareButton();n.onTheWorklistPage.and.iShouldSeeTheShareTileButton()});e("Should open the share menu and display the share buttons",function(e,t,n){t.onTheWorklistPage.iRememberTheItemAtPosition(1).and.iPressATableItemAtPosition(1).and.iWaitUntilTheListIsNotVisible();t.onTheObjectPage.iPressOnTheShareButton();n.onTheObjectPage.and.iShouldSeeTheShareTileButton().and.theShareTileButtonShouldContainTheRememberedObjectName();n.iTeardownMyAppFrame()})});