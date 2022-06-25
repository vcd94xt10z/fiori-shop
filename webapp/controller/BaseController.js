sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "../model/formatter",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,UIComponent,History,formatter) {
        "use strict";

        return Controller.extend("zapp.fiorishop.controller.BaseController", {
            formatter: formatter,

            onInit: function () {
            },

            onLogout: function(){
                window.sessionStorage.setItem("customer",null);
                window.sessionStorage.removeItem("customer");
                window.location.reload(true);
            },

            getCustomerSession: function(){
                var sCustomer = window.sessionStorage.getItem("customer");
                if(sCustomer == null){
                    return null;
                }

                return JSON.parse(sCustomer);
            },

            onGoToHome: function(){
                var oRouter = this.getRouter();
                oRouter.navTo("RouteHome");
            },

            onGoToLoginForm: function(){
                var oRouter = this.getRouter();
                oRouter.navTo("RouteLoginForm");
            },

            onGoToRegisterForm: function(){
                var oRouter = this.getRouter();
                oRouter.navTo("RouteRegisterForm");
            },

            onGoToCart: function(oEvent){
                var oRouter = this.getRouter();
                oRouter.navTo("RouteCart");
            },

            onGoToProduct: function(oEvent){
                var oSource = oEvent.getSource();
                var sRewrite = oSource.data("rewrite");
                var oRouter = this.getRouter();
                oRouter.navTo("RouteProductDetail",{
                    rewrite: sRewrite
                });
            },

            onPageBack: function(){
                var oHistory      = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
    
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    UIComponent.getRouterFor(this).navTo("RouteHome");
                }
            },

            getRouter: function(){
                var oRouter = UIComponent.getRouterFor(this);
                return oRouter;
            }
        });
    });
