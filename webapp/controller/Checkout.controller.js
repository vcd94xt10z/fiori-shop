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
                var oRouter = this.getRouter();
                oRouter.attachRouteMatched(this.onDisplay,this);
            },

            onDisplay: function(){
                var oCustomer = this.getCustomerSession();
                if(oCustomer == null){
                    window.sessionStorage.setItem("route_after_login","RouteCheckout");
                    this.getRouter().navTo("RouteLoginForm");
                }
            }
        });
    });
