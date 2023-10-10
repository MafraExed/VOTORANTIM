sap.ui.define(["sap/ui/test/Opa5","sap/ui/test/actions/Press","sap/ui/test/actions/EnterText","Y5GL_FERI_APRO2/Y5GL_FERI_APRO2/test/integration/pages/Common","sap/ui/test/matchers/AggregationLengthEquals","sap/ui/test/matchers/AggregationFilled","sap/ui/test/matchers/PropertyStrictEquals"],function(e,t,i,s,r,n,o){"use strict";var a="Master",u="*#-Q@@||",c=100;e.createPageObjects({onTheMasterPage:{baseClass:s,actions:{iWaitUntilTheListIsLoaded:function(){return this.waitFor({id:"list",viewName:a,matchers:new n({name:"items"}),errorMessage:"The master list has not been loaded"})},iWaitUntilTheFirstItemIsSelected:function(){return this.waitFor({id:"list",viewName:a,matchers:function(e){var t=e.getSelectedItem();return t&&e.getItems().indexOf(t)===0},errorMessage:"The first item of the master list is not selected"})},iSortTheListOnName:function(){return this.iPressItemInSelectInFooter("sort-select","masterSort1")},iSortTheListOnUnitNumber:function(){return this.iPressItemInSelectInFooter("sort-select","masterSort2")},iRemoveFilterFromTheList:function(){return this.iPressItemInSelectInFooter("filter-select","masterFilterNone")},iFilterTheListLessThan100UoM:function(){return this.iPressItemInSelectInFooter("filter-select","masterFilter1")},iFilterTheListMoreThan100UoM:function(){return this.iPressItemInSelectInFooter("filter-select","masterFilter2")},iGroupTheList:function(){return this.iPressItemInSelectInFooter("group-select","masterGroup1")},iRemoveListGrouping:function(){return this.iPressItemInSelectInFooter("group-select","masterGroupNone")},iOpenViewSettingsDialog:function(){return this.waitFor({id:"filter-button",viewName:a,check:function(){var t=e.getWindow().sap.ui.getCore().byId("viewSettingsDialog");return!t||t.$().length===0},actions:new t,errorMessage:"Did not find the 'filter' button."})},iSelectListItemInViewSettingsDialog:function(i){return this.waitFor({searchOpenDialogs:true,controlType:"sap.m.StandardListItem",matchers:new e.matchers.PropertyStrictEquals({name:"title",value:i}),actions:new t,errorMessage:"Did not find list item with title "+i+" in View Settings Dialog."})},iPressOKInViewSelectionDialog:function(){return this.waitFor({searchOpenDialogs:true,controlType:"sap.m.Button",matchers:new e.matchers.PropertyStrictEquals({name:"text",value:"OK"}),actions:new t,errorMessage:"Did not find the ViewSettingDialog's 'OK' button."})},iPressResetInViewSelectionDialog:function(){return this.waitFor({searchOpenDialogs:true,controlType:"sap.m.Button",matchers:new e.matchers.PropertyStrictEquals({name:"icon",value:"sap-icon://clear-filter"}),actions:new t,errorMessage:"Did not find the ViewSettingDialog's 'Reset' button."})},iPressItemInSelectInFooter:function(e,t){return this.waitFor({id:e,viewName:a,success:function(e){e.open();this.waitFor({id:t,viewName:a,success:function(e){e.$().trigger("tap")},errorMessage:"Did not find the "+t+" element in select"})}.bind(this),errorMessage:"Did not find the "+e+" select"})},iRememberTheSelectedItem:function(){return this.waitFor({id:"list",viewName:a,matchers:function(e){return e.getSelectedItem()},success:function(e){this.iRememberTheListItem(e)},errorMessage:"The list does not have a selected item so nothing can be remembered"})},iRememberTheIdOfListItemAtPosition:function(e){return this.waitFor({id:"list",viewName:a,matchers:function(t){return t.getItems()[e]},success:function(e){this.iRememberTheListItem(e)},errorMessage:"The list does not have an item at the index "+e})},iRememberAnIdOfAnObjectThatsNotInTheList:function(){return this.waitFor(this.createAWaitForAnEntitySet({entitySet:"ZET_AVISOFERSet",success:function(e){this.waitFor({id:"list",viewName:a,matchers:new n({name:"items"}),success:function(t){var i,s=e.filter(function(e){return!t.getItems().some(function(t){return t.getBindingContext().getProperty("Pernr")===e.Pernr})});if(!s.length){i=e[e.length-1].Pernr}else{i=s[0].Pernr}var r=this.getContext().currentItem;r.bindingPath="/"+t.getModel().createKey("ZET_AVISOFERSet",{Pernr:i});r.id=i},errorMessage:"the model does not have a item that is not in the list"})}}))},iPressOnTheObjectAtPosition:function(e){return this.waitFor({id:"list",viewName:a,matchers:function(t){return t.getItems()[e]},actions:new t,errorMessage:"List 'list' in view '"+a+"' does not contain an ObjectListItem at position '"+e+"'"})},iSearchForTheFirstObject:function(){var e;return this.waitFor({id:"list",viewName:a,matchers:new n({name:"items"}),success:function(s){e=s.getItems()[0].getTitle();return this.iSearchForValue(new i({text:e}),new t)},errorMessage:"Did not find list items while trying to search for the first item."})},iTypeSomethingInTheSearchThatCannotBeFoundAndTriggerRefresh:function(){var e=function(e){var t=jQuery.Event("touchend");t.originalEvent={refreshButtonPressed:true,id:e.getId()};t.target=e;t.srcElement=e;jQuery.extend(t,t.originalEvent);e.fireSearch(t)};return this.iSearchForValue([new i({text:u}),e])},iSearchForValue:function(e){return this.waitFor({id:"searchField",viewName:a,actions:e,errorMessage:"Failed to find search field in Master view.'"})},iClearTheSearch:function(){var e=function(e){e.clear()};return this.iSearchForValue([e])},iSearchForSomethingWithNoResults:function(){return this.iSearchForValue([new i({text:u}),new t])},iRememberTheListItem:function(e){var t=e.getBindingContext();this.getContext().currentItem={bindingPath:t.getPath(),id:t.getProperty("Pernr"),title:t.getProperty("AreaFpgto")}}},assertions:{iShouldSeeTheBusyIndicator:function(){return this.waitFor({id:"list",viewName:a,success:function(t){e.assert.ok(t.getBusy(),"The master list is busy")},errorMessage:"The master list is not busy."})},theListGroupShouldBeFilteredOnUnitNumberValue20OrLess:function(){return this.theListShouldBeFilteredOnUnitNumberValue(20,false,{iLow:1,iHigh:2})},theListShouldContainAGroupHeader:function(){return this.waitFor({controlType:"sap.m.GroupHeaderListItem",viewName:a,success:function(){e.assert.ok(true,"Master list is grouped")},errorMessage:"Master list is not grouped"})},theListHeaderDisplaysZeroHits:function(){return this.waitFor({viewName:a,id:"page",matchers:new o({name:"title",value:"<ZET_AVISOFERSet> (0)"}),success:function(){e.assert.ok(true,"The list header displays zero hits")},errorMessage:"The list header still has items"})},theListHasEntries:function(){return this.waitFor({viewName:a,id:"list",matchers:new n({name:"items"}),success:function(){e.assert.ok(true,"The list has items")},errorMessage:"The list had no items"})},theListShouldNotContainGroupHeaders:function(){function t(e){return e.getMetadata().getName()==="sap.m.GroupHeaderListItem"}return this.waitFor({viewName:a,id:"list",matchers:function(e){return!e.getItems().some(t)},success:function(){e.assert.ok(true,"Master list does not contain a group header although grouping has been removed.")},errorMessage:"Master list still contains a group header although grouping has been removed."})},theListShouldBeSortedAscendingOnUnitNumber:function(){return this.theListShouldBeSortedAscendingOnField("")},theListShouldBeSortedAscendingOnName:function(){return this.theListShouldBeSortedAscendingOnField("AreaFpgto")},theListShouldBeSortedAscendingOnField:function(t){function i(e){var i=null,s=function(e){if(!e.getBindingContext()){return false}var s=e.getBindingContext().getProperty(t);if(s===undefined){return false}if(!i||s>=i){i=s}else{return false}return true};return e.getItems().every(s)}return this.waitFor({viewName:a,id:"list",matchers:i,success:function(){e.assert.ok(true,"Master list has been sorted correctly for field '"+t+"'.")},errorMessage:"Master list has not been sorted correctly for field '"+t+"'."})},theListShouldBeFilteredOnUnitNumberValue:function(t,i,s){function r(e){var r=function(e){if(i){return e.getBindingContext().getProperty("UnitNumber")<t}return e.getBindingContext().getProperty("UnitNumber")>t};var n=e.getItems();if(s){n=n.slice(s.iLow,s.iHigh)}return!n.some(r)}return this.waitFor({id:"list",viewName:a,matchers:r,success:function(){e.assert.ok(true,"Master list has been filtered correctly with filter value '"+t+"'.")},errorMessage:"Master list has not been filtered correctly with filter value '"+t+"'."})},theMasterListShouldBeFilteredOnUnitNumberValueMoreThanTheGroupBoundary:function(){return this.theListShouldBeFilteredOnUnitNumberValue(c,true)},theMasterListShouldBeFilteredOnUnitNumberValueLessThanTheGroupBoundary:function(){return this.theListShouldBeFilteredOnUnitNumberValue(c)},iShouldSeeTheList:function(){return this.waitFor({id:"list",viewName:a,success:function(t){e.assert.ok(t,"Found the object List")},errorMessage:"Can't see the master list."})},theListShowsOnlyObjectsWithTheSearchStringInTheirTitle:function(){this.waitFor({id:"list",viewName:a,matchers:new n({name:"items"}),check:function(e){var t=e.getItems()[0].getTitle(),i=e.getItems().every(function(e){return e.getTitle().indexOf(t)!==-1});return i},success:function(t){e.assert.ok(true,"Every item did contain the title")},errorMessage:"The list did not have items"})},theListShouldHaveNEntries:function(t){return this.waitFor({id:"list",viewName:a,matchers:[new r({name:"items",length:t})],success:function(i){e.assert.strictEqual(i.getItems().length,t,"The list has x items")},errorMessage:"List does not have "+t+" entries."})},theListShouldHaveAllEntries:function(){var t,i;this.waitFor(this.createAWaitForAnEntitySet({entitySet:"ZET_AVISOFERSet",success:function(e){t=e}}));return this.waitFor({id:"list",viewName:a,matchers:function(e){i=Math.min(e.getGrowingThreshold(),t.length);return new r({name:"items",length:i}).isMatching(e)},success:function(t){e.assert.strictEqual(t.getItems().length,i,"The growing list displays all items")},errorMessage:"List does not display all entries."})},iShouldSeeTheNoDataTextForNoSearchResults:function(){return this.waitFor({id:"list",viewName:a,success:function(t){e.assert.strictEqual(t.getNoDataText(),t.getModel("i18n").getProperty("masterListNoDataWithFilterOrSearchText"),"the list should show the no data text for search and filter")},errorMessage:"list does not show the no data text for search and filter"})},theHeaderShouldDisplayAllEntries:function(){return this.waitFor({id:"list",viewName:a,success:function(t){var i=t.getBinding("items").getLength();this.waitFor({id:"page",viewName:a,matchers:new o({name:"title",value:"<ZET_AVISOFERSet> ("+i+")"}),success:function(){e.assert.ok(true,"The master page header displays "+i+" items")},errorMessage:"The  master page header does not display "+i+" items."})},errorMessage:"Header does not display the number of items in the list"})},theFirstItemShouldBeSelected:function(){return this.waitFor({id:"list",viewName:a,matchers:new n({name:"items"}),success:function(t){e.assert.strictEqual(t.getItems()[0],t.getSelectedItem(),"The first object is selected")},errorMessage:"The first object is not selected."})},theListShouldHaveNoSelection:function(){return this.waitFor({id:"list",viewName:a,matchers:function(e){return!e.getSelectedItem()},success:function(t){e.assert.strictEqual(t.getSelectedItems().length,0,"The list selection is removed")},errorMessage:"List selection was not removed"})},theRememberedListItemShouldBeSelected:function(){this.waitFor({id:"list",viewName:a,matchers:function(e){return e.getSelectedItem()},success:function(t){e.assert.strictEqual(t.getTitle(),this.getContext().currentItem.title,"The list selection is incorrect")},errorMessage:"The list has no selection"})}}}})});