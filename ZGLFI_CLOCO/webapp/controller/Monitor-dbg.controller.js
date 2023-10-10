sap.ui.define([
	"FechamentoContabil/controller/BaseController",
	"sap/ui/model/json/JSONModel"
],
	function (BaseController, JSONModel) {
		"use strict";

		var playFLuxo;
		var atualizacaoAut = true;

		return BaseController.extend("FechamentoContabil.controller.Monitor", {

			onInit: function () {

				//this.addBrowserEvents();

				//		this.atualizaPagina(); IMPORTANTEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE

				// Icone SYNC deve ser exibido apenas para desktop
				/*			if (!sap.ui.Device.system.phone) {
								var imagePath = $.sap.getModulePath("FechamentoContabil", "/LogoEmpresas/");
								var logo = this.getView().byId("idLogo");
								logo.setSrc(imagePath + "CBA.png");
							}*/

				//			var oModelKey = sap.ui.getCore().getModel("key");

				this.attachPatternMatched('monitor');

				/*			if(novidadeChecado !== true)	
								setTimeout(function () {
									that.getDadosECC(false,false,false,false,false,false,false,true);
								}, 5000);*/

				this.createModel([],"topAtividadesAtrasadas");

			},

			addBrowserEvents: function () {
				if (!sap.ui.Device.system.phone) {
					this.byId("card_graficoAvanco").attachBrowserEvent("click", this.onPressGraficos, this);
					this.byId("card_graficoConcPlan").attachBrowserEvent("click", this.onPressGraficos, this);
					this.byId("card_graficoTOP5").attachBrowserEvent("click", this.onPressAtividades, this);
				}
			},

			atualizaPagina: function () {

				var that = this;

				setTimeout(function () {

					if (atualizacaoAut) {
						that.getDadosECC('atualizaDadosMonitor', true);
						sap.m.MessageToast.show("Dados atualizados");
					}
					that.atualizaPagina();
				}, 60000);
			},

			/*onPressSync: function(){
				this.getDadosECC('atualizaDadosMonitor');
				atualizacaoAut = true;
			},*/

			onConfigHierarquiaFluxo: function (oEvent) {
				var popupHierarquiaFluxo = this.getView().byId("idMenuHierarquiaFluxoGeral");
				popupHierarquiaFluxo.toggleStyleClass("menu__hierarquia__inativo");
			},

			setTOP5: function (top5) {

				this.getModel("topAtividadesAtrasadas").setProperty("/",top5.results);

				// var tooltip =
				// 	"Ranking de atividades com maior tempo (medido em horas) de atraso na conclusão. Atividades críticas para o fechamento, identificadas com sinal de exclamação, têm prioridade na exibição";
				// var hboxTOP5 = this.getView().byId("idVboxTOP5");
				// var that = this;
				// hboxTOP5.removeAllItems();
				// top5.results.forEach(function (item) {

				// 	var hboxTOP5items = new sap.m.HBox();
				// 	hboxTOP5items.setWidth("100%");
				// 	hboxTOP5items.setAlignItems(sap.m.FlexAlignItems.Center);
				// 	//hboxTOP5items.setHeight("100%");

				// 	var hboxTOP5itemText = new sap.m.HBox();
				// 	var labelText = new sap.m.Label();
				// 	//labelText.setWidth("90%");
				// 	labelText.setWrapping(true);
				// 	labelText.setText(item.Atividade);
				// 	labelText.setTooltip(tooltip);
				// 	labelText.addStyleClass("top5__label");

				// 	labelText.attachBrowserEvent("click", function () {
				// 		that._setPersistencia = true;
				// 		that.onPressAtividades(that);
				// 	});

				// 	hboxTOP5itemText.addItem(labelText);
				// 	hboxTOP5itemText.setJustifyContent(sap.m.FlexJustifyContent.Start);
				// 	hboxTOP5itemText.setWidth("80%");

				// 	var hboxTOP5itemValor = new sap.m.HBox();
				// 	hboxTOP5itemValor.setWidth("15%");
				// 	var labelValor = new sap.m.Label();
				// 	labelValor.setWidth("100%");
				// 	labelValor.setTooltip(tooltip);
				// 	labelValor.setText(item.Valor);
				// 	labelValor.addStyleClass("top5__label__valor");

				// 	labelValor.attachBrowserEvent("click", function () {
				// 		that._setPersistencia = true;
				// 		that.onPressAtividades(that);
				// 	});

				// 	hboxTOP5itemValor.addItem(labelValor);
				// 	hboxTOP5itemValor.setJustifyContent(sap.m.FlexJustifyContent.End);

				// 	if (item.Critico === "X") {
				// 		var hboxTOP5itemCritico = new sap.m.HBox();
				// 		hboxTOP5itemCritico.setJustifyContent(sap.m.FlexJustifyContent.Start);
				// 		hboxTOP5itemCritico.setAlignItems(sap.m.FlexAlignItems.Start);
				// 		hboxTOP5itemCritico.setWidth("5%");
				// 		var labelCritico = new sap.m.Label();
				// 		labelCritico.setWidth("17px");
				// 		labelCritico.setText("!");
				// 		labelCritico.addStyleClass("top5__critico");
				// 		labelCritico.setTextAlign("Center");
				// 		hboxTOP5itemCritico.addItem(labelCritico);
				// 	}

				// 	hboxTOP5items.addItem(hboxTOP5itemText);
				// 	hboxTOP5items.addItem(hboxTOP5itemValor);
				// 	hboxTOP5items.addItem(hboxTOP5itemCritico);
				// 	hboxTOP5items.addStyleClass("top5__items");

				// 	hboxTOP5.addItem(hboxTOP5items);
				// });
			},

			onPressAtividades: function (that) {

				if (sap.ui.Device.system.phone) {
					return;
				}

				if (that._setPersistencia) {
					//this.setDadosECC("setPersistenciaSelecao");
					that._setPersistencia = false;
				}

				atualizacaoAut = false;
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      ;
				oRouter.navTo("AtividadesAtrasadas", {
					profile: this.getView().byId("idInputModelo").getSelectedItem().getText(),
					instance: this.getView().byId("idInputPeriodo").getSelectedItem().getKey(),
				});
			},

			setFluxoProcesso: function (that, fluxoProcessos) {
				var tooltip = "Representa percentualmente quanto das tarefas já foram concluídas até o momento atual";
				var carousel = that.getView().byId("idCarousel");
				var index = 0;
				var indexTotal = fluxoProcessos.length;
				var hbox_graficos = new sap.m.HBox();
				var qtdeGrafico = 0;
				hbox_graficos.setJustifyContent(sap.m.FlexJustifyContent.SpaceAround);
				hbox_graficos.setAlignContent(sap.m.FlexJustifyContent.SpaceBetween);
				hbox_graficos.setWidth("100%");
				carousel.removeAllPages();
				fluxoProcessos.forEach(function (fluxo) {

					var vbox = new sap.m.VBox();
					index++;
					vbox.setAlignItems(sap.m.FlexAlignItems.Center);

					var label = new sap.m.Label();
					label.setText(fluxo.Texto);
					label.setTooltip(tooltip);
					label.setWidth("10em");
					label.setWrapping(true);
					label.setTextAlign(sap.ui.core.TextAlign.Center);
					label.addStyleClass("carousel__label sapUiSmallMarginTop");

					/*var grafico = new sap.suite.ui.microchart.RadialMicroChart();
					grafico.setPercentage(parseFloat(fluxo.Valor));
					grafico.setValueColor(sap.m.ValueColor.Good);
					grafico.setTooltip(tooltip);
					grafico.setSize(sap.m.Size.L);
					vbox.addItem(grafico);*/

					var htmlDiv = new sap.ui.core.HTML();
					htmlDiv.setContent(that.insereGrafico(parseFloat(fluxo.Valor)));

					vbox.addItem(htmlDiv);
					vbox.addItem(label);
					hbox_graficos.addItem(vbox);

					if (sap.ui.Device.system.phone)
						qtdeGrafico = 1;
					else
						qtdeGrafico = 4;
					if (index === qtdeGrafico || index === indexTotal) {
						var hbox_carousel = new sap.m.VBox();
						hbox_carousel.setJustifyContent(sap.m.FlexJustifyContent.Center);
						hbox_carousel.setAlignContent(sap.m.FlexJustifyContent.Center);
						hbox_carousel.setAlignItems(sap.m.FlexJustifyContent.Center);
						hbox_carousel.setWidth("100%");
						hbox_carousel.addItem(hbox_graficos);
						hbox_carousel.setBackgroundDesign("Solid");
						carousel.addPage(hbox_carousel);
						hbox_graficos = new sap.m.HBox();
						hbox_graficos.setJustifyContent(sap.m.FlexJustifyContent.SpaceAround);
						hbox_graficos.setAlignContent(sap.m.FlexJustifyContent.SpaceAround);
						hbox_graficos.setWidth("100%");
						indexTotal = indexTotal - index;
						index = 0;
					}
				});
			},

			insereGrafico: function (perc) {

				var innerHTML = "<div class=\"chart tarefas sapUiSmallMarginTop\">";
				innerHTML += "<div class=\"radio_chart tarefas p" + perc + "\"></div>";
				innerHTML += "<div class=\"cap\"></div>";
				innerHTML += "<div class=\"value\">" + perc + "%</div></div>";
				return innerHTML;
			},

			onConfigHierarquia: function (oEvent) {
				var popupHierarquia = this.getView().byId("idMenuHierarquia");
				popupHierarquia.toggleStyleClass("menu__hierarquia__inativo");
			},

			onConfigHierarquiaMobile: function (oEvent) {
				var popupHierarquia = this.getView().byId("idMenuHierarquia");
				popupHierarquia.toggleStyleClass("menu__hierarquia__inativo__mobile");
			},

			onConfigHierarquiaFluxoMobile: function (oEvent) {
				var popupHierarquiaFluxo = this.getView().byId("idMenuHierarquiaFluxoGeral");
				popupHierarquiaFluxo.toggleStyleClass("menu__hierarquia__inativo__mobile");
			},

			togglePlayFluxo: function (oEvent) {
				var iconPlayFluxo = this.getView().byId("idIconPlayFluxo");
				var that = this;
				var carouselFluxo;

				if (oEvent === null) {
					if (this.playFluxo) {
						carouselFluxo = this.getView().byId("idCarousel");
						carouselFluxo.next();
						setTimeout(function () {
							that.togglePlayFluxo(null);
						}, 5000);
					}
					return;
				}

				if (iconPlayFluxo.getSrc().indexOf("initiative") !== -1) {
					iconPlayFluxo.setSrc("sap-icon://stop");
					this.playFluxo = true;
					setTimeout(function () {
						carouselFluxo = that.getView().byId("idCarousel");
						carouselFluxo.next();
						that.togglePlayFluxo(null);
					}, 3000);
				} else {
					iconPlayFluxo.setSrc("sap-icon://initiative");
					this.playFluxo = false;
				}
			},

			onPressGraficos: function (oEvent, par2) {
				if (sap.ui.Device.system.phone) {
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("AtividadesMobile");
				} else {
					atualizacaoAut = false;
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("Atividades");
				}
			},

			incluirVideo: function (hboxVideos, video) {
				var oHtml = new sap.ui.core.HTML();
				var imagePath = $.sap.getModulePath("FechamentoContabil", "/Videos/");
				var video;

				switch (video) {
					case "1":
						video = "AcessoDesktop.mp4";
						break;
					case "2":

						break;
				}
				oHtml.setContent("<video width='640' height='360' controls> <source src=" + imagePath + video + " type='video/mp4'> </video>");
				hboxVideos.removeAllItems();
				hboxVideos.addItem(oHtml);
			},

			incluiEventoLabels: function () {
				var that = this;
				var labels = document.querySelectorAll(".popup__video__label");
				labels.forEach(function (label) {
					label.addEventListener("click", that.onClickLabelVideo);
				});
			},

			onClickLabelVideo: function (oEvent) {
				var hboxVideos = this.getView().byId("hboxVideos");
				this.incluirVideo(hboxVideos, oEvent.target.textContent);
			},

			onAfterRendering: function () {
				//	Inclui evento de click nos labels
				//	this.incluiEventoLabels();
			}
		});
	});