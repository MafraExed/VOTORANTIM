sap.ui.define(["sap/ui/test/opaQunit"],function(e){"use strict";QUnit.module("FLP Integration");e("Should open the share menu and display the share buttons on the detail page",function(e,t,a){e.iStartTheApp();t.onTheMasterPage.iRememberTheSelectedItem();a.onTheDetailPage.iShouldSeeTheRememberedObject();t.onTheDetailPage.iPressOnTheShareButton();a.onTheDetailPage.iShouldSeeTheShareEmailButton().and.iShouldSeeTheShareTileButton().and.theShareTileButtonShouldContainTheRememberedObjectName().and.iTeardownMyAppFrame()})});