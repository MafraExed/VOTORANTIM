sap.ui.define([
	"nasa/ui5/controleDrawback/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"nasa/ui5/controleDrawback/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',


	], function (BaseController, JSONModel,  History, formatter, Filter, FilterOperator, Sorter) {
	"use strict";

	return BaseController.extend("nasa.ui5.controleDrawback.controller.Main", {
		formatter: formatter,

		
		_oResponsivePopover: null,
		
		
		onInit: function () {
			/***/	
			this.byId("mainBtnNew").setVisible();

			/***/
			this.setModel(new JSONModel(), 'NewAC');

/*			
			var oList = this.byId("tableMain"),
			oViewModel = this._createViewModel(),
			iOriginalBusyDelay = oList.getBusyIndicatorDelay();

			this._oList = oList;
			this._oListFilterState = {
					aFilter : [],
					aSearch : []
			};

			this.setModel(oViewModel, "maingsView");
			
			oList.attachEventOnce("updateFinished", function(){
				// Restore original busy indicator delay for the list
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

			this.getView().addEventDelegate({
				onBeforeFirstShow: function () {
					this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
				}.bind(this)
			
			});
			
			*/
			
					
			/***/
			//Filter popover on table
					
			 var that = this;
	          if (!this._oResponsivePopover) {
	            this._oResponsivePopover = sap.ui.xmlfragment("nasa.ui5.controleDrawback.view.fragments.MainColFilter", this);
	            this._oResponsivePopover.setModel(this.getView().getModel());
	          }
			
		
			   var oTable = this.getView().byId("tableMain");
			      oTable.addEventDelegate({
		            onAfterRendering: function() {
		              var oHeader = this.$().find('.sapMListTblHeaderCell'); //Get hold of table header elements
		              for (var i = 0; i < oHeader.length; i++) {
		                var oID = oHeader[i].id;
		                that.onClick(oID);
		              }
		            }
		          }, oTable);
			
			
		          var csspath = jQuery.sap.getModulePath("nasa.ui5.controleDrawback","/css/style.css");
	              jQuery.sap.includeStyleSheet(csspath);
			
		},//EndInit

		
	      onClick: function(oID) {
	    	  debugger;
	          var that = this;
	          $('#' + oID).click(function(oEvent) { //Attach Table Header Element Event
	            var oTarget = oEvent.currentTarget; //Get hold of Header Element
	            var oLabelText = oTarget.childNodes[0].textContent; //Get Column Header text
	            var oIndex = oTarget.id.slice(-1); //Get the column Index
	            var oView = that.getView();
	            var oTable = oView.byId("tableMain");
	            var oModel = oTable.getModel().getProperty("{/ZET_FBSD_ACSet}"); //Get Hold of Table Model Values
	            //var oKeys = Object.keys(oModel[0]); //Get Hold of Model Keys to filter the value
	           // oView.getModel().setProperty("/bindingValue", oKeys[oIndex]); //Save the key value to property
	            
	            if ( oLabelText == "Ato Concessorio " ){
	            	 that._oResponsivePopover.openBy(oTarget);
	               }
	            
	  	          });
	        },
	        
	        
	        onChange: function(oEvent) {
	        debugger;
	            var oValue = oEvent.getParameter("value");
	            	            
	            if ( oValue == null ){
	            	this.onRefresh();
					return;
	            };
	                   
	            var oMultipleValues = oValue.split(",");
	            var oTable = this.getView().byId("tableMain");
	            var aFilters = [];
	            for (var i = 0; i < oMultipleValues.length; i++) {
	              var oFilter = new Filter("Acnum", "Contains", oMultipleValues[i]);
	              aFilters.push(oFilter)
	            }
	     
	            var oItems = oTable.getBinding("items");
	            oItems.filter(aFilters, "Application");
	            this._oResponsivePopover.close();
	            	            
	          },   	         

	          onAscending: function(oEvent) {

	        	  var oTable = this.getView().byId("tableMain");
		            var oItemsBinding = oTable.getBinding("items");
		            var sPath;
					var bDescending;
					var aSorters = [];
	        	  
					sPath = this.getView().getModel().aBindings[1].sPath
					aSorters.push(new Sorter(sPath));
					oItemsBinding.sort(aSorters);
					
					//close popover
					this._oResponsivePopover.close(); 
	         
	          },
	          
	          onDescending: function(oEvent) {
	        
	        	  
		            var oTable = this.getView().byId("tableMain");
		            var oItemsBinding = oTable.getBinding("items");
		            var sPath;
					var bDescending;
					var aSorters = [];
	        	  
					sPath = this.getView().getModel().aBindings[1].sPath
					bDescending = 'TRUE';
					aSorters.push(new Sorter(sPath, bDescending));
					oItemsBinding.sort(aSorters);
					
					//close popover
					this._oResponsivePopover.close();
	          },
	          
	          onOpen: function(oEvent){
	            //On Popover open focus on Input control
	            var oPopover = sap.ui.getCore().byId(oEvent.getParameter("id"));
	            var oPopoverContent = oPopover.getContent()[0];
	            var oCustomListItem = oPopoverContent.getItems()[2];
	            var oCustomContent = oCustomListItem.getContent()[0];
	            var oInput = oCustomContent.getItems()[1];
	            oInput.focus();
	            
	          }, 
		
//	        onSearch: function(oEvent) {
//			if (oEvent.getParameters().refreshButtonPressed) {
//
//				this.onRefresh();
//				return;
//			}
//
//			var sQuery = oEvent.getParameter("query").toUpperCase();
//
//			if (sQuery){
//				this._oListFilterState.aSearch = [new Filter("Acnum", FilterOperator.Contains, sQuery)];					
//			}else{
//				this._oListFilterState.aSearch = [];					
//			}
//
//
//			var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
//			oViewModel = this.getModel("maingsView");
//
//			this._oList.getBinding("items").filter(aFilters, "Application2");
//		
//		},
		
	/*	
		onUpdateFinished : function (oEvent) {
			// update the master list object counter after new data is loaded
			this._updateListItemCount(oEvent.getParameter("total"));
			// hide pull to refresh if necessary
			this.byId("pullToRefresh").hide();
		},
		
		*/
/*	
 * 	_updateListItemCount : function (iTotalItems) {
			var sTitle;
			// only update the counter if the length is final
			if (this._oList.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("mainTitleCount", [iTotalItems]);
				this.getModel("maingsView").setProperty("/title", sTitle);
			}
		},		
		
		*/
		
/*
		_createViewModel : function() {
			return new JSONModel({
				isFilterBarVisible: false,
				filterBarLabel: "",
				delay: 0,
				title: this.getResourceBundle().getText("mainTitleCount", [0]),
				noDataText: this.getResourceBundle().getText("mainListNoDataText"),
				sortBy: "Acnum",
				groupBy: "None"
			});
		}, 

    */
		/*onRefresh: function (){
			this._oList.getBinding("items").refresh();
		},
		 */


		onPress: function (oEvent) {	
			debugger;
			// Get Property of the Clicked Item
			var select = oEvent.getSource().getBindingContext().getProperty("Acnum");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var destiny = {Acnum: select};
		
			oRouter.navTo("object", destiny);

		},

		onHandleGoApp: function(oEvent){
			 
			 var sPath = this.getView().getElementBinding().getPath(),
			     oResourceBundle = this.getResourceBundle(),
				 oObject = this.getView().getModel().getObject(sPath);
			 
			 var buttonsGoApp = [
			                     { id:'detailViewMonitorApp', semantic: 'NasaMonitor' },
			                     { id:'detailViewIntercompSalesApp', semantic: 'VendaIntercompany' },
			                     { id:'detailViewDeliveryApp', semantic: 'NasaRemessa' },
			                     { id:'detailViewExportRegisterApp', semantic: 'NasaExportRegistration' },
			                     { id:'detailViewTransportApp', semantic: 'NasaTransporte' },
			                     { id:'detailViewSaidaMercadoriaApp', semantic: 'NasaSM' },
			                     { id:'detailViewInvoicingApp', semantic: 'NasaInvoicing' },
			                     { id:'detailViewOffshoreReceivingApp', semantic: 'NasaOffshoreReceiving' }
			 					]; 
			 
			 var oSelectedButton = buttonsGoApp.find(function (oItem) {
				  						return oEvent.getSource().getId().indexOf(oItem.id) !== -1;
			  					  	});
			 
			 var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			 var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
			  target: {
						semanticObject: oSelectedButton.semantic,
						action: "display"
					  }
			   })) || "";
			  
			  hash += "&" + '/ZET_FBSD_ShipmentDetailSet' + "('" + oObject.Nrembarque + "')";
			  oCrossAppNavigator.toExternal({
						  target: {
						  shellHash: hash
					  }
			   }); 
		 },
		
		onCreateAc: function (oEvent) {

			var oNewAC = {
					Acnum:"",
					Dtvenc:null,
					TtAc:"",
					TtUsado:"",
					TtReservado:"",
					SaldoInicial:""
			};


		var oViewModel = this.getModel("NewAC");
		oViewModel.setData(oNewAC);


		//Call screen preenchimento de dados
		if (! this._oDialogAddAc) {
			var oView = this.getView();
			this._oDialogAddAc = sap.ui.xmlfragment(oView.getId(),"nasa.ui5.controleDrawback.view.fragments.AddAc", this);
		}

		this.getView().addDependent(this._oDialogAddAc);

		// toggle compact style
		jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogAddAc);
		this._oDialogAddAc.open();

		},

		//MessagePopover
		onHandleMessagePopover: function (oEvent) {
			this.oMessagePopover.openBy(oEvent.getSource());
		},
		
		//Close Add Ac
		onHandleCloseAddAc: function(oEvent){
			this._oDialogAddAc.close();
		},
		
		// Save Add Ac
		onHandleSaveAddAc: function(oEvent){
			var that = this;				
			var oDataModel = this.getModel();

			//Busca dados para o Post
			var oViewModel = this.getModel("NewAC");
			var oAddDrawback = oViewModel.getData();

			if(!oAddDrawback.Acnum 
					|| !oAddDrawback.Dtvenc 
					|| !oAddDrawback.TtAc
					|| !oAddDrawback.TtUsado
					|| !oAddDrawback.TtReservado
					|| !oAddDrawback.SaldoInicial
			){
				this.onMessageError("messageErroCampoObrigatorio");
				return;
			}

			var oEntry = {
					Acnum:  	  oAddDrawback.Acnum,
					Dtvenc:  	  oAddDrawback.Dtvenc,
					TtAc:  	      oAddDrawback.TtAc,
					TtUsado:  	  oAddDrawback.TtUsado,
					TtReservado:  oAddDrawback.TtReservado,
					SaldoInicial: oAddDrawback.SaldoInicial
			};

			var that = this;

			oDataModel.create("/ZET_FBSD_ACSet", oEntry, {
				success: function(){ 
					that.onMessageDisplay("S","addAcMsgCriadoSucesso"); 
					that.onHandleCloseAddAc();
					that.onRefresh();

				}, 
				error: function(oResponse){ 
					var oReponseMsg = JSON.parse(oResponse.responseText)
					that.createMessagePopOver(oReponseMsg);
					that.onMessageDisplay("E",oReponseMsg.error.message.value); } 					
			});	

		},

	});
}
);