sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/m/library", "sap/ui/Device"], function (e, t,
	i, a, o) {
	"use strict";
	var r = a.URLHelper;
	return e.extend("Y5GL_RECIBOS2.Y5GL_RECIBOS2.controller.Detail", {
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
			t.open()
		},
		_onObjectMatched: function (e) {
			var t = e.getParameter("arguments").Zparam;
			var i = e.getParameter("arguments").Zdesc;
			while (i.indexOf("_") != -1) {
				i = i.replace("_", "/")
			}
			this.getView().byId("idTitleRecibos").setText(i);
			this.getView().byId("SALARIO").setVisible(false);
			this.getView().byId("ADIANTAMENTO_15").setVisible(false);
			this.getView().byId("FERIAS").setVisible(false);
			this.getView().byId("INFORME_RENDIMENTO").setVisible(false);
			this.getView().byId("PGTO_MENSAL").setVisible(false);
			this.getView().byId("PPRV").setVisible(false);
			this.getView().byId("PRV").setVisible(false);
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
			var e = this.getView().byId("idTitleRecibos").getText();
			var t;
			var i;
			var a;
			var r = !o.system.phone;
			var s;
			var d;
			var n;
			i = "Pagto_Mensal";
			switch (e) {
			case "ADIANTAMENTO QUINZENAL":
				t = "A";
				a = this.getView().byId("IdPeriodo_ADMTO_15").getSelectedKey();
				s = "0";
				break;
			case "FÉRIAS":
				t = "B";
				s = "0";
				a = this.getView().byId("IdPeriodoFERIAS").getSelectedKey();
				break;
			case "INFORME DE RENDIMENTOS":
				t = "C";
				s = "0";
				a = this.getView().byId("IdPeriodoINFORME_RENDIMENTO").getSelectedKey();
				break;
			case "PAGAMENTO MENSAL":
				t = "D";
				s = "0";
				a = this.getView().byId("IdPeriodoPGTO_MENSAL").getSelectedKey();
				break;
			case "PPR/RV":
				t = "E";
				a = this.getView().byId("IdPeriodo_PPRV").getSelectedKey();
				d = this.getView().byId("idAdiantamento_PPRV").getSelected();
				n = this.getView().byId("idPagamento_PPRV").getSelected();
				break;
			case "13º SALÁRIO":
				t = "G";
				a = this.getView().byId("IdPeriodo_SALARIO").getSelectedKey();
				d = this.getView().byId("idAdiantamento_SALARIO").getSelected();
				n = this.getView().byId("idPagamento_SALARIO").getSelected();
				break
			}
			if (a === "") {
				sap.m.MessageBox.error("Verifique os parametros informados");
				return
			}
			if (d === true) {
				s = "A"
			}
			if (n === true) {
				s = "P"
			}
			if (e === "INFORME DE RENDIMENTOS") {
				this.onImprime(a, s, t);
				return
			}
			this.getRouter().navTo(i, {
				Periodo: a,
				Tipo: t,
				Check: s
			}, r)
		},
		onImprime: function (e, t, i) {
			var a = "/sap/opu/odata/sap/ZGWGLRH_MEU_CADASTRO_SRV/ZET_GLHR_UPFILESet('0$-$-$" + e + "$" + t + "$" + i + "')/$value";
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
				break
			}
			var s = new sap.ui.model.Filter("ITipo", sap.ui.model.FilterOperator.EQ, r);
			o.getBinding("items").filter([s])
		}
	})
});