sap.ui.define(["./BaseController", "../model/formatter", "sap/m/Dialog", "sap/m/Button", "sap/m/Text"], function (t, e, a, i, r) {
	"use strict";
	return t.extend("y5jsintegv3.controller.Worklist", {
		formatter: e,
		onInit: function () {
			this.getRouter().getRoute("worklist").attachPatternMatched(this.PrimeiraValidacao, this);
			
			// apikey e url de QA.
			//this.ApiKey = "1fm687FHCXBGsFBU7y79NBz0EUVorpTL";
			//this.LinkCpi = "https://api-dev.apimanagement.br10.hana.ondemand.com/jsm-cpi-dev/http/js/acessorh/";
			// apikey e url de PRD
			//this.ApiKey = "UbEPL29xKT1p81JrAOyrEMhrVu7abJ4Z";
			//this.LinkCpi = "https://votorantim.apimanagement.br10.hana.ondemand.com:443/jsm-cpi-prd/http/js/acessorh/";

			// ajuste para avaliar qual ambiente onde a aplicacao esta sendo executada - DEV/QA ou PRD
			var completeURL = window.location.href.toLowerCase();
			var defAmb = completeURL.indexOf("fiori.votorantim", 0);
			if (defAmb !== -1) {
				// Dados de PRD
				this.ApiKey = "UbEPL29xKT1p81JrAOyrEMhrVu7abJ4Z";
				this.LinkCpi = "https://votorantim.apimanagement.br10.hana.ondemand.com:443/jsm-cpi-prd/http/js/acessorh/";				
			} else {
				// Dados de DEV
				this.ApiKey = "1fm687FHCXBGsFBU7y79NBz0EUVorpTL";
				this.LinkCpi = "https://api-dev.apimanagement.br10.hana.ondemand.com/jsm-cpi-dev/http/js/acessorh/";
			}

			// ajuste FRC para checar ambiente
			//sap.m.MessageBox.success(completeURL + " " + this.ApiKey, {
			//						actions: ["OK"]
			//});

		},
		PrimeiraValidacao: function () {
			var t = this.getLogonUser();
			if (t === undefined || t === "DEFAULT_USER") {
				t = "fernando.cervantes@votorantim.com";
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
				var e = this.getModel().createKey("ZET_COL_ESTR_ORGSet", {
					EmailOrg: t
				});
				this._bindView("/" + e);
			}.bind(this));
		},
		getLogonUser: function () {
			var t;
			var e = new sap.ushell.services.UserInfo;
			if (e) {
				t = e.getUser().getEmail();
			}
			return t;
		},
		defineIcon: function () {
			var t = jQuery.sap.getModulePath("y5js_integ_v3");
			var e = t + "/imagens/JS.jpg";
			return e;
		},
		defineLoading: function () {
			var t = jQuery.sap.getModulePath("y5js_integ_v3");
			var e = t + "/imagens/voto_load.gif";
			return e;
		},
		onchangePosicao: function (t) {
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
			var e = t.getParameters().value;
			if (!e) {
				this.PrimeiraValidacao();
				sap.m.MessageBox.error("Posição obrigatoria");
				this.byId("idPosicao").setValueState("Error");
				this.byId("button").setVisible(false);
				return
			} else {
				this.byId("idPosicao").setValueState("None");
				this.byId("button").setVisible(true)
			}
			this.getModel().metadataLoaded().then(function () {
				var t = this.getModel().createKey("ZET_BUSCA_POSICAOSet", {
					Plans: e
				});
				this._bindView("/" + t)
			}.bind(this))
		},
		_bindView: function (t) {
			var e = this;
			if (this.erro !== "X") {
				e.byId("idimg").setVisible(true)
			}
			this.getView().bindElement({
				path: t,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						e.byId("idimg").setVisible(true)
					},
					dataReceived: function () {
						e.byId("idimg").setVisible(false)
					},
					error: function () {
						e.byId("idimg").setVisible(false)
					}
				}
			})
		},
		_onBindingChange: function () {
			var t = this.getView(),
				e = t.getElementBinding();
			if (!e.getBoundContext()) {}
			if (this.ValidaPosicao === "X") {
				this.byId("ObjectStatus0").setText(this.ObjectStatus0);
				this.byId("ObjectAttribute").setText(this.ObjectAttribute);
				this.byId("ObjectAttribute1").setText(this.ObjectAttribute1);
				this.byId("ObjectAttribute2").setText(this.ObjectAttribute2);
				this.byId("ObjectAttribute3").setText(this.ObjectAttribute3);
				this.byId("EmailOrg").setText(this.EmailOrg);
				this.byId("Empresa").setText(this.Bukrs);
				this.byId("AreaRH").setText(this.Werks);
				this.byId("subAreaRH").setText(this.Btrtl)
			}
		},
		onChangedtAdmissao: function (t) {
			var e = this.byId("dataAdmissao").getValue();
			if (e === "") {
				this.byId("dataAdmissao").setValueState("Error");
				sap.m.MessageBox.error("Data de admissão obrigatório.");
				this.Erro = "X";
				return
			} else {
				this.byId("dataAdmissao").setValueState("Success");
				this.Erro = ""
			}
			var a = new Date,
				i = this.transformaData(e);
			a = a.toLocaleDateString();
			a = this.transformaData(a);
			if (a > i) {
				this.byId("dataAdmissao").setValueState("Error");
				sap.m.MessageBox.error("Admissão deve possuir uma data futura.");
				this.Erro = "X";
				return
			} else {
				this.byId("dataAdmissao").setValueState("Success");
				this.Erro = "";
				this.dataAdmissao = i
			}
		},
		onChangedtLimite: function (t) {
			var e = this.byId("dataLimite").getValue();
			if (e === "") {
				this.byId("dataLimite").setValueState("Error");
				sap.m.MessageBox.error("Data de limite obrigatório.");
				this.Erro = "X";
				return
			} else {
				this.byId("dataLimite").setValueState("Success");
				this.Erro = ""
			}
			var a = new Date,
				i = this.transformaData(e);
			a = a.toLocaleDateString();
			a = this.transformaData(a);
			if (a > i) {
				this.byId("dataLimite").setValueState("Error");
				sap.m.MessageBox.error("Data limite deve possuir uma data futura.");
				this.Erro = "X";
				return
			} else {
				this.byId("dataLimite").setValueState("Success");
				this.Erro = ""
			}
			if (i > this.dataAdmissao) {
				this.byId("dataLimite").setValueState("Error");
				this.byId("dataAdmissao").setValueState("Error");
				sap.m.MessageBox.error("Data limite para o cadastro deve ser inferior a Data de Admissão.");
				this.Erro = "X";
				return
			} else {
				this.byId("dataLimite").setValueState("Success");
				this.byId("dataAdmissao").setValueState("Success");
				this.Erro = ""
			}
		},
		transformaData: function (t) {
			var e;
			if (t.indexOf(".") !== -1) {
				e = t.split(".")
			} else if (t.indexOf("/") !== -1) {
				e = t.split("/")
			}
			var a = e[0];
			var i = e[1];
			var r = e[2];
			var s = r + i + a;
			return s
		},
		transformaDataZZ: function (t) {
			var e;
			if (t.indexOf(".") !== -1) {
				e = t.split(".")
			} else if (t.indexOf("/") !== -1) {
				e = t.split("/")
			}
			var a = e[0];
			var i = e[1];
			var r = e[2];
			var s = r + "-" + i + "-" + a + "T00:00:00Z";
			return s
		},
		onChangeNomeCandidato: function (t) {
			var e = this.byId("idNomeCandidato").getValue();
			var a;
			if (e.indexOf(" ") !== -1) {
				a = e.split(" ");
				if (a[0].length < 2) {
					this.byId("idNomeCandidato").setValueState("Error");
					sap.m.MessageBox.error("Preencher nome completo.");
					this.Erro = "X";
					return
				}
				if (a[1].length < 2) {
					this.byId("idNomeCandidato").setValueState("Error");
					sap.m.MessageBox.error("Preencher nome completo.");
					this.Erro = "X";
					return
				}
			} else {
				this.byId("idNomeCandidato").setValueState("Error");
				sap.m.MessageBox.error("Preencher nome completo.");
				this.Erro = "X";
				return
			}
			if (e.length < 2) {
				this.byId("idNomeCandidato").setValueState("Error");
				sap.m.MessageBox.error("Preencher nome completo.");
				this.Erro = "X";
				return
			}
			if (!e) {
				this.byId("idNomeCandidato").setValueState("Error");
				sap.m.MessageBox.error("Nome do candidato obrigatorio.");
				this.Erro = "X";
				return
			}
			this.byId("idNomeCandidato").setValueState("Success");
			this.Erro = ""
		},
		onChangeTelefone: function (t) {
			var e = this.byId("idCelularCandidato").getValue();
			while (e.indexOf("(") !== -1) {
				e = e.replace("(", "")
			}
			while (e.indexOf(")") !== -1) {
				e = e.replace(")", "")
			}
			while (e.indexOf("_") !== -1) {
				e = e.replace("_", "")
			}
			if (e.length < 11) {
				this.byId("idCelularCandidato").setValueState("Error");
				sap.m.MessageBox.error("Nr. celular invalido - Informe DDD (99)9 + 8 dígitos.");
				this.Erro = "X";
				return
    		} else if (e[2] !== "9") {
			    this.byId("idCelularCandidato").setValueState("Error");
			    sap.m.MessageBox.error("Nr. celular invalido - Informe DDD (99)9 + 8 dígitos.");
			    this.Erro = "X";
			    return
			} else {
			        this.byId("idCelularCandidato").setValueState("Success");
			        this.Erro = ""
			}
		},
		
        onChangeEmail: function (t) {
			var e = this.byId("idEmailCandidato").getValue();
            //sap.m.MessageBox.info("Entrei eMail invalido.");
            if (e.match(/@/)) {
				this.byId("idEmailCandidato").setValueState("Success");
				this.Erro = ""
			} else {
				this.byId("idEmailCandidato").setValueState("Error");
				sap.m.MessageBox.error("Email invalido.");
				this.Erro = "X";
				return
			}
		},

	    onChangeCPF: function (t) {
    		var e = this.byId("idCPFCandidato").getValue();
            //sap.m.MessageBox.info("Entrei CPF invalido.");
            while (e.indexOf(".") !== -1) {
				e = e.replace(".", "")
			}
			while (e.indexOf("-") !== -1) {
				e = e.replace(".", "")
			}
			while (e.indexOf("_") !== -1) {
				e = e.replace("_", "")
			}
			if (e.length < 11) {
                this.byId("idCPFCandidato").setValueState("Error");
      			sap.m.MessageBox.error("CPF invalido.");
				this.Erro = "X";
                return            
			} else {
                this.byId("idCPFCandidato").setValueState("Success");
				this.Erro = ""
			}
		},

        onEnviar: function () {
			var t = this.getModel();
			var e = t.oData;
			var s = this.byId("idPosicao").getValue();
			var o = "ZET_BUSCA_POSICAOSet('" + s + "')";
			var n = this;
			var d = "/ZET_GRAVA_POSICAOSet";
			var l = "31/12/9999";
			var h = this.byId("dataAdmissao").getValue();
			var u = this.byId("dataLimite").getValue();
			var c = this.byId("EmailOrg").getText();
			var m = this.byId("tipoContrato").getSelectedKey();
			var g = this.byId("idNomeCandidato").getValue();
			var b = this.byId("idCPFcandidato").getValue();
			var f = this.byId("idEmailCandidato").getValue();
			var v = this.byId("idCelularCandidato").getValue();
			this.onChangedtAdmissao();
			if (this.Erro === "X") {
				return
			}
			this.onChangedtLimite();
			if (this.Erro === "X") {
				return
			}
			this.onChangeNomeCandidato();
			if (this.Erro === "X") {
				return
			}
			this.onChangeEmail();
			if (this.Erro === "X") {
				return
			}
			this.onChangeTelefone();
			if (this.Erro === "X") {
				return
			}
			var C = {
				SolBukrs: e[o].Bukrs,
				SolPersa: e[o].Persa,
				SolBtrtl: e[o].Btrtl,
				SolName: e[o].Cname,
				SolEmail: c,
				SolUser: "",
				ReqPlans: s,
				ReqStell: e[o].Stell,
				ReqBukrs: e[o].Bukrs,
				ReqPersa: e[o].Persa,
				ReqBtrtl: e[o].Btrtl,
				ReqCttyp: m,
				ReqCtedt: l,
				ReqPersg: e[o].Persg,
				ReqPersk: e[o].Persk,
				ReqDtadmPrev: h,
				ReqDtlimPreench: u,
				ReqCandCpf: b,
				ReqCandName: g,
				ReqCandEmail: f,
				ReqCandPhone: v
			};
			var I = new a({
				title: "Confirmação",
				type: "Message",
				content: new r({
					text: "Confirma o envio da posição?"
				}),
				beginButton: new i({
					text: "Sim",
					press: function () {
						t.create(d, C, {
							success: function (t, e) {
								sap.m.MessageBox.success("Posição enviada com sucesso!", {
									actions: ["OK"],
									onClose: function (e) {
										n.ExecutaEnviaCargos();
										n.ExecutaContrataCandidato(t.IntId);
										n.PrimeiraValidacao()
									}
								})
							},
							error: function (t) {
								var e = t;
								e = e.responseText;
								var a = JSON.parse(e);
								var i = a.error.message.value;
								sap.m.MessageBox.error(i, {
									actions: ["OK"],
									onClose: function (t) {}
								});
								return
							}
						});
						I.close()
					}
				}),
				endButton: new i({
					text: "Não",
					press: function () {
						I.close()
					}
				}),
				afterClose: function () {
					I.destroy()
				}
			});
			I.open()
		},
		ExecutaEnviaCargos: function () {
			var t = this.getModel();
			var e = t.oData;
			var a = this.byId("idPosicao").getValue();
			var i = "ZET_BUSCA_POSICAOSet('" + a + "')";
			var r = this.LinkCpi + "envioCargos";
            
            // FRC - ajuste para envio da APIKey do ambiente
            // var headers = {"APIKey": this.APIKey};
            
            var h1 = {"APIKey": "1fm687FHCXBGsFBU7y79NBz0EUVorpTL"};

			var s = this.byId("dataAdmissao").getValue();
			s = this.transformaDataZZ(s);
			var o = {
				ROOT: {
					Positions: {
						Empresa: e[i].Bukrs,
						Codigo: e[i].Plans,
						inicioVigencia: s,
						nomeCargo: e[i].Descc,
						CBO: e[i].Cbo,
						centroCusto: e[i].Kostl,
						centroCustoDesc: e[i].Ltext,
						valorMaxFaixa: 0,
						valorMinFaixa: 0,
						grupoSalarial: e[i].Persg,
						posicaoGestor: e[i].Pernr,
						inicioVigenciaGestor: "",
						unidadeOrg: e[i].Orgeh,
						unidadeOrgDesc: e[i].Orgtx,
						grupoEmpregado: e[i].Persg,
						grupoEmpregadoDesc: e[i].Descgre
					}
				}
			};
			var n = this.OBJtoXML(o);
			var d;
			var l = new XMLHttpRequest;
          
            //XMLHttpRequest.open(method, url, async) onde async = true or false
            //l.open("OPTIONS",r,false);
            //l.setRequestHeader("Content-Type","application/json");
            //l.setRequestHeader("APIKey","TESTE");
            //l.send(n);       
            
            l.open("POST", r, true);
            
            //sap.m.MessageBox.error(h1.APIKey);
            // l.open("POST", r, true);
            // l.setRequestHeader("APIKey:" & this.APIKey); ** Não funcionou
            // l.setRequestHeader("APIKey:",this.APIKey); ** Não funcionou
            // l.setRequestHeader("APIKey:","teste");            
            
            l.setRequestHeader("Content-Type","application/json");
			l.send(n);
			l.onreadystatechange = function () {
				d = l.status;
				if (d === 200) {} else {
					sap.m.MessageBox.error("Erro de comunicação API - > envioCargos")
				}
			}
		},
        
		ExecutaContrataCandidato: function (t) {
			var e = this.getModel();
			var a = e.oData;
			var i = this.byId("idPosicao").getValue();
			var r = "ZET_BUSCA_POSICAOSet('" + i + "')";
			var s = new Date;
			var o = this.LinkCpi + "envioPosicoes";

            // FRC - ajuste para envio da APIKey do ambiente
            // var headers = {"APIKey": this.APIKey};
            var h1 = {"APIKey": "1fm687FHCXBGsFBU7y79NBz0EUVorpTL"};

			var n = this.byId("dataAdmissao").getValue();
			n = this.transformaDataZZ(n);
			var d = s.getDate();
			var l = s.getMonth();
			var h = s.getFullYear();
			var u = this.byId("idCelularCandidato").getValue();
			var c = this.byId("idCPFcandidato").getValue();

			if (d < 10) {
				d = "0" + d
			}
			l = l + 1;
			if (l < 10) {
				l = "0" + l
			}
			s = h + "-" + l + "-" + d + "T00:00:00Z";
			while (u.indexOf("(") !== -1) {
				u = u.replace("(", "")
			}
			while (u.indexOf(")") !== -1) {
				u = u.replace(")", "")
			}
			while (u.indexOf("_") !== -1) {
				u = u.replace("_", "")
			}
			while (c.indexOf(".") !== -1) {
				c = c.replace(".", "")
			}
			while (c.indexOf("-") !== -1) {
				c = c.replace("-", "")
			}
			var m = a[r].Persa + "-" + a[r].Btrtl;
			var g = {
				ROOT: {
					Empregados: {
						Empresa: a[r].Bukrs,
						DataRequisicao: s,
						Departamento: a[r].Orgeh,
						DepartamentoDesc: a[r].Orgtx,
						Cargo: a[r].Plans,
						DataContratacao: n,
						Nome: this.byId("idNomeCandidato").getValue(),
						CPF: c,
						Email: this.byId("idEmailCandidato").getValue().trim(),
						Telefone: u,
						externalCode: t,
						arearh: m,
						DadosUnico: {
							tipoContrato: this.byId("tipoContrato").getSelectedKey()
						}
					}
				}
			};
			var b = this.OBJtoXML(g);
			var f;
			var v = new XMLHttpRequest;

            v.open("POST", o, true);
            
			//v.open("POST", o, true);
            //l.setRequestHeader("APIKey:" & this.APIKey); ** Não funcionou
            //l.setRequestHeader("APIKey:",this.APIKey); ** Não funcionou
            
			v.send(b);

            v.onreadystatechange = function () {
				f = v.status;
				if (f === 200) {} else {
					sap.m.MessageBox.error("Erro de comunicação API - > envioPosicoes")
				}
			}
		},
		ConvertDateTime: function (t) {
			var e;
			if (t.indexOf(".") !== -1) {
				e = t.split(".")
			} else if (t.indexOf("/") !== -1) {
				e = t.split("/")
			}
			var a = e[0];
			var i = e[1];
			var r = e[2];
			var s = r + "-" + i + "-" + a;
			var o = new Date(s);
			return o
		},
		OBJtoXML: function (t) {
			var e = "";
			for (var a in t) {
				e += t[a] instanceof Array ? "" : "<" + a + ">";
				if (t[a] instanceof Array) {
					for (var i in t[a]) {
						e += "<" + a + ">";
						e += this.OBJtoXML(new Object(t[a][i]));
						e += "</" + a + ">"
					}
				} else if (typeof t[a] === "object") {
					e += this.OBJtoXML(new Object(t[a]))
				} else {
					e += t[a]
				}
				e += t[a] instanceof Array ? "" : "</" + a + ">"
			}
			var e = e.replace(/<\/?[0-9]{1,}>/g, "");
			return e
		}
	})
});