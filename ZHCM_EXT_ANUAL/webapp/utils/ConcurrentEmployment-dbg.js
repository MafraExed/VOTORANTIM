/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mypaystubs.utils.ConcurrentEmployment");
jQuery.sap.require("hcm.mypaystubs.utils.DataManager");
/*global hcm:true */
hcm.mypaystubs.utils.ConcurrentEmployment = {
	getCEEnablement: function(self, successHandler) {
		this.initialize(self, successHandler);
		var oModel = new sap.ui.model.json.JSONModel();
		hcm.mypaystubs.utils.DataManager.getPersonellAssignments(self, function(data) {
			if (data.length > 1) {
				oModel.setData(data);
				self.oCEForm.setModel(oModel);
				self.oCEDialog.open();
			}
			else{
			    self.oApplication.pernr = data[0].Pernr;
			    successHandler();
			}
		});
	},
	initialize: function(self, successHandler) {
	    this.setControllerInstance(self);
		var itemTemplate = new sap.m.RadioButton({
			text: "{AssignmentText}",
			customData: new sap.ui.core.CustomData({
				"key": "Pernr",
				"value": "{Pernr}"
			})
		});
		self.oCESelect = new sap.m.RadioButtonGroup().bindAggregation("buttons", "/", itemTemplate);
		self.oCEForm = new sap.ui.layout.form.Form({
//			maxContainerCols: 2,
//			class: "sapUiLargeMarginTopBottom",
			layout: new sap.ui.layout.form.ResponsiveGridLayout({
				labelSpanL: 12,
				// emptySpanL: 3,
				labelSpanM: 12,
				// emptySpanM: 2,
				labelSpanS: 12,
				columnsL: 2,
				columnsM: 2
			}),
			formContainers: new sap.ui.layout.form.FormContainer({
				formElements: [
                                       new sap.ui.layout.form.FormElement({
                    						label: new sap.m.Label({
                    							text: self.oBundle.getText("PERSONAL_ASSIGN")
                    						}),
                    						fields: self.oCESelect
                    					})
                               ]
			})
		});
		
		self.oCEDialog = new sap.m.Dialog({
			title:self.oBundle.getText("PERSONAL_ASSIGN_TITLE"),
//			class: "sapUiContentPadding sapUiLargeMarginTopBottom",
			content: self.oCEForm,
			buttons: [
			    new sap.m.Button({
					text: self.oBundle.getText("OK"),
					press: function() {
						self.oCEDialog.close();
						self.oApplication.pernr = self.oCESelect.getSelectedButton().data().Pernr;
						successHandler();
					}
				}),
			    new sap.m.Button({
					text: self.oBundle.getText("CANCEL"),
					press: function() {
						self.oCEDialog.close();
						self.oCEDialog.Cancelled = true;  
                        /* eslint-disable sap-browser-api-warning */          
                                window.history.go(-1);    
                        /* eslint-enable sap-browser-api-warning */        
					    //}
					}
				})
			]
		});
		self.oCEDialog.attachAfterClose(function(){
		    if(!self.oApplication.pernr && self.oCEDialog.Cancelled !== true){
		        self.oCEDialog.open();
		    }
		});
	},
	
	setControllerInstance: function(me){
	    this.me = me;    
	},
	
	getControllerInstance: function(){
	    return this.me;  
	}
};