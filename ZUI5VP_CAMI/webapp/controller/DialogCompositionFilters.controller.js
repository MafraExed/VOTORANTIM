sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"FibriaStatusViagem/webServices/conections"
], function(BaseController, MessageBox, Utilities, History, conections) {
	"use strict";

	return BaseController.extend("FibriaStatusViagem.controller.DialogCompositionFilters", {
		centro: "3070",
		composition:[],
		truck: [],
		carreta1: [],
		carreta2: [],
		setRouter: function(oRouter) {
			this.oRouter = oRouter;
		},
		_onCloseDialogButtonPress: function(oEvent){
			this.closeDialog();
		},
		_onConfirmCodeButtonPress: function(oEvent){
			var centerValue = this.byId("centerInput").getValue();
			var compositionValue = this.byId("compositionInput").getValue();
			var truckValue = this.byId("truckInput").getValue();
			var carreta1Value = this.byId("carreta1Input").getValue();
			var carreta2Value = this.byId("carreta2Input").getValue();
			var oData = {
				centerValue : centerValue,
				compositionValue : compositionValue,
				truckValue : truckValue,
				carreta1Value : carreta1Value,
				carreta2Value : carreta2Value
			};
			this.handleCloseDialog(oData);
			this.closeDialog();
		},
		_onInputValueHelpRequest: function(oEvent){
			var inputLabel = oEvent.getSource().getParent().getLabel().getText();
			var inputId = oEvent.getSource().getId();
			var oData;
			switch(inputLabel) {
			    case "Centro (Obrigatório)":
			    	oData = {
			    		title: "Centro",
			    		values: this.centro,
			    		inputId: inputId
			    	};
			        this.openDialog("DialogValueHelp", oData, "loadData");
		        break;
		        case "Código da Composição":
			        oData = {
			    		title: "Composição",
			    		values: this.composition,
			    		inputId: inputId
			    	};
			        this.openDialog("DialogValueHelp", oData, "loadData");
		        break;
		        case "Placa do Cavalo":
			        oData = {
			    		title: "Cavalo",
			    		values: this.truck,
			    		inputId: inputId
			    	};
			        this.openDialog("DialogValueHelp", oData, "loadData");
		        break;
		        case "Placa da Carreta 1":
			        oData = {
			    		title: "Carreta 1",
			    		values: this.carreta1,
			    		inputId: inputId
			    	};
			        this.openDialog("DialogValueHelp", oData, "loadData");
		        break;
		        case "Placa da Carreta 2":
			        oData = {
			    		title: "Carreta 2",
			    		values: this.carreta2,
			    		inputId: inputId
			    	};
			        this.openDialog("DialogValueHelp", oData, "loadData");
		        break;
			    // default:
			        
			}
		},
		openPopover: function(sPopoverName, oEvent, eventBusData, eventBusName) {

			this.mPopovers = this.mPopovers || {};
			var oPopover = this.mPopovers[sPopoverName];
			var oSource = oEvent.getSource();
			var oBindingContext = oSource.getBindingContext();
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oView;
			if (!oPopover) {
				this.getOwnerComponent().runAsOwner(function() {
					oView = sap.ui.xmlview({
						viewName: "FibriaStatusViagem.view." + sPopoverName
					});
					this.getView().addDependent(oView);
					oView.getController().setRouter(this.oRouter);
					oPopover = oView.getContent()[0];
					oPopover.setPlacement("Auto");
					this.mPopovers[sPopoverName] = oPopover;
				}.bind(this));
			}
			if(eventBusData){
				var oEventBus = sap.ui.getCore().getEventBus();
				oEventBus.publish(sPopoverName, eventBusName, eventBusData);	
			}

			return new Promise(function(fnResolve) {
				oPopover.attachEventOnce("afterOpen", null, fnResolve);
				oPopover.openBy(oSource);
				if (oView) {
					oPopover.attachAfterOpen(function() {
						oPopover.rerender();
					});
				} else {
					oView = oPopover.getParent();
				}

				var oModel = this.getView().getModel();
				if (oModel) {
					oView.setModel(oModel);
				}
				if (sPath) {
					var oParams = oView.getController().getBindingParameters();
					oView.bindObject({
						path: sPath,
						parameters: oParams
					});
				}
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		openDialog: function(dialogName, eventBusData, eventBusName){
			var sDialogName = dialogName;
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			var oView;
			if (!oDialog) {
				this.getOwnerComponent().runAsOwner(function () {
					oView = sap.ui.xmlview({
						viewName: "FibriaStatusViagem.view." + sDialogName
					});
					this.getView().addDependent(oView);
					oView.getController().setRouter(this.oRouter);
					oDialog = oView.getContent()[0];
					this.mDialogs[sDialogName] = oDialog;

				}.bind(this));
			}
			if(eventBusData){
				var oEventBus = sap.ui.getCore().getEventBus();
				oEventBus.publish(dialogName, eventBusName, eventBusData);	
			}

			return new Promise(function (fnResolve) {
				oDialog.attachEventOnce("afterOpen", null, fnResolve);
				oDialog.open();
				if (oView) {
					oDialog.attachAfterOpen(function () {
						oDialog.rerender();
					});
				} else {
					oView = oDialog.getParent();
				}

				var oModel = this.getView().getModel();
				if (oModel) {
					oView.setModel(oModel);
				}
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});
		},
		getCentroList: function(){
			//TO DO SPRINT 3
		},
		getCompositionList: function(){
			var aFilters = [];
			var stringParam = "/ZET_VPWM_COMPOSICAOSET";
			
			var oFilter = new sap.ui.model.Filter({
                path: "Centro",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: this.centro
            });
            aFilters.push(oFilter);
			conections.consumeModel(stringParam,
				function(oData, oResponse) {
					sap.ui.getCore().getModel("compositionFilters").setCompositionModel(oData.results);
				},
				function(err) {
					sap.m.MessageToast.show("Erro inesperado", {
						duration: 3000
					});
				}, "", aFilters);
		},
		setCompositionModel: function(oData){
			for (var i=0; i<oData.length; i++) {
				oData[i].value = oData[i].Composicao;
			}
			this.composition = oData;
			var oJSON = new sap.ui.model.json.JSONModel();
			oJSON.setData(this.composition);
			this.getView().setModel(oJSON, 'composition');
		},
		getTruckList: function(){
			var aFilters = [];
			var stringParam = "/ZET_VPWM_PLACA_CAVALOSET";
			var oFilter = new sap.ui.model.Filter({
                path: "Centro",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: this.centro
            });
            aFilters.push(oFilter);
            
            oFilter = new sap.ui.model.Filter({
                path: "PlcCarro1",
                operator: sap.ui.model.FilterOperator.Contains,
                value1: this.byId("carreta1Input").getValue()
            });
            aFilters.push(oFilter);
            
            oFilter = new sap.ui.model.Filter({
                path: "PlcCarro2",
                operator: sap.ui.model.FilterOperator.Contains,
                value1: this.byId("carreta2Input").getValue()
            });
            aFilters.push(oFilter);
			conections.consumeModel(stringParam,
				function(oData, oResponse) {
					sap.ui.getCore().getModel("compositionFilters").setTruckModel(oData.results);
				},
				function(err) {
					sap.m.MessageToast.show("Erro inesperado", {
						duration: 3000
					});
				}, "", aFilters);
		},
		setTruckModel: function(oData){
			for (var i=0; i<oData.length; i++) {
				oData[i].value = oData[i].PlcCavalo;
			}
			this.truck = oData;
			var oJSON = new sap.ui.model.json.JSONModel();
			oJSON.setData(this.truck);
			this.getView().setModel(oJSON, 'truck');
		},
		getCarreta1List: function(){
			var aFilters = [];
			var stringParam = "/ZET_VPWM_PLACA_CARRETA1SET";
			
			var oFilter = new sap.ui.model.Filter({
                path: "Centro",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: this.centro
            });
            aFilters.push(oFilter);
            
            oFilter = new sap.ui.model.Filter({
                path: "PlcCavalo",
                operator: sap.ui.model.FilterOperator.Contains,
                value1: this.byId("truckInput").getValue()
            });
            aFilters.push(oFilter);
            
            oFilter = new sap.ui.model.Filter({
                path: "PlcCarro2",
                operator: sap.ui.model.FilterOperator.Contains,
                value1: this.byId("carreta2Input").getValue()
            });
            aFilters.push(oFilter);
            
			conections.consumeModel(stringParam,
				function(oData, oResponse) {
					sap.ui.getCore().getModel("compositionFilters").setCarreta1Model(oData.results);
				},
				function(err) {
					sap.m.MessageToast.show("Erro inesperado", {
						duration: 3000
					});
				}, "", aFilters);
		},
		setCarreta1Model: function(oData){
			for (var i=0; i<oData.length; i++) {
				oData[i].value = oData[i].PlcCarro1;
			}
			this.carreta1 = oData;
			var oJSON = new sap.ui.model.json.JSONModel();
			oJSON.setData(this.carreta1);
			this.getView().setModel(oJSON, 'carreta1');
		},
		getCarreta2List: function(){
			var aFilters = [];
			var stringParam = "/ZET_VPWM_PLACA_CARRETA2SET";
			
			var oFilter = new sap.ui.model.Filter({
                path: "Centro",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: this.centro
            });
            aFilters.push(oFilter);
            
            oFilter = new sap.ui.model.Filter({
                path: "PlcCavalo",
                operator: sap.ui.model.FilterOperator.Contains,
                value1: this.byId("truckInput").getValue()
            });
            aFilters.push(oFilter);
            
            oFilter = new sap.ui.model.Filter({
                path: "PlcCarro1",
                operator: sap.ui.model.FilterOperator.Contains,
                value1: this.byId("carreta1Input").getValue()
            });
            aFilters.push(oFilter);
            
			conections.consumeModel(stringParam,
				function(oData, oResponse) {
					sap.ui.getCore().getModel("compositionFilters").setCarreta2Model(oData.results);
				},
				function(err) {
					sap.m.MessageToast.show("Erro inesperado", {
						duration: 3000
					});
				}, "", aFilters);
		},
		setCarreta2Model: function(oData){
			for (var i=0; i<oData.length; i++) {
				oData[i].value = oData[i].PlcCarro2;
			}
			this.carreta2 = oData;
			var oJSON = new sap.ui.model.json.JSONModel();
			oJSON.setData(this.carreta2);
			this.getView().setModel(oJSON, 'carreta2');
		},
		initModels: function(){
			this.getCentroList();
			this.getCompositionList();
			this.getTruckList();
			this.getCarreta1List();
			this.getCarreta2List();
		},
		handleCloseDialog: function(oEventBusData){
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.publish("DialogCompositionFilters", "FiltersSet", oEventBusData);	
		},
		closeDialog: function(){
			var oDialog = this.getView().getContent()[0];
			oDialog.close();
		},
		setInputValue: function(sChanel, sEvent, oData){
			this.byId(oData.inputId).setValue(oData.selectedValue);
			this.initModels();
		},
		onInit: function() {
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("DialogValueHelp", "ValueSelected", this.setInputValue, this);
			sap.ui.getCore().setModel(this, "compositionFilters");
			this._oDialog = this.getView().getContent()[0];
			this.initModels();

		},
		onExit: function() {
			this._oDialog.destroy();

		}
	
	});
}, /* bExport= */ true);