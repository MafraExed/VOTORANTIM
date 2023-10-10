sap.ui.define([
	"FechamentoContabil/controller/BaseController", 
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
	"use strict";

	var periodos;
	var selectedRow;
	var planoSelecionado;
	var planoSelecionadoFluxo;
	var init;
	var statusSelecionado;

	return Controller.extend("FechamentoContabil.controller.Gantt", {

		onInit: function() {
			
			this.attachPatternMatched('ganttView');

		},



/*		showPopup: function(text){
			
			var that = this;
			var dialog;
			
			dialog = new sap.m.Dialog({
				showHeader: false,
				content: new sap.m.Text({
					text: text
				}).addStyleClass("dialog__text"),
				beginButton: new sap.m.Button({
					text: "Fechar",
					press: function () {
						dialog.close();
					}.bind(that)
				})
			});

			//to get access to the global model
			that.getView().addDependent(dialog);
		
			dialog.open();	
		},*/

		incluirItem: function (input, key, valor, primeiroItem) {
			var novoItem = new sap.ui.core.Item();
			novoItem.setKey(key);
			novoItem.setText(valor);
			if (primeiroItem)
				input.insertItem(novoItem, 0);
			else input.addItem(novoItem);
		},

		onConfigHierarquia: function (oEvent) {
			var popupHierarquia = this.getView().byId("idMenuHierarquia");
			popupHierarquia.toggleStyleClass("menu__hierarquia__inativo");
		},
		
		
		updateGantt: function(that,data){
			
			that.inicializaGantt(data.ToHierarquiaGantt);
			
		},
		
		expandTree: function(expand){
			var treeTable = this.getView().byId("ganttView");
			treeTable.expandToLevel(9);
		},
		
		
    	inicializaGantt: function(hierarquia, dependencias)
		{	
			var oTree = hierarquia["results"];
			var vTreeControl;
			var oGanttChartWithTable = this.getView().byId("ganttView");
			
			vTreeControl = this.montaHierarquiaGantt(oTree);
			
			var jsonData = {
				root:{
					id: "root",
					level: "root",
					results: vTreeControl
				}
			};
			
			var oGanttHierarchy = new JSONModel();
			var tmp =  JSON.stringify(jsonData);
		    oGanttHierarchy.setJSON( tmp );
		    
		    var modelGantt = this.getView().byId("ganttView").getModel("gantt");
			if(modelGantt !== undefined){
				modelGantt.oData.root = oGanttHierarchy.oData.root;
				modelGantt.refresh(true);
			}
			else{
				oGanttChartWithTable.bindAggregation("rows",
						{
							path: "gantt>/root",
							parameters: {
								arrayNames: ["results"]
							}
						}
				);
			
				//expande nós
				oGanttChartWithTable.expandToLevel(3);
				oGanttChartWithTable.setFixedColumnCount(1);
			    
				this.getView().byId("ganttView").setModel(oGanttHierarchy, "gantt");
				return oGanttHierarchy;
			}
		},
		
		inicializaTree: function(that,hierarquia)
		{	
			var oTree = hierarquia["results"];
			var vTreeControl;
			
			vTreeControl = that.montaHierarquiaGantt(oTree);
			
			var oGanttHierarchy = new JSONModel();
			var tmp =  JSON.stringify(vTreeControl);
		    oGanttHierarchy.setJSON( tmp );
		    
		    that.getView().setModel(oGanttHierarchy,"tree");
		    
		    var oTreeTable = this.byId("TreeTableBasic");
			oTreeTable.expandToLevel(3);
		},
		
		montaHierarquiaGantt: function(hierarquia){
			var ganttFinal = [];
			var nosUsados  = [];
			var createGanttData = function(itemHierarquia){
				 var filho = {
				 	id					:	itemHierarquia.NO,
				 	level				:	"1",
				 	plan: {
				 		startTime       :	itemHierarquia.DATA_INICIO_PLAN + itemHierarquia.HORA_INICIO_PLAN,
				 		endTime			:	itemHierarquia.DATA_FIM_PLAN    + itemHierarquia.HORA_FIM_PLAN
				 	},
				 	totalPlan: {
				 		startTime		:	"",
				 		endTime			:	""
				 	},
				 	NO					:	itemHierarquia.NO,
           			MODELO              :   itemHierarquia.MODELO,
					INSTANCE			:	itemHierarquia.INSTANCE,
					HIERARQUIA			:	itemHierarquia.HIERARQUIA,
					DESC_NO				:	itemHierarquia.DESC_NO,
					NO_PAI				:	itemHierarquia.NO_PAI,
					NO_ATIVIDADE		:	itemHierarquia.NO_ATIVIDADE,
					STATUS				:	itemHierarquia.STATUS,
					RESP				:	itemHierarquia.RESP,
					RESP_EXEC			:	itemHierarquia.RESP_EXEC,
					DATA_INICIO_PLAN	:	itemHierarquia.DATA_INICIO_PLAN,
					HORA_INICIO_PLAN	:	itemHierarquia.HORA_INICIO_PLAN,
					DATA_FIM_PLAN		:	itemHierarquia.DATA_FIM_PLAN,
					HORA_FIM_PLAN		:	itemHierarquia.HORA_FIM_PLAN,
					DURACAO_PLAN		:	itemHierarquia.DURACAO_PLAN,
					DURACAO				:	itemHierarquia.DURACAO,
					DATA_INICIO			:	itemHierarquia.DATA_INICIO,
					HORA_INICIO			:	itemHierarquia.HORA_INICIO,
					DATA_FIM			:	itemHierarquia.DATA_FIM,
					HORA_FIM			:	itemHierarquia.HORA_FIM,
					TPTAREFA			:	itemHierarquia.TPTAREFA,
					DESC_TAREFA			:	itemHierarquia.DESC_TAREFA,
					CONTEM_ANEXO        :   itemHierarquia.CONTEM_ANEXO,
					CRITICO		        :   itemHierarquia.CRITICO,
					ICON_STATUS			:	itemHierarquia.ICON_STATUS,
					COLOR_STATUS		:	itemHierarquia.COLOR_STATUS,
					EMPRESA				:	itemHierarquia.EMPRESA,
            		results: []
				};
				
				return filho;
			};	
					

			var fnMontaFilhos = function (item,items, gantt,dadosFilhos)
			{
			   
			     for (var i = 0; i < items.length; i++) {
			     
			    	if(item.NO === items[i].NO_PAI){  
			    		if(item.NO !== "000000000000" || items[i].NO !== "000000000000"){
			    			
							var filho = createGanttData(items[i]);
							nosUsados.push(items[i].NO);
							gantt.results.push(filho);
							
							if(items[i].DATA_INICIO_PLAN !== "")
								if(dadosFilhos["minPlan"] > items[i].DATA_INICIO_PLAN + items[i].HORA_INICIO_PLAN)
									dadosFilhos["minPlan"] = items[i].DATA_INICIO_PLAN + items[i].HORA_INICIO_PLAN;
							
							if(dadosFilhos["maxPlan"] < items[i].DATA_FIM_PLAN + items[i].HORA_FIM_PLAN)
								dadosFilhos["maxPlan"] = items[i].DATA_FIM_PLAN + items[i].HORA_FIM_PLAN;
							
							dadosFilhos = fnMontaFilhos(items[i],items,filho, dadosFilhos); 
							
						}
					}
				}

				if(dadosFilhos["maxPlan"] !== "" && gantt.NO_ATIVIDADE === ""){
					gantt.totalPlan.startTime = dadosFilhos["minPlan"];
					gantt.totalPlan.endTime   = dadosFilhos["maxPlan"];
					dadosFilhos["minPlan"]    = "99999999999999";
					dadosFilhos["maxPlan"]	  = "";
				}
				else{
					delete gantt.totalPlan;
				}

				return dadosFilhos;
			};
			for (var i = 0; i < hierarquia.length; i++) {
			
				if(nosUsados.indexOf(hierarquia[i].NO) === -1)
				{
					var dadosFilhos = [];
					dadosFilhos["minPlan"] = "99999999999999";
					dadosFilhos["maxPlan"] = "";
					
					var ganttLinha = createGanttData(hierarquia[i]);
					fnMontaFilhos(hierarquia[i], hierarquia, ganttLinha,dadosFilhos);
					ganttFinal.push(ganttLinha);
				}
			}
			return ganttFinal;
    	},
    	
		onPressAtividades: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Atividades");
		},
		
		
		addBrowserEvents: function(){

		// Adiciona eventos para os botões do status
			var statusIconIDs = ["idOk", "idAviso", "idProc", "idErro"];
			var id;
			var status;
			var that = this;
			statusIconIDs.forEach(function(id){
				status = that.byId(id);
				status.attachBrowserEvent("mouseover", function(){
					var idTextStatus = that.getView().byId("idTextStatus");
					if(id === "idOk"){
						idTextStatus.setText("Concluído sem erros");
						idTextStatus.getDomRef().style.color = "#46af4f";
					}
					if(id === "idProc"){
						idTextStatus.setText("Em processamento");
						idTextStatus.getDomRef().style.color = "#bfbfbf";
					}
					if(id === "idAviso"){
						idTextStatus.setText("Concluído com avisos");
						idTextStatus.getDomRef().style.color = "#d2e23f";
					}
					if(id === "idErro"){
						idTextStatus.setText("Concluído com erros");
						idTextStatus.getDomRef().style.color = "#e2753f";
					}
				}); 
				status.attachBrowserEvent("mouseout", function(){
					var idTextStatus = that.getView().byId("idTextStatus");
					idTextStatus.setText("");
				});
			});
			
		}
		

	});

});