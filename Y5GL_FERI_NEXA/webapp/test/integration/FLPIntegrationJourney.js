sap.ui.define(["sap/ui/test/opaQunit","./pages/Master","./pages/Detail"],function(e){"use strict";QUnit.module("FLP Integration");e("Should open the share menu and display the share buttons on the detail page",function(e,t,a){e.iStartMyFLPApp({intent:"Y5GL_FERI_NEXA-display"});t.onTheMasterPage.iPressOnTheObjectAtPosition(1).and.iRememberTheSelectedItem();a.onTheDetailPage.iShouldSeeTheRememberedObject();t.onTheDetailPage.iPressOnTheShareButton();a.onTheDetailPage.iShouldSeeTheShareActionButtons().and.theShareTileButtonShouldContainTheRememberedObjectName();a.iLeaveMyFLPApp()})});