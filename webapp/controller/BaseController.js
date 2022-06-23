sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,UIComponent,History) {
        "use strict";

        return Controller.extend("zapp.fiorishop.controller.BaseController", {
            onInit: function () {
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
