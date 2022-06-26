sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "../model/formatter",
    "sap/m/MessageToast",
    "./OrderManager"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,UIComponent,History,formatter,MessageToast,OrderManager) {
        "use strict";

        return Controller.extend("zapp.fiorishop.controller.BaseController", {
            formatter: formatter,

            onInit: function () {
            },

            onComprar: function(oEvent){
                var that = this;
                var om         = new OrderManager(this);
                var oSource    = oEvent.getSource();
                var sProductID = oSource.data("ProductID");
                var oItem = {
                    "OrderID": 0,
                    "ItemID": 0,
                    "ProductID": sProductID,
                    "ProductName": "Teste",
                    "ItemUnitary": 4439.90,
                    "Quantity": 1,
                    "ItemTotal": 4439.90
                };

                // carregando produto
                om.loadProduct(sProductID,function(oProd){
                    if(oProd == null){
                        MessageToast.show("Erro ao carregar produto "+sProductID);
                        return;
                    }

                    oItem.ProductName = oProd.Name;
                    oItem.ItemUnitary = oProd.Price;

                    om.addItemToOrder(oItem,function(oResponse){
                        if(oResponse.statusCode == 201 || oResponse.statusCode == 204){
                            MessageToast.show("Item inserido / atualizado");
    
                            om.loadOrder(function(oOrder){
                                om.updateModels(oOrder);
                                
                                if(oOrder == null){
                                    MessageToast.show("Erro em carregar carrinho");
                                }
                            });
                        }else{
                            MessageToast.show("Erro ao inserir/atualizar item ["+oResponse.statusCode+"]: "+oResponse.message);
                        }
                    });
                });
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
