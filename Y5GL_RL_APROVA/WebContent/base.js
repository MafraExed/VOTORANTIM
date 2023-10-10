/*global history */
jQuery.sap.require("sap.m.MessageBox");
//jQuery.sap.require("vsa.y5gl_rl_portal.util.formatter");

sap.ui.define([ "sap/ui/core/mvc/Controller", "sap/ui/core/routing/History", "vsa/y5gl_rl_aprova/util/formatter" ],

function(Controller, History, Formatter) {
	"use strict";

	return Controller.extend("vsa.y5gl_rl_portal.base", {
		
		formatter : Formatter,
		
		setUnidade : function(sPath, oThat){
			var t = this;
			oThat.getOwnerComponent().getModel().read("/Grupos('')", { // vazio
				async : false,
				success : function(oData, response) {
					oThat.getOwnerComponent().getModel('global').setProperty("/unidade", oData.Unidade);
					t.loadDynFields(oData.Unidade);
					t.getAdm(oThat);
				},
				error : function(oError){
					sap.m.MessageBox.show(t.getResourceBundle().getText("NUNIDADE"), {
						icon : sap.m.MessageBox.Icon.ERROR,
						title : t.getResourceBundle().getText("UNIDADE"),
						actions : [ sap.m.MessageBox.Action.OK ],
						onClose : function(oAction) {
							return;
						}
					});
				}
			});
		},
		
		getAdm : function(sPath, oThat){
			var t = this;
			var sUserId = "";
			var oModel = oThat.getOwnerComponent().getModel();
			oModel.read("/Administradores", {
				async : false,
				success : function(oData, response) {
					if(oData.results.length > 0){
						if(oData.results[0].EAdm && oData.results[0].EAdm != ""){
							sUserId = oData.results[0].Userid;
							if (!t._oDialogAdm) {
								t._oDialogAdm = sap.ui.xmlfragment("vsa.y5gl_rl_portal.view.fragment.adm", t);
								t._oDialogAdm.setModel(oThat.getView().getModel());
								oThat.getView().addDependent(t._oDialogAdm);				
							}
							oThat.getView().byId("btnAdmSel").setVisible(true);
							t._oDialogAdm.setModel(new sap.ui.model.json.JSONModel(oData), "Adm")
							t._oDialogAdm.open();
						}else{
							if(oData.results[0].ESub && oData.results[0].ESub != ""){
								var sTxt = oData.results[0].ESubMsg + ", " + t.getResourceBundle().getText("CANCEL") + "?"
								sap.m.MessageBox.show(sTxt, {
									icon : sap.m.MessageBox.Icon.QUESTION,
									title : t.getResourceBundle().getText("SUBSTITUTION"),
									actions : [ sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO ],
									onClose : function(oAction) {
										if(oAction != "CANCEL"){
											oModel.remove("/Substitutos('" + sUserId  + "')");
											t.setUser(sUserId, sPath, oThat);
										}
									}
								});
							}
						}
					}else{
						t.setUser(sUserId);
					}
				},
				error : function(oError){
					t.setUser(sUserId);
				}
			});
		},		

		setUser : function(sUserId, sPath, oThat){
			var t = this;
			oThat.getOwnerComponent().getModel('global').setProperty("/userid", sUserId);	
			if(sUserId == ""){
				oThat._oList.bindItems({
					path : sPath,
					template : t.getTemplate(t._oList)
				});
			}else{		
				oThat._oList.bindItems({
					path : sPath,
					template : t.getTemplate(t._oList),
					filters : [ new sap.ui.model.Filter("Userid", "EQ", sUserId) ]
				});
			}
		},
		
		searchApprove : function(oEvent){
			var sQuery = oEvent.getParameter("value");		
			var aItems = oEvent.getSource().getItems();
			for(var i=0; i<aItems.length; i++){
				var mItem = aItems[i].getBindingContext("Adm").getObject();
				if (sQuery && sQuery != "") {
					if (	mItem.Nome.toUpperCase().indexOf(sQuery.toUpperCase()) !== -1 ||
							mItem.Userid.toUpperCase().indexOf(sQuery.toUpperCase()) !== -1
						) {
						aItems[i].setVisible(true);
		            } else {
		            	aItems[i].setVisible(false);
		            }					
				}else{
					aItems[i].setVisible(true);
				}			
			}
		},
		
		onSelApprover : function(oEvent){
			var sAprovador = oEvent.getParameter("selectedItem").getProperty("description");
			if(sAprovador != ""){
				this.setUser(sAprovador);
			}
		},
		
		onCloseApprover : function(){
			Lblnithis._oDialogAdm.close()
		},

		loadDynFields : function(sUnidade) {
			var t = this;
			this.getOwnerComponent().getModel().read("/Campos", { // HEADER
				async : false,
				filters : [ new sap.ui.model.Filter("Unidade", "EQ", sUnidade),
							new sap.ui.model.Filter("Tipo", "EQ", "C") ],
				success : function(oData, response) {
					if (oData.results.length <= 0) {
						sap.m.MessageBox.show(t.getResourceBundle().getText("NCAMPOSDINAMICOS"), {
							icon : sap.m.MessageBox.Icon.ERROR,
							title : t.getResourceBundle().getText("CAMPOSDINAMICOS"),
							actions : [ sap.m.MessageBox.Action.OK ],
							onClose : function(oAction) {
								return;
							}
						});
					} else {
						t.getOwnerComponent().getModel('hFields').setData(oData);
					}
				}
			});

			this.getOwnerComponent().getModel().read("/Campos", { // DETAIL
				async : false,
				filters : [ new sap.ui.model.Filter("Unidade", "EQ", sUnidade),
							new sap.ui.model.Filter("Tipo", "EQ", "D") ],
				success : function(oData, response) {
					if (oData.results.length <= 0) {
						sap.m.MessageBox.show(t.getResourceBundle().getText("NCAMPOSDINAMICOS"), {
							icon : sap.m.MessageBox.Icon.ERROR,
							title : t.getResourceBundle().getText("CAMPOSDINAMICOS"),
							actions : [ sap.m.MessageBox.Action.OK ],
							onClose : function(oAction) {
								return;
							}
						});
					} else {
						t.getOwnerComponent().getModel("dFields").setData(oData);
					}
				}
			});
		},
		
		setComentario : function(sPath, sEbeln, sUnidade) {
			var t = this;
			var sText = "";
			this.getOwnerComponent().getModel().read("/Comentarios", { // COMENTÁRIOS
				async : true,
				filters : [ new sap.ui.model.Filter("Ebeln", "EQ", sEbeln),
							new sap.ui.model.Filter("Unidade", "EQ", sUnidade),
							new sap.ui.model.Filter("Tipo", "EQ", "C")
						  ],
				success : function(oData, response) {
					for(var i=0;i<oData.results.length;i++){
						sText = sText + " " + oData.results[i].Tdline;
					}
					t.getOwnerComponent().getModel("global").setProperty("/comentario", sText);
				}
			});			
		},
		
		setIconTab : function(oIconTabBar, sPath) {						
			if(oIconTabBar){
				var t = this;
				var sUser = this.getOwnerComponent().getModel('global').getProperty("/userid");
				var sPathToAprova = sPath + "/ToAprovadores?$filter=Userid eq '" + sUser + "'";
				oIconTabBar.removeAllItems();
				oIconTabBar.removeAllContent();
				oIconTabBar.detachSelect();
				oIconTabBar.setExpanded(false);
				oIconTabBar.bindAggregation("items", sPathToAprova, function(index, context) {
					t.getOwnerComponent().getModel('global').setProperty("/relcode", context.getObject().ERelcode);
					return new sap.m.IconTabFilter({				
						icon : { path: 'Status', formatter : formatter.iconTabBar } ,
						iconColor : { path: 'Status', formatter : formatter.iconColor },
						count : { path: 'Relcode' },
						text : { path: 'NameUsr' },
						content : new sap.m.Text({text: t.getOwnerComponent().getModel("global").getProperty("/comentario")})
					});
				}, this);
			}
		},	
		
		setForm : function(oForm, sContext) {			
			oForm.removeAllContent();
			var ahFields = this.getOwnerComponent().getModel("hFields").getData().results;
			if (ahFields) {
				var sLanguage = sap.ui.getCore().getConfiguration().getLanguage().slice(0, 2);					
				ahFields.forEach(function(n) {						
					var sText = n["Ddtext" + sLanguage ].toLowerCase();						
					sText = sText.charAt(0).toUpperCase() + sText.slice(1); 						
					oForm.addContent(new sap.m.Label({ text : sText }));						
					if (sContext) {
						n.Fieldname = n.Fieldname.toLowerCase();
						var oField = n.Fieldname.charAt(0).toUpperCase() + n.Fieldname.slice(1);
						oField = sContext[oField];
						
						switch (n.Datatype) {
						case "D":
							oField = formatter.dateExternal(oField);
							break;
						case "V":
							oField = formatter.currencyExternal(oField);
							break;
						}
						
						oForm.addContent(new sap.m.Text({
							text : oField
						}));
					}					
				}, this);
			}			
		},
		
		setTable : function(oTable, oTabModel, sPath) {
			if (oTable) {
				var t = this;
				oTable.removeAllColumns();
				oTable.removeAllAggregation();
				oTable.removeAllAssociation();
				oTable.unbindColumns();
				oTable.unbindRows()
				oTable.destroyColumns();
				oTable.setModel(oTabModel, "tabModel");
				oTable.bindColumns("tabModel>/results", function(index, context) {
					var sLanguage = sap.ui.getCore().getConfiguration().getLanguage().slice(0, 2); 
					var sColumnName = context.getObject()["Ddtext" + sLanguage];
					return new sap.ui.table.Column({
						flexible: true,
						resizable: true,
						autoResizable: true,
						minWidth: 10,
						width : "10rem",
			            label: sColumnName,
			            template: t.setColumnTemplate(context.getObject())
			        });

				}, this);
								
				oTable.bindRows(sPath);
				
				if(oTable.getBinding("rows")){				
					oTable.getBinding("rows").attachDataReceived(function(e){
							var c = 0;
							var b = e.getSource() 
							if (b) {
								c = b.getLength();
							}
							if (c > 0) {
								this._oTable.setVisible(true);
								this._oTable.setTitle(this.getResourceBundle().getText("TABLETITLE", c));
							} else {
								this._oTable.setVisible(false);
								this._oTable.setTitle(this.getResourceBundle().getText("TABLETITLE", "0"));
							}
					}, this);				
				}
			}			
		},
		
		setColumnTemplate : function(sData) {
			var sColumnId = sData.Fieldname.toLowerCase();
			sColumnId = sColumnId.charAt(0).toUpperCase() + sColumnId.slice(1);						
			switch (sData.Datatype) {
				case "D":
					return new sap.m.Text({ 
						text: { path : sColumnId, 
							 	formatter : formatter.dateExternal 
							  }
					});
					break;
				case "V":
					return new sap.m.Text({ 
						text: { path : sColumnId, 
							 	formatter : formatter.currencyExternal 
							  }
					});
					break;
				default:
					if (sData.Datatype == 'C') {
						return new sap.m.Text({ 
							text: { path : sColumnId }
						});
					}
					break;
			}
		},

		getTemplate : function(oList) {
			if (oList.getBindingInfo("items"))
				return oList.getBindingInfo("items").template;
			else {
				return null;
			}
		},

		getResourceBundle : function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		onNavBack : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("master", {}, true);
			}
		},
		
		onAcao: function (sModo, aTab, sComent) {
			var t = this;
			var oModel = this.getOwnerComponent().getModel(); 
			var sUserId = this.getOwnerComponent().getModel('global').getProperty("/userid");
			var sGroupId = '1',
				sChangeSetId = "Create";
			
			var sRelcode = this.getOwnerComponent().getModel('global').getProperty("/relcode");			
			
			for(var i=0; i<aTab.length;i++){
				
				var oEntry = {						
							Modo		: sModo,
							Mensagem	: "",
							Documento 	: aTab[i].Ebeln,
							Bukrs		: aTab[i].Bukrs,
							Gjahr		: "",
							Bnfpo		: "",
							Unidade		: aTab[i].Unidade,
							Relcode		: sRelcode,
							Userid      : ((sUserId != "") ? sUserId : aTab[i].Userid),
							Coment      : sComent,
							RejEvent    : "",
							RejCode     : "",
							RejUserid	: ""
				}				
				
				oModel.setDeferredGroups([sGroupId]);
				
				oModel.create("/Acoes", oEntry, { groupId: sGroupId }, {changeSetId : sChangeSetId} );
				
			}
			
			oModel.submitChanges({ 
				groupId: sGroupId, 
				changeSetId : sChangeSetId,
				success: function(oData) {
					var oResp = oData.__batchResponses[0].__changeResponses; 
					for(var i=0;i<oResp.length;i++){
						sap.m.MessageToast.show(oResp[i].data.Mensagem);
						window._oList.getBinding("items").refresh()
				        t.getRouter().navTo("master", {}, true);
					}},
		        	error : function(oError) { 
		        		t.errorMsg(oError);
		        	} 
	        	}, this);			
		},
		
		errorMsg : function(sMsg){
			var t = this;
			sap.m.MessageBox.show( t.getResourceBundle().getText(sMsg), {
				          icon: sap.m.MessageBox.Icon.ERROR,
				          title: t.getResourceBundle().getText("ERROR"),
				          actions: [sap.m.MessageBox.Action.OK],
				          onClose: function(oAction) { 
				        	  return
				          }
				      }
				    );
			
		},
		
		sucessMsg : function(sMsg){
			var t = this;
			sap.m.MessageBox.show( t.getResourceBundle().getText(sMsg), {
				          icon: sap.m.MessageBox.Icon.SUCESS,
				          title: t.getResourceBundle().getText("SUCESS"),
				          actions: [sap.m.MessageBox.Action.OK],
				          onClose: function(oAction) { 
				        	  // t.commitChanges();
					          t.getOwnerComponent().getModel().refresh();
					          t.getRouter().navTo("master", {}, true);
					          return
				          }
				      }
				    );
			
		},
		
		onCloseDialog : function(e){
			e.getSource().getParent().close();
		}

	});
	
});

// sap.ui.define([
//	
// "sap/ui/base/Object"
//	
// ], function (Object) {
//	
// "use strict";
//	
// return Object.extend("vsa.y5gl_rl_portal.base", {
//   		
// helloWord : function (txt) {
// alert("Hello Word" + txt)
// },
//   		
//   		
// });
// });
