"use strict";

/*!
 * SiGC - GestiÃ³n de Compras
 * (c) Copyright 2022 Innova Internacional S.A.S.
 */
sap.ui.define(['com/innova/sigc/model/constant', 'com/innova/sigc/service/http', 'com/innova/sigc/utils/isEmpty', 'sap/ui/core/format/DateFormat'],
/**
 * @class
 * @name Questions.js
 * @description - Handler of the questions for the process controller
 *
 * @returns {object}
 *
 * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
 * @version 1.0.0
 */
function (constant, http, isEmpty, DateFormat) {
  return {
    /* =========================================================== */

    /* begin: event handlers                                       */

    /* =========================================================== */

    /**
     * @function
     * @name onPostQuestion
     * @description - Evento que se lanza para responder una pregunta.
     *
     * @public
     * @returns {void} - Noting to return.
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    onPostQuestion: function onPostQuestion(oEvent) {
      var dataQuestion = oEvent.getSource().getBindingContext('processModel').getObject();
      var answer = oEvent.getParameter('value');
      Promise.resolve(this._oPage.setBusy(true)).then(this._createAnswerRequest.bind(this, answer)).then(http.post.bind(http, "".concat(constant.api.PROCESS_PATH, "/").concat(dataQuestion.processId, "/").concat(constant.api.ANSWER_QUESTION_PATH, "/").concat(dataQuestion.idQuestion, "/answer"))).then(this._fetchQuestions.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /**
     * @function
     * @name onChangeQuestionTypeButton
     * @description - Handler of change question type
     *
     * @public
     * @returns {void} - Noting to return.
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    onChangeQuestionTypeButton: function onChangeQuestionTypeButton(oEvent) {
      var oButton = oEvent.getSource();
      oButton.getDependents()[0].openBy(oButton);
    },

    /**
     * @function
     * @name onChangeQuestion
     * @description - Handler of change question
     *
     * @public
     * @returns {void} - Noting to return.
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    onChangeQuestion: function onChangeQuestion(source, type) {
      var data = source.getBindingContext('processModel').getObject();
      Promise.resolve(this._oPage.setBusy(true)).then(http.post.bind(http, "".concat(constant.api.PROCESS_PATH, "/").concat(data.processId, "/").concat(constant.api.ANSWER_QUESTION_PATH, "/").concat(data.idQuestion, "/").concat(constant.api.CHANGE_QUESTION_TYPE_PATH), {
        classQuest: type
      })).then(this._fetchQuestions.bind(this)).catch(this.errorHandler.bind(this)).finally(this._oPage.setBusy.bind(this._oPage, false));
    },

    /* =========================================================== */

    /* finish: event handlers                                      */

    /* =========================================================== */

    /* =========================================================== */

    /* begin: internal methods                                     *
    /* =========================================================== */

    /**
     * @function
     * @name _fetchQuestions
     * @description - Fetches the questions for the process
     *
     * @private
     * @returns {Promise}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _fetchQuestions: function _fetchQuestions() {
      var _this = this;

      return http.get("process/".concat(this._numProc, "/").concat(constant.api.ANSWER_QUESTION_PATH)).then(function (_ref) {
        var data = _ref.data;

        var ernamProcess = _this._oFormModel.getProperty('/ernam');

        var currentUser = _this.getModel('main').getProperty('/sysParams/UNAME');

        var question = _this._buildQuestions({
          processQaAn: data,
          canAnswer: ernamProcess === currentUser
        });

        _this._oFormModel.setProperty('/questions', question);

        _this._oFormModel.setProperty('/processQaAn', data);

        _this.byId('Tree').collapseAll();
      });
    },

    /**
     * @function
     * @name _buildQuestions
     * @description - Build the questions for the process.
     *
     * @private
     * @param {object} context
     * @param {string} context.ernam - Ernam of the user.
     * @param {object[]} context.processQaAn - Process questions and answers
     * @param {boolean} context.canAnswer - Can answer questions.
     * @returns {object[]}
     *
     * @author Edwin Valencia <evalencia@innovainternacional.biz>
     * @version 1.0.0
     */
    _buildQuestions: function _buildQuestions(_ref2) {
      var processQaAn = _ref2.processQaAn,
          canAnswer = _ref2.canAnswer;
      return processQaAn.map(function (element) {
        var question = {
          classQuest: element.classQuest,
          dateQuest: element.dateQuest,
          ernam: element.vendor.name1,
          icon: 'sap-icon://sys-help',
          idQuestion: element.id,
          processId: element.processId,
          question: element.question,
          visibleAnswer: false,
          visibleQuestion: true,
          nodes: []
        };

        if (!isEmpty(element.answer)) {
          question.nodes = [{
            dateQuest: element.dateAns,
            ernam: element.user,
            hourQuest: element.hourAns,
            icon: 'sap-icon://trend-down',
            question: element.answer,
            visibleAnswer: false,
            visibleQuestion: true
          }];
        } else if (element.classQuest === 'C' && canAnswer) {
          question.nodes = [{
            idQuestion: element.id,
            processId: element.processId,
            vendorId: element.vendorId,
            visibleAnswer: true,
            visibleQuestion: false
          }];
        }

        return question;
      });
    },

    /**
     * @function
     * @name _createAnswerRequest
     * @description - Genera el request para responder la pregunta
     *
     * @public
     * @returns {object}
     *
     * @author Heinner Mayorga <hmayorga@innovainternacional.biz>
     * @version 1.0.0
     */
    _createAnswerRequest: function _createAnswerRequest(answer) {
      var oFormat = DateFormat.getDateInstance({
        pattern: 'yyyy-MM-ddTkk:mm:ss'
      });
      var oDate = new Date();
      var sDate = oFormat.format(oDate);
      return {
        dateAns: sDate,
        hourAns: sDate,
        answer: answer
      };
    }
    /* =========================================================== */

    /* finish: internal methods                                    *
    /* =========================================================== */

  };
});