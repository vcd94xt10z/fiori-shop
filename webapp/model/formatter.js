sap.ui.define([
	"sap/ui/core/format/NumberFormat"
], function (NumberFormat) {
	"use strict";

	var formatter = {
		/**
		 * Formats the price
		 * @param {string} sValue model price value
		 * @return {string} formatted price
		 */
		price: function (sValue) {
			var numberFormat = NumberFormat.getFloatInstance({
				maxFractionDigits: 2,
				minFractionDigits: 2,
				groupingEnabled: true,
				groupingSeparator: ".",
				decimalSeparator: ","
			});
			return numberFormat.format(sValue);
		},

		/**
		 * Converte o nome do produto em um rewrite
		 * @param String sName 
		 * @source https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
		 * @returns 
		 */
		rewrite: function (sName) {
			// removendo os acentos
			var strAccents = sName.split('');
			var strAccentsOut = new Array();
			var strAccentsLen = strAccents.length;
			var accents =    "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
			var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
			for (var y = 0; y < strAccentsLen; y++) {
				if (accents.indexOf(strAccents[y]) != -1) {
					strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
				} else
					strAccentsOut[y] = strAccents[y];
			}
			sName = strAccentsOut.join('');

			sName = sName.toLowerCase().replace(/[^a-zA-Z0-9\-]/g,"-");

			return sName;
		},

		randInt: function(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},

		randFloat: function(min, max, decimals) {
			const str = (Math.random() * (max - min) + min).toFixed(decimals);
		  
			return parseFloat(str);
		}
	};

	return formatter;
});