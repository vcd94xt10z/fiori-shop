sap.ui.define([
    "./BaseController",
    "./OrderManager",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,OrderManager,MessageToast) {
        "use strict";

        return BaseController.extend("zapp.fiorishop.controller.Checkout", {
            onInit: function () {
            }
        });
    });
