sap.ui.define([
		"nasa/ui5/controleDrawback/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"nasa/ui5/controleDrawback/model/formatter",
		"nasa/ui5/controleDrawback/model/constants",
		"sap/m/MessageBox",
		"sap/m/MessageToast"
	], function (BaseController, JSONModel, formatter, constants, MessageBox, MessageToast) {
		"use strict";

		return BaseController.extend("nasa.ui5.controleDrawback.controller.Object", {
			formatter: formatter,
		
/* =========================================================== */
/* event handlers                                              */
/* =========================================================== */
			
			
			
			onInit: function () {
					
			 var oViewModel = new JSONModel({
					busy: true
				});
			
			this.getRouter().getRoute("object").attachPatternMatched(this._onPostMatched, this);
			this.setModel(oViewModel, "objectView");
						
			},
			            			
			onNavBack: function () {
                this.getRouter().navTo("main", {}, true);	            
            },    
            
           onHandleIconTabBarSelect: function(oEvent){
        	  	var vMode = this.byId(oEvent.mParameters.selectedKey).getIcon();
		    	 		
		    	 if (vMode === "sap-icon://activity-items" ) { 
		    		
		    		this.byId("objectBtnEdit").setVisible();
			    	this.byId("objectBtnDelete").setVisible();
						    	
				}else if(vMode === "sap-icon://customer-order-entry"){
					
					this.byId("objectBtnEdit").setVisible(false);
			    	this.byId("objectBtnDelete").setVisible(false);
			    	this.byId("objectBtnSave").setVisible(false);
			    	this.byId("objectBtnCancel").setVisible(false);
			    	
			    	
			    	this._onCancelAc(false);	
			    };	
				
				
				
		    }, 
		    
			
			onActionButton: function(oEvent){
				var sMode;
				var dadosEdit;
				switch(oEvent.oSource.getIcon().substr(11)) {
				    case "edit": // nome do bot�o em formato string
				    	sMode = true;
				    	break;
				    	
				    case "save":
				    	sMode = false;
				    	this._onSaveAc();	//salvar altera��es Drawback
														
				    	break;
				    	
				    case "delete":
				    	sMode = false;
						this._onDeleteAc()	//Marcar drawback como eliminado
				    	break;
				    	
				    case "sys-cancel":
				       	sMode = false;	
				       	this._onCancelAc(true);	
				    	break;				        
				}				
				
				this._enableFields(sMode);
				
			},
	

			_onPostMatched: function (oEvent) {
				var sAcnum =  oEvent.getParameter("arguments").Acnum;
				
				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("ZET_FBSD_ACSet", { 
						Acnum : sAcnum
					});
					
					//Chama Metodo interno bindView
					this._bindView("/" + sObjectPath);
					
				}.bind(this));
			},
			
			_bindView : function (sObjectPath) {
				
				var oViewModel = this.getModel("objectView");

				oViewModel.setProperty("/busy", false);

				this.getView().bindElement({
					path : sObjectPath,
					expand: "AcToMov",//"ShipmentDetailToItems",
					events: {
						change : this._onBindingChange.bind(this), 
						dataRequested : function () {
							oViewModel.setProperty("/busy", true);
						},
						dataReceived: function () {
							oViewModel.setProperty("/busy", false);
						}
					}
				});
			
			},
			
			_onBindingChange : function () {
				var oView = this.getView(),
					oElementBinding = oView.getElementBinding();
			
				var sPath = oElementBinding.getPath(),
				  	oResourceBundle = this.getResourceBundle(),
				 
				  oObject = oView.getModel().getObject(sPath),
				  oViewModel = this.getModel("objectView");
				
				// Model local da tela DadosAc
				var oData = {  
						Acnum		 :oObject.Acnum,
						Dtvenc		 :oObject.Dtvenc,
						TtAc		 :oObject.TtAc,
						TtUsado	     :oObject.TtUsado,
						TtReservado  :oObject.TtReservado,
						SaldoFinal	 :oObject.SaldoFinal,
						Dtinc		 :oObject.Dtinc,
						Tminc		 :oObject.Tminc,
						Usinc		 :oObject.Usinc,
						Dtmod		 :oObject.Dtmod,
						Tmmod		 :oObject.Tmmod,
						Usmod		 :oObject.Usmod,		 
						Status		 :oObject.Status,
						Usnameinc	 :oObject.Usnameinc,	
						Usnamemod	 :oObject.Usnamemod
						
						};
							
				var oViewModelJSON = new JSONModel(oData);
			    this.getView().setModel(oViewModelJSON, "dadosAc");
			    },
			    
			_enableFields: function(PsMode){
						
				this.byId("objectBtnSave").setVisible(PsMode);
		    	this.byId("objectBtnCancel").setVisible(PsMode);
		    	this.byId("objectBtnEdit").setVisible(!PsMode);
		    	this.byId("objectBtnDelete").setVisible(!PsMode);
				
				// validate user using OData and enable form
				var fieldsToEnable = [
					'dadosAcDtvenc',
					'dadosAcTtAc',
					'dadosAcTtUsado',
					'dadosAcTtReservado'
					/*'dadosAcSaldo'
					'dadosAcStatus',
					'dadosAcDtinc',
					'dadosAcTminc',
					'dadosAcUsinc',
					'dadosAcDtmod',
					'dadosAcTmmod',
					'dadosAcUsmod'*/
				];
							
				var that = this;
				
				jQuery.each(fieldsToEnable, function(index, element){
					that.byId(element).setEditable(PsMode);
				});					
			},
			
			_onManterCampos: function (oEntry) {
			
				var that = this;
				
				jQuery.each(oEntry, function(index, element){
					
					console.log(index);
					console.log(element);
					that.byId(element).setEditable(true);
					
					
				});	
				
			},
			
		    _onSaveAc:  function () {
		    	
		    	
				var that = this;
				var sPath = this.getView().getElementBinding().getPath();
				var oDataModel = this.getView().getModel();
				 
				var oEntry = this.getView().getModel("dadosAc").getData();
							
//				  if(!oEntry.Dtvenc 
//					        || !oEntry.TtAc
//					        || !oEntry.TtUsado
//					        || !oEntry.TtReservado  ){
				
				var TT_AC, TT_US, TT_RS;
				TT_AC = parseFloat(oEntry.TtAc);
				TT_US = parseFloat(oEntry.TtUsado);
				TT_RS = parseFloat(oEntry.TtReservado);
				
			
				if (!oEntry.Dtvenc || !oEntry.TtAc || !oEntry.TtUsado || !oEntry.TtReservado) {
					   					
						this.onMessageError("messageErroCampoObrigatorio");
					        	
					         	this._onManterCampos(oEntry);
					          	return;
					}else{
						
						 if (TT_AC <= 0 || TT_US <= 0 || TT_RS <= 0) {
							 this.onMessageError("messageErroCampoZerado");
					        	
					         	this._onManterCampos(oEntry);
					          	return;
						
							}     	
						
					};
						
				   oDataModel.update(sPath, oEntry, {
					success: function(){ 
						that.onMessageDisplay("S","dadosAcMsgUpdtS"); },  
						
					error: function(oResponse){ 
		
						var oReponseMsg = JSON.parse(oResponse.responseText)
							that.createMessagePopOver(oReponseMsg);
							that.onMessageDisplay("E",oReponseMsg.error.message.value); } 
				  });	
		    },

		    
		    _onCancelAc:  function (pMode) {  	
		    	this._enableFields(pMode);
		    	this._onBindingChange();
		    	
		    	
		    	this.byId("objectBtnEdit").setVisible(false);
		    	this.byId("objectBtnDelete").setVisible(false);
		    	this.byId("objectBtnSave").setVisible(false);
		    	this.byId("objectBtnCancel").setVisible(false);
		   },
			
		   
		    _onDeleteAc:  function () {
		    	
		    	var fnDeleteAc = function(){
		    		    	
			    	var that = this;
					var sPath = this.getView().getElementBinding().getPath();
					var oDataModel = this.getView().getModel();
					var oEntry = this.getView().getModel("dadosAc").getData();
									
						oDataModel.remove(sPath, oEntry, {
							success: function(){ 
								that.onMessageDisplay("S","dadosAcMsgDelS");
								
								},  
								
							error: function(oResponse){ 
								var oReponseMsg = JSON.parse(oResponse.responseText)
								that.createMessagePopOver(oReponseMsg);
								that.onMessageDisplay("E",oReponseMsg.error.message.value); } 
							});	

							//Em caso de Sucesso retorna para p�gina principal
							 this.getRouter().navTo("main", {}, true);	

					
			   };					    		
			   this.onMessageConfirmation( this.getResourceBundle().getText("dadosAcPopupeliminar"), 
					   					   this.getResourceBundle().getText("popupButtonTextOK"),
					   					   this.getResourceBundle().getText("popupButtonTextCancel"), 
					   					   fnDeleteAc.bind(this)
			 							 );	
			   
		   },

		});
	}
);