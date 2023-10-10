sap.ui.define([
	"./BaseController",
	"../model/formatter",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text"
], function (BaseController, formatter, Dialog, Button, Text) {
	"use strict";

	return BaseController.extend("votorantim.Y5JS_INTEGRACAO_UNICO.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			this.getRouter().getRoute("worklist").attachPatternMatched(this.PrimeiraValidacao, this);

			// apikey e url de QA.
			//this.ApiKey = "1fm687FHCXBGsFBU7y79NBz0EUVorpTL";
			//this.LinkCpi = "https://api-dev.apimanagement.br10.hana.ondemand.com/jsm-cpi-dev/http/js/acessorh/";
			// apikey e url de PRD
			//this.ApiKey = "UbEPL29xKT1p81JrAOyrEMhrVu7abJ4Z";
			//this.LinkCpi = "https://votorantim.apimanagement.br10.hana.ondemand.com:443/jsm-cpi-prd/http/js/acessorh/";
			
			// ajuste para avaliar qual � o ambiente onde a aplica��o est� sendo executada - DEV/QA ou PRD
			var completeURL = window.location.href;
			var defAmb = completeURL.indexOf("fioridev", 0);
			if (defAmb !== -1) {
				// Dados de DEV
				this.ApiKey = "1fm687FHCXBGsFBU7y79NBz0EUVorpTL";
				this.LinkCpi = "https://api-dev.apimanagement.br10.hana.ondemand.com/jsm-cpi-dev/http/js/acessorh/";
			} else {
				// Dados de PRD
				this.ApiKey = "UbEPL29xKT1p81JrAOyrEMhrVu7abJ4Z";
				this.LinkCpi = "https://votorantim.apimanagement.br10.hana.ondemand.com:443/jsm-cpi-prd/http/js/acessorh/";
			}
		},			

		PrimeiraValidacao: function () {

			var vUserId = this.getLogonUser();
			if (vUserId === undefined || vUserId === "DEFAULT_USER") {
				//vUserId = "fernando.cervantes@votorantim.com";
			}
			
			this.byId("tipoContrato").setSelectedKey("");
			this.byId("dataAdmissao").setValue("");
			this.byId("dataLimite").setValue("");
			this.byId("idNomeCandidato").setValue("");
			this.byId("idEmailCandidato").setValue("");
			this.byId("idCPFcandidato").setValue("");
			this.byId("idCelularCandidato").setValue("");

			this.ValidaPosicao = "";

			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ZET_COL_ESTR_ORGSet", {
					EmailOrg: vUserId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		getLogonUser: function () {
			var userID;
			var oUserInfo = new sap.ushell.services.UserInfo();
			if (oUserInfo) {
				userID = oUserInfo.getUser().getEmail();
			}
			return userID;
		},

		defineIcon: function () {
			var sRootPath = jQuery.sap.getModulePath("votorantim.Y5JS_INTEGRACAO_UNICO");
			var imagem = sRootPath + "/imagens/1625496952302.jpeg";

			return imagem;
		},

		defineLoading: function () {
			var sRootPath = jQuery.sap.getModulePath("votorantim.Y5JS_INTEGRACAO_UNICO");
			var imagem = sRootPath + "/imagens/voto_load.gif";

			return imagem;
		},

		onchangePosicao: function (oValue) {
			this.ObjectStatus0 = this.byId("ObjectStatus0").getText();
			this.ObjectAttribute = this.byId("ObjectAttribute").getText();
			this.ObjectAttribute1 = this.byId("ObjectAttribute1").getText();
			this.ObjectAttribute2 = this.byId("ObjectAttribute2").getText();
			this.ObjectAttribute3 = this.byId("ObjectAttribute3").getText();
			this.EmailOrg = this.byId("EmailOrg").getText();
			this.Bukrs = this.byId("Empresa").getText();
			this.Werks = this.byId("AreaRH").getText();
			this.Btrtl = this.byId("subAreaRH").getText();
			this.ValidaPosicao = "X";

			var posicao = oValue.getParameters().value;

			if (!posicao) {
				this.PrimeiraValidacao();
				sap.m.MessageBox.error("Posi��o obrigatoria");
				this.byId("idPosicao").setValueState("Error");
				this.byId("button").setVisible(false);
				return;
			} else {
				this.byId("idPosicao").setValueState("None");
				this.byId("button").setVisible(true);
			}

			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ZET_BUSCA_POSICAOSet", {
					Plans: posicao
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		_bindView: function (sObjectPath) {
			// Set busy indicator during view binding
			var that = this;
			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			if (this.erro !== "X") {
				that.byId("idimg").setVisible(true);
			}

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						that.byId("idimg").setVisible(true);
					},
					dataReceived: function () {
						that.byId("idimg").setVisible(false);
					},
					error: function () {
						that.byId("idimg").setVisible(false);
					}
				}
			});
		},

		_onBindingChange: function () {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();
			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				//this.PrimeiraValidacao();
			}
			if (this.ValidaPosicao === "X") {
				this.byId("ObjectStatus0").setText(this.ObjectStatus0);
				this.byId("ObjectAttribute").setText(this.ObjectAttribute);
				this.byId("ObjectAttribute1").setText(this.ObjectAttribute1);
				this.byId("ObjectAttribute2").setText(this.ObjectAttribute2);
				this.byId("ObjectAttribute3").setText(this.ObjectAttribute3);
				this.byId("EmailOrg").setText(this.EmailOrg);
				this.byId("Empresa").setText(this.Bukrs);
				this.byId("AreaRH").setText(this.Werks);
				this.byId("subAreaRH").setText(this.Btrtl);
			}

		},

		onChangedtAdmissao: function (oEvent) {
			var data = this.byId("dataAdmissao").getValue();
			if (data === "") {
				this.byId("dataAdmissao").setValueState("Error");
				sap.m.MessageBox.error("Data de admiss�o obrigat�rio.");
				this.Erro = "X";
				return;
			} else {
				this.byId("dataAdmissao").setValueState("Success");
				this.Erro = "";
			}
			var hoje = new Date(),
				dataAdmissao = this.transformaData(data);

			hoje = hoje.toLocaleDateString();
			hoje = this.transformaData(hoje);

			if (hoje > dataAdmissao) {
				this.byId("dataAdmissao").setValueState("Error");
				sap.m.MessageBox.error("Admiss�o deve possuir uma data futura.");
				this.Erro = "X";
				return;
			} else {
				this.byId("dataAdmissao").setValueState("Success");
				this.Erro = "";
				this.dataAdmissao = dataAdmissao;
			}
		},

		onChangedtLimite: function (oEvent) {
			var data = this.byId("dataLimite").getValue();
			if (data === "") {
				this.byId("dataLimite").setValueState("Error");
				sap.m.MessageBox.error("Data de limite obrigat�rio.");
				this.Erro = "X";
				return;
			} else {
				this.byId("dataLimite").setValueState("Success");
				this.Erro = "";
			}
			var hoje = new Date(),
				dataLimite = this.transformaData(data);

			hoje = hoje.toLocaleDateString();
			hoje = this.transformaData(hoje);

			if (hoje > dataLimite) {
				this.byId("dataLimite").setValueState("Error");
				sap.m.MessageBox.error("Data limite deve possuir uma data futura.");
				this.Erro = "X";
				return;
			} else {
				this.byId("dataLimite").setValueState("Success");
				this.Erro = "";
			}

			if (dataLimite > this.dataAdmissao) {
				this.byId("dataLimite").setValueState("Error");
				this.byId("dataAdmissao").setValueState("Error");
				sap.m.MessageBox.error("Data limite para o cadastro deve inferior � Data de Admiss�o.");
				this.Erro = "X";
				return;
			} else {
				this.byId("dataLimite").setValueState("Success");
				this.byId("dataAdmissao").setValueState("Success");
				this.Erro = "";
			}
		},

		transformaData: function (sData) {
			var Data;

			if (sData.indexOf('.') !== -1) {
				Data = sData.split(".");
			} else if (sData.indexOf('/') !== -1) {
				Data = sData.split("/");
			}

			var dia = Data[0];
			var mes = Data[1];
			var ano = Data[2];
			var dataTransformada = ano + mes + dia;

			return dataTransformada;
		},
		
		transformaDataZZ: function(sData){
			var Data;

			if (sData.indexOf('.') !== -1) {
				Data = sData.split(".");
			} else if (sData.indexOf('/') !== -1) {
				Data = sData.split("/");
			}

			var dia = Data[0];
			var mes = Data[1];
			var ano = Data[2];
			var dataTransformada = ano + "-" + mes + "-" + dia + "T00:00:00Z";

			return dataTransformada;
		},

		onChangeNomeCandidato: function (oEvent) {
			var nome = this.byId("idNomeCandidato").getValue();
			var teste;

			if (nome.indexOf(' ') !== -1) {

				teste = nome.split(" ");

				if (teste[0].length < 2) {
					this.byId("idNomeCandidato").setValueState("Error");
					sap.m.MessageBox.error("Preencher nome completo.");
					this.Erro = "X";
					return;
				}

				if (teste[1].length < 2) {
					this.byId("idNomeCandidato").setValueState("Error");
					sap.m.MessageBox.error("Preencher nome completo.");
					this.Erro = "X";
					return;
				}
			} else {
				this.byId("idNomeCandidato").setValueState("Error");
				sap.m.MessageBox.error("Preencher nome completo.");
				this.Erro = "X";
				return;
			}

			if (nome.length < 2) {
				this.byId("idNomeCandidato").setValueState("Error");
				sap.m.MessageBox.error("Preencher nome completo.");
				this.Erro = "X";
				return;
			}

			if (!nome) {
				this.byId("idNomeCandidato").setValueState("Error");
				sap.m.MessageBox.error("Nome do candidato obrigatorio.");
				this.Erro = "X";
				return;
			}

			this.byId("idNomeCandidato").setValueState("Success");
			this.Erro = "";
		},

		onChangeTelefone: function (oEvent) {
			var telefone = this.byId("idCelularCandidato").getValue();

			while (telefone.indexOf('(') !== -1) {
				telefone = telefone.replace("(", "");
			}

			while (telefone.indexOf(')') !== -1) {
				telefone = telefone.replace(")", "");
			}

			while (telefone.indexOf('_') !== -1) {
				telefone = telefone.replace("_", "");
			}

			if (telefone.length < 10) {
				this.byId("idCelularCandidato").setValueState("Error");
				sap.m.MessageBox.error("Telefone invalido.");
				this.Erro = "X";
				return;
			} else {
				this.byId("idCelularCandidato").setValueState("Success");
				this.Erro = "";
			}

		},

		onChangeEmail: function (oEvent) {
			var email = this.byId("idEmailCandidato").getValue();

			if (email.match(/@/)) {
				this.byId("idEmailCandidato").setValueState("Success");
				this.Erro = "";
			} else {
				this.byId("idEmailCandidato").setValueState("Error");
				sap.m.MessageBox.error("Email �nvalido.");
				this.Erro = "X";
				return;
			}
		},

		onEnviar: function () {
			var oModel = this.getModel();
			var data = oModel.oData;
			var posicao = this.byId("idPosicao").getValue();
			var key = "ZET_BUSCA_POSICAOSet('" + posicao + "')";
			var that = this;
			var ChaveCreate = "/ZET_GRAVA_POSICAOSet";
			var dataFinalContrato = "31/12/9999";
			var dataAdmissao = this.byId("dataAdmissao").getValue();
			var dataLimite = this.byId("dataLimite").getValue();
			var SolEmail = this.byId("EmailOrg").getText();
			var tipoContrato = this.byId("tipoContrato").getSelectedKey();
			var idNomeCandidato = this.byId("idNomeCandidato").getValue();
			var idCPFcandidato = this.byId("idCPFcandidato").getValue();
			var idEmailCandidato = this.byId("idEmailCandidato").getValue();
			var idCelularCandidato = this.byId("idCelularCandidato").getValue();

			this.onChangedtAdmissao();
			if (this.Erro === "X") {
				return;
			}
			this.onChangedtLimite();
			if (this.Erro === "X") {
				return;
			}
			this.onChangeNomeCandidato();
			if (this.Erro === "X") {
				return;
			}
			this.onChangeEmail();
			if (this.Erro === "X") {
				return;
			}
			this.onChangeTelefone();
			if (this.Erro === "X") {
				return;
			}

			var array = {
				SolBukrs: data[key].Bukrs, // Empresa solicitante
				SolPersa: data[key].Persa, // Area RH do Solicitante
				SolBtrtl: data[key].Btrtl, // Subarea do solicitante
				SolName: data[key].Cname, //Nome do Solicitante 
				SolEmail: SolEmail, //Email do Solicitante
				SolUser: "", // Usuario do solicitante
				ReqPlans: posicao, // id Posi��o
				ReqStell: data[key].Stell, // id Cargo
				ReqBukrs: data[key].Bukrs, // id empresa
				ReqPersa: data[key].Persa, // id arearh
				ReqBtrtl: data[key].Btrtl, // id subarea rh
				ReqCttyp: tipoContrato, // Tipo de contrato
				ReqCtedt: dataFinalContrato,
				ReqPersg: data[key].Persg, // Grupo Empregado
				ReqPersk: data[key].Persk, // SubGrupo empregado
				ReqDtadmPrev: dataAdmissao, // Data admissao
				ReqDtlimPreench: dataLimite, // data limite
				ReqCandCpf: idCPFcandidato, // cpf candidato
				ReqCandName: idNomeCandidato, // nome candidato
				ReqCandEmail: idEmailCandidato, // email candidato
				ReqCandPhone: idCelularCandidato // phone candidato
			};

			var dialog = new Dialog({
				title: "Confirma\xE7\xE3o",
				type: "Message",
				content: new Text({
					text: "Confirma o envio da posi��o?"
				}),
				beginButton: new Button({
					text: "Sim",
					press: function () {
						oModel.create(ChaveCreate, array, {
							success: function (oData, oResponse) {
								sap.m.MessageBox.success("Posi��o enviada com sucesso! Vers�o do APP: 3.1.7", {
									actions: ["OK"],
									onClose: function (sAction) {
										that.ExecutaEnviaCargos();
										that.ExecutaContrataCandidato(oData.IntId);
										that.PrimeiraValidacao();
									}
								});
							},
							error: function (oError) {
								var erro = oError;
								erro = erro.responseText;
								var erro2 = JSON.parse(erro);
								var messagem = erro2.error.message.value;
								sap.m.MessageBox.error(messagem, {
									actions: ["OK"],
									onClose: function (sAction) {}
								});
								return;
							}
						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "N\xE3o",
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();
		},

		ExecutaEnviaCargos: function () {
			var oModel = this.getModel();
			var data = oModel.oData;
			var posicao = this.byId("idPosicao").getValue();
			var key = "ZET_BUSCA_POSICAOSet('" + posicao + "')";
			var link = this.LinkCpi + "envioCargos";
			//ajuste por FRC para inclus�o da APIKey...
			//var headers = {"APIKey": "1fm687FHCXBGsFBU7y79NBz0EUVorpTL"};
			var headers = {"APIKey": this.APIKey};
			//
			var dataAdmissao = this.byId("dataAdmissao").getValue();
			dataAdmissao = this.transformaDataZZ(dataAdmissao);
			var dados = {
				ROOT: {
					Positions: {
						Empresa: data[key].Bukrs,
						Codigo: data[key].Plans,
						inicioVigencia: dataAdmissao,
						nomeCargo: data[key].Descc,
						CBO: data[key].Cbo,
						centroCusto: data[key].Kostl,
						centroCustoDesc: data[key].Ltext,
						valorMaxFaixa: 0,
						valorMinFaixa: 0,
						grupoSalarial: data[key].Persg,
						posicaoGestor: data[key].Pernr,
						inicioVigenciaGestor: "",
						unidadeOrg: data[key].Orgeh,
						unidadeOrgDesc: data[key].Orgtx,
						grupoEmpregado: data[key].Persg,
						grupoEmpregadoDesc: data[key].Descgre
					}
				}
			};

			var xml = this.OBJtoXML(dados);

			var status;
			var ajax = new XMLHttpRequest();
			//ajuste por FRC para inclus�o da APIKey...
			//ajax.open("POST", link, headers, true);
			ajax.open("POST", link, true);
			ajax.setRequestHeader("APIKey:" & this.APIKey);
			ajax.send(xml);
			ajax.onreadystatechange = function () {
				status = ajax.status;
				if (status === 200) {
				}else{
					sap.m.MessageBox.error("Erro de comunica��o API - > envioCargos " & link & " " & headers);
				}
			};
		},

		ExecutaContrataCandidato: function (sIntId) {
			var oModel = this.getModel();
			var data = oModel.oData;
			var posicao = this.byId("idPosicao").getValue();
			var key = "ZET_BUSCA_POSICAOSet('" + posicao + "')";
			var hoje = new Date();
			var link = this.LinkCpi + "envioPosicoes";
			var dataAdmissao = this.byId("dataAdmissao").getValue();
			dataAdmissao = this.transformaDataZZ(dataAdmissao);
			var dia = hoje.getDate();
			var mes = hoje.getMonth();
			var ano = hoje.getFullYear();
			var telefone = this.byId("idCelularCandidato").getValue();
			var CPF = this.byId("idCPFcandidato").getValue();
			
			if (dia < 10){
				dia = "0" + dia;
			}
			
			mes = mes + 1;
			if (mes < 10){
				mes = "0" + mes;
			}
			
			hoje = ano + "-" + mes + "-" + dia +"T00:00:00Z";
			
			while (telefone.indexOf('(') !== -1) {
				telefone = telefone.replace("(", "");
			}

			while (telefone.indexOf(')') !== -1) {
				telefone = telefone.replace(")", "");
			}

			while (telefone.indexOf('_') !== -1) {
				telefone = telefone.replace("_", "");
			}
			
			while (CPF.indexOf(".") !== -1){
				CPF = CPF.replace(".","");
			}
			
			while (CPF.indexOf("-") !== -1){
				CPF = CPF.replace("-","");
			}
			
			var AreaRh = data[key].Persa + "-" + data[key].Btrtl;
		
			var dados = {
				ROOT: {
					Empregados: {
						Empresa: data[key].Bukrs,
						DataRequisicao: hoje,
						Departamento: data[key].Orgeh,
						DepartamentoDesc: data[key].Orgtx,
						Cargo: data[key].Plans,
						DataContratacao: dataAdmissao,
						Nome: this.byId("idNomeCandidato").getValue(),
						CPF: CPF,
						Email: this.byId("idEmailCandidato").getValue(),
						Telefone: telefone,
						externalCode: sIntId,
						arearh: AreaRh,
						DadosUnico: {
							tipoContrato: this.byId("tipoContrato").getSelectedKey()
						}
					}
				}
			};

			var xml = this.OBJtoXML(dados);

			var status;
			var ajax = new XMLHttpRequest();
			ajax.open("POST", link, true);
			ajax.send(xml);
			ajax.onreadystatechange = function () {
				status = ajax.status;
				if (status === 200) {
				}else{
					sap.m.MessageBox.error("Erro de comunica��o API - > envioPosicoes");
				}
			};
		},

		ConvertDateTime: function (sData) {
			var Data;

			if (sData.indexOf(".") !== -1) {
				Data = sData.split(".");
			} else if (sData.indexOf("/") !== -1) {
				Data = sData.split("/");
			}

			var dia = Data[0];
			var mes = Data[1];
			var ano = Data[2];
			var dataTransformada = ano + "-" + mes + "-" + dia;
			var retornoData = new Date(dataTransformada);

			return retornoData;
		},

		OBJtoXML: function (obj) {
			var xml = '';
			for (var prop in obj) {
				xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
				if (obj[prop] instanceof Array) {
					for (var array in obj[prop]) {
						xml += "<" + prop + ">";
						xml += this.OBJtoXML(new Object(obj[prop][array]));
						xml += "</" + prop + ">";
					}
				} else if (typeof obj[prop] === "object") {
					xml += this.OBJtoXML(new Object(obj[prop]));
				} else {
					xml += obj[prop];
				}
				xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
			}
			var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
			return xml;
		}

	});
});