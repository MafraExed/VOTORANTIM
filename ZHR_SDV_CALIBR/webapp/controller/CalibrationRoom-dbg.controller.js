sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/ui/thirdparty/jqueryui/jquery-ui-draggable",
	"sap/ui/thirdparty/jqueryui/jquery-ui-droppable",
	"../lib/imageMapster", "sap/ui/core/Fragment"
], function (Controller, JQueryDraggable, JQueryDroppable, Mapster, Fragment) {
	"use strict";

	return Controller.extend("cba.hr.sdvCalibracaoSF.controller.CalibrationRoom", {

		/***************************************************************************
			onInit
	    ****************************************************************************/
		onInit: function () {
			var that = this;

			this.setLandingModel();
			this.setParticipantsContainer();

			this.getOwnerComponent().getService("ShellUIService").then(function (oShellService) {
				oShellService.setBackNavigation(function () {
					that.backHome();
				});
			});

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("TargetCalibrationRoom").attachMatched(this.onRouteMatched, this);
		},

		/***************************************************************************
			getI18n
	    ****************************************************************************/
		getI18nText: function (text) {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(text);
		},

		/***************************************************************************
			setParticipantsContainer
	    ****************************************************************************/
		setParticipantsContainer: function () {
			this._calibrationRoomParticipants = this.getView().byId("calibrationRoomParticipants");
			this._calibrationRoomParticipantsPending = this.getView().byId("calibrationRoomParticipantsPending");
			this._calibrationRoomParticipantsPendingBox = this.getView().byId("calibrationRoomParticipantsPendingBox");
		},

		/***************************************************************************
			onRouteMatched
	    ****************************************************************************/
		setPendingVisibility: function () {
			var oItems = this._calibrationRoomParticipantsPending.getItems();
			if (!oItems.length) {
				var oText = new sap.m.Text();
				oText.setText(this.getI18nText("NoParticipants"));
				this._calibrationRoomParticipantsPending.addItem(oText);
			}
		},

		/***************************************************************************
			onRouteMatched
	    ****************************************************************************/
		onRouteMatched: function (oEvent) {

			var oArgs = oEvent.getParameter("arguments");
			var sessionId = oArgs.calibrationSessionId;
			var ownerId = oArgs.calibrationOwnerId;
			var oModel = this.getOwnerComponent().getModel("SFactors");

			this.setPageTitle(oModel, sessionId);
			this._sessionId = sessionId;
			this.setUniqueId();
			this.getCalibrationSessionParticipants(oModel, sessionId, ownerId);
		},

		/***************************************************************************
			setPageTitle
	    ****************************************************************************/
		setPageTitle: function (oModel, sessionId) {
			var calibrationRoomPage = this.getView().byId("calibrationRoomPage");
			var aFilters = [];

			calibrationRoomPage.setTitle("");
			calibrationRoomPage._headerTitle.removeStyleClass("pageTitle");

			aFilters.push(new sap.ui.model.Filter("sessionId", "EQ", sessionId));

			oModel.read("/CalibrationSession", {
				urlParameters: {
					"$select": "sessionName"
				},
				filters: aFilters,
				success: function (oData) {
					var sPageTitle = oData.results[0].sessionName;
					if (sPageTitle) {
						calibrationRoomPage.setTitle(sPageTitle.toUpperCase());
						calibrationRoomPage._headerTitle.addStyleClass("pageTitle");
					}
				}
			});
		},

		/***************************************************************************
			setUniqueId
	    ****************************************************************************/
		setUniqueId: function () {
			this._uniqueId = Math.floor(+new Date() / 1000);
		},

		/***************************************************************************
			getCalibrationSessionParticipants
	    ****************************************************************************/
		getCalibrationSessionParticipants: function (oModel, sessionId, ownerId) {

			var that = this;

			this._calibrationRoomParticipants.removeAllItems();
			this._calibrationRoomParticipantsPending.removeAllItems();
			sap.ui.core.BusyIndicator.show(0);

			var aSFilters = [];

			aSFilters.push(new sap.ui.model.Filter("sessionId", "EQ", sessionId));
			aSFilters.push(new sap.ui.model.Filter("ownerId", "EQ", ownerId));

			oModel.read("/CalibrationSession", {
				urlParameters: {
					"$select": "userId,firstName,lastName,defaultFullName,jobCode,jobYears,age"
				},
				filters: aSFilters,
				success: function (oData) {

					var aParticipantes = oData.results;
					var aFilters = [];
					var aElements = [];

					that.setVelocimetroMap();

					for (var i = 0; i < aParticipantes.length; i++) {
						var oItem = aParticipantes[i];
						var oId = oItem.userId;
						var oParticipante = new sap.ui.core.HTML({
							id: that.createUniqueId(oId),
							content: '<div id="' + that.createUniqueId(oId) + '" class="w3-tag" >' + oItem.firstName + " " + oItem.lastName.trim().split(
									" ").slice(-1) +
								"</di>"
						});

						that._calibrationRoomParticipants.addItem(oParticipante);
						aFilters.push(new sap.ui.model.Filter("userId", "EQ", oId));
						aElements.push(oId);
					}

					that.getBackgroundCalibration(aElements, aFilters, aParticipantes);
				},
				error: function (e) {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageBox.error(JSON.parse(e.responseText).error.message.value, {
						onClose: function () {
							that.backHome();
						}
					});
				}
			});
		},

		/***************************************************************************
			getBackgroundCalibration
	    ****************************************************************************/
		getBackgroundCalibration: function (aElements, aFilters, aParticipantes) {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("SFactors");
			var positionMap = this.getAvaliablePosition();

			var oFinally = function () {
				for (var i = 0; i < aElements.length; i++) {
					that.addParticipant(aElements[i], positionMap.NOCALIB, aParticipantes);
				}

				that.setPendingVisibility();
				sap.ui.core.BusyIndicator.hide();
			};

			if (aFilters.length) {
				oModel.read("/BackgroundCalibration", {
					urlParameters: {
						"$select": "userId,resultado_pre_cultura,resultado_pre_desempenho,ano_pre,pos"
					},
					filters: aFilters,
					success: function (oData) {

						for (var i = 0; i < oData.results.length; i++) {
							var oResult = oData.results[i];
							var sMapArea = that.getMapArea(oResult.resultado_pre_cultura, oResult.resultado_pre_desempenho);

							for (var c = 0; c < aElements.length; c++) {
								if (aElements[c] === oResult.userId) {
									var isPos = that.isPos(oResult.pos);
									that.addParticipant(aElements.splice(c, 1)[0], positionMap[sMapArea], aParticipantes, isPos);
									break;
								}
							}
						}

						oFinally();

					},
					error: function (e) {
						sap.m.MessageToast.show(JSON.parse(e.responseText).error.message.value);
						oFinally();
					}

				});
			}

		},

		/***************************************************************************
			getMapArea
	    ****************************************************************************/
		getMapArea: function (nCultura, nDesempenho) {
			var oMapCultura = this.getLandingModel().getData().eixoCultura;
			var oMapDesempenho = this.getLandingModel().getData().eixoDesempenho;
			var sMapArea = oMapCultura[nCultura];

			if (sMapArea) {
				sMapArea = sMapArea + oMapDesempenho[nDesempenho];
			}

			if (!sMapArea) {
				//Sem calibração
				sMapArea = "NOCALIB";
			}

			return sMapArea;
		},

		/***************************************************************************
			setVelocimetroMap
	    ****************************************************************************/
		setVelocimetroMap: function () {
			var that = this;
			var sVelocimetroId = this.createId("imgVelocimetro");
			var oVelocimetro = $("#" + sVelocimetroId);

			$("body").droppable({
				drop: function (e, ui) {
					var landing = oVelocimetro.mapster("highlight");

					if (!landing) {
						that.returnToPosition(ui);
					}
					that._originalPosition = undefined;
				}
			});

			oVelocimetro.mapster({
				mapKey: "alt",
				fillOpacity: 0.2,
				fillColor: "ff0000",
				isSelectable: false,
				onConfigured: function () {
					oVelocimetro.siblings().css("z-index", 0);
					oVelocimetro.css("z-index", 10);
				}
			});

			oVelocimetro.droppable({
				drop: function (e, ui) {
					var landing = oVelocimetro.mapster("highlight");
					$(ui.draggable).css("z-index", 20);

					if (landing) {
						var sId = that.getUniqueId(ui.draggable.context.id);
						that.gravaCalibracao(sId, landing, $(ui.draggable));
					}
				}
			});
		},

		/***************************************************************************
			gravaCalibracao
	    ****************************************************************************/
		gravaCalibracao: function (sId, landing, element) {

			var oLandindValues = this.getLandingValues(landing);
			var oModel = this.getOwnerComponent().getModel("SFactors", {
				refreshAfterChange: false
			});

			var aColors = {
				success: "#4CC417",
				error: "#F75D59",
				warning: "#FFDB58"
			};

			element.css("color", aColors.warning);

			oModel.create("/BackgroundCalibration", {
				userId: sId,
				resultado_pre_desempenho: oLandindValues.desempenho,
				resultado_pre_cultura: oLandindValues.cultura,
				ano_pre: this.thisYear()

			}, {
				success: function () {
					element.css("color", aColors.success);
				},
				error: function (e) {
					element.css("color", aColors.error);
					sap.m.MessageBox.error(JSON.parse(e.responseText).error.message.value);
				}
			});

		},

		/***************************************************************************
			thisYear
		****************************************************************************/
		thisYear: function () {
			return new Date().getFullYear().toString();
		},

		/***************************************************************************
			isPos
		****************************************************************************/
		isPos: function (pos) {
			return pos === "X";
		},

		/***************************************************************************
			onSalvarComentarioPress
	    ****************************************************************************/
		onSalvarComentarioPress: function () {
			var that = this;
			var oComentario = sap.ui.getCore().byId("participantInfoTextComment");
			var oModel = this.getOwnerComponent().getModel("SFactors", {
				refreshAfterChange: false
			});

			this.dialogBusyStart(1);

			oModel.create("/BackgroundComments", {
				userId: this._participantId,
				results_relevants: oComentario.getValue(),
				calibrationCommentsYear: this.convertCommentYear(new Date().getFullYear()).toString()

			}, {
				success: function () {
					that.dialogBusyEnd(false);
					sap.m.MessageBox.success(that.getI18nText("Success"));
					that.onCloseParticipantInfo();

				},
				error: function (e) {
					that.dialogBusyEnd(false);
					sap.m.MessageBox.error(JSON.parse(e.responseText).error.message.value);
				}
			});
		},

		/***************************************************************************
			convertCommentYear
	    ****************************************************************************/
		convertCommentYear: function (year) {
			return year - 1579;
		},

		/***************************************************************************
			getLandingValues
	    ****************************************************************************/
		getLandingValues: function (landing) {
			var oModel = this.getLandingModel();
			return oModel.getData().landingValues[landing];
		},

		/***************************************************************************
			setLandingModel
	    ****************************************************************************/
		setLandingModel: function () {

			var systemId = this.getSystemId();

			var oCaminhoJson = $.sap.getModulePath("cba.hr.sdvCalibracaoSF", "/model/eixoCalibracao/" + systemId + ".json");
			this._landingModel = new sap.ui.model.json.JSONModel();
			this._landingModel.loadData(oCaminhoJson, false);
		},

		/***************************************************************************
			getLandingModel
	    ****************************************************************************/
		getLandingModel: function () {
			return this._landingModel;
		},

		/***************************************************************************
			getSystemId
	    ****************************************************************************/
		getSystemId: function () {
			var oUserModel = new sap.ui.model.json.JSONModel();
			oUserModel.loadData("/sap/bc/ui2/start_up?", "", false);
			return oUserModel.getData().system;
		},

		/***************************************************************************
			returnToPosition
	    ****************************************************************************/
		returnToPosition: function (ui) {
			var element = ui.draggable[0];
			element.animate({
				left: this._originalPosition.left + "px",
				top: this._originalPosition.top + "px"
			}, 100);

			element.style.left = this._originalPosition.left + "px";
			element.style.top = this._originalPosition.top + "px";
		},

		/***************************************************************************
			showParticipantInfo
	    ****************************************************************************/
		showParticipantInfo: function (sId, aParticipante) {

			sap.ui.core.BusyIndicator.show(0);
			var oModel = this.getOwnerComponent().getModel("SFactors");

			if (!this._participantInfoView) {
				this._participantInfoView = sap.ui.xmlfragment("cba.hr.sdvCalibracaoSF.view.fragment.ParticipantInfo", this);
				this._participantInfoView.setModel(oModel);
				this.getView().addDependent(this._participantInfoView);
			}

			if (this._participantInfoView) {
				this.dialogBusyStart(4);
				this.setParticipantInfoHeader(aParticipante, oModel);
				this.setParticipantInfoExpectativa(sId, oModel);
				this.setParticipantInfoComentario(sId, oModel);
				this.setParticipantInfoMetas(sId, oModel);
				this._participantId = sId;
			}

		},

		/***************************************************************************
			dialogBusyStart
	    ****************************************************************************/
		dialogBusyStart: function (nCounter) {
			this._participantInfoView.setBusy(true);
			this._dialogBusyCounter = nCounter;
		},

		/***************************************************************************
			dialogBusyEnd
	    ****************************************************************************/
		dialogBusyEnd: function (bOpen) {
			this._dialogBusyCounter--;
			if (!this._dialogBusyCounter) {
				this._participantInfoView.setBusy(false);
				sap.ui.core.BusyIndicator.hide();
				if (bOpen) {
					this._participantInfoView.open();
				}
			}
		},

		/***************************************************************************
			setParticipantInfoHeader
	    ****************************************************************************/
		setParticipantInfoHeader: function (aParticipante, oModel) {

			var oHeaderImage = sap.ui.getCore().byId("participantInfoHeaderImage");
			var oHeaderNome = sap.ui.getCore().byId("participantInfoHeaderNome");
			var oHeaderCargo = sap.ui.getCore().byId("participantInfoHeaderCargo");
			var oHeaderIdade = sap.ui.getCore().byId("participantInfoHeaderIdade");
			var oHeaderTempoServico = sap.ui.getCore().byId("participantInfoHeaderTempoServico");

			oHeaderNome.setText(aParticipante.defaultFullName);
			oHeaderCargo.setText(aParticipante.jobCode);

			aParticipante.age = aParticipante.age + " " + this.getI18nText("ParticipantInfoYears");
			oHeaderIdade.setText(aParticipante.age);

			if (aParticipante.jobYears > 1) {
				aParticipante.jobYears = aParticipante.jobYears + " " + this.getI18nText("ParticipantInfoYears");
			} else {
				aParticipante.jobYears = aParticipante.jobYears + " " + this.getI18nText("ParticipantInfoYear");
			}

			oHeaderTempoServico.setText(aParticipante.jobYears);

			this.setParticipantPicture(aParticipante.userId, oHeaderImage, oModel);

		},

		/***************************************************************************
			setParticipantInfoPicture
	    ****************************************************************************/
		setParticipantPicture: function (sId, oHeaderImage, oModel) {
			var that = this;

			oModel.read("/Photo(photoType=1,userId='" + sId + "')", {
				success: function (oData) {
					var sImage = "data:" + oData.mimeType + ";base64," + oData.photo;
					oHeaderImage.setSrc(sImage);
					oHeaderImage.setWidth("100px");
					that.dialogBusyEnd(true);
				},
				error: function () {
					that.dialogBusyEnd(true);
				}
			});

		},

		/***************************************************************************
			setParticipantInfoExpectativa
	    ****************************************************************************/
		setParticipantInfoExpectativa: function (sId, oModel) {

			var that = this;
			var oExpectativa = sap.ui.getCore().byId("participantInfoExpectativa");

			oModel.read("/BackgroundFutureAspirations('" + sId + "')", {
				success: function (oData) {
					try {
						var sExpectativa = oData.description;
					} catch (e) {
						sExpectativa = that.getI18nText("ParticipantInfoTextNotFound");
					}

					oExpectativa.setText(sExpectativa);
					that.dialogBusyEnd(true);
				},
				error: function () {
					oExpectativa.setText(that.getI18nText("ParticipantInfoTextNotFound"));
					that.dialogBusyEnd(true);
				}
			});

		},

		/***************************************************************************
			setParticipantInfoComentario
	    ****************************************************************************/
		setParticipantInfoComentario: function (sId, oModel) {

			var that = this;
			var oComentario = sap.ui.getCore().byId("participantInfoComentario");

			oModel.read("/BackgroundComments('" + sId + "')", {
				success: function (oData) {

					try {
						var sComentario = oData.results_relevants;
					} catch (e) {
						sComentario = that.getI18nText("ParticipantInfoTextNotFound");
					}

					sComentario = sComentario ? sComentario : that.getI18nText("ParticipantInfoTextNotFound");

					oComentario.setText(sComentario);
					that.dialogBusyEnd(true);
				},
				error: function () {
					oComentario.setText(that.getI18nText("ParticipantInfoTextNotFound"));
					that.dialogBusyEnd(true);
				}
			});

		},

		/***************************************************************************
			setParticipantInfoMetas
	    ****************************************************************************/
		setParticipantInfoMetas: function (sId, oModel) {

			var that = this;
			var oMetas = sap.ui.getCore().byId("participantInfoMetas");
			var aFilters = [];

			aFilters.push(new sap.ui.model.Filter("userId", "EQ", sId));

			oModel.read("/BackgroundGoalsHistory", {
				filters: aFilters,
				success: function (oData) {

					var sMetas = "";

					try {
						var aMetas = oData.results;

						for (var i = 0; i < aMetas.length; i++) {

							if (i > 0) {
								sMetas += "\n\n";
							}

							sMetas += aMetas[i].ano;
							sMetas += " - " + aMetas[i].meta + "\n";
							sMetas += "Atingimento (pontuação): " + aMetas[i].achievement;
							sMetas += "\nMeta individual: " + aMetas[i].goal;
						}
					} catch (e) {
						sMetas = that.getI18nText("ParticipantInfoTextNotFound");
					}

					sMetas = sMetas ? sMetas : that.getI18nText("ParticipantInfoTextNotFound");

					oMetas.setText(sMetas);
					that.dialogBusyEnd(true);
				},
				error: function () {
					oMetas.setText(that.getI18nText("ParticipantInfoTextNotFound"));
					that.dialogBusyEnd(true);
				}
			});

		},

		/***************************************************************************
			addParticipant
	    ****************************************************************************/
		addParticipant: function (sId, aPosition, aParticipantes, isPos) {
			var that = this;
			var oParticipante = $("#" + this.createUniqueId(sId));
			var aParticipante;
			var position;

			try {

				position = aPosition.shift();
				this.setParticipantPosition(oParticipante, position);

			} catch (e) {

				var calibrationItems = this._calibrationRoomParticipants.getItems();

				for (i = 0; i < calibrationItems.length; i++) {

					var item = calibrationItems[i];
					if (item.getId() === this.createUniqueId(sId)) {
						this._calibrationRoomParticipants.removeItem(i);
						this._calibrationRoomParticipantsPending.addItem(item);
						oParticipante = $("#" + this.createUniqueId(sId));
						oParticipante.css("position", "relative");
						oParticipante.css("color", "#000");
					}
				}
			} finally {

				oParticipante.css("visibility", "visible");

				if (isPos) {
					oParticipante.css("color", "#4CC417"); //verde
				}

				oParticipante.draggable({
					drag: function (e, ui) {
						$(this).css("z-index", 5);
						if (!that._originalPosition) {
							that._originalPosition = ui.position;
						}
					}
				});
			}

			for (var i = 0; i < aParticipantes.length; i++) {

				aParticipante = aParticipantes[i];

				if (aParticipante.userId === sId) {

					oParticipante.on("click", function () {
						that.showParticipantInfo(sId, aParticipante);
					});

					break;
				}
			}
		},

		/***************************************************************************
			setParticipantPosition
	    ****************************************************************************/
		setParticipantPosition: function (oParticipante, position) {
			oParticipante.css("left", position.left);
			oParticipante.css("top", position.top);
		},

		/***************************************************************************
			getAvaliablePosition
	    ****************************************************************************/
		getAvaliablePosition: function () {

			var aPosition = {
				EMBAB: this.getEmbAbPositions(525, 150),
				EMBDE: this.getEmbDePositions(220, 400),
				EMBAC: this.getEmbAcPositions(525, 930),
				TEMAB: this.getTemAbPositions(525, 265),
				TEMDE: this.getTemDePositions(320, 470),
				TEMAC: this.getTemAcPositions(525, 810),
				SEMAB: this.getSemAlPositions(525, 410),
				SEMDE: this.getSemAlPositions(495, 540),
				SEMAC: this.getSemAlPositions(525, 660)
			};

			return aPosition;
		},

		/***************************************************************************
			getEmbAbPositions
		****************************************************************************/
		getEmbAbPositions: function (nTop, nLeft) {
			var aPositions = [];

			for (var i = 1; i <= 6; i++) {
				aPositions.push({
					top: nTop -= 12,
					left: nLeft += 1
				});
			}

			for (var i = 7; i <= 20; i++) {
				aPositions.push({
					top: nTop -= 12,
					left: nLeft += 5
				});
			}

			for (i = 21; i <= 27; i++) {
				aPositions.push({
					top: nTop -= 12,
					left: nLeft += 9
				});
			}

			for (var i = 28; i <= 30; i++) {
				aPositions.push({
					top: nTop = 12,
					left: nLeft
				});
			}

			return aPositions;
		},

		/***************************************************************************
			getTemAbPositions
		****************************************************************************/
		getTemAbPositions: function (nTop, nLeft) {
			var aPositions = [];

			for (var i = 1; i <= 8; i++) {
				aPositions.push({
					top: nTop -= 12,
					left: nLeft += 1
				});
			}

			for (var i = 9; i <= 22; i++) {
				aPositions.push({
					top: nTop -= 12,
					left: nLeft += 6
				});
			}

			return aPositions;
		},

		/***************************************************************************
			getEmbDePositions
		****************************************************************************/
		getEmbDePositions: function (nTop, nLeft) {
			var aPositions = [];

			var nTopOri = nTop;

			for (var i = 1; i <= 8; i++) {
				aPositions.push({
					top: nTop -= 12,
					left: nLeft -= 5
				});
			}

			nLeft += 170;
			nTop = nTopOri - 30;

			for (i = 9; i <= 17; i++) {
				aPositions.push({
					top: nTop -= 12,
					left: nLeft
				});
			}

			nLeft += 150;
			nTop = nTopOri;

			for (var i = 18; i <= 25; i++) {
				aPositions.push({
					top: nTop -= 12,
					left: nLeft += 5
				});
			}

			return aPositions;
		},

		/***************************************************************************
			getTemDePositions
		****************************************************************************/
		getTemDePositions: function (nTop, nLeft) {
			var aPositions = [];

			var nTopOri = nTop;
			var nLeftOri = nLeft;

			for (var i = 1; i <= 8; i++) {
				aPositions.push({
					top: nTop -= 12,
					left: nLeft -= 5
				});
			}

			nTop = nTopOri;
			nLeft = nLeftOri + 150;

			for (var i = 9; i <= 16; i++) {
				aPositions.push({
					top: nTop -= 12,
					left: nLeft += 5
				});
			}

			nTop = nTopOri - 70;
			nLeft = nLeftOri + 75;

			for (var i = 17; i <= 21; i++) {
				aPositions.push({
					top: nTop -= 12,
					left: nLeft
				});
			}

			return aPositions;
		},

		/***************************************************************************
			getEmbAcPositions
		****************************************************************************/
		getEmbAcPositions: function (nTop, nLeft) {
			var aPositions = [];

			for (var i = 1; i <= 6; i++) {
				aPositions.push({
					top: nTop -= 12,
					left: nLeft -= 1
				});
			}

			for (var i = 7; i <= 20; i++) {
				aPositions.push({
					top: nTop -= 12,
					left: nLeft -= 5
				});
			}

			for (i = 21; i <= 27; i++) {
				aPositions.push({
					top: nTop -= 12,
					left: nLeft -= 9
				});
			}

			for (var i = 28; i <= 30; i++) {
				aPositions.push({
					top: nTop -= 12,
					left: nLeft
				});
			}

			return aPositions;
		},

		/***************************************************************************
			getTemAcPositions
		****************************************************************************/
		getTemAcPositions: function (nTop, nLeft) {
			var aPositions = [];

			for (var i = 1; i <= 8; i++) {
				aPositions.push({
					top: nTop -= 12,
					left: nLeft -= 1
				});
			}

			for (var i = 9; i <= 22; i++) {
				aPositions.push({
					top: nTop -= 12,
					left: nLeft -= 6
				});
			}

			return aPositions;
		},

		/***************************************************************************
			getSemAlPositions
		****************************************************************************/
		getSemAlPositions: function (nTop, nLeft) {
			var aPositions = [];

			for (var i = 1; i <= 13; i++) {
				aPositions.push({
					top: nTop -= 12,
					left: nLeft
				});
			}

			return aPositions;
		},

		/***************************************************************************
			createUniqueId
		****************************************************************************/
		createUniqueId: function (id) {
			return "SAP" + this._uniqueId + id;
		},

		/***************************************************************************
			getUniqueId
		****************************************************************************/
		getUniqueId: function (id) {
			return id.replace("SAP" + this._uniqueId, "").trim();
		},
		/***************************************************************************
			backHome
		****************************************************************************/
		backHome: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("TargetCalibrationSessions");
		},

		/***************************************************************************
			onCloseParticipantInfo
		****************************************************************************/
		onCloseParticipantInfo: function () {
			if (this._participantInfoView) {
				this._participantInfoView.close();
				this._participantInfoView.destroy();
				this._participantInfoView = undefined;
				this._participantId = undefined;
			}
		}

	});

});