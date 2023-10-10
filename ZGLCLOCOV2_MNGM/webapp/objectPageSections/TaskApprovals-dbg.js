sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var TaskApprovals = BlockBase.extend("votorantim.corp.clocov2planmanagement.objectPageSections.TaskApprovals", {
		metadata: {
			views: {
				Collapsed: {
					id: "idTaskApprovalsView",
					viewName: "votorantim.corp.clocov2planmanagement.view.TaskApprovals",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "votorantim.corp.clocov2planmanagement.view.TaskApprovals",
					id: "idTaskAlertConfigView",
					type: ViewType.XML
				}
			},
			events:{
				"datachanged": {}
			}
		}
	});
	return TaskApprovals;
});
