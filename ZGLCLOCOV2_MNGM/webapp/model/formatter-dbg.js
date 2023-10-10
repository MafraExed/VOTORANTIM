sap.ui.define(function () {
  "use strict";

  return {
    getEndPlanText: function (dias, aposDataBase) {
      let dayText = "dias";
      if (dias === "1") dayText = "dia";

      if (aposDataBase) return `${dias} ${dayText} após a data base`;
      else return `${dias} ${dayText} antes da data base`;
    },

    getEndPlanText2: function (dias) {
      let dayText = "dias";
      if (dias === "1") dayText = "dia";

      if (dias.indexOf("-") === -1) return `${dias} ${dayText} após a data base`;
      else return `${dias} ${dayText} antes da data base`;
    },

    currencyValue: function (sValue) {
      if (!sValue) {
        return "";
      }

      return parseFloat(sValue).toFixed(2);
    },

    convertDateToText: function (sValue) {
      try {
        var month = sValue.getMonth() + 1;
        if (month < 10) month = "0" + month.toString();
        else month = month.toString();
        return moment(sValue.getFullYear().toString() + month + sValue.getDate().toString(), "YYYYMMDD").fromNow();
      } catch (error) {
        return "Data inválida";
      }
    },

    getStatusText: function (status) {
      if (status === "") return "Não Liberado";
      if (status === "X") return "Liberado";
      if (status === "A") return "Ativo";
      if (status === "F") return "Concluído";
    },

    getStatusState: function (status) {
      if (status === "") return "Error";
      if (status === "X") return "Warning";
      if (status === "A") return "Information";
      if (status === "F") return "Success";
    },

    getStatusIcon: function (status) {
      if (status === "") return "Error";
      if (status === "X") return "Warning";
      if (status === "A") return "Information";
      if (status === "F") return "Success";
    },

    convertFromSapDate: function (sapDate) {
      if (sapDate)
        return sapDate.substring(6, 8) + "/" + sapDate.substring(4, 6) + "/" + sapDate.substring(0, 4);
    },

    getNotificationText: function (notification) {
      if (notification === "M") return "E-Mail";
      if (notification === "T") return "Mensagem Teams";
      if (notification === "MT") return "E-Mail + Mensagem Teams";
    },

    formatProgress: function (progressValue) {
      return `${progressValue.toFixed(2)}%`
    },

    getStatusTaskText: function (status) {
      if (status === "1") return "Enviado para Aprovação";
      if (status === "R") return "Em Processamento";
      if (status === "0") return "Concluído sem erros";
      if (status === "") return "Não Iniciado";
    },

    getStatusTaskState: function (status) {
      if (status === "R") return "Warning";
      if (status === "1") return "Information";
      if (status === "0") return "Success";
    },

    getClosingType: function (closingType) {
      if (closingType === "M") return "Encerramento do Mês";
      if (closingType === "Q") return "Encerramento Trimestral";
      if (closingType === "Y") return "Encerramento de Exercício";
      if (closingType === "S") return "Encerramento Especial";
    },

    getShortDate: function (date) {
      return date.toLocaleString();
    },

    formatSuggestStatus: function (status) {
      if (status) return "Replicação de alterações possível"
      else return "Não é possível replicar as alterações - Estrutura de Tarefas diferente"
    }

  };
});
