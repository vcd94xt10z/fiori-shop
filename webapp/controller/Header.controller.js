sap.ui.define([
    "./BaseController"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController) {
        "use strict";

        return BaseController.extend("zapp.fiorishop.controller.Header", {
            onInit: function () {
                var oRouter = this.getRouter();
                oRouter.attachRouteMatched(this.onDisplay,this);
            },

            onDisplay: function(){
                var oCustomer = this.getCustomerSession();
                if(oCustomer != null){
                    var oElement = this.byId("guest-name");
                    if(oElement){
                        oElement.setText("Olá "+oCustomer.Name);
                        this.byId("link-login").setVisible(false);
                        this.byId("link-logout").setVisible(true);
                    }
                }
            }
        });
    });
