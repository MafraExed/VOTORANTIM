// formatter.js

sap.ui.define([], function () {
  "use strict";

  return {

    // formatter method contains the formatting logic
    // parameter iInteger gets passed from the view ...
    // ... that uses the formatter
    formatTime: function (time) {

      if (!time) return;

      var newTime = time.substring(0, 2) + ":" + time.substring(2, 4);
      return newTime;
    },

    formatTimeSeconds: function (time) {

      if (!time) return;

      var newTime = time.substring(0, 2) + ":" + time.substring(2, 4) + ":" + time.substring(4, 6);
      return newTime;
    },

    formatDate: function (date) {

      if (!date) return;

      var newDate = date.substring(6, 8) + "-" + date.substring(4, 6) + "-" + date.substring(0, 4);
      return newDate;
    },

    formatProgress: function (progressValue) {
      return `${progressValue.toFixed(2)}%`
    },

    formatHasApproval: function (hasApproval) {
      if (hasApproval) return "Sim"
      else return "Não"
    },

    getStatusText: function (status) {
      if (status === "1") return "Enviado para Aprovação";
      if (status === "R") return "Em Processamento";
      if (status === "0") return "Concluído sem erros";
    },

    getStatusTaskState: function (status) {
      if (status === "R") return "Warning";
      if (status === "1") return "Information";
      if (status === "0") return "Success";
    },

  };

});