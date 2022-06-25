sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "../model/formatter",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,UIComponent,History,formatter,MessageToast) {
        "use strict";

        return Controller.extend("zapp.fiorishop.controller.BaseController", {
            formatter: formatter,

            onInit: function () {
            },

            onComprar: function(oEvent){
                var that = this;
                var oSource = oEvent.getSource();
                var sProductID = oSource.data("ProductID");
                var oItem = {
                    "OrderID": 0,
                    "ProductID": sProductID,
                    "ProductName": "Teste",
                    "ItemUnitary": 4439.90,
                    "Quantity": 1,
                    "ItemTotal": 4439.90
                };
                
                this.loadOrder(function(oOrder){
                    console.log(oOrder);
                    //oOrder.itemList

                    // verificar se não esta duplicado

                    // add item
                    oItem.OrderID = oOrder.OrderID;
                    that.insertItem(oItem,function(sStatusCode){
                        if(sStatusCode == 201){
                            MessageToast.show("Item inserido");
                        }else{
                            MessageToast.show("Erro ao inserir item");
                        }
                    });
                });
            },

            insertItem: function(oItem,callback){
                var oModel = this.getOwnerComponent().getModel();
                oModel.create("/itemSet",oItem,{
                    success: function(oData,oResponse){
                        callback(oResponse.statusCode);
                    },
                    error: function(oError){
                        callback(oError.statusCode);
                    }
                });
            },

            /**
             * Carrega uma ordem (cabeçalho, itens etc)
             */
            loadOrder: function(callback){
                var that = this;

                this.loadOrderHeader(function(oOrder){
                    that.loadOrderItems(oOrder.OrderID,function(oData){
                        oOrder.itemList = oData;
                        callback(oOrder);
                    });
                });
            },

            loadOrderItems: function(sOrderID, callback){
                var oModel = this.getOwnerComponent().getModel();
                var aFilter = [];
                var sPath = "/itemSet";

                var oFilter = new sap.ui.model.Filter({
                    path: 'OrderID',
                    operator: 'EQ',
                    value1: sOrderID
                });
                aFilter.push(oFilter);

                oModel.read(sPath,{
                    filters: aFilter,
                    success: function(oData,oResponse){
                        if(oResponse.statusCode == 200){
                            callback(oData.results);
                        }else{
                            callback([]);
                        }
                    },
                    error: function(oError){
                        if(oError.statusCode == 404){
                            callback([]);
                        }else{
                            callback([]);
                        }
                    }
                });
            },

            loadOrderHeader: function(callback){
                var oModel = this.getOwnerComponent().getModel();
                var sOrderID = window.sessionStorage.getItem("OrderID");
                var sPath = "";
                var oOrder = null;
                var that = this;

                // template de ordem
                oOrder = {
                    "CustomerID": 0,
                    "CreateDate": new Date(),
                    "DeliveryZipcode": "86031000",
                    "ItemTotal": 0,
                    "FreightTotal": 0,
                    "OrderTotal": 0,
                    "Status": "New"
                };
                if(sOrderID == null){
                    this._createNewOrder(oOrder,callback);
                }else{
                    sPath = "/orderSet("+sOrderID+")";
                    oModel.read(sPath,{
                        success: function(oData,oResponse){
                            if(oResponse.statusCode == 404){
                                that._createNewOrder(oOrder,callback);
                            }else{
                                callback(oData);
                            }
                        },
                        error: function(oError){
                            if(oError.statusCode == 404){
                                that._createNewOrder(oOrder,callback);
                            }else{
                                callback(null);
                            }
                        }
                    });
                }
            },

            _createNewOrder: function(oOrder,callback){
                var oModel = this.getOwnerComponent().getModel();
                oModel.create("/orderSet",oOrder,{
                    success: function(oData,oResponse){
                        window.sessionStorage.setItem("OrderID",oData.OrderID);
                        callback(oData);
                    },
                    error: function(oError){
                        callback(null);
                    }
                });
            },

            _updateOrder: function(oOrder,callback){
                var oModel = this.getOwnerComponent().getModel();
                oModel.update("/orderSet",oOrder,{
                    success: function(oData,oResponse){
                        callback(oResponse.statusCode);
                    },
                    error: function(oError){
                        callback(oError.statusCode);
                    }
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
