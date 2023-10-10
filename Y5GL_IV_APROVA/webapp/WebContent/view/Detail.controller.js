/*global location */
sap.ui.define([
	"vsa/y5gl_iv_portal/view/BaseController",
	"sap/ui/model/json/JSONModel",
	"vsa/y5gl_iv_portal/model/formatter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Filter"	
], function (BaseController, JSONModel, formatter, FilterOperator, Filter) {
	"use strict";

	return BaseController.extend("vsa.y5gl_iv_portal.view.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({ 
				busy: false,
				delay: 0
			});
			
			var t = this;
			
			this._oIconTabBar = this.byId("iconTabBar");
			
			this._oForm = this.byId("frDetail");
			
			this._oTable = this.byId("tbDetail");
			
			this.getRouter().getRoute("sIv").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "detailView");

			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
			
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress: function () {
			var oViewModel = this.getModel("detailView");

			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		_onObjectMatched: function (oEvent) {
			
				this._sEbeln = oEvent.getParameter("arguments").ivkey;
				this._sUnidade = oEvent.getParameter("arguments").unidade;
				var sUserId = this.getOwnerComponent().getModel('global').getProperty("/userId");
				this.getModel().metadataLoaded().then(function () {
					var sObjectPathHeader = this.getModel().createKey("Documentos", {
						Unidade: this._sUnidade,
						Ivkey: this._sEbeln										
					});
					this._bindView("/" + sObjectPathHeader);
				}.bind(this));

		},

		_bindView: function (sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");
			var oTable = this._oTable;

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);
			
			this.getModel().callFunction("/AtivaDesativaBotoes", {
				method: "GET",
				urlParameters: {
					Unidade: this._sUnidade
				},
				success: function (oData, response) {
					this.setGlobalInterrupt(oData);
				}.bind(this),
				error: function (oError) {
					this.setGlobalInterrupt();
				}.bind(this)
			});		
			
			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},
		
		setGlobalInterrupt: function(oData){
			if (oData){
				this.getOwnerComponent().getModel('global').setProperty("/intIcon", oData.IconeInterromper);
				this.getOwnerComponent().getModel('global').setProperty("/intVisible", oData.AtivaInterromper);
				this.getOwnerComponent().getModel('global').setProperty("/questDisbl", oData.DesativaQuestionar);				
			}else{
				this.getOwnerComponent().getModel('global').setProperty("/intIcon", "");
				this.getOwnerComponent().getModel('global').setProperty("/intVisible", false);
				this.getOwnerComponent().getModel('global').setProperty("/questDisbl", false);
			}
		},		

		_onBindingChange: function () {
			
			var that = this;
			
			var oTabModel = this.getOwnerComponent().getModel("dFields");
			
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}
						
			var sObjectPath = oElementBinding.getPath();
			
			if(this.oMP){this.oMP.destroyItems(); this.oMP.destroyHeaderButton(); this.oMP.destroy()}
		      
		    this.getOwnerComponent().getModel().read(sObjectPath + "/ToErros", {
		      async : true,
		      success : function(oData, response) {
		        if(oData.results.length > 0){
		        	var oBtn = that.getView().byId("messagePopoverBtn");
		  			var oJsonModel = new sap.ui.model.json.JSONModel();
		  			that.oMP = new sap.m.MessagePopover({
		  				activeTitlePress: function (oEvent) {
		  					var oItem = oEvent.getParameter("item"),
		  						oPage = that.oView.byId("messageHandlingPage"),
		  						oMessage = oItem.getBindingContext("message").getObject(),
		  						oControl = sap.ui.getCore().byId(oMessage.getControlId());	
		  					if (oControl && oControl.getDomRef()) {
		  						oPage.scrollToElement(oControl.getDomRef(), 200, [0, -100]);
		  						setTimeout(function(){
		  							oControl.focus();
		  						}, 300);
		  					}
		  				},
		  				items: {
		  					path: "erros>/results",
		  					template: new sap.m.MessageItem(
		  						{title: "{erros>Mensagem}"})
		  				}
		  			});
		  			oJsonModel.setData(oData);
		  			that.oMP.setModel(oJsonModel, "erros");
		  			oBtn.setText(oData.results.length);
		  			oBtn.setVisible(true);
		  			//oBtn.attachPress(function(e){this.oMP.toggle(e.getSource())})
		  			that.getView().byId("messagePopoverBtn").addDependent(that.oMP);            
		        }else{
		        	that.getView().byId("messagePopoverBtn").setVisible(false);
		        }
		      }
		    });
			
			this.setComentario(sObjectPath, this._sEbeln, this._sUnidade).then(function(){
				this.setIconTab(this._oIconTabBar, sObjectPath);	
			}.bind(this));
			
			this.setForm(this._oForm, this.getView().getBindingContext().getObject());						
			this.setTable(this._oTable, oTabModel, sObjectPath + "/ToDetalhes");
		},
		
		handleMessagePopoverPress: function(oEvent){
			this.oMP.toggle(oEvent.getSource());
		},

		_onMetadataLoaded: function () {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("detailView");

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		},
				
		onApprove: function (e) {			
			if (!this._oDialogApprove) {
				this._oDialogApprove = sap.ui.xmlfragment("vsa.y5gl_iv_portal.view.fragment.approve", this);
				this._oDialogApprove.setModel(this.getView().getModel());
				this.getView().addDependent(this._oDialogApprove);				
			}
			this._oDialogApprove.open();	
		},
		
		onConfirmApprove : function(e){
			var sContext = this.getView().getBindingContext().getObject();
			var sRelcode = this.getOwnerComponent().getModel('global').getProperty("/relcode");
			this._oDialogApprove.close();
			this.onAcao("A", [sContext], "");		
		},		
		
		onApprove_W: function (e) {			
			if (!this._oDialogApprove_W) {
				this._oDialogApprove_W = sap.ui.xmlfragment("vsa.y5gl_iv_portal.view.fragment.approve_w", this);
				this._oDialogApprove_W.setModel(this.getView().getModel());
				this.getView().addDependent(this._oDialogApprove_W);				
			}
			sap.ui.getCore().byId("taApprove").setProperty("value", "");
			this._oDialogApprove_W.open();	
		},
		
		onConfirmApprove_W : function(e){
			var sContext = this.getView().getBindingContext().getObject();
			var sRelcode = this.getOwnerComponent().getModel('global').getProperty("/relcode");
			var sComent = sap.ui.getCore().byId("taApprove").getProperty("value");
			this._oDialogApprove_W.close()
			this.onAcao("A", [sContext], sComent);
		},		
		
		onReject: function (e) {						
			var aFilters = []; 
			var oRejection = {
				Visible: false,
				Items: [],
				Key: ""
			};
			aFilters.push(new Filter("Unidade", FilterOperator.EQ, this.getView().getBindingContext().getObject().Unidade));
			aFilters.push(new Filter("Processo", FilterOperator.EQ, "IV"));
			aFilters.push(new Filter("Acao", FilterOperator.EQ, "R"));
			
			this.getModel().read("/Motivos",{
				filters: aFilters,
				success: function(oData){
					oRejection.Visible = ( oData.results && oData.results.length > 0 );
					oData.results.forEach(function(oRejectionItem){
						oRejection.Items.push({
							CodMotivo: oRejectionItem.CodMotivo,
							Descricao: oRejectionItem.Descricao
						});
					}.bind(this));
					
					if(! this.getModel("RejectionModel")){
						this.setModel( new JSONModel(oRejection), "RejectionModel");
					}else{
						this.getModel("RejectionModel").setData(oRejection);
					}
					this.getModel("RejectionModel").refresh(true);
					
					this._openRejectionPopup();
				}.bind(this),
				error: function(oError){
					
				}
			});						
		},
		
		_openRejectionPopup: function(){
			if (!this._oDialogReject) {
				this._oDialogReject = sap.ui.xmlfragment(this.getView().getId(),"vsa.y5gl_iv_portal.view.fragment.reject", this);
				this._oDialogReject.setModel(this.getView().getModel());
				this.getView().addDependent(this._oDialogReject);				
			}
			this._oDialogReject.open();	
			
  	        // INICIO - REJEITAR DIRECIONADO
	        var sFormId = sap.ui.core.Fragment.createId(this.getView().getId(), "formReject");
	        var oformReject = sap.ui.getCore().byId(sFormId);
	        var oIcons = this._oIconTabBar.getAggregation("items");
	        var oResource = this.getResourceBundle();
	        if(oformReject){
	          if(oRbgReject){
	            oRbgReject.destroy();
	          }

	          var oRbgReject = new sap.m.RadioButtonGroup({
	            buttons: [ new sap.m.RadioButton({ text : oResource.getText("REJECTRB-2") }).addCustomData(new sap.ui.core.CustomData({key : "I"})) ]
	          });
	          for(var i=0;i<oIcons.length;i++){
	            var sCon = oIcons[i].getBindingContext().getObject();
	            if(sCon.Flaglib != ""){
	                oRbgReject.addButton(new sap.m.RadioButton({
	                 text : oResource.getText("REJECTRB-X") + sCon.Relcode + "-" + sCon.NameUsr
	                }).addCustomData(new sap.ui.core.CustomData({key : sCon.Relcode, value : sCon.Usrlib}))
	              );
	            }
	          }

	          oformReject.removeAllContent();
	          oformReject.rerender();
	          oformReject.addContent(oRbgReject);

	        }
	        // FIM - REJEITAR DIRECIONADO	
		},
		
		onConfirmReject : function(e){
			var sContext = this.getView().getBindingContext().getObject();
			var sRelcode = this.getOwnerComponent().getModel('global').getProperty("/relcode");
			
		    // INICIO - REJEITAR DIRECIONADO
	        var sFormId = sap.ui.core.Fragment.createId(this.getView().getId(), "formReject");
	        var oformReject = sap.ui.getCore().byId(sFormId);
	        
	        var sRejCode = oformReject.getContent()[0].getSelectedButton().getCustomData()[0].getKey();
	        this.getOwnerComponent().getModel('global').setProperty("/rejCode", sRejCode);	
	        
	        var sRejUserid = oformReject.getContent()[0].getSelectedButton().getCustomData()[0].getValue();
	        this.getOwnerComponent().getModel('global').setProperty("/rejUserid", sRejUserid);
	        		
			var sRejectId = sap.ui.core.Fragment.createId(this.getView().getId(), "taReject");		
			var sComent = sap.ui.getCore().byId(sRejectId).getProperty("value");
			sap.ui.getCore().byId(sRejectId).setProperty("value", "");
			var oRejectionData = this.getModel("RejectionModel").getData();
			var sRejectionKey = oRejectionData.Key;
			var sRejectionText = "";
			if (sRejectionKey && sRejectionKey.length > 0){
				function customFind(sKey){
					return function(oElement){
						return oElement.CodMotivo === sKey;
					}
				}
				
				sRejectionText = oRejectionData.Items.find(customFind(sRejectionKey)).Descricao;
			}				
			this._oDialogReject.close();
			this.onAcao("R", [sContext], sComent, sRejectionText);
		},
		
		onDelete : function (e) {						
			if (!this._oDialogDelete) {
				this._oDialogDelete = sap.ui.xmlfragment("vsa.y5gl_iv_portal.view.fragment.delete", this);
				this._oDialogDelete.setModel(this.getView().getModel());
				this.getView().addDependent(this._oDialogDelete);				
			}
			this._oDialogDelete.open();
		},
		
		onConfirmDelete : function(e){
			var sContext = this.getView().getBindingContext().getObject();
			this._oDialogDelete.close();
			this.onAcao("D", [sContext], "");
		},
		
		onQuestion : function(e){
			var sContext = this.getView().getBindingContext().getObject();
			if(sContext && sContext.EMail === ""){ return  sap.m.MessageToast.show(this.getResourceBundle().getText("EMail")); }
			if (!this._oDialogQuestion) {
				this._oDialogQuestion = sap.ui.xmlfragment("vsa.y5gl_iv_portal.view.fragment.question", this);
				this._oDialogQuestion.setModel(this.getView().getModel());
				this.getView().addDependent(this._oDialogQuestion);				
			}
			sap.ui.getCore().byId("taQuestion").setProperty("value", "");
			this._oDialogQuestion.open();
		},
		
		onInterruption : function(e){
			var sContext = this.getView().getBindingContext().getObject();
			
			if(sContext && sContext.Status === "I"){ return  sap.m.MessageToast.show(this.getResourceBundle().getText("INTRALDN")); }
			if (!this._oDialogInterruption) {
				this._oDialogInterruption = sap.ui.xmlfragment("vsa.y5gl_iv_portal.view.fragment.interrupt", this);
				this._oDialogInterruption.setModel(this.getView().getModel());
				this.getView().addDependent(this._oDialogInterruption);				
			}
			sap.ui.getCore().byId("taInterrupt").setProperty("value", "");
			this._oDialogInterruption.open();			
		},
		
		onConfirmQuestion : function(e){
			var sContext = this.getView().getBindingContext().getObject();
			var sRelcode = this.getOwnerComponent().getModel('global').getProperty("/relcode");
			var sComent = sap.ui.getCore().byId("taQuestion").getProperty("value");
			this._oDialogQuestion.close();
			this.onAcao("Q", [sContext], sComent);
		},
		
		onConfirmInterruption : function(e){
			var sContext = this.getView().getBindingContext().getObject();
			var sRelcode = this.getOwnerComponent().getModel('global').getProperty("/relcode");
			var sComent = sap.ui.getCore().byId("taInterrupt").getProperty("value");
			this._oDialogInterruption.close();
			this.onAcao("I", [sContext], sComent);
		},
		
		   onLiveButtonConfirm : function(e){
		        var sText = e.getParameter('value');
		        if (this._oDialogApprove_W){
		        	this._oDialogApprove_W.getBeginButton().setEnabled(sText.length > 0)
		        }
		        if (this._oDialogReject){
		        	this._oDialogReject.getBeginButton().setEnabled(sText.length > 0)
		        }  
		        if (this._oDialogQuestion){
		        	this._oDialogQuestion.getBeginButton().setEnabled(sText.length > 0)
		        } 

		},
		
		onLiveIButtonConfirm: function(e){
			var sText = e.getParameter('value');
			var parent = e.getSource().getParent().getParent().getParent().getParent().getParent().getParent();
			parent.getBeginButton().setEnabled(sText.length > 0)		
		},		
		
		destroyDialog : function(){
			if (this._oDialogApprove) { this._oDialogApprove.close(); this._oDialogApprove.destroy() }
			if (this._oDialogApprove_W) { this._oDialogApprove_W.close(); this._oDialogApprove_W.destroy() }
			if (this._oDialogReject) { this._oDialogReject.close(); this._oDialogReject.destroy() }
			if (this._oDialogQuestion) { this._oDialogQuestion.close(); this._oDialogQuestion.destroy() }
			if (this._oDialogInterruption) { this._oDialogInterruption.close(); this._oDialogInterruption.destroy() }
		}

	});

});