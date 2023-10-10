sap.ui.define([
		"y5fb/ui5/Dashboard/controller/BaseController",
		"y5fb/ui5/Dashboard/model/formatter",
		"sap/ui/model/json/JSONModel",
		"sap/viz/ui5/data/FlattenedDataset"
	], function (BaseController, formatter, JSONModel, FlattenedDataset) {
		"use strict";

		return BaseController.extend("y5fb.ui5.Dashboard.controller.Object", {
			formatter: formatter,
		
						
		
			onInit : function (evt) {
											
				// Create a JSON model from an object literal
//				var oModel = new JSONModel({
//					GS: "FIBRIA",
//					Titulo_local: "INFLOR"
//				});				
								
				// Assign the model object to the SAPUI5 core
				//sap.ui.getCore().setModel(oModel);
		////		this.setModel(oModel, "my_model");
							
			 var oViewModel = new JSONModel({
				 	busy : false
							 
				 });
		
			
			 var rotas = evt.getParameters().id.split("---")[1];

			 if (rotas === "object_bar" ) {
				 
				this.getRouter().getRoute("object_bar").attachPatternMatched(this._onPostMatched, this);
				 
			} else {
					
				this.getRouter().getRoute("object").attachPatternMatched(this._onPostMatched, this);	
	
			};
			 			 			  
					
			 this.setModel(oViewModel, "objectView");
			
			},
					
			
			onNavBack : function (oEvent){
			
			this.getRouter().navTo("main", {}, true);

			},
			
			/* =========================================================== */
			/* begin: internal methods                                     */
			/* =========================================================== */
		
			_onPostMatched : function(oEvent) {
	
				var lv_UnidadeDash =  oEvent.getParameter("arguments").UnidadeDash;
                   
                   this.getModel().metadataLoaded().then( function() {
                       var lv_ObjectPath = this.getModel().createKey("ZET_FBPM_DADOS_TILESSet", { 
                    	   UnidadeDash : lv_UnidadeDash
                       });
                       
                       //Chama Metodo interno bindView
                       this._bindView("/" + lv_ObjectPath);
                       
                   }.bind(this));					
			},
			
		     _bindView : function (oObjectPath) {
                   
                   var oViewModel = this.getModel("objectView");
             
                   oViewModel.setProperty("/busy", false);
                   
                   this.getView().bindElement({
	                       path : oObjectPath,
	                       expand: "TilesToGrafico",          
	                       events: {
	                           change : this._onBindingChange.bind(this), 
	                           dataRequested : function () {
	                               oViewModel.setProperty("/busy", true);
	                           },
	                           dataReceived: function ()  {
	                               oViewModel.setProperty("/busy", false);
	                           }
	                       }
	                   });
                   
         
                   
               },
                              
            _onBindingChange : function() {
			           
            	var oView = this.getView(); 
            	var	lv_Path = oView.getElementBinding().getPath();
			  	var	oResourceBundle = this.getResourceBundle();
			  	var	oObject = oView.getModel().getObject(lv_Path);
			  	var oViewModel = this.getModel("objectView");
           
			  	this._ConfigViz(oObject);
  
			},
			
			
					
			
						
			_ConfigViz : function(lv_object) {
			
				var oVizGraphVLR = this.getView().byId("VizVLR");
				var oVizGraphQTD = this.getView().byId("VizQTD");
				var oVizGraphAnual = this.getView().byId("VizAnual");
				
				if (!!oVizGraphQTD || !!oVizGraphVLR ) {
										
				oVizGraphVLR.setVizType('pie');
				oVizGraphQTD.setVizType('pie');
				
		
				//Modifica titulo de graficos
				
				var titVLR = "", 
					titQTD = ""; 
				
				if (!lv_object == "" || !lv_object == null || !lv_object == undefined){
					
				titVLR = lv_object.TitleVlr || " " ; 
				titQTD = lv_object.TitleQtd || " " ; 
				}				
				
				var asyncChartUpdate = function() {
					oVizGraphVLR.setVizProperties({
				        title: {
				            text: titVLR
				        },
				        plotArea: { 
				        	dataLabel: { 
				        		visible: true,
				        		position: 'inside',
				        		type: "percentage"
				        	},
				        	legend:{
				        		visible: true,
					        	direction: 'horizontal',
					            stacking: 'normal'
				        	},
				        } 
					
				    });
					
					oVizGraphQTD.setVizProperties({
				        title: {
				            text: titQTD
				        },
				        
				        plotArea: { 
				        	dataLabel: { 
				        		visible: true,
				        		position: 'inside',
				        		type: "percentage"
				        	} 
				        } 
				        
				    });
								
				};
				setTimeout(asyncChartUpdate, 0);
		
					
					
				}
				
				
				if (!!oVizGraphAnual){
					
					var titQTD_bar = lv_object.TitleQtd || " " ;
										
					var asyncChartUpdate_bar = function() {
						oVizGraphAnual.setVizProperties({
					        title: {
					            text: titQTD_bar
					        }					    
						});
															
					};
					setTimeout(asyncChartUpdate_bar, 0);
					
				}
		
			}//fim Config Viz		
	
		});

	}
);