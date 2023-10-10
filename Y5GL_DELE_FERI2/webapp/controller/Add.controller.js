sap.ui.define(["Y5GL_DELE_FERI2/Y5GL_DELE_FERI2/controller/BaseController", "sap/ui/model/json/JSONModel",
	"Y5GL_DELE_FERI2/Y5GL_DELE_FERI2/model/formatter", "sap/m/Dialog", "sap/m/Button", "sap/m/Text"
], function (e, t, s, i, a, o) {
	"use strict";
	return e.extend("Y5GL_DELE_FERI2.Y5GL_DELE_FERI2.controller.Add", {
		formatter: s,
		onInit: function () {
			this.getRouter().getRoute("Add").attachPatternMatched(this._onAdd, this)
		},
		_onAdd: function () {
			var e = new sap.ui.model.json.JSONModel;
			var t = "/sap/opu/odata/sap/ZGWVCHR_LIST_DEPENDENTES_SRV/ZET_GLHR_LIST_DEPENDENTESSet(Pernr='-',Subty='-',Objps='-',Tipo='-')";
			e.loadData(t, null, false, "GET", false, false, null);
			var s = e.oData.d.Pernr;
			var i = e.oData.d.Subty;
			var a = e.oData.d.Objps;
			this.getView().byId("IdPernr").setValue(s);
			this.getView().byId("IdSubty").setValue(i);
			this.getView().byId("IdObjps").setValue(a);
			this.getView().byId("IdonAddDoc").setVisible(true);
			this.getView().byId("IdonEnviar").setVisible(true);
			this.getView().byId("IdonDoc").setVisible(false);
			this.getView().byId("IdonVoltar").setVisible(false);
			this.getView().byId("IdMsg").setVisible(false);
			this.getView().byId("IdParentesco").setValue();
			this.getView().byId("IdFavor").setValue();
			this.getView().byId("IdFanam").setValue();
			this.getView().byId("IdFgbdt").setValue();
			this.getView().byId("IdSexo").setValue();
			this.getView().byId("IdZzestciv").setValue()
		},
		onEnviar: function () {
			var e = this.getOwnerComponent();
			var t = e.oListSelector._oList;
			var s = t.getBinding("items");
			var d = this.getView().getModel();
			var n = this.getView().byId("IdPernr").getValue();
			var r = this.getView().byId("IdSubty").getValue();
			var l = this.getView().byId("IdObjps").getValue();
			var g = "/ZET_GLHR_LIST_DEPENDENTESSet(Pernr='" + n + "',Subty='" + r + "',Objps='" + l + "',Tipo='U')";
			var u = {};
			u.Parentesco = this.getView().byId("IdParentesco").getSelectedKey();
			u.Favor = this.getView().byId("IdFavor").getValue();
			u.Fanam = this.getView().byId("IdFanam").getValue();
			u.Fgbdt = this.getView().byId("IdFgbdt").getValue();
			while (u.Fgbdt.indexOf("-") != -1) u.Fgbdt = u.Fgbdt.replace("-", "");
			u.Sexo = this.getView().byId("IdSexo").getSelectedKey();
			u.Zzestciv = this.getView().byId("IdZzestciv").getSelectedKey();
			var I = new i({
				title: "Confirmação",
				type: "Message",
				content: new o({
					text: "Confirma o envio do novo dependente para aprovação?"
				}),
				beginButton: new a({
					text: "Sim",
					press: function () {
						d.update(g, u, {
							success: function (e, t) {
								sap.m.MessageBox.success("Dependente enviado para aprovação com sucesso.", {
									actions: ["OK", sap.m.MessageBox.Action.CLOSE],
									onClose: function (e) {
										I.close()
									}
								})
							},
							error: function (e) {
								sap.m.MessageBox.error("Erro ao chamar o serviço")
							}
						});
						I.close()
					}
				}),
				endButton: new a({
					text: "Não",
					press: function () {
						I.close()
					}
				}),
				afterClose: function () {
					I.destroy();
					s.refresh(true);
					this.getModel("appView").setProperty("/layout", "MidColumnFullScreen")
				}
			});
			I.open()
		}
	})
});