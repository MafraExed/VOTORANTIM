sap.ui.define([
	"ZCBMM_ACEITE_RESERVA/ZCBMM_ACEITE_RESERVA/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/m/Button',
	'sap/ui/model/Filter',
	'sap/m/Dialog',
	'sap/m/Text',
	"ZCBMM_ACEITE_RESERVA/ZCBMM_ACEITE_RESERVA/model/formatter"
], function(Controller, JSONModel, Button, Filter, Dialog, Text, formatter) {
	"use strict";

	return Controller.extend("ZCBMM_ACEITE_RESERVA.ZCBMM_ACEITE_RESERVA.controller.aceite", {

		onInit: function() {
			//var oViewModel = new JSONModel({
			// busy: false,
			// delay: 0
			//});

			this.getRouter().getRoute("aceite").attachPatternMatched(this._onObjectMatched, this);

			//this.setModel(oViewModel, "rotaView");

			//this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},
		_onObjectMatched: function(oEvent) {
			var Reserva = oEvent.getParameter("arguments").Reserva;
			var Item = oEvent.getParameter("arguments").Item;
			var StatusReserva = oEvent.getParameter("arguments").StatusReserva;
			var Eliminado = oEvent.getParameter("arguments").Eliminado;
			var RegFinal = oEvent.getParameter("arguments").RegFinal;
			var Material = oEvent.getParameter("arguments").Material;
			var Centro = oEvent.getParameter("arguments").Centro;
			var QtdNecessaria = oEvent.getParameter("arguments").QtdNecessaria;
			var QtdRetReserva = oEvent.getParameter("arguments").QtdRetReserva;
			var QtdAceite = QtdNecessaria - QtdRetReserva;
			var Nome = oEvent.getParameter("arguments").Nome;
			var Login = oEvent.getParameter("arguments").Login;
			
			this.getView().byId("idReserva").setValue(Reserva);
			this.getView().byId("idItem").setValue(Item);
			this.getView().byId("idStatusReserva").setValue(StatusReserva);
			this.getView().byId("idEliminado").setValue(Eliminado);
			this.getView().byId("idRegFinal").setValue(RegFinal);
			this.getView().byId("idMaterial").setValue(Material);
			this.getView().byId("idCentro").setValue(Centro);
			this.getView().byId("idQtdNecessaria").setValue(QtdNecessaria);
			this.getView().byId("idQtdRetReserva").setValue(QtdRetReserva);
			this.getView().byId("idLogin").setValue(Nome);
			this.getView().byId("idLogin1").setValue(Login);

			this.getView().byId("idQtdAceite").setValue(QtdAceite);
		},
		onSave: function(oEvent) {
			var oModel = this.getView().getModel();
			var key = "";
			var oParameters = {};
			var este = this;

			oParameters.Reserva = this.getView().byId("idReserva").getValue();
			oParameters.Item = this.getView().byId("idItem").getValue();
			oParameters.StatusReserva = this.getView().byId("idStatusReserva").getValue();
			oParameters.Eliminado = this.getView().byId("idEliminado").getValue();
			oParameters.RegFinal = this.getView().byId("idRegFinal").getValue();
			oParameters.Material = this.getView().byId("idMaterial").getValue();
			oParameters.Centro = this.getView().byId("idCentro").getValue();
			oParameters.QtdNecessaria = this.getView().byId("idQtdNecessaria").getValue();
			oParameters.QtdRetReserva = this.getView().byId("idQtdRetReserva").getValue();
			oParameters.QtdAceite = this.getView().byId("idQtdAceite").getValue();
			oParameters.Nome = this.getView().byId("idLogin").getValue();
			oParameters.Login = this.getView().byId("idLogin1").getValue();

			var qtd_limite = oParameters.QtdNecessaria - oParameters.QtdRetReserva;
			if (qtd_limite < oParameters.QtdAceite) {
				sap.m.MessageBox.show("Valor superior ao limite");
				return;
			};
			var sName = sap.ushell.Container.getUser().getFullName();
			oParameters.Nome = sName;
			// // oParameters.Parametro = oParameters.Parametro.replace(/ /g, "%20");
			// // oParameters.Valor = oParameters.Valor.replace(/ /g, "%20");

			// var Datahoje = new Date();
			// var dia_sem = Datahoje.getDay(); // 0-6 (zero=domingo)
			// var dia = "";
			// if (dia_sem < 9) {
			// 	dia = dia.concat("0", dia_sem);
			// } else if (dia_sem == 9) {
			// 	dia_sem = dia_sem + 1;
			// 	dia = String(dia_sem);
			// } else {
			// 	dia = String(dia_sem);
			// }

			// var mes_ano = Datahoje.getMonth() + 1; // 0-11 (zero=janeiro)
			// var mes = "";
			// if (mes_ano < 9) {
			// 	mes = mes.concat("0", mes_ano);
			// } else if (mes_ano == 9) {
			// 	mes_ano = mes_ano + 1;
			// 	mes = String(mes_ano);
			// } else {
			// 	mes = String(mes_ano);
			// }

			// var ano4 = Datahoje.getFullYear(); // 4 dígitos
			// ano4 = String(ano4);
			// var datahoje = "";
			// datahoje = datahoje.concat(ano4, mes, dia);

			// oParameters.Data = datahoje;

			// // var list = this.getView().byId("list").getModel();
			// // var dtini = this.getView().byId("IdDtInic").getText();
			// // var dataconv = dtini.substring(0, 4) + dtini.substring(5, 7) + dtini.substring(8, 10);
			// // dataconv = parseInt(dataconv);

			// // if (datahoje > dataconv) {
			// //  this.getView().byId("idRota").setHighlight("Error");
			// // }

			// var hora_atual = new Date();
			// var hora = hora_atual.getHours(); // 

			if (!oParameters.QtdAceite) {
				sap.m.MessageBox.show("Campos obrigatórios não podem estar em branco");
				return;
			}

			key = "/ZET_CBMM_CF_ACEITESet(Reserva='" + oParameters.Reserva + "',Item='" + oParameters.Item + "')";

			oModel.update(key, oParameters, {
				success: function(oData, oResponse) {
					sap.m.MessageBox.success("Parâmetro inserido", {
						actions: ["OK", sap.m.MessageBox.Action.CLOSE],
						onClose: function(sAction) {
							este.getView().byId("idQtdAceite").setValue(null);
							este.getRouter().navTo("Back");
						}

					});
				},

				error: function(e) {
					sap.m.MessageBox.error("Não foi possível gravar registros");
				}
			});
		},
		onBack: function(oEvent) {
			this.getRouter().navTo("Back");
		},
	});

});