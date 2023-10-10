/*global history */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	'sap/m/MessageBox'
], function (Controller, History, MessageBox) {
	"use strict";

	var key = {
		Profile: '',
		Instance: '',
		NoAtual: ''
	};

	return Controller.extend("FechamentoContabil.controller.BaseController", {
		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler for navigating back.
		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function () {

		},

		attachPatternMatched: function (route) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute(route).attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function (oEvent) {
			var parameters = oEvent.getParameters();

			if (parameters.name === 'Main') {
				this.getDadosECC('getModelos');
			}
		},

		getDadosECC: function (parametro, notBusy) {

			var oModel = this.getOwnerComponent().getModel();
			var oDataURL;
			var expand = null;
			var that = this;

			if (!notBusy) {
				this.getView().setBusy(true);
			}

			if (this.byId("idInputPeriodo").getSelectedItem())
				key.Instance = this.byId("idInputPeriodo").getSelectedItem().getText();
			if (key.Instance === '*' || key.Instance === "")
				key.Instance = '0';

			//  dadosIniciais -> qdo o model está vazio, faz a busca inicial no SAP	
			if (parametro === 'getModelos') {
				oDataURL = "/Planos";
			}
			if (parametro === 'getDetalheModelo') {
				oDataURL = "/setupEmails(Profile='" + key.Profile.trim() + "',Instance='0',Item='0')";
				expand = "setupMailToHierarquiaPasta";
			}
			if (parametro === 'getRegra') {
				oDataURL = "/setupEmails(Profile='" + key.Profile.trim() + "',Instance='" + key.Instance.trim() + "',Item='" + key.Item.trim() +
					"')";
			}
			// if (parametro === 'getDetalheModelo') {
			// 	oDataURL = "/DadosIniciais(Profile='" + key.Profile.trim() + "',Instance='0',NoAtual='0')";
			// 	expand = "ToPlanos,ToPlanoSelecionado,ToPeriodos,ToHierarquiaPastas,ToHierarquiaGantt";
			// }
			// if (parametro === 'getRegra') {
			// 	oDataURL = "/DadosIniciais(Profile='" + key.Profile.trim() + "',Instance='" + key.Instance.trim() + "',NoAtual='" + key.Item.trim() + "')";
			// }
			oModel.removeData();
			if (expand !== null)
				oModel.read(oDataURL, {
					urlParameters: {
						"$expand": expand
					},
					method: "GET",
					success: function (data) {
						that.respostaECC(that, parametro, data);
					},
					error: function (error) {
						sap.m.MessageToast.show("Erro na conexão com o ECC");
						that.getView().setBusy(false);
					}
				});
			else
				oModel.read(oDataURL, {
					method: "GET",
					success: function (data) {
						that.respostaECC(that, parametro, data);
					},
					error: function (error) {
						sap.m.MessageToast.show("Erro na conexão com o ECC");
						that.getView().setBusy(false);
					}
				});
		},

		respostaECC: function (that, parameter, data) {

			switch (parameter) {
			case "getModelos":
				that.inicializaModelos(that, data);
				break;
			case "getDetalheModelo":
				that.setDelatheModelo(that, data);
				break;
			case "getRegra":
				that.setValueRegras(that, data);
				break;
			}
			that.getView().setBusy(false);
		},

		setDadosECC: function (parametro, data) {

			var oModel = this.getOwnerComponent().getModel();
			var oRequestData = {};
			var oDataURL;
			var that = this;
			var message;
			var contemRegra;
			var modific = false;
			var messagePopup = false;

			if (this.byId("idSwitchLembrete").getState() || this.byId("idSwitchNI").getState() ||
				this.byId("idSwitchNE").getState() || this.byId("idSwitchDI").getState())
				modific = true;

			if (!modific && parametro !== "excluirRegra") {
				MessageBox.alert("Nenhuma regra adicionada a tarefa", '', "Error");
				return;
			}

			key.Profile = this.byId("idInputModelo").getSelectedItem().getText();
			if (this.byId("idCheckboxModelo").getSelected())
				key.Instance = '0';
			else
				key.Instance = this.byId("idInputPeriodo").getSelectedItem().getText();

			key.NoAtual = '*';

			oRequestData = this.getTreeData(parametro);

			var mParameters = {
				groupId: "regras",
				success: function (odata, resp) {
					if (!messagePopup) {
						messagePopup = true;
						if (parametro === "gravarRegra")
							MessageBox.alert("Regras salvas com sucesso", '', "Sucesso");
						else
							MessageBox.alert("Regras excluídas com sucesso", '', "Sucesso");
						that.byId("navCon").to(that.byId("p1"), "show");
						that.updateModelRegra(contemRegra);
						that.byId("Tree").removeSelections();
					}
				},
				error: function (odata, resp) {
					MessageBox.alert("Erro de Conexão com ECC", '', "Erro");
				}
			};

			if (parametro === "gravarRegra") {
				contemRegra = "X";
				message = "Regra gravada com sucesso";
				oDataURL = "/setupEmails(Profile='" + key.Profile.trim() + "',Instance='" + key.Instance.trim() + "',Item='" + key.NoAtual.trim() +
					"')";
			}

			if (parametro === "excluirRegra") {
				contemRegra = "";
				message = "Regra excluída com sucesso";
				oDataURL = "/setupEmails(Profile='" + key.Profile.trim() + "',Instance='" + key.Instance.trim() + "',Item='" + key.NoAtual.trim() +
					"')";
			}

			for (var i = 0; i < oRequestData.length; i++) {
				oModel.update(oDataURL, oRequestData[i], mParameters);
			}

			oModel.setUseBatch(true);
			oModel.setDeferredGroups(["regras"]);
			oModel.submitChanges(mParameters);

		},

		updateModelRegra: function (value) {
			var treeSelectedItems = this.byId("Tree").getSelectedItems();
			var customData;
			var items = [];
			var modelTree = this.getView().getModel("HierarquiaPastas");

			treeSelectedItems.forEach(function (item) {
				customData = item.getCustomData("key");
				items.push(customData[0].getValue());
			});

			this.setResultsModel(modelTree.oData, "NodeID", items, "contemRegra", value);

			modelTree.refresh(true);

		},

		setResultsModel: function (results, keyname, keyvalues, fieldname, value) {
			var done = null;
			var that = this;

			results.forEach(function (item) {
				if (keyvalues.includes(item[keyname]) || item[keyname] === key.Item) {
					item[fieldname] = value;
					done = "ok";
				} else if (item.children !== undefined) {
					done = that.setResultsModel(item.children, keyname, keyvalues, fieldname, value);
				}
			});
		},

		inicializaModelos: function (that, data) {

			if (data.results.length > 0) {
				that.updateModel(that, "Planos", data.results);
			}
		},

		setDelatheModelo: function (that, data) {
			var nodesPastas = that.montaTree(data.setupMailToHierarquiaPasta.results);
			that.updateModel(that, "HierarquiaPastas", nodesPastas);
			this.byId("Tree").expandToLevel(9);

		},

		updateModel: function (that, name, data) {
			var oModel = new sap.ui.model.json.JSONModel(data);
			that.getView().setModel(oModel, name);
		},

		onNovoModelo: function (oEvent) {

			this.byId("Tree").setVisible(true);
			this.byId("Tree").removeSelections();

			if (oEvent.getSource().getSelectedItem().getText() === this.getView().getModel("Planos").oData[0].Profile)
				return;

			if (oEvent.getSource().getSelectedItem().getText() === "")
				return;

			key.Profile = oEvent.getSource().getSelectedItem().getText();
			key.Instance = '';
			key.NoAtual = '';

			this.byId("navCon").to(this.byId("p1"), "show");
			this.getDadosECC('getDetalheModelo');
		},

		montaTree: function (nodesIn) {

			var nodes = []; //'deep' object structure
			var nodeMap = {}; //'map', each node is an attribute
			
			// nodesIn.sort((a,b) => (a.NodeID > b.NodeID) ? 1 : ((b.NodeID > a.NodeID) ? -1 : 0)); 

			if (nodesIn) {

				var nodeOut;
				var parentId;

				for (var i = 0; i < nodesIn.length; i++) {
					var nodeIn = nodesIn[i];
					nodeOut = {
						NodeID: nodeIn.NodeID,
						Description: nodeIn.Description,
						Item: nodeIn.Item,
						contemRegra: nodeIn.contemRegra,
						select: false,
						children: []
					};

					parentId = nodeIn.ParentNodeID;

					if (parentId !== 'null') {
						var parent = nodeMap[nodeIn.ParentNodeID];

						if (parent) {
							parent.children.push(nodeOut);
						}
					} else {
						//there is no parent, must be top level
						nodes.push(nodeOut);
					}

					//add the node to the node map, which is a simple 1-level list of all nodes
					nodeMap[nodeOut.NodeID] = nodeOut;
				}
			}
			return nodes;
		},

		onPressTree: function (oEvent) {

			oEvent.getSource().setSelected(true);

			var navCon = this.byId("navCon");

			//	if(this.byId("Tree").getSelectedItems().length > 0){
			var customData = oEvent.getSource().getCustomData("key");
			key.Item = customData[0].getValue();
			this.getDadosECC("getRegra");
			navCon.to(this.byId("p2"), "show");
			//	}
			//	else
			//		navCon.to(this.byId("p1"),"show");
		},

		onPressGravarRegra: function (oEvent) {
			this.setDadosECC("gravarRegra");
		},

		onPressExcluirRegra: function (oEvent) {
			var tabBar = this.byId("idIconTabBar");

			var idSelec = tabBar.getSelectedKey();
			var tabFilter = this.byId(idSelec);

			var vbox = tabFilter.getContent()[0];

			var items = vbox.getItems();

			for (var i = 0; i < items.length; i++) {
				var value = items[i];

				var hbox = value.getItems();

				for (var i2 = 0; i2 < hbox.length; i2++) {
					var value2 = hbox[i2];
					if (value2.getMetadata().getElementName("sClassName") == 'sap.m.Switch')
						value2.setState(false);
					if (value2.getMetadata().getElementName("sClassName") == 'sap.m.TimePicker')
						value2.setValue('000000');
					if (value2.getMetadata().getElementName("sClassName") == 'sap.m.Input')
						value2.setValue('');
				}

			}
			this.setDadosECC("excluirRegra");
		},

		onTreeSelect: function (oEvent) {

			function addSelectedFlag(aNodes, bSelected) {
				jQuery.each(aNodes, function (iIndex, oNode) {
					oNode.selected = bSelected;
					if (oNode.children) {
						addSelectedFlag(oNode.children, bSelected);
					}
				});
			}

			var aItems = oEvent.getParameter("listItems") || [],
				oModel = this.getView().getModel('HierarquiaPastas');
			jQuery.each(aItems, function (iIndex, oItem) {
				var oNode = oItem.getBindingContext('HierarquiaPastas').getObject(),
					bSelected = oItem.getSelected();
				if (oNode.children) {
					addSelectedFlag(oNode.children, bSelected);
				}
			});
			oModel.refresh();

		},

		getTreeData: function (parametro) {

			var items = [];
			var treeSelectedItems = this.byId("Tree").getSelectedItems();
			var customData;
			var switchLembrete = null;
			var switchNI = null;
			var switchNE = null;
			var switchDI = null;
			var that = this;
			var operacao;

			if (this.byId("idSwitchLembrete").getState())
				switchLembrete = "X";

			if (this.byId("idSwitchNI").getState())
				switchNI = "X";

			if (this.byId("idSwitchNE").getState())
				switchNE = "X";

			if (this.byId("idSwitchDI").getState())
				switchDI = "X";

			var mountJsonData = function () {
				return {
					Profile: key.Profile,
					Instance: key.Instance,
					TipoLb: switchLembrete,
					Agend: that.byId("lembreteAgendHoras").getValue(),
					EmailLb1: that.byId("lembreteEmails").getValue(),
					AssuntoLb: that.byId("lembreteAssunto").getValue(),
					LinhaLb1: that.byId("lembreteTexto1").getValue(),
					LinhaLb2: that.byId("lembreteTexto2").getValue(),

					TipoNi: switchNI,
					QtdEmailNi: that.byId("qtdeNIEmails").getValue(),
					IntEnvioNi: that.byId("AtvdNIintervalo").getValue(),
					EmailNi1: that.byId("atvdNIEmails").getValue(),
					AssuntoNi: that.byId("atvdNIAssunto").getValue(),
					LinhaNi1: that.byId("atvdNITexto1").getValue(),
					LinhaNi2: that.byId("atvdNITexto2").getValue(),

					TipoNe: switchNE,
					QtdEmailNe: that.byId("qtdeNEEmails").getValue(),
					IntEnvioNe: that.byId("AtvdNEintervalo").getValue(),
					EmailNe1: that.byId("atvdNEEmails").getValue(),
					AssuntoNe: that.byId("atvdNEAssunto").getValue(),
					LinhaNe1: that.byId("atvdNETexto1").getValue(),
					LinhaNe2: that.byId("atvdNETexto2").getValue(),

					TipoAd: switchDI,
					EmailAd1: that.byId("atvdDIEmails").getValue(),
					Assunto: that.byId("atvdDIAssunto").getValue(),
					LinhaAd1: that.byId("atvdDITexto1").getValue(),
					LinhaAd2: that.byId("atvdDITexto2").getValue(),

					Operacao: operacao
				};
			};

			var tarefa = mountJsonData();
			tarefa.Item = key.Item;
			items.push(tarefa);

			treeSelectedItems.forEach(function (item) {
				var modelData = mountJsonData();
				customData = item.getCustomData("key");
				if (key.Item !== customData[0].getValue()) {
					modelData.Item = customData[0].getValue();
					items.push(modelData);
				}
			});

			return items;
		},

		onChangeSwitchLb: function (oEvent) {
			var controls = ["lembreteAgendHoras", "lembreteEmails", "lembreteAssunto", "lembreteTexto1", "lembreteTexto2"];
			var that = this;
			var condition;

			if (oEvent === undefined)
				condition = this.byId("idSwitchLembrete").getState();
			else
				condition = oEvent.getSource().getState();

			controls.forEach(function (control) {
				that.byId(control).setEnabled(condition);
			});
		},

		onChangeSwitchNI: function (oEvent) {
			var controls = ["AtvdNIintervalo", "atvdNIEmails", "atvdNIAssunto", "atvdNITexto1", "atvdNITexto2", "qtdeNIEmails"];
			var that = this;
			var condition;

			if (oEvent === undefined)
				condition = this.byId("idSwitchNI").getState();
			else
				condition = oEvent.getSource().getState();

			controls.forEach(function (control) {
				that.byId(control).setEnabled(condition);
			});
		},

		onChangeSwitchNE: function (oEvent) {
			var controls = ["AtvdNEintervalo", "atvdNEEmails", "atvdNEAssunto", "atvdNETexto1", "atvdNETexto2", "qtdeNEEmails"];
			var that = this;
			var condition;

			if (oEvent === undefined)
				condition = this.byId("idSwitchNE").getState();
			else
				condition = oEvent.getSource().getState();

			controls.forEach(function (control) {
				that.byId(control).setEnabled(condition);
			});
		},

		onChangeSwitchDI: function (oEvent) {
			var controls = ["atvdDIEmails", "atvdDIAssunto", "atvdDITexto1", "atvdDITexto2"];
			var that = this;
			var condition;

			if (oEvent === undefined)
				condition = this.byId("idSwitchDI").getState();
			else
				condition = oEvent.getSource().getState();

			controls.forEach(function (control) {
				that.byId(control).setEnabled(condition);
			});
		},

		onPressHelp: function (oEvent) {
			var tooltip = this.byId("tooltipCont").getDomRef();
			var iconHelp = oEvent.getSource().getDomRef();
			var rects = iconHelp.getClientRects();
			var left = rects[0].x - 225;
			tooltip.style.left = left + "px";
		},

		setValueRegras: function (that, data) {

			if (data.TipoLb === "X")
				this.byId("idSwitchLembrete").setState(true);
			else
				this.byId("idSwitchLembrete").setState(false);

			that.byId("lembreteAgendHoras").setValue(data.Agend);
			that.byId("lembreteEmails").setValue(data.EmailLb1);
			that.byId("lembreteAssunto").setValue(data.AssuntoLb);
			that.byId("lembreteTexto1").setValue(data.LinhaLb1);
			that.byId("lembreteTexto2").setValue(data.LinhaLb2);

			if (data.TipoNi === "X")
				this.byId("idSwitchNI").setState(true);
			else
				this.byId("idSwitchNI").setState(false);

			that.byId("qtdeNIEmails").setValue(data.QtdEmailNi);
			that.byId("AtvdNIintervalo").setValue(data.IntEnvioNi);
			that.byId("atvdNIEmails").setValue(data.EmailNi1);
			that.byId("atvdNIAssunto").setValue(data.AssuntoNi);
			that.byId("atvdNITexto1").setValue(data.LinhaNi1);
			that.byId("atvdNITexto2").setValue(data.LinhaNi2);

			if (data.TipoNe === "X")
				this.byId("idSwitchNE").setState(true);
			else
				this.byId("idSwitchNE").setState(false);

			that.byId("qtdeNEEmails").setValue(data.QtdEmailNe);
			that.byId("AtvdNEintervalo").setValue(data.IntEnvioNe);
			that.byId("atvdNEEmails").setValue(data.EmailNe1);
			that.byId("atvdNEAssunto").setValue(data.AssuntoNe);
			that.byId("atvdNETexto1").setValue(data.LinhaNe1);
			that.byId("atvdNETexto2").setValue(data.LinhaNe2);

			if (data.TipoAd === "X")
				this.byId("idSwitchDI").setState(true);
			else
				this.byId("idSwitchDI").setState(false);

			that.byId("atvdDIEmails").setValue(data.EmailAd1);
			that.byId("atvdDIAssunto").setValue(data.Assunto);
			that.byId("atvdDITexto1").setValue(data.LinhaAd1);
			that.byId("atvdDITexto2").setValue(data.LinhaAd2);

			that.onChangeSwitchLb();
			that.onChangeSwitchNI();
			that.onChangeSwitchNE();
			that.onChangeSwitchDI();

		}

	});

});