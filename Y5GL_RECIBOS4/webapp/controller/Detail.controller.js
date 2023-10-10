sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/m/library", "sap/ui/Device"], function (e, t,
	i, a, o) {
	"use strict";
	var r = a.URLHelper;
	return e.extend("Y5GL_RECIBOS4.Y5GL_RECIBOS4.controller.Detail", {
		formatter: i,
		onInit: function () {
			var e = new t({
				busy: false,
				delay: 0
			});
			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			this.setModel(e, "detailView");
			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this))
		},
		onSendEmailPress: function () {
			var e = this.getModel("detailView");
			r.triggerEmail(null, e.getProperty("/shareSendEmailSubject"), e.getProperty("/shareSendEmailMessage"))
		},
		onShareInJamPress: function () {
			var e = this.getModel("detailView"),
				t = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: e.getProperty("/shareOnJamTitle")
						}
					}
				});
			t.open();
		},
		_onObjectMatched: function (e) {
			var t = e.getParameter("arguments").Zparam;
			var i = e.getParameter("arguments").Zdesc;
			while (i.indexOf("_") != -1) {
				i = i.replace("_", "/")
			}
			this.getView().byId("idTitleRecibos").setText(i);
			this.getView().byId("RETENCIONES_AFP").setVisible(false);
			this.getView().byId("RETENCIONES_ONP").setVisible(false);
			this.getView().byId("CERT_PART_UTILIDADE").setVisible(false);
			this.getView().byId("CONSTANCIA_CTS").setVisible(false);
			this.getView().byId("BOLETA_GRATIFICA").setVisible(false);
			this.getView().byId("BOLETA_PAGTO").setVisible(false);
			this.getView().byId("CERT_RENTA_QUINTA").setVisible(false);
			this.getView().byId(t).setVisible(true)
		},
		onBackMaster: function () {
			this.getRouter().navTo("master")
		},
		onVoltar: function () {
			this.getRouter().navTo("master")
		},
		_bindView: function (e) {
			var t = this.getModel("detailView");
			t.setProperty("/busy", false);
			this.getView().bindElement({
				path: e,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						t.setProperty("/busy", true)
					},
					dataReceived: function () {
						t.setProperty("/busy", false)
					}
				}
			})
		},
		_onBindingChange: function () {
			var e = this.getView(),
				t = e.getElementBinding();
			if (!t.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return
			}
			var i = t.getPath(),
				a = this.getResourceBundle(),
				o = e.getModel().getObject(i),
				r = o.Programm,
				s = o.Zparam,
				d = o.Zdesc,
				n = this.getModel("detailView");
			this.getOwnerComponent().oListSelector.selectAListItem(i);
			n.setProperty("/saveAsTileTitle", a.getText("shareSaveTileAppTitle", [d]));
			n.setProperty("/shareOnJamTitle", s);
			n.setProperty("/shareSendEmailSubject", a.getText("shareSendEmailObjectSubject", [r]));
			n.setProperty("/shareSendEmailMessage", a.getText("shareSendEmailObjectMessage", [s, r, location.href]));
			var l = this.getView().byId("IdPeriodo_SALARIO");
			var g = this.getView().byId("IdPeriodo_PPRV");
			var c = this.getView().byId("IdPeriodo_PRV");
			var h = new sap.ui.model.Filter("ITipo", sap.ui.model.FilterOperator.EQ, "A");
			l.getBinding("items").filter([h]);
			g.getBinding("items").filter([h]);
			c.getBinding("items").filter([h])
		},
		_onMetadataLoaded: function () {
			var e = this.getView().getBusyIndicatorDelay(),
				t = this.getModel("detailView");
			t.setProperty("/delay", 0);
			t.setProperty("/busy", true);
			t.setProperty("/delay", e)
		},
		onCloseDetailPress: function () {
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			this.getOwnerComponent().oListSelector.clearMasterListSelection();
			this.getRouter().navTo("master")
		},
		toggleFullScreen: function () {
			var e = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !e);
			if (!e) {
				this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
				this.getModel("appView").setProperty("/layout", "MidColumnFullScreen")
			} else {
				this.getModel("appView").setProperty("/layout", this.getModel("appView").getProperty("/previousLayout"))
			}
		},
		onSave: function () {
			var tituloRecibo = this.getView().byId("idTitleRecibos").getText();
			var tipoRecibo;
			var rota;
			var periodo;
			var r = !o.system.phone;
			var s;
			var d;
			var n;
			var empresa;
			rota = "Pagto_Mensal";

			switch (tituloRecibo) {
			case "Boleta de Pago de sueldos":
				tipoRecibo = "I";
				periodo = this.getView().byId("IdPeriodo_BOLETA_PAGTO").getSelectedKey();
				s = "0";
				break;
			case "Certificado de La Renta Quinta":
				tipoRecibo = "J";
				s = "0";
				periodo = this.getView().byId("IdPeriodo_CERT_RENTA_QUINTA").getSelectedKey();
				break;
			case "Certificado de Retenciones AFP":
				tipoRecibo = "K";
				s = "0";
				periodo = this.getView().byId("IdPeriodo_RETENCIONES_AFP").getSelectedKey();
				//empresa = this.getView().byId("idComboEmpresa").getSelectedKey();
				break;
			case "Certificado Retenciones ONP":
				tipoRecibo = "L";
				s = "0";
				periodo = this.getView().byId("IdPeriodo_RETENCIONES_ONP").getSelectedKey();
				break;
			case "Cert. Participación de Utili.":
				tipoRecibo = "M";
				periodo = this.getView().byId("IdPeriodoCERT_PART_UTILIDADE").getSelectedKey();
				s = "0";
				break;
			case "Constancia CTS":
				tipoRecibo = "N";
				periodo = this.getView().byId("IdPeriodoCONSTANCIA_CTS").getSelectedKey();
				s = "0";
				break;
			case "Boleta de Gratificación":
				tipoRecibo = "O";
				periodo = this.getView().byId("IdPeriodoBOLETA_GRATIFICA").getSelectedKey();
				s = "0";
				break;
			}
			// if (a === "") {
			// 	sap.m.MessageBox.error("Verifique os parametros informados");
			// 	return;
			// }
			if (d === true) {
				s = "A";
			}
			if (n === true) {
				s = "P";
			}
			// if (tituloRecibo === "INFORME DE RENDIMENTOS") {
				if (!periodo) {
					sap.m.MessageBox.error("Informe o periodo a ser impresso");
					return;
				}
				
			// 	if (!empresa){
			// 		sap.m.MessageBox.error("Informe a empresa a ser considerada na impressão");
			// 		return;
			// 	}
				this.onImprime(periodo, s, tipoRecibo, empresa);
				return;
			// }
			// this.getRouter().navTo(rota, {
			// 	Periodo: periodo,
			// 	Tipo: tipoRecibo,
			// 	Check: s
			// }, r);
		},

		onImprime: function (periodo, t, tipoRecibo, empresa) {
			var a = "/sap/opu/odata/sap/ZGWGLRH_MEU_CADASTRO_SRV/ZET_GLHR_UPFILESet('0$-$-$" + periodo + "$" + t + "$" + tipoRecibo +
				"$-$-$-$-$0$-$-$-$" + empresa + "')/$value";
			var o = document.createElement("a");
			o.href = a;
			o.target = "_blank";
			o.style.display = "none";
			document.body.appendChild(o);
			o.click();
			document.body.removeChild(o)
		},
		onSelect: function (e) {
			var t = e.getParameter("id");
			var i = t.split("detail--");
			var a = i[1];
			var o;
			var r;
			switch (a) {
			case "idAdiantamento_SALARIO":
				o = this.getView().byId("IdPeriodo_SALARIO");
				r = "A";
				break;
			case "idPagamento_SALARIO":
				o = this.getView().byId("IdPeriodo_SALARIO");
				r = "P";
				break;
			case "idAdiantamento_PPRV":
				o = this.getView().byId("IdPeriodo_PPRV");
				r = "A";
				break;
			case "idPagamento_PPRV":
				o = this.getView().byId("IdPeriodo_PPRV");
				r = "P";
				break;
			case "idAdiantamento_PRV":
				o = this.getView().byId("IdPeriodo_SALARIO");
				r = "A";
				break;
			case "idPagamento_PRV":
				o = this.getView().byId("IdPeriodo_PPRV");
				r = "P";
				break;
			}
			var s = new sap.ui.model.Filter("ITipo", sap.ui.model.FilterOperator.EQ, r);
			o.getBinding("items").filter([s]);
		},

		OnchangePeriodo: function () {
			var Periodo = this.getView().byId("IdPeriodoINFORME_RENDIMENTO").getSelectedKey();
			var oListEmpresa = this.getView().byId("idComboEmpresa").getBinding("items");
			var oFilterPeriodo = new sap.ui.model.Filter("Ano", sap.ui.model.FilterOperator.EQ, Periodo);
			oListEmpresa.filter([oFilterPeriodo]);

			this.getView().byId("FormContainer1_Empresa").setVisible(true);

		}
	});
});