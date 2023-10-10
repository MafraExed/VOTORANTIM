sap.ui.define(["./BaseController"], function (e) {
	"use strict";
	var t;
	var a;
	var i;
	return e.extend("Y5GL_RECIBOS4.Y5GL_RECIBOS4.controller.Pagto_Mensal", {
		onInit: function () {
			var e = jQuery.sap.getModulePath("Y5GL_RECIBOS4.Y5GL_RECIBOS4");
			var t = e + "/image/Transparente_CBA.gif";
			this.getView().byId("idimg").setSrc(t);
			this.getRouter().getRoute("Pagto_Mensal").attachPatternMatched(this._onObjectMatched, this);
		},
		onVoltar: function () {
			this.getRouter().navTo("master");
		},
		carrega: function () {
			var pernr = "";
			this.getModel().metadataLoaded().then(function () {
				var e = this.getModel().createKey("ZET_GLHR_HTML5_DETAILSet", {
					Periodo: t,
					Tipo: a,
					Check: i,
					Pernr: pernr
				});
				this._bindView("/" + e);
			}.bind(this));
		},
		_onObjectMatched: function (e) {
			this.buscaImagem();
			var n = this.getView().byId("html");
			var o = n.getContent();
			a = e.getParameter("arguments").Tipo;
			i = e.getParameter("arguments").Check;
			t = e.getParameter("arguments").Periodo;
			var r = jQuery.sap.getModulePath("Y5GL_RECIBOS4.Y5GL_RECIBOS4");
			var s = r + "/image/Cba_aluminio_logo.png";
			var g;
			var d;
			//this.getView().byId("idLogo").setSrc(s);
			switch (a) {
			case "A":
				g = r + "/image/adiantamentoquinzenal.png";
				d = "Adiantamento Quinzenal";
				break;
			case "B":
				g = r + "/image/ferias.png";
				d = "Recibo de Férias";
				break;
			case "D":
				g = r + "/image/demonstrativopagamento.png";
				d = "Demonstrativo de pagamento";
				break;
			case "E":
				g = r + "/image/pprv.png";
				d = "Recibo PPR/RV";
				break;
			case "F":
				g = r + "/image/prv.png";
				d = "PRV";
				break;
			case "G":
				g = r + "/image/13salario.png";
				d = "Recibo 13° salário";
				break;
			}
			this.getView().byId("idTitleRecibos").setText(d);
			if (o !== "") {
				n.setContent("");
				this.carrega();
			} else {
				this.carrega();
			}
		},
		_bindView: function (e) {
			var t = this;
			var a = this.getView().getModel();
			a.setProperty("/busy", false);
			this.getView().bindElement({
				path: e,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						t.loading(true);
					},
					dataReceived: function () {
						t.loading(false);
					}
				}
			});
		},
		_onBindingChange: function () {
			var e = this.getView(),
				t = e.getElementBinding();
			if (!t.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				return;
			}
		},
		AfterUpdate: function (e) {
			var t = this.getView().byId("table").getBinding("rows").getLength();
			if (t > 0) {
				this.getView().byId("table").setVisibleRowCount(t)
			} else {
				this.getView().byId("table").setVisibleRowCount(1)
			}
		},
		onBackMaster: function () {
			this.getRouter().navTo("master")
		},
		onbeforeRebindTable: function (e) {
			if (t !== undefined) {
				e.getParameter("bindingParams").filters.push(new sap.ui.model.Filter({
					path: "Periodo",
					operator: "EQ",
					value1: t
				}));
			}
		},
		onImprime: function () {
			var e = "/sap/opu/odata/sap/ZGWGLRH_MEU_CADASTRO_SRV/ZET_GLHR_UPFILESet('0$-$-$" + t + "$" + i + "$" + a + "')/$value";
			var n = document.createElement("a");
			n.href = e;
			n.target = "_blank";
			n.style.display = "none";
			document.body.appendChild(n);
			n.click();
			document.body.removeChild(n)
		}
	})
});