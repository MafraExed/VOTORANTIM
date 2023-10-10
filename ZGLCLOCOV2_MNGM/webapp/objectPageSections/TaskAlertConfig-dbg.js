sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var TaskAlertConfig = BlockBase.extend("votorantim.corp.clocov2planmanagement.objectPageSections.TaskAlertConfig", {
		metadata: {
			views: {
				Collapsed: {
					id: "idTaskAlertConfigView",
					viewName: "votorantim.corp.clocov2planmanagement.view.TaskAlertConfig",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "votorantim.corp.clocov2planmanagement.view.TaskAlertConfig",
					id: "idTaskAlertConfigView",
					type: ViewType.XML
				}
			},
			events:{
				"datachanged": {}
			}
		}
	});
	return TaskAlertConfig;
});
